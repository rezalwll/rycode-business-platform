# RYCODE final engineering report

Status date: **2026-09-09**. This report describes the implemented clean
reimplementation and its verified state. It is not a production deployment
sign-off; the remaining environment and owner gates are listed below.

## 1. Executive Summary

RYCODE is now a bilingual website, customer workspace, CMS, and internal
business platform on a clean Next.js/PostgreSQL foundation. The Lovable project
is preserved only as a visual, route, and product reference. No Supabase data,
users, password hashes, sessions, storage objects, or analytics history are
migrated.

The application builds successfully, all current unit and integration tests
pass, and all three migrations apply to a fresh PostgreSQL 18.6 database. The
remaining launch gates require the target Linux/Docker environment, production
SMTP/DNS/TLS, operational restore rehearsal, and owner acceptance.

## 2. Final Technology Stack

| Component                    | Pinned version / target       |
| ---------------------------- | ----------------------------- |
| Node.js                      | 24.20.0                       |
| pnpm                         | 11.19.0                       |
| Next.js                      | 16.3.4                        |
| React / React DOM            | 19.2.8                        |
| TypeScript                   | 6.0.3                         |
| Tailwind PostCSS integration | 4.3.3                         |
| Prisma / Prisma Client       | 7.8.0                         |
| PostgreSQL                   | 18.6                          |
| Better Auth                  | 1.7.3                         |
| Tiptap                       | 3.31.3                        |
| Zod                          | 4.5.4                         |
| Vitest / Playwright          | 4.1.11 / 1.63.0               |
| Runtime delivery             | Docker Compose, ClamAV, Caddy |

## 3. Architecture Diagram

```text
Browser
  -> Caddy: TLS, compression, request limits
    -> Next.js App Router
       -> Server Components: scoped reads
       -> Server Actions / Route Handlers: validation and rate limits
          -> authentication and authorization policies
             -> domain/service transactions and audit writes
                -> Prisma -> PostgreSQL 18
                -> private opaque storage -> ClamAV quarantine scan
```

The browser never receives database credentials and never authorizes itself.
Business rules live below the route and component layers.

## 4. Legacy Reference → Clean Reimplementation Summary

Useful design language, routes, bilingual content concepts, and product
workflows were reimplemented. Browser-side Supabase access, Supabase Auth/RLS,
legacy storage, and production-data compatibility were not carried forward.
The inactive reference source remains until owner visual and feature-parity
acceptance, after which it may be removed deliberately.

## 5. Database Architecture and Clean Schema

The Prisma schema contains 62 relational models across identity/RBAC, clients,
leads, projects, milestones, files, tickets, finance, notifications, CMS,
settings, analytics, and audit logs. UUID keys, foreign keys, composite keys,
enums, unique constraints, query indexes, and database-native checks protect the
domain. Three forward migrations create the base schema, PostgreSQL full-text
and trigram search indexes, and consent-aware lead attribution.

## 6. Authentication Architecture

Better Auth uses the Prisma adapter and server-managed sessions. Registration,
email verification, login, logout, password recovery, secure production cookie
behavior, and session revocation are implemented. The deterministic seed may
bootstrap one strong initial administrator on a fresh database; bootstrap
credentials must then be removed.

## 7. Security Improvements

Server-only secrets, strict Zod boundaries, same-origin mutation patterns,
rate limits, honeypot/timing controls, opaque private file keys, signature
validation, quarantine scanning, safe internal redirects, bounded analytics
metadata, and HMAC pseudonymous identifiers replace the prototype trust model.
Production startup fails closed without a changed auth secret, SMTP, and ClamAV.

## 8. Authorization Architecture

Authentication and authorization are separate. Persisted roles and permissions
combine with live active client/project memberships. Reads and mutations check
the exact permission and tenant scope in policies/services. Role replacement is
audited and cannot remove the final super-administrator. Revoked membership is
rechecked at mutation time.

## 9. Customer Workflows

Customers can view their scoped projects, milestones, approvals, activity,
files, invoices and balances, tickets, notifications, and profile. Cross-tenant
records and files are denied server-side. Public project/contact/audit forms use
validated persistence with clear success and failure states.

## 10. Admin Workflows

Permission-scoped administration covers leads and activities, client records
and memberships, project/milestone management, files, tickets, invoices,
payments and installments, notifications, users/roles, redirects, site
settings, analytics, and audit logs. Lead conversion and financial writes use
transactional service rules rather than component-local mutations.

## 11. File Storage

Files are stored outside `public/` under opaque keys. Uploads begin in
quarantine, are validated by signature and size, scanned with ClamAV, and become
downloadable only when clean. Streaming re-resolves the authenticated actor and
current resource membership; database metadata never exposes a host path.

## 12. CMS / Content Graph

CMS content supports localized articles, services, solutions, problems,
industries, integrations, and case studies. Categories, tags, authors, FAQs,
featured media metadata, publication scheduling, archives, and typed content
relations are represented in the schema. Admin editing covers content,
taxonomies, authors, FAQs, media metadata, and rich Tiptap JSON plus searchable
plain text. Only approved translations can render publicly.

## 13. Bilingual Architecture

Persian is the canonical RTL default; English is LTR under `/en`. Localized
navigation, route resolution, metadata, content, forms, workspaces, and admin
surfaces share one domain model. `/fa` requests redirect to canonical unprefixed
Persian paths.

## 14. SEO Architecture

The implementation emits canonical and hreflang metadata, Open Graph fields,
JSON-LD, dynamic sitemap and robots output, and safe managed redirects. Draft,
archived, future-scheduled, and `noIndex` content cannot leak into search or the
sitemap. A CMS-owned slug suppresses the static fallback even while withdrawn.

## 15. Search Architecture

Static reference content is searched in bounded memory. CMS search runs in
PostgreSQL with `simple` full-text vectors, `pg_trgm`, GIN indexes, parameterized
queries, rank ordering, a 50-result cap, normalized Persian characters, and
publication/locale/noindex filters. A real-database test verifies a published
hit and exclusion of future scheduled content.

## 16. Analytics Architecture

First-party analytics records allow-listed events only after consent. Raw IP,
raw identifiers, search terms, form fields, email, phone, and message bodies are
not stored as analytics. Lead attribution sends a pair of ephemeral UUIDs,
hashes both on the server, and links only an existing matching `GRANTED`
session. Admin reporting includes traffic, CTA/form/search funnel counts, lead
conversion, and source/medium/campaign aggregates.

## 17. Testing

| Gate                              | Current evidence                                                                     |
| --------------------------------- | ------------------------------------------------------------------------------------ |
| Prisma schema validation          | Passed                                                                               |
| ESLint / TypeScript               | Passed                                                                               |
| Unit, security, CMS tests         | **104 passed in 16 files**                                                           |
| PostgreSQL integration            | **5 passed** against disposable PostgreSQL 18.6                                      |
| Public browser suite              | **8 passed** on fresh Chromium desktop/mobile; 4 credential-gated auth cases skipped |
| Authenticated browser suite       | 6 customer/admin tests passed previously                                             |
| Production build                  | Passed; 20 static pages plus dynamic app/API routes                                  |
| Frozen install / production audit | Passed previously; no known production vulnerabilities                               |

Integration coverage includes finance atomicity, stale-membership denial,
database check constraints, indexed CMS search, scheduled-content exclusion,
and consent-aware lead attribution.

## 18. Performance

Server Components minimize client data transfer; database reads are scoped and
indexed; public content queries are cached; search ranks only bounded hits;
analytics metadata and reporting windows are bounded. Image/media payloads and
real target-host latency still require production-like measurement.

## 19. Accessibility

Semantic landmarks, labels, focus styles, keyboard-usable controls, reduced
motion handling, contrast-aware themes, RTL/LTR direction, and localized error
states are implemented. Final assistive-technology and owner visual review on
the production browser/device matrix remains an acceptance gate.

## 20. Deployment

The repository defines a standalone Next.js image, one-shot migration service,
PostgreSQL 18, ClamAV, private volumes, internal networking, health checks, and
Caddy TLS proxy. The workstation Docker daemon was unavailable, so the complete
Compose topology must still be rehearsed on the target Linux host.

## 21. Backup & Restore

Documented scripts and runbooks cover PostgreSQL custom-format dumps, private
storage, manifests/checksums, retention, isolated restore, and a destructive
restore confirmation guard. An earlier local logical dump/restore drill passed;
the current three-migration schema and private volume must be rehearsed together
off-host before launch.

## 22. Remaining Limitations

- Target-host Compose, health, TLS, ClamAV/EICAR, and failure-mode rehearsal is pending.
- Production SMTP, DNS records, certificates, monitoring thresholds, and retention policy are not configured.
- Owner approval of copy, factual claims, visual parity, responsive themes, and workflows is pending.
- The preserved legacy reference should not be deleted before that approval.
- Real traffic performance, accessibility assistive-technology review, and current-schema restore rehearsal remain launch gates.

## 23. Deferred External Integrations

No external analytics SaaS, payment gateway, S3-compatible object store, CRM,
accounting system, or messaging provider was introduced. The schema/service
boundaries allow later adapters, but adding one requires an explicit product,
privacy, security, and operational decision. SMTP is required for launch and is
configuration, not a hidden application dependency.

## 24. Production Environment Variables

Required core variables are `NEXT_PUBLIC_APP_URL`, `DATABASE_URL`,
`BETTER_AUTH_URL`, `BETTER_AUTH_SECRET`, `AUTH_EMAIL_MODE=smtp`, `SMTP_HOST`,
`SMTP_PORT`, `SMTP_SECURE`, `SMTP_FROM`, `CLAMAV_HOST`, `CLAMAV_PORT`, and
`PRIVATE_STORAGE_ROOT`. `SMTP_USER` and `SMTP_PASS` must be set together when
authentication is required. Bootstrap administrator variables are one-time only
and must not remain in the runtime environment. Secrets must come from the
deployment secret store, never committed files or image layers.

## 25. Deployment Checklist

Use `docs/checklists/deployment.md`. At minimum: immutable reviewed release,
clean verification, scanned image digests, disposable migration rehearsal,
verified off-host backup, successful one-shot migrations, healthy application
before traffic, TLS/canonical-host verification, authorization smoke tests,
post-deploy backup, monitoring window, and recorded release evidence.

## 26. Security Checklist

- [x] Database and file storage are not publicly reachable by design.
- [x] Server-side permission and live membership checks are implemented.
- [x] Input, redirect, upload, and analytics allow-lists are implemented.
- [x] Raw analytics identifiers and IP addresses are not persisted.
- [x] Production configuration fails closed for auth secret, SMTP, and ClamAV.
- [ ] Rotate and install real production secrets.
- [ ] Run image/dependency scanning and EICAR denial on the target host.
- [ ] Complete final security, log-redaction, backup-access, and incident review.

## 27. Fresh Database and Feature-Parity Verification

On 2026-09-09, migrations `20260908000100_init`,
`20260909000100_content_search`, and `20260909000200_lead_attribution` were
applied successfully to a newly created empty PostgreSQL 18.6 database, the RBAC
seed completed, and all 5 integration tests passed. The disposable database and
role were then removed. The public Chromium desktop/mobile suite passed 8 tests
against a second fresh database, which was also removed. `pnpm build` completed
successfully after the application changes.

Engineering parity is substantially implemented; final visual/content parity
is intentionally an owner decision. The release verdict remains **not
production signed off** until Sections 20–22 and the owner acceptance checklist
are complete.
