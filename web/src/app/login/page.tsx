"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { login as loginUser, signInWithGoogle } from "@/lib/api";
import { useStore } from "@/lib/store";
import { localize, t } from "@/lib/translations";

function mapAuthError(code: string, locale: string): string {
  const messages: Record<string, { en: string; ta: string }> = {
    "auth/user-not-found":           { en: "No account found with this email.", ta: "இந்த மின்னஞ்சலில் கணக்கு இல்லை." },
    "auth/wrong-password":           { en: "Incorrect password. Please try again.", ta: "தவறான கடவுச்சொல். மீண்டும் முயற்சிக்கவும்." },
    "auth/invalid-email":            { en: "Please enter a valid email address.", ta: "சரியான மின்னஞ்சல் முகவரியை உள்ளிடுங்கள்." },
    "auth/too-many-requests":        { en: "Too many attempts. Please wait and try again.", ta: "அதிக முயற்சிகள். சிறிது நேரம் காத்திருந்து மீண்டும் முயற்சிக்கவும்." },
    "auth/user-disabled":            { en: "This account has been disabled.", ta: "இந்த கணக்கு முடக்கப்பட்டுள்ளது." },
    "auth/invalid-credential":       { en: "Invalid email or password.", ta: "தவறான மின்னஞ்சல் அல்லது கடவுச்சொல்." },
    "auth/popup-closed-by-user":      { en: "Google sign-in was closed before it finished.", ta: "Google உள்நுழைவு முடிவதற்கு முன் மூடப்பட்டது." },
    "auth/popup-blocked":             { en: "Your browser blocked the Google sign-in popup. Please allow popups for this site.", ta: "Google உள்நுழைவு popup-ஐ browser தடுத்தது. இந்த site-க்கு popups அனுமதிக்கவும்." },
    "auth/account-exists-with-different-credential": { en: "This email already uses a different sign-in method. Try email/password.", ta: "இந்த மின்னஞ்சல் வேறு sign-in முறையில் உள்ளது. Email/password முயற்சிக்கவும்." },
  };
  const entry = messages[code];
  if (!entry) return locale === "ta" ? "உள்நுழைவு தோல்வியடைந்தது. மீண்டும் முயற்சிக்கவும்." : "Login failed. Please try again.";
  return locale === "ta" ? entry.ta : entry.en;
}

export default function LoginPage() {
  const router = useRouter();
  const { locale, setUser } = useStore();
  const copy = localize(locale, {
    en: {
      intro: "Sign in to your Yaal Nilam account",
      email: "Email Address",
      password: "Password",
      submitError: "Please enter your email and password.",
      noAccount: "Don't have an account?",
      google: "Continue with Google",
      divider: "or use email",
    },
    ta: {
      intro: "உங்கள் யாழ் நிலம் கணக்கில் உள்நுழையுங்கள்",
      email: "மின்னஞ்சல் முகவரி",
      password: "கடவுச்சொல்",
      submitError: "தயவுசெய்து உங்கள் மின்னஞ்சலையும் கடவுச்சொல்லையும் உள்ளிடுங்கள்.",
      noAccount: "இன்னும் கணக்கு இல்லையா?",
      google: "Google மூலம் தொடரவும்",
      divider: "அல்லது email பயன்படுத்தவும்",
    },
  });

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError(copy.submitError);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const result = await loginUser(email, password);
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
      const result = await signInWithGoogle("buyer");
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
            <h1 className="text-2xl font-bold mt-2">{t("nav.login", locale)}</h1>
            <p className="text-gray-600 text-sm mt-1">{copy.intro}</p>
          </div>

          <form onSubmit={handleSubmit} className="card p-8 space-y-5">
            {error && (
              <div className="bg-red-50 text-red-700 text-sm p-3 rounded-lg">{error}</div>
            )}
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
              <label htmlFor="login-email" className="block text-sm font-medium text-gray-700 mb-1">{copy.email}</label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="input-field"
                required
              />
            </div>
            <div>
              <label htmlFor="login-password" className="block text-sm font-medium text-gray-700 mb-1">{copy.password}</label>
              <input
                id="login-password"
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
