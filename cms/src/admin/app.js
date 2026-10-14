export default {
  config: {
    locales: ['en'],
    translations: {
      en: {
        'Auth.form.welcome.title': 'Neutorium CMS',
        'Auth.form.welcome.subtitle': 'Sign in to manage content, enquiries and tasks',
        'app.components.LeftMenu.navbrand.title': 'Neutorium',
        'app.components.LeftMenu.navbrand.workplace': 'Content & tasks',
      },
    },
    theme: {
      light: { colors: { primary100: '#f7eeed', primary200: '#e8cccb', primary500: '#a8383a', primary600: '#8c1f21', primary700: '#741516', buttonPrimary500: '#8c1f21', buttonPrimary600: '#741516' } },
    },
    tutorials: false,
    notifications: { releases: false },
  },
  bootstrap() {},
};
