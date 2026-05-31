"use client";

import { useState } from "react";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { createPropertyAlert } from "@/lib/firestore";
import { ALL_LOCATIONS } from "@/lib/locations";

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

  const L = {
    kicker: ta ? "சொத்து எச்சரிக்கைகள்" : "Property alerts",
    title: ta ? "புதிய சொத்து வந்ததும் WhatsApp அறிவிப்பு பெறுங்கள்" : "Get a WhatsApp alert when your match is listed",
    subtitle: ta
      ? "நீங்கள் தேடுவதைப் பதிவு செய்யுங்கள் — பொருந்தும் புதிய சொத்து வெளியிடப்பட்டதும், உடனே WhatsApp மூலம் தெரிவிப்போம். இலவசம்."
      : "Tell us what you're looking for. The moment a matching property is published, we'll message you on WhatsApp. Free.",
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
      ? "பொருந்தும் புதிய சொத்து வெளியிடப்பட்டதும், உங்கள் WhatsApp-க்கு அறிவிப்பு வரும்."
      : "When a new property matches what you want, we'll send it straight to your WhatsApp.",
    doneAnother: ta ? "மற்றொரு எச்சரிக்கையை அமைக்கவும்" : "Set another alert",
    browse: ta ? "சொத்துகளைப் பார்க்கவும்" : "Browse properties",
    privacy: ta
      ? "உங்கள் எண்ணை எச்சரிக்கைகளுக்கு மட்டுமே பயன்படுத்துகிறோம். எப்போது வேண்டுமானாலும் நிறுத்தலாம்."
      : "We only use your number for these alerts. You can stop anytime by replying STOP.",
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    const digits = whatsapp.replace(/[^0-9]/g, "");
    if (digits.length < 7) {
      setErr(L.errWa);
      return;
    }
    if (!consent) {
      setErr(L.errConsent);
      return;
    }
    setSubmitting(true);
    const id = await createPropertyAlert({
      name,
      whatsapp: digits,
      email,
      purpose,
      propertyType,
      area,
      minBedrooms,
      maxPrice,
      locale,
    });
    setSubmitting(false);
    if (id) setDone(true);
    else setErr(L.errGeneric);
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
                <label className="block text-sm font-semibold text-charcoal-700 mb-2">{L.type}</label>
                <select
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
                <label className="block text-sm font-semibold text-charcoal-700 mb-2">{L.area}</label>
                <select
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
                <label className="block text-sm font-semibold text-charcoal-700 mb-2">{L.beds}</label>
                <select
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
                <label className="block text-sm font-semibold text-charcoal-700 mb-2">{L.budget}</label>
                <input
                  type="number"
                  inputMode="numeric"
                  min={0}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  placeholder={L.budgetPh}
                  className="w-full px-3 py-2.5 border border-sand-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            <div className="border-t border-sand-200 pt-5 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-charcoal-700 mb-2">{L.name}</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2.5 border border-sand-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-charcoal-700 mb-2">
                    {L.wa} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder={L.waPh}
                    className="w-full px-3 py-2.5 border border-sand-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-charcoal-700 mb-2">{L.emailL}</label>
                  <input
                    type="email"
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

            {err && <p className="text-sm font-semibold text-red-600">{err}</p>}

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
      </section>
    </div>
  );
}
