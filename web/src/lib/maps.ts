// Google Maps helpers — keyless. Uses the public Maps embed + URL schemes so no
// API key or billing is required. Every normalized listing carries
// `coordinates {lat,lng}` (real, area-derived, or a Jaffna-centre fallback), so
// we pin by coordinates and fall back to an address text query.

function listingMapQuery(listing: any): string {
  const c = listing?.coordinates;
  if (c && Number.isFinite(Number(c.lat)) && Number.isFinite(Number(c.lng))) {
    return `${c.lat},${c.lng}`;
  }
  const parts = [listing?.address, listing?.area_name, "Jaffna", "Sri Lanka"].filter(Boolean);
  return parts.join(", ");
}

// Human-readable label for the location (used in links/aria).
export function listingPlaceLabel(listing: any): string {
  return [listing?.address, listing?.area_name].filter(Boolean).join(", ") || "Jaffna, Sri Lanka";
}

function listingLatLng(listing: any): { lat: number; lng: number } {
  const c = listing?.coordinates;
  const lat = Number(c?.lat);
  const lng = Number(c?.lng);
  return {
    lat: Number.isFinite(lat) ? lat : 9.6615, // Jaffna centre fallback
    lng: Number.isFinite(lng) ? lng : 80.0255,
  };
}

// Embeddable map iframe src.
// - If NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is set → official Google Maps Embed API
//   (real Google map, frame-allowed). Set the key and it upgrades automatically.
// - Otherwise → keyless OpenStreetMap embed, which is purpose-built for framing
//   (the keyless google.com `output=embed` URL is now 404 + X-Frame-Options:
//   SAMEORIGIN, so it renders blank — do not use it).
export function mapEmbedSrc(listing: any): string {
  const { lat, lng } = listingLatLng(listing);
  const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  if (key) {
    return `https://www.google.com/maps/embed/v1/place?key=${key}&q=${lat},${lng}&zoom=15`;
  }
  const d = 0.008; // ~900 m around the point
  const bbox = `${lng - d},${lat - d},${lng + d},${lat + d}`;
  return `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(
    bbox
  )}&layer=mapnik&marker=${encodeURIComponent(`${lat},${lng}`)}`;
}

// True when an inline *Google* map is configured (vs the OSM fallback).
export function isGoogleEmbed(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY);
}

// Opens the place in Google Maps (full Places experience: photos, reviews, nearby).
export function googleMapsViewUrl(listing: any): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(listingMapQuery(listing))}`;
}

// Turn-by-turn directions to the property.
export function googleMapsDirectionsUrl(listing: any): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(listingMapQuery(listing))}`;
}
