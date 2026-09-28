'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import PropertyCard from './PropertyCard';
import { getProperties } from '@/lib/firestore';
import { ALL_LOCATIONS } from '@/lib/locations';
import type { NormalizedListing } from '@/lib/marketplace';
import { useStore } from '@/lib/store';

type Hub = 'latest' | 'region' | 'jaffna' | 'land';
const headings = {
  latest: { en: 'Current Jaffna property listings', ta: 'தற்போதைய யாழ்ப்பாண சொத்துப் பட்டியல்கள்' },
  region: { en: 'Northern Province real estate', ta: 'வட மாகாணச் சொத்துகள்' },
  jaffna: { en: 'Jaffna District real estate', ta: 'யாழ்ப்பாண மாவட்டச் சொத்துகள்' },
  land: { en: 'Jaffna land listings and title due diligence', ta: 'யாழ்ப்பாண காணிகளும் உரிமை ஆய்வும்' },
};

export default function PublicListingHub({ mode, initialProperties }: { mode: Hub; initialProperties: NormalizedListing[] }) {
  const locale = useStore((state) => state.locale);
  const tamil = locale === 'ta';
  const [properties, setProperties] = useState(initialProperties);
  const [loading, setLoading] = useState(!initialProperties.length);
  const [loadError, setLoadError] = useState(false);
  useEffect(() => {
    let mounted = true;
    getProperties().then((rows) => { if (mounted) setProperties(rows); }).catch(() => { if (mounted) setLoadError(true); }).finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);
  const shown = mode === 'land' ? properties.filter((p) => (p.property_type || p.type).toLowerCase() === 'land') : properties;
  const areas = ALL_LOCATIONS.filter((area) => properties.some((p) => p.area_slug === area.slug));

  return <div className="bg-sand-50" lang={locale}>
    <section className="bg-[#0f2e25] px-4 py-14 text-white sm:px-6">
      <div className="mx-auto max-w-6xl">
        <h1 className="max-w-4xl break-words text-3xl font-bold leading-snug sm:text-5xl">{headings[mode][locale]}</h1>
        <p className="mt-5 max-w-3xl leading-relaxed text-sand-200">{tamil ? 'வீடு, காணி மற்றும் வணிகச் சொத்துகளை ஒப்பிட்டு பார்வையிடக் கோருங்கள். விலை, கிடைக்கும் நிலை மற்றும் ஆவணங்களை சுயாதீனமாக உறுதிப்படுத்தவும்.' : 'Compare homes, land and commercial property, then request a viewing. Confirm price, availability and documents independently.'}</p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link href={mode === 'land' ? '/properties/?type=land' : '/properties/'} className="rounded-xl bg-[#efd081] px-4 py-3 font-semibold text-[#0f2e25]">{tamil ? 'வடிகட்டிப் பாருங்கள்' : 'Search with filters'}</Link>
          <Link href="/diaspora/" className="rounded-xl border border-white/40 px-4 py-3 font-semibold">{tamil ? 'வெளிநாட்டு உரிமையாளர் சேவைகள்' : 'Overseas owner services'}</Link>
          {mode === 'latest' && <a href="/feed.xml" className="rounded-xl border border-white/40 px-4 py-3 font-semibold">RSS feed</a>}
        </div>
      </div>
    </section>
    <div className="mx-auto max-w-6xl space-y-10 px-4 py-10 sm:px-6">
      {mode === 'land' && <section className="rounded-2xl border border-sand-300 bg-white p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-[#0f2e25]">{tamil ? 'பணம் செலுத்தும் முன் சரிபார்க்க வேண்டியவை' : 'Checks to arrange before signing or paying'}</h2>
        <p className="mt-4 leading-relaxed text-slate-700">{tamil ? 'பட்டியல் வெளியீடு அல்லது தள மதிப்பாய்வு சொத்து உரிமை, பத்திரம் அல்லது எல்லைகளைச் சான்றளிக்காது. உங்கள் பரிவர்த்தனைக்கான சுயாதீன சட்டத்தரணி அல்லது நோட்டரி மற்றும் உரிமம் பெற்ற நில அளவையாளரின் ஆலோசனையைப் பெறுங்கள்.' : 'Publication or platform review does not certify ownership, deeds or boundaries. Obtain transaction-specific advice from an independent Sri Lankan lawyer or notary and a licensed surveyor.'}</p>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-slate-700">{(tamil ? ['விற்பனையாளர் அடையாளம் மற்றும் விற்பனை அதிகாரம்', 'உரிமை வரலாறு, பதிவக தேடல் மற்றும் வில்லங்கங்கள்', 'நில அளவை, எல்லைகள் மற்றும் பாதை அணுகல்', 'பொருந்தும் அனுமதிகள், வரிகள் மற்றும் வாங்கும் தகுதி', 'நேரடி ஆய்வு மற்றும் பணம் செலுத்தும் ஒப்பந்தம்'] : ['Seller identity and authority to sell', 'Title history, registry searches and encumbrances', 'Survey, boundaries and road access', 'Applicable approvals, taxes and ownership eligibility', 'Independent inspection and written payment terms']).map((item) => <li key={item}>{item}</li>)}</ul>
        <Link href="/safety/" className="mt-5 inline-block font-semibold text-teal-800 underline">{tamil ? 'வாங்குபவர் பாதுகாப்பு வழிகாட்டி' : 'Buyer safety guide'}</Link>
      </section>}
      <section aria-labelledby="hub-listings">
        <h2 id="hub-listings" className="text-2xl font-bold text-[#0f2e25]">{tamil ? 'வெளியிடப்பட்ட பட்டியல்கள்' : 'Published listings'}</h2>
        {loadError && <p role="status" className="mt-3 text-sm text-slate-700">{tamil ? 'பட்டியல்களைப் புதுப்பிக்க முடியவில்லை. மீண்டும் முயற்சிக்கவும்.' : 'We could not refresh the listings. Please try again.'}</p>}
        {mode === 'latest' && <p className="mt-3 text-sm text-slate-600">{tamil ? 'இங்கு தற்போதைய பட்டியல்களைக் காணலாம்; எல்லாப் பட்டியல்களும் இன்று வெளியிடப்பட்டவை என்று பொருளல்ல.' : 'Browse the current catalogue here. Listings are not necessarily newly published today.'}</p>}
        {shown.length ? <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{shown.map((property) => <PropertyCard key={property.id} property={property} />)}</div> : <p role="status" className="mt-6 rounded-2xl border border-sand-300 bg-white p-6 text-slate-700">{loading ? (tamil ? 'பட்டியல்கள் ஏற்றப்படுகின்றன…' : 'Loading listings…') : (tamil ? 'இப்போது காட்டுவதற்கு பட்டியல்கள் இல்லை. மீண்டும் பார்க்கவும் அல்லது உங்கள் தேவையைத் தெரிவிக்கவும்.' : 'No listings are available to show right now. Please check again or tell us what you need.')}</p>}
      </section>
      {!!areas.length && <section><h2 className="text-2xl font-bold text-[#0f2e25]">{tamil ? 'பகுதிவாரியாக ஆராயுங்கள்' : 'Explore by area'}</h2><div className="mt-5 flex flex-wrap gap-3">{areas.map((area) => <Link key={area.slug} data-published-area={area.slug} href={`/areas/${area.slug}/`} className="rounded-xl border border-sand-300 bg-white px-4 py-3 font-semibold text-teal-800">{tamil ? area.name_ta : area.name}</Link>)}</div></section>}
      <nav aria-label={tamil ? 'தொடர்புடைய வழிகாட்டிகள்' : 'Related guides'} className="flex flex-wrap gap-4 font-semibold text-teal-800 underline">
        <Link href="/real-estate/jaffna/">{tamil ? 'யாழ்ப்பாண மாவட்டம்' : 'Jaffna District'}</Link>
        <Link href="/areas/">{tamil ? 'பகுதி வழிகாட்டிகள்' : 'Area guides'}</Link>
        <Link href="/lands/clear-title-lands-jaffna/">{tamil ? 'காணி உரிமை ஆய்வு' : 'Land due diligence'}</Link>
        <Link href="/request-property/">{tamil ? 'சொத்து கோரிக்கை' : 'Request a property'}</Link>
      </nav>
    </div>
  </div>;
}
