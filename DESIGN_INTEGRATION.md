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

To work on the site locally, run npm install and npm run dev from web/. npm run build creates the static export used by Firebase Hosting. The existing data layer uses sample fallback listings when Firestore is unavailable; review those separately before changing that behavior for production.
