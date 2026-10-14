const crypto = require('crypto');
const { createTwoFilesPatch } = require('diff');
const { createGitHub } = require('./github');
const paths = require('./paths');

const PLUGIN = 'ai-assistant';
const TTL = 60 * 60 * 1000;

const settings = () => ({
  repo: process.env.GITHUB_REPOSITORY || 'neutronos-tech/Neutorium',
  base: process.env.AI_BASE_BRANCH || 'main',
  token: process.env.AI_GITHUB_TOKEN || '',
});

const isSuperAdmin = (user) => Boolean(user?.roles?.some((r) => r.code === 'strapi-super-admin'));
const httpError = (status, message) => Object.assign(new Error(message), { status });
const slugify = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 30) || 'edit';

const service = ({ strapi }) => {
  const proposals = new Map();
  const cache = { commit: null, files: new Map() }; // file contents at one commit of main

  const github = () => {
    const s = settings();
    if (!s.token) throw httpError(503, 'AI_GITHUB_TOKEN is not set on the server.');
    return createGitHub({ token: s.token, repo: s.repo });
  };

  async function head(gh) {
    const h = await gh.branchHead(settings().base);
    if (cache.commit !== h.commitSha) {
      const all = await gh.listFiles(h.treeSha);
      cache.commit = h.commitSha;
      cache.list = all.filter((f) => paths.isWritable(f.path) && f.size <= paths.MAX_FILE_BYTES).map((f) => f.path);
      cache.files = new Map();
    }
    return h;
  }

  return {
    status() {
      const s = settings();
      return { repo: s.repo, base: s.base, githubReady: Boolean(s.token), writable: paths.WRITABLE_PREFIXES };
    },

    async files() {
      const h = await head(github());
      return { commit: h.commitSha.slice(0, 7), files: cache.list };
    },

    // Exact text replacement in the chosen files (or every editable file), shown as a diff.
    async preview(user, { find, replace, files }) {
      const gh = github();
      const h = await head(gh);
      const targets = files?.length ? files.filter((p) => cache.list.includes(p)) : cache.list;

      const changes = [];
      for (const path of targets) {
        if (!cache.files.has(path)) cache.files.set(path, await gh.readFile(path, h.commitSha));
        const before = cache.files.get(path);
        const count = before.split(find).length - 1;
        if (!count) continue;
        const after = before.split(find).join(replace);
        changes.push({ path, count, content: after, diff: createTwoFilesPatch(`a/${path}`, `b/${path}`, before, after, '', '', { context: 2 }) });
      }

      const now = Date.now();
      for (const [k, v] of proposals) if (v.createdAt < now - TTL) proposals.delete(k);
      const id = crypto.randomUUID();
      proposals.set(id, { id, userId: user.id, createdAt: now, head: h, find, replace, changes });
      return {
        id,
        commit: h.commitSha.slice(0, 7),
        title: `Replace "${find.slice(0, 40)}" with "${replace.slice(0, 40)}"`,
        changes: changes.map(({ content, ...c }) => c),
      };
    },

    async apply(user, { id, title }) {
      const p = proposals.get(id);
      if (!p || p.userId !== user.id) throw httpError(404, 'This preview has expired. Preview again.');
      if (p.pr) return p.pr;
      if (!p.changes.length) throw httpError(400, 'Nothing to change.');
      if (p.changes.some((c) => !paths.isWritable(c.path))) throw httpError(400, 'Blocked path.');

      const prTitle = String(title || '').trim().slice(0, 120) || `Replace "${p.find.slice(0, 40)}"`;
      const who = [user.firstname, user.lastname].filter(Boolean).join(' ') || user.email;
      p.pr = await github().openPullRequest({
        base: settings().base,
        baseCommitSha: p.head.commitSha,
        baseTreeSha: p.head.treeSha,
        branch: `ai/${slugify(p.replace || p.find)}-${Date.now().toString(36)}`,
        changes: p.changes.map((c) => ({ path: c.path, action: 'update', content: c.content })),
        title: prTitle,
        body: [
          `Replaces \`${p.find}\` with \`${p.replace}\` in ${p.changes.map((c) => `\`${c.path}\``).join(', ')}.`,
          '',
          `Requested by ${who} in the CMS. Review and merge to publish: merging to main deploys the live site.`,
        ].join('\n'),
      });
      strapi.log.info(`[ai-assistant] ${user.email} opened ${p.pr.url}`);
      return p.pr;
    },
  };
};

const controller = ({ strapi }) => {
  const svc = () => strapi.plugin(PLUGIN).service('assistant');
  const handle = (fn) => async (ctx) => {
    // Super Admins only, whatever other roles are granted.
    if (!isSuperAdmin(ctx.state.user)) return ctx.forbidden('Super Admins only.');
    try {
      ctx.body = await fn(ctx);
    } catch (e) {
      ctx.status = e.status || 500;
      ctx.body = { error: { message: e.message } };
    }
  };

  return {
    status: handle(() => svc().status()),
    files: handle(() => svc().files()),
    preview: handle((ctx) => {
      const { find, replace, files } = ctx.request.body || {};
      if (typeof find !== 'string' || !find || find.length > 2000) throw httpError(400, 'Enter the exact text to find.');
      if (typeof replace !== 'string' || replace.length > 2000) throw httpError(400, 'Invalid replacement text.');
      if (files !== undefined && (!Array.isArray(files) || files.some((f) => typeof f !== 'string'))) throw httpError(400, 'Invalid file list.');
      return svc().preview(ctx.state.user, { find, replace, files });
    }),
    apply: handle((ctx) => svc().apply(ctx.state.user, ctx.request.body || {}).then((pr) => ({ pr }))),
  };
};

const policies = ['admin::isAuthenticatedAdmin', { name: 'admin::hasPermissions', config: { actions: [`plugin::${PLUGIN}.use`] } }];
const route = (method, path, handler) => ({ method, path, handler: `assistant.${handler}`, config: { policies } });

module.exports = {
  async bootstrap({ strapi }) {
    await strapi.service('admin::permission').actionProvider.registerMany([
      { section: 'plugins', displayName: 'Use the assistant', uid: 'use', pluginName: PLUGIN },
    ]);
  },
  services: { assistant: service },
  controllers: { assistant: controller },
  routes: {
    admin: {
      type: 'admin',
      routes: [
        route('GET', '/status', 'status'),
        route('GET', '/files', 'files'),
        route('POST', '/preview', 'preview'),
        route('POST', '/apply', 'apply'),
      ],
    },
  },
};
