// @ts-nocheck
"use client";

import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import PropertyCard from "@/components/PropertyCard";
import PropertyMap from "@/components/PropertyMap";
import YouTubeEmbed from "@/components/YouTubeEmbed";
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
  const [selectedImage, setSelectedImage] = useState(0);
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
      highlights: "Why buyers shortlist this listing",
      trustTitle: "Trust and remote-buying support",
      trustBody: "This listing is structured for diaspora and local buyers who want clearer next steps before they travel or commit.",
      documents: "Document checklist",
      location: "Location context",
      locationBody: "This listing is backed by local area knowledge and can be followed up through WhatsApp, phone, or a formal viewing request.",
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
      verified: "Verification badges",
      floorPlan: "Floor plan",
      videoTour: "Video / virtual tour",
      availableOnRequest: "Available on request",
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
      titleHistoryValue: "Preliminary review completed",
      remoteSupport: "Remote support",
      remoteSupportValue: "Video walkthrough and lawyer coordination available",
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
      highlights: "ஏன் வாங்குபவர்கள் இதை shortlist செய்கிறார்கள்",
      trustTitle: "நம்பிக்கை மற்றும் வெளிநாட்டு வாங்குபவர் உதவி",
      trustBody: "பயணம் செய்வதற்கு முன் அல்லது முடிவு எடுப்பதற்கு முன் தெளிவான அடுத்த படிகளை பெற diaspora மற்றும் உள்ளூர் வாங்குபவர்களுக்கு ஏற்ற listing இது.",
      documents: "ஆவணச் சரிபார்ப்பு பட்டியல்",
      location: "இடவியல் விளக்கம்",
      locationBody: "இந்த listing உள்ளூர் பகுதி அறிவுடன் வழங்கப்படுகிறது. WhatsApp, தொலைபேசி அல்லது viewing request வழியாக follow-up செய்யலாம்.",
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
      verified: "சரிபார்ப்பு badges",
      floorPlan: "தள திட்டம்",
      videoTour: "Video / virtual tour",
      availableOnRequest: "கோரிக்கையின் பேரில் கிடைக்கும்",
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
      titleHistoryValue: "ஆரம்ப நிலை ஆவண பரிசோதனை முடிந்தது",
      remoteSupport: "Remote support",
      remoteSupportValue: "Video walkthrough மற்றும் lawyer coordination கிடைக்கும்",
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
    <div className="min-h-screen bg-[#faf7f3]">
      <section className="bg-gradient-to-br from-[#0F2E25] via-[#1B4D3E] to-[#0F1419] text-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-wrap items-center gap-3 text-sm text-white/70 mb-6">
            <Link href="/properties" className="hover:text-white transition duration-200">{copy.backToProperties}</Link>
            <span>/</span>
            <span>{property.area_name}</span>
            <span>/</span>
            <span>{property.listing_code}</span>
          </div>

          <div className="grid lg:grid-cols-[1.45fr_0.9fr] gap-8">
            <div>
              <div className="rounded-[28px] overflow-hidden bg-charcoal-900 border border-white/10 mb-4 shadow-xl">
                <img src={gallery[selectedImage] || resolvePropertyImage(property)} alt={propertyTitle} className="w-full h-64 sm:h-80 lg:h-[460px] object-cover" decoding="async" />
              </div>
              {gallery.length > 1 && (
                <div className="grid grid-cols-4 gap-3">
                  {gallery.slice(0, 4).map((image, index) => (
                    <button
                      key={image}
                      type="button"
                      onClick={() => setSelectedImage(index)}
                      className={`rounded-2xl overflow-hidden border-2 transition duration-200 ${selectedImage === index ? "border-[#D4A853] scale-[1.02]" : "border-white/10 hover:border-white/30"}`}
                    >
                      <img src={image} alt={`${propertyTitle} ${index + 1}`} className="w-full h-20 sm:h-24 object-cover" loading="lazy" decoding="async" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-[28px] border border-white/10 bg-white/5 backdrop-blur-md p-6 lg:p-7 h-fit flex flex-col justify-between shadow-2xl">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  {property.featured && <span className="bg-[#D4A853] text-[#0F2E25] px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Featured</span>}
                  {property.verified && <span className="bg-teal-500/20 text-teal-100 border border-teal-400/30 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Verified</span>}
                  <span className="bg-white/10 text-white px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">{getPropertyTypeLabel(property.property_type, locale)}</span>
                </div>

                <h1 className="text-3xl md:text-4xl font-extrabold leading-tight mb-3 text-white">{propertyTitle}</h1>
                <p className="text-white/70 text-sm mb-6">{property.address}</p>

                <div className="flex flex-wrap items-center gap-2 mb-6">
                  {DISPLAY_CURRENCIES.map((currency) => (
                    <button
                      key={currency}
                      type="button"
                      onClick={() => setDisplayCurrency(currency)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wider transition duration-200 ${displayCurrency === currency ? "bg-[#D4A853] text-[#0F2E25] shadow-lg shadow-[#D4A853]/25" : "bg-white/10 text-white hover:bg-white/20"}`}
                    >
                      {currency}
                    </button>
                  ))}
                </div>

                <div className="mb-6 bg-white/5 border border-white/10 rounded-2xl p-5">
                  <p className="text-xs uppercase tracking-wider text-white/50 mb-1">{copy.priceLabel}</p>
                  <p className="text-4xl font-black text-white">{formatConvertedPrice(property.price, displayCurrency)}</p>
                  <p className="text-xs text-white/50 mt-2 font-medium">{copy.lkrHint} • {formatCompactPrice(property.price, locale)}</p>
                </div>
              </div>

              <div>
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="rounded-2xl bg-white/5 border border-white/10 px-4 py-3">
                    <p className="text-[10px] uppercase tracking-wider text-white/50 mb-0.5">{copy.responseRate}</p>
                    <p className="text-lg font-bold text-white">{property.agent_response_rate || 84}%</p>
                  </div>
                  <div className="rounded-2xl bg-white/5 border border-white/10 px-4 py-3">
                    <p className="text-[10px] uppercase tracking-wider text-white/50 mb-0.5">{copy.remoteSupport}</p>
                    <p className="text-xs font-semibold text-white truncate">{copy.remoteSupportValue}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <button type="button" onClick={handleSave} className="rounded-2xl bg-white text-charcoal-950 px-4 py-3.5 font-bold hover:bg-sand-100 transition duration-200 text-sm">
                    {saved ? copy.saved : copy.save}
                  </button>
                  <button type="button" onClick={handleShare} className="rounded-2xl bg-white/10 text-white border border-white/10 px-4 py-3.5 font-bold hover:bg-white/20 transition duration-200 text-sm">
                    {copy.share}
                  </button>
                </div>

                {shareMessage && <p className="text-sm text-teal-200 mt-2 mb-2 font-medium">{shareMessage}</p>}

                <div className="mt-2">
                  <a
                    href={primaryWhatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackWhatsAppLead(property, "property_detail")}
                    className="w-full inline-flex items-center justify-center bg-[#25D366] hover:bg-[#20ba59] text-white font-bold py-4 px-6 rounded-2xl transition duration-300 text-base shadow-lg shadow-[#25D366]/20 hover:shadow-[#25D366]/40 hover:-translate-y-0.5"
                  >
                    {copy.contact}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid lg:grid-cols-[1.3fr_0.8fr] gap-8">
          <div className="space-y-8">
            <section className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="bg-charcoal-50 p-4 rounded-2xl">
                <p className="text-charcoal-600 text-sm font-semibold mb-2">{copy.bedrooms}</p>
                <p className="text-2xl font-bold text-charcoal-900">{property.bedrooms || "-"}</p>
              </div>
              <div className="bg-charcoal-50 p-4 rounded-2xl">
                <p className="text-charcoal-600 text-sm font-semibold mb-2">{copy.bathrooms}</p>
                <p className="text-2xl font-bold text-charcoal-900">{property.bathrooms || "-"}</p>
              </div>
              <div className="bg-charcoal-50 p-4 rounded-2xl">
                <p className="text-charcoal-600 text-sm font-semibold mb-2">{copy.area}</p>
                <p className="text-2xl font-bold text-charcoal-900">
                  {property.sqft ? `${property.sqft} sqft` : property.land_size_perches ? `${property.land_size_perches} P` : "-"}
                </p>
              </div>
              <div className="bg-charcoal-50 p-4 rounded-2xl">
                <p className="text-charcoal-600 text-sm font-semibold mb-2">{copy.type}</p>
                <p className="text-xl font-bold text-charcoal-900">{getPropertyTypeLabel(property.property_type, locale)}</p>
              </div>
              <div className="bg-charcoal-50 p-4 rounded-2xl">
                <p className="text-charcoal-600 text-sm font-semibold mb-2">{copy.parking}</p>
                <p className="text-2xl font-bold text-charcoal-900">{property.parking || "-"}</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-charcoal-900 mb-4">{copy.about}</h2>
              <p className="text-charcoal-700 leading-relaxed text-lg">{propertyDescription}</p>
            </section>

            <section className="bg-teal-50 border border-teal-100 rounded-3xl p-6">
              <h2 className="text-2xl font-bold text-teal-900 mb-3">{copy.highlights}</h2>
              <div className="grid md:grid-cols-2 gap-3 text-charcoal-700">
                {(property.amenities?.length > 0 ? property.amenities : property.document_checklist).map((item: string) => (
                  <div key={item} className="flex items-center gap-2 rounded-2xl bg-white px-4 py-3 border border-teal-100">
                    <span className="w-2 h-2 rounded-full bg-teal-600" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="grid md:grid-cols-2 gap-5">
              <div className="rounded-3xl border border-sand-200 p-6">
                <h3 className="text-xl font-bold text-charcoal-900 mb-3">{copy.floorPlan}</h3>
                {property.floor_plan_url ? (
                  <a href={property.floor_plan_url} target="_blank" rel="noopener noreferrer" className="text-teal-700 font-semibold underline">
                    Open floor plan
                  </a>
                ) : (
                  <p className="text-charcoal-600">{copy.availableOnRequest}</p>
                )}
              </div>
              <div className="rounded-3xl border border-sand-200 p-6">
                <h3 className="text-xl font-bold text-charcoal-900 mb-3">{copy.videoTour}</h3>
                {property.video_tour_url ? (
                  <YouTubeEmbed url={property.video_tour_url} title={propertyTitle} />
                ) : (
                  <p className="text-charcoal-600">{copy.availableOnRequest}</p>
                )}
              </div>
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
          </div>

          <div className="space-y-6">
            <section className="rounded-3xl border border-sand-200 p-6 bg-white">
              <h2 className="text-2xl font-bold text-charcoal-900 mb-3">{copy.trustTitle}</h2>
              <p className="text-charcoal-700 mb-5">{copy.trustBody}</p>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-semibold text-charcoal-600 mb-2">{copy.verified}</p>
                  <div className="flex flex-wrap gap-2">
                    {property.verification_badges.map((badge: string) => (
                      <span key={badge} className="px-3 py-1.5 rounded-full bg-teal-50 text-teal-700 border border-teal-100 text-sm">{badge}</span>
                    ))}
                  </div>
                </div>
                <div className="rounded-2xl bg-sand-50 px-4 py-3">
                  <p className="text-xs uppercase tracking-wide text-charcoal-500">{copy.titleHistory}</p>
                  <p className="font-semibold text-charcoal-900">{property.title_history_status === "verified" ? copy.titleHistoryValue : property.title_history_status}</p>
                </div>
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
              </div>
            </section>

            <section className="rounded-3xl border border-sand-300 p-6 bg-white shadow-sm animate-fade-in">
              <h2 className="text-xl font-bold text-charcoal-900 mb-2 flex items-center gap-2">
                <span className="w-2 h-5 bg-[#D4A853] rounded-full inline-block" />
                {copy.partnersTitle}
              </h2>
              <p className="text-charcoal-500 text-xs mb-5 leading-relaxed">{copy.partnersDesc}</p>
              
              <div className="space-y-4">
                {/* Notary */}
                <div className="p-4 rounded-2xl border border-sand-200 bg-[#FAF7F3] hover:border-[#2D7A5F]/30 transition duration-200">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="bg-[#D4A853]/10 text-[#0f2e25] text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md">
                        {copy.partnerLawyer}
                      </span>
                      <h4 className="text-sm font-bold text-charcoal-900 mt-1">S. Thirukumaran, NP</h4>
                    </div>
                  </div>
                  <p className="text-[11px] text-charcoal-600 leading-relaxed mb-3">
                    Specialist in Northern Province deed registry search, pathmap legal clearance, and diaspora titles.
                  </p>
                  <a
                    href="https://wa.me/94704846555?text=Hi%20Thirukumaran,%20I%20am%20interested%20in%20verifying%20the%20deed%20for%20property%20listing%20on%20Yaal%20Nilam"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2D7A5F] hover:text-[#1B4D3E]"
                  >
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    {copy.chatWhatsapp} →
                  </a>
                </div>

                {/* Surveyor */}
                <div className="p-4 rounded-2xl border border-sand-200 bg-[#FAF7F3] hover:border-[#2D7A5F]/30 transition duration-200">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="bg-[#D4A853]/10 text-[#0f2e25] text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md">
                        {copy.partnerSurveyor}
                      </span>
                      <h4 className="text-sm font-bold text-charcoal-900 mt-1">K. Baskaran, L.S.</h4>
                    </div>
                  </div>
                  <p className="text-[11px] text-charcoal-600 leading-relaxed mb-3">
                    Certified land boundary plotting, GPS mapping, partition survey plans in Jaffna and Vavuniya.
                  </p>
                  <a
                    href="https://wa.me/94704846555?text=Hi%20Baskaran,%20I%20need%20a%20survey%20boundary%20check%20for%20a%20property%20on%20Yaal%20Nilam"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2D7A5F] hover:text-[#1B4D3E]"
                  >
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    {copy.chatWhatsapp} →
                  </a>
                </div>

                {/* Builder */}
                <div className="p-4 rounded-2xl border border-sand-200 bg-[#FAF7F3] hover:border-[#2D7A5F]/30 transition duration-200">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="bg-[#D4A853]/10 text-[#0f2e25] text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md">
                        {copy.partnerArchitect}
                      </span>
                      <h4 className="text-sm font-bold text-charcoal-900 mt-1">NorthBuild Construction</h4>
                    </div>
                  </div>
                  <p className="text-[11px] text-charcoal-600 leading-relaxed mb-3">
                    Modern custom house design, estimating, structural planning, and contract builds for overseas families.
                  </p>
                  <a
                    href="https://wa.me/94704846555?text=Hi%20NorthBuild,%20I%20want%20to%20consult%20about%20a%20new%20home%20design/estimate%20via%20Yaal%20Nilam"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2D7A5F] hover:text-[#1B4D3E]"
                  >
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    {copy.chatWhatsapp} →
                  </a>
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-sand-300 p-6 bg-white shadow-sm">
              <h2 className="text-2xl font-bold text-charcoal-900 mb-2">{copy.bookViewing}</h2>
              <p className="text-charcoal-600 text-sm mb-5">{copy.viewingIntro}</p>
              {viewingState === "success" && <p className="mb-4 text-sm font-semibold text-green-700 bg-green-50 p-3 rounded-xl border border-green-100">{copy.viewingSuccess}</p>}
              <form onSubmit={handleViewingSubmit} className="space-y-4">
                <div>
                  <input
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
                    type="email"
                    value={viewingForm.email}
                    onChange={(e) => setViewingForm((prev) => ({ ...prev, email: e.target.value }))}
                    placeholder={copy.email}
                    className="input-field"
                  />
                </div>
                <div>
                  <input
                    type="date"
                    value={viewingForm.preferred_date}
                    onChange={(e) => setViewingForm((prev) => ({ ...prev, preferred_date: e.target.value }))}
                    placeholder={copy.date}
                    className="input-field cursor-pointer"
                  />
                </div>
                <div>
                  <textarea
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
    </div>
  );
}
