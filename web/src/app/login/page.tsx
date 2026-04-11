"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { localize, t } from "@/lib/translations";

export default function LoginPage() {
  const router = useRouter();
  const { locale, setUser } = useStore();
  const copy = localize(locale, {
    en: {
      intro: "Sign in to your Yaal Nilam account",
      phone: "Phone Number",
      password: "Password",
      submitError: "Please enter your phone number and password.",
      noAccount: "Don't have an account?",
    },
    ta: {
      intro: "உங்கள் யாழ் நிலம் கணக்கில் உள்நுழையுங்கள்",
      phone: "தொலைபேசி எண்",
      password: "கடவுச்சொல்",
      submitError: "தயவுசெய்து உங்கள் தொலைபேசி எண்ணையும் கடவுச்சொல்லையும் உள்ளிடுங்கள்.",
      noAccount: "இன்னும் கணக்கு இல்லையா?",
    },
  });
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
      setError(copy.submitError);
    }
    setLoading(false);
  };

  return (
    <>
      <div className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <span className="text-4xl">🏠</span>
            <h1 className="text-2xl font-bold mt-2">{t("nav.login", locale)}</h1>
            <p className="text-gray-600 text-sm mt-1">{copy.intro}</p>
          </div>

          <form onSubmit={handleSubmit} className="card p-8 space-y-5">
            {error && (
              <div className="bg-red-50 text-red-700 text-sm p-3 rounded-lg">{error}</div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{copy.phone}</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+94 77 786 3333"
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{copy.password}</label>
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
              {copy.noAccount}{" "}
              <Link href="/register" className="text-primary-600 font-medium hover:underline">
                {t("nav.register", locale)}
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
}
