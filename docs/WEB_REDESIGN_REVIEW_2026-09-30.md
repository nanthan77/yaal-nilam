# Yaal Nilam website refinement — September 30, 2026

## Result

The actual Next.js website in `web/` has a shorter bilingual homepage, larger
brand header, usable navigation, compact search and clearer property cards and
detail layouts. The existing routes, public Firestore read paths and inquiry
contract remain. The homepage image remains visibly illustrative.

### References

- [Airbnb](https://mobbin.com/screens/a92f14ea-1a94-4a63-99f3-8b5fbd42d106): calm navigation and photo grids.
- [Zillow](https://mobbin.com/screens/42f755a7-c72c-4a20-8eb1-07649d8289f0): location search, prices and property facts.
- [Redfin](https://mobbin.com/screens/97e5e553-ccc1-43e5-8603-b622df6c1d00): phone listing cards and concise actions.
- [Realtor.com](https://mobbin.com/screens/5500d2d1-8001-4d35-8bad-1a962f6924b6): mobile filters and save controls.

Full references and screenshots are available in the local review folder, outside
the public website. No reference asset became a listing photograph.

## Data correction

All 11 currently public Firestore records match the repository seed inventory.
Git history confirms their listing images were generated concept assets. The
public reader/build guard now excludes those unchanged samples and development
markers. Known generated listing media is filtered outside explicitly enabled
development fixtures. No Firestore records were deleted.

There are currently no genuine public listings to exercise. Responsive detail,
gallery and inquiry journeys were tested with clearly labeled development
samples and the isolated `demo-yaal-nilam` Firestore emulator. They must not be
reported as real available property tests. See the [source audit](LISTING_SOURCE_AUDIT_2026-09-30.md).

Missing title, survey, road, water and coordinate information remains unknown.
Platform review is described separately from independent professional title and
survey checks. Invented numerical About statistics and unsupported certification,
flood, water-quality and return guarantees were removed. Asking-price guides use
current public sale listings rather than static area-range averages.

## Implementation

- `EditorialHome`, `Navbar`, `globals.css`: shorter hero/header, native accessible
  search, intent/category controls, bilingual empty/error/loading states.
- `PropertyCard`, `PropertyGallery`, `PropertyDetailClient`, properties page:
  price/land facts, save/compare/share, fullscreen image controls, focus handling,
  touch swipe, related links and measured mobile inquiry space.
- `Footer`, contact page, brand helpers and WhatsApp button: compact app/support
  links, valid international numbers, larger touch targets, manual assistant entry.
  Apple and GPT links remain; Google Play remains Coming soon.
- Firestore/public/build readers, marketplace/maps, development fixtures and tests:
  sample/media guards, accurate unknown values and explicit local lead testing.
- Currency/land utilities and selector: existing currency and regional size
  enhancements are integrated and checked, including the two shared test modules.
- About/area/diaspora/safety/pSEO copy: owner information and professional checks,
  without platform legal certification. Existing service IDs/forms are retained.
- Account/submission layouts: route-specific yaalnilam.com canonicals and noindex.
- `firebase.json`: existing detail rewrites preserved; HTML revalidates, stable
  public assets use one-hour caching and fingerprinted Next assets remain immutable.
- Release script/docs: committed source/branch/project checks, complete lockfile
  build, export validation and public source receipt. Main Hosting also refuses
  a missing, stale or mismatched receipt before any publication. Generated caches stop being
  tracked; physical working copies remain.

## Verification

- Exact npm lockfile install: 520 packages. Dependencies were installed in a
  matching local cache because deletion on the external drive stalled; builds use
  the canonical repository source. The release wrapper validates exact manifest
  and lockfile parity before reinstalling a linked cache.
- Full website TypeScript check passed; lint has no errors. Existing image
  optimization advisories remain on older pages/components.
- Data tests: 73 passed, covering fallback, public seed/media guards, lead contracts,
  language persistence, land/currency calculations and release validation.
- Production build and sitemap generation passed. Final route/test/release totals
  are recorded in the release receipt after the final prepared build.
- Homepage intent, all property types, area and encoded/trimmed keyword filters
  preserve the existing `/properties/` parameters. Both Enter and button submission
  passed for Buy, Rent and Short stay on desktop and mobile.
- Public browser checks cover navigation/More/Escape/current links, language
  persistence, keyboard search, basic headings/labels/image descriptions, external
  links, security headers, Unicode input and seed detail refusal.
- Listing UI: 15 scenarios passed across three runs, including eight Tamil/English layouts at
  320×800, 390×844, 768×1024 and 1440×1000, save/compare/share/related/filter journeys,
  gallery arrows/Escape/focus/retry, native share and phone touch swipe.
- One viewing request went through the actual Firebase SDK into the isolated local
  emulator: exactly one `viewing_requests` and one `inquiries` record. Validation,
  confirmation and notification fields remain. No production test leads were created.

## Release limits

Only public Hosting is in this release. The draft PR remains unmerged; unrelated
backend, dashboard, native-app and local work is preserved. Reconcile those
components separately. Email/WhatsApp delivery and real account authorization
were not exercised by this UI refinement. Genuine listing coverage requires
owner-supplied property records and photographs.

The live export inspected at the start matched local `web/out`; the latest
provider releases showed no rollback. GitHub main remains older than the redesign,
and an unidentified old export could previously be deployed without a build.
The new release path refuses the older baseline and identifies each built release.

## Files in the reviewed website commit

- `.firebase/hosting.d2ViL291dA.cache` — removed from tracking; local copy retained
- `.gitignore`
- `DESIGN_INTEGRATION.md`
- `docs/LISTING_SOURCE_AUDIT_2026-09-30.md`
- `docs/WEB_REDESIGN_REVIEW_2026-09-30.md`
- `docs/WEB_RELEASE.md`
- `firebase.json`
- `scripts/release-web.mjs`
- `shared/currency.ts`
- `shared/units.ts`
- `web/generated-tests/e2e/full-audit.spec.ts`
- `web/generated-tests/e2e/local-listing-experience.spec.ts`
- `web/generated-tests/e2e/production-routing.spec.ts`
- `web/public/feed.xml`
- `web/public/rss.xml`
- `web/public/sitemap-hubs.xml`
- `web/public/sitemap-images.xml`
- `web/public/sitemap-locations.xml`
- `web/public/sitemap-properties.xml`
- `web/src/app/about/page.tsx`
- `web/src/app/add-listing/layout.tsx`
- `web/src/app/contact/page.tsx`
- `web/src/app/dashboard/layout.tsx`
- `web/src/app/diaspora/page.tsx`
- `web/src/app/globals.css`
- `web/src/app/layout.tsx`
- `web/src/app/list-property/layout.tsx`
- `web/src/app/list-property/page.tsx`
- `web/src/app/listing-policy/page.tsx`
- `web/src/app/login/layout.tsx`
- `web/src/app/login/page.tsx`
- `web/src/app/map/page.tsx`
- `web/src/app/price-index/layout.tsx`
- `web/src/app/price-index/page.tsx`
- `web/src/app/privacy/page.tsx`
- `web/src/app/properties/layout.tsx`
- `web/src/app/properties/page.tsx`
- `web/src/app/register/layout.tsx`
- `web/src/app/register/page.tsx`
- `web/src/app/request-property/layout.tsx`
- `web/src/app/terms/page.tsx`
- `web/src/components/AreaPageClient.tsx`
- `web/src/components/CurrencySelector.tsx`
- `web/src/components/DiasporaHomeClient.tsx`
- `web/src/components/EditorialHome.tsx`
- `web/src/components/Footer.tsx`
- `web/src/components/Navbar.tsx`
- `web/src/components/PropertyCard.tsx`
- `web/src/components/PropertyDetailClient.tsx`
- `web/src/components/PropertyGallery.tsx`
- `web/src/components/PropertyMap.tsx`
- `web/src/components/SafetyGuideClient.tsx`
- `web/src/components/WhatsAppButton.tsx`
- `web/src/components/pseo/PSEOListingPage.tsx`
- `web/src/lib/brand.ts`
- `web/src/lib/build-listings.ts`
- `web/src/lib/currency.ts`
- `web/src/lib/data.ts`
- `web/src/lib/development-fixtures.ts`
- `web/src/lib/diaspora.ts`
- `web/src/lib/firestore.ts`
- `web/src/lib/geospatial.ts`
- `web/src/lib/locations.ts`
- `web/src/lib/marketplace.ts`
- `web/src/lib/public-listings.ts`
- `web/src/lib/seo-config.ts`
- `web/src/lib/store.ts`
- `web/src/lib/units.ts`
- `web/tests/build-listings.test.cjs`
- `web/tests/firestore-fallback.test.cjs`
- `web/tests/fixtures/seed-property-records.json`
- `web/tests/geospatial.test.cjs`
- `web/tests/property-information.test.cjs`
- `web/tests/release-web.test.cjs`
- `web/tests/units-currency.test.cjs`
- `web/tsconfig.tsbuildinfo` — removed from tracking; local copy retained
