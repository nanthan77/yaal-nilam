"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { localize, t } from "@/lib/translations";
import { User, ShieldCheck } from "lucide-react";
import { BRAND, BRAND_ASSETS } from "@/lib/brand";
import { hasPendingGoogleRedirect } from "@/lib/google-auth-redirect";

let pendingGoogleCompletion: Promise<any> | null = null;

function completePendingGoogleRedirect(userType: "buyer" | "agent") {
  if (!pendingGoogleCompletion) {
    pendingGoogleCompletion = import("@/lib/api").then(({ completeGoogleRedirectSignIn }) =>
      completeGoogleRedirectSignIn(userType)
    );
  }
  return pendingGoogleCompletion;
}

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
    "auth/unauthorized-domain":       { en: "Google sign-in is not enabled for this website domain. Please contact support.", ta: "இந்த இணையதள முகவரிக்கு Google உள்நுழைவு அனுமதி இல்லை. உதவியை தொடர்புகொள்ளவும்." },
    "auth/web-storage-unsupported":   { en: "This browser is blocking secure sign-in storage. Allow cookies for this site and try again.", ta: "இந்த browser பாதுகாப்பான உள்நுழைவு storage-ஐ தடுக்கிறது. இந்த site-க்கு cookies அனுமதித்து மீண்டும் முயற்சிக்கவும்." },
    "auth/network-request-failed":    { en: "Google sign-in could not reach the network. Check your connection and try again.", ta: "Google உள்நுழைவுக்கு இணைய இணைப்பு கிடைக்கவில்லை. இணைப்பைச் சரிபார்த்து மீண்டும் முயற்சிக்கவும்." },
    "auth/operation-not-allowed":     { en: "Google sign-in is not enabled yet. Please use email and password or contact support.", ta: "Google உள்நுழைவு இன்னும் இயக்கப்படவில்லை. Email/password பயன்படுத்தவும் அல்லது உதவியை தொடர்புகொள்ளவும்." },
    "auth/account-exists-with-different-credential": { en: "This email already uses a different sign-in method. Try email/password.", ta: "இந்த மின்னஞ்சல் வேறு sign-in முறையில் உள்ளது. Email/password முயற்சிக்கவும்." },
    "account/agent-conversion-required": { en: `This account is registered as a buyer or seller. Agent access needs a secure conversion; contact Yaal Nilam support on WhatsApp ${BRAND.supportWhatsappDisplay} or call ${BRAND.phoneDisplay}.`, ta: `இந்த கணக்கு buyer அல்லது seller கணக்காக உள்ளது. Agent access-க்கு பாதுகாப்பான மாற்றம் தேவை; Yaal Nilam உதவியை WhatsApp ${BRAND.supportWhatsappDisplay} அல்லது அழைப்பு ${BRAND.phoneDisplay} மூலம் தொடர்புகொள்ளுங்கள்.` },
    "account/role-verification-unavailable": { en: "We could not verify the role linked to this account. Please try again when your connection is stable or contact support; agent access was not changed.", ta: "இந்த கணக்குடன் இணைக்கப்பட்ட role-ஐ சரிபார்க்க முடியவில்லை. இணைய இணைப்பு சரியான பிறகு மீண்டும் முயற்சிக்கவும் அல்லது உதவியை தொடர்புகொள்ளவும்; agent access மாற்றப்படவில்லை." },
    "account/agent-phone-required": { en: "This Google account is not registered as an agent yet. Use the agent registration page and add a valid phone number first.", ta: "இந்த Google கணக்கு இன்னும் முகவராகப் பதிவு செய்யப்படவில்லை. முதலில் agent registration பக்கத்தில் செல்லுபடியாகும் தொலைபேசி எண்ணைச் சேர்க்கவும்." },
    "account/valid-phone-required": { en: "The phone saved on this account is not usable. Contact support to correct it before continuing.", ta: "இந்த கணக்கில் சேமிக்கப்பட்ட தொலைபேசி எண் பயன்படுத்த முடியவில்லை. தொடர்வதற்கு முன் உதவியை தொடர்புகொண்டு திருத்துங்கள்." },
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
      checking: "Restoring your secure session...",
      remembered: "This device stays signed in until you sign out.",
      forgotPassword: "Forgot password?",
      resetSending: "Sending reset link...",
      resetSuccess: "If an account exists for this email, a password reset link has been sent.",
      profileSyncError: "Sign-in succeeded, but your Yaal Nilam profile could not be synchronized. Please try again or contact support before posting.",
      agentProfileSyncError: "Sign-in succeeded, but your agent profile setup is incomplete. Please try again or contact support before posting.",
    },
    ta: {
      intro: "உங்கள் யாழ் நிலம் கணக்கில் உள்நுழையுங்கள்",
      email: "மின்னஞ்சல் முகவரி",
      password: "கடவுச்சொல்",
      submitError: "தயவுசெய்து உங்கள் மின்னஞ்சலையும் கடவுச்சொல்லையும் உள்ளிடுங்கள்.",
      noAccount: "இன்னும் கணக்கு இல்லையா?",
      google: "Google மூலம் தொடரவும்",
      divider: "அல்லது email பயன்படுத்தவும்",
      checking: "உங்கள் பாதுகாப்பான session மீட்டெடுக்கப்படுகிறது...",
      remembered: "நீங்கள் வெளியேறும் வரை இந்த சாதனத்தில் உள்நுழைவு தொடரும்.",
      forgotPassword: "கடவுச்சொல் மறந்துவிட்டதா?",
      resetSending: "Reset link அனுப்பப்படுகிறது...",
      resetSuccess: "இந்த மின்னஞ்சலுக்கு கணக்கு இருந்தால், password reset link அனுப்பப்பட்டுள்ளது.",
      profileSyncError: "Sign-in வெற்றியடைந்தது, ஆனால் உங்கள் Yaal Nilam profile sync ஆகவில்லை. Listing இடுவதற்கு முன் மீண்டும் முயற்சிக்கவும் அல்லது உதவியை தொடர்புகொள்ளவும்.",
      agentProfileSyncError: "Sign-in வெற்றியடைந்தது, ஆனால் agent profile setup முழுமையடையவில்லை. Listing இடுவதற்கு முன் மீண்டும் முயற்சிக்கவும் அல்லது உதவியை தொடர்புகொள்ளவும்.",
    },
  });

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [accountType, setAccountType] = useState<"buyer" | "agent">("buyer");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [sessionChecking, setSessionChecking] = useState(true);
  const [resetLoading, setResetLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const finishProfileSetup = useCallback(async (result: any, replace = false) => {
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
    if (replace) router.replace("/dashboard");
    else router.push("/dashboard");
    return true;
  }, [copy.agentProfileSyncError, copy.profileSyncError, router, setUser]);

  useEffect(() => {
    const requestedRole = new URLSearchParams(window.location.search).get("role");
    if (requestedRole === "agent") setAccountType("agent");
  }, []);

  useEffect(() => {
    let active = true;
    const restoreSession = async () => {
      const requestedRole = new URLSearchParams(window.location.search).get("role");
      const fallbackType = requestedRole === "agent" ? "agent" : "buyer";

      if (hasPendingGoogleRedirect()) {
        let navigating = false;
        if (active) {
          setGoogleLoading(true);
          setError("");
        }
        try {
          const result = await completePendingGoogleRedirect(fallbackType);
          if (!active) return;
          if (result) {
            navigating = await finishProfileSetup(result, true);
          }
        } catch (err: any) {
          if (active) setError(mapAuthError(err?.code || "", locale));
        } finally {
          if (active) {
            setGoogleLoading(false);
            if (!navigating) setSessionChecking(false);
          }
        }
        return;
      }

      let navigating = false;
      try {
        const { auth } = await import("@/lib/firebase");
        await auth.authStateReady();
        if (!active) return;
        if (auth.currentUser) {
          const { restoreAuthenticatedSession } = await import("@/lib/api");
          const result = await restoreAuthenticatedSession(fallbackType);
          if (!active) return;
          if (result) navigating = await finishProfileSetup(result, true);
        }
      } catch (err: any) {
        if (active) setError(mapAuthError(err?.code || "", locale));
      } finally {
        // Keep all sign-in controls blocked until the existing Auth/profile
        // operation has actually settled. Revealing the form on a timer lets a
        // late restore overwrite or sign out a newly selected account.
        if (active && !navigating) setSessionChecking(false);
      }
    };

    void restoreSession();
    return () => {
      active = false;
    };
  }, [finishProfileSetup, locale, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError(copy.submitError);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const { login: loginUser } = await import("@/lib/api");
      const result = await loginUser(email, password, accountType);
      await finishProfileSetup(result);
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
      const requestedRole = new URLSearchParams(window.location.search).get("role");
      const selectedType = requestedRole === "agent" ? "agent" : accountType;
      const { signInWithGoogle, startGoogleRedirectSignIn } = await import("@/lib/api");
      try {
        const result = await signInWithGoogle(selectedType);
        if (result) {
          await finishProfileSetup(result);
        }
      } catch (popupErr: any) {
        if (popupErr?.code === "auth/popup-blocked" || popupErr?.code === "auth/popup-closed-by-user") {
          await startGoogleRedirectSignIn(selectedType);
        } else {
          throw popupErr;
        }
      }
    } catch (err: any) {
      setError(mapAuthError(err?.code || "", locale));
    } finally {
      setGoogleLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    setError("");
    setResetSuccess(false);
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setError(mapAuthError("auth/invalid-email", locale));
      return;
    }

    setResetLoading(true);
    try {
      const { requestPasswordReset } = await import("@/lib/api");
      await requestPasswordReset(email);
      setResetSuccess(true);
    } catch (err: any) {
      setError(mapAuthError(err?.code || "", locale));
    } finally {
      setResetLoading(false);
    }
  };

  if (sessionChecking) {
    return (
      <div className="relative flex min-h-[62vh] items-center justify-center overflow-hidden bg-slate-50 px-4 py-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(245,158,11,0.12),transparent_48%),radial-gradient(ellipse_at_bottom_left,rgba(20,184,166,0.08),transparent_45%)]" />
        <div className="relative z-10 rounded-2xl border border-slate-200 bg-white px-6 py-5 text-center shadow-card">
          <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-amber-500" aria-hidden="true" />
          <h1 className="text-sm font-semibold text-slate-700">{copy.checking}</h1>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="relative flex min-h-[70vh] flex-1 items-center justify-center overflow-hidden bg-slate-50 px-4 py-8 sm:py-12">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(245,158,11,0.12),transparent_48%),radial-gradient(ellipse_at_bottom_left,rgba(20,184,166,0.08),transparent_45%)]" />
        <div className="relative z-10 w-full max-w-md">
          <div className="mb-5 text-center sm:mb-7">
            <div className="mx-auto flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-[#e3e4e1] shadow-card sm:h-24 sm:w-24 sm:rounded-3xl">
              <Image src={BRAND_ASSETS.logo} alt="Yaal Nilam — Jaffna Real Estate" width={96} height={96} priority className="h-20 w-20 object-contain sm:h-24 sm:w-24" />
            </div>
            <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{t("nav.login", locale)}</h1>
            <p className="mt-1.5 text-sm text-slate-600 sm:mt-2">{copy.intro}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-card-xl sm:space-y-5 sm:p-7">
            {error && (
              <div role="alert" className="bg-red-50 text-red-700 text-sm p-3 rounded-lg">{error}</div>
            )}
            {resetSuccess && (
              <div role="status" className="rounded-lg border border-teal-200 bg-teal-50 p-3 text-sm font-medium text-teal-800">
                {copy.resetSuccess}
              </div>
            )}
            <button
              type="button"
              onClick={handleGoogle}
              disabled={googleLoading || loading}
              className="inline-flex min-h-[48px] w-full items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 font-bold text-slate-800 transition hover:border-amber-300 hover:bg-amber-50/60 disabled:opacity-60 sm:py-3"
            >
              <span className="grid h-6 w-6 place-items-center rounded-full bg-white text-sm font-black text-blue-600 border border-sand-200">G</span>
              {googleLoading ? t("common.loading", locale) : copy.google}
            </button>
            <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-wide text-charcoal-400">
              <span className="h-px flex-1 bg-sand-200" />
              {copy.divider}
              <span className="h-px flex-1 bg-sand-200" />
            </div>
            <div
              className="grid grid-cols-2 gap-2 rounded-2xl bg-slate-100 p-1.5"
              role="group"
              aria-label="Account type"
            >
              <button
                type="button"
                onClick={() => setAccountType("buyer")}
                aria-pressed={accountType === "buyer"}
                className={`min-h-[48px] rounded-xl px-3 py-2 text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                  accountType === "buyer"
                    ? "bg-white text-slate-900 shadow-sm ring-2 ring-amber-400"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <User className={`w-4 h-4 ${accountType === "buyer" ? "text-amber-500" : "text-slate-400"}`} />
                <span>{locale === "ta" ? "பயனர் கணக்கு" : "Buyer / User"}</span>
              </button>
              <button
                type="button"
                onClick={() => setAccountType("agent")}
                aria-pressed={accountType === "agent"}
                className={`min-h-[48px] rounded-xl px-3 py-2 text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                  accountType === "agent"
                    ? "bg-white text-teal-950 shadow-sm ring-2 ring-teal-500"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <ShieldCheck className={`w-4 h-4 ${accountType === "agent" ? "text-teal-600" : "text-slate-400"}`} />
                <span>{locale === "ta" ? "முகவர் / நிறுவனம்" : "Agent / Agency"}</span>
              </button>
            </div>
            <div>
              <label htmlFor="login-email" className="mb-1 block text-sm font-semibold text-slate-700">{copy.email}</label>
              <input
                id="login-email"
                type="email"
                name="email"
                autoComplete="username"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setResetSuccess(false);
                }}
                placeholder="you@example.com"
                className="input-field !border-slate-200 focus:!border-amber-500 focus:!shadow-[0_0_0_4px_rgba(245,158,11,0.14)]"
                required
              />
            </div>
            <div>
              <div className="mb-1 flex items-center justify-between gap-3">
                <label htmlFor="login-password" className="block text-sm font-semibold text-slate-700">{copy.password}</label>
                <button
                  type="button"
                  onClick={handlePasswordReset}
                  disabled={resetLoading || loading || googleLoading}
                  className="text-xs font-bold text-amber-700 hover:text-amber-900 hover:underline disabled:opacity-60"
                >
                  {resetLoading ? copy.resetSending : copy.forgotPassword}
                </button>
              </div>
              <input
                id="login-password"
                type="password"
                name="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field !border-slate-200 focus:!border-amber-500 focus:!shadow-[0_0_0_4px_rgba(245,158,11,0.14)]"
                required
              />
            </div>
            <button type="submit" disabled={loading} className="w-full btn-primary">
              {loading ? t("common.loading", locale) : t("nav.login", locale)}
            </button>
            <p className="text-center text-xs font-medium text-slate-500">{copy.remembered}</p>
            <p className="text-center text-sm text-slate-600">
              {copy.noAccount}{" "}
              <Link href={accountType === "agent" ? "/register?role=agent" : "/register"} className="font-bold text-amber-700 hover:text-amber-900 hover:underline">
                {t("nav.register", locale)}
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
}
