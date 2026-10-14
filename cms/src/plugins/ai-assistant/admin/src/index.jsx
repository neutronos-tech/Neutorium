import { Sparkle } from '@strapi/icons';

const PLUGIN_ID = 'ai-assistant';

export default {
  register(app) {
    app.addMenuLink({
      to: `plugins/${PLUGIN_ID}`,
      icon: Sparkle,
      intlLabel: { id: `${PLUGIN_ID}.menu`, defaultMessage: 'Assistant' },
      // Granted to Super Admins automatically; the server also rejects every other role.
      permissions: [{ action: `plugin::${PLUGIN_ID}.use`, subject: null }],
      Component: () => import('./App'),
    });
    app.registerPlugin({ id: PLUGIN_ID, name: 'Assistant' });
  },
  bootstrap() {},
  async registerTrads({ locales }) {
    return locales.map((locale) => ({ data: {}, locale }));
  },
};
