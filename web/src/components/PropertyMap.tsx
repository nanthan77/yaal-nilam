"use client";

import "leaflet/dist/leaflet.css";
import { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import {
  Compass,
  Navigation,
  ExternalLink,
} from "lucide-react";
import { googleMapsDirectionsUrl, googleMapsViewUrl } from "@/lib/maps";
import type { NormalizedListing } from "@/lib/marketplace";
import {
  type LandmarkProximity,
  calculateBoundaryMetrics,
} from "@/lib/geospatial";

// Dynamic Leaflet imports to avoid SSR issues
const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false });
const Polygon = dynamic(() => import("react-leaflet").then((mod) => mod.Polygon), { ssr: false });
const CircleMarker = dynamic(() => import("react-leaflet").then((mod) => mod.CircleMarker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), { ssr: false });
const Tooltip = dynamic(() => import("react-leaflet").then((mod) => mod.Tooltip), { ssr: false });

interface PropertyMapProps {
  listing: NormalizedListing;
  locale?: string;
}

export default function PropertyMap({ listing, locale = "en" }: PropertyMapProps) {
  const isTa = locale === "ta";
  const [mounted, setMounted] = useState(false);
  const [mapType, setMapType] = useState<"streets" | "satellite">("streets");
  const [showLandmarks, setShowLandmarks] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  const coords = useMemo(() => {
    const lat = Number(listing?.coordinates?.lat);
    const lng = Number(listing?.coordinates?.lng);
    return {
      lat: Number.isFinite(lat) ? lat : 9.6615,
      lng: Number.isFinite(lng) ? lng : 80.0255,
    };
  }, [listing]);

  const hasProvidedLocation = listing?.coordinates_source === "provided";
  // Distances must come from the listing; an area center cannot identify nearby places.
  const landmarks: LandmarkProximity[] = useMemo(() => {
    if (!hasProvidedLocation || !Array.isArray(listing?.landmarks_proximity)) return [];
    return listing.landmarks_proximity.filter((landmark: LandmarkProximity) =>
      landmark?.coordinates?.lat != null && landmark?.coordinates?.lng != null &&
      Number.isFinite(Number(landmark?.coordinates?.lat)) &&
      Math.abs(Number(landmark.coordinates.lat)) <= 90 &&
      Number.isFinite(Number(landmark?.coordinates?.lng)) &&
      Math.abs(Number(landmark.coordinates.lng)) <= 180
    );
  }, [listing, hasProvidedLocation]);

  // Boundary polygon coordinates [lat, lng] array for Leaflet
  const polygonLatLngs = useMemo(() => {
    const poly = listing?.boundary_polygon;
    if (poly && poly.coordinates && Array.isArray(poly.coordinates[0])) {
      // GeoJSON is [lng, lat], Leaflet Polygon expects [lat, lng]
      return poly.coordinates[0].map((pt: [number, number]) => [pt[1], pt[0]] as [number, number]);
    }
    return null;
  }, [listing]);

  const boundaryMetrics = useMemo(() => {
    if (polygonLatLngs && polygonLatLngs.length >= 3) {
      return calculateBoundaryMetrics(polygonLatLngs.map((pt) => ({ lat: pt[0], lng: pt[1] })));
    }
    return null;
  }, [polygonLatLngs]);

  const tileUrl =
    mapType === "satellite"
      ? "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
      : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

  const tileAttribution =
    mapType === "satellite"
      ? "&copy; Esri, Maxar, Earthstar Geographics"
      : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';

  return (
    <div className="mt-4 space-y-6">
      <p className="text-sm leading-relaxed text-charcoal-600">
        {hasProvidedLocation
          ? isTa ? "பட்டியலில் வழங்கப்பட்ட இடம். நேரில் செல்லும் முன் உரிமையாளரிடம் உறுதிப்படுத்தவும்." : "Location supplied with the listing. Confirm the address with the owner before visiting."
          : isTa ? "இந்தப் பகுதியின் மையம் மட்டும் காட்டப்படுகிறது. சொத்தின் துல்லியமான இடத்தை உரிமையாளரிடம் கேட்கவும்." : "The map shows the area center. Ask the owner for the property's exact location."}
      </p>
      {/* Interactive Map Canvas */}
      <div className="relative rounded-3xl overflow-hidden border border-sand-200 bg-sand-100 shadow-sm">
        {/* Layer Controls Toolbar */}
        <div className="flex flex-wrap items-center gap-2 border-b border-sand-200 bg-white p-2 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setMapType("streets")}
            aria-pressed={mapType === "streets"}
            className={`min-h-11 px-3 py-2 rounded-xl transition-colors ${
              mapType === "streets" ? "bg-teal-700 text-white shadow-xs" : "text-charcoal-700 hover:bg-sand-100"
            }`}
          >
            🗺️ {isTa ? "வீதி வரைபடம்" : "Streets"}
          </button>
          <button
            type="button"
            onClick={() => setMapType("satellite")}
            aria-pressed={mapType === "satellite"}
            className={`min-h-11 px-3 py-2 rounded-xl transition-colors ${
              mapType === "satellite" ? "bg-teal-700 text-white shadow-xs" : "text-charcoal-700 hover:bg-sand-100"
            }`}
          >
            🛰️ {isTa ? "செயற்கைக்கோள்" : "Satellite"}
          </button>
          {landmarks.length > 0 && (
          <button
            type="button"
            onClick={() => setShowLandmarks((prev) => !prev)}
            aria-pressed={showLandmarks}
            className={`min-h-11 px-3 py-2 rounded-xl transition-colors ${
              showLandmarks ? "bg-amber-100 text-amber-900 border border-amber-300/60" : "text-charcoal-600 hover:bg-sand-100"
            }`}
          >
            📍 {isTa ? "முக்கிய இடங்கள்" : "Landmarks"}
          </button>
          )}
        </div>

        {/* Map Container */}
        <div className="w-full h-80 sm:h-96">
          {mounted ? (
            <MapContainer
              center={[coords.lat, coords.lng]}
              zoom={polygonLatLngs ? 17 : hasProvidedLocation ? 14 : 12}
              scrollWheelZoom={false}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer url={tileUrl} attribution={tileAttribution} />

              {/* Outline supplied with the listing; not a certified survey boundary. */}
              {polygonLatLngs ? (
                <Polygon
                  positions={polygonLatLngs}
                  pathOptions={{
                    color: "#0F766E",
                    fillColor: "#14B8A6",
                    fillOpacity: 0.45,
                    weight: 3,
                  }}
                >
                  <Tooltip direction="center" opacity={0.95} permanent>
                    <span className="text-xs font-bold text-teal-950 px-1 py-0.5 bg-white/90 rounded shadow-xs">
                      {isTa ? "வழங்கப்பட்ட எல்லை வரைவு" : "Supplied boundary outline"}
                    </span>
                  </Tooltip>
                  <Popup>
                    <div className="p-1 text-xs">
                      <p className="font-bold text-teal-900 text-sm">{listing?.title}</p>
                      {boundaryMetrics && (
                        <div className="mt-1 space-y-0.5 text-charcoal-700">
                          <p><strong>{isTa ? "மதிப்பிடப்பட்ட பரப்பளவு" : "Estimated enclosed area"}:</strong> {boundaryMetrics.perches} Perches ({boundaryMetrics.lachams} Lachams)</p>
                          <p><strong>{isTa ? "சுற்றளவு" : "Perimeter"}:</strong> {boundaryMetrics.perimeterFeet} ft ({boundaryMetrics.perimeterMeters} m)</p>
                        </div>
                      )}
                    </div>
                  </Popup>
                </Polygon>
              ) : (
                /* Fallback Center Marker */
                <CircleMarker
                  center={[coords.lat, coords.lng]}
                  radius={12}
                  pathOptions={{
                    color: "#0F766E",
                    fillColor: "#0D9488",
                    fillOpacity: 0.9,
                    weight: 3,
                  }}
                >
                  <Tooltip direction="top" offset={[0, -10]} opacity={0.95} permanent>
                    <span className="text-xs font-bold text-charcoal-900">
                      {hasProvidedLocation ? isTa ? "வழங்கப்பட்ட இடம்" : "Supplied location" : isTa ? `${listing?.area_name_ta || "பகுதி"} — பகுதி மையம்` : `${listing?.area_name || "Area"} — area center`}
                    </span>
                  </Tooltip>
                  <Popup>
                    <div className="p-1 text-xs">
                      <p className="font-bold text-teal-900 text-sm">{hasProvidedLocation ? listing?.title : isTa ? listing?.area_name_ta : listing?.area_name}</p>
                      <p className="text-charcoal-600">{hasProvidedLocation ? listing?.address : isTa ? "சொத்தின் துல்லியமான இடம் வழங்கப்படவில்லை" : "Exact property location has not been supplied"}</p>
                    </div>
                  </Popup>
                </CircleMarker>
              )}

              {/* Landmark Markers Overlay */}
              {showLandmarks &&
                landmarks.map((lm) => (
                  <CircleMarker
                    key={lm.id}
                    center={[lm.coordinates.lat, lm.coordinates.lng]}
                    radius={6}
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
                      fillOpacity: 0.85,
                      weight: 2,
                    }}
                  >
                    <Popup>
                      <div className="p-1 text-xs max-w-[220px]">
                        <p className="font-bold text-charcoal-900">{isTa ? lm.name_ta : lm.name_en}</p>
                        {typeof lm.distance_km === "number" && Number.isFinite(lm.distance_km) && lm.distance_km >= 0 && (
                          <p className="text-teal-700 font-semibold mt-1">
                            {isTa ? "பட்டியலில் குறிப்பிட்ட தூரம்" : "Reported distance"}: {lm.distance_km} km
                          </p>
                        )}
                      </div>
                    </Popup>
                  </CircleMarker>
                ))}
            </MapContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-charcoal-500 text-sm">
              {isTa ? "வரைபடம் ஏற்றப்படுகிறது..." : "Loading interactive map..."}
            </div>
          )}
        </div>

        {/* Legend strip */}
        <div className="px-4 py-2.5 bg-sand-50/90 border-t border-sand-200 flex flex-wrap items-center justify-between gap-3 text-xs text-charcoal-600">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-teal-600 inline-block" />
              <strong>{hasProvidedLocation ? isTa ? "வழங்கப்பட்ட இடம்" : "Supplied location" : isTa ? "பகுதி மையம்" : "Area center"}</strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            {hasProvidedLocation && (
              <a
                href={googleMapsDirectionsUrl(listing)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center gap-1 font-semibold text-teal-700 hover:text-teal-900"
              >
                <Navigation className="w-3.5 h-3.5" aria-hidden="true" />
                {isTa ? "வழிகாட்டுதல்" : "Get directions"}
              </a>
            )}
            <a
              href={googleMapsViewUrl(listing)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-1 font-semibold text-charcoal-700 hover:text-charcoal-900"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              {hasProvidedLocation ? "Google Maps" : isTa ? "பகுதியை ஆராயுங்கள்" : "Explore this area"}
            </a>
          </div>
        </div>
      </div>

      {landmarks.length > 0 && (
        <div className="rounded-3xl border border-sand-200 bg-white p-5">
          <h3 className="flex items-center gap-2 font-bold text-charcoal-900">
            <Compass className="h-5 w-5 text-teal-700" aria-hidden="true" />
            {isTa ? "பட்டியலில் குறிப்பிட்ட அருகிலுள்ள இடங்கள்" : "Nearby places reported in the listing"}
          </h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {landmarks.slice(0, 6).map((landmark) => (
              <div key={landmark.id} className="rounded-2xl border border-sand-200 bg-sand-50 p-3.5">
                <p className="text-sm font-semibold text-charcoal-900">{isTa ? landmark.name_ta : landmark.name_en}</p>
                {typeof landmark.distance_km === "number" && Number.isFinite(landmark.distance_km) && landmark.distance_km >= 0 && (
                  <p className="mt-1 text-xs text-charcoal-600">{landmark.distance_km} km · {isTa ? "குறிப்பிட்ட தூரம்" : "reported distance"}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      {polygonLatLngs && (
        <p className="text-xs leading-relaxed text-charcoal-600">
          {isTa ? "வழங்கப்பட்ட எல்லை வரைவு மற்றும் கணக்கிடப்பட்ட பரப்பளவு குறிப்புக்காக மட்டுமே. பதிவு செய்யப்பட்ட நில அளவைத் திட்டத்தை தனியாகச் சரிபார்க்கவும்." : "The supplied outline and calculated area are for reference. Check the registered survey plan separately."}
        </p>
      )}
    </div>
  );
}
