"use client";

import { useParams } from "next/navigation";
import { PROPERTIES, AREAS } from "@/lib/data";
import { useStore } from "@/lib/store";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import PropertyCard from "@/components/PropertyCard";
import Link from "next/link";

export default function AreaPageClient() {
  const params = useParams();
  const slug = params?.slug as string;
  const { locale } = useStore();

  const area = AREAS.find((a) => a.slug === slug);

  if (!area) {
    return (
      <div className="min-h-screen flex flex-col bg-sand-50">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center px-6">
            <h1 className="text-3xl font-bold text-charcoal-900 mb-4">
              {locale === "ta" ? "பகுதி கிடைக்கவில்லை" : "Area Not Found"}
            </h1>
            <p className="text-charcoal-600 mb-6">
              {locale === "ta"
                ? "நீங்கள் தேடிய பகுதி கிடைக்கவில்லை."
                : "The area you're looking for doesn't exist."}
            </p>
            <Link href="/" className="btn-primary">
              {locale === "ta" ? "முகப்புக்குத் திரும்பவும்" : "Back to Home"}
            </Link>
          </div>
        </main>
        <Footer />
        <WhatsAppFloat />
      </div>
    );
  }

  const filteredProperties = PROPERTIES.filter((p) => p.area === area.name);

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
            <li className="text-navy-700 font-semibold">{locale === "ta" ? area.ta : area.name}</li>
          </ul>
        </nav>

        {/* Area Hero Section */}
        <div
          className="relative h-96 bg-cover bg-center"
          style={{ backgroundImage: `url(${area.image})` }}
        >
          <div className="absolute inset-0 bg-navy-900/60"></div>
          <div className="relative h-full flex flex-col items-center justify-center text-center text-white px-6">
            <h1 className="text-5xl font-bold mb-2">
              {locale === "ta" ? area.ta : area.name}
            </h1>
            <p className="text-xl mb-4 opacity-90">
              {locale === "ta" ? "பகுதி பற்றி" : "Properties in area"}
            </p>
            <p className="text-lg font-semibold bg-teal-500 px-4 py-2 rounded">
              {filteredProperties.length}{" "}
              {locale === "ta" ? "சொத்துக்கள்" : "Properties"}
            </p>
          </div>
        </div>

        {/* Properties Grid */}
        <div className="container-wide py-16">
          <div className="mb-8">
            <h2 className="section-heading">
              {locale === "ta" ? "கிடைக்கும் சொத்துக்கள்" : "Available Properties"}
            </h2>
            <p className="text-charcoal-600">
              {filteredProperties.length === 0
                ? locale === "ta"
                  ? "இந்த பகுதியில் தற்போது சொத்துக்கள் இல்லை."
                  : "No properties currently available in this area."
                : locale === "ta"
                ? `${filteredProperties.length} சொத்துக்கள் கிடைக்கின்றன`
                : `${filteredProperties.length} properties available`}
            </p>
          </div>

          {filteredProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg border border-charcoal-200">
              <p className="text-charcoal-600 text-lg mb-6">
                {locale === "ta"
                  ? "இந்த பகுதியில் தற்போது சொத்துக்கள் இல்லை. WhatsApp வழியாக எங்களைத் தொடர்பு கொள்ளுங்கள்."
                  : "No properties currently listed in this area. Tell us what you're looking for via WhatsApp."}
              </p>
              <a
                href={`https://wa.me/94771234567?text=I'm looking for a property in ${area.name}, Jaffna.`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp"
              >
                {locale === "ta" ? "WhatsApp-ல் செய்தி அனுப்பு" : "Message on WhatsApp"}
              </a>
            </div>
          )}
        </div>
      </main>

      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
