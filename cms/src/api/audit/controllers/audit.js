'use strict';

const { run } = require('../services/audit');

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map(); // ip -> timestamps (in memory; resets on restart, enough to stop floods)
const clip = (v, max) => String(v == null ? '' : v).replace(/\s+/g, ' ').trim().slice(0, max);

module.exports = {
  // POST /api/audit/run  { website, business, social, maps, name, phone, email }
  // Runs the audit and stores the visitor as an enquiry (source "audit") so the team can follow up.
  async run(ctx) {
    const body = ctx.request.body || {};
    if (body.website2) return ctx.send({ ok: true }); // honeypot

    const name = clip(body.name, 120);
    const phone = clip(body.phone, 40);
    const email = clip(body.email, 160);
    if (!name || phone.replace(/\D/g, '').length < 8 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return ctx.badRequest('Your name, a WhatsApp number and a valid email are required.');
    }

    const ip = ctx.request.ip;
    const now = Date.now();
    const recent = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
    if (recent.length >= MAX_PER_WINDOW) return ctx.tooManyRequests('Too many audits from here. Please try again in a few minutes.');
    hits.set(ip, [...recent, now]);

    const out = await run({ website: body.website, business: body.business });

    try {
      await strapi.documents('api::enquiry.enquiry').create({
        data: {
          stage: 'new',
          source: 'audit',
          name,
          phone,
          email,
          contactPref: 'WhatsApp',
          company: clip(body.business, 160),
          website: clip(body.website, 300),
          notes: [
            out.ok ? `Free audit score: ${out.score}/100 (${out.grade}).` : `Free audit could not read the site (${out.reason}).`,
            body.social ? `Social: ${clip(body.social, 300)}` : '',
            body.maps ? `Google Maps: ${clip(body.maps, 300)}` : '',
            out.ok && out.gaps.length ? `Gaps: ${out.gaps.join(' | ')}` : '',
          ].filter(Boolean).join('\n'),
        },
      });
    } catch (e) {
      strapi.log.warn(`audit: could not store the enquiry (${e.message})`);
    }

    if (!out.ok) {
      ctx.status = out.reason === 'bad-url' ? 400 : 422;
      return ctx.send({ error: out.reason });
    }
    return ctx.send(out);
  },
};
