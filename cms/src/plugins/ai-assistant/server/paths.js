// Which repository files the assistant may change. Checked again right before every commit.

const WRITABLE_PREFIXES = ['src/', 'public/'];
const TEXT_EXTENSIONS = /\.(jsx?|tsx?|css|json|html|md|txt|svg|xml|webmanifest)$/i;
// Never touched, even inside src/ or public/.
const DENIED = [
  /(^|\/)\./, // hidden files and folders (.env, .github, .well-known, ...)
  /(^|\/)(node_modules|dist|build)\//,
  /secret|credential|password|private[-_]?key|id_rsa|\.pem$|\.key$|\.p12$/i,
];
const MAX_FILE_BYTES = 200 * 1024;

function normalize(path) {
  if (typeof path !== 'string') return null;
  const p = path.trim();
  if (!p || p.length > 200) return null;
  // Plain relative POSIX paths only: no "..", ".", "//", backslashes, drive letters or odd characters.
  if (!/^[A-Za-z0-9._\-/]+$/.test(p) || p.startsWith('/')) return null;
  if (p.split('/').some((seg) => seg === '' || seg === '.' || seg === '..')) return null;
  return p;
}

const isDenied = (p) => DENIED.some((re) => re.test(p));

function isWritable(path) {
  const p = normalize(path);
  if (!p || isDenied(p) || !TEXT_EXTENSIONS.test(p)) return false;
  return WRITABLE_PREFIXES.some((pre) => p.startsWith(pre));
}

module.exports = { WRITABLE_PREFIXES, MAX_FILE_BYTES, isWritable };
