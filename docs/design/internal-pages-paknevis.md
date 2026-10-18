# Internal page layouts: Paknevis → RYCODE

Reference inspected read-only: `D:/desktop/repos/paknevis/new-paknevis-website`.
RYCODE's homepage, navigation, footer, business logic, databases and protected
dashboard/admin screens are not replaced. Adaptation concerns public internal
pages and account-entry presentation. No Paknevis branding, legal text, pricing,
staff portraits, product imagery or claims are copied.

## Layout mapping

| RYCODE destination                                  | Reference pattern                                                            | Adaptation                                                                                                                                               |
| --------------------------------------------------- | ---------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Services hub, seven service families                | `(site)/downloads/keyboard/page.tsx`, `(site)/downloads/extensions/page.tsx` | Split text/media introduction, editorial family rows, relevant RYCODE service photos, scoped offerings and linked studies                                |
| All service details, including ecommerce and mobile | Same downloads pages                                                         | Relevant split hero, full service chapters and sticky chapter/enquiry panel                                                                              |
| Project studies list/details                        | `(site)/pricing/page.tsx`, downloads feature grids                           | Featured project plus smaller studies, large project visual, numbered case-study chapters; conceptual disclosures retained                               |
| About, approach, process, technology                | `(site)/about/page.tsx`                                                      | Split hero, story panel, principles cards, four-step process; original RYCODE chapters and anchor URLs retained, no invented founding dates or employees |
| Contact, new project, technical review, SEO audit   | `(site)/contact/page.tsx`                                                    | Readable introduction beside elevated form; original forms, validation, attribution and privacy warnings retained                                        |
| FAQ                                                 | `(site)/help/page.tsx`, `components/HelpCenterClient.tsx`                    | Centered search, topic controls, matching title/answer text, accessible expandable answers, real managed FAQ data retained                               |
| Terms/privacy                                       | `(site)/terms/page.tsx`                                                      | Bounded header, table of contents and readable individual policy blocks; RYCODE policy wording retained                                                  |
| Staged payment                                      | `(site)/pricing/page.tsx`                                                    | Split visual intro, three real payment stages and eligibility notes; no fabricated prices or financial products                                          |
| Site search                                         | Help center's centered search composition                                    | Real GET search and results preserved, same scoped internal card system                                                                                  |
| Login/register/password recovery                    | `site-admin/login/page.tsx`                                                  | Narrow centered brand/form card; existing public auth workflows unchanged, no admin code imported                                                        |
| Blog/archive/article                                | Existing blog integration + `(site)/terms/page.tsx` document pattern         | Preserve requested photographic heading/search overlay and archive interactions; bounded cards, white surfaces, article contents and reading blocks      |

Styles are scoped under `.rycode-inner` in `inner-pages.css`: white surfaces,
dark readable typography, #66C0FF actions, darker accessible blue text, restrained
borders and rounded panels. Dark-mode tokens, RTL/LTR, narrow-screen stacking,
keyboard focus and reduced motion are retained.

## Verification

`tests/inner-pages.test.tsx` covers distinct layouts in both languages, original
catalog text/items, service-specific asset presence, chapter links, all four
lead form kinds/source paths, FAQ interaction/search/topic/empty states,
concept-study disclosure, CSS scope and responsive/reduced-motion rules.
Existing CMS/public routing/blog/lead/auth tests remain applicable.

Latest source/runtime checkpoint (2026-10-15):

- Full unit/component suite: 237 passing tests across 34 files.
- Production Next.js build: successful compilation, TypeScript and all 22
  generated routes. No new runtime dependencies or database migrations.
- 31 representative live public/account URLs return HTTP 200, the new internal
  wrapper, one primary heading and the shared stylesheet links. This includes
  all nine existing service detail routes, nested CRM, all four enquiry kinds,
  company/legal/search/blog/account entries and English service/about/FAQ pages.
- The live components CSS returns HTTP 200 and contains the internal layout and
  local foreground/surface token rules; source scope tests prevent homepage and
  footer selectors from being affected.
- Existing public catalog tests retain full chapter/item content in both
  languages; CMS visibility, family scope, concept disclosures, enquiry kinds
  and source attribution remain covered. Brand transformation preserves keys
  and refs without React key warnings from the new blog composition.
- Still pending: actual desktop/mobile rendered inspection, including dark-mode
  form contrast, long headings, sticky contents, image crops and menu-to-page
  navigation. User screenshots were requested; source/HTTP checks are not a
  substitute for this visual review.

Browser rendering QA has not been completed: the browser tool rejects local
URLs in this environment. Do not infer pixel-perfect mobile/desktop rendering
from source tests, SSR or a successful build. Review the live internal pages
when supported browser access is available before closing the design goal.
