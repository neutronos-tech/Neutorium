// Single place to edit business facts shown across the site.

export const BRAND = "Neutorium";
export const SITE_URL = "https://neutorium.com";
export const DESCRIPTION =
  "Neutorium is a research-led digital studio. We partner with fifteen companies per industry and build the website, premium films and inquiry system that turn their work into clients.";

// TODO: confirm the exact business inbox before going live.
export const EMAIL = "info@neutorium.com";

// import.meta.env only exists inside Vite; build scripts import this file from plain Node.
const env = import.meta.env || {};

// Strapi CMS (see /cms). When unset, the site uses the content in src/data.
export const CMS_URL = (env.VITE_CMS_URL || "").replace(/\/$/, "");

// Optional fallback form endpoint (e.g. Formspree) used when no CMS is configured.
// Without either, the project builder opens a pre-filled email instead.
export const FORM_ENDPOINT = env.VITE_FORM_ENDPOINT || "";

export const SOCIALS = [
  ["Instagram", "#"],
  ["Facebook", "#"],
  ["YouTube", "#"],
  ["LinkedIn", "#"],
];

export const SEATS_PER_INDUSTRY = 15;

// Seat counts must always be real. Update `filled` whenever a partner signs or leaves.
// Add an entry here when a new industry opens. status: "open" or "waitlist" (all seats filled).
export const INDUSTRIES = [
  { slug: "interior-design", name: "Interior design", status: "open", filled: 0 },
];

