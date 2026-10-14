const path = require('path');
const fs = require('fs');

// Read-only for the public website, plus submitting enquiries. Tasks are never public.
const PUBLIC_ACTIONS = [
  'api::service.service.find', 'api::service.service.findOne',
  'api::industry.industry.find', 'api::industry.industry.findOne',
  'api::faq.faq.find', 'api::faq.faq.findOne',
  'api::article.article.find', 'api::article.article.findOne',
  'api::site-setting.site-setting.find',
  'api::enquiry.enquiry.create',
];

// Content that, when changed, should rebuild the pre-rendered website.
const SITE_MODELS = [
  'api::service.service', 'api::industry.industry', 'api::faq.faq',
  'api::article.article', 'api::site-setting.site-setting',
];

const readJson = (file) => JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', file), 'utf8'));

async function grantPublicPermissions(strapi) {
  const role = await strapi.db.query('plugin::users-permissions.role').findOne({ where: { type: 'public' } });
  if (!role) return;
  for (const action of PUBLIC_ACTIONS) {
    const exists = await strapi.db.query('plugin::users-permissions.permission').findOne({ where: { action, role: role.id } });
    if (!exists) await strapi.db.query('plugin::users-permissions.permission').create({ data: { action, role: role.id } });
  }
}

const isEmpty = async (strapi, uid) => (await strapi.documents(uid).count({})) === 0;

async function seedContent(strapi) {
  const seed = readJson('seed.json');

  if (await isEmpty(strapi, 'api::service.service')) {
    for (const [i, s] of seed.services.entries()) {
      await strapi.documents('api::service.service').create({
        data: {
          name: s.name, slug: s.slug, category: s.category, summary: s.summary, intro: s.intro,
          includes: s.includes, outcomes: s.outcomes, timeline: s.timeline, packages: s.pkg, order: i,
        },
      });
    }
    strapi.log.info(`[seed] ${seed.services.length} services`);
  }

  if (await isEmpty(strapi, 'api::industry.industry')) {
    for (const [i, ind] of seed.industries.entries()) {
      await strapi.documents('api::industry.industry').create({
        data: { name: ind.name, slug: ind.slug, availability: ind.status, filled: ind.filled, order: i },
      });
    }
  }

  if (await isEmpty(strapi, 'api::faq.faq')) {
    for (const [page, items] of Object.entries(seed.faqs)) {
      for (const [i, [question, answer]] of items.entries()) {
        await strapi.documents('api::faq.faq').create({ data: { question, answer, page, order: i } });
      }
    }
  }

  const settings = await strapi.documents('api::site-setting.site-setting').findFirst({});
  if (!settings) {
    await strapi.documents('api::site-setting.site-setting').create({
      data: {
        email: seed.settings.email,
        description: seed.settings.description,
        socials: seed.settings.socials.filter(([, url]) => /^https?:\/\//.test(url)).map(([label, url]) => ({ label, url })),
      },
    });
  }

  if (await isEmpty(strapi, 'api::article.article')) {
    // A draft that shows the answer-first format. It is not published until someone edits and publishes it.
    await strapi.documents('api::article.article').create({ data: seed.exampleArticle });
  }
}

async function seedTasks(strapi) {
  if (!(await isEmpty(strapi, 'api::task.task'))) return;
  const plan = readJson('aeo-plan.json');
  const order = [...plan.tasks].sort((a, b) => a.phase - b.phase);
  for (const [i, t] of order.entries()) {
    await strapi.documents('api::task.task').create({
      data: {
        title: t.title,
        stage: t.phase === 1 ? 'todo' : 'backlog',
        priority: t.priority,
        area: t.area,
        phase: t.phase,
        step: i + 1,
        description: t.description,
        checklist: t.checklist.map((label) => ({ label, done: false })),
      },
    });
  }
  strapi.log.info(`[seed] ${order.length} AEO/SEO tasks`);
}

// "Team member" admin role: manages tasks and writes Insights, FAQs and services.
// Enquiries (personal data), settings and users stay with Super Admins and Editors.
async function ensureTeamRole(strapi) {
  const roleService = strapi.service('admin::role');
  const [existing] = await roleService.find({ name: 'Team member' });
  if (existing) return;

  const role = await roleService.create({
    name: 'Team member',
    description: 'Works on assigned tasks and writes website content. No access to enquiries or settings.',
  });

  const cm = (action, subject) => ({ action: `plugin::content-manager.explorer.${action}`, subject, properties: {}, conditions: [] });
  const permissions = [
    ...['read', 'create', 'update'].map((a) => cm(a, 'api::task.task')),
    ...['read', 'create', 'update', 'publish'].map((a) => cm(a, 'api::article.article')),
    ...['read', 'create', 'update'].map((a) => cm(a, 'api::faq.faq')),
    ...['read', 'update'].map((a) => cm(a, 'api::service.service')),
    cm('read', 'api::industry.industry'),
    { action: 'plugin::upload.read', subject: null, properties: {}, conditions: [] },
    { action: 'plugin::upload.assets.create', subject: null, properties: {}, conditions: [] },
    { action: 'plugin::upload.assets.update', subject: null, properties: {}, conditions: [] },
    { action: 'plugin::upload.assets.download', subject: null, properties: {}, conditions: [] },
    { action: 'plugin::upload.assets.copy-link', subject: null, properties: {}, conditions: [] },
  ];

  // Grant every field of each content type (properties.fields lists them explicitly).
  for (const p of permissions) {
    if (!p.subject || p.action.endsWith('.publish')) continue;
    p.properties.fields = fieldPaths(strapi, strapi.contentType(p.subject).attributes);
  }

  await roleService.assignPermissions(role.id, permissions);
  strapi.log.info('[seed] created admin role "Team member"');
}

// Permission field paths include nested component fields, e.g. "checklist.label".
function fieldPaths(strapi, attributes, prefix = '') {
  const skip = new Set(['createdAt', 'updatedAt', 'publishedAt', 'createdBy', 'updatedBy', 'locale', 'localizations']);
  return Object.entries(attributes).flatMap(([name, attr]) => {
    if (skip.has(name)) return [];
    const key = prefix + name;
    if (attr.type === 'component') return fieldPaths(strapi, strapi.components[attr.component].attributes, `${key}.`);
    return [key];
  });
}

// Debounced GitHub repository_dispatch so the website re-renders after content changes.
function watchForSiteRebuilds(strapi) {
  const token = process.env.GITHUB_DISPATCH_TOKEN;
  const repo = process.env.GITHUB_REPOSITORY || 'neutronos-tech/Neutorium';
  if (!token) return strapi.log.info('[rebuild] GITHUB_DISPATCH_TOKEN not set; site rebuilds are manual');

  let timer = null;
  const schedule = () => {
    clearTimeout(timer);
    timer = setTimeout(async () => {
      try {
        const res = await fetch(`https://api.github.com/repos/${repo}/dispatches`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json', 'Content-Type': 'application/json' },
          body: JSON.stringify({ event_type: 'cms-content-changed' }),
        });
        strapi.log.info(`[rebuild] dispatch -> ${res.status}`);
      } catch (e) {
        strapi.log.error(`[rebuild] dispatch failed: ${e.message}`);
      }
    }, 60 * 1000);
  };

  strapi.db.lifecycles.subscribe({ models: SITE_MODELS, afterCreate: schedule, afterUpdate: schedule, afterDelete: schedule });
}

// First login: with no admin yet, create the Super Admin from ADMIN_EMAIL + ADMIN_INITIAL_PASSWORD
// so /addme shows a sign-in page instead of Strapi's open "create the first admin" form.
async function ensureFirstAdmin(strapi) {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_INITIAL_PASSWORD;
  if ((await strapi.db.query('admin::user').count()) > 0) return;
  if (!email || !password || password === 'change-me') {
    strapi.log.warn('[setup] No admin yet. Set ADMIN_EMAIL and ADMIN_INITIAL_PASSWORD so the first login is protected.');
    return;
  }
  const superAdmin = await strapi.service('admin::role').getSuperAdmin();
  await strapi.service('admin::user').create({
    email: email.toLowerCase(),
    firstname: 'Neutorium',
    lastname: 'Admin',
    password,
    isActive: true,
    roles: [superAdmin.id],
  });
  strapi.log.info(`[setup] Admin ${email} created. Sign in at ${strapi.config.get('admin.url', '/addme')}`);
}

module.exports = {
  register() {},

  async bootstrap({ strapi }) {
    await ensureFirstAdmin(strapi);
    await grantPublicPermissions(strapi);
    await seedContent(strapi);
    await seedTasks(strapi);
    try {
      await ensureTeamRole(strapi);
    } catch (e) {
      strapi.log.warn(`[seed] could not create the Team member role automatically: ${e.message}`);
    }
    watchForSiteRebuilds(strapi);
  },
};
