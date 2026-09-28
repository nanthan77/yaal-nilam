'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useStore } from '@/lib/store';
import { MANAGEMENT_PACKAGES, POA_GUIDANCE_STEPS, PROPERTY_MANAGEMENT_FAQS } from '@/lib/diaspora';
import DiasporaPackageCard from './DiasporaPackageCard';
import DiasporaPropertyManagementForm from './DiasporaPropertyManagementForm';

export default function DiasporaHomeClient({ guide = false }: { guide?: boolean }) {
  const locale = useStore((state) => state.locale);
  const tamil = locale === 'ta';
  const [selectedPackage, setSelectedPackage] = useState(guide ? 'premium' : 'basic');
  const selectPackage = (id: string) => {
    setSelectedPackage(id);
    document.getElementById('enquire-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    document.getElementById('management-name')?.focus({ preventScroll: true });
  };

  return <div className="bg-sand-50" lang={locale}>
    <section className="bg-[#0f2e25] px-4 py-14 text-white sm:px-6">
      <div className="mx-auto max-w-6xl">
        <p className="text-sm font-semibold text-[#efd081]">{tamil ? 'வெளிநாடு வாழ் சொத்து உரிமையாளர்களுக்கு' : 'For overseas property owners'}</p>
        <h1 className="mt-4 max-w-4xl break-words text-3xl font-bold leading-snug sm:text-5xl">{guide
          ? (tamil ? 'சொத்து அதிகாரப் பத்திரம்: ஆலோசனை பெற வேண்டியவை' : 'Power of Attorney for Sri Lanka Property')
          : (tamil ? 'வெளிநாட்டில் இருந்து உங்கள் யாழ்ப்பாண வீட்டைப் பராமரிக்கவும்' : 'Manage Your Jaffna Home & Buy from Abroad')}</h1>
        <p className="mt-5 max-w-3xl leading-relaxed text-sand-200">{guide
          ? (tamil ? 'அதிகாரப் பத்திரம் தயாரிப்பதற்கு அல்லது பயன்படுத்துவதற்கு முன் சுயாதீன சட்டத்தரணியுடன் கலந்துரையாட உதவும் கேள்விகள்.' : 'Questions to discuss with an independent lawyer before granting or relying on a Power of Attorney.')
          : (tamil ? 'வீட்டு ஆய்வு, பராமரிப்பு, வாடகை நிர்வாகம் மற்றும் தொலைதூர சொத்து விசாரணைக்கான சேவைகளைத் தேர்ந்தெடுக்கவும்.' : 'Explore inspection, property care, rental management and remote enquiry support for Jaffna homes and land.')}</p>
        <nav aria-label={tamil ? 'புலம்பெயர் சேவைகள்' : 'Diaspora services'} className="mt-7 flex flex-wrap gap-3">
          {!guide && <a href="#packages" className="rounded-xl bg-[#efd081] px-4 py-3 font-semibold text-[#0f2e25]">{tamil ? 'திட்டங்கள் மற்றும் கட்டணங்கள்' : 'Packages & fees'}</a>}
          <a href="#enquire-form" className="rounded-xl border border-white/40 px-4 py-3 font-semibold">{tamil ? 'பராமரிப்பு விசாரணை' : 'Management enquiry'}</a>
          <Link href="/properties/" className="rounded-xl border border-white/40 px-4 py-3 font-semibold">{tamil ? 'சொத்துகளைப் பாருங்கள்' : 'Browse properties'}</Link>
        </nav>
      </div>
    </section>

    <div className="mx-auto max-w-6xl space-y-14 px-4 py-12 sm:px-6">
      {!guide && <>
        <section aria-labelledby="management-services">
          <h2 id="management-services" className="text-2xl font-bold text-[#0f2e25]">{tamil ? 'உள்ளூர் பராமரிப்பு, தொலைதூர தொடர்பு' : 'Local care, with updates wherever you live'}</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {(tamil ? ['வீடு மற்றும் எல்லை ஆய்வு', 'புகைப்படம் மற்றும் வீடியோ அறிக்கைகள்', 'மதிப்பீடு → உரிமையாளர் ஒப்புதல் → வேலை ஆதாரம்', 'வாடகை மற்றும் பராமரிப்பு ஒருங்கிணைப்பு'] : ['Property and boundary inspections', 'Photo and video reports', 'Quote → owner approval → completion evidence', 'Rental and maintenance coordination']).map((label) => <p key={label} className="rounded-2xl border border-sand-300 bg-white p-5 font-semibold text-slate-700">{label}</p>)}
          </div>
        </section>
        <section id="packages" className="scroll-mt-28" aria-labelledby="package-heading">
          <h2 id="package-heading" className="text-2xl font-bold text-[#0f2e25]">{tamil ? 'சொத்து நிர்வாகத் திட்டங்கள்' : 'Property management packages'}</h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">{tamil ? 'சேவையின் இடம், வருகைகளின் எண்ணிக்கை, பணிகள் மற்றும் இறுதிக் கட்டணங்களை எழுத்து ஒப்பந்தத்தில் உறுதிப்படுத்தவும்.' : 'Confirm service coverage, visit frequency, scope and final fees in a written agreement.'}</p>
          <div className="mt-9 grid gap-8 lg:grid-cols-3">{MANAGEMENT_PACKAGES.map((pkg) => <DiasporaPackageCard key={pkg.id} pkg={pkg} locale={locale} onSelect={selectPackage} />)}</div>
        </section>
      </>}

      <section id="poa-guide" className="scroll-mt-28" aria-labelledby="poa-heading">
        <h2 id="poa-heading" className="text-2xl font-bold text-[#0f2e25]">{tamil ? 'அதிகாரப் பத்திரம்: சுயாதீன சட்ட ஆலோசனை' : 'Power of Attorney: independent legal advice'}</h2>
        <p className="mt-3 text-sm leading-relaxed text-slate-600">{tamil ? 'தேவைகள் உங்கள் ஆவணம், பரிவர்த்தனை மற்றும் கையெழுத்திடும் இடத்தைப் பொறுத்தது. பட்டியல் வெளியீடு அல்லது யாழ் நிலம் மதிப்பாய்வு உரிமை அல்லது பத்திரத்திற்கான சட்டச் சான்று அல்ல.' : 'Requirements depend on the document, transaction and place of signing. Publication or platform review does not certify ownership or deeds.'}</p>
        <div className="mt-6 grid gap-5 md:grid-cols-2">{POA_GUIDANCE_STEPS.map((step) => <article key={step.step} className="min-w-0 break-words rounded-2xl border border-sand-300 bg-white p-6">
          <h3 className="text-lg font-bold text-[#0f2e25]">{step.step}. {tamil ? step.title_ta : step.title}</h3>
          <p className="mt-3 text-sm leading-relaxed text-slate-700">{tamil ? step.desc_ta : step.desc}</p>
        </article>)}</div>
        {!guide && <Link href="/diaspora/power-of-attorney-guide/" className="mt-5 inline-block font-semibold text-teal-800 underline">{tamil ? 'அதிகாரப் பத்திர வழிகாட்டியைப் பாருங்கள்' : 'Read the Power of Attorney guide'}</Link>}
      </section>

      <DiasporaPropertyManagementForm defaultPackage={selectedPackage} />

      {!guide && <section className="rounded-2xl border border-sand-300 bg-white p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-[#0f2e25]">{tamil ? 'வெளிநாட்டிலிருந்து சொத்து வாங்குதல்' : 'Buying Jaffna property from overseas'}</h2>
        <p className="mt-4 leading-relaxed text-slate-700">{tamil ? 'பட்டியல்களை ஒப்பிட்டு, நேரடி அல்லது வீடியோ பார்வையைக் கோருங்கள். பணம் செலுத்தும் முன் உரிமை, விற்பனையாளர், எல்லை, அணுகல் மற்றும் தகுதியை சுயாதீன நிபுணர்களுடன் சரிபாருங்கள்.' : 'Compare listings and request an in-person or video viewing. Independently check title, seller authority, boundaries, access and your eligibility before paying.'}</p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link href="/real-estate/jaffna/" className="rounded-xl bg-teal-800 px-4 py-3 font-semibold text-white">{tamil ? 'யாழ்ப்பாண சொத்துகள்' : 'Jaffna properties'}</Link>
          <Link href="/lands/clear-title-lands-jaffna/" className="rounded-xl border border-teal-800 px-4 py-3 font-semibold text-teal-800">{tamil ? 'காணி உரிமை ஆய்வு' : 'Land title due diligence'}</Link>
          <Link href="/safety/" className="rounded-xl border border-teal-800 px-4 py-3 font-semibold text-teal-800">{tamil ? 'வாங்குபவர் பாதுகாப்பு' : 'Buyer safety'}</Link>
        </div>
      </section>}
      <section lang="en" aria-labelledby="management-faq">
        <h2 id="management-faq" className="text-2xl font-bold text-[#0f2e25]">Property management questions</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">{PROPERTY_MANAGEMENT_FAQS.map((item) => <div key={item.q} className="rounded-2xl border border-sand-300 bg-white p-5"><h3 className="font-bold text-slate-900">{item.q}</h3><p className="mt-2 text-sm leading-relaxed text-slate-700">{item.a}</p></div>)}</div>
      </section>
    </div>
  </div>;
}
