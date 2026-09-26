// @ts-nocheck
"use client";

import "leaflet/dist/leaflet.css";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { Layers3, List, MapPin, Search } from "lucide-react";
import { useStore } from "@/lib/store";
import { formatCompactPrice, localize } from "@/lib/translations";
import { getProperties } from "@/lib/firestore";
import { filterListings, resolvePropertyImage } from "@/lib/marketplace";

const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false });
const CircleMarker = dynamic(() => import("react-leaflet").then((mod) => mod.CircleMarker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), { ssr: false });
const Tooltip = dynamic(() => import("react-leaflet").then((mod) => mod.Tooltip), { ssr: false });

const JAFFNA_CENTER: [number, number] = [9.6615, 80.0255];

export default function MapPage() {
  const { locale } = useStore();
  const [mounted, setMounted] = useState(false);
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [type, setType] = useState("");
  const [intent, setIntent] = useState("");
  const [area, setArea] = useState("");

  const copy = localize(locale, {
    en: {
      title: "Map search across the peninsula",
      subtitle: "Explore live listings with location context, then jump into the detail page or WhatsApp follow-up.",
      noResults: "No listings match the current map filters.",
      browseList: "Browse list view",
      searchPlaceholder: "Search the current map results...",
      forSale: "For Sale",
      forRent: "For Rent",
      allTypes: "All types",
      allAreas: "All areas",
    },
    ta: {
      title: "குடாநாடு முழுவதும் வரைபட தேடல்",
      subtitle: "உள்ளூர் இடவியல் விளக்கங்களுடன் listings-ஐ பார்த்து, பிறகு detail page அல்லது WhatsApp follow-up-க்கு செல்லுங்கள்.",
      noResults: "தற்போதைய map filters-க்கு பொருந்தும் listings இல்லை.",
      browseList: "பட்டியல் காட்சி",
      searchPlaceholder: "தற்போதைய map முடிவுகளை தேடுங்கள்...",
      forSale: "விற்பனைக்கு",
      forRent: "வாடகைக்கு",
      allTypes: "அனைத்து வகைகளும்",
      allAreas: "அனைத்து பகுதிகளும்",
    },
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    setQuery(params.get("q") || "");
    setType(params.get("type") || "");
    setIntent(params.get("intent") || "");
    setArea(params.get("area") || "");
  }, []);

  useEffect(() => {
    async function load() {
      try {
        const results = await getProperties();
        setProperties(results);
      } catch (error) {
        console.error("Failed to load map listings:", error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = useMemo(
    () =>
      filterListings(properties, {
        q: query,
        type,
        intent,
        area,
        sort: "relevance",
      }),
    [properties, query, type, intent, area]
  );

  const mapParams = new URLSearchParams();
  if (query) mapParams.set("q", query);
  if (type) mapParams.set("type", type);
  if (intent) mapParams.set("intent", intent);
  if (area) mapParams.set("area", area);
  const queryString = mapParams.toString();

  const uniqueAreas = Array.from(new Set(properties.map((property) => property.area_slug))).filter(Boolean);

  return (
    <div className="min-h-screen bg-sand-50">
      <div className="bg-gradient-to-r from-teal-900 to-teal-800 text-white py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
            <div>
              <p className="uppercase tracking-[0.25em] text-warm-300 text-xs font-semibold mb-2">Live map search</p>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{copy.title}</h1>
              <p className="text-teal-100 max-w-3xl">{copy.subtitle}</p>
            </div>
            <Link
              href={queryString ? `/properties?${queryString}` : "/properties"}
              className="inline-flex items-center gap-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 px-4 py-3 font-semibold"
            >
              <List className="w-4 h-4" />
              {copy.browseList}
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 md:p-6">
        <div className="grid lg:grid-cols-[360px_1fr] gap-6">
          <aside className="bg-white rounded-3xl border border-sand-200 shadow-sm p-5 h-fit">
            <div className="flex items-center gap-3 mb-5">
              <div className="bg-teal-50 rounded-2xl p-3">
                <Layers3 className="w-5 h-5 text-teal-700" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-charcoal-900">{filtered.length} results</h2>
                <p className="text-sm text-charcoal-500">Synced to the current map query</p>
              </div>
            </div>

            <div className="space-y-4 mb-5">
              <div>
                <label htmlFor="map-query" className="sr-only">{copy.searchPlaceholder}</label>
                <div className="flex items-center gap-3 rounded-2xl border border-sand-200 bg-sand-50 px-4 py-3">
                  <Search className="w-4 h-4 text-charcoal-400" />
                  <input
                    id="map-query"
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={copy.searchPlaceholder}
                    className="w-full bg-transparent outline-none text-charcoal-900"
                  />
                </div>
              </div>

              <select value={intent} onChange={(e) => setIntent(e.target.value)} className="w-full rounded-2xl border border-sand-200 px-4 py-3 text-charcoal-900">
                <option value="">{copy.forSale} / {copy.forRent}</option>
                <option value="sell">{copy.forSale}</option>
                <option value="rent">{copy.forRent}</option>
                <option value="short_rent">Short Stay</option>
              </select>

              <select value={type} onChange={(e) => setType(e.target.value)} className="w-full rounded-2xl border border-sand-200 px-4 py-3 text-charcoal-900">
                <option value="">{copy.allTypes}</option>
                <option value="house">House</option>
                <option value="apartment">Apartment</option>
                <option value="villa">Villa</option>
                <option value="land">Land</option>
                <option value="commercial">Commercial</option>
              </select>

              <select value={area} onChange={(e) => setArea(e.target.value)} className="w-full rounded-2xl border border-sand-200 px-4 py-3 text-charcoal-900">
                <option value="">{copy.allAreas}</option>
                {uniqueAreas.map((areaSlug) => (
                  <option key={areaSlug} value={areaSlug}>{areaSlug}</option>
                ))}
              </select>
            </div>

            <div className="space-y-3 max-h-[620px] overflow-y-auto pr-1">
              {loading ? (
                [1, 2, 3].map((item) => <div key={item} className="h-28 rounded-2xl bg-sand-100 animate-pulse" />)
              ) : filtered.length > 0 ? (
                filtered.map((property) => (
                  <a key={property.id} href={`/properties/${encodeURIComponent(property.id)}/`} className="block rounded-2xl border border-sand-200 hover:border-teal-300 hover:shadow-sm transition overflow-hidden">
                    <div className="grid grid-cols-[88px_1fr]">
                      <img src={resolvePropertyImage(property)} alt={property.title} className="w-full h-full object-cover min-h-[88px]" loading="lazy" />
                      <div className="p-3">
                        <p className="text-sm font-bold text-charcoal-900 line-clamp-1">{property.title}</p>
                        <p className="text-xs text-charcoal-500 flex items-center gap-1 mt-1">
                          <MapPin className="w-3 h-3" />
                          {property.area_name}
                        </p>
                        <p className="text-sm font-semibold text-teal-700 mt-2">{formatCompactPrice(property.price, locale)}</p>
                      </div>
                    </div>
                  </a>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-sand-300 px-4 py-10 text-center text-charcoal-500">
                  {copy.noResults}
                </div>
              )}
            </div>
          </aside>

          <section className="bg-white rounded-3xl border border-sand-200 shadow-sm overflow-hidden">
            <div className="flex-1 relative h-[380px] lg:h-[760px]">
              {mounted ? (
                <MapContainer center={JAFFNA_CENTER} zoom={11} style={{ height: "100%", width: "100%" }} scrollWheelZoom={false}>
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  {filtered.map((property) => (
                    <CircleMarker
                      key={property.id}
                      center={[property.coordinates.lat, property.coordinates.lng]}
                      radius={10}
                      pathOptions={{
                        color: property.verified ? "#0F766E" : "#345290",
                        fillColor: property.featured ? "#D4A574" : "#0F766E",
                        fillOpacity: 0.82,
                        weight: 2,
                      }}
                    >
                      <Tooltip direction="top" offset={[0, -6]} opacity={1} permanent>
                        <span className="text-xs font-semibold">{formatCompactPrice(property.price, locale)}</span>
                      </Tooltip>
                      <Popup>
                        <div className="w-[240px]">
                          <img
                            src={resolvePropertyImage(property)}
                            alt={property.title}
                            className="w-full h-32 object-cover rounded-lg mb-3"
                          />
                          <p className="font-semibold text-charcoal-900">{property.title}</p>
                          <p className="text-sm text-charcoal-500 mb-2">{property.area_name}</p>
                          <p className="font-bold text-teal-700 mb-2">{formatCompactPrice(property.price, locale)}</p>
                          <a href={`/properties/${encodeURIComponent(property.id)}/`} className="text-sm font-semibold text-teal-700 underline">
                            View details
                          </a>
                        </div>
                      </Popup>
                    </CircleMarker>
                  ))}
                </MapContainer>
              ) : (
                <div className="flex items-center justify-center h-full bg-gray-100 text-gray-500">Loading map...</div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
