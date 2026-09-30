# Yaal Nilam design integration

The homepage and property detail concept has been adapted to the existing Next.js website in web/.

| Experience | Implementation |
| --- | --- |
| Homepage, filters, featured listings, areas and calls to action | web/src/components/EditorialHome.tsx, rendered by web/src/app/page.tsx |
| Property cards | web/src/components/PropertyCard.tsx |
| Property detail, contact and viewing request | web/src/components/PropertyDetailClient.tsx |
| Listing gallery | web/src/components/PropertyGallery.tsx |
| Shared header and visual styles | web/src/components/Navbar.tsx, web/src/app/globals.css |
| Illustrative homepage image | web/public/design/jaffna-house-illustration.webp |

The homepage filters link to the existing /properties route using its current intent, area, type and q query parameters. Cards and detail pages continue using the existing Firestore listing data, save and compare actions, WhatsApp links and viewing requests. The homepage image is labeled as an illustration and is never used as a listing photo.

New visitors start in Tamil; the language switch and stored visitor preference still work. A listing review is described separately from independent legal title and survey checks.

Run `npm ci` and `npm run dev` from `web/`. The `web/package-lock.json` lockfile is authoritative for the website. `npm run build` creates `web/out/` and generates the sitemap index and child sitemaps using `https://yaalnilam.com`.

## Navigation

The shared header uses the existing logo at a larger size and route links styled
as icon-and-label tabs. Compact screens keep Properties, Areas, Short stay and
More visible; wider screens also show Home and Property alerts. More provides
Home, alerts, overseas-owner services, agent information, About, Contact and Add
listing on every screen size. These are ordinary navigation links with current
page indicators, rather than an ARIA tab widget. Escape returns focus to More;
outside interaction or navigation closes its panel.

The structure draws on the distinct browse tabs and secondary menu in this
[Mobbin reference](https://mobbin.com/screens/c0fd4ff1-6269-4cea-9289-bc44c726e24c),
using Yaal Nilam's own logo, colors and bilingual labels. No reference assets
were copied. `--yn-header-height` keeps section anchors and sticky property
filters clear of the header at both responsive heights.

## Listing data and development fixtures

The homepage and exported property pages render records read from the existing public Firestore project during the build, then refresh them in the browser. If the build cannot read records, the initial catalog is empty. A successful empty response clears the catalog. An unavailable request may retain previously fetched real listings, but never substitutes samples. Listings without supplied photos use the neutral property placeholder, never an area photo or the homepage illustration.

For deliberate local sample-data work only, run `npm run dev:fixtures` from `web/`. This enables `NEXT_PUBLIC_ENABLE_PROPERTY_FIXTURES=true` only while `NODE_ENV=development`; sample titles carry a visible `DEVELOPMENT SAMPLE` prefix. A production build ignores that flag. Do not submit inquiries from this development sample mode to a production Firebase project.

## Static property routing

The export builds property pages and structured metadata from a fresh read of currently public Firestore records on each build. It uses a bounded read and creates no sample property pages. Published property slugs and their existing ID redirects are preserved. Listing links, sharing and canonicals use one route helper; legacy area slugs are not mistaken for property slugs. Firebase Hosting serves exported pages and rewrites new `/properties/<id-or-slug>/` URLs to `/properties/view/index.html`. The legacy singular `/property/` route also reaches its property shell. That shell reads the path ID; `/properties/view/?id=<id>` also works, while `/properties/view/` redirects to the listing page. Listing links use full page navigation so post-build records reach the Hosting rewrite. The generic shell is excluded from the sitemap and marked noindex; rebuild to give new records their own indexable page and metadata.

Required local configuration: the existing public `NEXT_PUBLIC_FIREBASE_*` web-app values in ignored `web/.env.local`. Do not place service-account credentials in the website environment.

## Fonts and local lead testing

Inter and Noto Sans Tamil are bundled as licensed WOFF2 assets under
`web/src/app/fonts/`. Builds no longer need to download fonts from Google.

To test viewing requests without creating production leads, start the Firestore
emulator with a reviewed copy of the current deployed rules and run the development app with
`NEXT_PUBLIC_FIRESTORE_EMULATOR_HOST=127.0.0.1:8180`. This setting accepts only
localhost and is ignored in production. Seed the emulator explicitly; it does
not read production data automatically. Successful viewing requests retain the
existing `viewing_requests` and `inquiries` writes, including the notification
fields required by current production rules. Browser analytics uses the existing
Firebase Analytics / GA4 configuration; current live rules intentionally reject
direct `analytics_events` writes. Analytics is suppressed on localhost and strips
lead details, free text and record IDs. Property alerts use the deployed
registration/cancellation callables and a private browser cancellation receipt.

Run `npm run test:data` for the production fallback regressions. Browser tests use
`BASE_URL` to select the running local app or Firebase Hosting emulator.

See [REDESIGN_VERIFICATION.md](REDESIGN_VERIFICATION.md) for the completed build,
browser and emulator checks, changed files and remaining release issues.

## Production compatibility

Existing public routes for current listings, diaspora services, power of attorney
guidance, land due diligence, regional property hubs and buyer safety are retained.
The diaspora management form preserves its package and property fields and submits
through the existing supported inquiry contract. Discovery output retains the four
published sitemap names, RSS feeds and app-link association files. Sitemaps contain
canonical, indexable exports with actual listing coverage; unavailable dates are
omitted rather than replaced with the build date.

The production backend, rules and admin application have newer changes than this
repository's checked-in versions. Do not deploy all Firebase resources from this
branch. This integration modifies the public website and its Hosting configuration;
backend/admin reconciliation is required before releasing those components.
The subsequent release request was completed for the public website using
`firebase deploy --only hosting:main --project yaal-nilam`. The draft PR remains
unmerged. See [RELEASE_2026-09-28.md](RELEASE_2026-09-28.md) for the deployed source,
provider version and live verification.

Public account and seller flows preserve the current live contracts: real Auth
session checks, public/private agent profiles, private UID-owned WebP uploads,
and atomic listing/inquiry submission. To exercise these locally, the development
app also accepts `NEXT_PUBLIC_AUTH_EMULATOR_HOST` and
`NEXT_PUBLIC_STORAGE_EMULATOR_HOST`, alongside the Firestore emulator setting.
All three require localhost addresses and are ignored in production. Use an
isolated `demo-` project and reviewed deployed rules for write tests.

## September 30 refinement and source audit

The current homepage uses a shorter header and hero, native labeled search fields,
Buy/Rent/Short stay controls and photo-first cards with clear prices and land size.
The listing page has compact responsive filters; details include a fullscreen,
keyboard-accessible gallery and a mobile inquiry bar that leaves content visible.
Tamil and English use the same existing routes and Firestore/lead contracts.

Design references were reviewed through Mobbin: [Airbnb](https://mobbin.com/screens/a92f14ea-1a94-4a63-99f3-8b5fbd42d106),
[Zillow](https://mobbin.com/screens/42f755a7-c72c-4a20-8eb1-07649d8289f0),
[Redfin](https://mobbin.com/screens/97e5e553-ccc1-43e5-8603-b622df6c1d00)
and [Realtor.com](https://mobbin.com/screens/5500d2d1-8001-4d35-8bad-1a962f6924b6).
Reference images remain in a private local review folder outside the website.

**Correction to earlier verification records:** Firestore residency alone does not
prove that a listing is genuine. All 11 currently public records match the seed
catalog, and Git history confirms their supplied listing images were generated.
They are now excluded from public reads, exported pages, feeds and sitemaps.
No database records were deleted. Known generated property media is removed
outside explicitly marked development fixtures. See
[the listing source audit](docs/LISTING_SOURCE_AUDIT_2026-09-30.md).
A genuine public property-detail journey cannot be tested until genuine records
are supplied; UI and lead tests use visibly labeled samples and a localhost demo
Firestore emulator. Do not describe those samples as real available properties.

The website-only [release wrapper](docs/WEB_RELEASE.md) checks committed source,
builds from the lockfile, validates the export and canonical URLs, and records the
source commit in a public release receipt. Use it for each release instead of
publishing an unidentified old export. Do not deploy all Firebase resources.
