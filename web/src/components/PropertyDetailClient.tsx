// @ts-nocheck
"use client";

import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import PropertyCard from "@/components/PropertyCard";
import PropertyMap from "@/components/PropertyMap";
import MortgageCalculator from "@/components/MortgageCalculator";
import RoiCalculator from "@/components/RoiCalculator";
import RecentlyViewed from "@/components/RecentlyViewed";
import PropertyGallery from "@/components/PropertyGallery";
import { recordRecentlyViewed } from "@/lib/recentlyViewed";
import { getSavedPropertyIds, getPropertyById, getPropertiesByArea, submitViewingRequest, toggleSavedProperty, trackListingView, trackWhatsAppLead } from "@/lib/firestore";
import { useStore } from "@/lib/store";
import { buildWhatsAppUrl, formatConvertedPrice, resolvePropertyImage } from "@/lib/marketplace";
import { formatCompactPrice, getPropertyTypeLabel, localize } from "@/lib/translations";

const DISPLAY_CURRENCIES = ["LKR", "GBP", "USD"] as const;

export default function PropertyDetailClient() {
  const { locale } = useStore();
  const params = useParams();
  const id = params.id as string;

  const [property, setProperty] = useState<any>(null);
  const [relatedProperties, setRelatedProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [displayCurrency, setDisplayCurrency] = useState<"LKR" | "GBP" | "USD">("LKR");
  const [shareMessage, setShareMessage] = useState("");
  const [viewingState, setViewingState] = useState<"idle" | "submitting" | "success">("idle");
  const [viewingForm, setViewingForm] = useState({
    name: "",
    phone: "",
    email: "",
    preferred_date: "",
    notes: "",
  });

  const copy = localize(locale, {
    en: {
      notFoundTitle: "Property Not Found",
      notFoundBody: "The property you are looking for does not exist or is no longer available.",
      backToProperties: "Back to Properties",
      bedrooms: "Bedrooms",
      bathrooms: "Bathrooms",
      area: "Floor / land area",
      type: "Type",
      parking: "Parking",
      about: "About this property",
      highlights: "Features supplied with this listing",
      trustTitle: "Listing information",
      trustBody: "Yaal Nilam reviews listing details. This is not a legal verification of ownership or title. Check the deed and survey independently before making a commitment.",
      documents: "Documents to check",
      location: "Location context",
      locationBody: "Review the area below and ask for the precise location when arranging a viewing.",
      contact: "Chat on WhatsApp",
      bookViewing: "Book a Viewing",
      viewingIntro: "Tell us when you would like to view this property. We will follow up through the contact method you provide.",
      similar: "Similar Properties",
      save: "Save",
      saved: "Saved",
      share: "Share",
      copied: "Link copied",
      priceLabel: "Price",
      responseRate: "Response rate",
      verified: "Details supplied with this listing",
      floorPlan: "Floor plan",
      videoTour: "Video / virtual tour",
      availableOnRequest: "A floor plan has not been supplied for this listing.",
      viewingSuccess: "Viewing request submitted. Our team will follow up shortly.",
      yourName: "Your name",
      phone: "Phone number",
      email: "Email address",
      date: "Preferred date",
      notes: "Notes",
      submitViewing: "Send Viewing Request",
      submitting: "Submitting...",
      lkrHint: "Approximate converted values for overseas buyers",
      titleHistory: "Title history",
      titleHistoryValue: "Status reported with the listing",
      remoteSupport: "Remote support",
      remoteSupportValue: "Ask about viewing options",
      partnersTitle: "Local Services & Verified Partners",
      partnersDesc: "Need a trusted professional in Jaffna to verify this deed or survey plan? Contact our verified local directory partners.",
      partnerLawyer: "Legal Title & Deed Specialist",
      partnerSurveyor: "Licensed Land Surveyor",
      partnerArchitect: "Architect & Construction Planner",
      chatWhatsapp: "Chat on WhatsApp",
    },
    ta: {
      notFoundTitle: "சொத்து கிடைக்கவில்லை",
      notFoundBody: "நீங்கள் தேடும் சொத்து தற்போது இல்லை அல்லது இனி கிடைக்காது.",
      backToProperties: "சொத்துகளுக்குத் திரும்பவும்",
      bedrooms: "படுக்கையறைகள்",
      bathrooms: "குளியலறைகள்",
      area: "பரப்பளவு",
      type: "வகை",
      parking: "வாகன நிறுத்தம்",
      about: "இந்த சொத்தைப் பற்றி",
      highlights: "பட்டியலில் வழங்கப்பட்ட அம்சங்கள்",
      trustTitle: "பட்டியல் தகவல்",
      trustBody: "யாழ் நிலம் பட்டியல் விவரங்களை மதிப்பாய்வு செய்கிறது. இது உரிமை அல்லது உறுதிக்கான சட்டச் சரிபார்ப்பு அல்ல. முடிவு எடுக்கும் முன் உறுதி மற்றும் நில அளவைத் தனியாகச் சரிபார்க்கவும்.",
      documents: "சரிபார்க்க வேண்டிய ஆவணங்கள்",
      location: "இடவியல் விளக்கம்",
      locationBody: "கீழே உள்ள பகுதியைப் பார்த்து, சொத்தைப் பார்வையிட ஏற்பாடு செய்யும்போது சரியான இடத்தை கேளுங்கள்.",
      contact: "WhatsApp-ல் பேசுங்கள்",
      bookViewing: "வீட்டு பார்வையை பதிவு செய்யுங்கள்",
      viewingIntro: "இந்த சொத்தை எப்போது பார்க்க விரும்புகிறீர்கள் என்று சொல்லுங்கள். நீங்கள் கொடுத்த தொடர்பு வழியாக நாங்கள் follow-up செய்வோம்.",
      similar: "இதே போன்ற சொத்துக்கள்",
      save: "சேமிக்கவும்",
      saved: "சேமிக்கப்பட்டது",
      share: "பகிருங்கள்",
      copied: "Link நகலெடுக்கப்பட்டது",
      priceLabel: "விலை",
      responseRate: "பதில் விகிதம்",
      verified: "பட்டியலுடன் வழங்கப்பட்ட விவரங்கள்",
      floorPlan: "தள திட்டம்",
      videoTour: "Video / virtual tour",
      availableOnRequest: "இந்தப் பட்டியலில் தளத் திட்டம் வழங்கப்படவில்லை.",
      viewingSuccess: "Viewing request அனுப்பப்பட்டது. எங்கள் குழு விரைவில் தொடர்பு கொள்கிறது.",
      yourName: "உங்கள் பெயர்",
      phone: "தொலைபேசி எண்",
      email: "மின்னஞ்சல் முகவரி",
      date: "விருப்பமான தேதி",
      notes: "குறிப்புகள்",
      submitViewing: "Viewing Request அனுப்புங்கள்",
      submitting: "அனுப்பப்படுகிறது...",
      lkrHint: "வெளிநாட்டு வாங்குபவர்களுக்கான தளர்வான மாற்று மதிப்புகள்",
      titleHistory: "Title history",
      titleHistoryValue: "பட்டியலில் தெரிவிக்கப்பட்ட நிலை",
      remoteSupport: "Remote support",
      remoteSupportValue: "பார்வை வழிகளைப் பற்றி கேளுங்கள்",
      partnersTitle: "உள்ளூர் சேவைகள் மற்றும் சரிபார்க்கப்பட்ட கூட்டாளர்கள்",
      partnersDesc: "இந்த நில உறுதி அல்லது வரைபடத்தை சரிபார்க்க யாழ்ப்பாணத்தில் நம்பகமான வல்லுநர் தேவையா? எங்கள் கூட்டாளர்களைத் தொடர்பு கொள்ளுங்கள்.",
      partnerLawyer: "நில உறுதி மற்றும் சட்ட ஆவண நிபுணர்",
      partnerSurveyor: "அங்கீகரிக்கப்பட்ட நில அளவையாளர்",
      partnerArchitect: "கட்டிட கலைஞர் & திட்ட வடிவமைப்பாளர்",
      chatWhatsapp: "WhatsApp-ல் பேசுங்கள்",
    },
  });

  useEffect(() => {
    let mounted = true;
    recordRecentlyViewed(id);

    async function loadData() {
      try {
        const propertyData = await getPropertyById(id);
        if (!propertyData) {
          if (mounted) setProperty(null);
          return;
        }

        const [related, savedIds] = await Promise.all([
          getPropertiesByArea(propertyData.area_slug || propertyData.area),
          getSavedPropertyIds(),
        ]);

        if (!mounted) return;

        setProperty(propertyData);
        setRelatedProperties(related.filter((item) => item.id !== id).slice(0, 3));
        setSaved(savedIds.includes(id));
        trackListingView(propertyData, "property_detail");
      } catch (error) {
        console.error("Failed to load property detail:", error);
        if (mounted) setProperty(null);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadData();

    return () => {
      mounted = false;
    };
  }, [id]);

  const gallery = useMemo(() => {
    if (!property) return [];
    if (property.media_urls?.length > 0) return property.media_urls;
    return [resolvePropertyImage(property)];
  }, [property]);

  if (loading) {
    return <div className="min-h-screen bg-white" />;
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-white px-4 py-12 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-charcoal-900 mb-4">{copy.notFoundTitle}</h1>
          <p className="text-charcoal-600 mb-8">{copy.notFoundBody}</p>
          <Link href="/properties" className="inline-block bg-teal-700 hover:bg-teal-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-200">
            {copy.backToProperties}
          </Link>
        </div>
      </div>
    );
  }

  const propertyTitle = locale === "ta" && property.title_ta ? property.title_ta : property.title;
  const propertyDescription = locale === "ta" ? property.description_ta || property.description : property.description;
  const primaryWhatsappUrl = buildWhatsAppUrl(
    property.agent_phone || "94704846555",
    locale === "ta"
      ? `${propertyTitle} (${property.listing_code}) பற்றி தெரிந்து கொள்ள விரும்புகிறேன்.`
      : `Hi, I'm interested in ${property.title} (${property.listing_code}).`
  );

  async function handleShare() {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: propertyTitle, url });
        return;
      } catch {
        // fall through to clipboard
      }
    }
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(url);
      setShareMessage(copy.copied);
      setTimeout(() => setShareMessage(""), 2200);
    }
  }

  async function handleSave() {
    const next = await toggleSavedProperty(property);
    setSaved(next);
  }

  async function handleViewingSubmit(e: React.FormEvent) {
    e.preventDefault();
    setViewingState("submitting");
    const requestId = await submitViewingRequest({
      listing: property,
      ...viewingForm,
    });
    setViewingState(requestId ? "success" : "idle");
    if (requestId) {
      setViewingForm({ name: "", phone: "", email: "", preferred_date: "", notes: "" });
      setTimeout(() => setViewingState("idle"), 3200);
    }
  }

  return (
    <div className="yn-detail min-h-screen pb-20 lg:pb-0">
      <section className="bg-[#f7f8f3]">
        <div className="mx-auto max-w-[1400px] px-5 pb-10 pt-7 sm:px-8 lg:pt-10">
          <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-2 text-sm text-[#718076]">
            <Link href="/properties" className="hover:text-[#0d3935]">{copy.backToProperties}</Link>
            <span aria-hidden="true">/</span>
            <span>{property.area_name || property.area}</span>
            {property.listing_code && <><span aria-hidden="true">/</span><span>{property.listing_code}</span></>}
          </nav>
          <div className="grid items-start gap-7 lg:grid-cols-[1.38fr_0.84fr]">
            <div className="min-w-0">
              <PropertyGallery images={gallery} videoUrl={property.video_tour_url} title={propertyTitle} />
            </div>
            <div className="min-w-0 rounded-[24px] border border-[#dfe7dd] bg-white p-6 shadow-[0_18px_50px_rgba(11,40,33,0.07)] sm:p-8">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-[#edf3ec] px-3 py-1.5 text-xs font-bold text-[#0d3935]">{getPropertyTypeLabel(property.property_type, locale)}</span>
                {property.featured && <span className="rounded-full bg-[#e8d4ac] px-3 py-1.5 text-xs font-bold text-[#624718]">{locale === "ta" ? "சிறப்பு" : "Featured"}</span>}
                {property.verified && <span className="rounded-full bg-[#edf3ec] px-3 py-1.5 text-xs font-bold text-[#0d3935]">{locale === "ta" ? "பட்டியல் மதிப்பாய்வு" : "Listing reviewed"}</span>}
              </div>
              <h1 className="mt-5 text-3xl font-bold leading-tight tracking-[-0.035em] text-[#0d3935] sm:text-4xl">{propertyTitle}</h1>
              <p className="mt-3 flex items-start gap-2 text-sm leading-6 text-[#687a70]"><span aria-hidden="true">⌖</span>{property.address || property.area_name || property.area}</p>

              <div className="mt-7 border-t border-[#e5ebe3] pt-6">
                <p className="text-xs font-bold uppercase tracking-widest text-[#8d7951]">{copy.priceLabel}</p>
                <p className="mt-1 break-words text-3xl font-extrabold tracking-[-0.04em] text-[#0d3935] sm:text-4xl">{formatConvertedPrice(property.price, displayCurrency)}</p>
                {displayCurrency !== "LKR" && <p className="mt-1 text-xs text-[#718076]">{copy.lkrHint} • {formatCompactPrice(property.price, locale)}</p>}
                <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label={locale === "ta" ? "நாணயம்" : "Currency"}>
                  {DISPLAY_CURRENCIES.map((currency) => <button key={currency} type="button" onClick={() => setDisplayCurrency(currency)}
                    aria-pressed={displayCurrency === currency}
                    className={"rounded-full px-4 py-2 text-xs font-bold transition-colors " + (displayCurrency === currency ? "bg-[#0d3935] text-white" : "bg-[#f0f4ee] text-[#436056] hover:bg-[#e2ebe0]")}>
                    {currency}
                  </button>)}
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-2 text-sm font-medium text-[#496057]">
                {property.land_size_perches > 0 && <span className="rounded-full bg-[#f3f6f1] px-3 py-2">{property.land_size_perches} {locale === "ta" ? "பேர்ச்" : "perches"}</span>}
                {property.bedrooms > 0 && <span className="rounded-full bg-[#f3f6f1] px-3 py-2">{property.bedrooms} {copy.bedrooms}</span>}
                {property.bathrooms > 0 && <span className="rounded-full bg-[#f3f6f1] px-3 py-2">{property.bathrooms} {copy.bathrooms}</span>}
                {property.sqft > 0 && <span className="rounded-full bg-[#f3f6f1] px-3 py-2">{Number(property.sqft).toLocaleString()} sqft</span>}
              </div>
              <p className="mt-6 text-xs leading-5 text-[#728177]">{copy.trustBody}</p>
              <div className="mt-6 grid grid-cols-2 gap-3">
                <button type="button" onClick={handleSave} aria-pressed={saved}
                  className={"rounded-xl border px-4 py-3 text-sm font-bold transition-colors " + (saved ? "border-[#c99746] bg-[#f3e8d1] text-[#0d3935]" : "border-[#dfe7dd] bg-white text-[#0d3935] hover:bg-[#f4f7f1]")}>
                  {saved ? "✓ " + copy.saved : copy.save}
                </button>
                <button type="button" onClick={handleShare}
                  className="rounded-xl border border-[#dfe7dd] bg-white px-4 py-3 text-sm font-bold text-[#0d3935] hover:bg-[#f4f7f1]">{copy.share}</button>
              </div>
              {shareMessage && <p role="status" className="mt-3 text-sm text-[#0d3935]">{shareMessage}</p>}
              <a href={primaryWhatsappUrl} target="_blank" rel="noopener noreferrer" onClick={() => { void trackWhatsAppLead(property, "property_detail"); }}
                className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-[#0d3935] px-5 py-4 text-sm font-bold text-white transition-colors hover:bg-[#18574d]">
                {copy.contact}
              </a>
              <a href="#viewing-request" className="mt-3 inline-flex w-full items-center justify-center rounded-xl border border-[#c99746] px-5 py-3.5 text-sm font-bold text-[#0d3935] hover:bg-[#fbf6eb]">{copy.bookViewing}</a>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[1400px] px-5 py-10 sm:px-8 lg:py-16">
        <div className="grid gap-9 lg:grid-cols-[1.32fr_0.82fr]">
          <div className="space-y-8 w-full min-w-0">
            <section aria-label={locale === "ta" ? "சொத்து விவரங்கள்" : "Property facts"} className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {property.land_size_perches > 0 && <div className="rounded-2xl border border-[#e0e8de] bg-white p-5"><p className="text-xs font-bold text-[#728177]">{locale === "ta" ? "காணி அளவு" : "Land size"}</p><p className="mt-2 text-xl font-bold text-[#0d3935]">{property.land_size_perches} {locale === "ta" ? "பேர்ச்" : "perches"}</p></div>}
              {property.sqft > 0 && <div className="rounded-2xl border border-[#e0e8de] bg-white p-5"><p className="text-xs font-bold text-[#728177]">{locale === "ta" ? "தளப் பரப்பளவு" : "Floor area"}</p><p className="mt-2 text-xl font-bold text-[#0d3935]">{Number(property.sqft).toLocaleString()} sqft</p></div>}
              {property.bedrooms > 0 && <div className="rounded-2xl border border-[#e0e8de] bg-white p-5"><p className="text-xs font-bold text-[#728177]">{copy.bedrooms}</p><p className="mt-2 text-xl font-bold text-[#0d3935]">{property.bedrooms}</p></div>}
              {property.bathrooms > 0 && <div className="rounded-2xl border border-[#e0e8de] bg-white p-5"><p className="text-xs font-bold text-[#728177]">{copy.bathrooms}</p><p className="mt-2 text-xl font-bold text-[#0d3935]">{property.bathrooms}</p></div>}
              <div className="rounded-2xl border border-[#e0e8de] bg-white p-5"><p className="text-xs font-bold text-[#728177]">{copy.type}</p><p className="mt-2 text-xl font-bold text-[#0d3935]">{getPropertyTypeLabel(property.property_type, locale)}</p></div>
              {property.parking > 0 && <div className="rounded-2xl border border-[#e0e8de] bg-white p-5"><p className="text-xs font-bold text-[#728177]">{copy.parking}</p><p className="mt-2 text-xl font-bold text-[#0d3935]">{property.parking}</p></div>}
            </section>

            <section>
              <h2 className="text-2xl font-bold text-charcoal-900 mb-4">{copy.about}</h2>
              <p className="text-charcoal-700 leading-relaxed text-lg">{propertyDescription}</p>
            </section>

            {property.amenities?.length > 0 && (
              <section className="bg-teal-50 border border-teal-100 rounded-3xl p-6">
                <h2 className="text-2xl font-bold text-teal-900 mb-3">{copy.highlights}</h2>
                <div className="grid md:grid-cols-2 gap-3 text-charcoal-700">
                  {property.amenities.map((item: string) => (
                    <div key={item} className="flex items-center gap-2 rounded-2xl bg-white px-4 py-3 border border-teal-100">
                      <span className="w-2 h-2 rounded-full bg-teal-600" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            <section className="rounded-3xl border border-sand-200 p-6">
              <h3 className="text-xl font-bold text-charcoal-900 mb-3">{copy.floorPlan}</h3>
              {property.floor_plan_url ? (
                <a href={property.floor_plan_url} target="_blank" rel="noopener noreferrer" className="text-teal-700 font-semibold underline">
                  Open floor plan
                </a>
              ) : (
                <p className="text-charcoal-600">{copy.availableOnRequest}</p>
              )}
            </section>

            <section className="rounded-3xl border border-sand-200 p-6">
              <h2 className="text-2xl font-bold text-charcoal-900 mb-3">{copy.location}</h2>
              <p className="text-charcoal-700 mb-4">{copy.locationBody}</p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1.5 rounded-full bg-sand-100 text-charcoal-700">{property.area_name}</span>
                <span className="px-3 py-1.5 rounded-full bg-sand-100 text-charcoal-700">{property.listing_code}</span>
                {property.road_frontage_ft > 0 && <span className="px-3 py-1.5 rounded-full bg-sand-100 text-charcoal-700">{property.road_frontage_ft} ft road frontage</span>}
              </div>
              <PropertyMap listing={property} locale={locale} />
            </section>

            {property.intent !== "rent" && property.intent !== "short_rent" && (
              <section className="grid md:grid-cols-2 gap-5">
                <MortgageCalculator price={property.price} locale={locale} />
                <RoiCalculator price={property.price} locale={locale} />
              </section>
            )}
          </div>

          <div className="space-y-6 w-full min-w-0">
            <section className="rounded-3xl border border-[#dfe7dd] p-6 bg-white">
              <h2 className="text-2xl font-bold text-charcoal-900 mb-3">{copy.trustTitle}</h2>
              <p className="text-charcoal-700 mb-5">{copy.trustBody}</p>
              <div className="space-y-4">
                {Array.isArray(property.verification_badges) && property.verification_badges.length > 0 && <div>
                  <p className="text-sm font-semibold text-charcoal-600 mb-2">{copy.verified}</p>
                  <div className="flex flex-wrap gap-2">
                    {property.verification_badges.map((badge: string) => (
                      <span key={badge} className="px-3 py-1.5 rounded-full bg-teal-50 text-teal-700 border border-teal-100 text-sm">{badge}</span>
                    ))}
                  </div>
                </div>}
                {property.document_checklist?.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold text-charcoal-600 mb-2">{copy.documents}</p>
                    <ul className="space-y-2 text-sm text-charcoal-700">
                      {property.document_checklist.map((item: string) => (
                        <li key={item} className="flex items-start gap-2">
                          <span className="mt-2 w-2 h-2 rounded-full bg-teal-600" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </section>

            <section id="viewing-request" className="scroll-mt-24 rounded-3xl border border-[#dfe7dd] p-6 bg-white shadow-sm">
              <h2 className="text-2xl font-bold text-charcoal-900 mb-2">{copy.bookViewing}</h2>
              <p className="text-charcoal-600 text-sm mb-5">{copy.viewingIntro}</p>
              {viewingState === "success" && <p className="mb-4 text-sm font-semibold text-green-700 bg-green-50 p-3 rounded-xl border border-green-100">{copy.viewingSuccess}</p>}
              <form onSubmit={handleViewingSubmit} className="space-y-4">
                <div>
                  <input
                    id="viewing-name"
                    name="name"
                    aria-label={copy.yourName}
                    type="text"
                    value={viewingForm.name}
                    onChange={(e) => setViewingForm((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder={copy.yourName}
                    required
                    className="input-field"
                  />
                </div>
                <div>
                  <input
                    id="viewing-phone"
                    name="phone"
                    aria-label={copy.phone}
                    type="tel"
                    value={viewingForm.phone}
                    onChange={(e) => setViewingForm((prev) => ({ ...prev, phone: e.target.value }))}
                    placeholder={copy.phone}
                    required
                    className="input-field"
                  />
                </div>
                <div>
                  <input
                    id="viewing-email"
                    name="email"
                    aria-label={copy.email}
                    type="email"
                    value={viewingForm.email}
                    onChange={(e) => setViewingForm((prev) => ({ ...prev, email: e.target.value }))}
                    placeholder={copy.email}
                    className="input-field"
                  />
                </div>
                <div>
                  <input
                    id="viewing-date"
                    name="preferred_date"
                    aria-label={copy.date}
                    type="date"
                    value={viewingForm.preferred_date}
                    onChange={(e) => setViewingForm((prev) => ({ ...prev, preferred_date: e.target.value }))}
                    placeholder={copy.date}
                    className="input-field cursor-pointer"
                  />
                </div>
                <div>
                  <textarea
                    id="viewing-notes"
                    name="notes"
                    aria-label={copy.notes}
                    value={viewingForm.notes}
                    onChange={(e) => setViewingForm((prev) => ({ ...prev, notes: e.target.value }))}
                    placeholder={copy.notes}
                    rows={4}
                    className="input-field"
                  />
                </div>
                <button
                  type="submit"
                  disabled={viewingState === "submitting"}
                  className="w-full btn-primary py-3.5 disabled:opacity-60 text-sm"
                >
                  {viewingState === "submitting" ? copy.submitting : copy.submitViewing}
                </button>
              </form>
            </section>
          </div>
        </div>

        {relatedProperties.length > 0 && (
          <section className="border-t border-charcoal-200 pt-12 mt-12">
            <h2 className="text-2xl font-bold text-charcoal-900 mb-6">{copy.similar}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedProperties.map((related) => (
                <PropertyCard key={related.id} property={related} />
              ))}
            </div>
          </section>
        )}
      </div>

      <RecentlyViewed excludeId={id} limit={4} />
      <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 gap-3 border-t border-[#dfe7dd] bg-white/95 px-4 py-3 shadow-[0_-8px_30px_rgba(11,40,33,0.08)] backdrop-blur-sm lg:hidden">
        <a href="#viewing-request" className="flex items-center justify-center rounded-xl border border-[#0d3935] px-3 py-3 text-center text-xs font-bold text-[#0d3935]">{copy.bookViewing}</a>
        <a href={primaryWhatsappUrl} target="_blank" rel="noopener noreferrer" onClick={() => { void trackWhatsAppLead(property, "property_detail_mobile"); }}
          className="flex items-center justify-center rounded-xl bg-[#0d3935] px-3 py-3 text-center text-xs font-bold text-white">{copy.contact}</a>
      </div>
    </div>
  );
}
