// @ts-nocheck
'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';
import { AREAS as MOCK_AREAS } from '@/lib/data';
import { getAreas } from '@/lib/firestore';

export default function AreasPage() {
  const [areas, setAreas] = useState(MOCK_AREAS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const firestoreAreas = await getAreas();
        if (firestoreAreas.length > 0) setAreas(firestoreAreas);
      } catch (err) {
        console.error('Firestore load error:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-sand-50">
      <div className="bg-gradient-to-r from-navy-900 to-navy-800 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">Explore Areas in Jaffna</h1>
          <p className="text-navy-100">Discover properties in your favorite neighborhood</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto py-12 px-4">
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1,2,3,4,5,6].map((i) => (
              <div key={i} className="bg-white rounded-lg overflow-hidden shadow-lg animate-pulse">
                <div className="h-40 bg-charcoal-200" />
                <div className="p-6 space-y-3">
                  <div className="h-6 bg-charcoal-200 rounded w-1/2" />
                  <div className="h-4 bg-charcoal-100 rounded w-1/3" />
                  <div className="h-4 bg-charcoal-100 rounded w-3/4" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {areas.map((area) => (
              <Link key={area.slug} href={`/areas/${area.slug}`} className="group">
                <div className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow cursor-pointer h-full">
                  <div className="h-40 bg-gradient-to-br from-navy-500 via-teal-400 to-warm-400 relative flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform">
                    <MapPin className="w-12 h-12 text-white opacity-50" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-charcoal-900 mb-1">{area.name}</h3>
                    <p className="text-teal-600 font-semibold mb-4">{area.name_ta}</p>
                    <p className="text-charcoal-600 text-sm mb-4 line-clamp-2">{area.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-charcoal-700">{area.properties_count} properties</span>
                      <span className="text-teal-600 font-semibold group-hover:text-teal-700">Explore →</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
