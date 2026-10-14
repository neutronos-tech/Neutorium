// Runs after `vite build`. For every route it writes dist/<route>/index.html with the right
// <head> (title, description, canonical, Open Graph, JSON-LD) and the page's key content as
// plain HTML, then generates sitemap.xml, robots.txt, llms.txt and llms-full.txt.
//
// Content comes from the Strapi CMS when CMS_URL (or VITE_CMS_URL) is set at build time,
// otherwise from src/data. A CMS outage never fails the build; it falls back to src/data.

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import { STATIC, loadCmsContent } from "../src/lib/cms.js";
import { pageMeta, allRoutes, headHtml, bodyHtml } from "../src/lib/seo.js";
import { SITE_URL, BRAND, DESCRIPTION, SEATS_PER_INDUSTRY } from "../src/data/site.js";
import { CATEGORIES } from "../src/data/services.js";
import { PACKAGES, PHASES } from "../src/data/packages.js";

const dist = path.resolve("dist");
const cmsUrl = (process.env.CMS_URL || process.env.VITE_CMS_URL || "").replace(/\/$/, "");

let content = STATIC;
if (cmsUrl) {
  try {
    content = await loadCmsContent(cmsUrl);
    console.log(`prerender: content from ${cmsUrl} (${content.services.length} services, ${content.articles.length} articles)`);
  } catch (e) {
    console.warn(`prerender: CMS unavailable (${e.message}); using src/data`);
  }
}

const template = readFileSync(path.join(dist, "index.html"), "utf8")
  .replace(/<title>[\s\S]*?<\/title>\s*/, "")
  .replace(/<meta name="description"[^>]*>\s*/, "");

if (!template.includes('<div id="root"></div>')) throw new Error("prerender: #root not found in dist/index.html");

const render = (route, meta) =>
  template
    .replace("</head>", `    ${headHtml(meta)}\n  </head>`)
    .replace('<div id="root"></div>', `<div id="root">${bodyHtml(route, meta, content)}</div>`);

const routes = allRoutes(content);
for (const route of routes) {
  const meta = pageMeta(route, content);
  const file = route === "/" ? path.join(dist, "index.html") : path.join(dist, route.slice(1), "index.html");
  mkdirSync(path.dirname(file), { recursive: true });
  writeFileSync(file, render(route, meta));
}

// Unknown URLs: the server can return this with a 404 status.
writeFileSync(
  path.join(dist, "404.html"),
  render("/404", {
    title: `Page not found · ${BRAND}`,
    description: "The page you are looking for has moved or does not exist.",
    h1: "This page has moved on.",
    canonical: SITE_URL + "/",
    url: SITE_URL + "/",
    noindex: true,
    jsonLd: { "@context": "https://schema.org", "@type": "WebPage", name: "Page not found" },
  })
);

// sitemap.xml - indexable routes only.
const today = new Date().toISOString().slice(0, 10);
const lastmod = (route) => {
  const a = route.startsWith("/insights/") && content.articles.find((x) => `/insights/${x.slug}` === route);
  return (a?.updated || a?.date || today).slice(0, 10);
};
const indexable = routes.filter((r) => !pageMeta(r, content).noindex);
writeFileSync(
  path.join(dist, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${indexable
    .map((r) => `  <url><loc>${SITE_URL}${r === "/" ? "/" : r}</loc><lastmod>${lastmod(r)}</lastmod></url>`)
    .join("\n")}\n</urlset>\n`
);

// robots.txt - search and answer-engine crawlers are welcome; the builder is not indexed.
const aiBots = ["GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "Claude-SearchBot", "Claude-User", "PerplexityBot", "Perplexity-User", "Google-Extended", "Applebot-Extended", "Bingbot", "CCBot"];
writeFileSync(
  path.join(dist, "robots.txt"),
  [
    "User-agent: *",
    "Allow: /",
    "Disallow: /start",
    "",
    ...aiBots.flatMap((b) => [`User-agent: ${b}`, "Allow: /", ""]),
    `Sitemap: ${SITE_URL}/sitemap.xml`,
    "",
  ].join("\n")
);

// llms.txt (llmstxt.org) - a short, curated map of the site for language models.
const link = (title, route, desc) => `- [${title}](${SITE_URL}${route})${desc ? `: ${desc}` : ""}`;
const llms = [
  `# ${BRAND}`,
  "",
  `> ${DESCRIPTION}`,
  "",
  `${BRAND} works with up to ${SEATS_PER_INDUSTRY} partner companies per industry. Industries currently open: ${content.industries.map((i) => `${i.name} (${i.filled} of ${SEATS_PER_INDUSTRY} seats filled)`).join(", ")}.`,
  "The core engagement is a 90-day Digital Authority & Client Acquisition System with a delivery guarantee on every contracted asset. Fees are discussed on a call and are not published.",
  "",
  "## Pages",
  link("About", "/about", "who we are and the principles we work by"),
  link("Research", "/research", "how every engagement starts, and the free Digital Presence Snapshot"),
  link("Partnership", "/partnership", "packages, the 90-day plan, guarantee and FAQs"),
  link("Services", "/services", "every service, available alone or as a package"),
  link("Start a project", "/start", "project builder; we reply within two working days"),
  "",
  "## Services",
  ...content.services.map((s) => link(s.name, `/services/${s.slug}`, s.summary)),
  ...(content.articles.length ? ["", "## Insights", ...content.articles.map((a) => link(a.title, `/insights/${a.slug}`, a.answer))] : []),
  "",
  "## Optional",
  link("Full text for language models", "/llms-full.txt"),
  "",
].join("\n");
writeFileSync(path.join(dist, "llms.txt"), llms);

// llms-full.txt - the same facts in full, so a model can answer without crawling every page.
const qa = (items) => items.map(([q, a]) => `### ${q}\n\n${a}\n`).join("\n");
const full = [
  `# ${BRAND}`,
  "",
  `> ${DESCRIPTION}`,
  "",
  `Website: ${SITE_URL}`,
  `Email: ${content.email}`,
  "",
  "## Frequently asked questions",
  "",
  qa(content.faqs.general),
  "## Partnership packages",
  "",
  ...PACKAGES.map((p) => `### ${p.name} (${p.tag}, ${p.term})\n\n${p.desc}\n\n${p.items.map((i) => `- ${i}`).join("\n")}\n`),
  "## How a partnership runs",
  "",
  ...PHASES.map((p) => `### ${p.when}: ${p.name}\n\nGate: ${p.gate}.\n\n${p.items.map((i) => `- ${i}`).join("\n")}\n`),
  qa(content.faqs.partnership),
  "## Services",
  "",
  ...CATEGORIES.flatMap((c) => [
    `### ${c.name}`,
    "",
    ...content.services
      .filter((s) => s.category === c.id)
      .map((s) => `#### ${s.name}\n\nURL: ${SITE_URL}/services/${s.slug}\n\n${s.intro}\n\nIncludes: ${s.includes.join(", ")}.\nTimeline: ${s.timeline}.\n`),
  ]),
  qa(content.faqs.services),
  ...content.articles.map((a) => `## ${a.title}\n\nURL: ${SITE_URL}/insights/${a.slug}\n\n${a.question ? `**${a.question}** ` : ""}${a.answer}\n\n${a.body}\n`),
].join("\n");
writeFileSync(path.join(dist, "llms-full.txt"), full);

console.log(`prerender: ${routes.length} pages, sitemap (${indexable.length} URLs), robots.txt, llms.txt, llms-full.txt`);
