#!/usr/bin/env bash
# Runs on the VPS as the forced SSH command for the neutorium-deploy user.
# Reads a gzipped tarball of dist/ on stdin; the revision comes from
# SSH_ORIGINAL_COMMAND. Publishes atomically by swapping the `current` symlink.
set -Eeuo pipefail

root=/opt/neutorium-site
keep=5
revision=${SSH_ORIGINAL_COMMAND:-${1:-}}

if [[ ! "$revision" =~ ^[a-f0-9]{7,40}$ ]]; then
  echo "Invalid revision" >&2
  exit 2
fi

release="$root/releases/$revision"
staging="$release.tmp.$$"
trap 'rm -rf "$staging"' EXIT

mkdir -p "$staging"
tar -xzf - -C "$staging" --no-same-owner --no-same-permissions
[[ -f "$staging/index.html" ]] || { echo "index.html missing from upload" >&2; exit 1; }
chmod -R a+rX "$staging"

rm -rf "$release"
mv "$staging" "$release"

# Atomic symlink swap; relative so it also resolves inside the container.
ln -sfn "releases/$revision" "$root/current.new"
mv -T "$root/current.new" "$root/current"

# Prune old releases, never the live one.
ls -1t "$root/releases" | grep -v '\.tmp\.' | tail -n +$((keep + 1)) | while read -r old; do
  [[ "$old" != "$revision" ]] && rm -rf "$root/releases/$old"
done

echo "Published $revision"
