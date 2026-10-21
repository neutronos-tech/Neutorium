#!/usr/bin/env bash
# Installs or updates the Neutorium CMS (Strapi + Postgres) on the VPS and serves it at neutorium.com/addme.
# Run as root on the server:
#   curl -fsSL https://raw.githubusercontent.com/neutronos-tech/Neutorium/main/deploy/install-cms.sh | bash
# Safe to run again: it pulls the latest code, keeps .env and the database, and rebuilds.
set -Eeuo pipefail

dir=/opt/neutorium-cms
repo=https://github.com/neutronos-tech/Neutorium.git
say() { printf '\n== %s\n' "$*"; }

[[ $EUID -eq 0 ]] || { echo "Run as root." >&2; exit 1; }
command -v docker >/dev/null || { echo "Docker is not installed." >&2; exit 1; }
docker compose version >/dev/null || { echo "Docker Compose v2 is not installed." >&2; exit 1; }
docker inspect neutorium-site >/dev/null 2>&1 || { echo "The neutorium-site container is not running." >&2; exit 1; }

mem=$(awk '/MemAvailable/ {print int($2/1024)}' /proc/meminfo)
if (( mem < 1500 )); then echo "Warning: only ${mem} MB RAM free; building the CMS needs about 2 GB (add swap if the build is killed)."; fi

say "Code"
if [[ -d $dir/.git ]]; then git -C "$dir" pull --ff-only; else git clone --depth 1 "$repo" "$dir"; fi

say "Settings ($dir/deploy/.env)"
env="$dir/deploy/.env"
net=$(docker inspect neutorium-site -f '{{range $k, $v := .NetworkSettings.Networks}}{{$k}}{{"\n"}}{{end}}' | head -n1)
if [[ ! -f $env ]]; then
  read -rp "Admin email: " email < /dev/tty
  read -rsp "First admin password (8+ characters, change it after signing in): " pass < /dev/tty; echo
  s() { openssl rand -base64 32 | tr -d '\n'; }
  umask 077
  cat > "$env" <<EOF
PUBLIC_URL=https://neutorium.com
ADMIN_EMAIL=$email
ADMIN_INITIAL_PASSWORD=$pass
APP_KEYS=$(s),$(s),$(s),$(s)
API_TOKEN_SALT=$(s)
ADMIN_JWT_SECRET=$(s)
TRANSFER_TOKEN_SALT=$(s)
JWT_SECRET=$(s)
ENCRYPTION_KEY=$(s)
DATABASE_PASSWORD=$(openssl rand -hex 24)
CORS_ORIGINS=https://neutorium.com,https://www.neutorium.com
GITHUB_REPOSITORY=neutronos-tech/Neutorium
# Optional GitHub tokens (see cms/README.md): site rebuilds after edits, and the Assistant's pull requests.
GITHUB_DISPATCH_TOKEN=
AI_GITHUB_TOKEN=
AI_BASE_BRANCH=main
SITE_NETWORK=$net
EOF
  echo "Created. Secrets were generated; keep this file private."
else
  grep -q '^SITE_NETWORK=' "$env" || echo "SITE_NETWORK=$net" >> "$env"
  echo "Kept the existing file."
fi

say "Build and start (first build takes a few minutes)"
cd "$dir/deploy"
docker compose -f cms.compose.yml up -d --build

say "Route /addme to the CMS"
mount=$(docker inspect neutorium-site -f '{{range .Mounts}}{{if eq .Destination "/etc/caddy/Caddyfile"}}{{.Source}}{{end}}{{end}}')
if [[ -z $mount ]]; then
  mount=$(docker inspect neutorium-site -f '{{range .Mounts}}{{if eq .Destination "/etc/caddy"}}{{.Source}}{{end}}{{end}}')
  [[ -n $mount ]] && mount="$mount/Caddyfile"
fi
if [[ -z $mount || ! -f $mount ]]; then
  echo "Could not find the site's Caddyfile. Copy $dir/deploy/site.Caddyfile into the neutorium-site container and restart it."
elif cmp -s "$mount" site.Caddyfile; then
  echo "Already up to date."
else
  backup="$mount.bak.$(date +%Y%m%d%H%M%S)"
  cp "$mount" "$backup"
  cat site.Caddyfile > "$mount"
  docker restart neutorium-site >/dev/null
  sleep 3
  if ! docker exec neutorium-site wget -qO /dev/null http://127.0.0.1/; then
    echo "The site did not come back; restoring the previous Caddyfile."
    cat "$backup" > "$mount"
    docker restart neutorium-site >/dev/null
    exit 1
  fi
  echo "Updated (previous version: $backup)."
fi

say "Waiting for the CMS"
for _ in $(seq 1 60); do
  docker exec neutorium-cms wget -qO- http://127.0.0.1:1337/_health >/dev/null 2>&1 && { echo "Running. Open https://neutorium.com/addme"; exit 0; }
  sleep 5
done
echo "The CMS has not answered yet. Check: docker logs --tail 50 neutorium-cms"
exit 1
