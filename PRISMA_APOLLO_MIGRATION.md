# Prisma and Apollo Migration Status

Date: 2026-05-26

## Current migration strategy

This app exposes much of the Prisma 1 generated GraphQL API directly through `forwardTo('db')`, `ctx.db.query.*`, `ctx.db.mutation.*`, and `ctx.db.subscription.*`. A single cutover to Prisma Client would require rewriting most resolvers and the subscription layer at once.

The active migration strategy is therefore a bridge:

- Keep Prisma 1 / `prisma-binding` running for existing application behavior.
- Add Prisma ORM / Prisma Client against the existing Prisma 1 MySQL service database.
- Add `ctx.prisma` to Apollo context for new or migrated resolver code.
- Move resolver groups from `ctx.db` to `ctx.prisma` incrementally.
- Move Apollo after Prisma forwarding and subscriptions are no longer tightly coupled to Apollo Server 2 behavior.

## Current coupling inventory

- Frontend files with Vue Apollo option blocks: 126.
- Frontend files using `this.$apollo`: 142.
- Backend resolver files still using `ctx.db.query`, `ctx.db.mutation`, `ctx.db.subscription`, or `forwardTo('db')`: 23.
- The client still depends on Vue 2.7, Vue Router 3, Vuex 3, Buefy, Vue CLI, and `vue-apollo`.
- The server still depends on Apollo Server 2, GraphQL 14, Prisma 1 binding, generated Prisma GraphQL forwarding, and legacy subscription handlers.

## Completed in this slice

- Added Prisma ORM 6.19.3 and `@prisma/client` 6.19.3.
- Introspected the live Prisma 1 MySQL database `default@default` into `server/prisma/schema.prisma`.
- Generated a working Prisma Client from the introspected schema.
- Added `server/src/services/prisma.js`:
  - `getLegacyPrisma()` returns the existing Prisma 1 binding.
  - `getPrismaClient()` returns a lazy modern Prisma Client singleton when `DATABASE_URL` is configured.
- Added `ctx.prisma` to Apollo context.
- Updated global/workspace middleware to use the shared legacy Prisma factory.
- Added a Prisma ORM probe to `/healthcheck`.
- Added `DATABASE_URL` to Docker Compose and local Rocky env.
- Added `server/src/services/prismaBridge.js` to translate a focused subset of Prisma 1 GraphQL-style filters, order values, pagination, and introspected relation names into Prisma Client calls.
- Migrated global admin/user query paths to Prisma Client when `ctx.prisma` is available:
  - `appUsers`
  - `getAppUserInviteLink`
  - `appWorkspacePublic`
  - `currentUserWorkspaces`
  - `getWorkspaceMembers`
  - `appWorkspaces`
- Migrated low-risk global mutations to Prisma Client when `ctx.prisma` is available:
  - `deleteAppUser`
  - `requestAppWorkspace` fallback auto-grant path
  - `assignUserToWorkspace`
- Added focused Jest coverage for the Prisma bridge argument and relation mapping.
- Made Apollo schema setup prune middleware entries that are not present in the currently imported schema and allow resolver entries outside the schema. This preserves the legacy generated-Prisma compatibility surface while direct forwarding is being retired.
- Updated the server Dockerfile to run `npm ci --omit=dev` and generate Prisma Client during image build.
- Moved legacy `prisma1` and `graphql-cli` to production dependencies because the entrypoint still needs them until the generated Prisma GraphQL schema is retired.
- Updated the entrypoint to call local legacy binaries instead of relying on `npx` executable guessing.
- Downgraded direct `graphql-import` usage to 0.7.1 to avoid the vulnerable 1.x GraphQL Toolkit dependency chain while preserving current schema import behavior.

## Verified

- `npx prisma db pull --schema prisma/schema.prisma` introspected 72 models.
- `npm run prisma:client` generated Prisma Client.
- Live modern Prisma Client query succeeded:

```text
modern Prisma User count: 8
```

- Rebuilt and recreated the server container.
- Server container is healthy.
- Schema import succeeds with `graphql-import` 0.7.1.
- `/healthcheck` returns both legacy Prisma and Prisma ORM as OK:

```json
{
  "prisma": { "message": "OK", "status": 200 },
  "prismaOrm": { "message": "OK", "status": "200" }
}
```
- Server Jest tests pass with bridge coverage:

```text
Test Suites: 2 passed, 2 total
Tests: 5 passed, 5 total
```
- Rebuilt and restarted the Docker server image after this resolver slice.
- Server container is healthy and direct GraphQL smoke query returns HTTP 200:

```json
{"data":{"__typename":"Query"}}
```

## Important constraints

- Prisma Client model and relation names are introspected from the Prisma 1 physical database. They are usable, but some relation names are less ergonomic than the original datamodel names.
- The current Prisma Client points at the global `default@default` database. The legacy app can switch Prisma 1 service stages/workspaces dynamically via GraphQL endpoints. Resolver migration must account for workspace routing.
- Until workspace-aware Prisma Client routing exists, migrate only global resolvers or resolvers that are proven to read from the same database URL as `ctx.prisma`.
- The Prisma bridge intentionally supports only the Prisma 1 argument shapes used by migrated global resolvers. Expand it with tests before moving complex workspace resolvers.
- Apollo Server 2 remains in place for now because subscriptions, upload handling, middleware, and generated Prisma forwarding are intertwined.
- Apollo logs a `graphql-upload` CSRF warning. That should be handled during the Apollo migration slice.
- Resolver and middleware validation are currently permissive by design. Tighten them again after generated Prisma forwarding and missing schema imports have been fully removed.

## Recommended next resolver migration order

1. Move auth/current-user internals off `graphql-authentication-prisma` so role/session checks use Prisma Client instead of `ctx.db`.
2. Migrate simple global role queries/mutations for `AppRole` and `AppUserRole`.
3. Migrate simple global email mailbox/message queries that live in the same database.
4. Add workspace-aware Prisma Client routing before moving workspace-scoped media, plan, note, map, chat, and observe resolvers.
5. Move public media/feed queries after workspace routing is proven.
6. Move complex plan/report queries last.
7. Replace subscriptions and forwarded generated Prisma mutations after direct Prisma forwarding is mostly retired.

## Apollo migration order

1. Stop exposing generated Prisma GraphQL schema through direct forwarding.
2. Remove `graphql-import` once generated Prisma GraphQL imports and Prisma forwarding are gone.
3. Replace `subscriptions-transport-ws` with `graphql-ws`.
4. Replace upload handling with explicit, CSRF-protected middleware.
5. Move from `apollo-server-express` v2 to `@apollo/server` with Express middleware.
