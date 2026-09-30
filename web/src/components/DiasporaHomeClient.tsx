'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ShieldCheck, Video, FileText, CheckCircle2, MessageCircle, ArrowRight, Plane, Building2 } from 'lucide-react';
import { useStore } from '@/lib/store';
import {
  MANAGEMENT_PACKAGES,
  POA_GUIDANCE_STEPS,
  PROPERTY_MANAGEMENT_FAQS,
  INSPECTION_DELIVERABLES,
  PRE_PURCHASE_PACKAGES,
  BROKER_SUPPLY_ONBOARDING,
  diasporaInspectionWhatsAppMessage,
  brokerFreeListingWhatsAppMessage,
} from '@/lib/diaspora';
import { buildBrandWhatsAppUrl } from '@/lib/brand';
import DiasporaPackageCard from './DiasporaPackageCard';
import DiasporaPropertyManagementForm from './DiasporaPropertyManagementForm';

export default function DiasporaHomeClient({ guide = false }: { guide?: boolean }) {
  const locale = useStore((state) => state.locale);
  const tamil = locale === 'ta';
  const [selectedPackage, setSelectedPackage] = useState(guide ? 'premium' : 'basic');
  const [activePrePurchasePkg, setActivePrePurchasePkg] = useState<'ground_verify' | 'full_diligence' | 'vip_concierge'>('full_diligence');

  const selectPackage = (id: string) => {
    setSelectedPackage(id);
    document.getElementById('enquire-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    document.getElementById('management-name')?.focus({ preventScroll: true });
  };

  const brokerWhatsAppUrl = buildBrandWhatsAppUrl(brokerFreeListingWhatsAppMessage());

  return (
    <div className="bg-sand-50" lang={locale}>
      {/* ─── Hero Section ──────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0a231c] via-[#0f2e25] to-[#164235] px-4 py-16 text-white sm:px-6 sm:py-20">
        <div className="relative mx-auto max-w-6xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#efd081]/30 bg-[#efd081]/10 px-3.5 py-1 text-xs font-semibold text-[#efd081]">
            <ShieldCheck className="h-4 w-4" />
            <span>
              {tamil
                ? 'புலம்பெயர் முதலீட்டாளர்கள் & சொத்து உரிமையாளர்களுக்கு'
                : 'For Overseas Buyers & Property Owners'}
            </span>
          </div>

          <h1 className="mt-5 max-w-4xl break-words text-3xl font-black leading-tight sm:text-5xl lg:text-6xl">
            {guide
              ? (tamil ? 'சொத்து அதிகாரப் பத்திரம்: சுயாதீன வழிகாட்டல்' : 'Power of Attorney for Sri Lanka Property')
              : (tamil ? 'யாழ்ப்பாண களப் பார்வை. சுயாதீன ஆவண ஆய்வு. வெளிநாட்டிலிருந்து ஒருங்கிணைப்பு.' : 'Jaffna Site Visits & Independent Document Checks')}
          </h1>

          <p className="mt-5 max-w-3xl text-base leading-relaxed text-sand-200 sm:text-lg">
            {guide
              ? (tamil
                  ? 'அதிகாரப் பத்திரம் தயாரிப்பதற்கு அல்லது பயன்படுத்துவதற்கு முன் சுயாதீன சட்டத்தரணியுடன் கலந்துரையாட உதவும் வழிகாட்டல்.'
                  : 'Key questions to discuss with an independent lawyer before granting or relying on a Power of Attorney.')
              : (tamil
                  ? 'வெளிநாட்டிலிருந்து யாழ்ப்பாண சொத்துகளைப் பார்வையிடுதல், கிடைக்கக்கூடிய ட்ரோன் படங்கள், வீடியோ மற்றும் சுயாதீன சட்டத்தரணி அல்லது நில அளவையாளர் ஆய்வுகளை ஒருங்கிணைப்பது பற்றி விசாரிக்கவும். சேவையின் கிடைப்புத்தன்மை, பணிகள் மற்றும் கட்டணங்களை எழுத்தில் உறுதிப்படுத்தவும்.'
                  : 'Enquire about site visits, available drone imagery and video walkthroughs, and coordination with independent lawyers and licensed surveyors. Confirm availability, scope and fees in writing before appointing a service provider.')}
          </p>

          <nav aria-label={tamil ? 'புலம்பெயர் சேவைகள் வழிசெலுத்தல்' : 'Diaspora services navigation'} className="mt-8 flex flex-wrap gap-3">
            {!guide && (
              <>
                <a
                  href="#inspection"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#efd081] px-5 py-3 font-bold text-[#0f2e25] shadow-lg transition hover:bg-[#e4be63]"
                >
                  <ShieldCheck className="h-5 w-5" />
                  <span>{tamil ? 'கள ஆய்வு சேவைகள்' : 'Pre-Purchase Inspection'}</span>
                </a>
                <a
                  href="#broker-free-listing"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-5 py-3 font-semibold text-white transition hover:bg-white/20"
                >
                  <Building2 className="h-5 w-5" />
                  <span>{tamil ? '100% இலவச விளம்பரம்' : '100% Free Listing'}</span>
                </a>
                <a
                  href="#packages"
                  className="rounded-xl border border-white/20 px-4 py-3 font-semibold text-white/90 transition hover:bg-white/10"
                >
                  {tamil ? 'பராமரிப்புத் திட்டங்கள்' : 'Care & Management'}
                </a>
              </>
            )}
            <Link
              href="/properties/"
              className="rounded-xl border border-white/20 px-4 py-3 font-semibold text-white/90 transition hover:bg-white/10"
            >
              {tamil ? 'சொத்துகளைப் பாருங்கள்' : 'Browse Properties'}
            </Link>
          </nav>
        </div>
      </section>

      <div className="mx-auto max-w-6xl space-y-16 px-4 py-12 sm:px-6 sm:py-16">
        {!guide && (
          <>
            {/* ─── Pillar 1: Three Ground-Truth Deliverables ─────────────── */}
            <section id="inspection" className="scroll-mt-6" aria-labelledby="inspection-heading">
              <div className="max-w-3xl">
                <p className="text-xs font-bold uppercase tracking-wider text-teal-800">
                  {tamil ? 'தொலைதூர அச்சங்களைத் தவிர்க்கும் தீர்வு' : 'Overcoming Absentee Risk'}
                </p>
                <h2 id="inspection-heading" className="mt-2 text-2xl font-black text-[#0f2e25] sm:text-3xl">
                  {tamil ? 'முன்பணம் செலுத்தும் முன் 3 முக்கிய கள ஆய்வுகள்' : '3 Ground-Truth Deliverables Before You Pay a Deposit'}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
                  {tamil
                    ? 'உள்ளூர் தகவல்களுடன் சுயாதீன நிபுணர் ஆய்வுகளையும் இணைத்து முடிவெடுக்கவும். கிடைக்கக்கூடிய களப் பார்வை, படங்கள் மற்றும் ஆவண ஆய்வுகளின் பணிகளை முன்கூட்டியே உறுதிப்படுத்தவும்:'
                    : 'Discuss on-site observations, supplied survey plans and available registry documents with independent professionals. Agree which inspections and reports can be arranged before transferring funds:'}
                </p>
              </div>

              <div className="mt-8 grid gap-6 lg:grid-cols-3">
                {INSPECTION_DELIVERABLES.map((deliv, idx) => (
                  <div
                    key={deliv.id}
                    className="flex flex-col justify-between rounded-2xl border border-sand-300 bg-white p-6 shadow-sm transition hover:border-teal-400 hover:shadow-md"
                  >
                    <div>
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-teal-800">
                        {idx === 0 && <Plane className="h-6 w-6" />}
                        {idx === 1 && <Video className="h-6 w-6" />}
                        {idx === 2 && <FileText className="h-6 w-6" />}
                      </div>
                      <h3 className="mt-4 text-lg font-bold text-[#0f2e25]">
                        {tamil ? deliv.title_ta : deliv.title}
                      </h3>
                      <p className="mt-2 text-xs font-medium text-teal-700">
                        {tamil ? deliv.tagline_ta : deliv.tagline}
                      </p>
                      <ul className="mt-5 space-y-2.5 text-xs leading-relaxed text-slate-600">
                        {(tamil ? deliv.deliverables_ta : deliv.deliverables).map((item, itemIdx) => (
                          <li key={itemIdx} className="flex items-start gap-2">
                            <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-teal-600" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* ─── Pre-Purchase Concierge Packages ──────────────────────── */}
            <section className="scroll-mt-6 rounded-3xl border border-teal-200/80 bg-gradient-to-b from-teal-900/5 to-white p-6 sm:p-10" aria-labelledby="pre-purchase-heading">
              <div className="text-center max-w-2xl mx-auto">
                <span className="inline-block rounded-full bg-teal-800/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-teal-900">
                  {tamil ? 'முன்-கொள்முதல் பாதுகாப்பு சேவைகள்' : 'Pre-Purchase Due Diligence'}
                </span>
                <h2 id="pre-purchase-heading" className="mt-3 text-2xl font-black text-[#0f2e25] sm:text-3xl">
                  {tamil ? 'யாழ்ப்பாண நிலப் பாதுகாப்பு திட்டங்கள்' : 'Jaffna Inspection & Concierge Packages'}
                </h2>
                <p className="mt-2 text-xs text-slate-600 sm:text-sm">
                  {tamil
                    ? 'சொத்தின் இடம் அல்லது இணைப்பை அனுப்பி, சேவை கிடைப்புத்தன்மை, ஆய்வுப் பணிகள், காலக்கெடு மற்றும் இறுதிக் கட்டணங்களை உறுதிப்படுத்தவும். கீழுள்ள கட்டணங்களும் வெளிநாட்டு நாணய மதிப்புகளும் வழிகாட்டி மதிப்புகள்.'
                    : 'Send the property location or link to confirm available inspections, report scope, timing and final fees. Listed fees, timings and foreign-currency amounts are indicative. Legal conclusions require independent licensed counsel.'}
                </p>
              </div>

              <div className="mt-10 grid gap-6 lg:grid-cols-3">
                {PRE_PURCHASE_PACKAGES.map((pkg) => {
                  const isSelected = activePrePurchasePkg === pkg.id;
                  const bookingUrl = buildBrandWhatsAppUrl(
                    diasporaInspectionWhatsAppMessage({ packageId: pkg.id })
                  );

                  return (
                    <div
                      key={pkg.id}
                      onClick={() => setActivePrePurchasePkg(pkg.id)}
                      className={`relative flex flex-col justify-between rounded-2xl p-6 transition cursor-pointer ${
                        isSelected
                          ? 'border-2 border-teal-700 bg-white shadow-lg ring-4 ring-teal-700/10'
                          : pkg.popular
                          ? 'border-2 border-teal-600/50 bg-white shadow-md'
                          : 'border border-sand-300 bg-white hover:border-teal-300'
                      }`}
                    >
                      {pkg.popular && (
                        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-teal-800 px-3.5 py-0.5 text-xs font-bold uppercase tracking-wide text-white">
                          {tamil ? 'கள மற்றும் ஆவண ஆய்வு' : 'Inspection & Documents'}
                        </div>
                      )}

                      <div>
                        <div className="flex items-baseline justify-between">
                          <h3 className="text-lg font-bold text-[#0f2e25]">
                            {tamil ? pkg.name_ta : pkg.name}
                          </h3>
                          <span className="rounded-lg bg-sand-100 px-2 py-0.5 text-[11px] font-semibold text-slate-700">
                            {tamil ? pkg.turnaround_ta : pkg.turnaround}
                          </span>
                        </div>

                        <p className="mt-2 text-xs text-slate-600">
                          {tamil ? pkg.tagline_ta : pkg.tagline}
                        </p>

                        <div className="mt-5 border-y border-sand-200 py-3">
                          <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-black text-teal-900">
                              Rs. {pkg.feeLkr.toLocaleString()}
                            </span>
                            <span className="text-xs text-slate-500">LKR</span>
                          </div>
                          <p className="mt-1 text-xs text-slate-500">
                            ≈ ${pkg.feeCad} CAD • £{pkg.feeGbp} GBP • ${pkg.feeAud} AUD
                          </p>
                        </div>

                        <ul className="mt-5 space-y-2 text-xs leading-relaxed text-slate-700">
                          {(tamil ? pkg.features_ta : pkg.features).map((feat, fIdx) => (
                            <li key={fIdx} className="flex items-start gap-2">
                              <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-teal-700" />
                              <span>{feat}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="mt-6 pt-4 border-t border-sand-100">
                        <a
                          href={bookingUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`flex w-full items-center justify-center gap-2 rounded-xl py-3 text-xs font-bold transition ${
                            pkg.popular
                              ? 'bg-teal-800 text-white hover:bg-teal-900'
                              : 'bg-sand-100 text-teal-900 hover:bg-sand-200'
                          }`}
                        >
                          <MessageCircle className="h-4 w-4" />
                          <span>{tamil ? 'WhatsApp-ல் பதிவு செய்க' : 'Book on WhatsApp'}</span>
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* ─── Pillar 2: Frictionless Broker & Seller Onboarding ────── */}
            <section
              id="broker-free-listing"
              className="scroll-mt-6 rounded-3xl bg-gradient-to-br from-[#0F2E25] to-[#1B4D3E] p-8 text-white shadow-xl sm:p-12"
              aria-labelledby="broker-heading"
            >
              <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
                <div className="lg:col-span-8">
                  <span className="inline-block rounded-full bg-[#EFD081]/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#EFD081]">
                    {tamil ? 'உள்ளூர் விற்பனையாளர்கள் மற்றும் புரோக்கர்களுக்கு' : 'For Local Sellers & Brokers'}
                  </span>
                  <h2 id="broker-heading" className="mt-4 text-2xl font-black leading-tight sm:text-4xl text-white">
                    {tamil ? BROKER_SUPPLY_ONBOARDING.headlineTa : BROKER_SUPPLY_ONBOARDING.headlineEn}
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-sand-200 sm:text-base">
                    {tamil ? BROKER_SUPPLY_ONBOARDING.subheadlineTa : BROKER_SUPPLY_ONBOARDING.subheadlineEn}
                  </p>

                  <div className="mt-6 space-y-3">
                    {(tamil ? BROKER_SUPPLY_ONBOARDING.bulletsTa : BROKER_SUPPLY_ONBOARDING.bulletsEn).map(
                      (bullet, bIdx) => (
                        <div key={bIdx} className="flex items-start gap-3">
                          <div className="mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#EFD081] text-[#0F2E25]">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                          </div>
                          <p className="text-xs sm:text-sm text-sand-100">{bullet}</p>
                        </div>
                      )
                    )}
                  </div>
                </div>

                <div className="lg:col-span-4 flex flex-col items-center justify-center rounded-2xl bg-white/10 p-6 text-center backdrop-blur-sm border border-white/20">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#EFD081]">
                    {tamil ? 'நேரடி WhatsApp பதிவு' : 'WhatsApp Listing Enquiry'}
                  </p>
                  <p className="mt-2 text-xs text-sand-200">
                    {tamil
                      ? 'புகைப்படங்கள் மற்றும் விபரங்களை பட்டியல் மதிப்பாய்வுக்கு அனுப்பவும். ஏற்றுக்கொள்ளப்பட்ட பட்டியல்கள் எமது பட்டியல் கொள்கையின்படி வெளியிடப்படும்.'
                      : 'Send your property photos and details for listing review. Approved listings are published under our listing policy.'}
                  </p>
                  <a
                    href={brokerWhatsAppUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-5 py-3.5 text-sm font-bold text-white shadow-lg transition hover:bg-[#1ebc59]"
                  >
                    <MessageCircle className="h-5 w-5" />
                    <span>{tamil ? BROKER_SUPPLY_ONBOARDING.ctaTa : BROKER_SUPPLY_ONBOARDING.ctaEn}</span>
                  </a>
                  <p className="mt-3 text-[11px] text-sand-300">
                    {tamil ? 'எவ்வித மறைமுக கட்டணமும் இல்லை' : '100% Free • No Commission Deductions'}
                  </p>
                </div>
              </div>
            </section>

            {/* ─── Property Care & Rental Management Packages ───────────── */}
            <section id="packages" className="scroll-mt-6" aria-labelledby="package-heading">
              <div className="max-w-3xl">
                <p className="text-xs font-bold uppercase tracking-wider text-teal-800">
                  {tamil ? 'சொத்து உரிமையாளர்களுக்கு' : 'For Existing Property Owners'}
                </p>
                <h2 id="package-heading" className="mt-2 text-2xl font-black text-[#0f2e25] sm:text-3xl">
                  {tamil ? 'வீட்டுப் பராமரிப்பு மற்றும் வாடகை மேலாண்மைத் திட்டங்கள்' : 'Long-Term Property Care & Rental Management'}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {tamil
                    ? 'யாழ்ப்பாணத்தில் உள்ள உங்கள் பூர்வீக வீடு அல்லது காலியான காணியை பராமரிக்கவும், வாடகைக்கு விடவும் எமது உள்ளூர் பராமரிப்பு திட்டங்கள் உதவுகின்றன.'
                    : 'Oversee your ancestral home, vacant plot, or rental investment from anywhere in the world.'}
                </p>
              </div>
              <div className="mt-8 grid gap-8 lg:grid-cols-3">
                {MANAGEMENT_PACKAGES.map((pkg) => (
                  <DiasporaPackageCard key={pkg.id} pkg={pkg} locale={locale} onSelect={selectPackage} />
                ))}
              </div>
            </section>
          </>
        )}

        {/* ─── Power of Attorney Guide Section ──────────────────────────── */}
        <section id="poa-guide" className="scroll-mt-6" aria-labelledby="poa-heading">
          <h2 id="poa-heading" className="text-2xl font-bold text-[#0f2e25]">
            {tamil ? 'அதிகாரப் பத்திரம்: சுயாதீன சட்ட ஆலோசனை' : 'Power of Attorney: Independent Legal Advice'}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">
            {tamil
              ? 'தேவைகள் உங்கள் ஆவணம், பரிவர்த்தனை மற்றும் கையெழுத்திடும் இடத்தைப் பொறுத்தது. பட்டியல் வெளியீடு அல்லது யாழ் நிலம் மதிப்பாய்வு உரிமை அல்லது பத்திரத்திற்கான சட்டச் சான்று அல்ல.'
              : 'Requirements depend on the document, transaction and place of signing. Platform review does not certify ownership or deeds.'}
          </p>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {POA_GUIDANCE_STEPS.map((step) => (
              <article key={step.step} className="min-w-0 break-words rounded-2xl border border-sand-300 bg-white p-6">
                <h3 className="text-lg font-bold text-[#0f2e25]">
                  {step.step}. {tamil ? step.title_ta : step.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-700">
                  {tamil ? step.desc_ta : step.desc}
                </p>
              </article>
            ))}
          </div>
          {!guide && (
            <Link
              href="/diaspora/power-of-attorney-guide/"
              className="mt-5 inline-flex items-center gap-1 font-semibold text-teal-800 underline"
            >
              <span>{tamil ? 'அதிகாரப் பத்திர வழிகாட்டியைப் பாருங்கள்' : 'Read the Power of Attorney guide'}</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </section>

        {/* ─── Enquiry Form ─────────────────────────────────────────────── */}
        <DiasporaPropertyManagementForm defaultPackage={selectedPackage} />

        {/* ─── Buying Jaffna Property Guide Links ───────────────────────── */}
        {!guide && (
          <section className="rounded-2xl border border-sand-300 bg-white p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-[#0f2e25]">
              {tamil ? 'வெளிநாட்டிலிருந்து சொத்து வாங்குதல்' : 'Buying Jaffna Property from Overseas'}
            </h2>
            <p className="mt-4 leading-relaxed text-slate-700">
              {tamil
                ? 'பட்டியல்களை ஒப்பிட்டு, நேரடி அல்லது வீடியோ பார்வையைக் கோருங்கள். பணம் செலுத்தும் முன் உரிமை, விற்பனையாளர், எல்லை, அணுகல் மற்றும் தகுதியை சுயாதீன நிபுணர்களுடன் சரிபாருங்கள்.'
                : 'Compare listings and request an in-person or video viewing. Independently check title, seller authority, boundaries, access and your eligibility before paying.'}
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href="/real-estate/jaffna/" className="rounded-xl bg-teal-800 px-4 py-3 font-semibold text-white">
                {tamil ? 'யாழ்ப்பாண சொத்துகள்' : 'Jaffna properties'}
              </Link>
              <Link href="/lands/clear-title-lands-jaffna/" className="rounded-xl border border-teal-800 px-4 py-3 font-semibold text-teal-800">
                {tamil ? 'காணி உரிமை ஆய்வு' : 'Land title due diligence'}
              </Link>
              <Link href="/safety/" className="rounded-xl border border-teal-800 px-4 py-3 font-semibold text-teal-800">
                {tamil ? 'வாங்குபவர் பாதுகாப்பு' : 'Buyer safety'}
              </Link>
            </div>
          </section>
        )}

        {/* ─── Management FAQ ───────────────────────────────────────────── */}
        <section lang="en" aria-labelledby="management-faq">
          <h2 id="management-faq" className="text-2xl font-bold text-[#0f2e25]">
            {tamil ? 'அடிக்கடி கேட்கப்படும் கேள்விகள்' : 'Property Management & Inspection FAQs'}
          </h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {PROPERTY_MANAGEMENT_FAQS.map((item) => (
              <div key={item.q} className="rounded-2xl border border-sand-300 bg-white p-5">
                <h3 className="font-bold text-slate-900">{item.q}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-700">{item.a}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
