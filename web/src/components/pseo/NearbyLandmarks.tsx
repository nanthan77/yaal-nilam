'use client';

import { MapPin, GraduationCap, Cross, ShoppingBag, Landmark } from 'lucide-react';
import type { Place } from '@/lib/locations';
import { useStore } from '@/lib/store';

const ICON_MAP: Record<string, typeof MapPin> = {
  temple: Landmark,
  school: GraduationCap,
  hospital: Cross,
  market: ShoppingBag,
  junction: MapPin,
  university: GraduationCap,
  road: MapPin,
  area: MapPin,
};

export default function NearbyLandmarks({ places, locationName }: { places: Place[]; locationName: string }) {
  const { locale } = useStore();
  if (places.length === 0) return null;

  const typeLabels: Record<string, { en: string; ta: string }> = {
    temple: { en: 'Temple', ta: 'கோவில்' },
    school: { en: 'School', ta: 'பாடசாலை' },
    hospital: { en: 'Hospital', ta: 'வைத்தியசாலை' },
    market: { en: 'Market', ta: 'சந்தை' },
    junction: { en: 'Junction', ta: 'சந்தி' },
    university: { en: 'University', ta: 'பல்கலைக்கழகம்' },
    road: { en: 'Road', ta: 'வீதி' },
    area: { en: 'Landmark', ta: 'அடையாள இடம்' },
  };

  return (
    <section className="py-10 px-4 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        {locale === 'ta' ? `${locationName} அருகிலுள்ள முக்கிய இடங்கள்` : `Nearby Landmarks in ${locationName}`}
      </h2>
      <p className="text-gray-500 mb-6">
        {locale === 'ta'
          ? 'இந்தப் பகுதியில் உள்ள சொத்துகளுக்கு அருகிலுள்ள முக்கிய இடங்களும் வசதிகளும்'
          : 'Key places and amenities near properties in this area'}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {places.map((place, i) => {
          const Icon = ICON_MAP[place.type] || MapPin;
          return (
            <div
              key={i}
              className="flex items-start gap-3 p-4 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-shadow"
            >
              <div className="p-2 bg-teal-50 rounded-lg shrink-0">
                <Icon className="w-5 h-5 text-teal-700" />
              </div>
              <div>
                <p className="font-medium text-gray-900">{locale === 'ta' ? place.name_ta : place.name}</p>
                <p className="text-sm text-gray-500">{locale === 'ta' ? place.name : place.name_ta}</p>
                <span className="text-xs text-teal-700 bg-teal-50 px-2 py-0.5 rounded mt-1 inline-block capitalize">
                  {typeLabels[place.type]?.[locale] || place.type}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
