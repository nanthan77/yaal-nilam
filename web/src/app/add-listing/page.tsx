"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useStore } from "@/lib/store";
import { t } from "@/lib/translations";

const JAFFNA_AREAS = [
  "Nallur", "Kopay", "Chunnakam", "Thirunelvely", "Kokuvil", "Kondavil",
  "Manipay", "Point Pedro", "Chavakachcheri", "Tellippalai", "Karainagar",
  "Kayts", "Sandilipay", "Chankanai", "Kodikamam", "Jaffna Town",
  "Gurunagar", "Passaiyoor", "Vannarpannai", "Urumpirai", "Erlalai",
  "Kaithady", "Ilavalai", "Valvettithurai",
];

export default function AddListingPage() {
  const router = useRouter();
  const { locale } = useStore();
  const [form, setForm] = useState({
    intent: "sell",
    property_type: "house",
    location: "",
    price: "",
    bedrooms: "",
    bathrooms: "",
    land_size_perches: "",
    sqft: "",
    description: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Mock save — in production, POST to /api/properties
    setSubmitted(true);
  };

  const update = (key: string, value: string) => setForm({ ...form, [key]: value });

  if (submitted) {
    return (
      <>
        <Navbar />
        <main className="flex-1 flex items-center justify-center py-20">
          <div className="text-center">
            <span className="text-6xl block mb-4">🎉</span>
            <h1 className="text-2xl font-bold mb-2">Property Listed Successfully!</h1>
            <p className="text-charcoal-600 mb-6">Your listing is now live on Yaal Nilam. Our AI matching engine will notify potential buyers.</p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => router.push("/dashboard")} className="btn-primary">Go to Dashboard</button>
              <button onClick={() => { setSubmitted(false); setForm({ intent: "sell", property_type: "house", location: "", price: "", bedrooms: "", bathrooms: "", land_size_perches: "", sqft: "", description: "" }); }} className="btn-secondary">List Another</button>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="container-wide py-8 flex-1">
        <h1 className="section-heading mb-2">{t("nav.addListing", locale)}</h1>
        <p className="section-subheading mb-8">Fill in the details below to list your property on Yaal Nilam</p>

        <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
          {/* Intent */}
          <div className="grid grid-cols-2 gap-4">
            {["sell", "rent_out"].map((intent) => (
              <button
                key={intent}
                type="button"
                onClick={() => update("intent", intent)}
                className={`p-4 rounded-xl border-2 text-center font-semibold transition-colors ${
                  form.intent === intent ? "border-teal-600 bg-teal-50 text-teal-700" : "border-sand-200 hover:border-sand-300"
                }`}
              >
                {intent === "sell" ? "🏷️ Sell" : "🔑 Rent Out"}
              </button>
            ))}
          </div>

          {/* Property Type */}
          <div>
            <label className="block text-sm font-medium text-charcoal-700 mb-2">Property Type</label>
            <div className="flex flex-wrap gap-2">
              {["house", "land", "apartment", "commercial", "villa"].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => update("property_type", type)}
                  className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                    form.property_type === type ? "bg-teal-600 text-white border-teal-600" : "border-sand-300 hover:border-teal-400"
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-charcoal-700 mb-1">Location *</label>
            <select value={form.location} onChange={(e) => update("location", e.target.value)} className="input-field" required>
              <option value="">Select area...</option>
              {JAFFNA_AREAS.map((area) => (
                <option key={area} value={area}>{area}</option>
              ))}
            </select>
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-charcoal-700 mb-1">
              {form.intent === "sell" ? "Asking Price (LKR) *" : "Monthly Rent (LKR) *"}
            </label>
            <input type="number" value={form.price} onChange={(e) => update("price", e.target.value)} placeholder="e.g., 45000000" className="input-field" required />
          </div>

          {/* Rooms */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-charcoal-700 mb-1">Bedrooms</label>
              <input type="number" value={form.bedrooms} onChange={(e) => update("bedrooms", e.target.value)} className="input-field" min="0" />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal-700 mb-1">Bathrooms</label>
              <input type="number" value={form.bathrooms} onChange={(e) => update("bathrooms", e.target.value)} className="input-field" min="0" />
            </div>
          </div>

          {/* Land + Sqft */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-charcoal-700 mb-1">Land Size (Perches)</label>
              <input type="number" value={form.land_size_perches} onChange={(e) => update("land_size_perches", e.target.value)} className="input-field" min="0" />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal-700 mb-1">Built-up Area (sq ft)</label>
              <input type="number" value={form.sqft} onChange={(e) => update("sqft", e.target.value)} className="input-field" min="0" />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-charcoal-700 mb-1">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              rows={4}
              className="input-field"
              placeholder="Describe your property features, location highlights, etc."
            />
          </div>

          <button type="submit" className="btn-primary w-full text-lg">
            List Property on Yaal Nilam
          </button>
        </form>
      </main>
      <Footer />
    </>
  );
}
