// @ts-nocheck
"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import PropertyCard from "@/components/PropertyCard";
import { getAreaBySlug, getAreas, getPropertiesByArea } from "@/lib/firestore";
import { buildAreaInsights } from "@/lib/marketplace";
import { getLocationBySlug, getPlacesForLocation } from "@/lib/locations";
import { useStore } from "@/lib/store";
import { formatCompactPrice, localize } from "@/lib/translations";
import FAQSection from "./pseo/FAQSection";
import NearbyLandmarks from "./pseo/NearbyLandmarks";
import InternalLinks from "./pseo/InternalLinks";
import AreaGuideContent from "./pseo/AreaGuideContent";
import AreaMap from "./pseo/AreaMap";
import { getAreaHeritage } from "@/lib/area-heritage";
import { generateLocationFAQs } from "@/lib/faq-data";

export default function AreaPageClient() {
  const { locale } = useStore();
  const params = useParams();
  const slug = params.slug as string;

  const [area, setArea] = useState<any>(null);
  const [areas, setAreas] = useState<any[]>([]);
  const [areaProperties, setAreaProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const copy = localize(locale, {
    en: {
      notFoundTitle: "Area Not Found",
      notFoundBody: "The area you are looking for does not exist or is not available right now.",
      backToAreas: "Back to Areas",
      totalProperties: "Live properties",
      featuredListings: "Featured listings",
      averagePrice: "Average asking price",
      verifiedListings: "Listing details reviewed",
      areaProperties: "Properties in",
      empty: "There are no properties in this area at the moment.",
      otherAreas: "Explore Other Areas",
      buyerNotes: "Buyer notes",
      priceBand: "Search budget guide",
      remoteTitle: "Support for overseas searches",
      remoteBody: "Searching from abroad? Ask the advertiser for current photos and video, and arrange independent document and survey checks before deciding. Platform review covers listing details; it does not certify ownership, deeds or boundaries.",
      landmarks: "Nearby places people ask about",
    },
    ta: {
      notFoundTitle: "இந்த பகுதி கிடைக்கவில்லை",
      notFoundBody: "நீங்கள் தேடும் பகுதி தற்போது கிடைக்கவில்லை அல்லது பட்டியலில் இல்லை.",
      backToAreas: "பகுதிகளுக்குத் திரும்பவும்",
      totalProperties: "நேரடி சொத்துக்கள்",
      featuredListings: "முன்னிலை பட்டியல்கள்",
      averagePrice: "சராசரி கேட்கப்படும் விலை",
      verifiedListings: "தள மதிப்பாய்வு உள்ள பட்டியல்கள்",
      areaProperties: "இந்த பகுதியில் உள்ள சொத்துக்கள்",
      empty: "இந்த பகுதியில் தற்போது சொத்துக்கள் எதுவும் இல்லை.",
      otherAreas: "மற்ற பகுதிகளைப் பாருங்கள்",
      buyerNotes: "வாங்குபவர் குறிப்புகள்",
      priceBand: "தேடல் வரவு செலவு வழிகாட்டி",
      remoteTitle: "வெளிநாட்டிலிருந்து சொத்து தேடுபவர்களுக்கு உதவி",
      remoteBody: "வெளிநாட்டிலிருந்து தேடுகிறீர்களா? தற்போதைய படங்கள் மற்றும் வீடியோவை விளம்பரதாரரிடம் கேளுங்கள். முடிவு எடுக்கும் முன் ஆவணங்களையும் எல்லைகளையும் சுயாதீன நிபுணர்களிடம் சரிபாருங்கள். தள மதிப்பாய்வு உரிமை, பத்திரம் அல்லது எல்லைகளைச் சான்றளிக்காது.",
      landmarks: "மக்கள் அடிக்கடி கேட்கும் அருகிலுள்ள இடங்கள்",
    },
  });

  useEffect(() => {
    async function loadData() {
      try {
        const [catalog, areaData, listings] = await Promise.all([getAreas(), getAreaBySlug(slug), getPropertiesByArea(slug)]);
        setAreas(catalog);
        setArea(areaData || getLocationBySlug(slug));
        setAreaProperties(listings);
      } catch (error) {
        console.error("Area page load error:", error);
        setArea(getLocationBySlug(slug));
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [slug]);

  const locationData = useMemo(() => getLocationBySlug(slug), [slug]);
  const heritage = useMemo(() => getAreaHeritage(slug), [slug]);
  const places = useMemo(() => getPlacesForLocation(slug), [slug]);
  const faqs = useMemo(() => (locationData ? generateLocationFAQs(locationData) : []), [locationData]);
  const insights = buildAreaInsights(slug, areaProperties);

  if (loading) {
    return <div className="min-h-screen bg-white" />;
  }

  if (!area) {
    return (
      <div className="min-h-screen bg-white px-4 py-12 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-charcoal-900 mb-4">{copy.notFoundTitle}</h1>
          <p className="text-charcoal-600 mb-8">{copy.notFoundBody}</p>
          <Link href="/areas" className="inline-block bg-teal-700 hover:bg-teal-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-200">
            {copy.backToAreas}
          </Link>
        </div>
      </div>
    );
  }

  const displayAreaName = locale === "ta" ? area.name_ta || area.name : area.name;
  const altAreaName = locale === "ta" ? area.name || area.slug : area.name_ta || area.slug;
  const areaDescription = locale === "ta" ? area.description_ta || area.description : area.description;
  const otherAreas = areas.filter((item) => item.slug !== slug).slice(0, 6);

  return (
    <div className="min-h-screen bg-white">
      <section className="relative overflow-hidden bg-gradient-to-br from-teal-900 via-teal-800 to-teal-700 text-white">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-14 w-56 h-56 rounded-full bg-warm-400 blur-3xl" />
          <div className="absolute bottom-8 right-10 w-72 h-72 rounded-full bg-teal-300 blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-4 py-16 relative z-10">
          <div className="max-w-3xl">
            <p className="uppercase tracking-[0.25em] text-warm-300 text-xs font-semibold mb-3">Area guide</p>
            <h1 className="text-4xl md:text-5xl font-bold mb-3">{displayAreaName}</h1>
            <p className="text-xl text-teal-100 mb-6">{altAreaName}</p>
            <p className="text-base md:text-lg text-teal-50/90 leading-relaxed">{areaDescription}</p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="bg-teal-50 p-6 rounded-3xl border border-teal-100">
            <p className="text-charcoal-600 text-sm font-semibold mb-2">{copy.totalProperties}</p>
            <p className="text-4xl font-bold text-teal-700">{insights.listingCount}</p>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-sand-200">
            <p className="text-charcoal-600 text-sm font-semibold mb-2">{copy.featuredListings}</p>
            <p className="text-4xl font-bold text-charcoal-900">{insights.featuredCount}</p>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-sand-200">
            <p className="text-charcoal-600 text-sm font-semibold mb-2">{copy.verifiedListings}</p>
            <p className="text-4xl font-bold text-charcoal-900">{insights.verifiedCount}</p>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-sand-200">
            <p className="text-charcoal-600 text-sm font-semibold mb-2">{copy.averagePrice}</p>
            <p className="text-2xl font-bold text-charcoal-900">{formatCompactPrice(insights.avgPrice, locale)}</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-8 mb-12">
          {/* Left Column: History & Buyer Notes */}
          <div className="space-y-6">
            <section className="rounded-3xl border border-sand-200 p-8 bg-[#FAF7F3]">
              <span className="bg-[#D4A853]/10 text-[#0F2E25] text-xs font-black uppercase tracking-wider px-3.5 py-1 rounded-full mb-3.5 inline-block">
                📜 {locale === "ta" ? "வரலாறு மற்றும் கலாசாரம்" : "History & Heritage"}
              </span>
              <h2 className="text-2xl font-black text-charcoal-900 mb-4">
                {locale === "ta" ? `${displayAreaName} பகுதி வரலாறு` : `Cultural History of ${displayAreaName}`}
              </h2>
              <p className="text-charcoal-700 leading-relaxed font-medium text-base mb-4">
                {locale === "ta" ? heritage.history.ta : heritage.history.en}
              </p>
            </section>

            <section className="rounded-3xl border border-sand-200 p-8">
              <h2 className="text-2xl font-black text-charcoal-900 mb-4">{copy.buyerNotes}</h2>
              <p className="text-charcoal-700 leading-relaxed mb-4">{locale === "ta" ? locationData?.whyLiveHere?.ta : locationData?.whyLiveHere?.en}</p>
              <p className="text-charcoal-700 leading-relaxed mb-4">{locale === "ta" ? locationData?.transportAccess?.ta : locationData?.transportAccess?.en}</p>
              {locationData?.priceRange && (
                <div className="inline-flex items-center gap-2.5 rounded-full bg-sand-100 px-5 py-2.5 text-sm font-black text-[#0F2E25] border border-sand-250">
                  {copy.priceBand}: {formatCompactPrice(locationData.priceRange.min, locale)} - {formatCompactPrice(locationData.priceRange.max, locale)}
                </div>
              )}
            </section>
          </div>

          {/* Right Column: Dynamic Leaflet Map & Remote Support */}
          <div className="space-y-6">
            {locationData && (
              <section className="rounded-3xl border border-sand-200 p-4 bg-white shadow-sm">
                <div className="p-3">
                  <h3 className="text-lg font-black text-charcoal-950 mb-1">
                    {locale === "ta" ? "வரைபட இருப்பிடம்" : "Interactive Map Location"}
                  </h3>
                  <p className="text-xs text-charcoal-500 font-medium mb-3">
                    {locale === "ta" ? "குடாநாட்டின் உள்ளூர் இட அமைப்பை ஆராயுங்கள்" : "Explore division coordinates & regional scale"}
                  </p>
                </div>
                <AreaMap location={locationData} />
              </section>
            )}

            <section className="rounded-3xl border border-sand-200 p-8 bg-[#0F2E25] text-white relative overflow-hidden shadow-md">
              <div className="absolute inset-0 opacity-5">
                <div className="absolute bottom-[-20%] right-[-10%] w-72 h-72 rounded-full bg-[#D4A853] blur-3xl" />
              </div>
              <div className="relative z-10">
                <h2 className="text-2xl font-black mb-3.5">{copy.remoteTitle}</h2>
                <p className="text-teal-100/90 leading-relaxed mb-5">{copy.remoteBody}</p>
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-xl bg-white/10 border border-white/10 px-3.5 py-1.5 text-xs font-semibold text-sand-100">
                    {locale === "ta" ? "உரிமையாளர் வழங்கும் படங்கள்" : "Owner-supplied media"}
                  </span>
                  <span className="rounded-xl bg-white/10 border border-white/10 px-3.5 py-1.5 text-xs font-semibold text-sand-100">
                    {locale === "ta" ? "சுயாதீன ஆவண ஆய்வு" : "Independent document review"}
                  </span>
                  <span className="rounded-xl bg-white/10 border border-white/10 px-3.5 py-1.5 text-xs font-semibold text-sand-100">
                    {locale === "ta" ? "நில அளவையாளர் ஆய்வு" : "Surveyor checks"}
                  </span>
                </div>
                <div className="mt-6">
                  <Link
                    href="/diaspora#inspection"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#D4A853] px-5 py-3 text-xs font-bold text-[#0F2E25] hover:bg-[#e4be63] transition shadow-md"
                  >
                    <span>{locale === "ta" ? "அடுத்த படிகளைத் திட்டமிடுங்கள்" : "Plan your next steps"}</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Landmark Attractions Gallery */}
        {heritage.attractions && heritage.attractions.length > 0 && (
          <section className="mb-12 border-t border-sand-200 pt-10">
            <div className="mb-8">
              <span className="bg-[#D4A853]/10 text-[#0F2E25] text-xs font-black uppercase tracking-wider px-3.5 py-1 rounded-full mb-3 inline-block">
                🗺️ {locale === "ta" ? "சுற்றுலா மற்றும் வழிபாட்டு தலங்கள்" : "Sightseeing & Landmarks"}
              </span>
              <h2 className="text-3xl font-black text-charcoal-900">
                {locale === "ta" ? `${displayAreaName} பகுதியில் உள்ள முக்கிய இடங்கள்` : `Points of Interest in ${displayAreaName}`}
              </h2>
              <p className="text-charcoal-500 font-semibold mt-1">
                {locale === "ta" ? "வருகை தந்து பார்க்க வேண்டிய முக்கியமான மற்றும் வரலாற்று சிறப்புமிக்க இடங்கள்" : "Explore top-rated tourist attractions, sacred temples, beaches, and structural marvels worth visiting."}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {heritage.attractions.map((place) => (
                <div key={place.name} className="group rounded-3xl border border-sand-200 overflow-hidden bg-white hover:shadow-lg transition-all duration-300 flex flex-col">
                  <div className="h-56 relative overflow-hidden bg-sand-100">
                    <img
                      src={place.image}
                      alt={place.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <span className="absolute top-4 left-4 bg-white/95 text-[#0F2E25] backdrop-blur-sm text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-sm">
                      {place.category}
                    </span>
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-charcoal-900 group-hover:text-teal-700 transition-colors mb-2">
                        {locale === "ta" ? place.name_ta : place.name}
                      </h3>
                      {locale === "ta" && place.name_ta !== place.name && (
                        <p className="text-xs text-charcoal-400 font-bold mb-3">{place.name}</p>
                      )}
                      <p className="text-sm text-charcoal-600 leading-relaxed">
                        {locale === "ta" ? place.description.ta : place.description.en}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-charcoal-900">
              {locale === "ta" ? copy.areaProperties : `${copy.areaProperties} ${displayAreaName}`}
            </h2>
            <Link href="/areas" className="text-teal-700 hover:text-teal-600 font-semibold">
              {copy.backToAreas}
            </Link>
          </div>

          {areaProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {areaProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <div className="bg-charcoal-50 p-12 rounded-3xl text-center">
              <p className="text-charcoal-700 text-lg">{copy.empty}</p>
            </div>
          )}
        </section>

        {otherAreas.length > 0 && (
          <section className="border-t border-charcoal-200 pt-12">
            <h2 className="text-2xl font-bold text-charcoal-900 mb-6">{copy.otherAreas}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {otherAreas.map((otherArea) => (
                <Link key={otherArea.slug} href={`/areas/${otherArea.slug}`} className="group rounded-3xl border border-sand-200 p-5 hover:shadow-md transition bg-white">
                  <p className="text-lg font-bold text-charcoal-900 group-hover:text-teal-700">
                    {locale === "ta" ? otherArea.name_ta || otherArea.name : otherArea.name}
                  </p>
                  <p className="text-sm text-charcoal-500 mb-3">{locale === "ta" ? otherArea.name : otherArea.name_ta}</p>
                  <div className="flex items-center justify-between text-sm text-charcoal-600">
                    <span>{otherArea.properties_count} listings</span>
                    <span className="text-teal-700 font-semibold">View area</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>

      {locationData && (
        <>
          <AreaGuideContent location={locationData} />
          {places.length > 0 && <NearbyLandmarks places={places} locationName={locationData.name} />}
          <FAQSection faqs={faqs} title={`FAQs: Property in ${locationData.name}`} />
          <InternalLinks currentLocation={slug} location={locationData} />
        </>
      )}
    </div>
  );
}
