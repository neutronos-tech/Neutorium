import { CMS_URL, EMAIL, INDUSTRIES, SOCIALS } from "../data/site.js";
import { SERVICES } from "../data/services.js";
import { FAQS } from "../data/faqs.js";

// Plain JS (no JSX) so the build-time prerender script can use it from Node.
// `base` defaults to VITE_CMS_URL in the browser; the build passes CMS_URL explicitly.

export const STATIC = { services: SERVICES, industries: INDUSTRIES, faqs: FAQS, email: EMAIL, socials: SOCIALS, articles: [], source: "static" };

export async function cmsGet(path, base = CMS_URL) {
  const res = await fetch(`${base}/api/${path}`, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(`CMS ${res.status} for ${path}`);
  return res.json();
}

export async function cmsPost(path, data) {
  const res = await fetch(`${CMS_URL}/api/${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ data }),
  });
  if (!res.ok) throw new Error(`CMS ${res.status} for ${path}`);
  return res.json();
}

const list = (r) => (Array.isArray(r?.data) ? r.data : []);
const arr = (v) => (Array.isArray(v) ? v : []);

export const fromCmsService = (s) => ({
  slug: s.slug,
  name: s.name,
  category: s.category,
  summary: s.summary || "",
  intro: s.intro || "",
  includes: arr(s.includes),
  outcomes: arr(s.outcomes),
  timeline: s.timeline || "",
  pkg: arr(s.packages),
  faqs: arr(s.faqs).map((f) => [f.question, f.answer]),
  seo: s.seo || null,
});

export const fromCmsArticle = (a) => ({
  slug: a.slug,
  title: a.title,
  question: a.question || "",
  answer: a.answer || "",
  body: a.body || "",
  author: a.author || "Neutorium",
  date: a.publishedAt || a.updatedAt,
  updated: a.updatedAt,
  faqs: arr(a.faqs).map((f) => [f.question, f.answer]),
  seo: a.seo || null,
});

// Shared by the browser and the build-time prerender script.
export async function loadCmsContent(base = CMS_URL) {
  const [services, industries, faqs, settings, articles] = await Promise.all([
    cmsGet("services?sort=order:asc&populate=*&pagination[pageSize]=100", base),
    cmsGet("industries?sort=order:asc&pagination[pageSize]=100", base),
    cmsGet("faqs?sort=order:asc&pagination[pageSize]=200", base),
    cmsGet("site-setting?populate=*", base).catch(() => null),
    cmsGet("articles?sort=publishedAt:desc&populate=*&pagination[pageSize]=100", base),
  ]);

  const groupedFaqs = { ...FAQS };
  for (const page of Object.keys(FAQS)) {
    const fromCms = list(faqs).filter((f) => f.page === page).map((f) => [f.question, f.answer]);
    if (fromCms.length) groupedFaqs[page] = fromCms;
  }
  const s = settings?.data;
  const cmsServices = list(services).map(fromCmsService);
  const cmsIndustries = list(industries).map((i) => ({ slug: i.slug, name: i.name, status: i.availability, filled: i.filled ?? 0 }));

  return {
    services: cmsServices.length ? cmsServices : SERVICES,
    industries: cmsIndustries.length ? cmsIndustries : INDUSTRIES,
    faqs: groupedFaqs,
    email: s?.email || EMAIL,
    socials: Array.isArray(s?.socials) && s.socials.length ? s.socials.map((x) => [x.label, x.url]) : SOCIALS,
    articles: list(articles).map(fromCmsArticle),
    source: "cms",
  };
}

