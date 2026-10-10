// Single place to edit business facts shown across the site.

export const BRAND = "Neutorium";

// TODO: confirm the exact business inbox before going live.
export const EMAIL = "info@theneutorium.com";

// Optional: set VITE_FORM_ENDPOINT (e.g. a Formspree or Vercel function URL) to receive
// project briefs as JSON. Without it, the wizard opens a pre-filled email instead.
export const FORM_ENDPOINT = import.meta.env.VITE_FORM_ENDPOINT || "";

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

