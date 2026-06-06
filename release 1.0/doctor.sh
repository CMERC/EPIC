#!/usr/bin/env bash
set -euo pipefail

required_commands=(docker curl)

for cmd in "${required_commands[@]}"; do
  if ! command -v "${cmd}" >/dev/null 2>&1; then
    echo "Missing required command: ${cmd}" >&2
    exit 1
  fi
done

if ! docker compose version >/dev/null 2>&1; then
  echo "Docker Compose plugin is not available. Install docker-compose-plugin." >&2
  exit 1
fi

if [ ! -f ".env" ]; then
  echo "Missing .env. Copy .env.example to .env and edit it." >&2
  exit 1
fi

if [ ! -f "server.env" ]; then
  echo "Missing server.env. Copy server.env.example to server.env and edit it." >&2
  exit 1
fi

if grep -Eq "change-this|changeme|epicminio123456|MYSQL_ROOT_PASSWORD=prisma" .env server.env; then
  echo "Warning: default or placeholder secrets are still present in .env/server.env." >&2
fi

free_kb=$(df -Pk . | awk 'NR==2 {print $4}')
free_gb=$((free_kb / 1024 / 1024))
if [ "${free_gb}" -lt 20 ]; then
  echo "Warning: less than 20 GiB free in the release directory filesystem." >&2
fi

echo "Docker:"
docker --version
docker compose version

echo
echo "Compose config:"
docker compose config --quiet
echo "OK"

echo
echo "Images referenced by compose:"
docker compose config --images

echo
echo "Current service status:"
docker compose ps || true
