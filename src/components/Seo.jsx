import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useContent } from "../lib/content";
import { pageMeta, metaTags } from "../lib/seo";
import { BRAND, SITE_URL } from "../data/site";

const NOT_FOUND = {
  title: `Page not found · ${BRAND}`,
  description: "The page you are looking for has moved or does not exist.",
  canonical: null,
  noindex: true,
  jsonLd: null,
  url: SITE_URL,
};

// Keeps <head> in sync with the current route. The same tags are written into the static
// HTML at build time (scripts/prerender.mjs), so crawlers see them without running JS.
export default function Seo() {
  const { pathname } = useLocation();
  const content = useContent();

  useEffect(() => {
    const m = pageMeta(pathname, content) || NOT_FOUND;
    document.title = m.title;
    // Drop tags that belonged to the previous page (e.g. article dates), then apply this page's.
    document.head.querySelectorAll("meta[data-seo]").forEach((el) => el.remove());
    for (const [attr, key, value] of metaTags(m)) {
      document.head.querySelector(`meta[${attr}="${key}"]`)?.remove();
      const el = document.createElement("meta");
      el.setAttribute(attr, key);
      el.setAttribute("content", value);
      el.setAttribute("data-seo", "");
      document.head.appendChild(el);
    }

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
