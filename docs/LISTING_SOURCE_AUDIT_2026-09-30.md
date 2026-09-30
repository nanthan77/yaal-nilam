# Public listing source audit — 2026-09-30

A read-only anonymous Firestore query found 11 public records. All 11 match the seed array in `scripts/seed-firestore.mjs` on title, price, creation timestamp, bedrooms, bathrooms, building square feet and area. None supplied a submitter, source or sample marker in the queried public fields.

The media provenance is recorded in Git:

- [49043e6](https://github.com/nanthan77/yaal-nilam/commit/49043e678c08426f2a964db128d864999fa2bd9b): “generate realistic property images and update mock property data.” Introduces seven PNG assets and replaces the mock catalog's Unsplash media with them.
- [a73443f](https://github.com/nanthan77/yaal-nilam/commit/a73443fb411906386fd6c69cbeaa575091f95776): “run firestore image migration.” Adds a script assigning those generated images to every listing based on type, without checking owner-photo provenance.
- [996108c](https://github.com/nanthan77/yaal-nilam/commit/996108c5e3d25dfaabf35e6dcb9e702a3125ef5f): adds WebP counterparts and keeps the original PNG paths for live Firestore records.

Confirmed generated media: villa_modern, villa_island, house_family, house_heritage, apartment_luxury, commercial_space and land_beach, as both PNG and WebP under `/properties/`.

The public data guard excludes only exact seven-field seed fingerprints and explicit development markers. It does not remove records from Firestore. Generic titles, changed creation dates and changed prices remain eligible for public browsing. Known generated media is stripped from supplied property photos outside the marked, explicitly enabled development fixture path.

Client catalog reads, direct detail reads, fresh slug lookups and static build reads share the same predicate. Development fixtures retain their visible sample title and explicit marker. Fixture viewing leads are blocked unless an actually emulator-connected demo Firebase app uses a validated localhost address in development.

Validation: production build and sitemap generation passed: 552 HTML exports, 33 canonical sitemap URLs, zero public property pages, zero property image entries and empty property feeds. Shared catalog/direct-read/build guards and media/lead regressions passed. The final release report records the complete UI test results.

Read-only evidence was saved outside the export under `/tmp/yaal-web-preview-20260930/evidence/`. No database writes were made during this audit. Development viewing-request verification uses a separate localhost emulator and a demo project.
