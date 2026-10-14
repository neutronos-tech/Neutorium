module.exports = ({ env }) => ({
  'users-permissions': { config: { jwtSecret: env('JWT_SECRET') } },
  // Assistant (Super Admins only): edits website text and opens a GitHub pull request.
  'ai-assistant': { enabled: true, resolve: './src/plugins/ai-assistant' },
});
