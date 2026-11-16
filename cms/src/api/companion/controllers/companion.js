'use strict';

const { talk } = require('../services/brain');

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 25;
const hits = new Map(); // ip -> timestamps (in memory; resets on restart, enough to stop floods)

module.exports = {
  // POST /api/companion/talk  { message, history }  ->  { reply, mood }
  async talk(ctx) {
    const ip = ctx.request.ip;
    const now = Date.now();
    const recent = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
    if (recent.length >= MAX_PER_WINDOW) return ctx.tooManyRequests('The cat needs a nap. Try again in a few minutes.');
    hits.set(ip, [...recent, now]);

    const { message, history } = ctx.request.body || {};
    const out = await talk({ message, history });
    if (!out.ok) {
      if (out.reason === 'empty') return ctx.badRequest('Say something first.');
      strapi.log.warn(`companion: no reply (${out.reason})`);
      ctx.status = 503;
      return ctx.send({ error: 'unavailable' });
    }
    return ctx.send({ reply: out.reply, mood: out.mood });
  },
};
