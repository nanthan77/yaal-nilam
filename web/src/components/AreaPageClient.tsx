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
      verifiedListings: "Verified listings",
      areaProperties: "Properties in",
      empty: "There are no properties in this area at the moment.",
      otherAreas: "Explore Other Areas",
      buyerNotes: "Buyer notes",
      priceBand: "Typical price band",
      remoteTitle: "Diaspora buying support",
      remoteBody: "Need a remote shortlist, lawyer coordination, or video walkthrough? This area is supported through the same bilingual lead flow used across Yaal Nilam.",
      landmarks: "Nearby places people ask about",
    },
    ta: {
      notFoundTitle: "இந்த பகுதி கிடைக்கவில்லை",
      notFoundBody: "நீங்கள் தேடும் பகுதி தற்போது கிடைக்கவில்லை அல்லது பட்டியலில் இல்லை.",
      backToAreas: "பகுதிகளுக்குத் திரும்பவும்",
      totalProperties: "நேரடி சொத்துக்கள்",
      featuredListings: "முன்னிலை பட்டியல்கள்",
      averagePrice: "சராசரி கேட்கப்படும் விலை",
      verifiedListings: "சரிபார்க்கப்பட்ட பட்டியல்கள்",
      areaProperties: "இந்த பகுதியில் உள்ள சொத்துக்கள்",
      empty: "இந்த பகுதியில் தற்போது சொத்துக்கள் எதுவும் இல்லை.",
      otherAreas: "மற்ற பகுதிகளைப் பாருங்கள்",
      buyerNotes: "வாங்குபவர் குறிப்புகள்",
      priceBand: "சாதாரண விலை வரம்பு",
      remoteTitle: "வெளிநாட்டு வாங்குபவர் உதவி",
      remoteBody: "Remote shortlist, lawyer coordination, அல்லது video walkthrough வேண்டுமா? இந்த பகுதி Yaal Nilam முழுவதும் பயன்படுத்தும் bilingual lead flow-இல் ஆதரிக்கப்படுகிறது.",
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

        <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-6 mb-10">
          <section className="rounded-3xl border border-sand-200 p-6">
            <h2 className="text-2xl font-bold text-charcoal-900 mb-3">{copy.buyerNotes}</h2>
            <p className="text-charcoal-700 mb-4">{locale === "ta" ? locationData?.whyLiveHere?.ta : locationData?.whyLiveHere?.en}</p>
            <p className="text-charcoal-700 mb-4">{locale === "ta" ? locationData?.transportAccess?.ta : locationData?.transportAccess?.en}</p>
            {locationData?.priceRange && (
              <div className="inline-flex items-center gap-2 rounded-full bg-sand-100 px-4 py-2 text-sm font-semibold text-charcoal-800">
                {copy.priceBand}: {formatCompactPrice(locationData.priceRange.min, locale)} - {formatCompactPrice(locationData.priceRange.max, locale)}
              </div>
            )}
          </section>

          <section className="rounded-3xl border border-sand-200 p-6 bg-teal-950 text-white">
            <h2 className="text-2xl font-bold mb-3">{copy.remoteTitle}</h2>
            <p className="text-teal-100 mb-4">{copy.remoteBody}</p>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-white/10 border border-white/10 px-3 py-1.5 text-sm">WhatsApp shortlists</span>
              <span className="rounded-full bg-white/10 border border-white/10 px-3 py-1.5 text-sm">Lawyer handoff</span>
              <span className="rounded-full bg-white/10 border border-white/10 px-3 py-1.5 text-sm">Video walkthroughs</span>
            </div>
          </section>
        </div>

        {places.length > 0 && (
          <section className="mb-10 rounded-3xl border border-sand-200 p-6 bg-white">
            <h2 className="text-2xl font-bold text-charcoal-900 mb-4">{copy.landmarks}</h2>
            <div className="flex flex-wrap gap-2">
              {places.slice(0, 8).map((place) => (
                <span key={place.name} className="rounded-full bg-sand-100 px-4 py-2 text-sm text-charcoal-700">
                  {locale === "ta" ? place.name_ta : place.name}
                </span>
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
