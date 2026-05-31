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

// Lightweight embeddable map (iframe src). No API key needed.
export function googleMapsEmbedSrc(listing: any): string {
  return `https://maps.google.com/maps?q=${encodeURIComponent(listingMapQuery(listing))}&z=15&output=embed`;
}

// Opens the place in Google Maps (full Places experience: photos, reviews, nearby).
export function googleMapsViewUrl(listing: any): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(listingMapQuery(listing))}`;
}

// Turn-by-turn directions to the property.
export function googleMapsDirectionsUrl(listing: any): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(listingMapQuery(listing))}`;
}
