# First-party analytics

RYCODE analytics is first-party and stored in PostgreSQL. It measures product
and content behavior without delegating user data to an external analytics SaaS.

## Privacy contract

- Do not record page contents, passwords, message bodies, form field values,
  filenames, invoice details, email addresses, phone numbers, or auth tokens.
- Generate pseudonymous analytics/session identifiers. Do not use the Better
  Auth session token as an analytics identifier.
- Respect consent state and browser privacy signals according to the approved
  policy. Essential security/audit logs are a different purpose and dataset.
- If network data is used for abuse prevention, minimize or irreversibly
  transform it before analytics storage; document retention separately.
- Provide retention/deletion jobs and exclude known staff/test traffic where
  feasible.

## Event envelope

Every accepted event has a server-generated timestamp and a strict allow-listed
name. The server derives trustworthy attributes such as host and request
context; the browser may provide only validated presentation context.

```text
event name
analytics session id
localized path and normalized page type
content id/type when applicable
referrer host / campaign allow-list
device and viewport buckets
consent state
small schema-versioned properties object
```

Suggested event families are `page_view`, `navigation`, `cta_click`,
`form_start`, `form_submit`, `form_success`, `form_error`, `search`, and
authenticated workflow events. Financial, support, and authorization audit
events belong in business/audit tables, not analytics.

## Ingestion requirements

- Accept same-origin POST only; use a small body limit and strict schema.
- Rate-limit by privacy-preserving request buckets and session.
- Ignore or reject arbitrary event names and property keys.
- Calculate canonical path/locale consistently so reports do not split `/` and
  `/fa` accidentally.
- Make submission non-blocking for navigation, but never use analytics failure
  as a reason to fail a business transaction.
- De-duplicate retried submissions with a client event identifier where needed.

## Reporting requirements

Reports query aggregate views scoped by date, locale, content type, acquisition,
and funnel. Administration access requires an analytics permission. Small cohort
cells should be suppressed when exposing results beyond trusted administrators.

## Status

Consent UI, allow-listed validation, session/client rate limits, HMAC identifiers,
bounded metadata, canonical locale paths, persistence, consent-aware lead
attribution, search/form events, and protected campaign/funnel reporting are
implemented. Raw search terms and form values are not collected. Tests cover
schema rejection, privacy-preserving rate keys, locale hydration, and real
PostgreSQL proof that denied sessions cannot be attributed to leads. Long-term
retention automation and production alert thresholds remain deployment-policy
decisions.
