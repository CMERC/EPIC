# EPIC Rocky 9 modernization package

This package keeps the original Vue 2 + Apollo Server 2 + Prisma 1 application architecture, but updates the container runtime path so it can be built and run on Rocky Linux 9 with Docker Compose v2.

## Important limitation

The app is not a simple dependency bump to a fully current stack because it is built around **Prisma 1 / prisma-binding**, which is deprecated and tightly coupled to its legacy GraphQL schema-generation workflow. A full modernization to current Prisma requires a data-layer rewrite from `prisma-binding`/GraphQL imports to Prisma Client and a new database migration model. This package therefore modernizes the deployment/runtime and upgrades safer dependencies while preserving Prisma 1 compatibility.

## What changed

- Added `docker-compose.rocky9.yml` using Docker Compose v2 syntax.
- Replaced legacy Caddy v1 / Traefik v1 routing path with Caddy 2.
- Replaced client serving image with nginx after a Node 20 build stage.
- Added server entrypoint that waits for Prisma and generates `src/generated/prisma.graphql` automatically if it is missing.
- Added Rocky 9 Docker prerequisite script at `scripts/rocky9-prereqs.sh`.
- Removed stale `package-lock.json` files so Rocky 9 builds do not try to reuse old Node 10 lock state.
- Updated frontend build tooling toward Vue CLI 5 / Vue 2.7 and removed `node-sass` in favor of Dart Sass.
- Updated server dependency declarations where they are low-risk, while intentionally keeping Apollo Server 2, GraphQL 14, `prisma-binding`, and Prisma 1 in place.

## Run on Rocky 9

```bash
chmod +x scripts/install-linux.sh
./scripts/install-linux.sh --domain your.domain.name
```

Or run the underlying steps manually:

```bash
./scripts/rocky9-prereqs.sh
cp .env.rocky9.example .env
# Edit .env and server/.env.rocky9 before production use.
docker compose -f docker-compose.rocky9.yml up -d --build
```

Open `http://localhost` or the value of `APP_DOMAIN`.

## Health checks and first-run notes

The first server start may take a few minutes because it waits for Prisma, deploys the datamodel, seeds data, and generates `server/src/generated/prisma.graphql`.

Useful checks:

```bash
docker compose -f docker-compose.rocky9.yml logs -f server prisma mysql
docker compose -f docker-compose.rocky9.yml exec server test -f src/generated/prisma.graphql && echo generated
docker compose -f docker-compose.rocky9.yml ps
```

## Production hardening checklist

- Change `PRISMA_SECRET` in `server/.env.rocky9`.
- Change `MINIO_ROOT_USER` and `MINIO_ROOT_PASSWORD` in `.env`.
- Put real TLS certificates or ACME configuration in the Caddy layer if not running behind another reverse proxy.
- Turn scheduler on only after confirming the application data and external API settings are correct: `DISABLE_SCHEDULER=false`.
- Replace blank SendGrid, COBRA, and Twitter/API values if those integrations are needed.

## Recommended next modernization phase

The durable fix is to migrate off Prisma 1. Recommended target stack:

- Vue 3 + Vite + current Apollo Client, or keep Vue 2.7 temporarily with Vite while isolating UI changes.
- Node 22 LTS for the API.
- Apollo Server 4/5 or GraphQL Yoga.
- Prisma Client 6+ with SQL migrations.
- MySQL 8 or PostgreSQL 16.

That second phase is a code migration, not just a package update, because many server files call `new Prisma(...)`, `forwardTo(...)`, and import `src/generated/prisma.graphql`.
