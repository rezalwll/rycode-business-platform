# SEO and localization

Persian is the canonical default locale without a `/fa` prefix; `/fa/*`
permanently redirects to the unprefixed route. English uses `/en/*`. A small
Next.js proxy rewrite maps unprefixed Persian requests internally while a
request marker prevents rewrite recursion.

Public static catalog content remains the approved baseline. A CMS record owns
its slug even while draft or withdrawn, preventing an old static fallback from
republishing it. Only published records with approved locale translations are
rendered. `noIndex` content may be opened directly but is excluded from search
and sitemap output.

The implementation provides localized metadata, canonical/hreflang links,
Open Graph data, JSON-LD, database-backed safe internal redirects, dynamic
`sitemap.xml`, and generated `robots.txt`. Admin, dashboard, auth, search, and
error surfaces are not intended for indexing. Redirect destinations reject
external, control-character, backslash, cycle, and excessive-chain inputs.

Browser tests cover Persian RTL and English LTR on desktop/mobile and fail on a
detected React hydration error. Owner review of copy, real case studies, share
images, and production crawler output remains a release acceptance task.
