// Match the public listing statuses accepted by the existing Firestore rules.
export const PUBLIC_LISTING_STATUSES = [
  "available", "approved", "published", "active", "Available", "Published",
];

// These exact records came from scripts/seed-firestore.mjs. A read-only audit
// matched all seven values below against the public database on 2026-09-30.
// Keep the records in Firestore; exclude unchanged seeds from public inventory.
const SEED_LISTING_FINGERPRINTS = [
  ["Modern Villa in Jaffna Fort", 85000000, "2024-03-20T10:00:00Z", 4, 3, 4500, "jaffna-fort"],
  ["Spacious Family Home in Nallur", 45000000, "2024-03-19T14:00:00Z", 3, 2, 3200, "nallur"],
  ["Luxury Apartment in Chunnakam", 32000000, "2024-03-18T09:00:00Z", 2, 2, 1800, "chunnakam"],
  ["Commercial Space in Kopay", 28000000, "2024-03-17T11:00:00Z", 0, 1, 2400, "kopay"],
  ["Beach Land Plot in Point Pedro", 55000000, "2024-03-16T15:00:00Z", 0, 0, 6000, "point-pedro"],
  ["Island Villa in Karainagar", 92000000, "2024-03-15T10:00:00Z", 5, 4, 5200, "karainagar"],
  ["Heritage House in Thirunelvely", 38000000, "2024-03-14T09:00:00Z", 3, 2, 2800, "thirunelvely"],
  ["Luxury Villa in Jaffna Fort - Beachfront", 125000000, "2024-03-13T16:00:00Z", 6, 5, 7000, "jaffna-fort"],
  ["Heritage Lagoon Villa in Jaffna Fort", 125000000, "2024-03-13T16:00:00Z", 6, 5, 7000, "jaffna-fort"],
  ["Modern Apartment in Chavakachcheri", 22000000, "2024-03-12T08:00:00Z", 2, 1, 1200, "chavakachcheri"],
  ["Spacious Land in Nallur", 35000000, "2024-03-11T12:00:00Z", 0, 0, 5000, "nallur"],
  ["Cottage in Kopay", 18000000, "2024-03-10T14:00:00Z", 2, 1, 1500, "kopay"],
] as const;

export function isKnownSeedListing(raw: Record<string, any>) {
  if (typeof raw?.created_at !== "string") return false;
  const created = Date.parse(raw.created_at);
  return SEED_LISTING_FINGERPRINTS.some(([title, price, date, bedrooms, bathrooms, sqft, area]) =>
    raw.title === title && Number(raw.price) === price && created === Date.parse(date) &&
    raw.bedrooms != null && Number(raw.bedrooms) === bedrooms &&
    raw.bathrooms != null && Number(raw.bathrooms) === bathrooms &&
    raw.sqft != null && Number(raw.sqft) === sqft &&
    (raw.area_slug || raw.area) === area
  );
}

export function isPublicListingRecord(raw: Record<string, any>) {
  return PUBLIC_LISTING_STATUSES.includes(String(raw?.status)) &&
    raw?.is_development_fixture !== true && raw?.submission_source !== "development_fixture" &&
    !isKnownSeedListing(raw);
}

export function isExplicitDevelopmentFixture(raw: Record<string, any>) {
  return process.env.NODE_ENV === "development" &&
    process.env.NEXT_PUBLIC_ENABLE_PROPERTY_FIXTURES === "true" &&
    raw?.is_development_fixture === true && raw?.submission_source === "development_fixture";
}

// Git 49043e6 introduced these generated concept images; 996108c converted them
// to WebP. They are illustrative assets, never evidence of a listed property.
export function isGeneratedPropertyMediaUrl(value: unknown) {
  if (typeof value !== "string") return false;
  try {
    const url = new URL(value, "https://yaalnilam.com");
    if (!["yaalnilam.com", "www.yaalnilam.com", "yaal-nilam.web.app", "yaal-nilam.firebaseapp.com"].includes(url.hostname)) return false;
    const pathname = decodeURIComponent(url.pathname);
    return /^\/properties\/(?:villa_modern|villa_island|house_family|house_heritage|apartment_luxury|commercial_space|land_beach)\.(?:png|webp)$/i.test(pathname)
      || /^\/design\/jaffna-house-illustration\.webp$/i.test(pathname);
  } catch { return false; }
}
