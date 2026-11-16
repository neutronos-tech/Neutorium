'use strict';

// The free business audit. It fetches the visitor's own website, runs a fixed list of checks
// that anyone can verify, turns the result into a score out of 100, and asks Gemini for a short
// plain-language summary. No Strapi imports, so the local dev server can load it too.
//
// It only ever reads public pages, and refuses addresses that point inside a private network.

const dns = require('node:dns').promises;
const net = require('node:net');

const MAX_BYTES = 700 * 1024;
const TIMEOUT = 9000;
const AGENT = 'NeutoriumAudit/1.0 (+https://neutorium.com/free-audit)';
const MODELS = (process.env.GEMINI_MODEL || 'gemini-flash-lite-latest,gemini-flash-latest,gemini-3.5-flash-lite').split(',').map((m) => m.trim()).filter(Boolean);

const clip = (v, max) => String(v == null ? '' : v).replace(/\s+/g, ' ').trim().slice(0, max);

function isPrivate(ip) {
  if (net.isIPv4(ip)) {
    const [a, b] = ip.split('.').map(Number);
    return a === 10 || a === 127 || a === 0 || (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168) || (a === 169 && b === 254) || (a === 100 && b >= 64 && b <= 127) || a >= 224;
  }
  const v = ip.toLowerCase();
  return v === '::1' || v === '::' || v.startsWith('fc') || v.startsWith('fd') || v.startsWith('fe80') || v.startsWith('::ffff:');
}

// A public http(s) address, or null.
async function publicUrl(input) {
  let raw = clip(input, 300);
  if (!raw) return null;
  if (!/^https?:\/\//i.test(raw)) raw = 'https://' + raw;
  let url;
  try { url = new URL(raw); } catch { return null; }
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) return null;
  if (url.port && !['80', '443'].includes(url.port)) return null;
  const host = url.hostname.replace(/^\[|\]$/g, '');
  if (!host.includes('.') || /\.(local|internal|localhost|test)$/i.test(host)) return null;
  try {
    const addrs = net.isIP(host) ? [{ address: host }] : await dns.lookup(host, { all: true });
    if (!addrs.length || addrs.some((a) => isPrivate(a.address))) return null;
  } catch { return null; }
  return url;
}

// Fetch a page, following at most three redirects and checking each hop is still public.
async function get(start, maxBytes = MAX_BYTES) {
  let url = start;
  const began = Date.now();
  for (let hop = 0; hop < 4; hop++) {
    const res = await fetch(url, { redirect: 'manual', headers: { 'User-Agent': AGENT, Accept: 'text/html,*/*' }, signal: AbortSignal.timeout(TIMEOUT) });
    if (res.status >= 300 && res.status < 400 && res.headers.get('location')) {
      url = await publicUrl(new URL(res.headers.get('location'), url).href);
      if (!url) throw new Error('redirect');
      continue;
    }
    const reader = res.body?.getReader();
    const chunks = [];
    let size = 0;
    while (reader) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.length;
      chunks.push(value);
      if (size > maxBytes) { await reader.cancel(); break; }
    }
    return { ok: res.ok, status: res.status, url, html: Buffer.concat(chunks).toString('utf8'), ms: Date.now() - began, bytes: size };
  }
  throw new Error('redirect');
}

const exists = async (url) => {
  try { const r = await get(url, 300 * 1024); return r.ok && r.html.length > 20 ? r : null; } catch { return null; }
};

// Each check: [id, what it is called, points, passed?, what we found].
function checks(page, robots, sitemap, extra) {
  const h = page.html;
  const all = h + (extra || ''); // the home page plus the contact and about pages
  const tag = (re) => (h.match(re) || [])[1];
  const title = clip(tag(/<title[^>]*>([\s\S]*?)<\/title>/i), 200);
  const desc = clip(tag(/<meta[^>]+name=["']description["'][^>]*content=["']([^"']*)["']/i) || tag(/<meta[^>]+content=["']([^"']*)["'][^>]*name=["']description["']/i), 400);
  const h1s = (h.match(/<h1[\s>]/gi) || []).length;
  const imgs = h.match(/<img\b[^>]*>/gi) || [];
  const noAlt = imgs.filter((i) => !/\balt=["'][^"']+["']/i.test(i)).length;
  const contact = /href=["'](tel:|mailto:|https?:\/\/(wa\.me|api\.whatsapp\.com))/i.test(all) || /<form\b/i.test(all);
  const social = /href=["']https?:\/\/(www\.)?(facebook|instagram|linkedin|youtube|tiktok|x|twitter)\.com/i.test(all);
  const kb = Math.round(page.bytes / 1024);
  return [
    ['https', 'Secure connection (HTTPS)', 10, page.url.protocol === 'https:', page.url.protocol === 'https:' ? 'The site loads over HTTPS.' : 'The site does not load over HTTPS.'],
    ['title', 'A clear page title', 10, title.length >= 15 && title.length <= 70, title ? `"${title}" (${title.length} characters)` : 'No page title found.'],
    ['description', 'A description for search results', 10, desc.length >= 60 && desc.length <= 170, desc ? `${desc.length} characters.` : 'No meta description found.'],
    ['mobile', 'Set up for phones', 10, /<meta[^>]+name=["']viewport["']/i.test(h), /<meta[^>]+name=["']viewport["']/i.test(h) ? 'A mobile viewport is set.' : 'No mobile viewport setting found.'],
    ['h1', 'One main heading', 8, h1s === 1, `${h1s} main heading${h1s === 1 ? '' : 's'} (h1) on the page.`],
    ['contact', 'An easy way to get in touch', 12, contact, contact ? 'A phone, email, WhatsApp link or form is on the site.' : 'No phone, email, WhatsApp link or form found on the pages we read.'],
    ['speed', 'Answers quickly', 10, page.ms < 2500, `The server answered in ${(page.ms / 1000).toFixed(1)} seconds.`],
    ['weight', 'A light first page', 6, kb < 400, `The page's HTML is about ${kb} KB.`],
    ['share', 'A preview when shared', 6, /<meta[^>]+property=["']og:image["']/i.test(h), /<meta[^>]+property=["']og:image["']/i.test(h) ? 'A share image is set.' : 'No share image (og:image) found.'],
    ['schema', 'Structured data for search and AI answers', 6, /application\/ld\+json/i.test(h), /application\/ld\+json/i.test(h) ? 'Structured data is present.' : 'No structured data found.'],
    ['alt', 'Images described for search and screen readers', 4, imgs.length === 0 || noAlt / imgs.length < 0.3, imgs.length ? `${noAlt} of ${imgs.length} images have no description.` : 'No images in the page HTML.'],
    ['social', 'Linked to your social profiles', 3, social, social ? 'Social profile links are on the site.' : 'No social profile links found on the pages we read.'],
    ['sitemap', 'A sitemap for search engines', 3, !!sitemap, sitemap ? 'sitemap.xml exists.' : 'No sitemap.xml found.'],
    ['robots', 'Open to search engines', 2, !/<meta[^>]+name=["']robots["'][^>]*noindex/i.test(h) && !(robots && /^\s*disallow:\s*\/\s*$/im.test(robots.html)), /noindex/i.test(tag(/<meta[^>]+name=["']robots["'][^>]*content=["']([^"']*)["']/i) || '') ? 'The page asks search engines not to index it.' : 'Nothing blocks search engines.'],
  ].map(([id, label, points, pass, found]) => ({ id, label, points, pass: !!pass, found }));
}

const visibleText = (html) => clip(html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<[^>]+>/gi, ' ').replace(/&[a-z#0-9]+;/gi, ' '), 1800);

async function summarise(business, site, score, list, text) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return null;
  const prompt = `You are writing the result of a free, automated first look at a business's website for Neutorium, a research-led studio.
Write for a business owner, not a developer: plain words, no jargon, no markdown. Be specific to what was found. Do not invent
facts, numbers or problems that are not in the data below. Do not promise results.

Business: ${business || 'not given'}
Website: ${site}
Score: ${score} out of 100
Checks (passed or failed, with what was found):
${list.map((c) => `- ${c.pass ? 'PASSED' : 'FAILED'}: ${c.label}. ${c.found}`).join('\n')}
Text found on the page: ${text || 'none'}

Answer as JSON only: {"summary": "<two sentences on the overall condition>", "strengths": ["<up to three things done well>"], "gaps": ["<up to three specific gaps, most important first, each with why it costs them customers>"]}`;
  for (const model of MODELS) {
    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
        method: 'POST',
        headers: { 'x-goog-api-key': key, 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ role: 'user', parts: [{ text: prompt }] }], generationConfig: { responseMimeType: 'application/json', temperature: 0.4, maxOutputTokens: 900 } }),
        signal: AbortSignal.timeout(12000),
      });
      if (!res.ok) continue;
      const raw = ((await res.json()).candidates?.[0]?.content?.parts || []).map((p) => p.text || '').join('');
      const data = JSON.parse(raw.slice(raw.indexOf('{'), raw.lastIndexOf('}') + 1));
      const arr = (v) => (Array.isArray(v) ? v.map((x) => clip(x, 260)).filter(Boolean).slice(0, 3) : []);
      if (data.summary) return { summary: clip(data.summary, 500), strengths: arr(data.strengths), gaps: arr(data.gaps) };
    } catch { /* try the next model */ }
  }
  return null;
}

// Returns { ok: true, site, score, grade, checks, summary, strengths, gaps } or { ok: false, reason }.
async function run({ website, business }) {
  const url = await publicUrl(website);
  if (!url) return { ok: false, reason: 'bad-url' };
  let page;
  try { page = await get(url); } catch { return { ok: false, reason: 'unreachable' }; }
  if (!page.ok || page.html.length < 200) return { ok: false, reason: 'unreachable' };

  const [robots, sitemap] = await Promise.all([exists(new URL('/robots.txt', page.url)), exists(new URL('/sitemap.xml', page.url))]);
  // Also read up to two inner pages where contact details usually live.
  const inner = [...new Set((page.html.match(/href=["'][^"'#]+["']/gi) || [])
    .map((m) => { try { return new URL(m.slice(6, -1), page.url); } catch { return null; } })
    .filter((u) => u && u.hostname === page.url.hostname && /contact|about|reach|get-in-touch/i.test(u.pathname))
    .map((u) => u.origin + u.pathname))].slice(0, 2);
  const more = (await Promise.all(inner.map(async (href) => { const u = await publicUrl(href); return u ? exists(u) : null; }))).filter(Boolean);
  const list = checks(page, robots, sitemap, more.map((m) => m.html).join('\n'));
  const total = list.reduce((s, c) => s + c.points, 0);
  const score = Math.round((list.filter((c) => c.pass).reduce((s, c) => s + c.points, 0) / total) * 100);
  const grade = score >= 85 ? 'Strong' : score >= 65 ? 'Decent, with gaps' : score >= 40 ? 'Losing customers' : 'Needs urgent work';

  const ai = await summarise(clip(business, 120), page.url.hostname, score, list, visibleText(page.html));
  const failed = list.filter((c) => !c.pass).sort((a, b) => b.points - a.points);
  const passed = list.filter((c) => c.pass).sort((a, b) => b.points - a.points);
  return {
    ok: true,
    site: page.url.hostname,
    pages: 1 + more.length,
    score,
    grade,
    checks: list.map(({ id, label, pass, found }) => ({ id, label, pass, found })),
    summary: ai?.summary || `Your website scored ${score} out of 100 on our first look. ${failed.length ? 'The biggest gaps are listed below.' : 'The basics are in place.'}`,
    strengths: ai?.strengths?.length ? ai.strengths : passed.slice(0, 3).map((c) => c.label + '. ' + c.found),
    gaps: ai?.gaps?.length ? ai.gaps : failed.slice(0, 3).map((c) => c.label + '. ' + c.found),
    written: ai ? 'ai' : 'rules',
  };
}

module.exports = { run };
