#!/usr/bin/env bash
set -euo pipefail

base_url="${EPIC_BASE_URL:-http://localhost}"

echo "Checking compose services..."
docker compose ps

echo
echo "Checking HTTP home page at ${base_url}/ ..."
curl -fsS "${base_url}/" >/dev/null
echo "Home page OK"

echo
echo "Checking server health at ${base_url}/healthcheck ..."
health_body="$(curl -fsS "${base_url}/healthcheck")"
echo "${health_body}"
echo "${health_body}" | grep -q '"status":"200"\|"status": "200"\|status.*200' || {
  echo "Healthcheck did not report status 200" >&2
  exit 1
}

echo
echo "Checking GraphQL endpoint..."
curl -fsS \
  -H 'Content-Type: application/json' \
  --data '{"query":"{ __typename }"}' \
  "${base_url}/graphql" >/dev/null
echo "GraphQL OK"

echo
echo "Checking MySQL from inside the mysql container..."
docker compose exec -T mysql sh -c 'mysqladmin ping -h localhost -p"$MYSQL_ROOT_PASSWORD" --silent'
echo "MySQL OK"

echo
echo "Checking Redis..."
docker compose exec -T redis redis-cli ping | grep -q PONG
echo "Redis OK"

echo
echo "Checking MinIO bucket..."
docker compose run --rm create-minio-bucket >/dev/null
echo "MinIO bucket OK"

echo
echo "Smoke test complete."
