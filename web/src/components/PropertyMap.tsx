"use client";

import { mapEmbedSrc, googleMapsViewUrl, googleMapsDirectionsUrl } from "@/lib/maps";

// Inline location map for a listing. The map is shown by default (lazy-loaded,
// so it still doesn't block the initial render since it sits below the fold).
// Source: Google Maps Embed API when NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is set,
// otherwise a keyless OpenStreetMap embed. The Directions / Open-in-Maps links
// always go to Google Maps (full Places experience).
export default function PropertyMap({ listing, locale = "en" }: { listing: any; locale?: string }) {
  const ta = locale === "ta";
  const L = {
    directions: ta ? "வழிகாட்டுதல்" : "Get directions",
    view: ta ? "Google Maps-ல் திற" : "Open in Google Maps",
  };

  const Pin = () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );

  return (
    <div className="mt-4">
      <div className="rounded-2xl overflow-hidden border border-sand-200 bg-sand-100">
        <iframe
          title="Property location map"
          src={mapEmbedSrc(listing)}
          className="block w-full h-56 sm:h-72"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          style={{ border: 0 }}
          allowFullScreen
        />
      </div>

      <div className="flex flex-wrap gap-2 mt-3">
        <a
          href={googleMapsDirectionsUrl(listing)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 px-4 py-2.5 rounded-xl transition-colors"
        >
          <Pin />
          {L.directions}
        </a>
        <a
          href={googleMapsViewUrl(listing)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-charcoal-700 bg-sand-100 hover:bg-sand-200 px-4 py-2.5 rounded-xl transition-colors"
        >
          {L.view}
        </a>
      </div>
    </div>
  );
}
