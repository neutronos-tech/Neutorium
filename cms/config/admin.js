module.exports = ({ env }) => ({
  // The admin panel lives on the main domain at a hidden path: https://neutorium.com/addme
  url: env('ADMIN_PATH', '/addme'),
  auth: { secret: env('ADMIN_JWT_SECRET') },
  apiToken: { salt: env('API_TOKEN_SALT') },
  transfer: { token: { salt: env('TRANSFER_TOKEN_SALT') } },
  secrets: { encryptionKey: env('ENCRYPTION_KEY') },
  flags: { nps: false, promoteEE: false },
});
