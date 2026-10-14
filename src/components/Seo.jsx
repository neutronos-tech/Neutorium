import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useContent } from "../lib/content";
import { pageMeta } from "../lib/seo";
import { BRAND, SITE_URL } from "../data/site";

const NOT_FOUND = {
  title: `Page not found · ${BRAND}`,
  description: "The page you are looking for has moved or does not exist.",
  canonical: null,
  noindex: true,
  jsonLd: null,
  url: SITE_URL,
};

function setMeta(attr, key, value) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (value == null) return el?.remove();
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", value);
}

// Keeps <head> in sync with the current route. The same tags are written into the static
// HTML at build time (scripts/prerender.mjs), so crawlers see them without running JS.
export default function Seo() {
  const { pathname } = useLocation();
  const content = useContent();

  useEffect(() => {
    const m = pageMeta(pathname, content) || NOT_FOUND;
    document.title = m.title;
    setMeta("name", "description", m.description);
    setMeta("name", "robots", m.noindex ? "noindex, follow" : "index, follow, max-snippet:-1, max-image-preview:large");
    setMeta("property", "og:title", m.title);
    setMeta("property", "og:description", m.description);
    setMeta("property", "og:url", m.url);
    setMeta("property", "og:type", m.type === "article" ? "article" : "website");

    let link = document.head.querySelector('link[rel="canonical"]');
    if (m.canonical) {
      if (!link) {
        link = document.createElement("link");
        link.rel = "canonical";
        document.head.appendChild(link);
      }
      link.href = m.canonical;
    } else link?.remove();

    let ld = document.getElementById("ld-json");
    if (m.jsonLd) {
      if (!ld) {
        ld = document.createElement("script");
        ld.type = "application/ld+json";
        ld.id = "ld-json";
        document.head.appendChild(ld);
      }
      ld.textContent = JSON.stringify(m.jsonLd);
    } else ld?.remove();
  }, [pathname, content]);

  return null;
}
