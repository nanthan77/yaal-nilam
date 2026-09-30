"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { localize, t } from "@/lib/translations";
import { BRAND, BRAND_ASSETS } from "@/lib/brand";
import { canonicalizePhoneNumber } from "@/lib/agent-onboarding";

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
    "account/agent-conversion-required": { en: `This account is already registered as a buyer or seller. For a secure agent conversion, contact Yaal Nilam support on WhatsApp ${BRAND.supportWhatsappDisplay} or call ${BRAND.phoneDisplay}.`, ta: `இந்த கணக்கு ஏற்கனவே buyer அல்லது seller கணக்காக உள்ளது. பாதுகாப்பான agent மாற்றத்திற்கு Yaal Nilam உதவியை WhatsApp ${BRAND.supportWhatsappDisplay} அல்லது அழைப்பு ${BRAND.phoneDisplay} மூலம் தொடர்புகொள்ளுங்கள்.` },
    "account/role-verification-unavailable": { en: "We could not verify the role already linked to this account. Please try again when your connection is stable or contact support; no agent profile was created.", ta: "இந்த கணக்குடன் ஏற்கனவே இணைக்கப்பட்ட role-ஐ சரிபார்க்க முடியவில்லை. இணைய இணைப்பு சரியான பிறகு மீண்டும் முயற்சிக்கவும் அல்லது உதவியை தொடர்புகொள்ளவும்; agent profile உருவாக்கப்படவில்லை." },
    "account/agent-phone-required": { en: "A valid Sri Lankan or international phone number is required for agent registration.", ta: "முகவர் பதிவுக்கு செல்லுபடியாகும் இலங்கை அல்லது சர்வதேச தொலைபேசி எண் அவசியம்." },
    "account/valid-phone-required": { en: "Enter a valid Sri Lankan or international phone number, including the country code for overseas numbers.", ta: "வெளிநாட்டு எண்களுக்கு country code உடன் செல்லுபடியாகும் இலங்கை அல்லது சர்வதேச தொலைபேசி எண்ணை உள்ளிடுங்கள்." },
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
      phone: "Phone Number",
      phoneOptional: "Phone Number (optional)",
      phoneError: "Enter a valid Sri Lankan or international phone number. Agent accounts require a phone number.",
      profileSyncError: "Your sign-in account was created, but the Yaal Nilam profile could not be saved. Please try signing in again or contact support before posting.",
      agentProfileSyncError: "Your account exists, but the agent profile setup is incomplete. Please try signing in again or contact support before posting.",
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
      phone: "தொலைபேசி எண்",
      phoneOptional: "தொலைபேசி எண் (விருப்பம்)",
      phoneError: "செல்லுபடியாகும் இலங்கை அல்லது சர்வதேச தொலைபேசி எண்ணை உள்ளிடுங்கள். முகவர் கணக்கிற்கு தொலைபேசி எண் அவசியம்.",
      profileSyncError: "உங்கள் sign-in கணக்கு உருவாக்கப்பட்டது, ஆனால் Yaal Nilam profile சேமிக்கப்படவில்லை. Listing இடுவதற்கு முன் மீண்டும் sign in செய்யவும் அல்லது உதவியை தொடர்புகொள்ளவும்.",
      agentProfileSyncError: "உங்கள் கணக்கு உள்ளது, ஆனால் agent profile setup முழுமையடையவில்லை. Listing இடுவதற்கு முன் மீண்டும் sign in செய்யவும் அல்லது உதவியை தொடர்புகொள்ளவும்.",
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

  useEffect(() => {
    const requestedRole = new URLSearchParams(window.location.search).get("role");
    if (requestedRole === "agent") setForm((current) => ({ ...current, user_type: "agent" }));
  }, []);

  function validatedPhone() {
    const phone = canonicalizePhoneNumber(form.phone);
    if ((form.user_type === "agent" || form.phone.trim()) && !phone) {
      setError(copy.phoneError);
      return null;
    }
    return phone || "";
  }

  async function finishProfileSetup(result: any) {
    if (!result.profileSynced) {
      const { logout } = await import("@/lib/api");
      await logout().catch(() => undefined);
      setUser(null);
      setError(copy.profileSyncError);
      return false;
    }
    if (result.user?.user_type === "agent" && !result.agentProfileSynced) {
      const { logout } = await import("@/lib/api");
      await logout().catch(() => undefined);
      setUser(null);
      setError(copy.agentProfileSyncError);
      return false;
    }
    setUser(result.user as any);
    router.push("/dashboard");
    return true;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      setError(copy.requiredError);
      return;
    }
    const phone = validatedPhone();
    if (phone === null) return;
    setLoading(true);
    setError("");
    try {
      const { register: registerUser } = await import("@/lib/api");
      const result = await registerUser({ ...form, phone });
      await finishProfileSetup(result);
    } catch (err: any) {
      setError(mapAuthError(err?.code || "", locale));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    const phone = validatedPhone();
    if (phone === null) return;
    setGoogleLoading(true);
    setError("");
    try {
      const { signInWithGoogle } = await import("@/lib/api");
      const result = await signInWithGoogle(form.user_type as any, {
        name: form.name,
        phone,
      });
      await finishProfileSetup(result);
    } catch (err: any) {
      setError(mapAuthError(err?.code || "", locale));
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <>
      <div className="relative flex flex-1 items-center justify-center overflow-hidden bg-slate-50 px-4 py-12 sm:py-16">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(245,158,11,0.12),transparent_48%),radial-gradient(ellipse_at_bottom_left,rgba(20,184,166,0.08),transparent_45%)]" />
        <div className="relative z-10 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="mx-auto flex h-28 w-28 items-center justify-center overflow-hidden rounded-3xl border border-slate-200 bg-[#e3e4e1] shadow-card">
              <Image src={BRAND_ASSETS.logo} alt="Yaal Nilam — Jaffna Real Estate" width={112} height={112} priority className="h-28 w-28 object-contain" />
            </div>
            <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-900">{t("nav.register", locale)}</h1>
            <p className="mt-2 text-sm text-slate-600">{copy.intro}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-card-xl sm:p-8">
            {error && <div role="alert" className="bg-red-50 text-red-700 text-sm p-3 rounded-lg">{error}</div>}
            <div>
              <label htmlFor="register-user-type" className="mb-1 block text-sm font-semibold text-slate-700">{copy.role}</label>
              <select
                id="register-user-type"
                name="user_type"
                value={form.user_type}
                onChange={(e) => setForm({ ...form, user_type: e.target.value })}
                className="input-field !border-slate-200 focus:!border-amber-500 focus:!shadow-[0_0_0_4px_rgba(245,158,11,0.14)]"
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
              className="inline-flex w-full items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 font-bold text-slate-800 transition hover:border-amber-300 hover:bg-amber-50/60 disabled:opacity-60"
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
              <label htmlFor="register-name" className="mb-1 block text-sm font-semibold text-slate-700">{copy.fullName}</label>
              <input
                id="register-name"
                name="name"
                type="text"
                autoComplete="name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="input-field !border-slate-200 focus:!border-amber-500 focus:!shadow-[0_0_0_4px_rgba(245,158,11,0.14)]"
                required
              />
            </div>
            <div>
              <label htmlFor="register-email" className="mb-1 block text-sm font-semibold text-slate-700">{copy.email}</label>
              <input
                id="register-email"
                name="email"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
                className="input-field !border-slate-200 focus:!border-amber-500 focus:!shadow-[0_0_0_4px_rgba(245,158,11,0.14)]"
                required
              />
            </div>
            <div>
              <label htmlFor="register-phone" className="mb-1 block text-sm font-semibold text-slate-700">
                {form.user_type === "agent" ? `${copy.phone} *` : copy.phoneOptional}
              </label>
              <input
                id="register-phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                value={form.phone}
                onChange={(e) => {
                  setForm({ ...form, phone: e.target.value });
                  if (error === copy.phoneError) setError("");
                }}
                placeholder="+94 70 484 6555"
                className="input-field !border-slate-200 focus:!border-amber-500 focus:!shadow-[0_0_0_4px_rgba(245,158,11,0.14)]"
                required={form.user_type === "agent"}
                aria-invalid={Boolean(error === copy.phoneError)}
              />
            </div>
            <div>
              <label htmlFor="register-password" className="mb-1 block text-sm font-semibold text-slate-700">{copy.password}</label>
              <input
                id="register-password"
                name="password"
                type="password"
                autoComplete="new-password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="input-field !border-slate-200 focus:!border-amber-500 focus:!shadow-[0_0_0_4px_rgba(245,158,11,0.14)]"
                required
                minLength={6}
              />
            </div>
            <button type="submit" disabled={loading} className="w-full btn-primary">
              {loading ? t("common.loading", locale) : copy.submit}
            </button>
            <p className="text-center text-sm text-slate-600">
              {copy.alreadyHave}{" "}
              <Link href={form.user_type === "agent" ? "/login?role=agent" : "/login"} className="font-bold text-amber-700 hover:text-amber-900 hover:underline">
                {t("nav.login", locale)}
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
}
