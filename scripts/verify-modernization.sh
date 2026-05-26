#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<'USAGE'
Usage: ./scripts/verify-modernization.sh [--skip-client-tests] [--skip-server-check] [--smoke-url URL]

Runs repeatable modernization checks in Linux/Docker:
  - Docker Compose config validation
  - frontend dependency install + unit tests in a Node container
  - server dependency install + syntax check in a Node container
  - optional HTTP smoke check against a running deployment

Options:
  --skip-client-tests  Do not run frontend unit tests.
  --skip-server-check  Do not run server dependency/syntax checks.
  --smoke-url URL      Check URL after other checks, for example http://localhost/healthcheck.
USAGE
}

skip_client_tests=false
skip_server_check=false
smoke_url=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    --skip-client-tests)
      skip_client_tests=true
      shift
      ;;
    --skip-server-check)
      skip_server_check=true
      shift
      ;;
    --smoke-url)
      smoke_url="${2:?Missing value for --smoke-url}"
      shift 2
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "Unknown option: $1" >&2
      usage >&2
      exit 1
      ;;
  esac
done

script_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
project_dir="$(cd -- "$script_dir/.." && pwd)"
cd "$project_dir"

run_step() {
  local name="$1"
  shift
  echo
  echo "==> ${name}"
  "$@"
}

require_command() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "Missing required command: $1" >&2
    exit 1
  fi
}

require_command docker

run_step "Docker Compose config" docker compose -f docker-compose.rocky9.yml config --quiet

if [[ "$skip_client_tests" == false ]]; then
  run_step "Frontend unit tests" docker run --rm \
    -v "$project_dir:/app" \
    -v epic_verify_client_node_modules:/app/node_modules \
    -w /app \
    node:20-bookworm-slim \
    sh -lc "npm ci --legacy-peer-deps && npm run test:unit -- --runInBand"
fi

if [[ "$skip_server_check" == false ]]; then
  run_step "Server install and syntax check" docker run --rm \
    -v "$project_dir/server:/app" \
    -v epic_verify_server_node_modules:/app/node_modules \
    -w /app \
    node:20-bookworm-slim \
    sh -lc "npm ci --legacy-peer-deps --ignore-scripts && node --check src/index.js && node --check src/services/prisma.js"
fi

if [[ -n "$smoke_url" ]]; then
  require_command curl
  run_step "HTTP smoke check" curl -fsS "$smoke_url"
fi

echo
echo "Verification completed."
