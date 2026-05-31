"use client";

import { useState } from "react";
import { googleMapsEmbedSrc, googleMapsViewUrl, googleMapsDirectionsUrl } from "@/lib/maps";

// Click-to-load Google Maps for a listing. The (heavy) embed iframe is only
// mounted after the user taps "Show map", so it never costs anything on the
// initial mobile render. The Directions / View links work without loading it.
export default function PropertyMap({ listing, locale = "en" }: { listing: any; locale?: string }) {
  const [show, setShow] = useState(false);
  const ta = locale === "ta";

  const L = {
    show: ta ? "வரைபடத்தைக் காட்டு" : "Show map",
    directions: ta ? "வழிகாட்டுதல்" : "Get directions",
    view: ta ? "Google Maps-ல் திற" : "Open in Google Maps",
    hint: ta ? "சொத்தின் தோராயமான இருப்பிடம்" : "Approximate location",
  };

  const Pin = () => (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );

  return (
    <div className="mt-4">
      <div className="relative rounded-2xl overflow-hidden border border-sand-200 bg-sand-50">
        {show ? (
          <iframe
            title="Property location on Google Maps"
            src={googleMapsEmbedSrc(listing)}
            className="block w-full h-56 sm:h-72"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            style={{ border: 0 }}
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            onClick={() => setShow(true)}
            className="w-full h-40 sm:h-48 flex flex-col items-center justify-center gap-1.5 text-teal-700 hover:bg-teal-50 active:bg-teal-100 transition-colors"
            aria-label={L.show}
          >
            <Pin />
            <span className="font-semibold text-sm">{L.show}</span>
            <span className="text-xs text-charcoal-500">{L.hint}</span>
          </button>
        )}
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
