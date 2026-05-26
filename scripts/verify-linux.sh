#!/usr/bin/env bash
set -euo pipefail

project_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$project_dir"

compose=(docker compose -f docker-compose.rocky9.yml)

echo "== Compose config =="
"${compose[@]}" config --quiet

echo "== Frontend unit tests =="
docker run --rm \
  -v "$project_dir:/app" \
  -v epic_modernized_client_node_modules:/app/node_modules \
  -w /app \
  node:20-bookworm-slim \
  sh -lc 'npm install --legacy-peer-deps && npm run test:unit -- --runInBand'

echo "== Server syntax checks =="
docker run --rm \
  -v "$project_dir/server:/app" \
  -w /app \
  node:20-bookworm-slim \
  sh -lc 'npm ci --legacy-peer-deps --ignore-scripts && node --check src/index.js && node --check src/services/healthCheck.js'

if "${compose[@]}" ps server --format json >/dev/null 2>&1; then
  echo "== Live healthcheck =="
  "${compose[@]}" exec -T server node -e "require('http').get('http://localhost:4000/healthcheck', res => { console.log(res.statusCode); process.exit(res.statusCode === 200 ? 0 : 1) }).on('error', err => { console.error(err.message); process.exit(1) })"
else
  echo "Server container is not running; skipped live healthcheck."
fi

echo "Verification complete."
