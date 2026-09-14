# Owner acceptance checklist

This is a human acceptance gate, not a substitute for automated tests. Review on
the release candidate using realistic but synthetic data.

## Brand and public experience

- [ ] The owner accepts the Persian home page against the `lovable-final-ui`
      reference at desktop and mobile widths.
- [ ] Ivory/graphite/orange palette, typography, spacing, rules, radii, and logo
      treatment match the approved design intent in light and dark modes.
- [ ] Persian RTL order and English LTR order feel native; language switching
      preserves the equivalent destination when available.
- [ ] All approved public routes, menus, footer links, CTAs, forms, empty/error
      states, and 404 behavior are present.
- [ ] Concept/demo projects and articles are clearly labeled and no invented
      customer, outcome, revenue, or testimonial is presented as real.

## Leads and communication

- [ ] Start-project, technical-review, SEO-audit, and contact flows ask for the
      approved information and show accessible success/failure states.
- [ ] Duplicate submission and abuse behavior is acceptable.
- [ ] Administrator can triage a lead and activity history is understandable.

## Customer workspace

- [ ] A customer sees only their own projects, members, milestones, files,
      tickets, invoices, installments, payments, and notifications.
- [ ] Milestone review/approval and file download behavior matches the agreed
      workflow.
- [ ] Profile and session behavior is understandable on desktop/mobile.

## Administration

- [ ] The owner can manage users/roles, customers, leads, projects, milestones,
      files, tickets, invoices/payments, CMS content, taxonomies, redirects,
      settings, and analytics included in the release.
- [ ] Dangerous actions require clear confirmation and preserve required audit
      history.
- [ ] Draft/preview/publish and Persian/English content workflows match the
      editorial process.

## Search, SEO, analytics, and operations

- [ ] Search results and empty states are relevant in both languages.
- [ ] Share previews, sitemap, canonical/hreflang, structured data, and redirects
      have been sampled on the production hostname.
- [ ] Consent and analytics reports match the approved privacy expectations.
- [ ] Owner knows how to deploy, inspect health/logs, create backups, initiate a
      restore with an operator, and rotate secrets.
- [ ] An isolated backup restore drill has passed and its recovery time is
      acceptable.

## Sign-off

```text
release commit/tag:
environment:
accepted exceptions and expiry:
owner name:
owner signature/approval reference:
accepted at UTC:
```

- [ ] I understand this release does not migrate Supabase production data or
      users because none exist.
- [ ] I approve removal of the legacy runtime only after the parity evidence
      above is attached.
- [ ] I authorize production release of the exact recorded artifact.
