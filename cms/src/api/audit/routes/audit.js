'use strict';

// The free business audit on the website. Public, rate limited in the controller.
module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/audit/run',
      handler: 'audit.run',
      config: { auth: false },
    },
  ],
};
