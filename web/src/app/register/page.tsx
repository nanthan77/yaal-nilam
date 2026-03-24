"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { useStore } from "@/lib/store";
import { t } from "@/lib/translations";

export default function RegisterPage() {
  const router = useRouter();
  const { locale, setUser } = useStore();
  const [form, setForm] = useState({ name: "", phone: "", email: "", password: "", user_type: "buyer" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (form.name && form.phone && form.password) {
      setUser({ id: "1", name: form.name, phone: form.phone, user_type: form.user_type as any });
      router.push("/dashboard");
    } else {
      setError("Please fill in all required fields");
    }
    setLoading(false);
  };

  return (
    <>
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <span className="text-4xl">🏠</span>
            <h1 className="text-2xl font-bold mt-2">{t("nav.register", locale)}</h1>
            <p className="text-gray-600 text-sm mt-1">Create your Yaal Nilam account</p>
          </div>

          <form onSubmit={handleSubmit} className="card p-8 space-y-5">
            {error && <div className="bg-red-50 text-red-700 text-sm p-3 rounded-lg">{error}</div>}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
              <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+94 77 123 4567" className="input-field" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email (optional)</label>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">I am a...</label>
              <select value={form.user_type} onChange={(e) => setForm({ ...form, user_type: e.target.value })} className="input-field">
                <option value="buyer">Buyer / Tenant</option>
                <option value="seller">Seller / Owner</option>
                <option value="agent">Property Agent</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
              <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="input-field" required />
            </div>
            <button type="submit" disabled={loading} className="w-full btn-primary">
              {loading ? t("common.loading", locale) : "Create Account"}
            </button>
            <p className="text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link href="/login" className="text-primary-600 font-medium hover:underline">{t("nav.login", locale)}</Link>
            </p>
          </form>
        </div>
      </main>
    </>
  );
}
