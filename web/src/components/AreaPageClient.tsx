// @ts-nocheck
"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { AREAS as MOCK_AREAS, PROPERTIES as MOCK_PROPERTIES } from "@/lib/data";
import { getAreas, getPropertiesByArea } from "@/lib/firestore";

export default function AreaPageClient() {
  const params = useParams();
  const slug = params.slug as string;

  const [area, setArea] = useState(null);
  const [areas, setAreas] = useState(MOCK_AREAS);
  const [areaProperties, setAreaProperties] = useState([]);
  const [loading, setLoading] = useState(true);

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
        setArea(foundArea || null);
        if (firestoreProps.length > 0) {
          setAreaProperties(firestoreProps);
        } else {
          setAreaProperties(MOCK_PROPERTIES.filter((p) => p.area === slug));
        }
      } catch (err) {
        console.error('Firestore load error:', err);
        const foundArea = MOCK_AREAS.find((a) => a.slug === slug);
        setArea(foundArea || null);
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
        <div className="w-full h-80 bg-gradient-to-r from-navy-500 to-teal-500 flex items-center justify-center text-white animate-pulse">
          <div className="text-center">
            <div className="h-12 bg-white/20 rounded w-64 mx-auto mb-4" />
            <div className="h-6 bg-white/20 rounded w-40 mx-auto" />
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="h-6 bg-charcoal-200 rounded w-3/4 mb-8 animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[1,2,3].map((i) => (
              <div key={i} className="bg-charcoal-100 p-6 rounded-lg animate-pulse h-24" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!area) {
    return (
      <div className="min-h-screen bg-white px-4 py-12 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-charcoal-900 mb-4">Area Not Found</h1>
          <p className="text-charcoal-600 mb-8">The area you are looking for does not exist or has been removed.</p>
          <Link href="/areas" className="inline-block bg-navy-700 hover:bg-navy-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-200">
            Back to Areas
          </Link>
        </div>
      </div>
    );
  }

  const otherAreas = areas.filter((a) => a.slug !== area.slug).slice(0, 5);
  const featuredCount = areaProperties.filter((p) => p.featured).length;
  const averagePrice = areaProperties.length > 0
    ? Math.round(areaProperties.reduce((sum, p) => sum + (p.price || 0), 0) / areaProperties.length)
    : 0;

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Banner */}
      <div className="w-full h-80 bg-gradient-to-r from-navy-500 to-teal-500 flex items-center justify-center text-white">
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-2">{area.name}</h1>
          <p className="text-2xl font-semibold text-sand-100">{area.name_ta}</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="mb-12">
          <p className="text-lg text-charcoal-700 leading-relaxed">
            {area.description || `Welcome to ${area.name}, one of the premier residential areas in Jaffna.`}
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 pb-12 border-b border-charcoal-200">
          <div className="bg-navy-50 p-6 rounded-lg">
            <p className="text-charcoal-600 text-sm font-semibold mb-2">Total Properties</p>
            <p className="text-4xl font-bold text-navy-600">{areaProperties.length}</p>
          </div>
          <div className="bg-navy-50 p-6 rounded-lg">
            <p className="text-charcoal-600 text-sm font-semibold mb-2">Featured Listings</p>
            <p className="text-4xl font-bold text-navy-700">{featuredCount}</p>
          </div>
          <div className="bg-sand-50 p-6 rounded-lg">
            <p className="text-charcoal-600 text-sm font-semibold mb-2">Average Price</p>
            <p className="text-2xl font-bold text-charcoal-900">Rs. {averagePrice.toLocaleString("en-US")}</p>
          </div>
        </div>

        {/* Properties Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-charcoal-900 mb-8">Properties in {area.name}</h2>
          {areaProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {areaProperties.map((property) => (
                <Link key={property.id} href={`/properties/${property.id}`} className="group bg-white border border-charcoal-200 rounded-lg overflow-hidden hover:shadow-xl transition duration-200">
                  <div className="h-48 bg-gradient-to-br from-sand-200 to-sand-300 flex items-center justify-center relative">
                    <span className="text-sand-600">Property Image</span>
                    {property.featured && (
                      <div className="absolute top-3 right-3 bg-navy-700 text-white px-3 py-1 rounded-full text-xs font-bold">Featured</div>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-charcoal-900 text-lg mb-2 group-hover:text-navy-700 line-clamp-2">{property.title}</h3>
                    <p className="text-navy-700 font-bold text-xl mb-4">Rs. {property.price?.toLocaleString("en-US")}</p>
                    <div className="flex gap-4 mb-4 text-sm text-charcoal-600">
                      <span><span className="font-semibold">{property.bedrooms}</span> bed{property.bedrooms !== 1 ? "s" : ""}</span>
                      <span>•</span>
                      <span><span className="font-semibold">{property.bathrooms}</span> bath{property.bathrooms !== 1 ? "s" : ""}</span>
                    </div>
                    <span className="inline-block bg-navy-100 text-navy-700 px-3 py-1 rounded text-xs font-semibold">{property.type}</span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-charcoal-50 p-12 rounded-lg text-center">
              <p className="text-charcoal-700 text-lg">No properties found in {area.name} at the moment.</p>
            </div>
          )}
        </div>

        <div className="mb-12">
          <Link href="/areas" className="text-navy-700 hover:text-teal-700 font-semibold flex items-center gap-2">
            ← Back to Areas
          </Link>
        </div>

        {otherAreas.length > 0 && (
          <div className="border-t border-charcoal-200 pt-12">
            <h2 className="text-2xl font-bold text-charcoal-900 mb-6">Explore Other Areas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {otherAreas.map((otherArea) => (
                <Link key={otherArea.slug} href={`/areas/${otherArea.slug}`} className="group bg-gradient-to-br from-navy-50 to-teal-50 p-6 rounded-lg border border-navy-200 hover:shadow-lg transition duration-200">
                  <h3 className="font-bold text-charcoal-900 mb-1 group-hover:text-navy-700">{otherArea.name}</h3>
                  <p className="text-sm text-charcoal-600 mb-3">{otherArea.name_ta}</p>
                  <p className="text-xs text-charcoal-600">{otherArea.properties_count} properties</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
