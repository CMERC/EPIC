# Prisma and Apollo Migration Status

Date: 2026-05-24

## Current migration strategy

This app exposes much of the Prisma 1 generated GraphQL API directly through `forwardTo('db')`, `ctx.db.query.*`, `ctx.db.mutation.*`, and `ctx.db.subscription.*`. A single cutover to Prisma Client would require rewriting most resolvers and the subscription layer at once.

The active migration strategy is therefore a bridge:

- Keep Prisma 1 / `prisma-binding` running for existing application behavior.
- Add Prisma ORM / Prisma Client against the existing Prisma 1 MySQL service database.
- Add `ctx.prisma` to Apollo context for new or migrated resolver code.
- Move resolver groups from `ctx.db` to `ctx.prisma` incrementally.
- Move Apollo after Prisma forwarding and subscriptions are no longer tightly coupled to Apollo Server 2 behavior.

## Completed in this slice

- Added Prisma ORM 6.19.3 and `@prisma/client` 6.19.3.
- Introspected the live Prisma 1 MySQL database `default@default` into `server/prisma/schema.prisma`.
- Generated a working Prisma Client from the introspected schema.
- Added `server/src/services/prisma.js`:
  - `getLegacyPrisma()` returns the existing Prisma 1 binding.
  - `prismaClient` is the modern Prisma Client singleton.
- Added `ctx.prisma` to Apollo context.
- Updated global/workspace middleware to use the shared legacy Prisma factory.
- Added a Prisma ORM probe to `/healthcheck`.
- Added `DATABASE_URL` to Docker Compose and local Rocky env.
- Updated the server Dockerfile to run `npm ci --omit=dev` and generate Prisma Client during image build.
- Moved legacy `prisma1` and `graphql-cli` to production dependencies because the entrypoint still needs them until the generated Prisma GraphQL schema is retired.
- Updated the entrypoint to call local legacy binaries instead of relying on `npx` executable guessing.

## Verified

- `npx prisma db pull --schema prisma/schema.prisma` introspected 72 models.
- `npm run prisma:client` generated Prisma Client.
- Live modern Prisma Client query succeeded:

```text
modern Prisma User count: 8
```

- Rebuilt and recreated the server container.
- Server container is healthy.
- `/healthcheck` returns both legacy Prisma and Prisma ORM as OK:

```json
{
  "prisma": { "message": "OK", "status": 200 },
  "prismaOrm": { "message": "OK", "status": "200" }
}
```

## Important constraints

- Prisma Client model and relation names are introspected from the Prisma 1 physical database. They are usable, but some relation names are less ergonomic than the original datamodel names.
- The current Prisma Client points at the global `default@default` database. The legacy app can switch Prisma 1 service stages/workspaces dynamically via GraphQL endpoints. Resolver migration must account for workspace routing.
- Apollo Server 2 remains in place for now because subscriptions, upload handling, middleware, and generated Prisma forwarding are intertwined.
- Apollo logs a `graphql-upload` CSRF warning. That should be handled during the Apollo migration slice.

## Recommended next resolver migration order

1. Low-risk read-only queries that return simple lists or counts.
2. Auth/current-user queries that read from `User`, `AppWorkspace`, `AppUserRole`, and `AppRole`.
3. Simple mutations that create/update a single table and do not rely on Prisma 1 nested mutation syntax.
4. Public media/feed queries.
5. Complex plan/report queries.
6. Subscriptions and forwarded generated Prisma mutations.

## Apollo migration order

1. Stop exposing generated Prisma GraphQL schema through direct forwarding.
2. Replace `graphql-import` schema loading with GraphQL Tools loaders.
3. Replace `subscriptions-transport-ws` with `graphql-ws`.
4. Replace upload handling with explicit, CSRF-protected middleware.
5. Move from `apollo-server-express` v2 to `@apollo/server` with Express middleware.
