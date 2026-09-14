# Legacy Lovable/Supabase audit

Audit snapshot: 2026-09-07 at the tagged visual baseline `lovable-final-ui`.
The legacy implementation is a reference, not a migration source.

## Inventory

- 188–193 source files were observed during the transition (the count changed
  as new Next.js files were added).
- 88 legacy TSX route files cover public marketing/content, lead forms, login,
  customer dashboard, administration, CMS, SEO, and analytics screens.
- Two Supabase migration files define 27 public tables, including leads,
  projects, milestones, tickets, invoices/payments, content, redirects,
  analytics, profiles, roles, and audit-like activity logs.
- The prototype uses browser-side Supabase queries and Supabase Auth. No real
  production customers, business records, file objects, or users require
  preservation.
- Only a sitemap API route was observed in the legacy route tree; many business
  mutations were issued directly from browser code.

## Product/UI concepts to preserve

- Warm ivory canvas, graphite sections, orange accent, tight editorial rules,
  small corner radii, and the IRANYekan Persian typeface
- Persian-first RTL experience with an English LTR counterpart
- Public information architecture for services, solutions, problems,
  industries, integrations, project/case-study concepts, articles, FAQs, and
  trust/process pages
- Lead entry points for project start, technical review, SEO audit, and contact
- Separate customer and administration workspaces covering projects,
  milestones, files, support, invoices/payments, content, redirects, analytics,
  users, roles, and settings

These are behavioral requirements, not a mandate to preserve component or SQL
implementation.

## Defects that must not be carried forward

- Public browser-to-database access made authorization depend on a complex RLS
  surface and exposed mutation capability too close to untrusted clients.
- Public insert policies with broadly true checks permitted spoofable lead,
  contact, and analytics attributes unless every field was independently
  constrained.
- Function execute privileges and some role/membership policies were too broad
  for a least-privilege system.
- Several project, milestone, ticket, profile, and activity relationships lacked
  the centralized tenant/resource policy required for consistent isolation.
- Cascade behavior could remove business history in ways that need explicit
  retention decisions.
- The route shell wrapped authenticated workspaces in public chrome and nested
  the English experience inside Persian assumptions.
- The logo asset can show a white rectangle on dark surfaces.
- English coverage, milestone approval, redirect consumption, file lifecycle,
  project membership, and analytics taxonomy/page-view tracking were incomplete.
- Legacy `.env` was already tracked. Adding it to `.gitignore` does not remove it
  from the index; remove it from tracking and rotate any non-public credential
  that may ever have been committed.

## Clean replacement decisions

- New PostgreSQL schema and migrations; no Supabase table-by-table data import
- Better Auth tables and fresh accounts; no password-hash/session compatibility
- Explicit clients and client/project membership
- Server-side role/permission and resource authorization
- Transactional lead/project and finance workflows with audit records
- Private storage with metadata, visibility, scan state, and authorized streams
- Localized CMS translations and canonical SEO data
- First-party analytics sessions/events with data minimization
- Docker, Caddy, backup, restore, and owner-run acceptance gates

## Removal gate

Do not delete the legacy application merely because migration is unnecessary.
Keep it until representative public pages, forms, authentication, customer and
admin flows, metadata, responsive states, and design tokens have parity evidence.
Then remove Supabase/Lovable/TanStack/Vite-specific runtime code, old lockfiles,
and tracked legacy environment data in a reviewable change. Preserve the
`lovable-final-ui` tag as the visual reference.
