// @ts-nocheck
'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';
import { AREAS as MOCK_AREAS } from '@/lib/data';
import { getAreas } from '@/lib/firestore';
import { useStore } from '@/lib/store';
import { localize } from '@/lib/translations';

export default function AreasPage() {
  const { locale } = useStore();
  const [areas, setAreas] = useState(MOCK_AREAS);
  const [loading, setLoading] = useState(true);

  const copy = localize(locale, {
    en: {
      title: 'Explore Areas in Jaffna',
      subtitle: 'Discover neighborhoods across the Jaffna Peninsula and compare where to buy, rent, or invest.',
      properties: 'properties',
      explore: 'Explore',
    },
    ta: {
      title: 'யாழ்ப்பாணத்தின் பகுதிகளை ஆராயுங்கள்',
      subtitle: 'வாங்க, வாடகைக்கு எடுக்க, அல்லது முதலீடு செய்ய ஏற்ற யாழ் குடாநாட்டின் பகுதிகளை ஒப்பிட்டு பாருங்கள்.',
      properties: 'சொத்துக்கள்',
      explore: 'பார்க்கவும்',
    },
  });

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
      <div className="bg-gradient-to-r from-teal-900 to-teal-800 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">{copy.title}</h1>
          <p className="text-teal-100">{copy.subtitle}</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto py-12 px-4">
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
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
                  <div className="h-40 bg-gradient-to-br from-teal-500 via-teal-400 to-warm-400 relative flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform">
                    <MapPin className="w-12 h-12 text-white opacity-50" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-charcoal-900 mb-1">
                      {locale === 'ta' ? area.name_ta || area.name : area.name}
                    </h3>
                    <p className="text-teal-600 font-semibold mb-4">
                      {locale === 'ta' ? area.name : area.name_ta}
                    </p>
                    <p className="text-charcoal-600 text-sm mb-4 line-clamp-2">
                      {locale === 'ta' ? area.description_ta || area.description : area.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-charcoal-700">
                        {area.properties_count} {copy.properties}
                      </span>
                      <span className="text-teal-600 font-semibold group-hover:text-teal-700">
                        {copy.explore} →
                      </span>
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
