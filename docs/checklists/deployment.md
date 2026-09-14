# Deployment checklist

## Before change

- [ ] Approved commit and release tag are immutable and reviewed.
- [ ] [Environment](environment.md) and [security](security.md) gates pass.
- [ ] Clean install, format, lint, typecheck, tests, Prisma validation, and
      production build pass on the pinned runtime.
- [ ] Container images are built, scanned, and recorded by digest.
- [ ] Database migration is rehearsed against a disposable PostgreSQL 18.6
      database and reviewed for locks/data loss.
- [ ] Complete pre-deploy database/private-storage backup is verified and copied
      off host.
- [ ] Rollback owner, last known-good images, maintenance communication, and
      maximum decision time are agreed.

## Deploy

- [ ] Pull the reviewed release without modifying the working tree.
- [ ] Run `docker compose --env-file .env.production config --quiet`.
- [ ] Run migrations and stop if the one-shot service fails.
- [ ] Start application and wait for healthy state before routing traffic.
- [ ] Start/reload Caddy and confirm certificate/canonical-host behavior.
- [ ] Do not seed demo data or keep bootstrap secrets.

## Verify

- [ ] Persian and English public smoke routes return expected status/content.
- [ ] Responsive RTL/LTR and dark/light visual smoke checks pass.
- [ ] Login, permission denial, and cross-tenant denial checks pass.
- [ ] Authorized lead, project, file, ticket, invoice, CMS, redirect, and
      analytics smoke scenarios pass when included in the release.
- [ ] Sitemap, robots, canonicals, hreflang, noindex, and structured data pass.
- [ ] Logs contain correlation data but no secrets/PII; error and latency rates
      are acceptable.
- [ ] A post-deploy backup completes.

## Close

- [ ] Record UTC start/end, operator, commit, image digests, migration head,
      backup set, results, and any accepted exception in `final-report.md` or the
      external release record.
- [ ] Observe through the agreed monitoring window.
- [ ] Remove temporary access/bootstrap variables and securely delete local
      secret copies.
