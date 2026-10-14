const { factories } = require('@strapi/strapi');

// Fields the public project builder may set. Stage, owner and internal notes stay staff-only.
// (Strapi 5 reserves the name "status" for draft/published, hence "stage".)
const PUBLIC_FIELDS = [
  'name', 'email', 'phone', 'role', 'contactPref', 'company', 'industry', 'location', 'website',
  'route', 'package', 'services', 'goals', 'timeline', 'notes', 'brief',
];
const MAX_TEXT = 5000;
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map(); // ip -> timestamps (in memory; resets on restart, enough to stop floods)

const clean = (v) => {
  if (Array.isArray(v)) return v.slice(0, 30).map((x) => String(x).slice(0, 200));
  if (v == null) return null;
  return String(v).slice(0, MAX_TEXT);
};

module.exports = factories.createCoreController('api::enquiry.enquiry', ({ strapi }) => ({
  async create(ctx) {
    const input = ctx.request.body?.data || {};

    // Honeypot: real visitors never fill the hidden "website2" field.
    if (input.website2) return ctx.send({ ok: true });

    const ip = ctx.request.ip;
    const now = Date.now();
    const recent = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
    if (recent.length >= MAX_PER_WINDOW) return ctx.tooManyRequests('Too many submissions. Please try again later.');
    hits.set(ip, [...recent, now]);

    const data = { stage: 'new', source: 'website' };
    for (const key of PUBLIC_FIELDS) if (input[key] !== undefined) data[key] = clean(input[key]);

    if (!data.name || !data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      return ctx.badRequest('Name and a valid email are required.');
    }

    await strapi.documents('api::enquiry.enquiry').create({ data });
    // Do not echo stored data back to an anonymous caller.
    return ctx.send({ ok: true }, 201);
  },
}));
