import Link from "next/link";
import { Award, BarChart3, CheckCircle2, ShieldCheck, Sparkles, Users } from "lucide-react";
import { AGENCY_ACCOUNT_TIERS } from "@/lib/agent-profile";

export const metadata = {
  title: "Premium Agency Accounts | Yaal Nilam",
  description:
    "Premium property agency profiles for Yaal Nilam: branded company pages, registration trust details, team CRM, social lead monitoring, and performance analytics.",
  alternates: { canonical: "/for-agents/premium/" },
};

export default function PremiumAgencyPage() {
  const premiumTiers = AGENCY_ACCOUNT_TIERS.filter((tier) => tier.id !== "starter");

  return (
    <main className="min-h-screen bg-sand-50">
      <section className="bg-gradient-to-br from-teal-950 via-teal-900 to-teal-800 px-4 py-16 text-white">
        <div className="mx-auto max-w-6xl">
          <Link href="/for-agents" className="text-sm font-bold text-warm-300 hover:text-warm-200">
            For agents
          </Link>
          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px] lg:items-end">
            <div>
              <h1 className="max-w-4xl text-4xl font-black tracking-tight md:text-6xl">
                Premium agency accounts for serious property teams
              </h1>
              <p className="mt-5 max-w-3xl text-lg leading-relaxed text-teal-50/85">
                Build the worldwide-style real estate profile buyers expect: logo, registration details, social proof,
                team contact routing, branded listings, lead CRM, social monitoring, and clear analytics.
              </p>
            </div>
            <div className="rounded-3xl border border-white/15 bg-white/10 p-5 backdrop-blur">
              <div className="grid grid-cols-2 gap-3">
                {[
                  ["Team CRM", Users],
                  ["Trust profile", ShieldCheck],
                  ["Analytics", BarChart3],
                  ["Featured reach", Award],
                ].map(([label, Icon]: any) => (
                  <div key={label} className="rounded-2xl bg-white/10 p-4">
                    <Icon className="h-5 w-5 text-warm-300" />
                    <p className="mt-3 text-sm font-black">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-6 lg:grid-cols-3">
          {premiumTiers.map((tier) => (
            <article key={tier.id} className="rounded-3xl border border-sand-200 bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-charcoal-900">{tier.label}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-charcoal-600">{tier.bestFor}</p>
                </div>
                <span className="rounded-full bg-warm-50 px-3 py-1.5 text-xs font-black text-warm-800">
                  {tier.price}
                </span>
              </div>

              <div className="mt-6">
                <p className="text-xs font-black uppercase tracking-wide text-charcoal-500">Public profile</p>
                <div className="mt-3 space-y-2">
                  {tier.publicFeatures.map((feature) => (
                    <div key={feature} className="flex gap-2 text-sm font-semibold text-charcoal-700">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-teal-700" />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 rounded-2xl bg-sand-50 p-4">
                <p className="text-xs font-black uppercase tracking-wide text-charcoal-500">Internal workspace</p>
                <div className="mt-3 space-y-2">
                  {tier.internalFeatures.map((feature) => (
                    <div key={feature} className="flex gap-2 text-sm font-semibold text-charcoal-700">
                      <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-warm-600" />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10 rounded-3xl border border-teal-200 bg-teal-900 p-6 text-white">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <h2 className="text-2xl font-black">Recommended first paid package</h2>
              <p className="mt-2 max-w-3xl text-sm leading-relaxed text-teal-50/80">
                Start with Agency Team: company logo, registration trust details, all listings under one agency URL,
                lead assignment, social lead CRM, and monthly performance reporting. This is the cleanest path to turn
                agents into a serious inventory and traffic engine.
              </p>
            </div>
            <Link
              href="/register"
              className="inline-flex items-center justify-center rounded-2xl bg-warm-400 px-5 py-3 font-black text-teal-950 hover:bg-warm-300"
            >
              Register agency
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
