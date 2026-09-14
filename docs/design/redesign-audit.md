# RYCODE redesign audit

## Scope

The codebase already contains the public marketing site, authenticated customer workspace, staff admin, CMS, SEO, analytics, finance, support, lead and file workflows. The redesign must preserve the server-side permission checks and existing actions while making these experiences read as one product.

Current implementation focus: the client-facing public frontend and its conversion paths. Authenticated workspace observations are recorded for the next phase and are not part of this public-site pass.

## Existing route map

- Public: `/`, `/services`, `/solutions`, `/problems`, `/industries`, `/projects`, `/blog`, `/about`, `/search`, `/start-project`, `/technical-review`, `/seo-audit`, `/contact`, plus localized `/en/*` routes.
- Customer: `/dashboard`, `/dashboard/requests`, `/dashboard/projects`, `/dashboard/projects/:id`, `/dashboard/files`, `/dashboard/payments`, `/dashboard/support`, `/dashboard/support/:id`, `/dashboard/notifications`, `/dashboard/profile`.
- Admin: `/admin`, `/admin/leads`, `/admin/customers`, `/admin/projects`, `/admin/files`, `/admin/finance`, `/admin/support`, `/admin/content`, `/admin/seo`, `/admin/analytics`, `/admin/users`, `/admin/roles`, `/admin/logs`, `/admin/settings`.

## Findings

### Strengths to preserve

- RYCODE graphite, orange and warm ivory palette.
- IranYekan for Persian and local Space Grotesk for English/technical metadata.
- Public editorial composition, thin borders, controlled radius and image-first storytelling.
- Server-side `Actor` permission model and scoped query layer.
- Existing actions for approvals, uploads, support, finance, CMS and lead workflows.

### High-value UX issues

- Customer home was metric-first and did not answer what needs attention, what happens next, or what RYCODE is currently doing.
- Admin home was a row of equal metric cards without an operational priority order.
- Customer and admin navigation used the same flat visual rhythm even though their densities and goals differ.
- Status, action and empty-state patterns were repeated ad hoc across pages.
- Workspace screens had limited context around project phase, next action and ownership.
- Public pages now have a strong editorial layer, but authenticated surfaces needed the same brand language with calmer density.

### Responsive and RTL risks

- Tables need horizontal overflow or a compact row treatment on small screens.
- Customer and admin navigation must remain usable as a horizontal rail on mobile and a fixed sidebar on desktop.
- Mixed Persian/English identifiers need `dir="ltr"` where appropriate.
- Actions must remain visible without relying on hover or drag-and-drop.

## Redesign priority

1. Global tokens and shared workspace primitives.
2. Workspace navigation architecture.
3. Customer dashboard and project context.
4. Admin overview and attention queue.
5. Leads, projects, finance, support and CMS detail screens.
6. Public conversion flows and hub pages.
7. Loading, empty, error and responsive QA across all route groups.

## Definition of done

A screen is redesigned only when its hierarchy, action priority, states, density, responsive behavior, RTL/LTR behavior and accessibility are coherent with the rest of the product. No new UI should imply a capability or data source that does not exist.
