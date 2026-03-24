// @ts-nocheck
"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { PROPERTIES as MOCK_PROPERTIES, AREAS as MOCK_AREAS } from "@/lib/data";
import { getPropertyById, getPropertiesByArea, getAreas } from "@/lib/firestore";

export default function PropertyDetailClient() {
  const params = useParams();
  const id = params.id as string;

  const [property, setProperty] = useState(null);
  const [relatedProperties, setRelatedProperties] = useState([]);
  const [areas, setAreas] = useState(MOCK_AREAS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [firestoreProp, firestoreAreas] = await Promise.all([
          getPropertyById(id),
          getAreas(),
        ]);

        if (firestoreAreas.length > 0) setAreas(firestoreAreas);

        if (firestoreProp) {
          setProperty(firestoreProp);
          const related = await getPropertiesByArea(firestoreProp.area);
          setRelatedProperties(related.filter((p) => p.id !== id).slice(0, 3));
        } else {
          // Fallback to mock data
          const mockProp = MOCK_PROPERTIES.find((p) => p.id === id);
          setProperty(mockProp || null);
          if (mockProp) {
            setRelatedProperties(
              MOCK_PROPERTIES.filter((p) => p.area === mockProp.area && p.id !== id).slice(0, 3)
            );
          }
        }
      } catch (err) {
        console.error('Firestore load error:', err);
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
    return (
      <div className="min-h-screen bg-white">
        <div className="w-full bg-charcoal-100">
          <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="w-full h-96 bg-charcoal-200 rounded-lg animate-pulse" />
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-4 py-12 space-y-6">
          <div className="h-8 bg-charcoal-200 rounded w-1/2 animate-pulse" />
          <div className="h-12 bg-charcoal-200 rounded w-1/3 animate-pulse" />
          <div className="grid grid-cols-4 gap-6">
            {[1,2,3,4].map((i) => <div key={i} className="h-20 bg-charcoal-100 rounded-lg animate-pulse" />)}
          </div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-white px-4 py-12 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-charcoal-900 mb-4">Property Not Found</h1>
          <p className="text-charcoal-600 mb-8">The property you are looking for does not exist or has been removed.</p>
          <Link href="/properties" className="inline-block bg-navy-700 hover:bg-navy-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-200">
            Back to Properties
          </Link>
        </div>
      </div>
    );
  }

  const areaName = areas.find((a) => a.slug === property.area)?.name || property.area;

  return (
    <div className="min-h-screen bg-white">
      {/* Image Gallery */}
      <div className="w-full bg-charcoal-100">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="w-full h-96 bg-gradient-to-br from-sand-200 to-sand-300 rounded-lg mb-6 flex items-center justify-center">
            <span className="text-sand-600 text-lg">Property Image</span>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((index) => (
              <div key={index} className="h-24 bg-gradient-to-br from-sand-200 to-sand-300 rounded-lg flex items-center justify-center cursor-pointer hover:opacity-80 transition">
                <span className="text-sand-600 text-sm">Image {index}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-3">
            <span className="inline-block bg-navy-100 text-navy-700 px-3 py-1 rounded-full text-sm font-semibold">{areaName}</span>
            <span className="inline-block bg-navy-50 text-teal-700 px-3 py-1 rounded-full text-sm font-semibold">{property.type}</span>
          </div>
          <h1 className="text-4xl font-bold text-charcoal-900">{property.title}</h1>
        </div>

        <div className="mb-8">
          <p className="text-5xl font-bold text-navy-700">Rs. {property.price?.toLocaleString("en-US")}</p>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10 pb-10 border-b border-charcoal-200">
          <div className="bg-charcoal-50 p-4 rounded-lg">
            <p className="text-charcoal-600 text-sm font-semibold mb-2">Bedrooms</p>
            <p className="text-2xl font-bold text-charcoal-900">{property.bedrooms}</p>
          </div>
          <div className="bg-charcoal-50 p-4 rounded-lg">
            <p className="text-charcoal-600 text-sm font-semibold mb-2">Bathrooms</p>
            <p className="text-2xl font-bold text-charcoal-900">{property.bathrooms}</p>
          </div>
          <div className="bg-charcoal-50 p-4 rounded-lg">
            <p className="text-charcoal-600 text-sm font-semibold mb-2">Area</p>
            <p className="text-2xl font-bold text-charcoal-900">{property.sqft} sqft</p>
          </div>
          <div className="bg-charcoal-50 p-4 rounded-lg">
            <p className="text-charcoal-600 text-sm font-semibold mb-2">Type</p>
            <p className="text-2xl font-bold text-charcoal-900">{property.type}</p>
          </div>
        </div>

        {/* Description */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-charcoal-900 mb-4">About This Property</h2>
          <p className="text-charcoal-700 leading-relaxed text-lg">
            {property.description || "This is a beautiful property in a prime location."}
          </p>
        </div>

        {/* Location */}
        <div className="mb-10 pb-10 border-b border-charcoal-200">
          <h2 className="text-2xl font-bold text-charcoal-900 mb-4">Location</h2>
          <div className="bg-navy-50 p-6 rounded-lg">
            <p className="text-charcoal-900 font-semibold text-lg">{areaName}</p>
            <p className="text-charcoal-700 mt-2">Located in the heart of {areaName}, this property enjoys excellent connectivity and access to essential amenities.</p>
          </div>
        </div>

        <div className="mb-10">
          <button className="w-full md:w-auto bg-navy-700 hover:bg-navy-600 text-white font-bold py-4 px-8 rounded-lg transition duration-200 text-lg">
            Contact Agent
          </button>
        </div>

        <div className="mb-12">
          <Link href="/properties" className="text-navy-700 hover:text-teal-700 font-semibold flex items-center gap-2">
            ← Back to Properties
          </Link>
        </div>

        {/* Related Properties */}
        {relatedProperties.length > 0 && (
          <div className="border-t border-charcoal-200 pt-12">
            <h2 className="text-2xl font-bold text-charcoal-900 mb-6">Similar Properties in {areaName}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedProperties.map((prop) => (
                <Link key={prop.id} href={`/properties/${prop.id}`} className="group bg-white border border-charcoal-200 rounded-lg overflow-hidden hover:shadow-lg transition duration-200">
                  <div className="h-48 bg-gradient-to-br from-sand-200 to-sand-300 flex items-center justify-center">
                    <span className="text-sand-600">Property Image</span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-charcoal-900 mb-2 group-hover:text-navy-700">{prop.title}</h3>
                    <p className="text-navy-700 font-semibold mb-3">Rs. {prop.price?.toLocaleString("en-US")}</p>
                    <div className="flex gap-3 text-sm text-charcoal-600">
                      <span>{prop.bedrooms} beds</span>
                      <span>•</span>
                      <span>{prop.bathrooms} baths</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
