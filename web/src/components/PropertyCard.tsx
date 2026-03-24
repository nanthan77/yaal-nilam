"use client";

import Link from "next/link";
import { useStore } from "@/lib/store";
import { formatPrice } from "@/lib/translations";
import type { Property } from "@/lib/data";

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const { locale } = useStore();
  const p = property;

  const intentLabel = p.intent === "rent" || p.intent === "short_rent"
    ? (locale === "ta" ? "வாடகைக்கு" : "For Rent")
    : (locale === "ta" ? "விற்பனைக்கு" : "For Sale");

  const intentColor = p.intent === "rent" || p.intent === "short_rent"
    ? "bg-teal-100 text-teal-800"
    : "bg-warm-100 text-warm-800";

  const typeLabel =
    p.property_type === "house" ? (locale === "ta" ? "வீடு" : "House") :
    p.property_type === "land"  ? (locale === "ta" ? "காணி" : "Land") :
    p.property_type === "commercial" ? (locale === "ta" ? "வணிகம்" : "Commercial") :
    p.property_type === "villa" ? (locale === "ta" ? "விலா" : "Villa") :
    p.property_type === "apartment" ? (locale === "ta" ? "குடியிருப்பு" : "Apartment") :
    p.property_type;

  const priceDisplay = p.intent === "rent" || p.intent === "short_rent"
    ? `${formatPrice(p.price, locale)}${locale === "ta" ? "/மாதம்" : "/mo"}`
    : formatPrice(p.price, locale);

  const whatsappMsg = encodeURIComponent(
    `Hi, I'm interested in ${p.title} (${p.listing_code}) — ${priceDisplay}`
  );
  const whatsappUrl = `https://wa.me/${p.agent_phone || "94771234567"}?text=${whatsappMsg}`;

  return (
    <div className="card-interactive group">
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={p.media_urls[0]}
          alt={locale === "ta" && p.title_ta ? p.title_ta : p.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {/* Badges overlay */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <span className={`badge ${intentColor}`}>{intentLabel}</span>
          {p.featured && (
            <span className="badge bg-warm-500 text-white">
              {locale === "ta" ? "சிறப்பு" : "Featured"}
            </span>
          )}
        </div>
        {p.verified && (
          <span className="absolute top-3 right-3 badge-verified">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.403 12.652a3 3 0 010-5.304 3 3 0 00-1.065-3.745 3 3 0 00-5.304 0 3 3 0 00-3.745 1.065 3 3 0 000 5.304 3 3 0 001.065 3.745 3 3 0 005.304 0 3 3 0 003.745-1.065zM12.707 8.707a1 1 0 00-1.414-1.414L9 9.586 8.707 9.293a1 1 0 00-1.414 1.414l1 1a1 1 0 001.414 0l3-3z" clipRule="evenodd"/>
            </svg>
            {locale === "ta" ? "சரிபார்" : "Verified"}
          </span>
        )}
        {/* Save button */}
        <button className="absolute bottom-3 right-3 bg-white/90 p-2 rounded-full hover:bg-white transition-colors shadow-sm opacity-0 group-hover:opacity-100">
          <svg className="w-4 h-4 text-charcoal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
        {/* Price overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent pt-8 pb-3 px-4">
          <p className="text-white text-xl font-bold">{priceDisplay}</p>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-navy-900 leading-snug line-clamp-2 mb-2 group-hover:text-teal-700 transition-colors">
          <Link href={`/properties/${p.id}`}>
            {locale === "ta" && p.title_ta ? p.title_ta : p.title}
          </Link>
        </h3>

        {/* Location */}
        <p className="text-sm text-charcoal-500 mb-3 flex items-center gap-1.5">
          <svg className="w-4 h-4 text-charcoal-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {locale === "ta" && p.address_ta ? p.address_ta : p.address}
        </p>

        {/* Property details chips */}
        <div className="flex flex-wrap gap-1.5 mb-4 text-xs text-charcoal-600">
          <span className="bg-sand-100 px-2.5 py-1 rounded-lg font-medium">{typeLabel}</span>
          {p.bedrooms && (
            <span className="bg-sand-100 px-2.5 py-1 rounded-lg">
              {p.bedrooms} {locale === "ta" ? "படுக்கை" : "Bed"}
            </span>
          )}
          {p.bathrooms && (
            <span className="bg-sand-100 px-2.5 py-1 rounded-lg">
              {p.bathrooms} {locale === "ta" ? "குளியல்" : "Bath"}
            </span>
          )}
          {p.land_size_perches && (
            <span className="bg-sand-100 px-2.5 py-1 rounded-lg">
              {p.land_size_perches} {locale === "ta" ? "பேர்ச்" : "P"}
            </span>
          )}
          {p.sqft && (
            <span className="bg-sand-100 px-2.5 py-1 rounded-lg">
              {p.sqft.toLocaleString()} {locale === "ta" ? "சதுர அடி" : "sqft"}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Link
            href={`/properties/${p.id}`}
            className="flex-1 inline-flex items-center justify-center gap-1 text-sm font-medium bg-navy-50 text-navy-700 hover:bg-navy-100 px-3 py-2 rounded-lg transition-colors"
          >
            {locale === "ta" ? "விவரங்கள்" : "Details"}
          </Link>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-1 text-sm font-medium bg-green-50 text-green-700 hover:bg-green-100 px-3 py-2 rounded-lg transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
            </svg>
            WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
