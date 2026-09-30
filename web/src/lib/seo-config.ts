// pSEO configuration — property types, intents, metadata templates, JSON-LD generators

import { ALL_LOCATIONS, getPlacesForLocation } from './locations';
import type { Location } from './locations';
import { BRAND } from './brand';

const BASE_URL = 'https://yaalnilam.com';

// ─── Property Type Config ────────────────────────────────────────────────

export interface PropertyTypeConfig {
  slug: string;
  name: { en: string; ta: string };
  plural: { en: string; ta: string };
  filterKey: string; // maps to Property.property_type
  description: { en: string; ta: string };
}

export const PROPERTY_TYPES_SEO: PropertyTypeConfig[] = [
  {
    slug: 'house',
    name: { en: 'House', ta: 'வீடு' },
    plural: { en: 'Houses', ta: 'வீடுகள்' },
    filterKey: 'house',
    description: {
      en: 'family homes, traditional Jaffna houses, and modern residential properties',
      ta: 'குடும்ப வீடுகள், பாரம்பரிய யாழ்ப்பாண வீடுகள் மற்றும் நவீன குடியிருப்பு சொத்துக்கள்',
    },
  },
  {
    slug: 'apartment',
    name: { en: 'Apartment', ta: 'குடியிருப்பு' },
    plural: { en: 'Apartments', ta: 'குடியிருப்புகள்' },
    filterKey: 'apartment',
    description: {
      en: 'modern apartments, flats, and multi-storey residential units',
      ta: 'நவீன குடியிருப்புகள், பிளாட்கள் மற்றும் பல மாடி குடியிருப்பு அலகுகள்',
    },
  },
  {
    slug: 'villa',
    name: { en: 'Villa', ta: 'விலா' },
    plural: { en: 'Villas', ta: 'விலாக்கள்' },
    filterKey: 'villa',
    description: {
      en: 'luxury villas, beachfront villas, and premium residential properties',
      ta: 'சொகுசு விலாக்கள், கடற்கரை விலாக்கள் மற்றும் உயர்தர குடியிருப்பு சொத்துக்கள்',
    },
  },
  {
    slug: 'land',
    name: { en: 'Land', ta: 'காணி' },
    plural: { en: 'Land Plots', ta: 'காணி நிலங்கள்' },
    filterKey: 'land',
    description: {
      en: 'residential land, agricultural land, and bare plots for development',
      ta: 'குடியிருப்பு நிலம், விவசாய நிலம் மற்றும் வளர்ச்சிக்கான வெற்று நிலங்கள்',
    },
  },
  {
    slug: 'commercial',
    name: { en: 'Commercial Property', ta: 'வணிக சொத்து' },
    plural: { en: 'Commercial Properties', ta: 'வணிக சொத்துக்கள்' },
    filterKey: 'commercial',
    description: {
      en: 'shops, offices, warehouses, and commercial buildings',
      ta: 'கடைகள், அலுவலகங்கள், கிடங்குகள் மற்றும் வணிக கட்டிடங்கள்',
    },
  },
];

// ─── Intent Config ───────────────────────────────────────────────────────

export interface IntentConfig {
  slug: string;
  name: { en: string; ta: string };
  verb: { en: string; ta: string };
  filterKey: string; // maps to Property.intent
}

export const INTENTS_SEO: IntentConfig[] = [
  {
    slug: 'buy',
    name: { en: 'Buy', ta: 'வாங்க' },
    verb: { en: 'for Sale', ta: 'விற்பனைக்கு' },
    filterKey: 'sell',
  },
  {
    slug: 'rent',
    name: { en: 'Rent', ta: 'வாடகை' },
    verb: { en: 'for Rent', ta: 'வாடகைக்கு' },
    filterKey: 'rent',
  },
];

// ─── Lookup helpers ──────────────────────────────────────────────────────

export function getPropertyType(slug: string): PropertyTypeConfig | undefined {
  return PROPERTY_TYPES_SEO.find((t) => t.slug === slug);
}

export function getIntent(slug: string): IntentConfig | undefined {
  return INTENTS_SEO.find((i) => i.slug === slug);
}

// ─── Metadata Generators ─────────────────────────────────────────────────

export function generatePageTitle(
  intent?: IntentConfig,
  type?: PropertyTypeConfig,
  location?: Location
): string {
  if (intent && type && location) {
    return `${type.plural.en} ${intent.verb.en} in ${location.name}, Jaffna`;
  }
  if (intent && type) {
    return `${type.plural.en} ${intent.verb.en} in Jaffna`;
  }
  if (location) {
    return `Property in ${location.name}, Jaffna — ${location.name_ta}`;
  }
  return 'Jaffna Property Marketplace';
}

export function generatePageTitleTa(
  intent?: IntentConfig,
  type?: PropertyTypeConfig,
  location?: Location
): string {
  if (intent && type && location) {
    return `${location.name_ta} ${type.plural.ta} ${intent.verb.ta}`;
  }
  if (intent && type) {
    return `யாழ்ப்பாணம் ${type.plural.ta} ${intent.verb.ta}`;
  }
  if (location) {
    return `${location.name_ta} சொத்துக்கள்`;
  }
  return 'யாழ் நிலம்';
}

export function generateMetaDescription(
  intent?: IntentConfig,
  type?: PropertyTypeConfig,
  location?: Location
): string {
  const places = location ? getPlacesForLocation(location.slug) : [];
  const landmarkStr = places.length > 0
    ? ` Near ${places.slice(0, 2).map((p) => p.name).join(' and ')}.`
    : '';

  if (intent && type && location) {
    return `Browse verified ${type.plural.en.toLowerCase()} ${intent.verb.en.toLowerCase()} in ${location.name}, Jaffna.${landmarkStr} Bilingual Tamil & English. WhatsApp support. Price range Rs. ${formatPriceShort(location.priceRange.min)} - ${formatPriceShort(location.priceRange.max)}.`;
  }
  if (intent && type) {
    return `Find the best ${type.plural.en.toLowerCase()} ${intent.verb.en.toLowerCase()} across Jaffna Peninsula. Compare verified listings with prices, photos, and maps. Tamil & English support.`;
  }
  if (location) {
    return `Explore verified properties in ${location.name} (${location.name_ta}), Jaffna.${landmarkStr} Houses, land, apartments, villas ${intent?.verb.en.toLowerCase() || 'for sale and rent'}. WhatsApp-first service.`;
  }
  return 'Discover verified properties in Jaffna. Buy, rent, or list homes, land, apartments, villas, and commercial properties across the Jaffna Peninsula.';
}

// ─── URL Builders ────────────────────────────────────────────────────────

export function buildCanonicalUrl(
  intentSlug?: string,
  typeSlug?: string,
  locationSlug?: string
): string {
  if (intentSlug && typeSlug && locationSlug) {
    return `${BASE_URL}/${intentSlug}/${typeSlug}/${locationSlug}/`;
  }
  if (intentSlug && typeSlug) {
    return `${BASE_URL}/${intentSlug}/${typeSlug}/`;
  }
  if (intentSlug) {
    return `${BASE_URL}/${intentSlug}/`;
  }
  if (locationSlug) {
    return `${BASE_URL}/areas/${locationSlug}/`;
  }
  return `${BASE_URL}/`;
}

// ─── JSON-LD Generators ──────────────────────────────────────────────────

export function generateBreadcrumbJsonLd(
  items: { name: string; url: string }[]
): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      ...(i < items.length - 1 ? { item: item.url } : {}),
    })),
  };
}

export function generateItemListJsonLd(
  name: string,
  count: number,
  items: { url: string }[]
): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name,
    numberOfItems: count,
    itemListElement: items.slice(0, 10).map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `${BASE_URL}${item.url}`,
    })),
  };
}

export function generateFAQJsonLd(
  faqs: { question: string; answer: string }[]
): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

export function generateRealEstateListingJsonLd(
  location?: Location,
  type?: PropertyTypeConfig,
  intent?: IntentConfig
): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    name: 'Yaal Nilam',
    alternateName: 'யாழ் நிலம்',
    url: BASE_URL,
    telephone: BRAND.phoneDisplay,
    areaServed: {
      '@type': 'Place',
      name: location ? `${location.name}, Jaffna District` : 'Jaffna District, Northern Province, Sri Lanka',
      ...(location
        ? {
            geo: {
              '@type': 'GeoCoordinates',
              latitude: location.lat,
              longitude: location.lng,
            },
          }
        : {}),
    },
    knowsLanguage: ['en', 'ta'],
    description: generateMetaDescription(intent, type, location),
  };
}

// ─── Static Params Generators ────────────────────────────────────────────

export function generateAllTypeParams(): { type: string }[] {
  return PROPERTY_TYPES_SEO.map((t) => ({ type: t.slug }));
}

export function generateAllTypeLocationParams(): { type: string; location: string }[] {
  const params: { type: string; location: string }[] = [];
  for (const t of PROPERTY_TYPES_SEO) {
    for (const l of ALL_LOCATIONS) {
      params.push({ type: t.slug, location: l.slug });
    }
  }
  return params;
}

// ─── Price Formatting ────────────────────────────────────────────────────

export function formatPriceShort(price: number): string {
  if (price >= 1000000) {
    return `${(price / 1000000).toFixed(price % 1000000 === 0 ? 0 : 1)}M`;
  }
  if (price >= 100000) {
    return `${(price / 100000).toFixed(0)}L`;
  }
  return `${price.toLocaleString()}`;
}

export function formatPriceFull(price: number): string {
  return `Rs. ${price.toLocaleString('en-LK')}`;
}
