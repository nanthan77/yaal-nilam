# Redesign integration verification

Date: 26 September 2026. Repository: `nanthan77/yaal-nilam`.
Branch: `codex/yaal-nilam-editorial-redesign-20260926`.
Website root: `web/`.

## Changes

- Removed production sample-property fallback, including initial UI catalogs,
  generated property metadata, agent IDs and misleading area counts. Explicit
  development fixtures are visibly labeled and cannot be enabled in production.
- Built property exports from public Firestore records. Fixed the existing
  `/properties/view/?id=...` route and client handling of the existing Firebase
  rewrite for post-build IDs.
  All generated canonical URLs and sitemap locations use `yaalnilam.com`.
  Build reads bypass persistent Next.js fetch caching so later exports refresh
  listing IDs, prices and publication status.
- Unified homepage Enter/button search submission; retained existing intent,
  area, type and keyword parameters. Corrected area-card selection, Tamil hero
  typography, contrast, keyboard focus and mobile header behavior, including
  long Tamil headings and actions at 320px.
- Preserved listing photos and Firestore connections. Missing media uses a
  neutral placeholder; the homepage illustration stays visibly labeled.
- Fixed gallery keyboard controls, localized image descriptions, saved-state
  feedback, accessible sharing controls, short-stay price periods, comparison
  labels, mobile inquiry/compare overlap and viewing-request error handling.
- Bundled the existing Inter and Noto Sans Tamil families with their licenses
  after a Google Fonts download stalled the first build.
- Added a localhost-only development Firestore emulator option and a separate
  development cache so lead writes can be tested without creating public leads.

## Verification

Dependencies were installed with `npm ci` using `web/package-lock.json`.
Production was served through the Firebase Hosting emulator using the existing
Hosting rewrites, clean URLs and trailing-slash settings.

| Check | Result |
| --- | --- |
| Next.js production build and sitemap generation | Passed; 560 generated pages, 549 sitemap URLs |
| TypeScript (`tsc --noEmit`) | Passed |
| Lint | Passed with existing native-image optimization warnings |
| Production fallback and build-read regression tests | 10 passed |
| Final browser suite | 91 passed, 1 intentionally skipped, 0 failed (51.1s) |
| Export scan | 557 HTML files with canonical tags on `yaalnilam.com`; 11 public Firestore property pages; no fixture IDs/sample labels in HTML or JavaScript |

### Pages and sizes

Homepage and existing public listing
`/properties/8fSf4y9RBP62PHm8LGcJ/` were visually inspected in Tamil and English at
390×844, 768×1024 and 1440×1000. Checks covered horizontal overflow, header,
illustration label, photo presentation, labels, fixed inquiry actions and focus.
The mobile inquiry actions remained unobscured and separate from comparison.
An additional Tamil homepage check at 320×740 confirmed no horizontal overflow.

Additional routing checks: `/properties/`, `/properties/view/?id=...`,
`/properties/view/`, an unknown property ID, sitemap and robots. The unknown-ID
response was byte-identical to the exported property shell. A missing ID
redirects to the listing page; an unknown ID renders the localized unavailable
state. The generic shell is intentionally noindex until the next build creates
that property's dedicated page.

The single skipped check is the desktop execution of a mobile-only touch-target
observer; that observer ran on mobile. The isolated browser suite exercised the
honest empty listing state, while a separate persistent browser session loaded
five homepage cards and the selected public listing.

The browser suite also covers areas, four area detail pages, short stays, about,
contact, add-listing, 404 handling, search input and security/accessibility basics.
All three search intents were exercised with both Enter and the button, including
area/type/keyword roundtrips and language persistence across navigation/reload.

### Listing interactions and viewing requests

Public Firestore returned 11 records. The selected existing listing has two
supplied photos, which were tested with previous/next, thumbnails and keyboard
controls. Save persistence, comparison, sharing, currency display, related links
and the WhatsApp listing reference were exercised. Clearly labeled emulator-only
variants covered 25-perch land size, monthly rent, nightly short stays, missing
photos and the three-property comparison limit; those variants were deleted
after testing. Card, desktop-detail and mobile-detail WhatsApp actions retained
their distinct tracking sources; external navigation was intercepted.

Viewing submissions used the local Firestore emulator with the repository's
rules and copies of public listing records. Success created one
`viewing_requests` record, one `inquiries` record with `source=viewing_request`,
and both `submit_inquiry` and `viewing_request` analytics events. Fields were
trimmed, the date retained, the form cleared and the success message persisted.
Whitespace-only names and invalid phone numbers were rejected before writes.
With emulator writes temporarily denied, the error remained visible, fields
were preserved and submission became available again. Original rules were
restored afterwards.

## Remaining issues and boundaries

- Live analytics writes return `permission-denied`. The same flow succeeds with
  the repository's rules in the emulator; deployed rules/configuration need a
  separate review. Tracking calls were retained. No live rules were deployed.
- The locked dependencies have existing advisories. `npm audit --omit=dev`
  reports 4 findings: 1 critical, 2 high and 1 moderate. Its proposed Next.js fix
  is a major upgrade to 16.3.6, outside this redesign integration. The full
  dependency audit reports 12 findings. No forced dependency upgrade was made.
- General support remains the branch's `+94 70 484 6555`; the live site displays
  `+94 71 099 5343`. This contact discrepancy was raised for confirmation.
  Listing-specific contacts remain as supplied by each record.
- Existing public listing content/media and availability were not independently
  certified. The application distinguishes listing review from legal title and
  deed checks. No generated concept image was introduced into listing media.
- No production viewing lead or external WhatsApp message was sent. Downstream
  production notifications were not exercised. No live deployment or PR merge
  was performed.

Local screenshots are in ignored `output/playwright/`; detailed emulator/build
evidence is in ignored `.firebase/`. These outputs contain no committed secrets
or customer lead data.

## Files changed

<details>
<summary>Source, tests, documentation, licensed fonts and generated sitemaps</summary>

- `.gitignore`
- `DESIGN_INTEGRATION.md`
- `REDESIGN_VERIFICATION.md`
- `web/generated-tests/e2e/full-audit.spec.ts`
- `web/generated-tests/e2e/smoke/smoke-tests.spec.ts`
- `web/next.config.js`
- `web/package.json`
- `web/playwright.config.ts`
- `web/public/robots.txt`
- `web/public/sitemap-core.xml`
- `web/public/sitemap-listings.xml`
- `web/public/sitemap-locations.xml`
- `web/public/sitemap.xml`
- `web/scripts/generate-sitemap.mjs`
- `web/src/app/agents/[id]/page.tsx`
- `web/src/app/areas/[slug]/page.tsx`
- `web/src/app/areas/page.tsx`
- `web/src/app/blog/best-property-services/page.tsx`
- `web/src/app/blog/buying-property-sri-lanka-diaspora/page.tsx`
- `web/src/app/blog/interior-design-jaffna/page.tsx`
- `web/src/app/blog/jaffna-real-estate-market-trends/page.tsx`
- `web/src/app/buy/[type]/[location]/page.tsx`
- `web/src/app/buy/[type]/page.tsx`
- `web/src/app/compare/page.tsx`
- `web/src/app/dashboard/page.tsx`
- `web/src/app/fonts/Inter-OFL.txt`
- `web/src/app/fonts/NotoSansTamil-OFL.txt`
- `web/src/app/fonts/README.md`
- `web/src/app/fonts/inter-latin-variable.woff2`
- `web/src/app/fonts/noto-sans-tamil-variable.woff2`
- `web/src/app/globals.css`
- `web/src/app/layout.tsx`
- `web/src/app/map/page.tsx`
- `web/src/app/properties/[id]/page.tsx`
- `web/src/app/properties/page.tsx`
- `web/src/app/properties/view/layout.tsx`
- `web/src/app/properties/view/page.tsx`
- `web/src/app/rent/[type]/[location]/page.tsx`
- `web/src/app/rent/[type]/page.tsx`
- `web/src/app/short-term-rental/[location]/page.tsx`
- `web/src/app/short-term-rental/page.tsx`
- `web/src/components/CategoryPage.tsx`
- `web/src/components/CompareBar.tsx`
- `web/src/components/EditorialHome.tsx`
- `web/src/components/Navbar.tsx`
- `web/src/components/PropertyCard.tsx`
- `web/src/components/PropertyDetailClient.tsx`
- `web/src/components/PropertyGallery.tsx`
- `web/src/components/ShareMenu.tsx`
- `web/src/components/VoiceSearch.tsx`
- `web/src/components/WhatsAppButton.tsx`
- `web/src/components/YouTubeEmbed.tsx`
- `web/src/components/pseo/PSEOListingPage.tsx`
- `web/src/lib/build-listings.ts`
- `web/src/lib/development-fixtures.ts`
- `web/src/lib/firebase.ts`
- `web/src/lib/firestore.ts`
- `web/src/lib/marketplace.ts`
- `web/src/lib/property-presentation.ts`
- `web/src/lib/public-listings.ts`
- `web/src/lib/seo-config.ts`
- `web/tests/build-listings.test.cjs`
- `web/tests/firestore-fallback.test.cjs`
- `web/tsconfig.json`

</details>
