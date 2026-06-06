#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<'USAGE'
Usage: ./scripts/install-linux.sh [--skip-system-deps] [--no-build] [--domain DOMAIN]

Installs host prerequisites when needed, prepares env files, and starts the
EPIC Rocky 9 Docker Compose stack.

Options:
  --skip-system-deps  Do not install Docker or OS packages.
  --no-build          Start containers without rebuilding images.
  --domain DOMAIN     Set APP_DOMAIN in .env if .env is created by this script.
USAGE
}

skip_system_deps=false
build_flag="--build"
app_domain="${APP_DOMAIN:-localhost}"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --skip-system-deps)
      skip_system_deps=true
      shift
      ;;
    --no-build)
      build_flag=""
      shift
      ;;
    --domain)
      app_domain="${2:?Missing value for --domain}"
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

need_sudo=""
if [[ "${EUID:-$(id -u)}" -ne 0 ]]; then
  need_sudo="sudo"
fi

random_secret() {
  if command -v openssl >/dev/null 2>&1; then
    openssl rand -hex 32
  else
    tr -dc 'A-Za-z0-9' </dev/urandom | head -c 64
    echo
  fi
}

app_url() {
  case "$app_domain" in
    http://*|https://*)
      echo "$app_domain"
      ;;
    *)
      echo "http://$app_domain"
      ;;
  esac
}

install_system_deps() {
  if command -v docker >/dev/null 2>&1 && docker compose version >/dev/null 2>&1; then
    echo "Docker and Docker Compose plugin are already available."
    return
  fi

  if command -v dnf >/dev/null 2>&1; then
    $need_sudo dnf -y install dnf-plugins-core curl ca-certificates git
    $need_sudo dnf config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
    $need_sudo dnf -y install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
  elif command -v apt-get >/dev/null 2>&1; then
    $need_sudo apt-get update
    $need_sudo apt-get -y install ca-certificates curl git gnupg
    $need_sudo install -m 0755 -d /etc/apt/keyrings
    . /etc/os-release
    curl -fsSL "https://download.docker.com/linux/${ID}/gpg" | $need_sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
    $need_sudo chmod a+r /etc/apt/keyrings/docker.gpg
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/${ID} ${VERSION_CODENAME} stable" |
      $need_sudo tee /etc/apt/sources.list.d/docker.list >/dev/null
    $need_sudo apt-get update
    $need_sudo apt-get -y install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
  else
    echo "Unsupported package manager. Install Docker Engine and the Compose plugin, then rerun with --skip-system-deps." >&2
    exit 1
  fi

  $need_sudo systemctl enable --now docker
  if [[ -n "$need_sudo" ]]; then
    $need_sudo usermod -aG docker "$USER" || true
    echo "Added $USER to the docker group. You may need to log out/in or run: newgrp docker"
  fi
}

prepare_env() {
  if [[ ! -f .env ]]; then
    cp .env.rocky9.example .env
    sed -i.bak "s|^APP_DOMAIN=.*|APP_DOMAIN=${app_domain}|" .env
    sed -i.bak "s|^MINIO_ROOT_PASSWORD=.*|MINIO_ROOT_PASSWORD=$(random_secret)|" .env
    rm -f .env.bak
    echo "Created .env from .env.rocky9.example."
  else
    echo ".env already exists; leaving it unchanged."
  fi

  if [[ ! -f server/.env.rocky9 ]]; then
    prisma_secret="$(random_secret)"
    jwt_secret="$(random_secret)"
    cat > server/.env.rocky9 <<ENV
APP_DOMAIN=$(app_url)
PRISMA_SECRET=${prisma_secret}
DATABASE_URL=mysql://root:prisma@mysql:3306/default@default
APP_SECRET=${jwt_secret}
SENDGRID_API_KEY=
SENDGRID_FROM_EMAIL=
COBRA_API_URL=
COBRA_API_KEY=
TWITTER_CONSUMER_KEY=
TWITTER_CONSUMER_SECRET=
TWITTER_ACCESS_TOKEN_KEY=
TWITTER_ACCESS_TOKEN_SECRET=
ENV
    echo "Created server/.env.rocky9 with generated local secrets."
  else
    echo "server/.env.rocky9 already exists; leaving it unchanged."
  fi
}

if [[ "$skip_system_deps" == false ]]; then
  install_system_deps
fi

prepare_env

compose=(docker compose -f docker-compose.rocky9.yml)
"${compose[@]}" pull mysql prisma redis minio create-minio-bucket graphql-faker caddy || true
if [[ -n "$build_flag" ]]; then
  "${compose[@]}" up -d "$build_flag"
else
  "${compose[@]}" up -d
fi

echo "Waiting for the API container to become healthy..."
for _ in {1..60}; do
  server_health="$("${compose[@]}" ps --format json server 2>/dev/null | sed -n 's/.*"Health":"\([^"]*\)".*/\1/p' | head -n 1 || true)"
  if [[ "$server_health" == "healthy" ]]; then
    break
  fi
  sleep 3
done

echo "Seeding reference data and evaluation content..."
"${compose[@]}" exec -T server sh -lc 'cd /app/database && npx prisma1 seed >/tmp/epic-prisma-seed.log 2>&1 || { cat /tmp/epic-prisma-seed.log; exit 1; }'
"${compose[@]}" exec -T server npm run seed:evaluation

echo
echo "EPIC is starting. Check status with:"
echo "  docker compose -f docker-compose.rocky9.yml ps"
echo "  docker compose -f docker-compose.rocky9.yml logs -f server prisma mysql"
echo
echo "Open: $(app_url)"
