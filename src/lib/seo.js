import { BRAND, SITE_URL, DESCRIPTION, SEATS_PER_INDUSTRY } from "../data/site.js";
import { CATEGORIES } from "../data/services.js";
import { PACKAGES, PHASES } from "../data/packages.js";

// One source of truth for search and answer-engine metadata. Used by <Seo> in the browser
// and by scripts/prerender.mjs to write a crawlable HTML file for every route.

const ORG_ID = `${SITE_URL}/#organization`;
const SITE_ID = `${SITE_URL}/#website`;
const OG_IMAGE = `${SITE_URL}/brand/og.png`;

const STATIC_PAGES = {
  "/": {
    title: "Neutorium · Digital Authority & Client Acquisition Studio",
    description: DESCRIPTION,
    h1: "We research what's next. Then we build it with you.",
    faqKey: "general",
  },
  "/about": {
    title: "About Neutorium · A Research-Led Digital Studio",
    description: "Neutorium builds the digital presence and systems that let great companies be found, trusted and chosen online, working with fifteen partners per industry.",
    h1: "A studio for companies whose work deserves more.",
    crumb: "About",
  },
  "/research": {
    title: "Research · Market Intelligence, Competitor Scans and Baselines · Neutorium",
    description: "Every Neutorium engagement starts with research: market intelligence, a scan of five competitors, positioning, an ideal-customer profile and honest baseline metrics.",
    h1: "We research before we build.",
    crumb: "Research",
  },
  "/partnership": {
    title: "Partnership Packages · Foundation, Growth and Embedded · Neutorium",
    description: "A 90-day Digital Authority & Client Acquisition System: research, website, premium films and an inquiry system, with a delivery guarantee on every contracted asset.",
    h1: "A partnership, not a project. Ninety days to prove it.",
    crumb: "Partnership",
    faqKey: "partnership",
  },
  "/services": {
    title: "Services · Web Design, Development, UX/UI, Film, SEO and AEO · Neutorium",
    description: "Hire a single service or build your own package: market research, brand identity, web design and development, product and UX/UI design, premium reels, SEO, AEO and AI agents.",
    h1: "Everything the system needs.",
    crumb: "Services",
    faqKey: "services",
  },
  "/insights": {
    title: "Insights · Answers on Websites, Video, SEO and AEO · Neutorium",
    description: "Short, direct answers from the Neutorium team on digital presence, client acquisition, SEO and answer engine optimisation.",
    h1: "Insights.",
    crumb: "Insights",
  },
  "/start": {
    title: "Start a Project · Neutorium",
    description: "Choose a partnership package or build your own set of services. Neutorium replies within two working days.",
    h1: "Start a project",
    crumb: "Start a project",
  },
};

const esc = (s = "") =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const clip = (s = "", n = 160) => (s.length > n ? s.slice(0, n - 1).replace(/\s+\S*$/, "") + "…" : s);

const organization = (content) => ({
  "@type": ["Organization", "ProfessionalService"],
  "@id": ORG_ID,
  name: BRAND,
  url: SITE_URL,
  logo: `${SITE_URL}/brand/wordmark.png`,
  image: `${SITE_URL}/brand/wordmark.png`,
  description: DESCRIPTION,
  email: content.email,
  contactPoint: { "@type": "ContactPoint", contactType: "sales", email: content.email, availableLanguage: ["English"], url: `${SITE_URL}/start` },
  slogan: "We research what's next. Then we build it with you.",
  sameAs: content.socials.map(([, url]) => url).filter((u) => /^https?:\/\//.test(u)),
  knowsAbout: ["Web design", "Website development", "UX/UI design", "Product design", "Market research", "Video production", "Search engine optimization", "Answer engine optimization", "AI agents"],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Neutorium services",
    itemListElement: content.services.map((s) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name: s.name, url: `${SITE_URL}/services/${s.slug}` },
    })),
  },
});

const faqPage = (items, url) =>
  items?.length
    ? {
        "@type": "FAQPage",
        "@id": `${url}#faq`,
        mainEntity: items.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
      }
    : null;

const breadcrumbs = (trail) => ({
  "@type": "BreadcrumbList",
  itemListElement: trail.map(([name, path], i) => ({ "@type": "ListItem", position: i + 1, name, item: SITE_URL + path })),
});

// Returns everything the <head> needs for `path`, or null for unknown routes.
export function pageMeta(path, content) {
  const clean = path.replace(/\/+$/, "") || "/";
  const url = SITE_URL + (clean === "/" ? "/" : clean);
  const graph = [organization(content)];
  let meta;

  if (STATIC_PAGES[clean]) {
    const p = STATIC_PAGES[clean];
    meta = { title: p.title, description: p.description, h1: p.h1, faqs: p.faqKey ? content.faqs[p.faqKey] : null };
    if (clean === "/") {
      graph.push({ "@type": "WebSite", "@id": SITE_ID, url: SITE_URL, name: BRAND, description: DESCRIPTION, inLanguage: "en", publisher: { "@id": ORG_ID } });
    } else {
      graph.push(breadcrumbs([["Home", "/"], [p.crumb, clean]]));
    }
  } else if (clean.startsWith("/services/")) {
    const s = content.services.find((x) => x.slug === clean.split("/")[2]);
    if (!s) return null;
    const cat = CATEGORIES.find((c) => c.id === s.category);
    meta = {
      title: s.seo?.metaTitle || `${s.name} · ${cat?.name || "Services"} · Neutorium`,
      description: s.seo?.metaDescription || clip(`${s.summary} ${s.intro}`),
      h1: s.name,
      service: s,
      faqs: s.faqs,
    };
    graph.push(
      {
        "@type": "Service",
        "@id": `${url}#service`,
        name: s.name,
        serviceType: s.name,
        category: cat?.name,
        description: s.intro || s.summary,
        provider: { "@id": ORG_ID },
        url,
      },
      breadcrumbs([["Home", "/"], ["Services", "/services"], [s.name, clean]])
    );
  } else if (clean.startsWith("/insights/")) {
    const a = content.articles.find((x) => x.slug === clean.split("/")[2]);
    if (!a) return null;
    meta = {
      title: a.seo?.metaTitle || `${a.title} · Neutorium`,
      description: a.seo?.metaDescription || clip(a.answer || a.title),
      h1: a.title,
      article: a,
      faqs: a.faqs,
      type: "article",
    };
    graph.push(
      {
        "@type": "Article",
        "@id": `${url}#article`,
        headline: a.title,
        description: a.answer,
        datePublished: a.date,
        dateModified: a.updated || a.date,
        author: { "@type": a.author === BRAND ? "Organization" : "Person", name: a.author },
        publisher: { "@id": ORG_ID },
        mainEntityOfPage: url,
        ...(a.question && a.answer
          ? { mainEntity: { "@type": "Question", name: a.question, acceptedAnswer: { "@type": "Answer", text: a.answer } } }
          : {}),
      },
      breadcrumbs([["Home", "/"], ["Insights", "/insights"], [a.title, clean]])
    );
  } else {
    return null;
  }

  const fp = faqPage(meta.faqs, url);
  if (fp) graph.push(fp);

  // Every page is a WebPage that belongs to the site and is about the organisation.
  const crumb = graph.find((n) => n["@type"] === "BreadcrumbList");
  graph.push({
    "@type": meta.type === "article" ? "WebPage" : clean === "/services" ? "CollectionPage" : clean === "/about" ? "AboutPage" : "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: meta.title,
    description: meta.description,
    inLanguage: "en",
    isPartOf: { "@id": SITE_ID },
    about: { "@id": ORG_ID },
    primaryImageOfPage: { "@type": "ImageObject", url: OG_IMAGE, width: 1200, height: 630 },
    ...(crumb ? { breadcrumb: crumb } : {}),
    ...(fp ? { mainEntity: { "@id": fp["@id"] } } : {}),
  });
  if (clean === "/services") {
    graph.push({
      "@type": "ItemList",
      name: "Neutorium services",
      itemListElement: content.services.map((sv, i) => ({ "@type": "ListItem", position: i + 1, name: sv.name, url: `${SITE_URL}/services/${sv.slug}` })),
    });
  }
  if (clean !== "/") graph.push({ "@type": "WebSite", "@id": SITE_ID, url: SITE_URL, name: BRAND });

  return {
    ...meta,
    url,
    canonical: url,
    noindex: clean === "/start",
    jsonLd: { "@context": "https://schema.org", "@graph": graph },
  };
}

export function allRoutes(content) {
  return [
    ...Object.keys(STATIC_PAGES),
    ...content.services.map((s) => `/services/${s.slug}`),
    ...content.articles.map((a) => `/insights/${a.slug}`),
  ];
}

// Meta tags for a page as [attribute, key, value]. Shared by the prerender script (HTML
// string) and <Seo> (DOM), so the static HTML and the live page always match.
export function metaTags(m, verify = {}) {
  const ogType = m.type === "article" ? "article" : "website";
  return [
    ["name", "description", m.description],
    ["name", "robots", m.noindex ? "noindex, follow" : "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"],
    ["name", "author", BRAND],
    ["property", "og:type", ogType],
    ["property", "og:site_name", BRAND],
    ["property", "og:locale", "en_US"],
    ["property", "og:title", m.title],
    ["property", "og:description", m.description],
    ["property", "og:url", m.url],
    ["property", "og:image", OG_IMAGE],
    ["property", "og:image:width", "1200"],
    ["property", "og:image:height", "630"],
    ["property", "og:image:alt", `${BRAND} logo`],
    ...(m.article ? [["property", "article:published_time", m.article.date], ["property", "article:modified_time", m.article.updated || m.article.date]] : []),
    ["name", "twitter:card", "summary_large_image"],
    ["name", "twitter:title", m.title],
    ["name", "twitter:description", m.description],
    ["name", "twitter:image", OG_IMAGE],
    ...(verify.google ? [["name", "google-site-verification", verify.google]] : []),
    ...(verify.bing ? [["name", "msvalidate.01", verify.bing]] : []),
  ].filter(([, , v]) => v);
}

// <head> as an HTML string for the prerendered files.
export function headHtml(m, verify) {
  return [
    `<title>${esc(m.title)}</title>`,
    ...(m.canonical ? [`<link rel="canonical" href="${esc(m.canonical)}" />`] : []),
    ...metaTags(m, verify).map(([attr, key, value]) => `<meta ${attr}="${key}" content="${esc(value)}" />`),
    `<script type="application/ld+json" id="ld-json">${JSON.stringify(m.jsonLd).replace(/</g, "\\u003c")}</script>`,
  ].join("\n    ");
}

// Plain, semantic HTML of the page's key facts, placed inside #root at build time so crawlers
// and answer engines that do not run JavaScript still read real content. React replaces it.
export function bodyHtml(path, m, content) {
  const nav = `<nav><a href="/">Home</a> <a href="/about">About</a> <a href="/research">Research</a> <a href="/partnership">Partnership</a> <a href="/services">Services</a> <a href="/insights">Insights</a> <a href="/start">Start a project</a></nav>`;
  const parts = [`<h1>${esc(m.h1)}</h1>`, `<p>${esc(m.description)}</p>`];
  const ul = (items) => `<ul>${items.map((i) => `<li>${i}</li>`).join("")}</ul>`;

  if (path === "/" || path === "/partnership") {
    parts.push(
      `<h2>Fifteen partners per industry</h2>`,
      ul(content.industries.map((i) => `${esc(i.name)}: ${i.filled} of ${SEATS_PER_INDUSTRY} partner seats filled`))
    );
  }
  if (path === "/partnership") {
    parts.push(`<h2>Partnership packages</h2>`);
    for (const p of PACKAGES) parts.push(`<h3>${esc(p.name)} (${esc(p.tag)}, ${esc(p.term)})</h3><p>${esc(p.desc)}</p>${ul(p.items.map(esc))}`);
    parts.push(`<h2>How a partnership runs</h2>`);
    for (const ph of PHASES) parts.push(`<h3>${esc(ph.when)}: ${esc(ph.name)}</h3><p>Gate: ${esc(ph.gate)}.</p>${ul(ph.items.map(esc))}`);
  }
  if (path === "/services" || path === "/") {
    parts.push(`<h2>Services</h2>`);
    for (const c of CATEGORIES) {
      const list = content.services.filter((s) => s.category === c.id);
      parts.push(`<h3>${esc(c.name)}</h3>${ul(list.map((s) => `<a href="/services/${s.slug}">${esc(s.name)}</a>: ${esc(s.summary)}`))}`);
    }
  }
  if (m.service) {
    const s = m.service;
    parts.push(`<p>${esc(s.intro)}</p>`, `<h2>What is included</h2>${ul(s.includes.map(esc))}`, `<h2>What you get</h2>${ul(s.outcomes.map(esc))}`, `<p>Timeline: ${esc(s.timeline)}.</p>`);
  }
  if (path === "/insights") {
    parts.push(ul(content.articles.map((a) => `<a href="/insights/${a.slug}">${esc(a.title)}</a>: ${esc(a.answer)}`)));
  }
  if (m.article) {
    const a = m.article;
    if (a.question) parts.push(`<h2>${esc(a.question)}</h2>`);
    if (a.answer) parts.push(`<p><strong>${esc(a.answer)}</strong></p>`);
    parts.push(`<div>${esc(a.body).replace(/\n{2,}/g, "</p><p>")}</div>`);
  }
  if (m.faqs?.length) {
    parts.push(`<h2>Questions</h2>`, ...m.faqs.map(([q, a]) => `<h3>${esc(q)}</h3><p>${esc(a)}</p>`));
  }
  return `<div class="prerender">${nav}<main>${parts.join("")}</main><footer><p>${BRAND} · <a href="mailto:${esc(content.email)}">${esc(content.email)}</a></p></footer></div>`;
}
