"use client";

import Link from "next/link";
import PropertyCard from "@/components/PropertyCard";
import VoiceSearch from "@/components/VoiceSearch";
import { useStore } from "@/lib/store";
import { PROPERTIES } from "@/lib/data";
import type { Property } from "@/lib/data";

interface CategoryConfig {
  key: string;
  title: { en: string; ta: string };
  subtitle: { en: string; ta: string };
  filterFn: (p: Property) => boolean;
  whatsappMsg: string;
}

const CATEGORIES: Record<string, CategoryConfig> = {
  buy: {
    key: "buy",
    title:    { en: "Houses for Sale in Jaffna", ta: "யாழ்ப்பாணத்தில் விற்பனைக்கு வீடுகள்" },
    subtitle: { en: "Browse verified houses, villas, and apartments for sale across the Jaffna Peninsula", ta: "யாழ் குடாநாடு முழுவதும் சரிபார்க்கப்பட்ட வீடுகள், விலாக்கள் மற்றும் குடியிருப்புகளை உலாவுங்கள்" },
    filterFn: (p) => p.intent === "sell" && (p.property_type === "house" || p.property_type === "villa" || p.property_type === "apartment"),
    whatsappMsg: "Hi, I want to buy a house in Jaffna",
  },
  rent: {
    key: "rent",
    title:    { en: "Rental Properties in Jaffna", ta: "யாழ்ப்பாணத்தில் வாடகை சொத்துக்கள்" },
    subtitle: { en: "Find houses, annex, and apartments for rent. Monthly and short-term options available.", ta: "வீடுகள், இணைப்பு வீடுகள் மற்றும் குடியிருப்புகளை வாடகைக்குக் கண்டறியுங்கள்" },
    filterFn: (p) => p.intent === "rent" || p.intent === "short_rent",
    whatsappMsg: "Hi, I'm looking for a rental property in Jaffna",
  },
  land: {
    key: "land",
    title:    { en: "Land for Sale in Jaffna", ta: "யாழ்ப்பாணத்தில் காணி விற்பனை" },
    subtitle: { en: "Residential, commercial, and agricultural land with clear titles across the peninsula", ta: "குடாநாடு முழுவதும் தெளிவான உரிமையுடன் குடியிருப்பு, வணிக மற்றும் விவசாய காணிகள்" },
    filterFn: (p) => p.property_type === "land",
    whatsappMsg: "Hi, I'm looking for land in Jaffna",
  },
  commercial: {
    key: "commercial",
    title:    { en: "Commercial Property in Jaffna", ta: "யாழ்ப்பாணத்தில் வணிக சொத்து" },
    subtitle: { en: "Shops, offices, warehouses, and commercial buildings for sale and rent", ta: "கடைகள், அலுவலகங்கள், கிடங்குகள் மற்றும் வணிக கட்டிடங்கள் விற்பனை மற்றும் வாடகைக்கு" },
    filterFn: (p) => p.property_type === "commercial",
    whatsappMsg: "Hi, I need a commercial property in Jaffna",
  },
  "short-term-rental": {
    key: "short-term-rental",
    title:    { en: "Short-Term Rentals & Holiday Stays in Jaffna", ta: "யாழ்ப்பாணத்தில் குறுகிய கால வாடகை & விடுமுறை தங்குமிடங்கள்" },
    subtitle: { en: "Villas, guesthouses, homestays, and furnished apartments for daily and weekly stays across the peninsula", ta: "குடாநாடு முழுவதும் தினசரி மற்றும் வாராந்திர தங்குமிடங்களுக்கான விலாக்கள், விருந்தினர் இல்லங்கள், மற்றும் தங்குமிட குடியிருப்புகள்" },
    filterFn: (p) => p.intent === "short_rent",
    whatsappMsg: "Hi, I'm looking for a short-term rental / holiday stay in Jaffna",
  },
};

interface CategoryPageProps {
  categoryKey: string;
}

export default function CategoryPage({ categoryKey }: CategoryPageProps) {
  const { locale } = useStore();
  const l = locale;
  const config = CATEGORIES[categoryKey];
  if (!config) return null;

  const properties = PROPERTIES.filter(config.filterFn);
  const displayProperties = properties.length > 0 ? properties : PROPERTIES;

  const whatsappUrl = `https://wa.me/94777863333?text=${encodeURIComponent(config.whatsappMsg)}`;

  return (
    <>
      {/* Hero */}
      <section className="bg-teal-900 text-white py-16 md:py-20">
        <div className="container-wide text-center">
          <nav className="text-sm text-teal-300 mb-4">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-teal-400">{l === "ta" ? config.title.ta : config.title.en}</span>
          </nav>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-white text-balance">
            {l === "ta" ? config.title.ta : config.title.en}
          </h1>
          <p className="text-teal-200 text-lg max-w-2xl mx-auto mb-8">
            {l === "ta" ? config.subtitle.ta : config.subtitle.en}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn-whatsapp rounded-xl">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
              </svg>
              {l === "ta" ? "WhatsApp-ல் தேடுங்கள்" : "Search via WhatsApp"}
            </a>
            <Link href="/request-property" className="btn bg-white/10 text-white border border-white/20 px-6 py-3 hover:bg-white/20 rounded-xl transition-colors">
              {l === "ta" ? "கோரிக்கை அனுப்பு" : "Send Request"}
            </Link>
          </div>
        </div>
      </section>

      {/* Filters bar */}
      <section className="sticky top-16 z-30 bg-white border-b border-sand-200 py-3 shadow-sm">
        <div className="container-wide flex flex-wrap items-center gap-3">
          <select className="select-field text-sm py-2 w-auto">
            <option>{l === "ta" ? "அனைத்து பகுதிகள்" : "All Areas"}</option>
            <option>Nallur</option>
            <option>Jaffna Town</option>
            <option>Chunnakam</option>
            <option>Kokuvil</option>
            <option>Kopay</option>
            <option>Point Pedro</option>
            <option>Karainagar</option>
          </select>
          <select className="select-field text-sm py-2 w-auto">
            <option>{l === "ta" ? "விலை வரம்பு" : "Price Range"}</option>
            <option>Under Rs. 5M</option>
            <option>Rs. 5M – 10M</option>
            <option>Rs. 10M – 25M</option>
            <option>Rs. 25M+</option>
          </select>
          {(categoryKey === "buy" || categoryKey === "rent") && (
            <select className="select-field text-sm py-2 w-auto">
              <option>{l === "ta" ? "படுக்கையறைகள்" : "Bedrooms"}</option>
              <option>1+</option><option>2+</option><option>3+</option><option>4+</option>
            </select>
          )}
          <label className="flex items-center gap-2 text-sm text-charcoal-600">
            <input type="checkbox" className="rounded border-charcoal-300 text-teal-600 focus:ring-teal-500" />
            {l === "ta" ? "சரிபார்க்கப்பட்டது மட்டும்" : "Verified only"}
          </label>
          <div className="ml-auto">
            <VoiceSearch variant="inline" />
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="container-wide py-8">
        <p className="text-sm text-charcoal-500 mb-6">
          {properties.length > 0
            ? `${properties.length} ${l === "ta" ? "சொத்துக்கள் கிடைத்தன" : "properties found"}`
            : `${l === "ta" ? "துல்லியமான பொருத்தம் இல்லை. அனைத்தையும் காட்டுகிறோம்." : "No exact matches. Showing all properties."}`}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayProperties.map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-teal-50 py-12">
        <div className="container-wide text-center">
          <h2 className="text-xl font-bold text-teal-900 mb-3">
            {l === "ta" ? "நீங்கள் தேடுவதைக் காணவில்லையா?" : "Can't find what you're looking for?"}
          </h2>
          <p className="text-charcoal-500 mb-6">
            {l === "ta"
              ? "உங்கள் தேவைகளை எங்களிடம் சொல்லுங்கள்"
              : "Tell us your requirements and we'll find matching properties for you."}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/request-property" className="btn-primary rounded-xl">
              {l === "ta" ? "கோரிக்கை அனுப்பு" : "Send Property Request"}
            </Link>
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn-whatsapp rounded-xl">
              {l === "ta" ? "WhatsApp-ல் சொல்லுங்கள்" : "Tell us on WhatsApp"}
            </a>
          </div>
        </div>
      </section>

    </>
  );
}
