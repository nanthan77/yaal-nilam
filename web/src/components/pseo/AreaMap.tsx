'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import type { Location } from '@/lib/locations';

const MapContainer = dynamic(() => import('react-leaflet').then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then((mod) => mod.TileLayer), { ssr: false });
const CircleMarker = dynamic(() => import('react-leaflet').then((mod) => mod.CircleMarker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then((mod) => mod.Popup), { ssr: false });

export default function AreaMap({ location }: { location: Location }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-[350px] w-full rounded-3xl bg-[#FAF7F3] border border-sand-200 flex flex-col items-center justify-center text-charcoal-400 gap-2 animate-pulse">
        <svg className="w-8 h-8 text-teal-700 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        <span className="text-xs font-bold uppercase tracking-widest text-[#0F2E25]/80">Loading Map View...</span>
      </div>
    );
  }

  const center: [number, number] = [location.lat, location.lng];
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${location.lat},${location.lng}`;

  return (
    <div className="h-[350px] w-full rounded-3xl overflow-hidden border border-sand-200 shadow-sm relative z-10 group">
      <a
        href={googleMapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute top-4 right-4 z-[500] bg-white/95 hover:bg-white text-teal-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-md backdrop-blur-sm transition-all hover:scale-105 active:scale-95 inline-flex items-center gap-1.5 border border-sand-200"
      >
        <span>Google Maps</span>
        <svg className="w-3.5 h-3.5 text-teal-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      </a>
      <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%' }} scrollWheelZoom={false}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <CircleMarker
          center={center}
          radius={12}
          pathOptions={{
            color: '#0F2E25',
            fillColor: '#D4A853',
            fillOpacity: 0.85,
            weight: 3,
          }}
        >
          <Popup>
            <div className="p-2 min-w-[120px] font-sans">
              <p className="font-extrabold text-charcoal-900 text-sm mb-0.5">{location.name}</p>
              <p className="text-xs text-charcoal-500 font-bold mb-1.5">{location.name_ta}</p>
              <span className="inline-block bg-[#0F2E25] text-white font-mono text-[10px] uppercase font-bold px-2 py-0.5 rounded">
                📍 Division Core
              </span>
            </div>
          </Popup>
        </CircleMarker>
      </MapContainer>
    </div>
  );
}
