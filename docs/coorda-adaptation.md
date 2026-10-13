# RYCODE × supplied Coorda UI

Source: the local template supplied by the user at `C:/Users/pajoo/Downloads/coorda-hero-starter/coorda-clone`.
Work stays in the existing RYCODE checkout. The supplied source is unchanged.

## Current implementation

Blog shell integration: the latest request embeds the new blog design inside the previous RYCODE/Coorda page language, rather than leaving it as a separate-looking white blog. The archive now uses the existing PhotoHero/PageHero introduction, `section-space`/1440px `page-container` and the retained photographic closing band; the new search/category/two-column cards/pagination stay inside that frame. The archive title is an h2, leaving only the hero's h1. Neutral light-gray canvas and original article width/spacing are restored; article body measure is 700px while the unclipped compact image, dates, reading time, practical CTA and related cards remain. Dark-mode adaptation and all CMS/URL behavior are preserved. This supersedes the standalone compact blog header/white canvas below.

Footer pointer-fluid transplant: the user supplied `C:/Users/pajoo/OneDrive/Desktop/glass-portfolio`. Its `src/app/fluid.ts` is the source of the footer's WebGL fluid shaders/solver; that project is not modified and no package dependency is added. The retained footer explicitly uses white with dark ink in both themes, per the latest request. Its old static grid/wash DOM is replaced by a pointer-transparent canvas below the content. Input is attached only to the footer and translated through the canvas bounds, so page scroll/offsets do not displace the effect. The color palette is limited to existing RYCODE blue/purple/orange tokens. The engine is lazy-loaded only for visible footer/fine pointers, pauses when out of view or the tab is hidden, honors reduced motion, and cleans animation frames, listeners and GPU allocations on disposal. Unsupported/lost WebGL falls back to the white footer. Source resolution is capped for footer use, framebuffer resize resources are released and the display buffer is cleared transparently to avoid a black backdrop. Tests cover lifecycle, footer-local coordinate mapping, white/transparent presentation, GPU fallback and resource cleanup; browser GPU visual QA remains unavailable.

Blog reference transplant: the user supplied `C:/Users/pajoo/OneDrive/Desktop/paknevis-blog`. Its actual `paknevis-blog-ui` WordPress theme (`index.php`, `single.php`, `style.css`) and saved blog/article screenshots were inspected without modifying that project or reading WordPress credentials. RYCODE's `/blog` and article routes now use its compact title/search, category tabs, two-column image cards, bounded article image, broad article body, practical CTA banner and up-to-two related articles. `blog.css` scopes the geometry to `.rycode-blog`, using neutral canvases plus the existing blue, purple and orange accent tokens. Existing RYCODE navigation/footer, CMS publication gates, localized slugs and metadata remain in place. Search/category/page filters use server-rendered GET URLs; categories come from existing article eyebrows. Dates come only from actual CMS publication metadata, reading times are calculated, and related items exclude the current article. No Paknevis articles, download claims, personal authors, fake dates or fake filler posts were imported. The existing CMS model exposes no article cover field, so cards reuse the RYCODE editorial image fallback. Source comments/forms are not imported because RYCODE has no existing public comment workflow. Page-level browser visual QA remains unavailable.

Blog validation: TypeScript, all 181 tests and the production build pass. Live HTTP checks return 200 for Persian/English archives and article detail routes; a non-matching search produces the empty state and a Persian body-text search finds the existing article. Services remain outside the blog styling. The local fallback currently has one article, so additional tabs, pagination and recommendations only appear when real published content warrants them; synthetic fixtures exercise those states in tests.

Dark-logo diagonal correction: the diagonal R leg is black again in the dark-background SVG, while the main body remains blue and the chevrons remain white. Independent clip regions keep the black diagonal and white arrows separate. This supersedes the white-diagonal treatment below; the light-background blue/black asset and component selection logic are unchanged.

Dark-logo color correction: `/brand/rycode-logo-white.svg` now keeps the main R body in `#66C0FF`, with only the diagonal leg and side chevrons white. It mirrors the light-surface blue/black geometry exactly. This supersedes the fully white version below; file paths, automatic theme/overlay switching and the light-surface logo are unchanged.

Logo light/dark variants: both code chevrons now join the diagonal R leg in black on the existing blue mark. A separate fully white, transparent `/brand/rycode-logo-white.svg` preserves the same silhouette for charcoal/photo backgrounds. `Logo`/`LogoMark` render the white file explicitly for `variant="light"` (the hero-overlay header); other variants swap the blue/black and white files via the actual `.dark` theme class. Wordmark lettering remains black/blue or white/blue as requested. Both assets are self-contained and retain the original JPEG unchanged. Native SVG asset rendering is checked separately from page-level browser QA.

Symbol follow-up: the actual shared logo SVG now has a black diagonal lower-right R leg, with the remaining symbol and side chevrons in `#66C0FF`. A clipped second use of the same original silhouette limits black to that leg; the original JPEG is preserved. Both native SVG filters clean low-alpha white-background JPEG noise before compositing exact solid ink. Header and standalone marks use this self-contained asset, not CSS-only recoloring. A rasterized asset preview was inspected; page-level browser verification is still unavailable.

Rounded-boundary fix: source light panels previously hard-coded a charcoal underlay beneath their rounded `::before` surface, even when the following section/footer was light. All ten source paper-panel selectors now default to a transparent underlay showing the neutral page canvas. A next-sibling `:has()` rule restores charcoal only before actual source dark bands (showcase, native features, moments, testimonials, about culture). This removes the unintended black wedges above the retained light footer on contact/legal/archive pages while keeping the original 42px rounded-paper geometry and intentional home light-to-dark transitions. CSS regression coverage checks both cases; browser visual confirmation remains unavailable.

Wordmark correction: the user clarified that the lettering should be black/blue, not entirely blue. `RY` is black (`#171717`) on light surfaces and white on dark/hero-overlay surfaces; `CODE` remains `#66C0FF`. Header, mobile drawer, footer and standalone text-logo SVGs share this two-tone treatment. The blue symbol file, blue menu/brand mentions, section backgrounds and button colors are unchanged. This supersedes only the full-blue wordmark below.

Brand/menu follow-up: the full RYCODE wordmark and brand mentions now use the shared `#66C0FF` blue, superseding the previous black/orange wordmark and orange brand-copy rules. Desktop/mobile navigation uses blue ink on light surfaces and the exact blue on dark/hero surfaces; submenu surface contrast is handled separately. The opening hero CTA also uses that blue with dark readable text. Other orange CTAs and all section backgrounds are unchanged. `/brand/rycode-logo-blue.svg` is a self-contained transparent asset using the original artwork's silhouette and an exact-blue native SVG color matrix. The original orange JPEG remains untouched; the old component-local display filter is no longer needed. Browser visual verification is still unavailable.

The shared primary blue is now exactly `#66C0FF` in light and dark modes. Hero emphasis, blue bottom rails, charcoal-section details, service-family accents and blue chart tokens use that one source. Light-surface text uses a readable 50/50 sRGB ink mix derived from the same blue; its contrast regression tests remain enforced. Purple/orange roles and the source section canvases are unchanged.

The original video-hero supporting copy is restored in both languages, including the closing “با تمرکز، دقت و مهندسی واقعی”. Its original broad measure, white/68 color and 14/16px type are restored too. At the user's request, the former turquoise reality emphasis now uses the shared light-blue `--accent-blue` token; the original headline wording and typography remain unchanged. Earlier removal/turquoise checkpoints below are superseded.

The supporting paragraph beneath the hero headline and its English equivalent are removed at the user's request. The headline, original video and conversation CTA are unchanged; no empty placeholder element is retained.

The hero video blur is removed at the user's request. Its scene filter now retains only the existing `brightness(.6)` for headline readability; video pixels, wording and layout are unchanged. A CSS regression test prevents reintroducing hero blur.

The top header's “شروع پروژه” / “Start a project” CTA was removed at the user's request. Header logo, language/theme controls, section actions and the mobile menu's separate bottom CTA are unchanged. TypeScript and 22 navigation/design tests pass; both public language responses omit the top CTA.

Logo-frame fix: the JPEG display filter now computes alpha as source alpha minus blue, rather than one minus blue. Transparent filter padding therefore stays transparent instead of generating an opaque black frame. Its filter bounds also match the image bounds. Original RGB values, artwork bytes, two-tone lettering and layout are unchanged; a matrix regression test covers transparent padding, white-background removal and visible orange pixels. Browser visual confirmation remains unavailable.

Confirmed original video-headline restoration: the user selected the saved `f714d15` version, “ایده‌ها، از دل سکوت / به واقعیت می‌رسند”. The active hero now uses that wording and its exact headline styling: light weight, `clamp(2.15rem, 5vw, 4.9rem)`, 1.22 line height, white/48 linking words and turquoise `واقعیت` (`#5fe1d5`). The previous blue-`سکوت` approximation is superseded. English copy mirrors this treatment. The restored section canvases, accent-only controls, video playback, logo and remaining homepage content are untouched. The trailing title period is omitted as previously requested.

Accent-only follow-up: original section backgrounds remain unchanged. Orange is used for primary CTA buttons, blue for selected editorial emphasis/light-surface links and icons, and purple for keyword highlights/FAQ controls. Charcoal-surface accents use brighter blue/lavender; no per-section/card color cycles, colored canvases or gradients were introduced. Ink/CTA contrast and the unchanged canvas boundaries are regression-tested. The blue hero word and two-tone logo are unchanged.

Latest direction supersedes the blue/violet/orange section palette and the interim all-white pass: the public UI once again uses the supplied Coorda stylesheet's original light-gray paper, white cards, charcoal sections and photographic banners. The palette integration no longer repaints source sections, headings, controls, mockups or abstract heroes. Neutral shell tokens retain navigation, public account integration and the large RYCODE footer; orange branding and bottom-rail capability hovers remain explicit exceptions. The first-section exception uses RYCODE's centered, light-weight two-line headline with `سکوت` / `silence` in blue (`#6dadf4`) and the linking words softened white. Inline template photo/message decorations are removed from this headline. Original video, bilingual content and removal of the pause button are retained. Historical checkpoints below describe earlier, superseded appearances.

- All 13 homepage compositions are now mounted in the source order: Hero, Features, AppShowcase, Impact, CommunityCTA, DesktopApp, NativeFeatures, Stories, Pricing, Testimonials, FAQ, Insights and Moments.
- The source JSX and stylesheet are transplanted, rather than replaced by the earlier custom service tabs and bento layout.
- The RYCODE glass header overlays the original RYCODE film. The requested “ایده‌ها در دل سکوت شکل می‌گیرند” headline and the original template's two-copy logo ticker are restored.
- Follow-up hero restoration keeps the centered, two-line photographic title on small screens too, instead of the source's plain-text mobile fallback. The inline photo frame and message icon scale down without removing the composition; the original film, desktop layout, content and other sections are unchanged. All 162 tests pass; visual browser verification is still outstanding.
- At the user's request, the hero's manual video pause/play button, state and unused control styles are removed. Muted looping playback, offscreen/tab visibility handling and reduced-motion behavior remain. TypeScript and the ten homepage tests pass; both language pages serve without the button.
- Placeholder logos are explicitly authorized by the user and labelled as placeholders.
- The original large RYCODE footer is retained.
- Shared public heroes use the source PhotoHero frame and motion. Catalog cards use InsightCard composition, details use ArticlePage composition, about uses AboutContent composition, FAQ uses the source disclosure UI, legal content uses LegalPage composition, and lead pages use ContactContent's photo/form split.
- Persian and English content, current CMS publication filters, service/project relationships and lead submission workflows remain intact.
- Source app downloads, fabricated prices, invented customers, employee identities and testimonial claims are not transferred. Concept imagery and role portraits are labelled illustrative; working-principle quotations are attributed to RYCODE, not fictional customers.
- Admin/customer workspaces and database schema are unchanged.

## Outstanding fidelity audit

Latest restoration checkpoint: TypeScript/production build and all 161 tests pass. The local preview was restarted on `127.0.0.1:3001` after the previous dev session stopped. Browser visual verification remains unavailable; source/CSS checks confirm the original section fields and the explicitly blue hero word.

This is **not** a declaration that every route is visually identical to the template.

- Account entry, staged-payment, search and recovery pages still contain parts of the earlier adaptation and need the remaining source-composition pass.
- Integration-only additions include supporting page summaries, CMS-rich FAQ answers, retained multi-step forms, locale routing and Persian type/direction fixes.
- Visual browser verification remains outstanding because the earlier local-browser access was blocked. Source-clone screenshots are references, not screenshots of this implementation.
- Audit those remaining requirements before declaring the full-site request complete.

## Verification for this checkpoint

- TypeScript: passed.
- Production build: passed.
- Vitest: 144 tests passed across 21 files.
- Read-only runtime audit: 112 of 112 public Persian/English routes returned successfully, including shared shell, footer and page headings.
- Original film and poster served; film byte-range request returned 206.
- Tests now check all 13 homepage compositions and non-empty ticker/card loops, mobile feature navigation, FAQ controls, video/logo pause, locale links, CMS content retention and form kind/source attribution.
- The component transfer helper uses the receiving TypeScript 6 factory signature. Regression tests cover the previously empty JSX expression/card-loop issue.

No commit, push or publication was performed for this checkpoint.

## Orange brand-name copy

Follow-up correction: the official header/footer wordmark uses the original two-tone treatment again: black `RY` and orange `CODE`. `RY` becomes white in dark mode or the photo-overlay header. The orange symbol and orange brand mentions in ordinary copy are unchanged. `LogoWordmark` shares this treatment without changing typography or section layout. TypeScript and all 161 tests pass.

Public text renderers now share `BrandText`, which highlights only `رایکد`, `رای‌کد`, `رای کد` and English `RYCODE` spellings using the original orange logo token. It works in server-rendered and interactive copy, including page titles, translated home sections, catalog entries, navigation, footer and public forms. There is no extra layout element, DOM observer or content rewrite. URL/ARIA attributes, editable fields, SVGs and structured data are left intact. Existing logo artwork and the rest of the palette are unchanged by this focused request.

Verification: 161 tests passed; TypeScript and the production build passed. Twelve representative Persian/English public routes returned 200, with no unstyled brand-name text nodes found in their HTML audit. Visual browser verification remains unavailable. No commit, push or publication was performed.

## Palette alignment

The user's latest request supersedes the monochrome pass. The shared project palette is now powder blue, violet and warm orange. Light mode uses an icy-blue background (`#f0f6ff`), violet interactions (`#6d4cdb`) and orange primary actions (`#ff9c52`); dark mode uses deep blue/violet surfaces with brighter lavender and orange accents. Global semantic tokens cover all project surfaces; the public shell explicitly inherits them instead of retaining its older studio overrides.

The subsequent refinement restores the exact original orange logo artwork from commit `1bee279` as `/brand/rycode-logo-orange.jpg` (SHA-256 `a9c89435033a2367008de2367e2dd186395ac291bd12ea2c16609a6d07c5b99f`). Its pixels are unchanged; a native SVG display filter makes its white JPEG background transparent when rendered. All header/standalone marks and the full wordmark remain orange, including in dark mode and over the hero. The source template's RYCODE text logos are also orange.

Blue is now more visible: the base background is `#e4f0ff`, blue fields use `#c5e0ff`, and blue accents use `#6dadf4`. Rather than making every heading/control violet, four homepage sections use each of the blue, purple and orange families; repeated cards cycle through the three families. The long showcase and footer use all three in their gradient stops. Contrast tests cover each local accent family in both themes, and logo tests confirm restoration and prevent black/white mode filters. This refinement passes 155 tests and the production build; visual browser verification remains outstanding.

Former charcoal presentation bands now use blue/violet gradients in light mode and deep colored surfaces in dark mode. Header, brand wordmark, footer, forms, consent and browser/manifest colors share the palette. Photographs and the original hero video are unchanged, as are the section layout and motion. Feature-card hover remains a colored bottom rail, not a full background-color change.

Six palette tests check the three color roles, text/button contrast on both themes and colored bands, color-only public integration overrides, demo/photo contrast, footer actions and bottom-rail hover. The current checkpoint passes 150 tests and the production build. Seven representative public routes return 200. Browser visual verification remains outstanding, as described above.
