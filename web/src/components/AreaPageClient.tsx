// @ts-nocheck
"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import PropertyCard from "@/components/PropertyCard";
import { AREAS as MOCK_AREAS, PROPERTIES as MOCK_PROPERTIES } from "@/lib/data";
import { ALL_LOCATIONS, getLocationBySlug, getPlacesForLocation } from "@/lib/locations";
import { getAreas, getPropertiesByArea } from "@/lib/firestore";
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

  const [area, setArea] = useState(null);
  const [areas, setAreas] = useState(MOCK_AREAS);
  const [areaProperties, setAreaProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const copy = localize(locale, {
    en: {
      notFoundTitle: "Area Not Found",
      notFoundBody: "The area you are looking for does not exist or is not available right now.",
      backToAreas: "Back to Areas",
      totalProperties: "Total Properties",
      featuredListings: "Featured Listings",
      averagePrice: "Average Price",
      areaProperties: "Properties in",
      empty: "There are no properties in this area at the moment.",
      otherAreas: "Explore Other Areas",
    },
    ta: {
      notFoundTitle: "இந்த பகுதி கிடைக்கவில்லை",
      notFoundBody: "நீங்கள் தேடும் பகுதி தற்போது கிடைக்கவில்லை அல்லது பட்டியலில் இல்லை.",
      backToAreas: "பகுதிகளுக்குத் திரும்பவும்",
      totalProperties: "மொத்த சொத்துக்கள்",
      featuredListings: "முன்னிலை பட்டியல்கள்",
      averagePrice: "சராசரி விலை",
      areaProperties: "இந்த பகுதியில் உள்ள சொத்துக்கள்",
      empty: "இந்த பகுதியில் தற்போது சொத்துக்கள் எதுவும் இல்லை.",
      otherAreas: "மற்ற பகுதிகளைப் பாருங்கள்",
    },
  });

  useEffect(() => {
    async function loadData() {
      try {
        const [firestoreAreas, firestoreProps] = await Promise.all([
          getAreas(),
          getPropertiesByArea(slug),
        ]);
        const allAreas = firestoreAreas.length > 0 ? firestoreAreas : MOCK_AREAS;
        setAreas(allAreas);
        const foundArea = allAreas.find((a) => a.slug === slug);
        const locData = getLocationBySlug(slug);
        setArea(foundArea || (locData ? { slug: locData.slug, name: locData.name, name_ta: locData.name_ta, description: locData.description.en, description_ta: locData.description.ta, properties_count: locData.properties_count, image: locData.image } : null));
        if (firestoreProps.length > 0) {
          setAreaProperties(firestoreProps);
        } else {
          setAreaProperties(MOCK_PROPERTIES.filter((p) => p.area === slug));
        }
      } catch (err) {
        console.error("Firestore load error:", err);
        const foundArea = MOCK_AREAS.find((a) => a.slug === slug);
        const locData = getLocationBySlug(slug);
        setArea(foundArea || (locData ? { slug: locData.slug, name: locData.name, name_ta: locData.name_ta, description: locData.description.en, description_ta: locData.description.ta, properties_count: locData.properties_count, image: locData.image } : null));
        setAreaProperties(MOCK_PROPERTIES.filter((p) => p.area === slug));
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="w-full h-80 bg-gradient-to-r from-teal-600 to-teal-500 animate-pulse" />
      </div>
    );
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

  const otherAreas = areas.filter((a) => a.slug !== area.slug).slice(0, 5);
  const featuredCount = areaProperties.filter((p) => p.featured).length;
  const averagePrice =
    areaProperties.length > 0
      ? Math.round(areaProperties.reduce((sum, p) => sum + (p.price || 0), 0) / areaProperties.length)
      : 0;

  const displayAreaName = locale === "ta" ? area.name_ta || area.name : area.name;
  const altAreaName = locale === "ta" ? area.name : area.name_ta;
  const areaDescription = locale === "ta" ? area.description_ta || area.description : area.description;

  return (
    <div className="min-h-screen bg-white">
      <div className="w-full h-80 bg-gradient-to-r from-teal-700 to-teal-500 flex items-center justify-center text-white">
        <div className="text-center px-4">
          <h1 className="text-5xl font-bold mb-2">{displayAreaName}</h1>
          <p className="text-2xl font-semibold text-sand-100">{altAreaName}</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="mb-12">
          <p className="text-lg text-charcoal-700 leading-relaxed">{areaDescription}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 pb-12 border-b border-charcoal-200">
          <div className="bg-teal-50 p-6 rounded-lg">
            <p className="text-charcoal-600 text-sm font-semibold mb-2">{copy.totalProperties}</p>
            <p className="text-4xl font-bold text-teal-600">{areaProperties.length}</p>
          </div>
          <div className="bg-teal-50 p-6 rounded-lg">
            <p className="text-charcoal-600 text-sm font-semibold mb-2">{copy.featuredListings}</p>
            <p className="text-4xl font-bold text-teal-700">{featuredCount}</p>
          </div>
          <div className="bg-sand-50 p-6 rounded-lg">
            <p className="text-charcoal-600 text-sm font-semibold mb-2">{copy.averagePrice}</p>
            <p className="text-2xl font-bold text-charcoal-900">{formatCompactPrice(averagePrice, locale)}</p>
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-3xl font-bold text-charcoal-900 mb-8">
            {locale === "ta" ? copy.areaProperties : `${copy.areaProperties} ${displayAreaName}`}
          </h2>
          {areaProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {areaProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <div className="bg-charcoal-50 p-12 rounded-lg text-center">
              <p className="text-charcoal-700 text-lg">{copy.empty}</p>
            </div>
          )}
        </div>

        <div className="mb-12">
          <Link href="/areas" className="text-teal-700 hover:text-teal-600 font-semibold flex items-center gap-2">
            ← {copy.backToAreas}
          </Link>
        </div>

        {otherAreas.length > 0 && (
          <div className="border-t border-charcoal-200 pt-12">
            <h2 className="text-2xl font-bold text-charcoal-900 mb-6">{copy.otherAreas}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {otherAreas.map((otherArea) => (
                <Link key={otherArea.slug} href={`/areas/${otherArea.slug}`} className="group bg-gradient-to-br from-teal-50 to-sand-50 p-6 rounded-lg border border-teal-200 hover:shadow-lg transition duration-200">
                  <h3 className="font-bold text-charcoal-900 mb-1 group-hover:text-teal-700">
                    {locale === "ta" ? otherArea.name_ta || otherArea.name : otherArea.name}
                  </h3>
                  <p className="text-sm text-charcoal-600 mb-3">
                    {locale === "ta" ? otherArea.name : otherArea.name_ta}
                  </p>
                  <p className="text-xs text-charcoal-600">
                    {otherArea.properties_count} {locale === "ta" ? "சொத்துக்கள்" : "properties"}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* pSEO sections */}
      {(() => {
        const locationData = getLocationBySlug(slug);
        if (!locationData) return null;
        const places = getPlacesForLocation(slug);
        const faqs = generateLocationFAQs(locationData);
        return (
          <>
            <AreaGuideContent location={locationData} />
            {places.length > 0 && <NearbyLandmarks places={places} locationName={locationData.name} />}
            <FAQSection faqs={faqs} title={`FAQs: Property in ${locationData.name}`} />
            <InternalLinks currentLocation={slug} location={locationData} />
          </>
        );
      })()}
    </div>
  );
}
