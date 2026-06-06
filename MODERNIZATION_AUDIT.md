# EPIC Application Modernization Audit

Date: 2026-05-23

Updated: 2026-05-26

## Executive summary

EPIC is now runnable for evaluation, but it is still a legacy Vue 2 + Apollo Server 2 + Prisma 1 application. The current package is best treated as a stabilized compatibility release, not a complete modernization. The largest technical debt is the backend data/API layer: Prisma 1, `prisma-binding`, Apollo Server 2, GraphQL 14, MySQL 5.7, and several old integration libraries all constrain what can safely be upgraded.

The safest path is phased:

1. Stabilize the current app with reproducible installs, working tests, clean Docker builds, and known service health.
2. Reduce exposed vulnerabilities by replacing abandoned leaf dependencies where the application usage is small.
3. Migrate the server from Prisma 1/Apollo 2 to a current GraphQL stack and Prisma Client.
4. Migrate the frontend from Vue 2/Buefy/Vue CLI to Vue 3/Vite or a maintained Vue 2.7 bridge stack.

## Current architecture

- Frontend: Vue 2.7, Vue Router 3, Vuex 3, Buefy/Bulma, Apollo Client via `vue-apollo`, Vue CLI 5/Webpack.
- Backend: Node app with Express, Apollo Server 2, GraphQL 14, `prisma-binding`, Prisma 1 schema generation, Redis/Bull, MinIO/S3, SendGrid-style email support.
- Data/services: MySQL 5.7, Prisma 1, Redis 7, MinIO, GraphQL Faker.
- Deployment: Docker Compose v2 via `docker-compose.rocky9.yml`, Caddy 2 reverse proxy, nginx static client image.

## Changes completed in this pass

- Added frontend unit-test dependencies that were present in config/lock state but missing from `package.json`.
- Aligned `babel-jest` with the Jest 27 runtime used by Vue CLI 5.
- Set Jest to `jsdom`, which is required for Vue component tests.
- Generated `server/package-lock.json` so server installs and audits are reproducible.
- Added a root `.dockerignore` to keep local dependencies, generated output, logs, archives, and runtime data out of Docker build contexts.
- Tightened `server/.dockerignore`.
- Fixed the `graphql-faker` compose service by removing the unsupported `--host` argument.
- Fixed scheduler env parsing so only `DISABLE_SCHEDULER=true` disables scheduled jobs.
- Made the frontend production build complete reliably by disabling production source maps, removing the old UglifyJS minimizer, and letting Webpack/Vue CLI build without minification for this legacy bundle.
- Removed unused `uglifyjs-webpack-plugin` from frontend dev dependencies.
- Fixed the client container healthcheck to use `127.0.0.1` instead of `localhost`, avoiding IPv6 loopback resolution inside the nginx alpine image.

## Apollo/Prisma migration slice

- Upgraded the backend Apollo Server packages within the Apollo 2 compatibility line: `apollo-server` and `apollo-server-express` now resolve to `2.26.2`.
- Preserved the existing Apollo 2 subscription API for now. Moving to Apollo Server 3/4 requires replacing `installSubscriptionHandlers` and the current `subscriptions-transport-ws` style setup.
- Converted `server/src/services/prisma.js` into an explicit cached Prisma 1 compatibility adapter. Existing resolvers still use `ctx.db.query`, `ctx.db.mutation`, `ctx.db.subscription`, and `forwardTo('db')`.
- Removed runtime use of `PrismaClient` from Apollo context until individual resolver groups are migrated.
- Kept the modern Prisma schema/client scaffold in `server/prisma/schema.prisma`.
- Updated the server image build to use reproducible production installs and generate Prisma Client during build.
- Made the Prisma ORM health check safe during the transition and fixed the health route to return numeric HTTP statuses.
- Removed an unused `require('redis')` from tracking middleware; the app uses the existing `ioredis` client from context.
- Started the Prisma migration bridge by adding Prisma ORM/Client 6.19.3, introspecting the Prisma 1 MySQL database, adding `ctx.prisma`, and exposing Prisma ORM health status.
- Replaced direct frontend and server `url-regex` usage with bounded local URL helpers.
- Removed the abandoned frontend `tokml` dependency and added a small KML exporter for EPIC noise bounds.
- Upgraded `video.js` to the latest Vue 2-compatible 7.x line used by this project.
- Removed the deprecated Babel polyfill package from the frontend package.
- Replaced `unsplash-js` v4 with direct Unsplash REST calls and removed the client-side secret value.
- Replaced deprecated `@babel/polyfill` with `core-js/stable` and `regenerator-runtime/runtime`.
- Added `VUE_APP_UNSPLASH_ACCESS_KEY` to the environment example and Docker client build args.
- Added Docker Compose healthchecks for Caddy, client, server, MySQL, Redis, and GraphQL Faker.
- Restricted `/link` redirects to `http`, `https`, and `ftp` targets.
- Added Vue dev-server history fallback so direct browser requests to routes such as `/learn/` serve the SPA shell during local evaluation.
- Removed unused direct frontend dependencies: `tokml`, `unsplash-js`, and `url-regex`.
- Replaced server `apollo-fetch` usage with the existing `node-fetch` dependency.
- Removed direct server `google-translate-api` usage and added a small LibreTranslate-compatible wrapper at `server/src/services/translate.js`.
- Made Bull Arena opt-in with `ENABLE_ARENA=true` and removed it from default server dependencies.
- Replaced `email-templates` with a small local Handlebars renderer for the app's existing email templates.
- Replaced `nodemailer-sendgrid-transport` with standard Nodemailer SMTP configuration for SendGrid-compatible delivery.
- Removed `handlebars-helpers`; the templates only needed a local `year` helper plus built-in Handlebars behavior.
- Added `scripts/verify-modernization.sh` as a repeatable Linux/Docker verification gate for compose config, frontend unit tests, server install/syntax checks, and optional HTTP smoke checks.
- Replaced direct server `request` usage in health checks and upload resizing with the existing `node-fetch` dependency.
- Made image derivative generation await S3 writes and fixed resized object keys to use the uploaded S3 key.
- Removed the abandoned `quill`/`vue-quill-editor` frontend stack and replaced it with a local `<quill-editor>` compatibility component backed by a sanitized contenteditable editor.
- Removed unused direct server `fast-csv` dependency.
- Upgraded compatible server leaf dependencies: `uuid`, `node-schedule`, and `sharp`.
- Added a MinIO Docker healthcheck and made dependent services wait for healthy Redis/MinIO/client/server states where applicable.
- Fixed frontend Jest test discovery so the existing unit specs are actually executed.
- Reduced the server `graphql-import` dependency from 1.x to the smaller 0.7.1 importer, removing the vulnerable GraphQL Toolkit/Babel traversal chain while preserving the Prisma 1 schema import behavior.
- Hardened the Linux installer so fresh deployments generate local app/Prisma/MinIO secrets and handle domains with or without URL schemes.
- Made Prisma Client creation lazy and shared through `getPrismaClient()`.

## Verification

- Frontend unit tests now pass:

```bash
npm run test:unit -- --runInBand
```

Result: 5 test suites passed, 8 tests passed.

- Server tests pass:

```bash
cd server && npm test -- --runInBand
```

Result: 1 test suite passed, 1 test passed.

- Server schema import succeeds with `graphql-import` 0.7.1 and expands to a 520031 character schema string.
- `graphql-faker` now starts cleanly in Docker Compose and reports its API at `/graphql`.
- Server dependency lockfile generation completed.
- Server container rebuild completed successfully after the Apollo/Prisma slice.
- Server healthcheck reports HTTP 200.
- GraphQL smoke query through the frontend proxy reports HTTP 200.
- Direct browser-style requests to `http://localhost:4467/learn/` return the Vue app shell.
- Modernization verification can be run with:

```bash
./scripts/verify-modernization.sh --smoke-url http://localhost/healthcheck
```

## Current known issues

- Production frontend build now completes, but minification is disabled to keep the legacy Cesium/OpenLayers/Vue CLI bundle build stable in Docker. This should be revisited during the frontend platform migration.
- A cold backend dependency install is slow because of the legacy dependency tree and native packages. Docker layer caching now makes normal rebuilds much faster.
- Frontend production audit now reports 7 production vulnerabilities: 5 low, 0 moderate, 2 high, 0 critical. This is down from 26 before the dependency cleanup.
- Server production audit now reports 73 production vulnerabilities: 7 low, 29 moderate, 33 high, 4 critical. This reflects the current lockfile after adding the Prisma ORM bridge and replacing the vulnerable `graphql-import` 1.x dependency chain.
- Many remaining server audit fixes require major migrations or replacement of abandoned packages, especially Prisma 1, Apollo Server 2, GraphQL middleware/binding tooling, the old Twitter client, and old request-based transitive integrations.
- Some `url-regex` transitive entries remain on the server through older integration packages. Direct app usage has been removed.
- Docker Compose still uses MySQL 5.7 because Prisma 1 compatibility is the priority. Upgrading MySQL should wait until the Prisma migration.

## Recommended modernization roadmap

### Phase 1: Stabilize current release

- Keep Node runtime pinned and tested. Node 20 currently runs much of the app, but Apollo Server 2 transitive dependencies declare older engine support.
- Add CI that runs frontend unit tests, server install, server tests, compose config validation, and a smoke test against `/healthcheck`.
- Split dev and production compose profiles so `graphql-faker`, fake data, and scheduler behavior are explicit.
- Add healthchecks to MySQL, Prisma, Redis, MinIO, server, client, and Caddy.
- Replace magic env defaults with documented `.env.example` files for production and local development.

### Phase 2: Remove high-risk frontend leaves

- Keep expanding local coverage around URL parsing and KML export as more formats are discovered.
- Expand the local rich text editor only where users need additional formatting behavior, or replace it later with TipTap during the Vue 3 migration.

### Phase 3: Backend API/data migration

- Create a new Prisma Client schema from the existing Prisma 1 datamodel.
- Replace `prisma-binding`, `forwardTo`, and generated `prisma.graphql` imports with Prisma Client service calls.
- Remove `graphql-import` entirely once direct generated Prisma GraphQL imports are retired.
- Upgrade Apollo Server to a maintained version or migrate to GraphQL Yoga.
- Replace request-era libraries.

### Phase 4: Frontend platform migration

- Move build tooling from Vue CLI/Webpack to Vite.
- Either keep Vue 2.7 temporarily with compatibility tooling or migrate directly to Vue 3.
- Replace Buefy/Bulma components with a maintained Vue 3 component library or a small internal design system.
- Move Vuex modules to Pinia after route-level behavior is covered by tests.

## Operational notes

- The current Docker Compose path is the best way to evaluate the app.
- The installer is at `scripts/install-linux.sh`.
- The verification gate is at `scripts/verify-modernization.sh`.
- The app should not be exposed to untrusted public traffic until the server vulnerability backlog and open redirect are addressed.
