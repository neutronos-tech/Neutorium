module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  // Public URL of the CMS, e.g. https://cms.neutorium.com (needed behind a reverse proxy).
  url: env('PUBLIC_URL', ''),
  proxy: env.bool('IS_PROXIED', true),
  app: { keys: env.array('APP_KEYS') },
});
