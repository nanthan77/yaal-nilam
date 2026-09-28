# Redesign integration verification

Date: 28 September 2026. Repository: `nanthan77/yaal-nilam`.
Branch: `codex/yaal-nilam-editorial-redesign-20260926`.
Website root: `web/`. Draft PR: <https://github.com/nanthan77/yaal-nilam/pull/1>.

## Result

The editorial redesign is integrated into the existing Next.js application.
The earlier integration was committed as `e9f5b4e`; this follow-up also checks
compatibility with the current public site and deployed Firestore contracts.
The initial integration verification performed no PR merge, deployment,
production lead, or external message. A later request authorized the website
release; [RELEASE_2026-09-28.md](RELEASE_2026-09-28.md) records the completed public
Hosting deployment, source commit, provider version and final live checks.

## Navigation follow-up

The shared header now gives the existing logo more space: 50px high on phones
and 64px from tablet width, with larger bilingual wordmarks. Icon-and-label
route tabs show the current destination. Compact screens retain Properties,
Areas, Short stay and More; Home and Property alerts join the row at 1024px.
The More panel exposes all secondary destinations on desktop as well as mobile,
including agent information, About and Contact, which were previously hidden
on desktop. A single-column menu keeps Tamil labels readable on narrow phones.

The layout was informed by the browse tabs and secondary menu in this
[Mobbin reference](https://mobbin.com/screens/c0fd4ff1-6269-4cea-9289-bc44c726e24c).
Yaal Nilam's own logo, palette, routes and language preference are preserved.
No new assets or dependencies were added. The header height is shared with
sticky property filters and section-anchor offsets.

Navigation checks passed in Tamil and English at **320, 390, 640, 768, 1024,
1279, 1280 and 1440px**. All 16 combinations had no overflow or overlapping
tab content, with visible header controls at least 44px high. Escape restored
focus in all 16; outside clicks, outside focus and route changes closed the
panel. Hidden menu links stay out of the keyboard sequence.

The final production homepage and real property detail were also checked in
both languages at **390×844, 768×1024 and 1440×1000**. All 12 combinations fit
the viewport and showed the expected current route. Ten representative routes
and legacy aliases returned HTTP 200 with the correct active tab. Twenty-four
section positions, six sticky-filter positions and six actual anchor clicks
passed. The existing navigation regression now covers the More panel on both
desktop and mobile, and waits for hydration before switching language.

The production build, sitemap generation, full lint, 30 data regressions and
production browser suite were rerun after the header changes. Output remains
579 pages and 52 canonical sitemap URLs; all 576 exported HTML canonical tags
point to `https://yaalnilam.com`. Existing native-image lint warnings remain.
The final browser run exited successfully with 97 passed and one expected skip
using the list reporter. An earlier run passed the same assertions but hung
during runner shutdown and was interrupted before this clean rerun.
Local development's first uncached About navigation was slow during compilation;
the final static export passed navigation checks. No product blocker was found.

## Changes

- Kept Tamil as the first-visit language and preserved stored preferences.
  Fixed responsive typography, mobile navigation, contrast, keyboard focus,
  gallery controls, sharing, save/compare feedback and viewing-form states.
- Removed production sample fallback. Empty or unavailable Firestore data never
  becomes sample inventory. Fixtures require `npm run dev:fixtures`, carry a
  visible development label, and are excluded from production builds.
- Rendered confirmed Firestore listings in the homepage and property HTML,
  with a fresh browser read. Builds bypass persistent listing fetch caches.
  No hardcoded production catalog or concept listing photographs were imported.
- Preserved all 11 published property slugs and ID redirects. One route helper
  supplies card, compare, share and canonical URLs. Legacy area slugs cannot
  become shared property URLs. New records still use the Hosting detail shell.
- Preserved the existing `/properties/view/?id=...` and singular `/property/`
  entry points, seven public service/guide/hub routes, app-link association files,
  four published sitemap names, legacy sitemap aliases and both RSS endpoints.
  Sitemaps include only self-canonical, indexable pages with real listing
  coverage. Unknown modification/publication dates are omitted.
- Matched current production lead schemas, including inquiry notification and
  assignment fields. Analytics uses Firebase Analytics / GA4 because live rules
  deny browser writes to `analytics_events`. Lead confirmation does not wait
  for analytics. Aggregate events exclude contact details, free text and IDs;
  local QA does not initialize production analytics.
- Preserved callable-based property alert registration and cancellation with a
  private browser receipt. Restored the full diaspora management form and package
  selection through the supported inquiry collection.
- Retained visible illustration labeling and distinguished platform listing
  review from independent legal title, deed and survey checks. Added calculator
  input labels. Bundled the existing licensed fonts for repeatable builds.
- Preserved current live public account and seller workflows before release:
  session restoration, password reset, Google popup/redirect fallback,
  profile synchronization checks, separate public/private agent profiles,
  authenticated private photo uploads and atomic listing/inquiry submission.
  Restored all 37 seller location choices and removed invented agent activity
  and testimonial defaults. Dashboard loading and empty states use real data.
  Agent listing ownership uses exact UIDs; legacy matching requires both name
  and contact, and cannot override modern submission provenance.

### Public account and seller release checks

Comparison with the live public JavaScript found newer account and seller
behavior missing from the branch. This was corrected before deployment.
Private uploads use the signed-in UID, WebP conversion, a ten-photo limit and
rollback on failure. Listing submissions contain private paths rather than
download URLs. Listing and inquiry records are committed atomically, with
the notification fields required by deployed rules. Dashboard reads include
the submitter UID and preserve published-property links.

An isolated `demo-yaal-nilam` project ran Auth on 9099, Firestore on 8280 and
Storage on 9199 using read-only copies of deployed rules. Seller registration,
private image upload, submission success and owner-dashboard visibility passed.
The browser produced one 45-field submission and one matching inquiry; the
photo path belonged to the Auth UID and no download URL was stored. Agent
registration created a pending public profile with blank email fields and a
separate private profile. Login, reload/session restoration, logout, password
reset and login with the reset password also passed. Production Firebase
requests were blocked in these browser sessions.

All 45 data regressions passed. Rules accepted valid anonymous details-only and
authenticated private-media submissions and rejected cross-account media paths
and anonymous UID claims. Focused upload checks verified concurrency, private
metadata, strict WebP output and cleanup after an upload failure. Google
provider behavior was preserved from the live code; real Google authorization
and production email delivery were not exercised.

Login, registration and dashboard passed 24 layout combinations: Tamil and
English at 320, 390, 768 and 1440px. Both seller-form steps passed another 16
combinations at those widths. These checks fixed the dashboard's narrow grid
and stacked the seller form's action buttons on phones; no horizontal overflow
remains in these checks.

## Verification

Dependencies were installed with `npm ci` using `web/package-lock.json`; the
lockfile and dependency versions remain unchanged. Production output was served
through the Firebase Hosting emulator at `127.0.0.1:4173`. Initial lead submissions
used local development at `127.0.0.1:4174` with Firestore at `127.0.0.1:8180`.
Account and private-upload checks then used the isolated three-service emulator
setup described above. Both used read-only copies of current deployed rules,
rather than the older repository rules. Production data/provider checks were
read-only; no production test lead or account was created.

| Check | Result |
| --- | --- |
| Production build and sitemap generation | Passed; 579 pages, 52 canonical sitemap URLs, four children and both RSS feeds |
| TypeScript (`tsc --noEmit --incremental false`) | Passed |
| Lint | Passed; existing native-image optimization warnings remain |
| Data, routing and sitemap regression tests | 45 passed |
| Production browser suite | 97 passed, 1 intentional desktop skip of a mobile-only observer, 0 failures |
| Export and Hosting routing audit | Passed; 576 HTML canonicals, 22 detail exports from 11 records, all 52 sitemap targets returned HTTP 200; no fixtures |

The release build was rerun after the account, seller and ownership fixes and
completed successfully. Its browser run completed 96 assertions and one expected
skip, then stalled in one worker before starting the mobile homepage case. That
case passed separately with exit code 0 (2 seconds), covering all 97 assertions.
The stalled runner was interrupted; this is a runner limitation, not a clean
single-run completion. The earlier navigation suite above exited normally.
After the final preference fix, the complete suites ran as separate projects:
desktop exited 0 with 48 passed and one expected skip; mobile reported all 49
tests passed, then stalled during worker shutdown and was terminated. Thus the
final export passed all 97 assertions with no assertion failures; the mobile
runner shutdown limitation remains in the local test environment.

### Pages and screen sizes

The homepage and real public listing `/properties/nallur-house-4-bed-38-perch-yn-m8lgcj/` (Firestore ID `8fSf4y9RBP62PHm8LGcJ`) were visually inspected in Tamil and English at **320×740, 390×844, 768×1024 and 1440×1000** against both the local development app and the final production export. All 16 page/language/size combinations had no horizontal overflow and the correct language attributes. Checks covered header, illustration label, photo presentation, focus and inquiry actions. The final export is also exercised by the production browser suite.

All seven restored routes also passed 56 language/width combinations. These checks found and fixed Tamil wrapping in the diaspora and safety guides at 320px. Desktop/mobile inquiry anchors clear the sticky header. The redundant floating WhatsApp widget is hidden on property pages so its tooltip cannot cover the dedicated inquiry actions.

Additional browser coverage includes `/properties/`, area pages, short stays,
about/contact, add-listing and 404 handling. All three homepage intents (Buy,
Rent, Short stay) are tested with area, property type and keyword parameters,
through both Enter and the search button. Language preference persists through
navigation and reload.

Restored routes are checked in Tamil and English on desktop and mobile:
`/new-today/`, `/diaspora/`, `/diaspora/power-of-attorney-guide/`,
`/lands/clear-title-lands-jaffna/`, `/real-estate/`, `/real-estate/jaffna/` and
`/safety/`. `/new-today/` describes the current catalog without claiming every
listing was published today. Land guidance does not promise certified titles.

### Listings, leads and tracking

The public Firestore catalog returned 11 records. The selected real listing has
two supplied photos. Browser checks cover previous/next and keyboard gallery
controls, save, compare, currency display, accessible calculator fields,
canonical sharing, related listings and listing-specific WhatsApp payloads.
The September 26 emulator checks also covered 25-perch land, monthly/nightly
pricing, missing photos and the three-property compare limit using clearly
identified local variants. Those variants were removed after testing.

A September 28 viewing submission against current deployed rules in the local
emulator created exactly one `viewing_requests` record and one matching
`inquiries` record, with `notify_email`, `assigned_email` and
`source=viewing_request` as required. The success state persisted and fields
cleared. The earlier validation/error checks confirmed invalid inputs make no
writes and denied writes preserve input with a recoverable error. Current data
regressions additionally verify analytics failures cannot fail accepted leads.

The full diaspora management journey passed at 390×844: package, country, city,
property location/type/occupancy and notes arrived in one emulator inquiry;
confirmation appeared. Requests were blocked from reaching production Firestore.
Property requests and their requirement records were also accepted under the
current rules. The emulator rejected missing notification fields and direct
analytics writes, as production does.

Property-alert registration and cancellation passed with intercepted callable responses: Buy mapped to `sale`, filters and consent were preserved, the private receipt was stored and then removed after cancellation. No live callable or WhatsApp send occurred. Local browser checks found no production analytics request; `analytics_events` and `property_alerts` remained empty in the emulator.

### Export and discovery

The export contains 22 property pages: IDs and preserved slugs for 11 public records. ID requests redirect to their published slugs; only the 11 canonical property URLs enter the sitemap. Five real cards are present in homepage HTML before JavaScript. The four sitemap children contain 11 property, 16 hub and 25 core URLs, plus 11 image entries; there are 52 unique canonical page URLs. Both feeds contain 11 records. All 52 sitemap targets return HTTP 200 with matching canonicals.

Hosting checks pass for a direct ID/slug, `/properties/view/?id=...`, the bare view route, an unknown ID, singular `/property/` paths, all seven restored routes, robots, sitemap, both feeds and the app-link JSON assets. Unknown property URLs receive the exact exported client shell; that shell is noindex, and new properties need a rebuild for dedicated indexable metadata. No unavailable property or generic shell appears in the sitemap.

The illustration appears only in the homepage design treatment. Production HTML
and JavaScript are scanned for fixture IDs and development sample labels.
Canonical tags and sitemap locations are checked against `https://yaalnilam.com`.
Local screenshots and detailed build/browser/emulator evidence are stored in
ignored `output/playwright/`, `web/test-results/` and `.firebase/`.

### Hosting cache correction

The first live browser check reused a pre-deployment page: clean routes received
Firebase's default one-hour cache policy because the old `**/*.html` rule did
not match the original clean URL. Public Hosting now sets revalidation as the
default, then retains long caching for assets and ten-minute caching for feeds,
sitemaps and robots. All 29 checks passed in an isolated Hosting emulator.
Admin/backend configuration is unchanged. This configuration-only correction
reuses the verified export; an already cached older response may need a reload.

### Returning visitor preferences

The previous public site stored version 2 preferences. The redesign initially
used Zustand's default version 0, so an existing browser reported a missing
migration and fell back to default preferences. The store now accepts the live
version and migrates older versions. Only a valid Tamil/English preference and
up to three unique comparison IDs are restored. Cached account, authentication,
UI and action fields cannot override the running application. Seven regression
cases exercise actual Zustand hydration, including an already authenticated
Firebase identity that must survive preference restoration.
Browser checks on an isolated development session also passed for versions 0,
1 and 2: English and two comparison IDs survived, the compare action remained
enabled, and forged cached authentication still redirected the dashboard to
login. Fresh storage starts in Tamil with an empty compare tray. No migration
warning was reported.

## Remaining issues and release boundaries

- Production backend, security rules and admin are newer than this checkout.
  Read-only inventory found 17 live functions versus six in local source and
  substantially newer access-control rules. **Do not run a blanket Firebase
  deployment from this branch.** Public account and submission compatibility
  has been restored; reconcile backend/admin source before releasing those
  components. No functions, rules, Storage
  configuration or admin source was changed or deployed in this integration.
- `npm audit --omit=dev` still reports four existing findings: one critical,
  two high and one moderate. The proposed Next.js remediation is a major upgrade
  to 16.3.6; that upgrade was not included in this redesign.
- General support in the branch uses `+94 70 484 6555`; the current live site and
  preserved diaspora management service use `+94 71 099 5343`. The business should
  confirm the intended general support number. Listing contacts remain unchanged.
- Published SEO slugs and live hardcoded listing copy differ from current
  Firestore record content. Existing URLs are preserved while displayed listing
  details come from Firestore. Availability, media rights, ownership and legal
  documents were not independently certified.
- Production notification delivery, actual WhatsApp sends and GA4 receipt were
  not exercised. Property-alert provider calls were intercepted for local UI QA;
  downstream delivery remains outside these verification results.

## Files changed

<details>
<summary>Files changed by the redesign branch and this verification follow-up</summary>

- `.gitignore`
- `DESIGN_INTEGRATION.md`
- `REDESIGN_VERIFICATION.md`
- `firebase.json`
- `web/generated-tests/e2e/full-audit.spec.ts`
- `web/generated-tests/e2e/preserved-routes.spec.ts`
- `web/generated-tests/e2e/smoke/smoke-tests.spec.ts`
- `web/next.config.js`
- `web/package.json`
- `web/playwright.config.ts`
- `web/public/.well-known/apple-app-site-association`
- `web/public/.well-known/assetlinks.json`
- `web/public/design/jaffna-house-illustration.webp`
- `web/public/feed.xml`
- `web/public/robots.txt`
- `web/public/rss.xml`
- `web/public/sitemap-core.xml`
- `web/public/sitemap-hubs.xml`
- `web/public/sitemap-images.xml`
- `web/public/sitemap-listings.xml`
- `web/public/sitemap-locations.xml`
- `web/public/sitemap-properties.xml`
- `web/public/sitemap.xml`
- `web/scripts/generate-sitemap.mjs`
- `web/src/app/agents/[id]/page.tsx`
- `web/src/app/alerts/page.tsx`
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
- `web/src/app/diaspora/page.tsx`
- `web/src/app/diaspora/power-of-attorney-guide/page.tsx`
- `web/src/app/fonts/Inter-OFL.txt`
- `web/src/app/fonts/NotoSansTamil-OFL.txt`
- `web/src/app/fonts/README.md`
- `web/src/app/fonts/inter-latin-variable.woff2`
- `web/src/app/fonts/noto-sans-tamil-variable.woff2`
- `web/src/app/globals.css`
- `web/src/app/lands/clear-title-lands-jaffna/page.tsx`
- `web/src/app/layout.tsx`
- `web/src/app/list-property/page.tsx`
- `web/src/app/login/page.tsx`
- `web/src/app/map/page.tsx`
- `web/src/app/new-today/page.tsx`
- `web/src/app/page.tsx`
- `web/src/app/properties/[id]/page.tsx`
- `web/src/app/properties/page.tsx`
- `web/src/app/properties/view/layout.tsx`
- `web/src/app/properties/view/page.tsx`
- `web/src/app/property/view/layout.tsx`
- `web/src/app/property/view/page.tsx`
- `web/src/app/real-estate/jaffna/page.tsx`
- `web/src/app/real-estate/page.tsx`
- `web/src/app/rent/[type]/[location]/page.tsx`
- `web/src/app/rent/[type]/page.tsx`
- `web/src/app/register/page.tsx`
- `web/src/app/safety/page.tsx`
- `web/src/app/short-term-rental/[location]/page.tsx`
- `web/src/app/short-term-rental/page.tsx`
- `web/src/components/CategoryPage.tsx`
- `web/src/components/CompareBar.tsx`
- `web/src/components/DiasporaHomeClient.tsx`
- `web/src/components/DiasporaPackageCard.tsx`
- `web/src/components/DiasporaPropertyManagementForm.tsx`
- `web/src/components/EditorialHome.tsx`
- `web/src/components/MortgageCalculator.tsx`
- `web/src/components/Navbar.tsx`
- `web/src/components/PropertyCard.tsx`
- `web/src/components/PropertyDetailClient.tsx`
- `web/src/components/PropertyGallery.tsx`
- `web/src/components/PublicListingHub.tsx`
- `web/src/components/RoiCalculator.tsx`
- `web/src/components/SafetyGuideClient.tsx`
- `web/src/components/ShareMenu.tsx`
- `web/src/components/VoiceSearch.tsx`
- `web/src/components/WhatsAppButton.tsx`
- `web/src/components/YouTubeEmbed.tsx`
- `web/src/components/pseo/PSEOListingPage.tsx`
- `web/src/lib/build-listings.ts`
- `web/src/lib/agent-onboarding.ts`
- `web/src/lib/api.ts`
- `web/src/lib/brand.ts`
- `web/src/lib/client-analytics.ts`
- `web/src/lib/development-fixtures.ts`
- `web/src/lib/diaspora.ts`
- `web/src/lib/firebase.ts`
- `web/src/lib/firestore.ts`
- `web/src/lib/google-auth-redirect.ts`
- `web/src/lib/imageToWebp.ts`
- `web/src/lib/marketplace.ts`
- `web/src/lib/property-alerts.ts`
- `web/src/lib/property-presentation.ts`
- `web/src/lib/property-routes.ts`
- `web/src/lib/public-listings.ts`
- `web/src/lib/seo-config.ts`
- `web/src/lib/store.ts`
- `web/tests/build-listings.test.cjs`
- `web/tests/firestore-fallback.test.cjs`
- `web/tests/property-routes.test.cjs`
- `web/tests/sitemap.test.cjs`
- `web/tsconfig.json`

</details>
