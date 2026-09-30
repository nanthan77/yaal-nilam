"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CheckCircle,
  XCircle,
  Edit3,
  MapPin,
  Home,
  Layers,
  Bed,
  Bath,
  Phone,
  ShieldCheck,
  Sparkles,
  ExternalLink,
  MessageCircle,
  AlertCircle,
  Clock,
} from "lucide-react";
import { getFunctions, httpsCallable } from "firebase/functions";
import app from "@/lib/firebase";

interface ListingPreviewData {
  id: string;
  title: string;
  title_ta?: string;
  description: string;
  description_ta?: string;
  property_type: string;
  intent: string;
  status: string;
  price: number;
  currency: string;
  area_name: string;
  area_name_ta?: string;
  area_slug: string;
  address?: string;
  address_ta?: string;
  land_size_perches?: number | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
  sqft?: number | null;
  road_frontage_ft?: number | null;
  amenities: string[];
  media_urls: string[];
  agent_name: string;
  agent_phone: string;
  agent_company?: string;
  consent_status?: string;
  claim_token: string;
  created_at?: string;
}

interface AgentData {
  id: string;
  name: string;
  phone: string;
  company?: string;
  status?: string;
}

export default function ListingPreviewClient({ initialToken }: { initialToken?: string }) {
  const [token, setToken] = useState(initialToken || "");
  const [listing, setListing] = useState<ListingPreviewData | null>(null);
  const [agent, setAgent] = useState<AgentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [actionResult, setActionResult] = useState<{
    success: boolean;
    status: string;
    live_url?: string;
    message?: string;
  } | null>(null);

  // Edit request modal
  const [showEditModal, setShowEditModal] = useState(false);
  const [editNotes, setEditNotes] = useState("");

  useEffect(() => {
    let activeToken = initialToken;
    if (!activeToken && typeof window !== "undefined") {
      // 1. Try URL pathname: /preview/:token
      const match = window.location.pathname.match(/^\/preview\/([^/]+)\/?$/);
      if (match && match[1] && match[1] !== "view") {
        activeToken = match[1];
      } else {
        // 2. Try query param: ?token=xyz
        const q = new URLSearchParams(window.location.search).get("token");
        if (q) activeToken = q;
      }
    }

    if (activeToken) {
      setToken(activeToken);
      fetchPreview(activeToken);
    } else {
      setError("செல்லுபடியாகும் டோக்கன் கிடைக்கவில்லை (No preview token provided)");
      setLoading(false);
    }
  }, [initialToken]);

  async function fetchPreview(claimToken: string) {
    setLoading(true);
    setError("");

    try {
      // Try Cloud Function callable first
      const functions = getFunctions(app);
      const getPreviewFn = httpsCallable<{ token: string }, any>(functions, "getListingPreview");
      const res = await getPreviewFn({ token: claimToken });

      if (res.data?.found && res.data?.listing) {
        setListing(res.data.listing);
        setAgent(res.data.agent || null);
        if (res.data.listing.status === "available" || res.data.listing.consent_status === "granted") {
          setActionResult({
            success: true,
            status: "published",
            live_url: `https://yaalnilam.com/properties/${res.data.listing.id}/`,
            message: "இந்த விளம்பரம் ஏற்கனவே தளத்தில் நேரலையாக வெளியிடப்பட்டுள்ளது.",
          });
        }
        setLoading(false);
        return;
      }
    } catch (callableErr) {
      console.warn("Callable getListingPreview failed, falling back to HTTP endpoint:", callableErr);
    }

    // Fallback: Call HTTP endpoint
    try {
      const resp = await fetch(
        `https://us-central1-yaal-nilam.cloudfunctions.net/claimListingHandler?token=${encodeURIComponent(
          claimToken
        )}`
      );
      const data = await resp.json();
      if (data?.found && data?.listing) {
        setListing(data.listing);
        setAgent(data.agent || null);
        if (data.listing.status === "available" || data.listing.consent_status === "granted") {
          setActionResult({
            success: true,
            status: "published",
            live_url: `https://yaalnilam.com/properties/${data.listing.id}/`,
            message: "இந்த விளம்பரம் ஏற்கனவே தளத்தில் நேரலையாக வெளியிடப்பட்டுள்ளது.",
          });
        }
      } else {
        setError(data?.error || "விளம்பரம் கிடைக்கவில்லை அல்லது டோக்கன் காலாவதியாகிவிட்டது.");
      }
    } catch (httpErr: any) {
      console.error("HTTP fetch error:", httpErr);
      setError("தகவலைப் பெறுவதில் பிழை ஏற்பட்டது. தயவுசெய்து சிறிது நேரம் கழித்து மீண்டும் முயற்சிக்கவும்.");
    } finally {
      setLoading(false);
    }
  }

  async function handleAction(action: "approve" | "edit" | "decline", notes?: string) {
    if (!token) return;
    setActionLoading(true);

    try {
      // 1. Try Firebase callable
      const functions = getFunctions(app);
      const respondFn = httpsCallable<
        { token: string; action: string; notes?: string; site_url: string },
        any
      >(functions, "respondListingConsent");
      const res = await respondFn({
        token,
        action,
        notes,
        site_url: typeof window !== "undefined" ? window.location.origin : "https://yaalnilam.com",
      });

      if (res.data?.success) {
        setActionResult(res.data);
        setShowEditModal(false);
        setActionLoading(false);
        return;
      }
    } catch (callErr) {
      console.warn("Callable respondListingConsent failed, trying HTTP:", callErr);
    }

    // 2. HTTP Fallback
    try {
      const resp = await fetch(
        "https://us-central1-yaal-nilam.cloudfunctions.net/claimListingHandler",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            token,
            action,
            notes,
            site_url: typeof window !== "undefined" ? window.location.origin : "https://yaalnilam.com",
          }),
        }
      );
      const result = await resp.json();
      setActionResult(result);
      setShowEditModal(false);
    } catch (err: any) {
      alert("செயல்பாட்டை முடிக்க முடியவில்லை: " + (err?.message || "Internal error"));
    } finally {
      setActionLoading(false);
    }
  }

  // Format price in Sri Lankan Lakhs or Crores
  function formatLkrPrice(price: number): string {
    if (!price || price <= 0) return "விலை விவரங்களுக்கு தொடர்பு கொள்ளவும்";
    if (price >= 10000000) {
      const crores = (price / 10000000).toFixed(2).replace(/\.00$/, "");
      return `LKR ${crores} கோடி (Rs ${price.toLocaleString()})`;
    }
    if (price >= 100000) {
      const lakhs = (price / 100000).toFixed(1).replace(/\.0$/, "");
      return `LKR ${lakhs} லட்சம் (Rs ${price.toLocaleString()})`;
    }
    return `LKR ${price.toLocaleString()}`;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-sand-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-sm border border-stone-200">
          <div className="w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-bold text-stone-900">விளம்பர விவரங்கள் ஏற்றப்படுகின்றன...</h2>
          <p className="text-sm text-stone-500 mt-1">Loading listing draft preview...</p>
        </div>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="min-h-screen bg-sand-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-lg w-full text-center shadow-sm border border-stone-200">
          <div className="w-14 h-14 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-stone-900">விளம்பரம் கிடைக்கவில்லை</h2>
          <p className="text-sm text-stone-600 mt-2">{error}</p>
          <div className="mt-6">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-teal-800 text-white font-medium hover:bg-teal-900 transition"
            >
              <Home className="w-4 h-4" />
              யாழ் நிலம் முதன்மைப் பக்கம் செல்ல
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Published / Success State
  if (actionResult?.status === "published" || actionResult?.live_url) {
    const liveUrl = actionResult.live_url || `https://yaalnilam.com/properties/${listing.id}/`;
    return (
      <div className="min-h-screen bg-sand-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 md:p-12 max-w-xl w-full text-center shadow-lg border border-teal-100">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-10 h-10 animate-bounce" />
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-stone-900">
            வாழ்த்துக்கள்! விளம்பரம் வெளியிடப்பட்டுள்ளது 🎉
          </h1>
          <p className="text-base text-stone-600 mt-3">
            உங்கள் ஒப்புதலுக்கு மிக்க நன்றி! இந்த சொத்து விளம்பரம் யாழ் நிலம் இணையதளத்தில் வெற்றிகரமாக நேரலையாக (LIVE) வெளியிடப்பட்டுள்ளது.
          </p>

          <div className="mt-6 p-4 rounded-2xl bg-teal-50 border border-teal-100 text-left">
            <p className="text-xs uppercase font-bold text-teal-800 tracking-wider">சொத்து விவரம்</p>
            <p className="text-base font-bold text-stone-900 mt-1">{listing.title_ta || listing.title}</p>
            <p className="text-sm text-stone-600 mt-0.5">{listing.area_name_ta || listing.area_name} • {formatLkrPrice(listing.price)}</p>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href={liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-teal-700 text-white font-bold hover:bg-teal-800 shadow-md transition"
            >
              <ExternalLink className="w-4 h-4" />
              நேரலை விளம்பரத்தை பார்க்க (View Live)
            </a>
            <a
              href={`https://wa.me/?text=${encodeURIComponent(
                `யாழ் நிலம் தளத்தில் எனது புதிய சொத்து விளம்பரம்: ${liveUrl}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp இல் பகிர
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Declined State
  if (actionResult?.status === "declined" || actionResult?.status === "rejected") {
    return (
      <div className="min-h-screen bg-sand-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-sm border border-stone-200">
          <div className="w-14 h-14 bg-stone-100 text-stone-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-stone-900">விளம்பரம் நிராகரிக்கப்பட்டது</h2>
          <p className="text-sm text-stone-600 mt-2">
            உங்கள் விருப்பத்திற்கேற்ப இந்த விளம்பரம் தளத்தில் வெளியிடப்படாது. நன்றி.
          </p>
        </div>
      </div>
    );
  }

  // Edit Requested State
  if (actionResult?.status === "edit_requested") {
    return (
      <div className="min-h-screen bg-sand-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-lg w-full text-center shadow-sm border border-stone-200">
          <div className="w-14 h-14 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-stone-900">திருத்தக் கோரிக்கை பதிவு செய்யப்பட்டது</h2>
          <p className="text-sm text-stone-600 mt-2">
            நீங்கள் குறிப்பிட்டுள்ள மாற்றங்களை எங்கள் குழுவினர் சரிபார்த்து விளம்பரத்தை புதுப்பிப்பர். நன்றி!
          </p>
          <div className="mt-6">
            <button
              onClick={() => setActionResult(null)}
              className="px-6 py-2.5 rounded-full border border-stone-300 text-stone-700 font-medium hover:bg-stone-50"
            >
              முன்னோட்டத்திற்கு திரும்ப
            </button>
          </div>
        </div>
      </div>
    );
  }

  const primaryImage =
    listing.media_urls && listing.media_urls.length > 0
      ? listing.media_urls[0]
      : "https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=1200&q=80";

  return (
    <div className="min-h-screen bg-sand-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header Outreach Banner */}
        <div className="bg-gradient-to-r from-teal-900 via-teal-800 to-emerald-900 text-white rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-700/80 text-teal-100 text-xs font-bold uppercase tracking-wider mb-3">
                <ShieldCheck className="w-4 h-4 text-emerald-300" />
                இலவச விளம்பர ஒப்புதல் (Free Listing Verification)
              </div>
              <h1 className="text-2xl md:text-3xl font-black">
                வணக்கம் {listing.agent_name || "நண்பரே"}!
              </h1>
              <p className="text-sm md:text-base text-teal-100 mt-2 max-w-2xl leading-relaxed">
                நீங்கள் பகிர்ந்த இந்த சொத்து விளம்பரத்தை யாழ் நிலம் (yaalnilam.com) இணையதளத்தில்{" "}
                <span className="font-bold text-amber-300 underline underline-offset-2">முற்றிலும் இலவசமாக (FREE)</span>{" "}
                பதிவேற்ற விரும்புகிறோம். இதன் மூலம் உள்ளூர் மற்றும் புலம்பெயர் வாங்குபவர்கள் உங்களை நேரடியாகத் தொடர்பு கொள்வார்கள்.
              </p>
            </div>

            <div className="flex-shrink-0 w-full md:w-auto">
              <button
                type="button"
                onClick={() => handleAction("approve")}
                disabled={actionLoading}
                className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-black text-base shadow-lg hover:shadow-emerald-500/25 transition transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
              >
                <CheckCircle className="w-5 h-5 text-stone-950" />
                {actionLoading ? "பதிவேற்றப்படுகிறது..." : "ஆம், இலவசமாக பதிவேற்றவும்"}
              </button>
            </div>
          </div>
        </div>

        {/* Listing Details Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-stone-200 overflow-hidden">
          {/* Image Banner */}
          <div className="relative h-72 md:h-96 w-full bg-stone-900">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={primaryImage}
              alt={listing.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 flex flex-wrap gap-2">
              <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider">
                {listing.property_type === "land"
                  ? "காணி (Land)"
                  : listing.property_type === "house"
                  ? "வீடு (House)"
                  : listing.property_type}
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-600/90 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider">
                {listing.intent === "rent" ? "வாடகைக்கு (Rent)" : "விற்பனைக்கு (For Sale)"}
              </span>
            </div>
            <div className="absolute bottom-4 right-4 px-4 py-2 rounded-2xl bg-black/75 backdrop-blur-md text-white text-right">
              <p className="text-xs text-stone-300">விலை (Expected Price)</p>
              <p className="text-lg md:text-xl font-black text-amber-400">
                {formatLkrPrice(listing.price)}
              </p>
            </div>
          </div>

          <div className="p-6 md:p-8 space-y-6">
            <div>
              <div className="flex items-center gap-2 text-sm text-teal-800 font-bold mb-2">
                <MapPin className="w-4 h-4" />
                <span>
                  {listing.area_name_ta || listing.area_name}
                  {listing.address ? `, ${listing.address}` : ""}
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-stone-900">
                {listing.title_ta || listing.title}
              </h2>
              {listing.title_ta && listing.title && listing.title_ta !== listing.title && (
                <p className="text-base text-stone-500 mt-1">{listing.title}</p>
              )}
            </div>

            {/* Spec Highlights Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-y border-stone-100">
              {listing.land_size_perches ? (
                <div className="p-3 rounded-2xl bg-sand-50 border border-stone-200/60">
                  <div className="flex items-center gap-1.5 text-xs text-stone-500 font-semibold mb-1">
                    <Layers className="w-4 h-4 text-teal-700" />
                    <span>காணி அளவு</span>
                  </div>
                  <p className="text-base font-bold text-stone-900">
                    {listing.land_size_perches} பேர்ச்
                  </p>
                  <p className="text-xs text-stone-500">
                    ({(listing.land_size_perches / 10).toFixed(1)} பரப்பு)
                  </p>
                </div>
              ) : null}

              {listing.bedrooms ? (
                <div className="p-3 rounded-2xl bg-sand-50 border border-stone-200/60">
                  <div className="flex items-center gap-1.5 text-xs text-stone-500 font-semibold mb-1">
                    <Bed className="w-4 h-4 text-teal-700" />
                    <span>படுக்கையறைகள்</span>
                  </div>
                  <p className="text-base font-bold text-stone-900">{listing.bedrooms} அறைகள்</p>
                </div>
              ) : null}

              {listing.bathrooms ? (
                <div className="p-3 rounded-2xl bg-sand-50 border border-stone-200/60">
                  <div className="flex items-center gap-1.5 text-xs text-stone-500 font-semibold mb-1">
                    <Bath className="w-4 h-4 text-teal-700" />
                    <span>குளியலறைகள்</span>
                  </div>
                  <p className="text-base font-bold text-stone-900">{listing.bathrooms}</p>
                </div>
              ) : null}

              <div className="p-3 rounded-2xl bg-sand-50 border border-stone-200/60">
                <div className="flex items-center gap-1.5 text-xs text-stone-500 font-semibold mb-1">
                  <ShieldCheck className="w-4 h-4 text-teal-700" />
                  <span>கட்டணம்</span>
                </div>
                <p className="text-base font-bold text-emerald-700">100% இலவசம்</p>
                <p className="text-xs text-stone-500">Free Listing</p>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-stone-500 mb-2">
                முழு விவரங்கள் (Description)
              </h3>
              <p className="text-base text-stone-700 leading-relaxed whitespace-pre-line">
                {listing.description_ta || listing.description}
              </p>
            </div>

            {/* Amenities */}
            {listing.amenities && listing.amenities.length > 0 && (
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-stone-500 mb-2">
                  சிறப்பம்சங்கள் (Features)
                </h3>
                <div className="flex flex-wrap gap-2">
                  {listing.amenities.map((item, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-full bg-teal-50 text-teal-900 text-xs font-semibold border border-teal-100"
                    >
                      ✓ {item}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Agent / Contact Card */}
            <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase font-bold text-stone-500">தொடர்பு கொள்ள வேண்டிய முகவர் / உரிமையாளர்</p>
                <p className="text-lg font-bold text-stone-900 mt-0.5">
                  {agent?.name || listing.agent_name || "Property Advisor"}
                </p>
                <p className="text-sm text-stone-600">
                  {agent?.company || listing.agent_company || "Independent Broker / Seller"} • {agent?.phone || listing.agent_phone}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`tel:${listing.agent_phone}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-stone-300 text-stone-800 text-sm font-semibold hover:bg-stone-100 shadow-sm"
                >
                  <Phone className="w-4 h-4 text-teal-700" />
                  அழைக்க
                </a>
                <a
                  href={`https://wa.me/${listing.agent_phone.replace(/[^\d]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 shadow-sm"
                >
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Actions Sticky Bar */}
        <div className="bg-white rounded-3xl p-6 shadow-md border border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <h4 className="text-base font-bold text-stone-900">
              இந்த விளம்பரம் சரியாக உள்ளதா?
            </h4>
            <p className="text-xs text-stone-500 mt-0.5">
              ஒப்புதல் அளித்தவுடன் உங்கள் விளம்பரம் உடனடியாக yaalnilam.com இல் நேரலையாகும்.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setShowEditModal(true)}
              disabled={actionLoading}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl border border-stone-300 text-stone-700 hover:bg-stone-50 font-bold text-sm transition"
            >
              <Edit3 className="w-4 h-4 text-stone-600" />
              விவரங்களை திருத்த (Edit)
            </button>

            <button
              type="button"
              onClick={() => handleAction("decline")}
              disabled={actionLoading}
              className="inline-flex items-center justify-center gap-1 px-4 py-3 rounded-2xl text-stone-500 hover:text-red-600 hover:bg-red-50 font-medium text-xs transition"
            >
              வேண்டாம் (Decline)
            </button>

            <button
              type="button"
              onClick={() => handleAction("approve")}
              disabled={actionLoading}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-sm shadow-md transition"
            >
              <CheckCircle className="w-4 h-4" />
              {actionLoading ? "செயல்படுகிறது..." : "ஆம், பதிவேற்றவும் (Publish)"}
            </button>
          </div>
        </div>
      </div>

      {/* Edit Request Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl space-y-4">
            <h3 className="text-xl font-bold text-stone-900">
              எந்த விவரங்களை திருத்த வேண்டும்?
            </h3>
            <p className="text-xs text-stone-600">
              விலை, பரப்பு அளவு, இருப்பிடம் அல்லது படங்கள் தொடர்பான திருத்தங்களை கீழே குறிப்பிடவும்:
            </p>

            <textarea
              rows={4}
              value={editNotes}
              onChange={(e) => setEditNotes(e.target.value)}
              placeholder="எ.கா: விலை 1.5 கோடிக்கு மாற்றப்பட வேண்டும், பரப்பு 12 பேர்ச்..."
              className="w-full rounded-2xl border border-stone-300 p-4 text-sm focus:border-teal-600 focus:outline-none"
            />

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="px-5 py-2.5 rounded-xl text-stone-600 text-sm font-semibold hover:bg-stone-100"
              >
                ரத்து (Cancel)
              </button>
              <button
                type="button"
                onClick={() => handleAction("edit", editNotes)}
                disabled={actionLoading || !editNotes.trim()}
                className="px-6 py-2.5 rounded-xl bg-teal-800 text-white text-sm font-bold hover:bg-teal-900 disabled:opacity-50"
              >
                {actionLoading ? "அனுப்பப்படுகிறது..." : "அனுப்புக (Submit Edit Request)"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
