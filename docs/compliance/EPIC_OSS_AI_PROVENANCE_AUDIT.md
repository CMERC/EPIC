# EPIC OSS, Third-Party, and Source Provenance Audit

Date: 2026-06-28

Scope reviewed:

- Client manifest: `package.json`, `package-lock.json`, installed `node_modules`
- Server manifest: `server/package.json`, `server/package-lock.json`, installed `server/node_modules`
- Source trees: `src`, `server/src`, `public`, selected `dist` generated artifacts
- Container and release materials: `Dockerfile`, `server/Dockerfile`, `docker-compose.yml`, `docker-compose.rocky9.yml`, `release 1.0`
- Embedded assets and license metadata

This is a technical compliance review, not a legal opinion. Counsel should make final determinations on whether a license term creates the legal effect described in deal documents.

## Executive Finding

EPIC cannot currently be certified as satisfying the requested language without additional business/legal remediation.

The primary blockers found were:

1. `server/package.json` included and runtime source imported `rita`, which is GPL-3.0. Remediated in this audit pass.
2. Several shipped SVG assets included Creative Commons GPL 2.0 metadata. Remediated in this audit pass.
3. Runtime/release packaging includes or references components with stronger obligations or unclear commercial fit, especially MinIO AGPL-3.0, MySQL GPL, and `sharp`/libvips LGPL components. Stale release tarballs for MySQL 5.7 and Prisma 1 were remediated in this audit pass.
4. The repository root `LICENSE` currently grants the EPIC code under the MIT License, which is inconsistent with an intended proprietary SaaS/patent commercialization posture unless that grant is intentional.
5. This repository has been modified during Codex sessions. I cannot truthfully certify the requested statement that no EPIC source code "was developed or modified using Generative AI Tools."
6. The repository does not yet contain a formal third-party notices file, SBOM, provenance register, AI-use disclosure, or release license bill of materials.

## Generated Inventory

Generated files:

- `docs/compliance/third-party-node-packages.csv`
- `docs/compliance/third-party-node-summary.json`

Node package inventory summary after remediation:

- Total installed package entries scanned: 2,267
- Majority licenses: MIT, ISC, Apache-2.0, BSD variants
- Flagged license classes: GPL, LGPL, MPL, dual GPL/permissive, unknown metadata

## High-Risk Findings

### 1. GPL-3.0 Runtime Dependency: `rita` - Remediated

Evidence:

- Initial state: `server/package.json` declared `"rita": "^1.3.85"`
- Initial state: installed package `server/node_modules/rita`, version `1.3.94`, license `GPL-3.0`
- Initial state: runtime import and usage in `server/src/noise/generateNoise.js`
- Current state: `rita` removed from `server/package.json` and `server/package-lock.json`
- Current state: Markov/noise generation now uses `server/src/noise/markovTextGenerator.js`

Risk against requested language:

- GPL-3.0 is a strong copyleft license. If EPIC is distributed with GPL-covered code linked into the server application, this may trigger source availability and derivative-work licensing concerns.
- This is the clearest current blocker for certification under clause (i).

Remediation completed:

- Removed `rita` from the server.
- Replaced Markov text generation with local EPIC-owned code.
- Rebuilt/refreshed lockfile and package inventory.

### 2. GPL-Licensed SVG Metadata in Shipped Assets - Remediated

Evidence:

- `src/web/components/service-routes/skeleton/static/images/avatar-default.svg`
- `src/web/components/service-routes/news-skeleton/site_intelligence_group/static/images/avatar-default.svg`
- `src/web/components/service-routes/news-skeleton/ekathimerini/static/images/avatar-default.svg`

Initial versions contained Creative Commons metadata referencing `http://creativecommons.org/licenses/GPL/2.0/`.

Risk against requested language:

- These are shipped assets, not package-manager dependencies.
- Even if the practical risk is limited to the SVG asset, GPL metadata in product assets is incompatible with a clean proprietary provenance story.

Remediation completed:

- Replaced these avatar SVG files with original minimal placeholder assets.
- Targeted source scan no longer finds `creativecommons.org/licenses/GPL` or `GPL/2.0` in source assets.

### 3. MinIO Runtime Images

Evidence:

- `docker-compose.rocky9.yml` uses `minio/minio:RELEASE.2025-04-22T22-12-26Z`
- `docker-compose.rocky9.yml` uses `minio/mc:RELEASE.2025-04-16T18-13-26Z`
- `release 1.0/images` contains MinIO server and client tarballs

Risk against requested language:

- MinIO is generally licensed under AGPL-3.0 in current releases.
- Even when deployed as a separate service, AGPL introduces material obligations and should be reviewed before including MinIO in a commercial SaaS distribution.

Recommended remediation:

- Prefer Azure Blob Storage, AWS S3, or another hosted object store for SaaS deployment.
- If MinIO must remain, obtain commercial licensing or document AGPL compliance obligations.
- Do not distribute MinIO tarballs in proprietary release bundles without legal approval.

### 4. MySQL Runtime Images - Partially Remediated

Evidence:

- `docker-compose.rocky9.yml` uses `mysql:8.4`
- `release 1.0/docker-compose.yml` uses `mysql:8.4`
- Initial state: `release 1.0/images` contained stale `mysql_5.7.tar`
- Current state: `mysql_5.7.tar` removed and `mysql_8.4.tar` saved
- `release 1.0/RELEASE_MANIFEST.md` claims `mysql:8.4`

Risk against requested language:

- MySQL Community Server is GPL-licensed.
- SaaS use of an external database is usually different from redistributing a MySQL image/tarball with EPIC, but bundling database images in release artifacts creates third-party distribution obligations.
- The stale `mysql_5.7.tar` contradiction has been remediated.
- MySQL GPL redistribution remains a business/legal decision if EPIC distributes database images.

Recommended remediation:

- For SaaS, use a managed database service or require customer-provided MySQL-compatible infrastructure.
- If distributing database images, include notices/source-offer process reviewed by counsel.
- Regenerate `release 1.0` so packaged images match the manifest.

### 5. Stale Prisma 1 Runtime Image in Release Bundle - Remediated

Evidence:

- Initial state: `release 1.0/images/prismagraphql_prisma_1.34.10.tar` existed.
- Current state: the stale Prisma 1 tarball has been removed.

Risk against requested language:

- Inconsistent release inventory and potential accidental redistribution of obsolete third-party runtime.
- Undermines certification that third-party software is accurately catalogued.

Remediation completed:

- Deleted stale Prisma 1 image tarball from release artifacts.
- Targeted scan no longer finds `prismagraphql_prisma_1.34.10` in release files outside this audit document.

### 6. `sharp` / libvips LGPL Components

Evidence:

- `server/package.json` declares `"sharp": "^0.34.5"`
- `server/src/resolvers/Mutation/upload.js` imports and uses `sharp`
- Installed `@img/sharp-*` packages include Apache-2.0 and LGPL-3.0-or-later components via libvips/native libraries.

Risk against requested language:

- LGPL is weaker than GPL but can impose conditions around relinking, notices, and library modification.
- This may be acceptable in many commercial products, but it is a material license condition and should be tracked.

Recommended remediation:

- Keep only if counsel approves LGPL runtime use and notices are provided.
- Consider replacing image resizing with a managed cloud image service or a fully permissive alternative if the deal terms require avoiding LGPL entirely.

### 7. Repository Root MIT License

Evidence:

- Root `LICENSE` is MIT and names EPIC.

Risk against requested language:

- If this repository has been shared or published under that license, it grants broad rights to use, copy, modify, distribute, sublicense, and sell the EPIC source.
- That may directly conflict with patent/product commercialization assumptions unless intentionally approved.

Recommended remediation:

- Confirm whether the MIT license is intentional.
- If EPIC is proprietary, replace with proprietary license text and add copyright notices.
- Counsel should evaluate any prior distribution under MIT because license grants already made may not be revocable for recipients.

### 8. Unknown License Metadata

Several packages lack package-manager license metadata but have permissive license files or README notices. Examples:

- `cli-table`: local license file indicates MIT
- `png-js`: local license file indicates MIT
- `prisma-json-schema`: local license file indicates Apache-2.0
- `replaceall`: README links MIT
- `union`: local license file indicates MIT
- Apollo GraphQL language-service packages have unknown package metadata in this install; external verification or package replacement is recommended.

Risk against requested language:

- Unknown metadata does not automatically mean non-compliance, but it prevents clean automated certification.

Recommended remediation:

- Add a reviewed override file for packages with verified licenses.
- Prefer SPDX-capable tooling and generate a locked SBOM during CI.

## Dual-Licensed Packages

These can likely be used under permissive alternatives, but the election should be documented:

- `jszip`: MIT or GPL-3.0-or-later. EPIC should elect MIT.
- `node-forge`: BSD-3-Clause or GPL-2.0. EPIC should elect BSD-3-Clause.
- `dompurify`: Apache-2.0 or MPL-2.0. EPIC should elect Apache-2.0.

## Embedded Assets and Data Requiring Provenance Review

Items needing source/license documentation:

- `src/map/assets/milsymbol/2525d/*.json`
- `src/map/assets/milsymbols.json`
- `server/database/seed.graphql` military task/JMET-like data
- `server/src/fonts/Roboto-*.ttf`
- `src/shared/assets/*.svg`, app logos, service logos, generated launcher image
- `src/web/components/service-routes/**/static/images/*`
- `dist/Assets`, `dist/Widgets`, `dist/Workers` generated Cesium assets

Some may be legitimate via package dependency or government/public-domain sources, but they need explicit catalog entries and notices.

## Container and System Dependency Inventory

Runtime/build images referenced:

- `node:22-bookworm-slim`
- `nginx:1.27-alpine`
- `caddy:2.8-alpine`
- `mysql:8.4`
- `redis:7-alpine` / `redis:alpine`
- `minio/minio:RELEASE.2025-04-22T22-12-26Z`
- `minio/mc:RELEASE.2025-04-16T18-13-26Z`
- `apisguru/graphql-faker:latest`
- `traefik:alpine`
- `emilevauge/whoami`

Recommendation:

- Separate production SaaS dependencies from dev/test dependencies.
- Do not ship dev-only services such as `graphql-faker` and `whoami` in production release bundles.
- Pin image digests and record licenses in an image SBOM.

## AI/Generative Tool Provenance

The requested representation says EPIC source code was not developed or modified using Generative AI Tools.

I cannot certify that statement. This repository has been modified during Codex sessions, including UI, migration, stabilization, and documentation work. The truthful position is that at least some source code and documentation has been developed or modified with AI assistance.

Recommended remediation:

- Create an AI provenance log describing AI-assisted commits and human review.
- Decide with counsel whether AI-assisted code is acceptable if reviewed and owned under company policy.
- If the transaction language cannot allow AI-assisted code, affected commits must be identified and rewritten/reimplemented by non-AI contributors under documented process.

## Source Possession, Cataloguing, and Documentation

Positive signals:

- Source is in Git with commits/tags and pushed to GitHub.
- There are migration, modernization, and release docs.
- There are tests for several server services and timeline query behavior.

Gaps:

- No formal SBOM committed before this audit.
- No `THIRD_PARTY_NOTICES.md`.
- No source provenance register for assets and copied data.
- Many large generated artifacts are committed under `dist`, making source/package distinction harder.
- Comments are uneven. Some modules are documented well; others have sparse or stale comments.
- Release folder had stale images inconsistent with the manifest; the known stale MySQL 5.7 and Prisma 1 image tarballs were removed in this audit pass.

Recommended remediation:

- Add `docs/compliance/THIRD_PARTY_NOTICES.md`.
- Add CI step to generate an SBOM and fail on prohibited licenses.
- Add `docs/compliance/PROVENANCE.md` for assets, data, AI use, and copied code.
- Remove or stop tracking generated `dist` unless release process requires it.
- Rebuild release bundles from source in CI and attach SBOMs.

## Recommended Remediation Order

1. Decide MinIO strategy: hosted object storage, commercial license, or AGPL compliance path.
2. Decide MySQL strategy: managed DB/customer DB versus redistributed image compliance.
3. Decide `sharp`/LGPL acceptability or replace image resizing.
4. Replace root MIT license if EPIC is intended to be proprietary.
5. Add `THIRD_PARTY_NOTICES.md`, SBOM generation, and prohibited-license CI gate.
6. Add provenance records for assets, data, fonts, and AI-assisted commits.
7. Ask counsel to review dual-license elections and container image obligations.
8. Review generated release images and remove dev-only images from production bundles if not required.

Completed in this audit pass:

- Removed/replaced `rita` GPL-3.0.
- Replaced GPL-metadata avatar SVG assets.
- Removed stale `release 1.0/images/mysql_5.7.tar`.
- Removed stale `release 1.0/images/prismagraphql_prisma_1.34.10.tar`.
- Added `release 1.0/images/mysql_8.4.tar`.

## Certification Readiness

Current state: not ready to certify.

After remediation, EPIC may be able to certify a narrower technical statement such as:

- Third-party software has been inventoried.
- Known copyleft runtime dependencies have been removed or approved.
- Required notices are included.
- Production release artifacts match the manifest.
- AI-assisted source modifications have been disclosed and reviewed.

The original requested statement, especially the absolute no-Generative-AI representation, is not accurate for the current repository history.
