// @ts-nocheck
"use client";

import "leaflet/dist/leaflet.css";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import {
  Layers3,
  List,
  MapPin,
  Search,
  Compass,
  Navigation,
  ExternalLink,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { formatCompactPrice, localize } from "@/lib/translations";
import { getProperties } from "@/lib/firestore";
import { filterListings, resolvePropertyImage } from "@/lib/marketplace";
import { NORTHERN_LANDMARKS } from "@/lib/geospatial";

const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false });
const CircleMarker = dynamic(() => import("react-leaflet").then((mod) => mod.CircleMarker), { ssr: false });
const Polygon = dynamic(() => import("react-leaflet").then((mod) => mod.Polygon), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), { ssr: false });
const Tooltip = dynamic(() => import("react-leaflet").then((mod) => mod.Tooltip), { ssr: false });

const JAFFNA_CENTER: [number, number] = [9.6615, 80.0255];

export default function MapPage() {
  const { locale, currency } = useStore();
  const isTa = locale === "ta";
  const [mounted, setMounted] = useState(false);
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [type, setType] = useState("");
  const [intent, setIntent] = useState("");
  const [area, setArea] = useState("");
  const [mapType, setMapType] = useState<"streets" | "satellite">("streets");
  const [showLandmarks, setShowLandmarks] = useState(true);

  const copy = localize(locale, {
    en: {
      title: "Interactive Peninsula Map Search",
      subtitle: "Explore listings by area. Map pins and boundary outlines use locations supplied with the listing.",
      noResults: "No listings match the current map filters.",
      browseList: "Browse list view",
      searchPlaceholder: "Search by area, title, or code...",
      forSale: "For Sale",
      forRent: "For Rent",
      allTypes: "All types",
      allAreas: "All areas",
      streetsView: "Streets",
      satelliteView: "Satellite",
      landmarksToggle: "Landmarks",
    },
    ta: {
      title: "குடாநாடு முழுவதும் ஊடாடும் வரைபட தேடல்",
      subtitle: "பகுதி வாரியாக சொத்துகளை ஆராயுங்கள். பட்டியலில் வழங்கப்பட்ட இடங்களும் எல்லை வரைவுகளும் வரைபடத்தில் காட்டப்படுகின்றன.",
      noResults: "தற்போதைய map filters-க்கு பொருந்தும் listings இல்லை.",
      browseList: "பட்டியல் காட்சி",
      searchPlaceholder: "பகுதி, பெயர் அல்லது குறியீடு மூலம் தேடுங்கள்...",
      forSale: "விற்பனைக்கு",
      forRent: "வாடகைக்கு",
      allTypes: "அனைத்து வகைகளும்",
      allAreas: "அனைத்து பகுதிகளும்",
      streetsView: "வீதிகள்",
      satelliteView: "செயற்கைக்கோள்",
      landmarksToggle: "முக்கிய இடங்கள்",
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
        currency,
        sort: "relevance",
      }),
    [properties, query, type, intent, area, currency]
  );

  const mapParams = new URLSearchParams();
  if (query) mapParams.set("q", query);
  if (type) mapParams.set("type", type);
  if (intent) mapParams.set("intent", intent);
  if (area) mapParams.set("area", area);
  const queryString = mapParams.toString();

  const uniqueAreas = Array.from(new Set(properties.map((property) => property.area_slug))).filter(Boolean);

  const tileUrl =
    mapType === "satellite"
      ? "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
      : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

  const tileAttribution =
    mapType === "satellite"
      ? "&copy; Esri, Maxar, Earthstar Geographics"
      : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';

  return (
    <div className="min-h-screen bg-sand-50">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-900 to-teal-800 text-white py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
            <div>
              <p className="uppercase tracking-[0.25em] text-warm-300 text-xs font-semibold mb-2">
                Pillar 2: Spatial Intelligence
              </p>
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
          {/* Sidebar Filters & Property Feed */}
          <aside className="bg-white rounded-3xl border border-sand-200 shadow-sm p-5 h-fit">
            <div className="flex items-center gap-3 mb-5">
              <div className="bg-teal-50 rounded-2xl p-3">
                <Layers3 className="w-5 h-5 text-teal-700" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-charcoal-900">{filtered.length} results</h2>
                <p className="text-sm text-charcoal-500">Live spatial results</p>
              </div>
            </div>

            <div className="space-y-3.5 mb-5">
              <div>
                <label htmlFor="map-query" className="sr-only">
                  {copy.searchPlaceholder}
                </label>
                <div className="flex items-center gap-3 rounded-2xl border border-sand-200 bg-sand-50 px-4 py-3">
                  <Search className="w-4 h-4 text-charcoal-400" />
                  <input
                    id="map-query"
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={copy.searchPlaceholder}
                    className="w-full bg-transparent outline-none text-charcoal-900 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <select
                  value={intent}
                  onChange={(e) => setIntent(e.target.value)}
                  className="w-full rounded-2xl border border-sand-200 px-3 py-2.5 text-xs text-charcoal-900 bg-white"
                >
                  <option value="">{copy.forSale} / {copy.forRent}</option>
                  <option value="sell">{copy.forSale}</option>
                  <option value="rent">{copy.forRent}</option>
                  <option value="short_rent">Short Stay</option>
                </select>

                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full rounded-2xl border border-sand-200 px-3 py-2.5 text-xs text-charcoal-900 bg-white"
                >
                  <option value="">{copy.allTypes}</option>
                  <option value="house">House</option>
                  <option value="apartment">Apartment</option>
                  <option value="villa">Villa</option>
                  <option value="land">Land</option>
                  <option value="commercial">Commercial</option>
                </select>
              </div>

              <select
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="w-full rounded-2xl border border-sand-200 px-4 py-2.5 text-xs text-charcoal-900 bg-white"
              >
                <option value="">{copy.allAreas}</option>
                {uniqueAreas.map((areaSlug) => (
                  <option key={areaSlug} value={areaSlug}>
                    {areaSlug}
                  </option>
                ))}
              </select>

            </div>

            {/* Listings Scroll Feed */}
            <div className="space-y-3 max-h-[580px] overflow-y-auto pr-1">
              {loading ? (
                [1, 2, 3].map((item) => (
                  <div key={item} className="h-28 rounded-2xl bg-sand-100 animate-pulse" />
                ))
              ) : filtered.length > 0 ? (
                filtered.map((property) => (
                  <a
                    key={property.id}
                    href={`/properties/${encodeURIComponent(property.id)}/`}
                    className="block rounded-2xl border border-sand-200 hover:border-teal-300 hover:shadow-xs transition overflow-hidden bg-white"
                  >
                    <div className="grid grid-cols-[88px_1fr]">
                      <img
                        src={resolvePropertyImage(property)}
                        alt={property.title}
                        className="w-full h-full object-cover min-h-[88px]"
                        loading="lazy"
                      />
                      <div className="p-3">
                        <p className="text-sm font-bold text-charcoal-900 line-clamp-1">{property.title}</p>
                        <p className="text-xs text-charcoal-500 flex items-center gap-1 mt-1">
                          <MapPin className="w-3 h-3 text-teal-600" />
                          {property.area_name} • {property.land_size_perches} P ({property.land_size_lachams} ல)
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <p className="text-sm font-bold text-teal-700">
                            {formatCompactPrice(property.price, locale)}
                          </p>

                        </div>
                      </div>
                    </div>
                  </a>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-sand-300 px-4 py-10 text-center text-charcoal-500 text-sm">
                  {copy.noResults}
                </div>
              )}
            </div>
          </aside>

          {/* Interactive Full Map View */}
          <section className="bg-white rounded-3xl border border-sand-200 shadow-sm overflow-hidden flex flex-col">
            <p className="border-b border-sand-200 px-4 py-3 text-xs leading-relaxed text-charcoal-600">
              {isTa ? "வழங்கப்பட்ட இடங்கள் மட்டும் குறியிடப்பட்டுள்ளன. துல்லியமான இடம் இல்லாத சொத்துகளும் பட்டியலில் உள்ளன. வழங்கப்பட்ட எல்லை வரைவுகள் பதிவு செய்யப்பட்ட நில அளவைத் திட்டத்திற்குப் பதிலாகாது." : "Only supplied locations are pinned. Listings without an exact location still appear in the list. Supplied boundary outlines do not replace a registered survey plan."}
            </p>
            <div className="flex-1 relative h-[480px] lg:h-[760px]">
              {/* Floating Layer Controls */}
              <div className="absolute top-4 right-4 z-[1000] flex items-center gap-2 bg-white/95 backdrop-blur-md p-1.5 rounded-2xl shadow-md border border-sand-200 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setMapType("streets")}
                  className={`px-3 py-1.5 rounded-xl transition-colors ${
                    mapType === "streets" ? "bg-teal-700 text-white shadow-xs" : "text-charcoal-700 hover:bg-sand-100"
                  }`}
                >
                  🗺️ {copy.streetsView}
                </button>
                <button
                  type="button"
                  onClick={() => setMapType("satellite")}
                  className={`px-3 py-1.5 rounded-xl transition-colors ${
                    mapType === "satellite" ? "bg-teal-700 text-white shadow-xs" : "text-charcoal-700 hover:bg-sand-100"
                  }`}
                >
                  🛰️ {copy.satelliteView}
                </button>
                <button
                  type="button"
                  onClick={() => setShowLandmarks((prev) => !prev)}
                  className={`px-3 py-1.5 rounded-xl transition-colors ${
                    showLandmarks ? "bg-amber-100 text-amber-900 border border-amber-300/60" : "text-charcoal-600 hover:bg-sand-100"
                  }`}
                >
                  📍 {copy.landmarksToggle}
                </button>
              </div>

              {mounted ? (
                <MapContainer
                  center={JAFFNA_CENTER}
                  zoom={11}
                  style={{ height: "100%", width: "100%" }}
                  scrollWheelZoom={true}
                >
                  <TileLayer attribution={tileAttribution} url={tileUrl} />

                  {/* Property Boundary Polygons & Markers */}
                  {filtered.filter((property) => property.coordinates_source === "provided" || property.boundary_polygon).map((property) => {
                    const poly = property.boundary_polygon;
                    const hasPolygon = poly && Array.isArray(poly.coordinates) && Array.isArray(poly.coordinates[0]);

                    if (hasPolygon) {
                      const latLngs = poly.coordinates[0].map((pt: [number, number]) => [pt[1], pt[0]] as [number, number]);
                      return (
                        <Polygon
                          key={`poly-${property.id}`}
                          positions={latLngs}
                          pathOptions={{
                            color: property.verified ? "#0F766E" : "#345290",
                            fillColor: property.featured ? "#D4A574" : "#0F766E",
                            fillOpacity: 0.5,
                            weight: 2,
                          }}
                        >
                          <Tooltip direction="top" opacity={0.95} permanent>
                            <span className="text-xs font-bold text-teal-950 px-1 py-0.5 bg-white/95 rounded shadow-xs">
                              {formatCompactPrice(property.price, locale)}
                            </span>
                          </Tooltip>
                          <Popup>
                            <div className="w-[230px]">
                              <img
                                src={resolvePropertyImage(property)}
                                alt={property.title}
                                className="w-full h-28 object-cover rounded-lg mb-2"
                              />
                              <p className="font-bold text-charcoal-900 text-sm">{property.title}</p>
                              <p className="text-xs text-charcoal-500 mb-1">{property.area_name}</p>
                              <p className="text-xs font-semibold text-teal-700">
                                {property.land_size_perches} Perches ({property.land_size_lachams} லச்சம்)
                              </p>
                              <a
                                href={`/properties/${encodeURIComponent(property.id)}/`}
                                className="inline-block mt-2 text-xs font-bold text-teal-700 underline"
                              >
                                View details & boundary →
                              </a>
                            </div>
                          </Popup>
                        </Polygon>
                      );
                    }

                    return (
                      <CircleMarker
                        key={property.id}
                        center={[property.coordinates.lat, property.coordinates.lng]}
                        radius={10}
                        pathOptions={{
                          color: property.verified ? "#0F766E" : "#345290",
                          fillColor: property.featured ? "#D4A574" : "#0F766E",
                          fillOpacity: 0.85,
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
                            <p className="font-bold text-charcoal-900 text-sm">{property.title}</p>
                            <p className="text-xs text-charcoal-500 mb-2">{property.area_name}</p>
                            <p className="font-bold text-teal-700 mb-2">{formatCompactPrice(property.price, locale)}</p>

                            <a
                              href={`/properties/${encodeURIComponent(property.id)}/`}
                              className="text-xs font-bold text-teal-700 underline"
                            >
                              View property details →
                            </a>
                          </div>
                        </Popup>
                      </CircleMarker>
                    );
                  })}

                  {/* Northern Province Landmark Hubs */}
                  {showLandmarks &&
                    NORTHERN_LANDMARKS.map((lm) => (
                      <CircleMarker
                        key={`landmark-${lm.id}`}
                        center={[lm.coordinates.lat, lm.coordinates.lng]}
                        radius={7}
                        pathOptions={{
                          color:
                            lm.category === "transport"
                              ? "#1D4ED8"
                              : lm.category === "culture_heritage"
                              ? "#B45309"
                              : lm.category === "civic_health"
                              ? "#047857"
                              : "#7C3AED",
                          fillColor:
                            lm.category === "transport"
                              ? "#60A5FA"
                              : lm.category === "culture_heritage"
                              ? "#FBBF24"
                              : lm.category === "civic_health"
                              ? "#34D399"
                              : "#A78BFA",
                          fillOpacity: 0.9,
                          weight: 2,
                        }}
                      >
                        <Tooltip direction="bottom" offset={[0, 6]} opacity={0.9}>
                          <span className="text-[11px] font-bold text-charcoal-900 px-1 py-0.5 bg-white/90 rounded">
                            📍 {isTa ? lm.name_ta : lm.name_en}
                          </span>
                        </Tooltip>
                        <Popup>
                          <div className="p-1 text-xs max-w-[220px]">
                            <p className="font-bold text-charcoal-900">{isTa ? lm.name_ta : lm.name_en}</p>
                            <p className="text-charcoal-600 text-[11px] mt-1">
                              {isTa ? lm.significance_ta : lm.significance_en}
                            </p>
                          </div>
                        </Popup>
                      </CircleMarker>
                    ))}
                </MapContainer>
              ) : (
                <div className="flex items-center justify-center h-full bg-gray-100 text-gray-500">
                  Loading map...
                </div>
              )}
            </div>

            {/* Bottom Map Legend */}
            <div className="px-5 py-3 bg-white border-t border-sand-200 flex flex-wrap items-center justify-between gap-4 text-xs text-charcoal-600">
              <div className="flex items-center gap-4 flex-wrap">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-teal-600 inline-block" />
                  <strong>{isTa ? "சொத்து எல்லை" : "Property Listings"}</strong>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" />
                  {isTa ? "போக்குவரத்து (பலாலி / ரயில்)" : "Transport Hubs (Airport / Rail)"}
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
                  {isTa ? "பண்பாட்டு தலங்கள் (நல்லூர்)" : "Cultural Hubs (Nallur)"}
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                  {isTa ? "வைத்தியசாலை & பல்கலைக்கழகம்" : "Hospital & University"}
                </span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
