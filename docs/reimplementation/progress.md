# Reimplementation progress

Status snapshot: **2026-09-09**.

## Completed

- Clean Next.js 16/React 19 bilingual public, auth, customer, admin, API, and SEO application.
- Clean 62-model PostgreSQL/Prisma domain with three forward migrations and deterministic RBAC seed.
- Better Auth, server-side RBAC and live tenant membership checks.
- Leads, clients, projects, milestones, private files, support, finance, notifications, settings, audit, CMS, redirects, search, and first-party analytics workflows.
- Rich content, taxonomies, authors, FAQs, media metadata, scheduled publishing, and expanded Persian/English marketing pages.
- Docker/Caddy/ClamAV topology plus backup, restore, environment, and acceptance runbooks.

## Tested

- Prisma validation, ESLint, TypeScript, and production build pass.
- 104 unit/security/CMS tests pass in 16 files.
- 5 integration tests pass on a disposable PostgreSQL 18.6 database.
- All three migrations and the seed apply to a fresh empty database.
- 8 public Playwright tests pass on current Chromium desktop/mobile; 4
  credential-gated authenticated cases are skipped in the anonymous run.
- Previous evidence includes 6 authenticated browser scenarios, live Better
  Auth verification, clean frozen install, dependency audit, and a logical
  database dump/restore drill.

## Remaining

- Rehearse the full Compose topology and ClamAV/EICAR path on the target Linux host.
- Configure real SMTP, DNS, TLS, monitoring, retention, and production secrets.
- Repeat backup/private-volume restore against the current migration head and store evidence off-host.
- Complete owner visual, factual-content, workflow, responsive, RTL/LTR, and theme acceptance.
- Remove inactive legacy reference source only after owner parity approval.

## Known Issues

- Docker runtime validation cannot run on this workstation because its Docker daemon is unavailable.
- Production infrastructure credentials and domain ownership are intentionally absent from the repository.
- Production-scale latency, accessibility assistive-technology coverage, and real-device matrix results are not yet recorded.

## Feature / Visual Parity Risk

Core product workflows and the approved visual language have been ported, but
owner verification is still required for exact copy, factual claims, imagery,
responsive details, and every legacy reference route. Preserving the inactive
reference source limits this risk until acceptance.

## Next Phase

Target-host production rehearsal and owner acceptance, followed by deliberate
legacy-reference removal and release sign-off.
