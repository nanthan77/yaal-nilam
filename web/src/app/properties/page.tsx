// @ts-nocheck
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowUpDown, Map, Search, SlidersHorizontal, Sparkles, BookmarkPlus } from "lucide-react";
import PropertyCard from "@/components/PropertyCard";
import RecentlyViewed from "@/components/RecentlyViewed";
import { DEFAULT_AREA_CATALOG, DEFAULT_PROPERTY_CATALOG, getAreas, getProperties, saveSearch } from "@/lib/firestore";
import { useStore } from "@/lib/store";
import { filterListings } from "@/lib/marketplace";
import { getPropertyTypeLabel, localize } from "@/lib/translations";

const SORT_OPTIONS = [
  { value: "relevance", labelEn: "Best Match", labelTa: "சிறந்த பொருத்தம்" },
  { value: "newest", labelEn: "Newest First", labelTa: "புதியவை முதலில்" },
  { value: "price-low", labelEn: "Price: Low to High", labelTa: "விலை: குறைவிலிருந்து அதிகம்" },
  { value: "price-high", labelEn: "Price: High to Low", labelTa: "விலை: அதிகத்திலிருந்து குறைவு" },
];

export default function PropertiesPage() {
  const { locale } = useStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [intent, setIntent] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedArea, setSelectedArea] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [landSize, setLandSize] = useState("");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [sortBy, setSortBy] = useState("relevance");
  const [allProperties, setAllProperties] = useState<any[]>(DEFAULT_PROPERTY_CATALOG);
  const [areas, setAreas] = useState<any[]>(DEFAULT_AREA_CATALOG);
  const [loading, setLoading] = useState(true);
  const [savingSearch, setSavingSearch] = useState(false);
  const [savedMessage, setSavedMessage] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const copy = localize(locale, {
    en: {
      title: "Find the right property in Jaffna",
      subtitle: "Explore houses, land, villas, apartments, and commercial spaces by location, price, and the details that matter to you.",
      searchPlaceholder: "Search by area, listing code, landmark, or property title...",
      searchResults: "results",
      noResultsTitle: "No exact matches found",
      noResultsBody: "Try widening your budget, changing the area, or removing one filter.",
      intent: "Intent",
      propertyType: "Property Type",
      allTypes: "All Types",
      allAreas: "All Areas",
      priceMin: "Min price",
      priceMax: "Max price",
      bedrooms: "Bedrooms",
      landSize: "Land size (perches)",
      verifiedOnly: "Platform reviewed only",
      sortBy: "Sort",
      saveSearch: "Save search",
      saving: "Saving...",
      saved: "Search saved",
      mapView: "Map view",
      trustTitle: "Explore the details before you decide",
      trustBody: "Platform review concerns listing information. It does not certify ownership, deeds, or legal title. Check title and survey details independently before committing.",
      badgeOne: "Tamil + English support",
      badgeTwo: "Diaspora-friendly follow-up",
      badgeThree: "Jaffna property search",
      forSale: "For Sale",
      forRent: "For Rent",
      shortStay: "Short Stay",
      clear: "Clear filters",
    },
    ta: {
      title: "யாழ்ப்பாணத்தில் சரியான சொத்தை கண்டுபிடிக்கவும்",
      subtitle: "தீவிரமாக வாங்க அல்லது வாடகைக்கு எடுக்க தயாராக உள்ளவர்களுக்கு ஏற்ற ஆழமான வடிப்பான்களுடன் வீடுகள், காணிகள், வில்லாக்கள், அபார்ட்மென்ட்கள், வணிக இடங்கள் ஆகியவற்றை தேடுங்கள்.",
      searchPlaceholder: "பகுதி, listing code, landmark, அல்லது சொத்து தலைப்பால் தேடுங்கள்...",
      searchResults: "முடிவுகள்",
      noResultsTitle: "துல்லியமான பொருத்தம் இல்லை",
      noResultsBody: "பட்ஜெட்டை விரிவுபடுத்தவும், பகுதியை மாற்றவும், அல்லது ஒரு வடிப்பானை நீக்கவும்.",
      intent: "தேவை",
      propertyType: "சொத்து வகை",
      allTypes: "அனைத்து வகைகளும்",
      allAreas: "அனைத்து பகுதிகளும்",
      priceMin: "குறைந்தபட்ச விலை",
      priceMax: "அதிகபட்ச விலை",
      bedrooms: "படுக்கையறைகள்",
      landSize: "காணி அளவு (பேர்ச்)",
      verifiedOnly: "தளம் மதிப்பாய்வு செய்தவை மட்டும்",
      sortBy: "வரிசைப்படுத்தல்",
      saveSearch: "தேடலை சேமிக்கவும்",
      saving: "சேமிக்கப்படுகிறது...",
      saved: "தேடல் சேமிக்கப்பட்டது",
      mapView: "வரைபடக் காட்சி",
      trustTitle: "முடிவு எடுக்கும் முன் விவரங்களைப் பாருங்கள்",
      trustBody: "தள மதிப்பாய்வு பட்டியலின் தகவல்களைப் பற்றியது. இது உரிமை, உறுதி அல்லது சட்ட உரிமையைச் சான்றளிக்காது. முடிவு எடுக்கும் முன் உறுதி மற்றும் நில அளவைத் தகவல்களை தனியாகச் சரிபார்க்கவும்.",
      badgeOne: "தமிழ் + English ஆதரவு",
      badgeTwo: "வெளிநாட்டு வாங்குபவர் உதவி",
      badgeThree: "யாழ்ப்பாணச் சொத்துத் தேடல்",
      forSale: "விற்பனைக்கு",
      forRent: "வாடகைக்கு",
      shortStay: "குறுகிய தங்கல்",
      clear: "வடிப்பான்களை அகற்றவும்",
    },
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    setSearchQuery(params.get("q") || "");
    setIntent(params.get("intent") || "");
    setSelectedType(params.get("type") || "");
    setSelectedArea(params.get("area") || "");
    setMinPrice(params.get("minPrice") || "");
    setMaxPrice(params.get("maxPrice") || "");
    setBedrooms(params.get("bedrooms") || "");
    setLandSize(params.get("landSize") || "");
    setVerifiedOnly(params.get("verified") === "1");
    setSortBy(params.get("sort") || "relevance");
  }, []);

  useEffect(() => {
    let mounted = true;

    async function loadData() {
      try {
        const properties = await getProperties();
        const areaCatalog = await getAreas(properties);

        if (!mounted) return;
        setAllProperties(properties);
        setAreas(areaCatalog);
      } catch (error) {
        console.error("Marketplace load error:", error);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadData();

    return () => {
      mounted = false;
    };
  }, []);

  const filters = useMemo(
    () => ({
      q: searchQuery,
      intent,
      type: selectedType,
      area: selectedArea,
      minPrice: Number(minPrice || 0),
      maxPrice: Number(maxPrice || 0),
      bedrooms: Number(bedrooms || 0),
      landSize: Number(landSize || 0),
      verified: verifiedOnly,
      sort: sortBy,
    }),
    [searchQuery, intent, selectedType, selectedArea, minPrice, maxPrice, bedrooms, landSize, verifiedOnly, sortBy]
  );

  const filteredAndSortedProperties = useMemo(() => filterListings(allProperties, filters), [allProperties, filters]);

  const queryString = new URLSearchParams(
    Object.entries({
      q: searchQuery || undefined,
      intent: intent || undefined,
      type: selectedType || undefined,
      area: selectedArea || undefined,
      minPrice: minPrice || undefined,
      maxPrice: maxPrice || undefined,
      bedrooms: bedrooms || undefined,
      landSize: landSize || undefined,
      verified: verifiedOnly ? "1" : undefined,
      sort: sortBy || undefined,
    }).filter(([, value]) => Boolean(value))
  ).toString();

  async function handleSaveSearch() {
    setSavingSearch(true);
    const savedId = await saveSearch(filters);
    setSavingSearch(false);
    setSavedMessage(savedId ? copy.saved : "");
    if (savedId) {
      setTimeout(() => setSavedMessage(""), 2500);
    }
  }

  function clearFilters() {
    setSearchQuery("");
    setIntent("");
    setSelectedType("");
    setSelectedArea("");
    setMinPrice("");
    setMaxPrice("");
    setBedrooms("");
    setLandSize("");
    setVerifiedOnly(false);
    setSortBy("relevance");
  }

  return (
    <div className="min-h-screen bg-sand-50">
      <div className="bg-gradient-to-br from-teal-900 via-teal-800 to-teal-700 text-white py-14 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-3xl">
            <p className="uppercase tracking-[0.25em] text-warm-300 text-xs font-semibold mb-3">{locale === 'ta' ? 'உங்கள் சொத்தைத் தேடுங்கள்' : 'Find your property'}</p>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{copy.title}</h1>
            <p className="text-teal-100 text-lg">{copy.subtitle}</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white rounded-3xl shadow-card-lg border border-sand-200 p-6 md:p-7 mb-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="bg-teal-50 p-3 rounded-2xl">
              <Search className="w-5 h-5 text-teal-700" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-charcoal-900">{copy.title}</h2>
              <p role="status" className="text-sm text-charcoal-500">{filteredAndSortedProperties.length} {copy.searchResults}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            <div className="md:col-span-12">
              <label htmlFor="property-search" className="sr-only">{copy.title}</label>
              <div className="flex items-center gap-3 border border-sand-300 bg-sand-50/50 rounded-2xl px-4 py-3.5 focus-within:border-teal-700/60 focus-within:ring-4 focus-within:ring-teal-700/5 transition-all">
                <Search className="w-5.5 h-5.5 text-teal-700/85" />
                <input
                  id="property-search"
                  role="searchbox"
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={copy.searchPlaceholder}
                  className="w-full bg-transparent outline-none text-charcoal-900 placeholder:text-charcoal-400 font-medium"
                />
              </div>
            </div>

            {/* Mobile Filters Toggle Button */}
            <div className="md:hidden flex w-full">
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                aria-expanded={showFilters}
                className={`flex-1 flex items-center justify-center gap-2 rounded-2xl border font-bold py-3 text-sm transition-all duration-200 ${
                  showFilters
                    ? "bg-teal-700 text-white border-teal-700 shadow-inner"
                    : "bg-teal-50 text-teal-700 border-teal-100 hover:bg-teal-100/70"
                }`}
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>
                  {locale === "ta" ? "கூடுதல் வடிப்பான்கள்" : "Advanced Filters"}{" "}
                  {Object.values(filters).filter(v => v !== "" && v !== 0 && v !== false && v !== searchQuery && v !== sortBy).length > 0
                    ? `(${Object.values(filters).filter(v => v !== "" && v !== 0 && v !== false && v !== searchQuery && v !== sortBy).length})`
                    : ""}
                </span>
              </button>
            </div>

            <div className={`md:col-span-2 ${showFilters ? "block" : "hidden"} md:block`}>
              <label htmlFor="filter-intent" className="block text-xs font-black uppercase tracking-wider text-teal-905 mb-2">{copy.intent}</label>
              <select id="filter-intent" value={intent} onChange={(e) => setIntent(e.target.value)} className="select-field w-full">
                <option value="">{copy.intent}</option>
                <option value="sell">{copy.forSale}</option>
                <option value="rent">{copy.forRent}</option>
                <option value="short_rent">{copy.shortStay}</option>
              </select>
            </div>

            <div className={`md:col-span-2 ${showFilters ? "block" : "hidden"} md:block`}>
              <label htmlFor="filter-selectedType" className="block text-xs font-black uppercase tracking-wider text-teal-905 mb-2">{copy.propertyType}</label>
              <select id="filter-selectedType" value={selectedType} onChange={(e) => setSelectedType(e.target.value)} className="select-field w-full">
                <option value="">{copy.allTypes}</option>
                {["house", "apartment", "villa", "land", "commercial"].map((type) => (
                  <option key={type} value={type}>{getPropertyTypeLabel(type, locale)}</option>
                ))}
              </select>
            </div>

            <div className={`md:col-span-2 ${showFilters ? "block" : "hidden"} md:block`}>
              <label htmlFor="filter-selectedArea" className="block text-xs font-black uppercase tracking-wider text-teal-905 mb-2">{copy.allAreas}</label>
              <select id="filter-selectedArea" value={selectedArea} onChange={(e) => setSelectedArea(e.target.value)} className="select-field w-full">
                <option value="">{copy.allAreas}</option>
                {areas.map((area) => (
                  <option key={area.slug} value={area.slug}>{locale === "ta" ? area.name_ta : area.name}</option>
                ))}
              </select>
            </div>

            <div className={`md:col-span-2 ${showFilters ? "block" : "hidden"} md:block`}>
              <label htmlFor="filter-minPrice" className="block text-xs font-black uppercase tracking-wider text-teal-905 mb-2">{copy.priceMin}</label>
              <input id="filter-minPrice" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} type="number" className="input-field w-full" placeholder="0" />
            </div>

            <div className={`md:col-span-2 ${showFilters ? "block" : "hidden"} md:block`}>
              <label htmlFor="filter-maxPrice" className="block text-xs font-black uppercase tracking-wider text-teal-905 mb-2">{copy.priceMax}</label>
              <input id="filter-maxPrice" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} type="number" className="input-field w-full" placeholder="0" />
            </div>

            <div className={`md:col-span-1 ${showFilters ? "block" : "hidden"} md:block`}>
              <label htmlFor="filter-bedrooms" className="block text-xs font-black uppercase tracking-wider text-teal-905 mb-2">{copy.bedrooms}</label>
              <input id="filter-bedrooms" value={bedrooms} onChange={(e) => setBedrooms(e.target.value)} type="number" min="0" className="input-field w-full" />
            </div>

            <div className={`md:col-span-1 ${showFilters ? "block" : "hidden"} md:block`}>
              <label htmlFor="filter-landSize" className="block text-xs font-black uppercase tracking-wider text-teal-905 mb-2">{copy.landSize}</label>
              <input id="filter-landSize" value={landSize} onChange={(e) => setLandSize(e.target.value)} type="number" min="0" className="input-field w-full" />
            </div>

            <div className={`md:col-span-3 ${showFilters ? "block" : "hidden"} md:block`}>
              <label htmlFor="filter-sort" className="block text-xs font-black uppercase tracking-wider text-teal-905 mb-2 flex items-center gap-1.5">
                <ArrowUpDown className="w-3.5 h-3.5 text-teal-700" />
                {copy.sortBy}
              </label>
              <select id="filter-sort" value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="select-field w-full">
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {locale === "ta" ? option.labelTa : option.labelEn}
                  </option>
                ))}
              </select>
            </div>

            <div className={`md:col-span-3 flex items-end ${showFilters ? "flex" : "hidden"} md:flex`}>
              <label className="inline-flex items-center gap-3 rounded-2xl border border-sand-200 bg-sand-50/50 px-4 py-3 w-full text-charcoal-700 font-semibold cursor-pointer">
                <input type="checkbox" checked={verifiedOnly} onChange={(e) => setVerifiedOnly(e.target.checked)} className="checkbox-tactile" />
                {copy.verifiedOnly}
              </label>
            </div>

            <div className={`md:col-span-6 flex flex-wrap items-end gap-3 ${showFilters ? "flex" : "hidden"} md:flex`}>
              <button
                type="button"
                onClick={handleSaveSearch}
                disabled={savingSearch}
                className="inline-flex items-center gap-2 rounded-xl bg-teal-700 hover:bg-teal-600 disabled:opacity-60 text-white px-5 py-3 font-semibold transition-colors"
              >
                <BookmarkPlus className="w-4 h-4" />
                {savingSearch ? copy.saving : copy.saveSearch}
              </button>
              <Link
                href={queryString ? `/map?${queryString}` : "/map"}
                className="inline-flex items-center gap-2 rounded-xl bg-white border border-sand-200 hover:bg-sand-50 text-charcoal-800 px-5 py-3 font-semibold transition-colors"
              >
                <Map className="w-4 h-4" />
                {copy.mapView}
              </Link>
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex items-center gap-2 rounded-xl bg-white border border-sand-200 hover:bg-sand-50 text-charcoal-700 px-5 py-3 font-semibold transition-colors"
              >
                <SlidersHorizontal className="w-4 h-4" />
                {copy.clear}
              </button>
              {savedMessage && <span className="text-sm font-medium text-green-700">{savedMessage}</span>}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-[1.15fr_2fr] gap-6 mb-8">
          <div className="bg-teal-950 rounded-3xl text-white p-6">
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="w-5 h-5 text-warm-300" />
              <h3 className="text-xl font-bold">{copy.trustTitle}</h3>
            </div>
            <p className="text-teal-100 mb-5 leading-relaxed">{copy.trustBody}</p>
            <div className="flex flex-wrap gap-2">
              {[copy.badgeOne, copy.badgeTwo, copy.badgeThree].map((badge) => (
                <span key={badge} className="bg-white/10 border border-white/10 rounded-full px-3 py-1.5 text-sm text-teal-50">
                  {badge}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-sand-200 p-6 flex flex-col justify-between">
            <div>
              <p className="text-sm uppercase tracking-wide text-charcoal-500 mb-2">{locale === 'ta' ? 'தேடல் சுருக்கம்' : 'Search summary'}</p>
              <h3 className="text-2xl font-bold text-charcoal-900 mb-3">{filteredAndSortedProperties.length} {copy.searchResults}</h3>
              <p className="text-charcoal-600">
                {selectedArea ? `${copy.allAreas}: ${areas.find((area) => area.slug === selectedArea)?.[locale === "ta" ? "name_ta" : "name"] || selectedArea}. ` : ""}
                {selectedType ? `${copy.propertyType}: ${getPropertyTypeLabel(selectedType, locale)}. ` : ""}
                {intent ? `${copy.intent}: ${intent === "rent" ? copy.forRent : intent === "short_rent" ? copy.shortStay : copy.forSale}. ` : ""}
                {verifiedOnly ? `${copy.verifiedOnly}. ` : ""}
                {searchQuery ? `“${searchQuery}”` : (locale === "ta" ? "யாழ்ப்பாணம் முழுவதும் உள்ள சொத்துகளைப் பாருங்கள்." : "Browse properties across Jaffna.")}
              </p>
            </div>
            <div className="mt-5 flex flex-wrap gap-2 text-sm text-charcoal-600">
              <span className="px-3 py-1.5 rounded-full bg-sand-100">{locale === 'ta' ? 'சொத்துப் பட்டியல்கள்' : 'Property listings'}</span>
              <span className="px-3 py-1.5 rounded-full bg-sand-100">{locale === 'ta' ? 'சொத்துக் குறியீடுகள்' : 'Property codes'}</span>
              <span className="px-3 py-1.5 rounded-full bg-sand-100">{locale === 'ta' ? 'WhatsApp விசாரணைகள்' : 'WhatsApp inquiries'}</span>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-3xl overflow-hidden shadow-lg animate-pulse">
                <div className="h-52 bg-charcoal-200" />
                <div className="p-6 space-y-3">
                  <div className="h-5 bg-charcoal-200 rounded w-3/4" />
                  <div className="h-4 bg-charcoal-100 rounded w-1/2" />
                  <div className="h-6 bg-charcoal-200 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredAndSortedProperties.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {filteredAndSortedProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-lg p-12 text-center border border-sand-200">
            <Search className="w-12 h-12 text-charcoal-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-charcoal-900 mb-2">{copy.noResultsTitle}</h3>
            <p className="text-charcoal-600">{copy.noResultsBody}</p>
          </div>
        )}
      </div>

      <RecentlyViewed limit={4} />
    </div>
  );
}
