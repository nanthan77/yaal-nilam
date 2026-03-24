"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PropertyCard from "@/components/PropertyCard";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import VoiceSearch from "@/components/VoiceSearch";
import { useStore } from "@/lib/store";
import { formatPrice } from "@/lib/translations";
import { PROPERTIES } from "@/lib/data";

export default function PropertyDetailClient() {
  const params = useParams();
  const { locale } = useStore();
  const l = locale;
  const [activeImg, setActiveImg] = useState(0);
  const [showInquiry, setShowInquiry] = useState(false);
  const [inquirySent, setInquirySent] = useState(false);

  const property = PROPERTIES.find((p) => p.id === params.id);
  if (!property) {
    return (
      <>
        <Navbar />
        <div className="container-wide py-32 text-center">
          <h1 className="text-2xl font-bold text-navy-900 mb-4">Property not found</h1>
          <Link href="/properties" className="btn-primary">Browse Properties</Link>
        </div>
        <Footer />
      </>
    );
  }

  const p = property;
  const priceDisplay = p.intent === "rent" || p.intent === "short_rent"
    ? `${formatPrice(p.price, l)}${l === "ta" ? "/மாதம்" : "/mo"}`
    : formatPrice(p.price, l);

  const whatsappMsg = encodeURIComponent(
    `Hi, I'm interested in ${p.title} (${p.listing_code}) at ${p.address} — ${priceDisplay}`
  );
  const whatsappUrl = `https://wa.me/${p.agent_phone || "94771234567"}?text=${whatsappMsg}`;

  const similar = PROPERTIES.filter(
    (s) => s.id !== p.id && (s.property_type === p.property_type || s.area === p.area)
  ).slice(0, 3);

  const images = [p.media_urls[0], p.media_urls[0], p.media_urls[0]];

  return (
    <>
      <Navbar />
      <div className="container-wide py-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-charcoal-500 mb-6">
          <Link href="/" className="hover:text-teal-600">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/properties" className="hover:text-teal-600">Properties</Link>
          <span className="mx-2">/</span>
          <span className="text-navy-800">{l === "ta" && p.title_ta ? p.title_ta : p.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2">
            {/* Gallery */}
            <div className="rounded-2xl overflow-hidden mb-6">
              <div className="aspect-[16/10] bg-charcoal-100">
                <img src={images[activeImg]} alt={p.title} className="w-full h-full object-cover" />
              </div>
              <div className="flex gap-2 mt-2">
                {images.map((img, i) => (
                  <button key={i} onClick={() => setActiveImg(i)}
                    className={`w-20 h-14 rounded-lg overflow-hidden border-2 transition-colors ${i === activeImg ? "border-teal-500" : "border-transparent opacity-70 hover:opacity-100"}`}>
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Title + badges */}
            <div className="flex flex-wrap gap-2 mb-3">
              <span className={`badge ${p.intent === "rent" ? "bg-teal-100 text-teal-800" : "bg-warm-100 text-warm-800"}`}>
                {p.intent === "rent" ? (l === "ta" ? "வாடகைக்கு" : "For Rent") : (l === "ta" ? "விற்பனைக்கு" : "For Sale")}
              </span>
              <span className="badge bg-navy-100 text-navy-800">{p.property_type.charAt(0).toUpperCase() + p.property_type.slice(1)}</span>
              {p.verified && <span className="badge-verified">Verified</span>}
              {p.featured && <span className="badge bg-warm-500 text-white">Featured</span>}
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-navy-900 mb-2">
              {l === "ta" && p.title_ta ? p.title_ta : p.title}
            </h1>
            <p className="text-charcoal-500 flex items-center gap-1.5 mb-6">
              <svg className="w-5 h-5 text-charcoal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {l === "ta" && p.address_ta ? p.address_ta : p.address}
            </p>

            {/* Stats grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              {p.bedrooms && <div className="bg-sand-100 rounded-xl p-4 text-center"><p className="text-2xl font-bold text-navy-900">{p.bedrooms}</p><p className="text-xs text-charcoal-500">Bedrooms</p></div>}
              {p.bathrooms && <div className="bg-sand-100 rounded-xl p-4 text-center"><p className="text-2xl font-bold text-navy-900">{p.bathrooms}</p><p className="text-xs text-charcoal-500">Bathrooms</p></div>}
              {p.land_size_perches && <div className="bg-sand-100 rounded-xl p-4 text-center"><p className="text-2xl font-bold text-navy-900">{p.land_size_perches}</p><p className="text-xs text-charcoal-500">Perches</p></div>}
              {p.sqft && <div className="bg-sand-100 rounded-xl p-4 text-center"><p className="text-2xl font-bold text-navy-900">{p.sqft.toLocaleString()}</p><p className="text-xs text-charcoal-500">Sq ft</p></div>}
              {p.road_frontage_ft && <div className="bg-sand-100 rounded-xl p-4 text-center"><p className="text-2xl font-bold text-navy-900">{p.road_frontage_ft}ft</p><p className="text-xs text-charcoal-500">Road Frontage</p></div>}
            </div>

            {/* Description */}
            <h2 className="text-xl font-bold text-navy-900 mb-3">Description</h2>
            <p className="text-charcoal-600 leading-relaxed mb-8">{p.description}</p>

            {/* Listing info */}
            <div className="bg-sand-100 rounded-2xl p-6">
              <h3 className="font-semibold text-navy-900 mb-3">Listing Details</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-charcoal-500">ID:</span> <span className="font-medium">{p.listing_code}</span></div>
                <div><span className="text-charcoal-500">Posted:</span> <span className="font-medium">{p.posted_date}</span></div>
                {p.agent_name && <div><span className="text-charcoal-500">Agent:</span> <span className="font-medium">{p.agent_name}</span></div>}
                {p.furnished !== undefined && <div><span className="text-charcoal-500">Furnished:</span> <span className="font-medium">{p.furnished ? "Yes" : "No"}</span></div>}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <div className="card-elevated p-6">
                <p className="text-3xl font-bold text-navy-900 mb-1">{priceDisplay}</p>
                {p.land_size_perches && (
                  <p className="text-sm text-charcoal-500 mb-6">{formatPrice(Math.round(p.price / p.land_size_perches), l)} / perch</p>
                )}
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn-whatsapp w-full text-center mb-3">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/></svg>
                  Contact on WhatsApp
                </a>
                <button onClick={() => setShowInquiry(!showInquiry)} className="btn-secondary w-full text-center mb-3">Send Inquiry</button>
                {p.agent_phone && <a href={`tel:+${p.agent_phone}`} className="btn-ghost w-full text-center text-sm">Call: +{p.agent_phone}</a>}

                {showInquiry && !inquirySent && (
                  <form onSubmit={(e) => { e.preventDefault(); setInquirySent(true); }} className="mt-4 pt-4 border-t border-sand-200 space-y-3">
                    <input type="text" placeholder="Your name" className="input-field text-sm" />
                    <input type="tel" placeholder="+94 7X XXX XXXX" className="input-field text-sm" />
                    <textarea placeholder="Your message" rows={3} className="input-field text-sm resize-none" />
                    <button type="submit" className="btn-primary w-full text-sm">Send</button>
                  </form>
                )}
                {inquirySent && (
                  <div className="mt-4 pt-4 border-t border-sand-200 text-center">
                    <p className="text-teal-700 font-medium text-sm">Inquiry sent!</p>
                  </div>
                )}
              </div>

              <div className="card p-5 bg-teal-50 border border-teal-200">
                <p className="font-semibold text-navy-900 text-sm mb-2">Need something similar?</p>
                <p className="text-xs text-charcoal-500 mb-3">Tell us your requirements</p>
                <Link href="/request-property" className="btn-primary btn-sm w-full text-center text-xs">Send Request</Link>
              </div>

              <button className="text-xs text-charcoal-400 hover:text-red-500 transition-colors">Report this listing</button>
            </div>
          </div>
        </div>

        {/* Similar */}
        {similar.length > 0 && (
          <div className="mt-16">
            <h2 className="section-heading mb-6">Similar Properties</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {similar.map((s) => <PropertyCard key={s.id} property={s} />)}
            </div>
          </div>
        )}
      </div>

      <Footer />
      <WhatsAppFloat />
      <VoiceSearch variant="floating" />
    </>
  );
}
