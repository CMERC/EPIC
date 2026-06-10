# EPIC Ready SaaS Readiness Roadmap

This roadmap captures the major improvements needed for EPIC Ready to operate as a workspace-based SaaS platform for planning, executing, observing, and reviewing military exercises.

## Phase Order

1. Harden multi-tenant isolation
   - Make workspace scoping impossible to bypass in normal application paths.
   - Add cross-workspace read/write regression tests.
   - Prefer data-layer tenant constraints over client-supplied trust.

2. Upgrade authentication for SaaS/customer use
   - Add MFA-ready account flows.
   - Prepare SSO/SAML/OIDC integration points.
   - Improve session controls, invite flows, account recovery, and workspace-specific roles.

3. Create customer/admin billing and provisioning
   - Add customer/account lifecycle fields: trial, active, suspended, archived.
   - Add plan tier, seat limits, storage limits, module entitlements, and billing contacts.

4. Add a true exercise lifecycle model
   - Make Exercise the central object for MSEL, maps, media, chat, commands, observations, timeline, hot wash, AAR, and exports.

5. Build an executive exercise control dashboard
   - Show exercise clock, active injects, participant status, recent observations, command acknowledgements, map events, media activity, unresolved issues, and timeline feed.

6. Make hot wash and AAR first-class workflows
   - Turn observations, commands, inject responses, media posts, chat, and timeline events into guided hot wash and AAR/IP outputs.

7. Add audit logging and compliance-grade traceability
   - Track who viewed, changed, exported, deleted, archived, and acknowledged critical records.
   - Track login history, role changes, workspace access changes, file access, and command actions.

8. Improve operational reliability and observability
   - Add structured logs, request IDs, metrics, dependency health, backup status, job queue visibility, and admin alerts.

9. Complete a performance and scale pass
   - Optimize route-level code splitting, pagination, query limits, DB indexes, file handling, map asset loading, subscriptions, and timeline aggregation.

10. Complete security hardening
    - Lock down CORS, headers, uploads, file scanning, rate limits, secrets, object storage permissions, public links, GraphQL production behavior, and role enforcement.

## Current Status

- Version `v1.1` is the baseline checkpoint before this SaaS-readiness effort.
- Phase 1 has started.
  - Added explicit resolved workspace context on GraphQL requests: `ctx.activeWorkspace`, `ctx.workspace`, and `ctx.tenant`.
  - Restricted unauthenticated workspace-by-name access to known public workspace fields only.
  - Prevented private fields from using `data.workspace` to bypass membership checks.
  - Added workspace isolation regression tests.
  - Registered `exerciseTimelineItems` under auth and workspace middleware.
