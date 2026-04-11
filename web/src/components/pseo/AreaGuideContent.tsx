'use client';

import type { Location } from '@/lib/locations';
import { useStore } from '@/lib/store';
import { formatCompactPrice, localize } from '@/lib/translations';

export default function AreaGuideContent({ location }: { location: Location }) {
  const { locale } = useStore();
  const isTamil = locale === 'ta';
  const copy = localize(locale, {
    en: {
      title: `Area Guide: ${location.name}`,
      subtitle: `${location.name_ta} area guide`,
      about: `About ${location.name}`,
      why: `Why live in ${location.name}?`,
      transport: 'Transport and access',
      priceRange: 'Price range',
      priceBody: `Properties in ${location.name} range from ${formatCompactPrice(location.priceRange.min, locale)} to ${formatCompactPrice(location.priceRange.max, locale)}, depending on type, size, and exact location.`,
    },
    ta: {
      title: `பகுதி வழிகாட்டி: ${location.name_ta}`,
      subtitle: `${location.name} area guide`,
      about: `${location.name_ta} பற்றி`,
      why: `${location.name_ta} பகுதியில் வாழ்வதன் சிறப்புகள்`,
      transport: 'போக்குவரத்து மற்றும் அணுகல்',
      priceRange: 'விலை வரம்பு',
      priceBody: `${location.name_ta} பகுதியில் உள்ள சொத்துக்கள் வகை, பரப்பளவு மற்றும் துல்லியமான இடத்தைப் பொறுத்து ${formatCompactPrice(location.priceRange.min, locale)} முதல் ${formatCompactPrice(location.priceRange.max, locale)} வரை காணப்படுகின்றன.`,
    },
  });

  return (
    <section className="py-10 px-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        {copy.title}
        <span className="block text-lg font-normal text-teal-700 mt-1">
          {copy.subtitle}
        </span>
      </h2>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">{copy.about}</h3>
          <p className="text-gray-600 leading-relaxed mb-2">
            {isTamil ? location.areaGuide.ta : location.areaGuide.en}
          </p>
        </div>

        <div className="bg-teal-50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-teal-900 mb-2">{copy.why}</h3>
          <p className="text-teal-800 leading-relaxed">
            {isTamil ? location.whyLiveHere.ta : location.whyLiveHere.en}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-xl p-5">
            <h3 className="text-base font-semibold text-gray-800 mb-2">{copy.transport}</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              {isTamil ? location.transportAccess.ta : location.transportAccess.en}
            </p>
          </div>
          <div className="bg-gray-50 rounded-xl p-5">
            <h3 className="text-base font-semibold text-gray-800 mb-2">{copy.priceRange}</h3>
            <p className="text-gray-600 text-sm leading-relaxed">{copy.priceBody}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
