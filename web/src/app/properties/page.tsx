// @ts-nocheck
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowUpDown, Map, Search, SlidersHorizontal, BookmarkPlus } from "lucide-react";
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
      title: "Properties in Jaffna",
      subtitle: "Explore houses, land, villas, apartments, and commercial spaces by location, price, and the details that matter to you.",
      searchPlaceholder: "Search by area, listing code, landmark, or property title...",
      searchResults: "results",
      noResultsTitle: "No exact matches found",
      noResultsBody: "Try widening your budget, changing the area, or removing one filter.",
      intent: "Intent",
      propertyType: "Property Type",
      allTypes: "All Types",
      allAreas: "All Areas",
      priceMin: "Min price (LKR)",
      priceMax: "Max price (LKR)",
      bedrooms: "Bedrooms",
      landSize: "Land size (perches)",
      verifiedOnly: "Platform reviewed only",
      sortBy: "Sort",
      saveSearch: "Save search",
      saving: "Saving...",
      saved: "Search saved",
      saveError: "Unable to save this search. Please try again.",
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
      title: "யாழ்ப்பாணச் சொத்துகள்",
      subtitle: "பகுதி, விலை மற்றும் சொத்து வகையைத் தேர்ந்தெடுத்து வீடுகள், காணிகள் மற்றும் வாடகை இடங்களைத் தேடுங்கள்.",
      searchPlaceholder: "பகுதி, listing code, landmark, அல்லது சொத்து தலைப்பால் தேடுங்கள்...",
      searchResults: "முடிவுகள்",
      noResultsTitle: "துல்லியமான பொருத்தம் இல்லை",
      noResultsBody: "பட்ஜெட்டை விரிவுபடுத்தவும், பகுதியை மாற்றவும், அல்லது ஒரு வடிப்பானை நீக்கவும்.",
      intent: "தேவை",
      propertyType: "சொத்து வகை",
      allTypes: "அனைத்து வகைகளும்",
      allAreas: "அனைத்து பகுதிகளும்",
      priceMin: "குறைந்தபட்ச விலை (LKR)",
      priceMax: "அதிகபட்ச விலை (LKR)",
      bedrooms: "படுக்கையறைகள்",
      landSize: "காணி அளவு (பேர்ச்)",
      verifiedOnly: "தளம் மதிப்பாய்வு செய்தவை மட்டும்",
      sortBy: "வரிசைப்படுத்தல்",
      saveSearch: "தேடலை சேமிக்கவும்",
      saving: "சேமிக்கப்படுகிறது...",
      saved: "தேடல் சேமிக்கப்பட்டது",
      saveError: "தேடலைச் சேமிக்க முடியவில்லை. மீண்டும் முயற்சிக்கவும்.",
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
    setSavedMessage(savedId ? copy.saved : copy.saveError);
    if (savedId) {
      setTimeout(() => setSavedMessage(""), 2500);
    }
  }

  const activeFilterCount = [intent, selectedType, selectedArea, minPrice, maxPrice, bedrooms, landSize, verifiedOnly].filter(Boolean).length;

  function showResults() {
    setShowFilters(false);
    const results = document.getElementById("property-results-heading");
    results?.scrollIntoView({ block: "start" });
    results?.focus({ preventScroll: true });
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
    <div className="min-h-screen bg-[#fafbf7]">
      <div className="border-b border-[#e2e8de] bg-[#fafbf7] px-5 py-7 text-[#0d3935] sm:px-8 sm:py-9">
        <div className="mx-auto max-w-[1320px]">
          <div className="max-w-3xl">
            <p className="mb-2 text-xs font-semibold tracking-wide text-[#876531]">{locale === 'ta' ? 'உங்கள் சொத்தைத் தேடுங்கள்' : 'Find your property'}</p>
            <h1 className="mb-3 text-[1.8rem] font-bold leading-snug tracking-[-0.03em] sm:text-[2.4rem]">{copy.title}</h1>
            <p className="text-sm leading-7 text-[#617468] sm:text-base">{copy.subtitle}</p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1320px] px-5 py-6 sm:px-8">
        <div className="mb-6 rounded-[22px] border border-[#dfe6da] bg-white p-4 sm:p-5">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
            <div className="md:col-span-12">
              <label htmlFor="property-search" className="sr-only">{copy.title}</label>
              <div className="flex min-h-12 items-center gap-3 rounded-xl border border-[#d9e3d4] bg-[#fafbf7] pl-4 pr-1 focus-within:border-[#0d3935] focus-within:ring-2 focus-within:ring-[#0d3935]/10">
                <Search aria-hidden="true" className="h-5 w-5 shrink-0 text-[#617468]" />
                <input
                  id="property-search"
                  role="searchbox"
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); showResults(); } }}
                  placeholder={copy.searchPlaceholder}
                  className="min-w-0 flex-1 bg-transparent py-3 text-sm text-[#243d31] outline-none placeholder:text-[#788b7d]"
                />
                <button type="button" onClick={showResults} aria-label={locale === "ta" ? "சொத்துகளைத் தேடுங்கள்" : "Search properties"} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#0d3935] text-white hover:bg-[#18574d]"><Search aria-hidden="true" className="h-4 w-4" /></button>
              </div>
            </div>

            {/* Mobile filter disclosure leaves clear/reset available at all times. */}
            <div className="flex flex-wrap items-center justify-between gap-2 md:col-span-12">
              <button type="button" onClick={() => setShowFilters(!showFilters)} aria-expanded={showFilters} aria-controls="property-filter-panel" className={"inline-flex min-h-11 items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold md:hidden " + (showFilters ? "border-[#0d3935] bg-[#0d3935] text-white" : "border-[#dce5d7] bg-[#f4f7f0] text-[#0d3935]")}><SlidersHorizontal aria-hidden="true" className="h-4 w-4" />{locale === "ta" ? "வடிப்பான்கள்" : "Filters"}{activeFilterCount > 0 && <span className="rounded-full bg-black/10 px-2 py-0.5 text-xs">{activeFilterCount}</span>}</button>
              <p className="text-xs leading-5 text-[#6b7c70] md:hidden">{locale === "ta" ? "முடிவுகள் உடனடியாக மாறும்" : "Results update as you filter"}</p>
              <button type="button" onClick={clearFilters} className="min-h-11 rounded-lg px-3 py-2 text-sm font-semibold text-[#526c5c] hover:bg-[#f4f7f0] md:ml-auto">{copy.clear}</button>
            </div>

            <div id="property-filter-panel" role="region" aria-label={locale === "ta" ? "சொத்து வடிப்பான்கள்" : "Property filters"} className={showFilters ? "grid grid-cols-2 gap-4 md:contents" : "hidden md:contents"}>
              <div className="min-w-0 md:col-span-2">
                <label htmlFor="filter-intent" className="mb-2 block text-xs font-semibold leading-5 text-[#526c5c]">{copy.intent}</label>
                <select id="filter-intent" value={intent} onChange={(e) => setIntent(e.target.value)} className="select-field min-h-11 w-full">
                  <option value="">{copy.intent}</option>
                  <option value="sell">{copy.forSale}</option>
                  <option value="rent">{copy.forRent}</option>
                  <option value="short_rent">{copy.shortStay}</option>
                </select>
              </div>

              <div className="min-w-0 md:col-span-2">
                <label htmlFor="filter-selectedType" className="mb-2 block text-xs font-semibold leading-5 text-[#526c5c]">{copy.propertyType}</label>
                <select id="filter-selectedType" value={selectedType} onChange={(e) => setSelectedType(e.target.value)} className="select-field min-h-11 w-full">
                  <option value="">{copy.allTypes}</option>
                  {["house", "apartment", "villa", "land", "commercial"].map((type) => (
                    <option key={type} value={type}>{getPropertyTypeLabel(type, locale)}</option>
                  ))}
                </select>
              </div>

              <div className="min-w-0 md:col-span-2">
                <label htmlFor="filter-selectedArea" className="mb-2 block text-xs font-semibold leading-5 text-[#526c5c]">{copy.allAreas}</label>
                <select id="filter-selectedArea" value={selectedArea} onChange={(e) => setSelectedArea(e.target.value)} className="select-field min-h-11 w-full">
                  <option value="">{copy.allAreas}</option>
                  {areas.map((area) => (
                    <option key={area.slug} value={area.slug}>{locale === "ta" ? area.name_ta : area.name}</option>
                  ))}
                </select>
              </div>

              <div className="min-w-0 md:col-span-2">
                <label htmlFor="filter-minPrice" className="mb-2 block text-xs font-semibold leading-5 text-[#526c5c]">{copy.priceMin}</label>
                <input id="filter-minPrice" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} type="number" min="0" className="input-field min-h-11 w-full" placeholder="0" />
              </div>

              <div className="min-w-0 md:col-span-2">
                <label htmlFor="filter-maxPrice" className="mb-2 block text-xs font-semibold leading-5 text-[#526c5c]">{copy.priceMax}</label>
                <input id="filter-maxPrice" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} type="number" min="0" className="input-field min-h-11 w-full" placeholder="0" />
              </div>

              <div className="min-w-0 md:col-span-1">
                <label htmlFor="filter-bedrooms" className="mb-2 block text-xs font-semibold leading-5 text-[#526c5c]">{copy.bedrooms}</label>
                <input id="filter-bedrooms" value={bedrooms} onChange={(e) => setBedrooms(e.target.value)} type="number" min="0" className="input-field min-h-11 w-full" />
              </div>

              <div className="min-w-0 md:col-span-1">
                <label htmlFor="filter-landSize" className="mb-2 block text-xs font-semibold leading-5 text-[#526c5c]">{copy.landSize}</label>
                <input id="filter-landSize" value={landSize} onChange={(e) => setLandSize(e.target.value)} type="number" min="0" className="input-field min-h-11 w-full" />
              </div>

              <div className="col-span-2 min-w-0 md:col-span-3">
                <label htmlFor="filter-sort" className="mb-2 flex items-center gap-1.5 text-xs font-semibold leading-5 text-[#526c5c]">
                  <ArrowUpDown className="w-3.5 h-3.5 text-teal-700" />
                  {copy.sortBy}
                </label>
                <select id="filter-sort" value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="select-field min-h-11 w-full">
                  {SORT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {locale === "ta" ? option.labelTa : option.labelEn}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-span-2 flex items-end md:col-span-3">
                <label className="inline-flex min-h-11 w-full cursor-pointer items-center gap-3 rounded-xl border border-[#dfe6da] bg-[#fafbf7] px-3 py-3 text-sm font-medium text-[#415d50]">
                  <input type="checkbox" checked={verifiedOnly} onChange={(e) => setVerifiedOnly(e.target.checked)} className="checkbox-tactile" />
                  {copy.verifiedOnly}
                </label>
              </div>

              <div className="col-span-2 flex flex-wrap items-end gap-2 md:col-span-6">
                <button
                  type="button"
                  onClick={handleSaveSearch}
                  disabled={savingSearch}
                  aria-busy={savingSearch} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#dfe6da] bg-white px-4 py-2 text-sm font-semibold text-[#0d3935] hover:bg-[#f2f6ec] disabled:opacity-60"
                >
                  <BookmarkPlus className="w-4 h-4" />
                  {savingSearch ? copy.saving : copy.saveSearch}
                </button>
                <button type="button" onClick={showResults} className="inline-flex min-h-11 flex-1 items-center justify-center rounded-xl bg-[#0d3935] px-4 py-2 text-sm font-semibold text-white md:hidden">{locale === "ta" ? "முடிவுகளைப் பார்க்கவும்" : "Show results"}</button>
                {savedMessage && <span role="status" className="w-full text-sm font-medium text-[#415d50]">{savedMessage}</span>}
              </div>
            </div>
          </div>
        </div>

        <section aria-labelledby="property-results-heading" className="mb-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0 flex-1 basis-60">
              <h2 id="property-results-heading" tabIndex={-1} className="scroll-mt-4 text-xl font-bold text-[#0d3935]">{loading ? (locale === "ta" ? "சொத்துகள் ஏற்றப்படுகின்றன…" : "Loading properties…") : `${filteredAndSortedProperties.length} ${copy.searchResults}`}</h2>
              <p className="mt-2 text-sm leading-6 text-[#63776a]">
                {selectedArea ? `${areas.find((area) => area.slug === selectedArea)?.[locale === "ta" ? "name_ta" : "name"] || selectedArea} · ` : ""}
                {selectedType ? `${getPropertyTypeLabel(selectedType, locale)} · ` : ""}
                {intent ? `${intent === "rent" ? copy.forRent : intent === "short_rent" ? copy.shortStay : copy.forSale} · ` : ""}
                {verifiedOnly ? `${copy.verifiedOnly} · ` : ""}
                {searchQuery ? `“${searchQuery}”` : (locale === "ta" ? "யாழ்ப்பாணம் முழுவதும்" : "Across Jaffna")}
              </p>
            </div>
            <Link href={queryString ? `/map?${queryString}` : "/map"} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-[#d8e2d4] bg-white px-4 py-2 text-sm font-semibold text-[#0d3935] hover:bg-[#f2f6ec]"><Map aria-hidden="true" className="h-4 w-4" />{copy.mapView}</Link>
          </div>
          <details className="mt-3 rounded-xl border border-[#e1e7dc] bg-[#f2f5ed] px-4 text-xs text-[#526a5c]">
            <summary className="min-h-11 cursor-pointer py-3 font-semibold">{copy.trustTitle}</summary>
            <p className="pb-3 leading-6">{copy.trustBody}</p>
          </details>
        </section>

        {loading ? (
          <div role="status" aria-label={locale === "ta" ? "சொத்துகள் ஏற்றப்படுகின்றன" : "Loading properties"} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="animate-pulse overflow-hidden rounded-[22px] border border-[#e1e7dc] bg-white">
                <div className="aspect-[3/2] bg-[#e7ece3]" />
                <div className="p-6 space-y-3">
                  <div className="h-5 bg-charcoal-200 rounded w-3/4" />
                  <div className="h-4 bg-charcoal-100 rounded w-1/2" />
                  <div className="h-6 bg-charcoal-200 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredAndSortedProperties.length > 0 ? (
          <div className="mb-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredAndSortedProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="rounded-[22px] border border-[#dfe6da] bg-white px-5 py-12 text-center">
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
