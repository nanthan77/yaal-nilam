"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { useStore } from "@/lib/store";
import { t } from "@/lib/translations";

export default function LoginPage() {
  const router = useRouter();
  const { locale, setUser } = useStore();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Mock login for development
    if (phone && password) {
      setUser({ id: "1", name: "Nanthan", phone, user_type: "buyer" });
      router.push("/dashboard");
    } else {
      setError("Please enter phone and password");
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
            <h1 className="text-2xl font-bold mt-2">{t("nav.login", locale)}</h1>
            <p className="text-gray-600 text-sm mt-1">Sign in to your Yaal Nilam account</p>
          </div>

          <form onSubmit={handleSubmit} className="card p-8 space-y-5">
            {error && (
              <div className="bg-red-50 text-red-700 text-sm p-3 rounded-lg">{error}</div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+94 77 123 4567"
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                required
              />
            </div>
            <button type="submit" disabled={loading} className="w-full btn-primary">
              {loading ? t("common.loading", locale) : t("nav.login", locale)}
            </button>
            <p className="text-center text-sm text-gray-600">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-primary-600 font-medium hover:underline">
                {t("nav.register", locale)}
              </Link>
            </p>
          </form>
        </div>
      </main>
    </>
  );
}
