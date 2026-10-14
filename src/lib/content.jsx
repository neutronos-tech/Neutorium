import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { CMS_URL } from "../data/site";
import { STATIC, loadCmsContent } from "./cms";

// Site content comes from the Strapi CMS when VITE_CMS_URL is set, otherwise from src/data.
// The static data renders first and is replaced once the CMS answers, so a slow or offline
// CMS never blanks the page.

const Ctx = createContext(null);

export function ContentProvider({ children }) {
  const [content, setContent] = useState(STATIC);

  useEffect(() => {
    if (!CMS_URL) return;
    let live = true;
    loadCmsContent()
      .then((c) => live && setContent(c))
      .catch((e) => console.warn("Using built-in content;", e.message));
    return () => { live = false; };
  }, []);

  const value = useMemo(
    () => ({
      ...content,
      serviceBySlug: (slug) => content.services.find((s) => s.slug === slug),
      servicesIn: (category) => content.services.filter((s) => s.category === category),
      articleBySlug: (slug) => content.articles.find((a) => a.slug === slug),
    }),
    [content]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useContent = () => useContext(Ctx);
