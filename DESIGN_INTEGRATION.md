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

## Listing data and development fixtures

Production starts with an empty listing catalog, then reads public listings from the existing Firestore project. A successful empty response clears the catalog. An unavailable request may retain previously fetched real listings, but never substitutes samples. Listings without supplied photos use the neutral property placeholder, never an area photo or the homepage illustration.

For deliberate local sample-data work only, run `npm run dev:fixtures` from `web/`. This enables `NEXT_PUBLIC_ENABLE_PROPERTY_FIXTURES=true` only while `NODE_ENV=development`; sample titles carry a visible `DEVELOPMENT SAMPLE` prefix. A production build ignores that flag. Do not submit inquiries from this development sample mode to a production Firebase project.

## Static property routing

The export builds property pages and structured metadata from a fresh read of currently public Firestore records on each build. It uses a bounded read and creates no sample property pages. Firebase Hosting serves existing exported pages first and rewrites new `/properties/<id>/` URLs to `/properties/view/index.html`. That shell reads the path ID; `/properties/view/?id=<id>` also works, while `/properties/view/` redirects to the listing page. Listing links use full page navigation so post-build records reach the Hosting rewrite. The generic shell is excluded from the sitemap and marked noindex; rebuild to give new records their own indexable page and metadata.

Required local configuration: the existing public `NEXT_PUBLIC_FIREBASE_*` web-app values in ignored `web/.env.local`. Do not place service-account credentials in the website environment.

## Fonts and local lead testing

Inter and Noto Sans Tamil are bundled as licensed WOFF2 assets under
`web/src/app/fonts/`. Builds no longer need to download fonts from Google.

To test viewing requests without creating production leads, start the Firestore
emulator with this repository's rules and run the development app with
`NEXT_PUBLIC_FIRESTORE_EMULATOR_HOST=127.0.0.1:8180`. This setting accepts only
localhost and is ignored in production. Seed the emulator explicitly; it does
not read production data automatically. Successful viewing requests retain the
existing `viewing_requests`, `inquiries`, and `analytics_events` writes.

Run `npm run test:data` for the production fallback regressions. Browser tests use
`BASE_URL` to select the running local app or Firebase Hosting emulator.

See [REDESIGN_VERIFICATION.md](REDESIGN_VERIFICATION.md) for the completed build,
browser and emulator checks, changed files and remaining release issues.
