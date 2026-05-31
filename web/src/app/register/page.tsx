"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { localize, t } from "@/lib/translations";

export default function RegisterPage() {
  const router = useRouter();
  const { locale, setUser } = useStore();
  const copy = localize(locale, {
    en: {
      intro: "Create your Yaal Nilam account",
      requiredError: "Please fill in all required fields.",
      fullName: "Full Name *",
      phone: "Phone Number *",
      email: "Email (optional)",
      role: "I am a...",
      password: "Password *",
      buyer: "Buyer / Tenant",
      seller: "Seller / Owner",
      agent: "Property Agent",
      submit: "Create Account",
      alreadyHave: "Already have an account?",
    },
    ta: {
      intro: "உங்கள் யாழ் நிலம் கணக்கை உருவாக்குங்கள்",
      requiredError: "தேவையான புலங்களை அனைத்தும் நிரப்புங்கள்.",
      fullName: "முழுப் பெயர் *",
      phone: "தொலைபேசி எண் *",
      email: "மின்னஞ்சல் (விருப்பம்)",
      role: "நான் யார்?",
      password: "கடவுச்சொல் *",
      buyer: "வாங்குபவர் / வாடகையாளர்",
      seller: "விற்பனையாளர் / உரிமையாளர்",
      agent: "சொத்து முகவர்",
      submit: "கணக்கை உருவாக்கவும்",
      alreadyHave: "ஏற்கனவே கணக்கு உள்ளதா?",
    },
  });
  const [form, setForm] = useState({ name: "", phone: "", email: "", password: "", user_type: "buyer" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (form.name && form.phone && form.password) {
      setUser({ id: "1", name: form.name, phone: form.phone, user_type: form.user_type as any });
      // Agents/sellers land on the how-to-use guide; buyers go to listings.
      const dest = form.user_type === "agent" || form.user_type === "seller" ? "/for-agents" : "/properties";
      router.push(dest);
    } else {
      setError(copy.requiredError);
    }
    setLoading(false);
  };

  return (
    <>
      <div className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <span className="text-4xl">🏠</span>
            <h1 className="text-2xl font-bold mt-2">{t("nav.register", locale)}</h1>
            <p className="text-gray-600 text-sm mt-1">{copy.intro}</p>
          </div>

          <form onSubmit={handleSubmit} className="card p-8 space-y-5">
            {error && <div className="bg-red-50 text-red-700 text-sm p-3 rounded-lg">{error}</div>}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{copy.fullName}</label>
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{copy.phone}</label>
              <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+94 70 484 6555" className="input-field" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{copy.email}</label>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{copy.role}</label>
              <select value={form.user_type} onChange={(e) => setForm({ ...form, user_type: e.target.value })} className="input-field">
                <option value="buyer">{copy.buyer}</option>
                <option value="seller">{copy.seller}</option>
                <option value="agent">{copy.agent}</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{copy.password}</label>
              <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="input-field" required />
            </div>
            <button type="submit" disabled={loading} className="w-full btn-primary">
              {loading ? t("common.loading", locale) : copy.submit}
            </button>
            <p className="text-center text-sm text-gray-600">
              {copy.alreadyHave}{" "}
              <Link href="/login" className="text-primary-600 font-medium hover:underline">{t("nav.login", locale)}</Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
}
