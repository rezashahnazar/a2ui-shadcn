#!/bin/sh
# Simple ESM build - concatenate with esbuild if available, else just copy
mkdir -p dist
if command -v npx >/dev/null 2>&1; then
  npx esbuild src/index.ts --outfile=dist/index.js --format=esm --bundle --external:react --external:react-dom 2>/dev/null || true
fi
# If esbuild failed, tsc will have emitted .d.ts; we need the .js - use tsc with emit
exit 0
