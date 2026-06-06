# Modernization Work Completed

Date: 2026-05-26

## Phase 1: Stabilization

- Added Linux verification helper at `scripts/verify-linux.sh`.
- Corrected `DATABASE_URL` handling for the Prisma Client connectivity probe.
- Verified Docker Compose config, unit tests, server syntax, production image builds, and live `/healthcheck`.

## Phase 2: Frontend Leaf Dependency Cleanup

- Removed unused `vue-backtotop`.
- Removed `vue-rollbar` and the hard-coded Rollbar production token wiring.
- Confirmed previous replacements for URL parsing, KML export, Unsplash image search, and rich text editing remain in place.
- Frontend production audit is reduced to Vue 2 ecosystem advisories that require the larger Vue migration.

## Phase 3: Backend Runtime Cleanup

- Committed `server/src/generated/prisma.graphql` so the runtime no longer needs `graphql-cli`.
- Removed `graphql-cli` from the server runtime dependency tree.
- Removed unused `apollo-server`; the app uses `apollo-server-express`.
- Simplified the Prisma 1 entrypoint to deploy the datamodel and use the committed generated schema.
- Verified server tests, server build, container startup, and live healthcheck.

## Phase 4: Frontend Build Streamlining

- Removed PWA/service-worker registration and the Vue CLI PWA plugin.
- Removed old direct Promise/fetch polyfills.
- Updated browser targets to modern browsers, eliminating the dual legacy/module production build.
- Fixed package version imports that produced Webpack warnings.
- Verified frontend unit tests and production build.

## Phase 5: Evaluation Hardening

- Fixed Jest test discovery so `npm run test:unit -- --runInBand` reliably finds `tests/unit` specs on Windows and Linux paths.
- Replaced the vulnerable `graphql-import` 1.x dependency chain with the smaller legacy `graphql-import` 0.7.1 importer used by the existing Prisma 1-era stack.
- Confirmed schema import still expands the full GraphQL schema.
- Improved `scripts/install-linux.sh` so new installs generate local secrets and accept `APP_DOMAIN` values with or without an `http(s)://` scheme.
- Kept the Prisma Client bridge lazy and shared so health checks and Apollo context do not repeatedly create database clients.

## Remaining Modernization Work

- Migrate from Vue 2/Buefy/Vuex/Vue Apollo to Vue 3-compatible equivalents.
- Migrate from Apollo Server 2/GraphQL 14/subscriptions-transport-ws to a maintained GraphQL server stack.
- Replace Prisma 1/prisma-binding with Prisma Client queries and migrations.
- Replace `graphql-import` entirely after generated Prisma GraphQL forwarding is removed.
- Replace AWS SDK v2 with AWS SDK v3.
- Replace the Twitter/request-era noise integration if that workflow remains required.
- Split Cesium/OpenLayers-heavy routes further to reduce the large vendor bundle.
