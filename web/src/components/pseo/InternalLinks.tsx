'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { PROPERTY_TYPES_SEO, INTENTS_SEO } from '@/lib/seo-config';
import { getNearbyLocations, type Location } from '@/lib/locations';
import { useStore } from '@/lib/store';

interface InternalLinksProps {
  currentIntent?: string;
  currentType?: string;
  currentLocation?: string;
  location?: Location;
}

export default function InternalLinks({
  currentIntent,
  currentType,
  currentLocation,
  location,
}: InternalLinksProps) {
  const { locale } = useStore();
  const nearby = currentLocation ? getNearbyLocations(currentLocation) : [];
  const currentTypeConfig = PROPERTY_TYPES_SEO.find((t) => t.slug === currentType);
  const currentIntentConfig = INTENTS_SEO.find((intent) => intent.slug === currentIntent);
  const locationName = locale === 'ta' ? location?.name_ta || currentLocation : location?.name || currentLocation;

  return (
    <section className="py-10 px-4 max-w-6xl mx-auto">
      {currentLocation && currentIntent && (
        <div className="mb-8">
          <h3 className="text-lg font-bold text-gray-900 mb-3">
            {locale === 'ta' ? `${locationName} பகுதியில் இதையும் பாருங்கள்` : `Also in ${locationName}`}
          </h3>
          <div className="flex flex-wrap gap-2">
            {PROPERTY_TYPES_SEO.filter((t) => t.slug !== currentType).map((t) => (
              <Link
                key={t.slug}
                href={`/${currentIntent}/${t.slug}/${currentLocation}/`}
                className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm hover:border-teal-500 hover:text-teal-700 transition-colors"
              >
                {locale === 'ta'
                  ? `${t.plural.ta} ${currentIntentConfig?.verb.ta || ''}`.trim()
                  : `${t.plural.en} ${currentIntentConfig?.verb.en || ''}`.trim()}
              </Link>
            ))}
            {INTENTS_SEO.filter((i) => i.slug !== currentIntent).map((i) => (
              <Link
                key={i.slug}
                href={`/${i.slug}/${currentType}/${currentLocation}/`}
                className="px-4 py-2 bg-teal-50 border border-teal-200 rounded-full text-sm text-teal-700 hover:bg-teal-100 transition-colors"
              >
                {locale === 'ta'
                  ? `${currentTypeConfig?.plural.ta || ''} ${i.verb.ta}`.trim()
                  : `${currentTypeConfig?.plural.en || ''} ${i.verb.en}`.trim()}
              </Link>
            ))}
          </div>
        </div>
      )}

      {nearby.length > 0 && currentType && currentIntent && (
        <div className="mb-8">
          <h3 className="text-lg font-bold text-gray-900 mb-3">
            {locale === 'ta'
              ? `அருகிலுள்ள பகுதிகளில் ${currentTypeConfig?.plural.ta || 'சொத்துக்கள்'}`
              : `${currentTypeConfig?.plural.en || 'Properties'} in Nearby Areas`}
          </h3>
          <div className="flex flex-wrap gap-2">
            {nearby.map((loc) => (
              <Link
                key={loc.slug}
                href={`/${currentIntent}/${currentType}/${loc.slug}/`}
                className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm hover:border-teal-500 hover:text-teal-700 transition-colors"
              >
                {locale === 'ta' ? loc.name_ta : loc.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      {currentLocation && !currentIntent && (
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-3">
            {locale === 'ta'
              ? `${locationName} பகுதியில் பிரிவின்படி பாருங்கள்`
              : `Browse by Category in ${locationName}`}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {INTENTS_SEO.map((intent) =>
              PROPERTY_TYPES_SEO.map((type) => (
                <Link
                  key={`${intent.slug}-${type.slug}`}
                  href={`/${intent.slug}/${type.slug}/${currentLocation}/`}
                  className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:border-teal-500 hover:shadow-sm transition-all group"
                >
                  <span className="text-sm font-medium text-gray-700 group-hover:text-teal-700">
                    {locale === 'ta'
                      ? `${type.plural.ta} ${intent.verb.ta}`.trim()
                      : `${type.plural.en} ${intent.verb.en}`.trim()}
                  </span>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-teal-600 transition-colors" />
                </Link>
              ))
            )}
          </div>
        </div>
      )}
    </section>
  );
}
