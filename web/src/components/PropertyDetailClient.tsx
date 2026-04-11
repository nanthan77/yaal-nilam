// @ts-nocheck
"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import PropertyCard from "@/components/PropertyCard";
import { PROPERTIES as MOCK_PROPERTIES, AREAS as MOCK_AREAS } from "@/lib/data";
import { getPropertyById, getPropertiesByArea, getAreas } from "@/lib/firestore";
import { useStore } from "@/lib/store";
import { formatPrice, getPropertyTypeLabel, localize } from "@/lib/translations";

export default function PropertyDetailClient() {
  const { locale } = useStore();
  const params = useParams();
  const id = params.id as string;

  const [property, setProperty] = useState(null);
  const [relatedProperties, setRelatedProperties] = useState([]);
  const [areas, setAreas] = useState(MOCK_AREAS);
  const [loading, setLoading] = useState(true);

  const copy = localize(locale, {
    en: {
      notFoundTitle: "Property Not Found",
      notFoundBody: "The property you are looking for does not exist or is no longer available.",
      backToProperties: "Back to Properties",
      bedrooms: "Bedrooms",
      bathrooms: "Bathrooms",
      area: "Floor Area",
      type: "Type",
      about: "About This Property",
      location: "Location",
      locationBody: "This property is located in an area with strong local access and day-to-day convenience.",
      contact: "Contact Agent",
      similar: "Similar Properties",
    },
    ta: {
      notFoundTitle: "சொத்து கிடைக்கவில்லை",
      notFoundBody: "நீங்கள் தேடும் சொத்து தற்போது இல்லை அல்லது இனி கிடைக்காது.",
      backToProperties: "சொத்துகளுக்குத் திரும்பவும்",
      bedrooms: "படுக்கையறைகள்",
      bathrooms: "குளியலறைகள்",
      area: "பரப்பளவு",
      type: "வகை",
      about: "இந்த சொத்தைப் பற்றி",
      location: "இடம்",
      locationBody: "இந்த சொத்து அன்றாட வசதிகளுக்கும் உள்ளூர் அணுகலுக்கும் ஏற்ற பகுதியில் அமைந்துள்ளது.",
      contact: "முகவரைத் தொடர்பு கொள்ளுங்கள்",
      similar: "இதே போன்ற சொத்துக்கள்",
    },
  });

  useEffect(() => {
    async function loadData() {
      try {
        const [firestoreProp, firestoreAreas] = await Promise.all([getPropertyById(id), getAreas()]);

        if (firestoreAreas.length > 0) setAreas(firestoreAreas);

        if (firestoreProp) {
          setProperty(firestoreProp);
          const related = await getPropertiesByArea(firestoreProp.area);
          setRelatedProperties(related.filter((p) => p.id !== id).slice(0, 3));
        } else {
          const mockProp = MOCK_PROPERTIES.find((p) => p.id === id);
          setProperty(mockProp || null);
          if (mockProp) {
            setRelatedProperties(
              MOCK_PROPERTIES.filter((p) => p.area === mockProp.area && p.id !== id).slice(0, 3)
            );
          }
        }
      } catch (err) {
        console.error("Firestore load error:", err);
        const mockProp = MOCK_PROPERTIES.find((p) => p.id === id);
        setProperty(mockProp || null);
        if (mockProp) {
          setRelatedProperties(
            MOCK_PROPERTIES.filter((p) => p.area === mockProp.area && p.id !== id).slice(0, 3)
          );
        }
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  if (loading) {
    return <div className="min-h-screen bg-white" />;
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-white px-4 py-12 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-charcoal-900 mb-4">{copy.notFoundTitle}</h1>
          <p className="text-charcoal-600 mb-8">{copy.notFoundBody}</p>
          <Link href="/properties" className="inline-block bg-teal-700 hover:bg-teal-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-200">
            {copy.backToProperties}
          </Link>
        </div>
      </div>
    );
  }

  const areaData = areas.find((a) => a.slug === property.area);
  const areaName = locale === "ta" ? areaData?.name_ta || areaData?.name || property.area : areaData?.name || property.area;
  const areaNameAlt = locale === "ta" ? areaData?.name || property.area : areaData?.name_ta || property.area;
  const propertyTitle = locale === "ta" && property.title_ta ? property.title_ta : property.title;
  const propertyDescription =
    locale === "ta" ? property.description_ta || property.description : property.description;

  return (
    <div className="min-h-screen bg-white">
      <div className="w-full bg-charcoal-100">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="w-full h-96 bg-gradient-to-br from-sand-200 to-sand-300 rounded-lg mb-6 flex items-center justify-center">
            <span className="text-sand-600 text-lg">{propertyTitle}</span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-3">
            <span className="inline-block bg-teal-100 text-teal-700 px-3 py-1 rounded-full text-sm font-semibold">{areaName}</span>
            <span className="inline-block bg-teal-50 text-teal-700 px-3 py-1 rounded-full text-sm font-semibold">
              {getPropertyTypeLabel(property.type || property.property_type, locale)}
            </span>
          </div>
          <h1 className="text-4xl font-bold text-charcoal-900">{propertyTitle}</h1>
          <p className="text-charcoal-500 mt-2">{areaNameAlt}</p>
        </div>

        <div className="mb-8">
          <p className="text-5xl font-bold text-teal-700">{formatPrice(property.price || 0, locale)}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10 pb-10 border-b border-charcoal-200">
          <div className="bg-charcoal-50 p-4 rounded-lg">
            <p className="text-charcoal-600 text-sm font-semibold mb-2">{copy.bedrooms}</p>
            <p className="text-2xl font-bold text-charcoal-900">{property.bedrooms || 0}</p>
          </div>
          <div className="bg-charcoal-50 p-4 rounded-lg">
            <p className="text-charcoal-600 text-sm font-semibold mb-2">{copy.bathrooms}</p>
            <p className="text-2xl font-bold text-charcoal-900">{property.bathrooms || 0}</p>
          </div>
          <div className="bg-charcoal-50 p-4 rounded-lg">
            <p className="text-charcoal-600 text-sm font-semibold mb-2">{copy.area}</p>
            <p className="text-2xl font-bold text-charcoal-900">
              {property.sqft ? `${property.sqft} sqft` : property.land_size_perches ? `${property.land_size_perches} P` : "-"}
            </p>
          </div>
          <div className="bg-charcoal-50 p-4 rounded-lg">
            <p className="text-charcoal-600 text-sm font-semibold mb-2">{copy.type}</p>
            <p className="text-2xl font-bold text-charcoal-900">
              {getPropertyTypeLabel(property.type || property.property_type, locale)}
            </p>
          </div>
        </div>

        <div className="mb-10">
          <h2 className="text-2xl font-bold text-charcoal-900 mb-4">{copy.about}</h2>
          <p className="text-charcoal-700 leading-relaxed text-lg">{propertyDescription}</p>
        </div>

        <div className="mb-10 pb-10 border-b border-charcoal-200">
          <h2 className="text-2xl font-bold text-charcoal-900 mb-4">{copy.location}</h2>
          <div className="bg-teal-50 p-6 rounded-lg">
            <p className="text-charcoal-900 font-semibold text-lg">{areaName}</p>
            <p className="text-charcoal-700 mt-2">{copy.locationBody}</p>
          </div>
        </div>

        <div className="mb-10">
          <a
            href={`https://wa.me/${(property.agent_phone || "94777863333").replace(/\+/g, "")}?text=${encodeURIComponent(
              locale === "ta"
                ? `${propertyTitle} பற்றி தெரிந்து கொள்ள விரும்புகிறேன்.`
                : `Hi, I'm interested in ${property.title}.`
            )}`}
            className="w-full md:w-auto inline-flex items-center justify-center bg-teal-700 hover:bg-teal-600 text-white font-bold py-4 px-8 rounded-lg transition duration-200 text-lg"
            target="_blank"
            rel="noopener noreferrer"
          >
            {copy.contact}
          </a>
        </div>

        <div className="mb-12">
          <Link href="/properties" className="text-teal-700 hover:text-teal-600 font-semibold flex items-center gap-2">
            ← {copy.backToProperties}
          </Link>
        </div>

        {relatedProperties.length > 0 && (
          <div className="border-t border-charcoal-200 pt-12">
            <h2 className="text-2xl font-bold text-charcoal-900 mb-6">{copy.similar}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedProperties.map((prop) => (
                <PropertyCard key={prop.id} property={prop} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
