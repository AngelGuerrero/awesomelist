#!/bin/sh
set -eu

cd /app

# Reinstall when dependencies, npm settings, or the Node runtime change.
# Keep Linux dependencies inside their volume, separate from the host files.
signature="$(cat package.json package-lock.json .npmrc | sha256sum | cut -d ' ' -f 1)-$(node -p 'process.version + "-" + process.platform + "-" + process.arch')"
marker="node_modules/.awesomelist-dependencies"
installed=""
if [ -f "$marker" ]; then
    installed="$(cat "$marker")"
fi

if [ "$signature" != "$installed" ] || [ ! -x node_modules/.bin/vue-cli-service ]; then
    npm ci --no-audit --no-fund
    printf '%s\n' "$signature" > "$marker"
fi

exec "$@"
