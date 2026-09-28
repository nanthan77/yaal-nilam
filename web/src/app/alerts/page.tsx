"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { ALL_LOCATIONS } from "@/lib/locations";
import {
  cancelPropertyAlert,
  listPropertyAlertReceipts,
  registerPropertyAlert,
  type PropertyAlertReceipt,
} from "@/lib/property-alerts";

const TYPE_OPTIONS: { value: string; en: string; ta: string }[] = [
  { value: "any", en: "Any type", ta: "எந்த வகையும்" },
  { value: "house", en: "House", ta: "வீடு" },
  { value: "land", en: "Land", ta: "காணி" },
  { value: "apartment", en: "Apartment", ta: "அடுக்குமாடி" },
  { value: "commercial", en: "Commercial", ta: "வணிக" },
];

export default function PropertyAlertsPage() {
  const { locale } = useStore();
  const ta = locale === "ta";

  const [purpose, setPurpose] = useState<"buy" | "rent">("buy");
  const [propertyType, setPropertyType] = useState("any");
  const [area, setArea] = useState("any");
  const [minBedrooms, setMinBedrooms] = useState("0");
  const [maxPrice, setMaxPrice] = useState("");
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState("");
  const [receipts, setReceipts] = useState<PropertyAlertReceipt[]>([]);
  const [cancellingId, setCancellingId] = useState("");
  const [manageError, setManageError] = useState("");

  useEffect(() => {
    setReceipts(listPropertyAlertReceipts());
  }, []);

  const L = {
    kicker: ta ? "சொத்து எச்சரிக்கைகள்" : "Property alerts",
    title: ta ? "புதிய சொத்து வந்ததும் WhatsApp அறிவிப்பு பெறுங்கள்" : "Get a WhatsApp alert when your match is listed",
    subtitle: ta
      ? "நீங்கள் தேடுவதைப் பதிவு செய்யுங்கள். பொருந்தும் புதிய சொத்து வெளியிடப்பட்டதும் WhatsApp அறிவிப்பை அனுப்ப முயற்சிப்போம்."
      : "Tell us what you're looking for. When a matching property is published, we'll attempt to send you a WhatsApp alert.",
    purpose: ta ? "நோக்கம்" : "I want to",
    buy: ta ? "வாங்க" : "Buy",
    rent: ta ? "வாடகை" : "Rent",
    type: ta ? "சொத்து வகை" : "Property type",
    area: ta ? "பகுதி" : "Area",
    anyArea: ta ? "எந்தப் பகுதியும்" : "Any area",
    beds: ta ? "குறைந்தபட்ச படுக்கையறைகள்" : "Min bedrooms",
    bedsAny: ta ? "ஏதேனும்" : "Any",
    budget: ta ? "அதிகபட்ச பட்ஜெட் (Rs)" : "Max budget (Rs)",
    budgetPh: ta ? "எ.கா. 25000000" : "e.g. 25000000",
    name: ta ? "உங்கள் பெயர் (விருப்பம்)" : "Your name (optional)",
    wa: ta ? "WhatsApp எண்" : "WhatsApp number",
    waPh: "+94 7X XXX XXXX",
    emailL: ta ? "மின்னஞ்சல் (விருப்பம்)" : "Email (optional)",
    consent: ta
      ? "பொருந்தும் சொத்துகள் குறித்து WhatsApp மூலம் என்னைத் தொடர்பு கொள்ள யாழ் நிலத்திற்கு அனுமதிக்கிறேன்."
      : "I agree that Yaal Nilam may contact me on WhatsApp about matching properties.",
    submit: ta ? "எச்சரிக்கையை அமைக்கவும்" : "Set my alert",
    submitting: ta ? "சேமிக்கிறது…" : "Saving…",
    errWa: ta ? "சரியான WhatsApp எண்ணை உள்ளிடவும்." : "Please enter a valid WhatsApp number.",
    errConsent: ta ? "தொடர அனுமதி தேவை." : "Please tick the consent box to continue.",
    errGeneric: ta ? "சேமிக்க முடியவில்லை. மீண்டும் முயற்சிக்கவும்." : "Couldn't save. Please try again.",
    doneTitle: ta ? "✅ எச்சரிக்கை அமைக்கப்பட்டது!" : "✅ You're all set!",
    doneBody: ta
      ? "உங்கள் பதிவு சேமிக்கப்பட்டது. இந்த browser-ல் கீழே உள்ள பகுதியில் எச்சரிக்கையை நிர்வகிக்கலாம்."
      : "Your registration is saved. You can manage this alert below on this browser.",
    doneAnother: ta ? "மற்றொரு எச்சரிக்கையை அமைக்கவும்" : "Set another alert",
    browse: ta ? "சொத்துகளைப் பார்க்கவும்" : "Browse properties",
    privacy: ta
      ? "உங்கள் எண்ணை இந்த எச்சரிக்கைகளுக்காக பயன்படுத்துகிறோம். இந்த browser-ல் சேமிக்கப்பட்ட receipt மூலம் கீழே ரத்து செய்யலாம்."
      : "We use your number for these alerts. You can cancel below using the private receipt stored in this browser.",
    manageTitle: ta ? "இந்த browser-ல் உள்ள எச்சரிக்கைகள்" : "Alerts on this browser",
    manageBody: ta
      ? "Receipt அழிந்தால் அல்லது வேறு சாதனத்தைப் பயன்படுத்தினால், எங்கள் support அணியைத் தொடர்பு கொள்ளுங்கள்."
      : "If the receipt is cleared or you switch devices, contact our support team for help.",
    cancel: ta ? "எச்சரிக்கையை ரத்து செய்" : "Cancel alert",
    cancelling: ta ? "ரத்து செய்கிறது…" : "Cancelling…",
    cancelConfirm: ta
      ? "இந்த சொத்து எச்சரிக்கையை ரத்து செய்யவா?"
      : "Cancel this property alert?",
    cancelError: ta
      ? "எச்சரிக்கையை ரத்து செய்ய முடியவில்லை. மீண்டும் முயற்சிக்கவும் அல்லது support அணியைத் தொடர்பு கொள்ளுங்கள்."
      : "We couldn't cancel this alert. Try again or contact support.",
    contact: ta ? "Support-ஐ தொடர்பு கொள்ளுங்கள்" : "Contact support",
    anyType: ta ? "எந்த வகையும்" : "Any type",
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    const digits = whatsapp.replace(/[^0-9]/g, "");
    if (digits.length < 8 || digits.length > 15) {
      setErr(L.errWa);
      return;
    }
    if (!consent) {
      setErr(L.errConsent);
      return;
    }
    setSubmitting(true);
    try {
      const receipt = await registerPropertyAlert({
        label: name.trim() || (ta ? "சொத்து எச்சரிக்கை" : "Property alert"),
        receiptLabel: ta ? "சொத்து எச்சரிக்கை" : "Property alert",
        phone: whatsapp,
        email: email.trim() || undefined,
        purpose: purpose === "buy" ? "sale" : "rent",
        propertyType,
        areas: area === "any" ? [] : [area],
        minBedrooms: Number(minBedrooms) || 0,
        maxPrice: Number(maxPrice) || 0,
        locale,
      });
      setReceipts((current) => [
        receipt,
        ...current.filter((item) => item.registrationId !== receipt.registrationId),
      ]);
      void import("@/lib/firestore")
        .then(({ trackAnalyticsEvent }) =>
          trackAnalyticsEvent("create_property_alert", {
            registration_id: receipt.registrationId,
            source: "property_alerts_form",
            purpose,
            property_type: propertyType,
            area,
          }),
        )
        .catch(() => undefined);
      setDone(true);
    } catch (error) {
      console.error("[property-alerts] Registration failed:", error);
      setErr(L.errGeneric);
    } finally {
      setSubmitting(false);
    }
  }

  async function onCancel(receipt: PropertyAlertReceipt) {
    if (!window.confirm(L.cancelConfirm)) return;
    setManageError("");
    setCancellingId(receipt.registrationId);
    try {
      await cancelPropertyAlert(receipt);
      setReceipts((current) =>
        current.filter((item) => item.registrationId !== receipt.registrationId),
      );
      void import("@/lib/firestore")
        .then(({ trackAnalyticsEvent }) =>
          trackAnalyticsEvent("cancel_property_alert", {
            registration_id: receipt.registrationId,
            source: "property_alerts_form",
          }),
        )
        .catch(() => undefined);
    } catch (error) {
      console.error("[property-alerts] Cancellation failed:", error);
      setManageError(L.cancelError);
    } finally {
      setCancellingId("");
    }
  }

  function receiptSummary(receipt: PropertyAlertReceipt): string {
    const type = TYPE_OPTIONS.find((option) => option.value === receipt.propertyType);
    const location = ALL_LOCATIONS.find((item) => item.slug === receipt.area);
    const purposeLabel = receipt.purpose === "sale" ? L.buy : L.rent;
    const typeLabel = type ? (ta ? type.ta : type.en) : L.anyType;
    const areaLabel = location ? (ta ? location.name_ta : location.name) : L.anyArea;
    return `${purposeLabel} · ${typeLabel} · ${areaLabel}`;
  }

  return (
    <div className="min-h-screen bg-sand-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#0F2E25] to-[#1B4D3E] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <p className="text-[#D4A853] font-bold text-sm uppercase tracking-wider mb-3">{L.kicker}</p>
          <h1 className="text-3xl md:text-4xl font-black leading-tight max-w-2xl">{L.title}</h1>
          <p className="text-white/75 mt-4 max-w-2xl text-lg">{L.subtitle}</p>
        </div>
      </section>

      <section className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h2 className="sr-only">{ta ? "சொத்து எச்சரிக்கை படிவம்" : "Property Alert Registration Form"}</h2>
        {done ? (
          <div className="rounded-2xl border border-sand-200 bg-white p-8 text-center">
            <h2 className="text-2xl font-bold text-teal-900">{L.doneTitle}</h2>
            <p className="text-charcoal-600 mt-3 leading-relaxed">{L.doneBody}</p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <button
                onClick={() => {
                  setDone(false);
                  setMaxPrice("");
                  setName("");
                  setWhatsapp("");
                  setEmail("");
                  setConsent(false);
                }}
                className="bg-[#D4A853] hover:bg-[#c79a45] text-[#0F2E25] font-bold py-3 px-6 rounded-xl transition-colors"
              >
                {L.doneAnother}
              </button>
              <Link
                href="/buy"
                className="bg-sand-100 hover:bg-sand-200 text-charcoal-800 font-bold py-3 px-6 rounded-xl transition-colors"
              >
                {L.browse}
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="rounded-2xl border border-sand-200 bg-white p-6 sm:p-8 space-y-5">
            {/* Buy / Rent */}
            <div>
              <label className="block text-sm font-semibold text-charcoal-700 mb-2">{L.purpose}</label>
              <div className="grid grid-cols-2 gap-3">
                {(["buy", "rent"] as const).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPurpose(p)}
                    aria-pressed={purpose === p}
                    className={`py-2.5 rounded-xl font-bold border transition-colors ${
                      purpose === p
                        ? "bg-teal-900 text-white border-teal-900"
                        : "bg-white text-charcoal-700 border-sand-300 hover:border-teal-700"
                    }`}
                  >
                    {p === "buy" ? L.buy : L.rent}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="alert-propertyType" className="block text-sm font-semibold text-charcoal-700 mb-2">{L.type}</label>
                <select
                  id="alert-propertyType"
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className="w-full px-3 py-2.5 border border-sand-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                >
                  {TYPE_OPTIONS.map((t) => (
                    <option key={t.value} value={t.value}>
                      {ta ? t.ta : t.en}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="alert-area" className="block text-sm font-semibold text-charcoal-700 mb-2">{L.area}</label>
                <select
                  id="alert-area"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className="w-full px-3 py-2.5 border border-sand-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                >
                  <option value="any">{L.anyArea}</option>
                  {ALL_LOCATIONS.map((loc) => (
                    <option key={loc.slug} value={loc.slug}>
                      {ta ? loc.name_ta : loc.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="alert-minBedrooms" className="block text-sm font-semibold text-charcoal-700 mb-2">{L.beds}</label>
                <select
                  id="alert-minBedrooms"
                  value={minBedrooms}
                  onChange={(e) => setMinBedrooms(e.target.value)}
                  className="w-full px-3 py-2.5 border border-sand-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                >
                  <option value="0">{L.bedsAny}</option>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>
                      {n}+
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="alert-maxPrice" className="block text-sm font-semibold text-charcoal-700 mb-2">{L.budget}</label>
                <input
                  type="number"
                  inputMode="numeric"
                  min={0}
                  max={100000000000000}
                  id="alert-maxPrice"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  placeholder={L.budgetPh}
                  className="w-full px-3 py-2.5 border border-sand-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            <div className="border-t border-sand-200 pt-5 space-y-5">
              <div>
                <label htmlFor="alert-name" className="block text-sm font-semibold text-charcoal-700 mb-2">{L.name}</label>
                <input
                  type="text"
                  maxLength={200}
                  id="alert-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2.5 border border-sand-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="alert-whatsapp" className="block text-sm font-semibold text-charcoal-700 mb-2">
                    {L.wa} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    maxLength={40}
                    id="alert-whatsapp"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder={L.waPh}
                    className="w-full px-3 py-2.5 border border-sand-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label htmlFor="alert-email" className="block text-sm font-semibold text-charcoal-700 mb-2">{L.emailL}</label>
                  <input
                    type="email"
                    maxLength={254}
                    id="alert-email"
                  value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2.5 border border-sand-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <label className="flex items-start gap-3 text-sm text-charcoal-600">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-sand-300 text-teal-700 focus:ring-teal-500"
                />
                <span>{L.consent}</span>
              </label>
            </div>

            {err && <p role="alert" className="text-sm font-semibold text-red-600">{err}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-[#D4A853] hover:bg-[#c79a45] text-[#0F2E25] font-bold py-3.5 rounded-xl transition-colors disabled:opacity-60"
            >
              {submitting ? L.submitting : L.submit}
            </button>
            <p className="text-xs text-charcoal-400 text-center">{L.privacy}</p>
          </form>
        )}

        {receipts.length > 0 && (
          <section className="mt-8 rounded-2xl border border-sand-200 bg-white p-6 sm:p-8">
            <h2 className="text-xl font-bold text-teal-900">{L.manageTitle}</h2>
            <p className="mt-2 text-sm leading-relaxed text-charcoal-600">{L.manageBody}</p>
            <div className="mt-5 space-y-3">
              {receipts.map((receipt) => (
                <div
                  key={receipt.registrationId}
                  className="flex flex-col gap-3 rounded-xl border border-sand-200 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-semibold text-charcoal-800">{receipt.label}</p>
                    <p className="mt-1 text-sm text-charcoal-500">{receiptSummary(receipt)}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => void onCancel(receipt)}
                    disabled={cancellingId === receipt.registrationId}
                    className="rounded-xl border border-red-200 px-4 py-2 text-sm font-bold text-red-700 transition-colors hover:bg-red-50 disabled:opacity-60"
                  >
                    {cancellingId === receipt.registrationId ? L.cancelling : L.cancel}
                  </button>
                </div>
              ))}
            </div>
            {manageError && <p role="alert" className="mt-4 text-sm font-semibold text-red-600">{manageError}</p>}
            <Link href="/contact" className="mt-4 inline-block text-sm font-semibold text-teal-700 underline">
              {L.contact}
            </Link>
          </section>
        )}
      </section>
    </div>
  );
}
