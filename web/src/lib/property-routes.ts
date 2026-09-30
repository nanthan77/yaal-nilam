// Preserve URLs already published in Firebase Hosting. These are aliases only;
// property content and availability must still come from Firestore.
const PUBLISHED_PROPERTY_SLUGS: Readonly<Record<string, string>> = {
  "8fSf4y9RBP62PHm8LGcJ": "nallur-house-4-bed-38-perch-yn-m8lgcj",
  "9HjrN6tffhRUe8O7tecE": "nallur-family-home-3-bed-20-perch-yn-o7tece",
  "Lgv1ZwL2IF8cDyQS4n9J": "jaffna-fort-coastal-villa-6-bed-25-perch-yn-qs4n9j",
  "oR0WXPcPLHPJsQCFCsz2": "karainagar-island-villa-5-bed-30-perch-yn-cfcsz2",
  "yAdZEsEPpARKNdchH6nL": "point-pedro-beachfront-land-22-perch-yn-chh6nl",
  "4HvEsRwN9sioWWHLArQL": "nallur-prime-residential-land-18-perch-yn-hlarql",
  "5eUYCbbwaAhEc5sUNq2Y": "chavakachcheri-modern-apartment-2-bed-yn-sunq2y",
  "6eVMReBbdEy09aufZYIB": "chunnakam-luxury-apartment-2-bed-yn-ufzyib",
  "bj05u7ftcaTEEljPLryD": "kopay-commercial-building-space-15-perch-yn-jplryd",
  "nc4rU0dtaJVyku7Isayn": "thirunelvely-heritage-residence-3-bed-24-perch-yn-7isayn",
  "UAfN6wCBCf0NeeUKUQbR": "kopay-quiet-cottage-home-2-bed-16-perch-yn-ukuqbr",
};

const IDS_BY_PUBLISHED_SLUG = new Map(
  Object.entries(PUBLISHED_PROPERTY_SLUGS).map(([id, slug]) => [slug, id])
);
const SLUGS_BY_PUBLISHED_ID = new Map(Object.entries(PUBLISHED_PROPERTY_SLUGS));

type PropertyRoute = { id: string; slug?: string };

export function normalizePropertySlug(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const slug = value.trim().toLowerCase();
  // Keep slugs in one path segment and reserve the existing Hosting shell.
  if (slug === "view" || slug.length > 200 || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return undefined;
  return slug;
}

export function resolvePropertyId(value: string): string {
  return IDS_BY_PUBLISHED_SLUG.get(value.toLowerCase()) || value;
}

function currentSlug(property: PropertyRoute) {
  const slug = normalizePropertySlug(property.slug);
  // A malformed record must not take over another published property's URL.
  const owner = slug && IDS_BY_PUBLISHED_SLUG.get(slug);
  return !owner || owner === property.id ? slug : undefined;
}

export function getPropertyPath(property: PropertyRoute): string {
  const segment = currentSlug(property) || SLUGS_BY_PUBLISHED_ID.get(property.id) || property.id;
  return `/properties/${encodeURIComponent(segment)}/`;
}

export function getPropertyRouteSegments(property: PropertyRoute): string[] {
  return Array.from(new Set([
    property.id,
    currentSlug(property),
    SLUGS_BY_PUBLISHED_ID.get(property.id),
  ].filter((segment): segment is string => Boolean(segment))));
}
