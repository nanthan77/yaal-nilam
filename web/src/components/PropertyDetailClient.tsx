"use client";

import { useParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { Bath, BedDouble, CalendarDays, Heart, MapPin, MessageCircle, Ruler } from "lucide-react";
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
import { buildWhatsAppUrl, formatConvertedPrice, type NormalizedListing } from "@/lib/marketplace";
import { formatCompactPrice, getIntentLabel, getPropertyTypeLabel, localize } from "@/lib/translations";
import { localDateToday, rentalPriceSuffix } from "@/lib/property-presentation";
import { getPropertyPath, resolvePropertyId } from "@/lib/property-routes";
import ShareMenu from "@/components/ShareMenu";
import { BRAND } from "@/lib/brand";
import { formatLkrCompact } from "@/lib/units";

const DISPLAY_CURRENCIES = ["LKR", "CAD", "GBP", "AUD", "USD", "EUR"] as const;
const localEmulator = /^(localhost|127\.0\.0\.1):(\d{1,5})$/.exec(process.env.NEXT_PUBLIC_FIRESTORE_EMULATOR_HOST || "");
const localViewingTestEnabled = process.env.NODE_ENV === "development" && Boolean(localEmulator && Number(localEmulator[2]) > 0 && Number(localEmulator[2]) <= 65535);

export default function PropertyDetailClient({ propertyId, initialProperty = null }: { propertyId?: string; initialProperty?: NormalizedListing | null } = {}) {
  const { locale, compareIds, toggleCompare, currency: storeCurrency, setCurrency: setStoreCurrency } = useStore();
  const params = useParams<{ id: string }>();
  const id = resolvePropertyId(propertyId || params?.id || initialProperty?.id || "");

  const [property, setProperty] = useState<NormalizedListing | null>(initialProperty);
  const [relatedProperties, setRelatedProperties] = useState<NormalizedListing[]>([]);
  const [loading, setLoading] = useState(!initialProperty);
  const [loadFailed, setLoadFailed] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [inquiryBarHeight, setInquiryBarHeight] = useState(100);
  const inquiryBarRef = useRef<HTMLElement>(null);
  const [saved, setSaved] = useState(false);
  const [displayCurrency, setDisplayCurrency] = useState<"LKR" | "CAD" | "GBP" | "AUD" | "USD" | "EUR">(
    (storeCurrency as any) || "LKR"
  );
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const [viewingState, setViewingState] = useState<"idle" | "submitting" | "success">("idle");
  const [viewingError, setViewingError] = useState("");
  const [viewingForm, setViewingForm] = useState({
    name: "",
    phone: "",
    email: "",
    preferred_date: "",
    notes: "",
  });

  useEffect(() => {
    if (storeCurrency && DISPLAY_CURRENCIES.includes(storeCurrency as any)) {
      setDisplayCurrency(storeCurrency as any);
    }
  }, [storeCurrency]);

  const handleCurrencyChange = (currency: typeof DISPLAY_CURRENCIES[number]) => {
    setDisplayCurrency(currency);
    setStoreCurrency(currency);
  };

  const copy = localize(locale, {
    en: {
      notFoundTitle: "Property currently unavailable",
      notFoundBody: "We could not retrieve a current public listing for this property. Please try again or browse available properties.",
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
      viewingError: "We could not send your request. Please try again or contact us on WhatsApp.",
      invalidName: "Please enter your name (at least 2 characters).",
      invalidPhone: "Please enter a valid phone number with 7–15 digits, including your country code.",
      invalidDate: "Please choose today or a future date.",
      saveError: "Unable to save this property. Please try again.",
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
      partnersTitle: "Local professional services",
      partnersDesc: "Use the local directory to find a professional for independent deed and survey checks. Confirm their credentials and scope of work directly.",
      partnerLawyer: "Legal Title & Deed Specialist",
      partnerSurveyor: "Licensed Land Surveyor",
      partnerArchitect: "Architect & Construction Planner",
      chatWhatsapp: "Chat on WhatsApp",
      sampleNotice: "Development sample · no live inquiries",
      sampleWhatsapp: "Sample WhatsApp disabled",
      sampleLocalViewing: "Development sample. Viewing requests are sent only to the local test emulator. WhatsApp is disabled.",
      sampleInquiry: "This is development sample content. WhatsApp and viewing requests are disabled.",
    },
    ta: {
      notFoundTitle: "சொத்து தற்போது கிடைக்கவில்லை",
      notFoundBody: "இந்தச் சொத்தின் தற்போதைய பொது பட்டியலைப் பெற முடியவில்லை. மீண்டும் முயற்சிக்கவும் அல்லது கிடைக்கும் சொத்துகளைப் பாருங்கள்.",
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
      viewingIntro: "இந்தச் சொத்தை எப்போது பார்க்க விரும்புகிறீர்கள் என்று சொல்லுங்கள். நீங்கள் வழங்கிய தொடர்பு வழியாக நாங்கள் தொடர்பு கொள்வோம்.",
      similar: "இதே போன்ற சொத்துக்கள்",
      save: "சேமிக்கவும்",
      saved: "சேமிக்கப்பட்டது",
      share: "பகிருங்கள்",
      copied: "இணைப்பு நகலெடுக்கப்பட்டது",
      priceLabel: "விலை",
      responseRate: "பதில் விகிதம்",
      verified: "பட்டியலுடன் வழங்கப்பட்ட விவரங்கள்",
      floorPlan: "தள திட்டம்",
      videoTour: "காணொளி / மெய்நிகர் பார்வை",
      availableOnRequest: "இந்தப் பட்டியலில் தளத் திட்டம் வழங்கப்படவில்லை.",
      viewingSuccess: "சொத்தைப் பார்வையிடும் கோரிக்கை அனுப்பப்பட்டது. எங்கள் குழு விரைவில் தொடர்பு கொள்ளும்.",
      viewingError: "கோரிக்கையை அனுப்ப முடியவில்லை. மீண்டும் முயற்சிக்கவும் அல்லது WhatsApp-ல் தொடர்பு கொள்ளவும்.",
      invalidName: "உங்கள் பெயரை உள்ளிடவும் (குறைந்தது 2 எழுத்துகள்).",
      invalidPhone: "நாட்டுக் குறியீட்டுடன் 7–15 இலக்கங்கள் கொண்ட சரியான தொலைபேசி எண்ணை உள்ளிடவும்.",
      invalidDate: "இன்றைய அல்லது எதிர்காலத் தேதியைத் தேர்ந்தெடுக்கவும்.",
      saveError: "இந்தச் சொத்தைச் சேமிக்க முடியவில்லை. மீண்டும் முயற்சிக்கவும்.",
      yourName: "உங்கள் பெயர்",
      phone: "தொலைபேசி எண்",
      email: "மின்னஞ்சல் முகவரி",
      date: "விருப்பமான தேதி",
      notes: "குறிப்புகள்",
      submitViewing: "பார்வைக் கோரிக்கையை அனுப்பவும்",
      submitting: "அனுப்பப்படுகிறது...",
      lkrHint: "வெளிநாட்டு வாங்குபவர்களுக்கான தோராயமான மாற்று மதிப்புகள்",
      titleHistory: "Title history",
      titleHistoryValue: "பட்டியலில் தெரிவிக்கப்பட்ட நிலை",
      remoteSupport: "Remote support",
      remoteSupportValue: "பார்வை வழிகளைப் பற்றி கேளுங்கள்",
      partnersTitle: "உள்ளூர் தொழில்முறை சேவைகள்",
      partnersDesc: "உறுதி மற்றும் நில அளவை ஆவணங்களைத் தனியாகச் சரிபார்க்க உள்ளூர் சேவைப் பட்டியலில் வல்லுநரைக் கண்டறியுங்கள். அவர்களின் தகுதிகளையும் பணியின் விவரங்களையும் நேரடியாக உறுதிப்படுத்துங்கள்.",
      partnerLawyer: "நில உறுதி மற்றும் சட்ட ஆவண நிபுணர்",
      partnerSurveyor: "அங்கீகரிக்கப்பட்ட நில அளவையாளர்",
      partnerArchitect: "கட்டிட கலைஞர் & திட்ட வடிவமைப்பாளர்",
      chatWhatsapp: "WhatsApp-ல் பேசுங்கள்",
      sampleNotice: "Development sample · நேரடி விசாரணைகள் இல்லை",
      sampleWhatsapp: "மாதிரி WhatsApp முடக்கப்பட்டுள்ளது",
      sampleLocalViewing: "உருவாக்க மாதிரி. பார்வைக் கோரிக்கைகள் உள்ளூர் சோதனைக்கு மட்டுமே அனுப்பப்படும். WhatsApp முடக்கப்பட்டுள்ளது.",
      sampleInquiry: "இது உருவாக்கப் பணிக்கான மாதிரி. WhatsApp மற்றும் பார்வைக் கோரிக்கைகள் முடக்கப்பட்டுள்ளன.",
    },
  });

  useEffect(() => {
    let mounted = true;
    const initialListing = initialProperty?.id === id ? initialProperty : null;
    setLoading(!initialListing);
    setProperty(initialListing);
    setRelatedProperties([]);
    setSaved(false);
    setViewingState("idle");
    setViewingError("");
    setLoadFailed(false);
    if (!id) {
      setLoading(false);
      return;
    }

    async function loadData() {
      try {
        const propertyData = await getPropertyById(id);
        if (!propertyData) {
          if (mounted) setProperty(null);
          return;
        }

        if (!mounted) return;
        // Show the confirmed listing while related and saved properties load.
        setProperty(propertyData);
        setLoading(false);
        recordRecentlyViewed(propertyData.id);
        void trackListingView(propertyData, "property_detail");

        const [related, savedIds] = await Promise.all([
          getPropertiesByArea(propertyData.area_slug).catch(() => []),
          getSavedPropertyIds().catch((): string[] => []),
        ]);

        if (!mounted) return;

        setRelatedProperties(related.filter((item) => item.id !== propertyData.id).slice(0, 3));
        setSaved(savedIds.includes(propertyData.id));
      } catch (error) {
        console.error("Failed to load property detail:", error);
        if (mounted) { setLoadFailed(true); setProperty(initialListing); }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadData();

    return () => {
      mounted = false;
    };
  }, [id, initialProperty, reloadKey]);

  useEffect(() => {
    if (!property) return;
    // The Hosting fallback initially knows only the incoming ID or slug.
    const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (canonical) canonical.href = `https://yaalnilam.com${getPropertyPath(property)}`;
  }, [property]);

  useEffect(() => {
    const bar = inquiryBarRef.current;
    if (!bar) return;
    const measure = () => setInquiryBarHeight(Math.ceil(bar.getBoundingClientRect().height) + 16);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(bar);
    return () => observer.disconnect();
  }, [property?.id, locale]);

  const gallery = useMemo(() => {
    return property?.media_urls || [];
  }, [property]);

  if (loading) {
    return <div role="status" className="min-h-screen bg-white px-5 py-16 text-center text-[#0d3935]">{locale === "ta" ? "சொத்து ஏற்றப்படுகிறது..." : "Loading property..."}</div>;
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-white px-4 py-12 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-charcoal-900 mb-4">{loadFailed ? (locale === "ta" ? "சொத்தை ஏற்ற முடியவில்லை" : "Unable to load this property") : copy.notFoundTitle}</h1>
          <p className="text-charcoal-600 mb-8">{loadFailed ? (locale === "ta" ? "உங்கள் இணைப்பைச் சரிபார்த்து மீண்டும் முயற்சிக்கவும்." : "Check your connection and try again.") : copy.notFoundBody}</p>
          <button type="button" onClick={() => setReloadKey((value) => value + 1)} className="mb-4 mr-3 rounded-xl border border-[#0d3935] px-5 py-3 font-semibold text-[#0d3935]">{locale === "ta" ? "மீண்டும் முயற்சிக்கவும்" : "Try again"}</button>
          <Link href="/properties" className="inline-block bg-teal-700 hover:bg-teal-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-200">
            {copy.backToProperties}
          </Link>
        </div>
      </div>
    );
  }

  const isDevelopmentSample = Boolean(property.is_development_fixture);
  const viewingDisabled = isDevelopmentSample && !localViewingTestEnabled;
  const propertyTitle = locale === "ta" && property.title_ta ? property.title_ta : property.title;
  const displayTitle = isDevelopmentSample ? propertyTitle.replace(/^\[(?:DEVELOPMENT SAMPLE|மாதிரி — DEVELOPMENT)\]\s*/, "") : propertyTitle;
  const propertyDescription = locale === "ta" ? property.description_ta || property.description : property.description;
  const inCompare = compareIds.includes(property.id);
  const compareLimitReached = !inCompare && compareIds.length >= 3;
  const priceSuffix = rentalPriceSuffix(property.intent, locale);
  const primaryWhatsappUrl = buildWhatsAppUrl(
    property.agent_phone || BRAND.whatsappDigits,
    locale === "ta"
      ? `${propertyTitle} (${property.listing_code || property.id}) பற்றி தெரிந்து கொள்ள விரும்புகிறேன்.`
      : `Hi, I'm interested in ${property.title} (${property.listing_code || property.id}).`
  );

  async function handleSave() {
    if (saving || !property) return;
    setSaving(true);
    setSaveError(false);
    try {
      setSaved(await toggleSavedProperty(property));
    } catch {
      setSaveError(true);
    } finally {
      setSaving(false);
    }
  }

  async function handleViewingSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (viewingState === "submitting" || !property) return;
    if (viewingDisabled) { setViewingError(copy.sampleInquiry); return; }
    setViewingError("");
    setViewingState("idle");
    const form = Object.fromEntries(Object.entries(viewingForm).map(([key, value]) => [key, value.trim()])) as typeof viewingForm;
    if (form.name.length < 2) { setViewingError(copy.invalidName); return; }
    if (!/^[+\d\s().-]+$/.test(form.phone) || !/^\d{7,15}$/.test(form.phone.replace(/\D/g, ""))) {
      setViewingError(copy.invalidPhone);
      return;
    }
    if (form.preferred_date && form.preferred_date < localDateToday()) { setViewingError(copy.invalidDate); return; }
    setViewingState("submitting");
    try {
      const requestId = await submitViewingRequest({ listing: property, ...form });
      if (!requestId) throw new Error("Viewing request was not saved");
      setViewingState("success");
      setViewingForm({ name: "", phone: "", email: "", preferred_date: "", notes: "" });
    } catch {
      setViewingState("idle");
      setViewingError(copy.viewingError);
    }
  }

  return (
    <div className="yn-detail min-h-screen pb-[var(--yn-inquiry-height)] lg:pb-0" style={{ "--yn-inquiry-height": `${inquiryBarHeight}px` } as CSSProperties}>
      <section className="border-b border-[#e1e7de] bg-[#fafbf7]">
        <div className="mx-auto max-w-[1320px] px-5 pb-8 pt-5 sm:px-8 lg:pb-10 lg:pt-7">
          <nav aria-label={locale === "ta" ? "வழிசெலுத்தல் பாதை" : "Breadcrumb"} className="mb-4 flex flex-wrap items-center gap-2 text-xs text-[#62766a]">
            <Link href="/properties" className="inline-flex min-h-11 items-center hover:text-[#0d3935]">{copy.backToProperties}</Link><span aria-hidden="true">/</span>
            <Link href={`/areas/${property.area_slug}/`} className="inline-flex min-h-11 items-center hover:text-[#0d3935]">{locale === "ta" ? property.area_name_ta || property.area_name : property.area_name}</Link>
            {property.listing_code && <><span aria-hidden="true">/</span><span>{property.listing_code}</span></>}
          </nav>
          {isDevelopmentSample && <p role="note" className="mb-4 rounded-xl border border-[#e4ddc8] bg-[#fbf3dd] px-4 py-3 text-sm font-semibold text-[#795c22]">{copy.sampleNotice}</p>}
          <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0 flex-1 basis-[28rem]">
              <div className="mb-2 flex flex-wrap items-center gap-2 text-xs font-semibold text-[#4b6756]">
                <span>{getIntentLabel(property.intent, locale)}</span><span aria-hidden="true">·</span><span>{getPropertyTypeLabel(property.property_type, locale)}</span>
                {property.featured && <span className="rounded-full bg-[#f0e5ce] px-2.5 py-1 text-[#76551f]">{locale === "ta" ? "சிறப்பு" : "Featured"}</span>}
                {property.verified && <span className="rounded-full bg-[#eaf1e7] px-2.5 py-1">{locale === "ta" ? "பட்டியல் மதிப்பாய்வு" : "Listing reviewed"}</span>}
              </div>
              <h1 lang={/[\u0B80-\u0BFF]/.test(displayTitle) ? "ta" : "en"} className="max-w-4xl break-words text-[1.7rem] font-bold leading-snug tracking-[-0.03em] text-[#0d3935] sm:text-[2.25rem]">{displayTitle}</h1>
              <p className="mt-2 flex items-start gap-2 text-sm leading-6 text-[#63766b]"><MapPin aria-hidden="true" className="mt-1 h-4 w-4 shrink-0" />{locale === "ta" ? property.address_ta || property.area_name_ta || property.area_name : property.address || property.area_name}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={handleSave} disabled={saving} aria-busy={saving} aria-pressed={saved} className={"inline-flex min-h-11 items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold disabled:opacity-60 " + (saved ? "border-[#b9cbb5] bg-[#eaf1e7] text-[#0d3935]" : "border-[#dce5d8] bg-white text-[#0d3935] hover:bg-[#f1f5ed]")}><Heart aria-hidden="true" className={"h-4 w-4 " + (saved ? "fill-current" : "")} />{saved ? copy.saved : copy.save}</button>
              <ShareMenu url={getPropertyPath(property)} title={propertyTitle} buttonLabel={copy.share} ariaLabel={copy.share} openUp={false} buttonClassName="flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#dce5d8] bg-white px-4 py-2 text-sm font-semibold text-[#0d3935] hover:bg-[#f1f5ed]" />
            </div>
          </div>
          {saveError && <p role="alert" className="mb-4 text-sm text-red-700">{copy.saveError}</p>}
          <div className="grid items-start gap-6 lg:grid-cols-[1.65fr_0.85fr]">
            <div className="min-w-0">
              {gallery.length > 0 || property.video_tour_url ? <PropertyGallery images={gallery} videoUrl={property.video_tour_url} title={displayTitle} isDevelopmentSample={isDevelopmentSample} /> : (
                <div className="flex min-h-[280px] items-center justify-center rounded-[22px] border border-[#dfe7dd] bg-[#e8eee7] px-6 text-center text-[#496057] sm:min-h-[420px]">{locale === "ta" ? "இந்தப் பட்டியலுக்கு புகைப்படங்கள் வழங்கப்படவில்லை." : "Photos have not been supplied for this listing."}</div>
              )}
            </div>
            <aside aria-label={locale === "ta" ? "விலை மற்றும் விசாரணை" : "Price and inquiry"} className="min-w-0 rounded-[22px] border border-[#dfe7dd] bg-white p-5 sm:p-6 lg:sticky lg:top-[calc(var(--yn-header-height)+1rem)]">
              <p className="text-xs font-semibold text-[#63766b]">{copy.priceLabel}</p>
              <p className="mt-1 break-words text-[1.9rem] font-bold leading-snug tracking-[-0.035em] text-[#0d3935]">{property.price > 0 ? formatConvertedPrice(property.price, displayCurrency, locale) + priceSuffix : (locale === "ta" ? "விலையைக் கேளுங்கள்" : "Price on request")}</p>
              {property.price > 0 && displayCurrency !== "LKR" && <p className="mt-2 text-xs leading-5 text-[#63766b]">{copy.lkrHint} · {formatCompactPrice(property.price, locale)}{priceSuffix}</p>}
              {property.price > 0 && <div className="mt-3 flex flex-wrap gap-1.5" role="group" aria-label={locale === "ta" ? "நாணயம்" : "Currency"}>
                {DISPLAY_CURRENCIES.map((currency) => <button key={currency} type="button" onClick={() => handleCurrencyChange(currency)} aria-pressed={displayCurrency === currency} className={"min-h-11 rounded-lg px-3 text-xs font-semibold " + (displayCurrency === currency ? "bg-[#0d3935] text-white" : "bg-[#f1f5ee] text-[#436056] hover:bg-[#e2ebe0]")}>{currency}</button>)}
              </div>}
              <div className="mt-5 flex flex-wrap gap-x-4 gap-y-3 border-y border-[#e5ebe2] py-4 text-sm text-[#415d50]">
                {property.bedrooms > 0 && <span className="inline-flex items-center gap-1.5"><BedDouble aria-hidden="true" className="h-4 w-4" />{property.bedrooms} {copy.bedrooms}</span>}
                {property.bathrooms > 0 && <span className="inline-flex items-center gap-1.5"><Bath aria-hidden="true" className="h-4 w-4" />{property.bathrooms} {copy.bathrooms}</span>}
                {property.land_size_perches > 0 && <span className="inline-flex flex-wrap items-center gap-1.5"><Ruler aria-hidden="true" className="h-4 w-4" />{property.land_size_perches} {locale === "ta" ? "பேர்ச்" : "perches"}{property.land_size_lachams > 0 && <span className="text-xs text-[#63766b]">({property.land_size_lachams} {locale === "ta" ? "லச்சம்" : "lachams"})</span>}</span>}
                {property.sqft > 0 && <span>{Number(property.sqft).toLocaleString()} {locale === "ta" ? "சதுர அடி" : "sqft"}</span>}
              </div>
              {isDevelopmentSample ? <span aria-disabled="true" className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-[#eff2eb] px-4 py-3 text-center text-sm font-semibold text-[#647768]">{copy.sampleWhatsapp}</span> : (
              <a href={primaryWhatsappUrl} target="_blank" rel="noopener noreferrer" onClick={() => { void trackWhatsAppLead(property, "property_detail"); }} className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#0d3935] px-4 py-3 text-center text-sm font-semibold text-white hover:bg-[#18574d]"><MessageCircle aria-hidden="true" className="h-4 w-4 shrink-0" />{copy.contact}</a>              )}
              <a href="#viewing-request" className="mt-2 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-[#bcccb7] px-4 py-3 text-center text-sm font-semibold text-[#0d3935] hover:bg-[#f4f7f0]"><CalendarDays aria-hidden="true" className="h-4 w-4 shrink-0" />{copy.bookViewing}</a>
              <button type="button" onClick={() => toggleCompare(property.id)} aria-pressed={inCompare} disabled={compareLimitReached} className="mt-2 min-h-11 w-full rounded-lg px-3 py-2 text-sm font-semibold text-[#526b5e] hover:bg-[#f4f7f0] disabled:cursor-not-allowed disabled:opacity-60">{compareLimitReached ? (locale === "ta" ? "அதிகபட்சம் 3 சொத்துகளை ஒப்பிடலாம்" : "You can compare up to 3 properties") : (inCompare ? (locale === "ta" ? "✓ ஒப்பீட்டில் சேர்க்கப்பட்டது" : "✓ Added to compare") : (locale === "ta" ? "ஒப்பிடு" : "Compare"))}</button>
              <p className="mt-3 text-xs leading-5 text-[#63766b]">{locale === "ta" ? "பட்டியல் மதிப்பாய்வு சட்ட உரிமையைச் சான்றளிக்காது. உறுதி மற்றும் நில அளவை ஆவணங்களைத் தனியாகச் சரிபார்க்கவும்." : "Listing review does not certify legal title. Check deed and survey documents independently."}</p>
            </aside>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[1320px] px-5 py-8 sm:px-8 lg:py-10">
        <div className="grid gap-7 lg:grid-cols-[1.65fr_0.85fr]">
          <div className="w-full min-w-0 space-y-7">
            <section aria-label={locale === "ta" ? "சொத்து விவரங்கள்" : "Property facts"} className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {property.land_size_perches > 0 && (
                <div className="rounded-2xl border border-[#e0e8de] bg-white p-5">
                  <p className="text-xs font-bold text-[#596b60]">{locale === "ta" ? "காணி அளவு" : "Land size"}</p>
                  <p className="mt-2 text-xl font-bold text-[#0d3935]">{property.land_size_perches} {locale === "ta" ? "பேர்ச்" : "perches"}</p>
                  {property.land_size_lachams > 0 && (
                    <p className="mt-1 text-xs font-semibold text-[#8c652b]">
                      {property.land_size_lachams} {locale === "ta" ? "லச்சம் (பரப்பு)" : "Lachams"}
                    </p>
                  )}
                </div>
              )}
              {property.price_per_perch && property.price_per_perch > 0 && (
                <div className="rounded-2xl border border-[#e0e8de] bg-white p-5">
                  <p className="text-xs font-bold text-[#596b60]">{locale === "ta" ? "பேர்ச் விலை" : "Price per perch"}</p>
                  <p className="mt-2 text-xl font-bold text-[#0d3935]">{formatLkrCompact(property.price_per_perch, locale)}</p>
                  {property.price_per_lacham && (
                    <p className="mt-1 text-xs font-semibold text-[#8c652b]">
                      {formatLkrCompact(property.price_per_lacham, locale)} / {locale === "ta" ? "லச்சம்" : "lacham"}
                    </p>
                  )}
                </div>
              )}
              {property.road_frontage_ft > 0 && (
                <div className="rounded-2xl border border-[#e0e8de] bg-white p-5">
                  <p className="text-xs font-bold text-[#596b60]">{locale === "ta" ? "வீதி முகப்பு" : "Road frontage"}</p>
                  <p className="mt-2 text-xl font-bold text-[#0d3935]">{property.road_frontage_ft} {locale === "ta" ? "அடி" : "ft"}</p>
                  {property.road_frontage?.road_type && (
                    <p className="mt-1 text-xs font-semibold text-[#8c652b] capitalize">{property.road_frontage.road_type.replace(/_/g, " ")}</p>
                  )}
                </div>
              )}
              {property.sqft > 0 && <div className="rounded-2xl border border-[#e0e8de] bg-white p-5"><p className="text-xs font-bold text-[#596b60]">{locale === "ta" ? "தளப் பரப்பளவு" : "Floor area"}</p><p className="mt-2 text-xl font-bold text-[#0d3935]">{Number(property.sqft).toLocaleString()} sqft</p></div>}
              {property.bedrooms > 0 && <div className="rounded-2xl border border-[#e0e8de] bg-white p-5"><p className="text-xs font-bold text-[#596b60]">{copy.bedrooms}</p><p className="mt-2 text-xl font-bold text-[#0d3935]">{property.bedrooms}</p></div>}
              {property.bathrooms > 0 && <div className="rounded-2xl border border-[#e0e8de] bg-white p-5"><p className="text-xs font-bold text-[#596b60]">{copy.bathrooms}</p><p className="mt-2 text-xl font-bold text-[#0d3935]">{property.bathrooms}</p></div>}
              <div className="rounded-2xl border border-[#e0e8de] bg-white p-5"><p className="text-xs font-bold text-[#596b60]">{copy.type}</p><p className="mt-2 text-xl font-bold text-[#0d3935]">{getPropertyTypeLabel(property.property_type, locale)}</p></div>
              {property.parking > 0 && <div className="rounded-2xl border border-[#e0e8de] bg-white p-5"><p className="text-xs font-bold text-[#596b60]">{copy.parking}</p><p className="mt-2 text-xl font-bold text-[#0d3935]">{property.parking}</p></div>}
            </section>

            <section>
              <h2 className="text-2xl font-bold text-charcoal-900 mb-4">{copy.about}</h2>
              <p lang={/[\u0B80-\u0BFF]/.test(propertyDescription) ? "ta" : "en"} className="text-charcoal-700 leading-relaxed text-lg">{propertyDescription}</p>
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
                  {locale === "ta" ? "தளத் திட்டத்தைத் திறக்கவும்" : "Open floor plan"}
                </a>
              ) : (
                <p className="text-charcoal-600">{copy.availableOnRequest}</p>
              )}
            </section>

            <section className="rounded-3xl border border-sand-200 p-6">
              <h2 className="text-2xl font-bold text-charcoal-900 mb-3">{copy.location}</h2>
              <p className="text-charcoal-700 mb-4">{copy.locationBody}</p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1.5 rounded-full bg-sand-100 text-charcoal-700">{locale === "ta" ? property.area_name_ta : property.area_name}</span>
                <span className="px-3 py-1.5 rounded-full bg-sand-100 text-charcoal-700">{property.listing_code}</span>
                {property.road_frontage_ft > 0 && <span className="px-3 py-1.5 rounded-full bg-sand-100 text-charcoal-700">{property.road_frontage_ft} {locale === "ta" ? "அடி வீதி முகப்பு" : "ft road frontage"}</span>}
              </div>
              <PropertyMap listing={property} locale={locale} />
            </section>

            {property.price > 0 && property.intent !== "rent" && property.intent !== "short_rent" && (
              <section className="grid md:grid-cols-2 gap-5">
                <MortgageCalculator price={property.price} locale={locale} />
                <RoiCalculator price={property.price} locale={locale} />
              </section>
            )}
          </div>

          <div className="space-y-6 w-full min-w-0">
            <section className="rounded-[22px] border border-[#dfe7dd] bg-[#fafbf7] p-5 sm:p-6">
              <h2 className="text-xl font-bold text-[#0d3935]">{locale === "ta" ? "பட்டியலில் தெரிவிக்கப்பட்ட தகவல்" : "Information reported with the listing"}</h2>
              <p className="mt-2 text-sm leading-6 text-[#63766b]">{locale === "ta" ? "இந்த விவரங்கள் பட்டியல் வழங்குநரால் தெரிவிக்கப்பட்டவை. ஆவணங்களையும் தகுதியான வல்லுநரின் உறுதிப்படுத்தலையும் கேளுங்கள்." : "These details are supplied by the listing provider. Ask to see the documents and obtain independent professional advice."}</p>
              <dl className="mt-5 divide-y divide-[#e1e7dd] text-sm">
                <div className="py-3 first:pt-0">
                  <dt className="font-semibold text-[#4b6756]">{locale === "ta" ? "உறுதி வரலாறு" : "Deed history"}</dt>
                  <dd className="mt-1 leading-6 text-[#233e31]">{property.pathivagam_status?.deed_history_years && property.pathivagam_status.deed_history_years > 0 ? `${property.pathivagam_status.deed_history_years} ${locale === "ta" ? "வருட வரலாறு தெரிவிக்கப்பட்டுள்ளது" : "years reported"}` : (locale === "ta" ? "விவரம் வழங்கப்படவில்லை" : "Details not supplied")}</dd>
                  {property.pathivagam_status?.land_registry_office && <dd className="mt-1 text-xs leading-5 text-[#63766b]">{property.pathivagam_status.land_registry_office}</dd>}
                  {property.pathivagam_status?.extract_status?.startsWith("verified_") && <dd className="mt-1 text-xs leading-5 text-[#63766b]">{locale === "ta" ? "வழங்குநர் ஆவண ஆய்வு செய்யப்பட்டதாகக் கூறுகிறார்; சான்றுகளை நேரடியாக உறுதிப்படுத்தவும்." : "The provider reports a document review; confirm the evidence directly."}</dd>}
                </div>
                <div className="py-3">
                  <dt className="font-semibold text-[#4b6756]">{locale === "ta" ? "நில அளவை ஆவணம்" : "Survey plan"}</dt>
                  <dd className="mt-1 leading-6 text-[#233e31]">{property.survey_plan?.plan_no ? `${locale === "ta" ? "திட்ட எண்" : "Plan number"}: ${property.survey_plan.plan_no}` : (locale === "ta" ? "திட்ட எண் வழங்கப்படவில்லை" : "Plan number not supplied")}</dd>
                  {property.survey_plan?.surveyor_reg_no && <dd className="mt-1 text-xs leading-5 text-[#63766b]">{locale === "ta" ? "அளவையாளர் பதிவெண் (தெரிவிக்கப்பட்டது)" : "Surveyor registration (reported)"}: {property.survey_plan.surveyor_reg_no}</dd>}
                  {property.survey_plan?.plan_date && <dd className="mt-1 text-xs text-[#63766b]">{locale === "ta" ? "திட்டத் தேதி" : "Plan date"}: {property.survey_plan.plan_date}</dd>}
                </div>
                <div className="py-3">
                  <dt className="font-semibold text-[#4b6756]">{locale === "ta" ? "நீர் ஆதாரம்" : "Water source"}</dt>
                  <dd className="mt-1 leading-6 text-[#233e31]">{property.water_source?.type ? ({ sweet_well: locale === "ta" ? "நன்னீர் கிணறு (தெரிவிக்கப்பட்டது)" : "Sweet well (reported)", brackish_well: locale === "ta" ? "உவர்நீர் கிணறு (தெரிவிக்கப்பட்டது)" : "Brackish well (reported)", municipal_nwsdb: locale === "ta" ? "பொது நீர் வழங்கல் (தெரிவிக்கப்பட்டது)" : "Municipal supply (reported)", tube_well: locale === "ta" ? "குழாய்க் கிணறு (தெரிவிக்கப்பட்டது)" : "Tube well (reported)", none: locale === "ta" ? "நீர் வசதி இல்லை எனத் தெரிவிக்கப்பட்டது" : "No source reported" }[property.water_source.type]) : (locale === "ta" ? "விவரம் வழங்கப்படவில்லை" : "Details not supplied")}</dd>
                  {property.water_source?.municipal_line_available === true && <dd className="mt-1 text-xs leading-5 text-[#63766b]">{locale === "ta" ? "பொது நீர் இணைப்பு உள்ளதாக வழங்குநர் தெரிவிக்கிறார்." : "The provider reports an available municipal connection."}</dd>}
                  {property.water_source?.notes && <dd className="mt-1 text-xs leading-5 text-[#63766b]">{property.water_source.notes}</dd>}
                </div>
                {property.road_frontage_ft > 0 && <div className="py-3 last:pb-0"><dt className="font-semibold text-[#4b6756]">{locale === "ta" ? "வீதி முகப்பு" : "Road frontage"}</dt><dd className="mt-1 text-[#233e31]">{property.road_frontage_ft} {locale === "ta" ? "அடி (தெரிவிக்கப்பட்டது)" : "ft (reported)"}</dd></div>}
              </dl>
            </section>

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

            <section id="viewing-request" className="scroll-mt-4 rounded-[22px] border border-[#dfe7dd] bg-white p-5 sm:p-6">
              <h2 className="text-2xl font-bold text-charcoal-900 mb-2">{copy.bookViewing}</h2>
              <p className="text-charcoal-600 text-sm mb-5">{copy.viewingIntro}</p>
              {viewingState === "success" && <p role="status" className="mb-4 text-sm font-semibold text-green-700 bg-green-50 p-3 rounded-xl border border-green-100">{copy.viewingSuccess}</p>}
              {viewingError && <p id="viewing-error" role="alert" className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-800">{viewingError}</p>}
              {isDevelopmentSample && <p className="mb-4 rounded-xl bg-[#fbf3dd] p-3 text-sm leading-6 text-[#795c22]">{localViewingTestEnabled ? copy.sampleLocalViewing : copy.sampleInquiry}</p>}
              <form onSubmit={handleViewingSubmit} aria-busy={viewingState === "submitting"} aria-describedby={viewingError ? "viewing-error" : undefined} className="space-y-4">
                <fieldset disabled={viewingDisabled || viewingState === "submitting"} className="space-y-4 disabled:opacity-60">
                <div>
                  <label htmlFor="viewing-name" className="mb-1.5 block text-sm font-semibold text-charcoal-700">{copy.yourName} <span aria-hidden="true">*</span></label>
                  <input
                    id="viewing-name"
                    name="name"
                    aria-label={copy.yourName}
                    type="text"
                    autoComplete="name"
                    minLength={2}
                    maxLength={100}
                    value={viewingForm.name}
                    onChange={(e) => setViewingForm((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder={copy.yourName}
                    required
                    className="input-field"
                  />
                </div>
                <div>
                  <label htmlFor="viewing-phone" className="mb-1.5 block text-sm font-semibold text-charcoal-700">{copy.phone} <span aria-hidden="true">*</span></label>
                  <input
                    id="viewing-phone"
                    name="phone"
                    aria-label={copy.phone}
                    type="tel"
                    autoComplete="tel"
                    maxLength={30}
                    value={viewingForm.phone}
                    onChange={(e) => setViewingForm((prev) => ({ ...prev, phone: e.target.value }))}
                    placeholder={copy.phone}
                    required
                    className="input-field"
                  />
                </div>
                <div>
                  <label htmlFor="viewing-email" className="mb-1.5 block text-sm font-semibold text-charcoal-700">{copy.email}</label>
                  <input
                    id="viewing-email"
                    name="email"
                    aria-label={copy.email}
                    type="email"
                    autoComplete="email"
                    maxLength={254}
                    value={viewingForm.email}
                    onChange={(e) => setViewingForm((prev) => ({ ...prev, email: e.target.value }))}
                    placeholder={copy.email}
                    className="input-field"
                  />
                </div>
                <div>
                  <label htmlFor="viewing-date" className="mb-1.5 block text-sm font-semibold text-charcoal-700">{copy.date}</label>
                  <input
                    id="viewing-date"
                    name="preferred_date"
                    aria-label={copy.date}
                    type="date"
                    min={localDateToday()}
                    value={viewingForm.preferred_date}
                    onChange={(e) => setViewingForm((prev) => ({ ...prev, preferred_date: e.target.value }))}
                    placeholder={copy.date}
                    className="input-field cursor-pointer"
                  />
                </div>
                <div>
                  <label htmlFor="viewing-notes" className="mb-1.5 block text-sm font-semibold text-charcoal-700">{copy.notes}</label>
                  <textarea
                    id="viewing-notes"
                    name="notes"
                    aria-label={copy.notes}
                    value={viewingForm.notes}
                    onChange={(e) => setViewingForm((prev) => ({ ...prev, notes: e.target.value }))}
                    placeholder={copy.notes}
                    rows={4}
                    maxLength={2000}
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
                </fieldset>
              </form>
            </section>
          </div>
        </div>

        {relatedProperties.length > 0 && (
          <section className="border-t border-charcoal-200 pt-12 mt-12">
            <h2 className="text-2xl font-bold text-charcoal-900 mb-6">{copy.similar}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProperties.map((related) => (
                <PropertyCard key={related.id} property={related} />
              ))}
            </div>
          </section>
        )}
      </div>

      <RecentlyViewed excludeId={id} limit={4} />
      <nav ref={inquiryBarRef} aria-label={locale === "ta" ? "சொத்து விசாரணை" : "Property inquiry"} className="yn-mobile-inquiry fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 gap-3 border-t border-[#dfe7dd] bg-white/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-8px_30px_rgba(11,40,33,0.08)] backdrop-blur-sm lg:hidden">
        <a href="#viewing-request" className="flex min-h-12 items-center justify-center rounded-xl border border-[#0d3935] px-3 py-3 text-center text-xs font-semibold text-[#0d3935]">{copy.bookViewing}</a>
        {isDevelopmentSample ? <span aria-disabled="true" className="flex min-h-12 items-center justify-center rounded-xl bg-[#eff2eb] px-3 py-3 text-center text-xs font-semibold text-[#647768]">{copy.sampleWhatsapp}</span> : (
        <a href={primaryWhatsappUrl} target="_blank" rel="noopener noreferrer" onClick={() => { void trackWhatsAppLead(property, "property_detail_mobile"); }}
          className="flex min-h-12 items-center justify-center rounded-xl bg-[#0d3935] px-3 py-3 text-center text-xs font-semibold text-white">{copy.contact}</a>        )}
      </nav>
    </div>
  );
}
