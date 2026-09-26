"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import PropertyCard from "@/components/PropertyCard";
import VoiceSearch from "@/components/VoiceSearch";
import { useStore } from "@/lib/store";
import { getProperties } from "@/lib/firestore";
import { filterListings } from "@/lib/marketplace";
import { DEVELOPMENT_PROPERTY_FIXTURES } from "@/lib/development-fixtures";
import { localize, type Locale } from "@/lib/translations";

const MOCK_FALLBACK = DEVELOPMENT_PROPERTY_FIXTURES;

const areaOptions = [
  { en: "Nallur", ta: "நல்லூர்", slug: "nallur" },
  { en: "Jaffna Town", ta: "யாழ்ப்பாணம்", slug: "jaffna-town" },
  { en: "Chunnakam", ta: "சுன்னாகம்", slug: "chunnakam" },
  { en: "Kokuvil", ta: "கொக்குவில்", slug: "kokuvil" },
  { en: "Kopay", ta: "கோப்பாய்", slug: "kopay" },
  { en: "Point Pedro", ta: "பருத்தித்துறை", slug: "point-pedro" },
  { en: "Karainagar", ta: "காரைநகர்", slug: "karainagar" },
];

const priceRanges = {
  en: [
    { label: "Under Rs. 5M", max: 5000000 },
    { label: "Rs. 5M - 10M", min: 5000000, max: 10000000 },
    { label: "Rs. 10M - 25M", min: 10000000, max: 25000000 },
    { label: "Rs. 25M+", min: 25000000 },
  ],
  ta: [
    { label: "ரூ. 50 லட்சத்திற்குள்", max: 5000000 },
    { label: "ரூ. 50 லட சம் - 1 கோடி", min: 5000000, max: 10000000 },
    { label: "ரூ. 1 கோடி - 2.5 கோடி", min: 10000000, max: 25000000 },
    { label: "ரூ. 2.5 கோடிக்கு மேல்", min: 25000000 },
  ],
} as const;

interface CategoryConfig {
  key: string;
  title: { en: string; ta: string };
  subtitle: { en: string; ta: string };
  intent: string | null;
  type: string | null;
  whatsappMsg: { en: string; ta: string };
}

const CATEGORIES: Record<string, CategoryConfig> = {
  buy: {
    key: "buy",
    title: { en: "Houses for Sale in Jaffna", ta: "யாழ்ப்பாணத்தில் விற்பனைக்கு வீடுகள்" },
    subtitle: {
      en: "Browse verified houses, villas, and apartments for sale across the Jaffna Peninsula.",
      ta: "யாழ் குடாநாடு முழுவதும் விற்பனைக்கு உள்ள சரிபார்க்கப்பட்ட வீடுகள், விலாக்கள் மற்றும் அபார்ட்மென்ட்களை பாருங்கள்.",
    },
    intent: "sell",
    type: null,
    whatsappMsg: {
      en: "Hello, I am looking to buy a house in Jaffna.",
      ta: "வணக்கம், யாழ்ப்பாணத்தில் வாங்க ஒரு வீடு தேடுகிறேன்.",
    },
  },
  rent: {
    key: "rent",
    title: { en: "Rental Properties in Jaffna", ta: "யாழ்ப்பாணத்தில் வாடகைச் சொத்துக்கள்" },
    subtitle: {
      en: "Find houses, annexes, and apartments for rent with monthly and short-stay options.",
      ta: "மாத வாடகை மற்றும் குறுகிய கால தங்கல் வசதியுடன் வீடுகள், இணை வீடுகள் மற்றும் அபார்ட்மென்ட்களை கண்டுபிடிக்கவும்.",
    },
    intent: "rent",
    type: null,
    whatsappMsg: {
      en: "Hello, I am looking for a rental property in Jaffna.",
      ta: "வணக்கம், யாழ்ப்பாணத்தில் வாடகைக்கு ஒரு சொத்து தேடுகிறேன்.",
    },
  },
  land: {
    key: "land",
    title: { en: "Land for Sale in Jaffna", ta: "யாழ்ப்பாணத்தில் விற்பனைக்கு காணிகள்" },
    subtitle: {
      en: "Explore residential, commercial, and agricultural land with clear ownership details across the peninsula.",
      ta: "குடியிருப்பு, வணிக மற்றும் விவசாய பயன்பாட்டுக்கான உரிமைத் தகவல் தெளிவாக உள்ள காணிகளை குடாநாடு முழுவதும் பாருங்கள்.",
    },
    intent: null,
    type: "land",
    whatsappMsg: {
      en: "Hello, I am looking for land in Jaffna.",
      ta: "வணக்கம், யாழ்ப்பாணத்தில் ஒரு காணி தேடுகிறேன்.",
    },
  },
  commercial: {
    key: "commercial",
    title: { en: "Commercial Property in Jaffna", ta: "யாழ்ப்பாணத்தில் வணிகச் சொத்துக்கள்" },
    subtitle: {
      en: "Browse shops, offices, warehouses, and other commercial spaces for sale or rent.",
      ta: "விற்பனைக்கும் வாடகைக்கும் உள்ள கடைகள், அலுவலகங்கள், கிடங்குகள் மற்றும் பிற வணிக இடங்களை பாருங்கள்.",
    },
    intent: null,
    type: "commercial",
    whatsappMsg: {
      en: "Hello, I need a commercial property in Jaffna.",
      ta: "வணக்கம், யாழ்ப்பாணத்தில் ஒரு வணிகச் சொத்து தேவைப்படுகிறது.",
    },
  },
  "short-term-rental": {
    key: "short-term-rental",
    title: {
      en: "Short-Term Rentals and Holiday Stays in Jaffna",
      ta: "யாழ்ப்பாணத்தில் குறுகிய கால வாடகை மற்றும் விடுமுறை தங்குமிடங்கள்",
    },
    subtitle: {
      en: "Find villas, guesthouses, homestays, and furnished apartments for daily or weekly stays.",
      ta: "தினசரி அல்லது வாராந்திர தங்கலுக்கு ஏற்ற விலாக்கள், விருந்தினர் இல்லங்கள், ஹோம்ஸ்டே வசதிகள் மற்றும் அலங்கரிக்கப்பட்ட அபார்ட்மென்ட்களை தேர்வு செய்யுங்கள்.",
    },
    intent: "short_rent",
    type: null,
    whatsappMsg: {
      en: "Hello, I am looking for a short-term rental in Jaffna.",
      ta: "வணக்கம், யாழ்ப்பாணத்தில் குறுகிய கால தங்குமிடம் தேடுகிறேன்.",
    },
  },
};

interface CategoryPageProps {
  categoryKey: string;
}

function buildCopy(locale: Locale) {
  return localize(locale, {
    en: {
      home: "Home",
      searchWhatsapp: "Search on WhatsApp",
      request: "Send Request",
      allAreas: "All Areas",
      priceRange: "Price Range",
      bedrooms: "Bedrooms",
      verifiedOnly: "Verified only",
      resultsFound: "properties found",
      noMatches: "No listings match your filters.",
      noLiveListings: "No live listings available for rent.",
      ctaTitle: "Not seeing the right property yet?",
      ctaBody: "Tell us what you need and we will help you find better matches.",
      requestDetailed: "Send Property Request",
      tellOnWhatsapp: "Tell us on WhatsApp",
      sampleData: "Sample data — live listings unavailable",
      loading: "Loading listings...",
    },
    ta: {
      home: "முகப்பு",
      searchWhatsapp: "WhatsApp-ல் தேடுங்கள்",
      request: "கோரிக்கை அனுப்புங்கள்",
      allAreas: "அனைத்து பகுதிகளும்",
      priceRange: "விலை வரம்பு",
      bedrooms: "படுக்கையறைகள்",
      verifiedOnly: "சரிபார்க்கப்பட்டவை மட்டும்",
      resultsFound: "சொத்துக்கள் கிடைத்தன",
      noMatches: "உங்கள் வடிப்பான்களுக்கு பொருந்தும் சொத்துகள் இல்லை.",
      noLiveListings: "வாடகைக்கு நேரடி சொத்துகள் தற்போது இல்லை.",
      ctaTitle: "உங்களுக்கு ஏற்ற சொத்து இன்னும் கிடைக்கவில்லையா?",
      ctaBody: "உங்கள் தேவையை எங்களிடம் சொல்லுங்கள். பொருத்தமான சொத்துகளைத் தேர்ந்தெடுத்து உதவுகிறோம்.",
      requestDetailed: "சொத்து கோரிக்கையை அனுப்புங்கள்",
      tellOnWhatsapp: "WhatsApp-ல் எங்களிடம் சொல்லுங்கள்",
      sampleData: "மாதிரி தரவு — நேரடி சொத்துகள் கிடைக்கவில்லை",
      loading: "சொத்துகள் ஏற்றப்படுகின்றன...",
    },
  });
}

export default function CategoryPage({ categoryKey }: CategoryPageProps) {
  const { locale } = useStore();
  const config = CATEGORIES[categoryKey];
  const copy = buildCopy(locale);

  const [allListings, setAllListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);

  // Filter state (Fix 8)
  const [selectedArea, setSelectedArea] = useState("");
  const [selectedPriceRange, setSelectedPriceRange] = useState("");
  const [selectedBedrooms, setSelectedBedrooms] = useState("");
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const data = await getProperties();
        if (!mounted) return;
        setAllListings(data);
        setUsingFallback(false);
      } catch {
        if (!mounted) return;
        setAllListings(MOCK_FALLBACK);
        setUsingFallback(MOCK_FALLBACK.length > 0);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  if (!config) return null;

  // Derive current price range filters
  const currentPriceRanges = priceRanges[locale] as readonly { label: string; min?: number; max?: number }[];
  const selectedPriceObj = currentPriceRanges.find((r) => r.label === selectedPriceRange);
  const minPrice = selectedPriceObj?.min;
  const maxPrice = selectedPriceObj?.max;

  // Apply category-level intent/type filters first, then UI filters
  const baseFilters: Record<string, unknown> = {};
  if (config.intent) baseFilters.intent = config.intent;
  if (config.type) baseFilters.type = config.type;

  const intentFiltered = filterListings(allListings, baseFilters as any);

  // Apply UI filters on top
  const displayProperties = filterListings(intentFiltered, {
    area: selectedArea || undefined,
    minPrice,
    maxPrice,
    bedrooms: selectedBedrooms ? Number(selectedBedrooms) : undefined,
    verified: verifiedOnly || undefined,
  } as any);

  // For rent pages: never show sale listings — return empty state if none
  const isRentCategory = config.intent === "rent" || config.intent === "short_rent";

  const whatsappUrl = `https://wa.me/94704846555?text=${encodeURIComponent(config.whatsappMsg[locale])}`;

  return (
    <>
      <section className="bg-teal-900 py-16 text-white md:py-20">
        <div className="container-wide text-center">
          <nav className="mb-4 text-sm text-teal-300">
            <Link href="/" className="transition-colors hover:text-white">
              {copy.home}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-teal-100">{config.title[locale]}</span>
          </nav>

          <h1 className="mb-4 text-3xl font-bold text-balance text-white md:text-4xl lg:text-5xl">
            {config.title[locale]}
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-teal-100">
            {config.subtitle[locale]}
          </p>

          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp rounded-xl"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
              </svg>
              {copy.searchWhatsapp}
            </a>
            <Link
              href="/request-property"
              className="rounded-xl border border-white/20 bg-white/10 px-6 py-3 text-white transition-colors hover:bg-white/20"
            >
              {copy.request}
            </Link>
          </div>
        </div>
      </section>

      <section className="sticky top-16 z-30 border-b border-sand-200 bg-white py-3 shadow-sm">
        <div className="container-wide flex flex-wrap items-center gap-3">
          {/* Area filter */}
          <select
            className="select-field w-auto py-2 text-sm"
            value={selectedArea}
            onChange={(e) => setSelectedArea(e.target.value)}
          >
            <option value="">{copy.allAreas}</option>
            {areaOptions.map((area) => (
              <option key={area.slug} value={area.slug}>
                {locale === "ta" ? area.ta : area.en}
              </option>
            ))}
          </select>

          {/* Price range filter */}
          <select
            className="select-field w-auto py-2 text-sm"
            value={selectedPriceRange}
            onChange={(e) => setSelectedPriceRange(e.target.value)}
          >
            <option value="">{copy.priceRange}</option>
            {currentPriceRanges.map((range) => (
              <option key={range.label} value={range.label}>{range.label}</option>
            ))}
          </select>

          {/* Bedrooms filter */}
          {(categoryKey === "buy" || categoryKey === "rent") && (
            <select
              className="select-field w-auto py-2 text-sm"
              value={selectedBedrooms}
              onChange={(e) => setSelectedBedrooms(e.target.value)}
            >
              <option value="">{copy.bedrooms}</option>
              <option value="1">1+</option>
              <option value="2">2+</option>
              <option value="3">3+</option>
              <option value="4">4+</option>
            </select>
          )}

          {/* Verified only filter */}
          <label className="flex items-center gap-2 text-sm text-charcoal-600 cursor-pointer">
            <input
              type="checkbox"
              checked={verifiedOnly}
              onChange={(e) => setVerifiedOnly(e.target.checked)}
              className="rounded border-charcoal-300 text-teal-600 focus:ring-teal-500"
            />
            {copy.verifiedOnly}
          </label>

          <div className="ml-auto">
            <VoiceSearch variant="inline" />
          </div>
        </div>
      </section>

      <section className="container-wide py-8">
        {usingFallback && (
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-amber-50 border border-amber-200 px-4 py-2 text-xs font-semibold text-amber-700">
            <span>⚠</span> {copy.sampleData}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-72 rounded-3xl bg-sand-100 animate-pulse" />
            ))}
          </div>
        ) : displayProperties.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-sand-300 px-6 py-16 text-center text-charcoal-500">
            <p className="text-lg font-medium mb-2">
              {isRentCategory ? copy.noLiveListings : copy.noMatches}
            </p>
            <p className="text-sm">
              {locale === "ta"
                ? "நேரடியாக WhatsApp மூலம் கேட்கலாம்."
                : "You can also enquire directly via WhatsApp."}
            </p>
          </div>
        ) : (
          <>
            <p className="mb-6 text-sm text-charcoal-500">
              {displayProperties.length} {copy.resultsFound}
            </p>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {displayProperties.map((property) => (
                <PropertyCard key={property.id} property={property as any} />
              ))}
            </div>
          </>
        )}
      </section>

      <section className="bg-teal-50 py-12">
        <div className="container-wide text-center">
          <h2 className="mb-3 text-xl font-bold text-teal-900">{copy.ctaTitle}</h2>
          <p className="mb-6 text-charcoal-600">{copy.ctaBody}</p>
          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/request-property" className="btn-primary rounded-xl">
              {copy.requestDetailed}
            </Link>
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn-whatsapp rounded-xl">
              {copy.tellOnWhatsapp}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
