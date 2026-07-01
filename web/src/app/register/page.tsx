"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { register as registerUser, signInWithGoogle } from "@/lib/api";
import { useStore } from "@/lib/store";
import { localize, t } from "@/lib/translations";

function mapAuthError(code: string, locale: string): string {
  const messages: Record<string, { en: string; ta: string }> = {
    "auth/email-already-in-use":     { en: "An account with this email already exists.", ta: "இந்த மின்னஞ்சலில் ஏற்கனவே கணக்கு உள்ளது." },
    "auth/invalid-email":            { en: "Please enter a valid email address.", ta: "சரியான மின்னஞ்சல் முகவரியை உள்ளிடுங்கள்." },
    "auth/weak-password":            { en: "Password must be at least 6 characters.", ta: "கடவுச்சொல் குறைந்தது 6 எழுத்துகள் இருக்க வேண்டும்." },
    "auth/operation-not-allowed":    { en: "Registration is temporarily unavailable.", ta: "பதிவு தற்காலிகமாக கிடைக்கவில்லை." },
    "auth/invalid-credential":        { en: "This email already exists. Try logging in, or use Google if that is how you created it.", ta: "இந்த மின்னஞ்சல் ஏற்கனவே உள்ளது. Login செய்யவும், அல்லது Google மூலம் உருவாக்கியிருந்தால் Google பயன்படுத்தவும்." },
    "auth/popup-closed-by-user":      { en: "Google sign-in was closed before it finished.", ta: "Google உள்நுழைவு முடிவதற்கு முன் மூடப்பட்டது." },
    "auth/popup-blocked":             { en: "Your browser blocked the Google sign-in popup. Please allow popups for this site.", ta: "Google உள்நுழைவு popup-ஐ browser தடுத்தது. இந்த site-க்கு popups அனுமதிக்கவும்." },
    "auth/account-exists-with-different-credential": { en: "This email already uses a different sign-in method. Try email/password.", ta: "இந்த மின்னஞ்சல் வேறு sign-in முறையில் உள்ளது. Email/password முயற்சிக்கவும்." },
    "permission-denied":              { en: "Your account was created, but profile sync is delayed. Please sign in and continue; admin can complete the profile if needed.", ta: "உங்கள் கணக்கு உருவாக்கப்பட்டது, ஆனால் profile sync தாமதமாகிறது. Login செய்து தொடருங்கள்; தேவையெனில் admin profile-ஐ முடிக்கலாம்." },
  };
  const entry = messages[code];
  if (!entry) return locale === "ta" ? "பதிவு தோல்வியடைந்தது. மீண்டும் முயற்சிக்கவும்." : "Registration failed. Please try again.";
  return locale === "ta" ? entry.ta : entry.en;
}

export default function RegisterPage() {
  const router = useRouter();
  const { locale, setUser } = useStore();
  const copy = localize(locale, {
    en: {
      intro: "Create your Yaal Nilam account",
      requiredError: "Please fill in all required fields.",
      fullName: "Full Name *",
      email: "Email Address *",
      phone: "Phone Number (optional)",
      role: "I am a...",
      password: "Password *",
      buyer: "Buyer / Tenant",
      seller: "Seller / Owner",
      agent: "Property Agent",
      submit: "Create Account",
      alreadyHave: "Already have an account?",
      google: "Continue with Google",
      divider: "or create with email",
      googleHint: "Select your role first, then continue with Google.",
    },
    ta: {
      intro: "உங்கள் யாழ் நிலம் கணக்கை உருவாக்குங்கள்",
      requiredError: "தேவையான புலங்களை அனைத்தும் நிரப்புங்கள்.",
      fullName: "முழுப் பெயர் *",
      email: "மின்னஞ்சல் முகவரி *",
      phone: "தொலைபேசி எண் (விருப்பம்)",
      role: "நான் யார்?",
      password: "கடவுச்சொல் *",
      buyer: "வாங்குபவர் / வாடகையாளர்",
      seller: "விற்பனையாளர் / உரிமையாளர்",
      agent: "சொத்து முகவர்",
      submit: "கணக்கை உருவாக்கவும்",
      alreadyHave: "ஏற்கனவே கணக்கு உள்ளதா?",
      google: "Google மூலம் தொடரவும்",
      divider: "அல்லது email மூலம் உருவாக்கவும்",
      googleHint: "முதலில் உங்கள் role தேர்வு செய்து, பின்னர் Google மூலம் தொடரவும்.",
    },
  });

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    user_type: "buyer",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      setError(copy.requiredError);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const result = await registerUser(form);
      setUser(result.user as any);
      router.push("/dashboard");
    } catch (err: any) {
      setError(mapAuthError(err?.code || "", locale));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    setError("");
    try {
      const result = await signInWithGoogle(form.user_type as any);
      setUser(result.user as any);
      router.push("/dashboard");
    } catch (err: any) {
      setError(mapAuthError(err?.code || "", locale));
    } finally {
      setGoogleLoading(false);
    }
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
              <label htmlFor="register-user-type" className="block text-sm font-medium text-gray-700 mb-1">{copy.role}</label>
              <select
                id="register-user-type"
                name="user_type"
                value={form.user_type}
                onChange={(e) => setForm({ ...form, user_type: e.target.value })}
                className="input-field"
              >
                <option value="buyer">{copy.buyer}</option>
                <option value="seller">{copy.seller}</option>
                <option value="agent">{copy.agent}</option>
              </select>
              <p className="text-xs text-charcoal-500 mt-2">{copy.googleHint}</p>
            </div>
            <button
              type="button"
              onClick={handleGoogle}
              disabled={googleLoading || loading}
              className="w-full inline-flex items-center justify-center gap-3 rounded-2xl border border-sand-300 bg-white px-4 py-3 font-bold text-charcoal-800 hover:bg-sand-50 disabled:opacity-60"
            >
              <span className="grid h-6 w-6 place-items-center rounded-full bg-white text-sm font-black text-blue-600 border border-sand-200">G</span>
              {googleLoading ? t("common.loading", locale) : copy.google}
            </button>
            <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-wide text-charcoal-400">
              <span className="h-px flex-1 bg-sand-200" />
              {copy.divider}
              <span className="h-px flex-1 bg-sand-200" />
            </div>
            <div>
              <label htmlFor="register-name" className="block text-sm font-medium text-gray-700 mb-1">{copy.fullName}</label>
              <input
                id="register-name"
                name="name"
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="input-field"
                required
              />
            </div>
            <div>
              <label htmlFor="register-email" className="block text-sm font-medium text-gray-700 mb-1">{copy.email}</label>
              <input
                id="register-email"
                name="email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
                className="input-field"
                required
              />
            </div>
            <div>
              <label htmlFor="register-phone" className="block text-sm font-medium text-gray-700 mb-1">{copy.phone}</label>
              <input
                id="register-phone"
                name="phone"
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+94 70 484 6555"
                className="input-field"
              />
            </div>
            <div>
              <label htmlFor="register-password" className="block text-sm font-medium text-gray-700 mb-1">{copy.password}</label>
              <input
                id="register-password"
                name="password"
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="input-field"
                required
                minLength={6}
              />
            </div>
            <button type="submit" disabled={loading} className="w-full btn-primary">
              {loading ? t("common.loading", locale) : copy.submit}
            </button>
            <p className="text-center text-sm text-gray-600">
              {copy.alreadyHave}{" "}
              <Link href="/login" className="text-primary-600 font-medium hover:underline">
                {t("nav.login", locale)}
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
}
