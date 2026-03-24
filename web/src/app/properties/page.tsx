"use client";

import { useState, useMemo } from "react";
import { PROPERTIES, AREAS } from "@/lib/data";
import { useStore } from "@/lib/store";
import { t, formatPrice } from "@/lib/translations";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import VoiceSearch from "@/components/VoiceSearch";
import PropertyCard from "@/components/PropertyCard";
import Link from "next/link";

export default function PropertiesPage() {
  const { locale } = useStore();

  // Filter states
  const [intent, setIntent] = useState<"all" | "buy" | "rent">("all");
  const [propertyType, setPropertyType] = useState<string>("all");
  const [area, setArea] = useState<string>("all");
  const [priceMin, setPriceMin] = useState<number>(0);
  const [priceMax, setPriceMax] = useState<number>(200_000_000);
  const [bedrooms, setBedrooms] = useState<number | "all">("all");
  const [verifiedOnly, setVerifiedOnly] = useState<boolean>(false);

  // Filter properties
  const filteredProperties = useMemo(() => {
    return PROPERTIES.filter((property) => {
      // Intent filter
      if (intent === "buy" && property.intent !== "sell") return false;
      if (intent === "rent" && property.intent !== "rent" && property.intent !== "short_rent") return false;

      // Property type filter
      if (propertyType !== "all" && property.property_type !== propertyType) return false;

      // Area filter
      if (area !== "all" && property.area !== area) return false;

      // Price filter
      if (property.price < priceMin || property.price > priceMax) return false;

      // Bedrooms filter
      if (bedrooms !== "all" && property.bedrooms !== bedrooms) return false;

      // Verified filter
      if (verifiedOnly && !property.verified) return false;

      return true;
    });
  }, [intent, propertyType, area, priceMin, priceMax, bedrooms, verifiedOnly]);

  const clearFilters = () => {
    setIntent("all");
    setPropertyType("all");
    setArea("all");
    setPriceMin(0);
    setPriceMax(200_000_000);
    setBedrooms("all");
    setVerifiedOnly(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-sand-50">
      <Navbar />

      <main className="flex-1">
        {/* Breadcrumb */}
        <nav className="container-wide py-4 text-sm text-charcoal-600 border-b border-charcoal-200">
          <ul className="flex items-center gap-2">
            <li>
              <Link href="/" className="hover:text-navy-700 transition">
                {locale === "ta" ? "முகப்பு" : "Home"}
              </Link>
            </li>
            <li className="text-charcoal-400">/</li>
            <li className="text-navy-700 font-semibold">
              {locale === "ta" ? "சொத்துக்கள்" : "Properties"}
            </li>
          </ul>
        </nav>

        {/* Page Header */}
        <div className="bg-white border-b border-charcoal-200">
          <div className="container-wide py-12">
            <h1 className="section-heading mb-2">
              {locale === "ta" ? "யாழ்ப்பாணத்தின் சொத்துக்கள்" : "Properties in Jaffna"}
            </h1>
            <p className="text-charcoal-600">
              {locale === "ta"
                ? "நிலம், வீடுகள், வாடகை மற்றும் வணிக சொத்துக்களை ஆராயுங்கள்"
                : "Browse land, homes, rentals, and commercial properties"}
            </p>
          </div>
        </div>

        <div className="container-wide py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg p-6 border border-charcoal-200 sticky top-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-charcoal-900">
                    {locale === "ta" ? "வடிகட்டிகள்" : "Filters"}
                  </h3>
                  <button
                    onClick={clearFilters}
                    className="text-xs text-teal-600 hover:text-teal-700 font-semibold"
                  >
                    {locale === "ta" ? "அழி" : "Clear"}
                  </button>
                </div>

                {/* Intent Filter */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-charcoal-800 mb-3">
                    {locale === "ta" ? "வாங்க/வாடகை" : "Buy or Rent"}
                  </label>
                  <select
                    value={intent}
                    onChange={(e) => setIntent(e.target.value as "all" | "buy" | "rent")}
                    className="select-field w-full"
                  >
                    <option value="all">{locale === "ta" ? "அனைத்தும்" : "All"}</option>
                    <option value="buy">{locale === "ta" ? "வாங்க" : "Buy"}</option>
                    <option value="rent">{locale === "ta" ? "வாடகை" : "Rent"}</option>
                  </select>
                </div>

                {/* Property Type Filter */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-charcoal-800 mb-3">
                    {locale === "ta" ? "சொத்து வகை" : "Property Type"}
                  </label>
                  <select
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
                    className="select-field w-full"
                  >
                    <option value="all">{locale === "ta" ? "அனைத்து வகைகள்" : "All Types"}</option>
                    <option value="house">{locale === "ta" ? "வீடு" : "House"}</option>
                    <option value="land">{locale === "ta" ? "காணி" : "Land"}</option>
                    <option value="apartment">{locale === "ta" ? "குடியிருப்பு" : "Apartment"}</option>
                    <option value="commercial">{locale === "ta" ? "வணிகம்" : "Commercial"}</option>
                    <option value="villa">{locale === "ta" ? "விலா" : "Villa"}</option>
                  </select>
                </div>

                {/* Area Filter */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-charcoal-800 mb-3">
                    {locale === "ta" ? "பகுதி" : "Area"}
                  </label>
                  <select
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    className="select-field w-full"
                  >
                    <option value="all">{locale === "ta" ? "அனைத்து பகுதிகள்" : "All Areas"}</option>
                    {AREAS.map((a) => (
                      <option key={a.slug} value={a.name}>
                        {locale === "ta" ? a.ta : a.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Range Filter */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-charcoal-800 mb-3">
                    {locale === "ta" ? "விலை வரம்பு" : "Price Range"}
                  </label>
                  <div className="space-y-3">
                    <input
                      type="number"
                      placeholder="Min"
                      value={priceMin}
                      onChange={(e) => setPriceMin(Number(e.target.value))}
                      className="input-field w-full"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={priceMax}
                      onChange={(e) => setPriceMax(Number(e.target.value))}
                      className="input-field w-full"
                    />
                  </div>
                </div>

                {/* Bedrooms Filter */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-charcoal-800 mb-3">
                    {locale === "ta" ? "படுக்கையறைகள்" : "Bedrooms"}
                  </label>
                  <select
                    value={bedrooms}
                    onChange={(e) => setBedrooms(e.target.value === "all" ? "all" : Number(e.target.value))}
                    className="select-field w-full"
                  >
                    <option value="all">{locale === "ta" ? "அனைத்தும்" : "All"}</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5+</option>
                  </select>
                </div>

                {/* Verified Only Filter */}
                <div className="mb-6">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={verifiedOnly}
                      onChange={(e) => setVerifiedOnly(e.target.checked)}
                      className="w-4 h-4 accent-teal-600"
                    />
                    <span className="text-sm font-semibold text-charcoal-800">
                      {locale === "ta"
                        ? "சரிபார்க்கப்பட்ட பட்டியல்கள் மட்டும்"
                        : "Verified Listings Only"}
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* Properties Grid */}
            <div className="lg:col-span-3">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-charcoal-900">
                    {locale === "ta" ? "கண்ணீரிலாத பட்டியல்கள்" : "All Listings"}
                  </h2>
                  <p className="text-sm text-charcoal-600">
                    {locale === "ta"
                      ? `${filteredProperties.length} சொத்துக்கள் கண்டறியப்பட்டுள்ளன`
                      : `${filteredProperties.length} properties found`}
                  </p>
                </div>
              </div>

              {filteredProperties.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredProperties.map((property) => (
                    <PropertyCard key={property.id} property={property} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-white rounded-lg border border-charcoal-200">
                  <p className="text-charcoal-600 text-lg mb-6">
                    {locale === "ta"
                      ? "வடிகட்டிகளுக்கு பொருந்தும் சொத்துக்கள் கிடைக்கவில்லை।"
                      : "No properties match your filters."}
                  </p>
                  <button
                    onClick={clearFilters}
                    className="btn-primary mb-6"
                  >
                    {locale === "ta" ? "வடிகட்டிகளை அழி" : "Clear Filters"}
                  </button>
                  <p className="text-charcoal-600 mb-4">
                    {locale === "ta"
                      ? "உங்கள் தேவায়েற்ற சொத்தைக் கண்டறிய WhatsApp வழியாக எங்களைத் தொடர்பு கொள்ளுங்கள்।"
                      : "Tell us what you're looking for on WhatsApp."}
                  </p>
                  <a
                    href="https://wa.me/94771112233?text=I'm looking for a property in Jaffna."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-whatsapp inline-block"
                  >
                    {locale === "ta" ? "WhatsApp-ல் செய்தி அனுப்பு" : "Message on WhatsApp"}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* WhatsApp CTA Section */}
        {filteredProperties.length > 0 && (
          <div className="bg-navy-50 py-12 border-t border-charcoal-200 mt-8">
            <div className="container-wide">
              <div className="bg-white rounded-lg p-8 text-center shadow-sm border border-navy-200">
                <h3 className="section-heading mb-2">
                  {locale === "ta" ? "சரியான சொத்து கண்டறியவில்லை?" : "Can't find the right property?"}
                </h3>
                <p className="text-charcoal-600 mb-6">
                  {locale === "ta"
                    ? "உங்கள் தேவை সম்பর্কে আমাদের বলুন এবং আমরা আপনার জন্য নিখুঁত সম்পত்তি খুঁজে পাব।"
                    : "Tell us what you need and we'll find the perfect property for you."}
                </p>
                <a
                  href="https://wa.me/94771112233?text=I'm looking for a specific property in Jaffna. Can you help?"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-whatsapp inline-block"
                >
                  {locale === "ta" ? "আমাদের সাথে যোগাযোগ করুন" : "Contact us on WhatsApp"}
                </a>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
      <WhatsAppFloat />
      <VoiceSearch variant="floating" />
    </div>
  );
}
