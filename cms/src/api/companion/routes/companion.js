'use strict';

// The website cat talks to visitors through this one public endpoint. It is rate limited in
// the controller and stores nothing.
module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/companion/talk',
      handler: 'companion.talk',
      config: { auth: false },
    },
  ],
};
