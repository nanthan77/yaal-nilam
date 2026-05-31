'use client';

import Link from 'next/link';
import PropertyCard from '@/components/PropertyCard';
import VoiceSearch from '@/components/VoiceSearch';
import Breadcrumbs from './Breadcrumbs';
import FAQSection from './FAQSection';
import NearbyLandmarks from './NearbyLandmarks';
import InternalLinks from './InternalLinks';
import AreaGuideContent from './AreaGuideContent';
import { useStore } from '@/lib/store';
import { PROPERTIES } from '@/lib/data';
import { getLocationBySlug, getPlacesForLocation } from '@/lib/locations';
import { getPropertyType, getIntent, generatePageTitle, generatePageTitleTa } from '@/lib/seo-config';
import { generateTier3FAQs, generateTier2FAQs } from '@/lib/faq-data';
import { formatCompactPrice, localize } from '@/lib/translations';
import type { Property } from '@/lib/data';

interface PSEOListingPageProps {
  intentSlug: string;
  typeSlug: string;
  locationSlug?: string;
}

export default function PSEOListingPage({ intentSlug, typeSlug, locationSlug }: PSEOListingPageProps) {
  const { locale } = useStore();
  const l = locale;

  const intent = getIntent(intentSlug);
  const type = getPropertyType(typeSlug);
  const location = locationSlug ? getLocationBySlug(locationSlug) : undefined;

  if (!intent || !type) return null;

  // Filter properties
  const filterFn = (p: Property): boolean => {
    const intentMatch = intentSlug === 'buy' ? p.intent === 'sell' : p.intent === 'rent' || p.intent === 'short_rent';
    const typeMatch = p.property_type === type.filterKey;
    const locationMatch = !locationSlug || p.slug === locationSlug || p.area === locationSlug;
    return intentMatch && typeMatch && locationMatch;
  };

  const filtered = PROPERTIES.filter(filterFn);
  const displayProperties = filtered.length > 0 ? filtered : PROPERTIES.filter((p) => {
    if (locationSlug) return p.slug === locationSlug || p.area === locationSlug;
    return p.property_type === type.filterKey;
  });
  const showingAll = filtered.length === 0;

  const title = generatePageTitle(intent, type, location);
  const titleTa = generatePageTitleTa(intent, type, location);
  const places = location ? getPlacesForLocation(location.slug) : [];
  const faqs = location
    ? generateTier3FAQs(intent, type, location)
    : generateTier2FAQs(intent, type);

  const copy = localize(locale, {
    en: {
      request: 'Send Request',
      searchWhatsapp: 'Search on WhatsApp',
      allAreas: 'All Areas',
      priceRange: 'Price Range',
      underFive: 'Under Rs. 5M',
      fiveToTen: 'Rs. 5M - 10M',
      tenToTwentyFive: 'Rs. 10M - 25M',
      overTwentyFive: 'Rs. 25M+',
      bedrooms: 'Bedrooms',
      verifiedOnly: 'Verified only',
      noMatches: 'No exact matches yet. Showing related properties instead.',
      found: 'properties found',
      ctaTitle: "Can't find what you're looking for?",
      ctaBody: "Tell us your requirements and we'll match you with the best available properties.",
      ctaPrimary: 'Send Property Request',
      ctaSecondary: 'Tell us on WhatsApp',
      faqTitle: location
        ? `FAQs: ${type.plural.en} ${intent.verb.en} in ${location.name}`
        : `FAQs: ${type.plural.en} ${intent.verb.en} in Jaffna`,
      heroDescription: location
        ? `Browse verified ${type.plural.en.toLowerCase()} ${intent.verb.en.toLowerCase()} in ${location.name}, Jaffna.`
        : `Browse verified ${type.plural.en.toLowerCase()} ${intent.verb.en.toLowerCase()} across the Jaffna Peninsula.`,
      priceLabel: 'Price range',
    },
    ta: {
      request: 'கோரிக்கை அனுப்புங்கள்',
      searchWhatsapp: 'WhatsApp-ல் தேடுங்கள்',
      allAreas: 'அனைத்து பகுதிகளும்',
      priceRange: 'விலை வரம்பு',
      underFive: 'ரூ. 50 லட்சத்திற்குள்',
      fiveToTen: 'ரூ. 50 லட்சம் - 1 கோடி',
      tenToTwentyFive: 'ரூ. 1 கோடி - 2.5 கோடி',
      overTwentyFive: 'ரூ. 2.5 கோடிக்கு மேல்',
      bedrooms: 'படுக்கையறைகள்',
      verifiedOnly: 'சரிபார்க்கப்பட்டவை மட்டும்',
      noMatches: 'துல்லியமான பொருத்தம் இன்னும் இல்லை. தொடர்புடைய பிற சொத்துகளைக் காட்டுகிறோம்.',
      found: 'சொத்துக்கள் கிடைத்தன',
      ctaTitle: 'நீங்கள் தேடுவது இன்னும் கிடைக்கவில்லையா?',
      ctaBody: 'உங்கள் தேவைகளை எங்களிடம் சொல்லுங்கள். பொருத்தமான சொத்துகளை நாங்கள் தேர்ந்தெடுத்து அனுப்புகிறோம்.',
      ctaPrimary: 'சொத்து கோரிக்கையை அனுப்புங்கள்',
      ctaSecondary: 'WhatsApp-ல் எங்களிடம் சொல்லுங்கள்',
      faqTitle: location
        ? `${location.name_ta} பகுதியில் ${intent.verb.ta} ${type.plural.ta} பற்றிய கேள்விகள்`
        : `யாழ்ப்பாணத்தில் ${intent.verb.ta} ${type.plural.ta} பற்றிய கேள்விகள்`,
      heroDescription: location
        ? `${location.name_ta} பகுதியில் ${intent.verb.ta} உள்ள சரிபார்க்கப்பட்ட ${type.plural.ta} பார்க்கலாம்.`
        : `யாழ் குடாநாடு முழுவதும் ${intent.verb.ta} உள்ள சரிபார்க்கப்பட்ட ${type.plural.ta} பார்க்கலாம்.`,
      priceLabel: 'விலை வரம்பு',
    },
  });

  const breadcrumbItems = [
    { name: intent.name[l], href: `/${intentSlug}/` },
    { name: type.plural[l], href: `/${intentSlug}/${typeSlug}/` },
    ...(location ? [{ name: l === 'ta' ? location.name_ta : location.name }] : []),
  ];

  const whatsappMsg = location
    ? l === 'ta'
      ? `வணக்கம், ${location.name_ta} பகுதியில் ${type.name.ta} ${intent.name.ta} விரும்புகிறேன்.`
      : `Hello, I am looking to ${intentSlug} a ${type.name.en.toLowerCase()} in ${location.name}, Jaffna.`
    : l === 'ta'
      ? `வணக்கம், யாழ்ப்பாணத்தில் ${type.name.ta} ${intent.name.ta} விரும்புகிறேன்.`
      : `Hello, I am looking to ${intentSlug} a ${type.name.en.toLowerCase()} in Jaffna.`;
  const whatsappUrl = `https://wa.me/94704846555?text=${encodeURIComponent(whatsappMsg)}`;

  return (
    <>
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto">
          <Breadcrumbs items={breadcrumbItems} />
        </div>
      </div>

      <section className="bg-teal-900 text-white py-14 md:py-18">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 text-white text-balance">
            {l === 'ta' ? titleTa : title.replace(' | Yaal Nilam', '')}
          </h1>
          {location && l === 'en' && (
            <p className="text-teal-300 text-lg mb-2" lang="ta">
              {titleTa}
            </p>
          )}
          <p className="text-teal-200 text-base max-w-2xl mx-auto mb-2">
            {copy.heroDescription}
          </p>
          {location && (
            <p className="text-teal-300 text-sm mb-6">
              {copy.priceLabel}: {formatCompactPrice(location.priceRange.min, locale)} — {formatCompactPrice(location.priceRange.max, locale)}
            </p>
          )}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
              </svg>
              {copy.searchWhatsapp}
            </a>
            <Link
              href="/request-property"
              className="inline-flex items-center justify-center bg-white/10 text-white border border-white/20 px-6 py-3 hover:bg-white/20 rounded-xl transition-colors"
            >
              {copy.request}
            </Link>
          </div>
        </div>
      </section>

      <section className="sticky top-16 z-30 bg-white border-b border-gray-200 py-3 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center gap-3">
          {!locationSlug && (
            <select className="text-sm border border-gray-300 rounded-lg px-3 py-2">
              <option>{copy.allAreas}</option>
            </select>
          )}
          <select className="text-sm border border-gray-300 rounded-lg px-3 py-2">
            <option>{copy.priceRange}</option>
            <option>{copy.underFive}</option>
            <option>{copy.fiveToTen}</option>
            <option>{copy.tenToTwentyFive}</option>
            <option>{copy.overTwentyFive}</option>
          </select>
          {typeSlug !== 'land' && typeSlug !== 'commercial' && (
            <select className="text-sm border border-gray-300 rounded-lg px-3 py-2">
              <option>{copy.bedrooms}</option>
              <option>1+</option>
              <option>2+</option>
              <option>3+</option>
              <option>4+</option>
            </select>
          )}
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input type="checkbox" className="rounded border-gray-300 text-teal-600" />
            {copy.verifiedOnly}
          </label>
          <div className="ml-auto">
            <VoiceSearch variant="inline" />
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-8">
        <p className="text-sm text-gray-500 mb-6">
          {showingAll
            ? copy.noMatches
            : `${filtered.length} ${copy.found}`}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayProperties.map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>
      </section>

      {location && <AreaGuideContent location={location} />}

      {location && places.length > 0 && (
        <NearbyLandmarks places={places} locationName={l === 'ta' ? location.name_ta : location.name} />
      )}

      <FAQSection
        faqs={faqs}
        title={copy.faqTitle}
      />

      <InternalLinks
        currentIntent={intentSlug}
        currentType={typeSlug}
        currentLocation={locationSlug}
        location={location}
      />

      <section className="bg-teal-50 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-xl font-bold text-teal-900 mb-3">{copy.ctaTitle}</h2>
          <p className="text-gray-500 mb-6">{copy.ctaBody}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/request-property" className="inline-flex items-center justify-center bg-teal-700 hover:bg-teal-800 text-white font-semibold px-6 py-3 rounded-xl transition-colors">
              {copy.ctaPrimary}
            </Link>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
            >
              {copy.ctaSecondary}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
