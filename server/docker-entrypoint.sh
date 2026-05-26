#!/usr/bin/env sh
set -eu

: "${PRISMA_ENDPOINT:=http://prisma:4466/default/default}"

echo "Waiting for Prisma at ${PRISMA_ENDPOINT} ..."
until curl -fsS "${PRISMA_ENDPOINT%/default/default}/management" >/dev/null 2>&1; do
  sleep 3
done

if [ ! -f src/generated/prisma.graphql ]; then
  echo "Generated Prisma schema missing. Rebuild the image with server/src/generated/prisma.graphql included." >&2
  exit 1
fi

echo "Deploying Prisma 1 datamodel if needed."
./node_modules/.bin/prisma1 deploy -p database/prisma.yml

exec "$@"
