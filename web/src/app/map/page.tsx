"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useStore } from "@/lib/store";
import { formatPrice, localize, t } from "@/lib/translations";

// Dynamically import Leaflet (SSR-incompatible)
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
);

// Mock properties with coordinates
const MAP_PROPERTIES = [
  { id: "1", lat: 9.6732, lng: 80.0267, title: "4BR House, Nallur", price: 45000000, type: "house" },
  { id: "2", lat: 9.6550, lng: 80.0220, title: "20P Land, Thirunelvely", price: 18000000, type: "land" },
  { id: "3", lat: 9.6980, lng: 80.0050, title: "3BR House, Kopay", price: 75000, type: "house" },
  { id: "4", lat: 9.6615, lng: 80.0255, title: "Commercial, Jaffna Town", price: 85000000, type: "commercial" },
  { id: "5", lat: 9.7297, lng: 79.9270, title: "5BR Villa, Karainagar", price: 120000000, type: "villa" },
  { id: "6", lat: 9.7438, lng: 80.0249, title: "3BR House, Chunnakam", price: 32000000, type: "house" },
  { id: "7", lat: 9.6900, lng: 80.0100, title: "2BR Rental, Manipay", price: 50000, type: "house" },
  { id: "8", lat: 9.8036, lng: 80.0580, title: "40P Land, Chavakachcheri", price: 25000000, type: "land" },
  { id: "9", lat: 9.6620, lng: 80.0200, title: "3BR Apartment, Jaffna", price: 28000000, type: "apartment" },
];

const JAFFNA_CENTER: [number, number] = [9.6615, 80.0255];

export default function MapPage() {
  const { locale } = useStore();
  const [mounted, setMounted] = useState(false);
  const copy = localize(locale, {
    en: {
      subtitle: "Explore properties across the Jaffna Peninsula on an interactive map",
      viewDetails: "View details",
    },
    ta: {
      subtitle: "யாழ் குடாநாடு முழுவதும் உள்ள சொத்துக்களை இடம் அடிப்படையில் வரைபடத்தில் பாருங்கள்",
      viewDetails: "விவரங்களைப் பார்க்கவும்",
    },
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <div className="flex-1 flex flex-col">
        <div className="container-wide py-4">
          <h1 className="section-heading">{t("nav.map", locale)}</h1>
          <p className="section-subheading mb-4">{copy.subtitle}</p>
        </div>

        <div className="flex-1 relative" style={{ minHeight: "600px" }}>
          {mounted ? (
            <MapContainer
              center={JAFFNA_CENTER}
              zoom={12}
              style={{ height: "100%", width: "100%" }}
              scrollWheelZoom={true}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {MAP_PROPERTIES.map((p) => (
                <Marker key={p.id} position={[p.lat, p.lng]}>
                  <Popup>
                    <div className="text-sm">
                      <p className="font-semibold">{p.title}</p>
                      <p className="text-primary-700 font-bold">{formatPrice(p.price, locale)}</p>
                      <a href={`/properties/${p.id}`} className="text-primary-600 underline text-xs">
                        {copy.viewDetails} →
                      </a>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          ) : (
            <div className="flex items-center justify-center h-full bg-gray-100 text-gray-500">
              {t("common.loading", locale)}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
