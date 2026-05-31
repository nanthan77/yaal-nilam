"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useStore } from "@/lib/store";
import { formatCompactPrice, getIntentLabel, getPropertyTypeLabel, t } from "@/lib/translations";
import { buildWhatsAppUrl, resolvePropertyImage } from "@/lib/marketplace";
import { googleMapsViewUrl } from "@/lib/maps";
import ShareMenu from "@/components/ShareMenu";
import { getSavedPropertyIds, toggleSavedProperty, trackWhatsAppLead } from "@/lib/firestore";
import type { Property } from "@/lib/data";

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const router = useRouter();
  const { locale } = useStore();
  const [saved, setSaved] = useState(false);
  const p = property as any;

  useEffect(() => {
    let mounted = true;
    getSavedPropertyIds()
      .then((ids) => {
        if (mounted) setSaved(ids.includes(p.id));
      })
      .catch(() => undefined);

    return () => {
      mounted = false;
    };
  }, [p.id]);

  const intentLabel = getIntentLabel(p.intent, locale);
  const intentColor =
    p.intent === "rent" || p.intent === "short_rent"
      ? "bg-teal-100 text-teal-800"
      : "bg-warm-100 text-warm-800";

  const typeLabel = getPropertyTypeLabel(p.property_type || p.type, locale);
  const priceDisplay =
    p.intent === "rent" || p.intent === "short_rent"
      ? `${formatCompactPrice(p.price, locale)}${locale === "ta" ? "/மாதம்" : "/month"}`
      : formatCompactPrice(p.price, locale);

  const verificationLabel = locale === "ta" ? "ஆவணங்கள் சரிபார்க்கப்பட்டவை" : "Documents reviewed";
  const responseLabel = locale === "ta" ? "பதில் விகிதம்" : "Response rate";
  const whatsappMsg =
    locale === "ta"
      ? `${p.title_ta || p.title} (${p.listing_code}) பற்றி தெரிந்து கொள்ள விரும்புகிறேன்.`
      : `Hi, I'm interested in ${p.title} (${p.listing_code}) — ${priceDisplay}`;

  async function handleSave() {
    try {
      const next = await toggleSavedProperty(p);
      setSaved(next);
    } catch (error) {
      console.error("Unable to save property:", error);
    }
  }

  async function handleWhatsAppClick() {
    await trackWhatsAppLead(p, "property_card");
  }

  const handleCardClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest("button") || target.closest("a")) return;
    router.push(`/properties/${p.id}`);
  };

  return (
    <article
      onClick={handleCardClick}
      className={`card-interactive group overflow-hidden cursor-pointer transition-all duration-300 ${
        p.featured
          ? "border-2 border-[#D4A853] hover:shadow-[0_0_25px_rgba(212,168,83,0.3)] shadow-[#D4A853]/10"
          : "border border-sand-200"
      }`}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-sand-100">
        <img
          src={resolvePropertyImage(p)}
          alt={locale === "ta" && p.title_ta ? p.title_ta : p.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 max-w-[70%] z-10">
          <span className={`badge ${intentColor}`}>{intentLabel}</span>
          {p.featured && <span className="badge bg-[#D4A853] text-[#0F2E25] font-black uppercase tracking-wider shadow-sm">{locale === "ta" ? "சிறப்பு" : "Featured"}</span>}
          {p.verified && <span className="badge bg-white/95 text-teal-800 font-bold uppercase tracking-wider">{locale === "ta" ? "சரிபார்க்கப்பட்டது" : "Verified"}</span>}
          {p.video_tour_url && (
            <span className="badge bg-red-600 text-white font-bold uppercase tracking-wider inline-flex items-center gap-1">
              <svg viewBox="0 0 24 24" className="w-3 h-3" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg>
              {locale === "ta" ? "வீடியோ" : "Video"}
            </span>
          )}
        </div>

        {/* Share */}
        <div className="absolute top-3 right-3 z-10">
          <ShareMenu
            url={`/properties/${p.id}/`}
            title={locale === "ta" && p.title_ta ? p.title_ta : p.title}
            openUp={false}
            iconClassName="w-4 h-4"
            buttonClassName="flex items-center justify-center bg-white/90 p-2.5 rounded-full hover:bg-white transition-colors shadow-sm text-charcoal-600"
          />
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="absolute bottom-3 right-3 bg-white/90 p-2.5 rounded-full hover:bg-white transition-colors shadow-sm"
          aria-label={saved ? "Remove from saved properties" : "Save property"}
        >
          <svg
            className={`w-4 h-4 ${saved ? "text-red-500 fill-current" : "text-charcoal-600"}`}
            fill={saved ? "currentColor" : "none"}
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button>

        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent pt-12 pb-3 px-4">
          <p className="text-white text-xl font-bold">{priceDisplay}</p>
          <p className="text-white/85 text-xs mt-1">{p.listing_code}</p>
        </div>
      </div>

      <div className="p-4 md:p-5">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div>
            <h3 className="font-semibold text-teal-900 leading-snug line-clamp-2 mb-1 group-hover:text-teal-700 transition-colors">
              <Link href={`/properties/${p.id}`}>{locale === "ta" && p.title_ta ? p.title_ta : p.title}</Link>
            </h3>
            <a
              href={googleMapsViewUrl(p)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              title={locale === "ta" ? "Google Maps-ல் இருப்பிடத்தைக் காண்க" : "View location on Google Maps"}
              className="text-sm text-charcoal-500 hover:text-teal-700 flex items-center gap-1.5 transition-colors"
            >
              <svg className="w-4 h-4 text-charcoal-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="line-clamp-1 underline-offset-2 hover:underline">
                {locale === "ta" ? p.address_ta || p.area_name_ta || p.address : p.address || p.area_name}
              </span>
            </a>
          </div>
          <span className="bg-sand-100 px-2.5 py-1 rounded-lg text-xs font-medium text-charcoal-700 whitespace-nowrap">
            {typeLabel}
          </span>
        </div>

        <p className="text-sm text-charcoal-600 line-clamp-2 mb-4">
          {locale === "ta" ? p.description_ta || p.description : p.description}
        </p>

        <div className="flex flex-wrap gap-1.5 mb-4 text-xs text-charcoal-600">
          {p.property_type !== "land" && p.bedrooms > 0 && <span className="bg-sand-100 px-2.5 py-1 rounded-lg">{p.bedrooms} {locale === "ta" ? "படுக்கை" : "Bed"}</span>}
          {p.property_type !== "land" && p.bathrooms > 0 && <span className="bg-sand-100 px-2.5 py-1 rounded-lg">{p.bathrooms} {locale === "ta" ? "குளியல்" : "Bath"}</span>}
          {p.land_size_perches > 0 && <span className="bg-sand-100 px-2.5 py-1 rounded-lg">{p.land_size_perches} {locale === "ta" ? "பேர்ச்" : "P"}</span>}
          {p.sqft > 0 && <span className="bg-sand-100 px-2.5 py-1 rounded-lg">{p.sqft.toLocaleString()} sqft</span>}
          {p.furnishing && p.furnishing !== "not_specified" && (
            <span className="bg-sand-100 px-2.5 py-1 rounded-lg capitalize">{p.furnishing.replace(/-/g, " ")}</span>
          )}
          {p.land_size_perches > 0 && p.price > 0 && p.intent !== "rent" && p.intent !== "short_rent" && (
            <span className="bg-[#D4A853]/15 text-[#8a6d2f] font-semibold px-2.5 py-1 rounded-lg">
              {formatCompactPrice(Math.round(p.price / p.land_size_perches), locale)}/{locale === "ta" ? "பேர்ச்" : "perch"}
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="rounded-xl border border-sand-200 bg-sand-50 px-3 py-2">
            <p className="text-[11px] uppercase tracking-wide text-charcoal-500">{verificationLabel}</p>
            <p className="text-sm font-semibold text-charcoal-800">{p.verified ? "Yes" : "Pending"}</p>
          </div>
          <div className="rounded-xl border border-sand-200 bg-sand-50 px-3 py-2">
            <p className="text-[11px] uppercase tracking-wide text-charcoal-500">{responseLabel}</p>
            <p className="text-sm font-semibold text-charcoal-800">{p.agent_response_rate || 84}%</p>
          </div>
        </div>

        <div className="flex gap-2">
          <Link
            href={`/properties/${p.id}`}
            className="flex-1 inline-flex items-center justify-center gap-1 text-sm font-medium bg-teal-50 text-teal-700 hover:bg-teal-100 px-3 py-2.5 rounded-lg transition-colors"
          >
            {t("common.details", locale)}
          </Link>
          <a
            href={buildWhatsAppUrl(p.agent_phone || "94704846555", whatsappMsg)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleWhatsAppClick}
            className="flex-1 inline-flex items-center justify-center gap-1 text-sm font-medium bg-green-50 text-green-700 hover:bg-green-100 px-3 py-2.5 rounded-lg transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
            </svg>
            WhatsApp
          </a>
        </div>
      </div>
    </article>
  );
}
