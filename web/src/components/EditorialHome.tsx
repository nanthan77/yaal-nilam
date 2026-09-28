'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ArrowRight, Building2, ChevronRight, Home, MapPin, MessageCircle, Search, ShieldCheck, TreePine } from 'lucide-react';
import PropertyCard from '@/components/PropertyCard';
import VoiceSearch from '@/components/VoiceSearch';
import { PROPERTY_TYPES } from '@/lib/data';
import { DEFAULT_AREA_CATALOG, DEFAULT_PROPERTY_CATALOG, getAreas, getProperties } from '@/lib/firestore';
import { useStore } from '@/lib/store';
import { localize } from '@/lib/translations';
import type { NormalizedListing } from '@/lib/marketplace';

export default function EditorialHome({ initialProperties }: { initialProperties?: NormalizedListing[] }) {
  const { locale } = useStore();
  const router = useRouter();
  const [properties, setProperties] = useState<NormalizedListing[]>(initialProperties ?? DEFAULT_PROPERTY_CATALOG);
  const [areas, setAreas] = useState<any[]>(DEFAULT_AREA_CATALOG);
  const [loading, setLoading] = useState(initialProperties === undefined);
  const [intent, setIntent] = useState('sell');
  const [area, setArea] = useState('');
  const [type, setType] = useState('');
  const [query, setQuery] = useState('');

  useEffect(() => {
    let mounted = true;
    getProperties()
      .then(async (listings) => {
        const areaList = await getAreas(listings);
        if (!mounted) return;
        setProperties(listings);
        setAreas(areaList);
      })
      .catch((error) => console.error('Could not load listings:', error))
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  const copy = localize(locale, {
    en: {
      eyebrow: 'A local way to find your place',
      title: 'Find your place in',
      titleAccent: 'Jaffna.',
      intro: 'Explore homes, land and spaces across the peninsula. Search in your language, compare the details and speak to someone locally.',
      buy: 'Buy', rent: 'Rent', short: 'Short stay',
      area: 'Where?', allAreas: 'All areas', type: 'What kind?', allTypes: 'All property types',
      keyword: 'Search by keyword', keywordPlaceholder: 'Street, landmark or property name',
      search: 'Find properties', browse: 'Browse all listings',
      visualLabel: 'Illustrative image', visualTitle: 'A place to begin your next chapter', visualSubtitle: 'Explore current listings below',
      eyebrowFeatured: 'Discover', featured: 'Properties to explore',
      featuredIntro: 'Current listings, with the information you need to take a closer look.',
      viewAll: 'View all properties', empty: 'No properties are available right now. Browse all listings to check again.',
      eyebrowAreas: 'Around the peninsula', areas: 'Find your area',
      areasIntro: 'Start with a neighborhood you know, or discover somewhere new.',
      viewAreas: 'Browse every area', areaListings: 'listings',
      eyebrowHelp: 'A clearer path', help: 'Move forward with confidence',
      helpIntro: 'A simple way to search, compare and arrange the next step.',
      stepOne: 'Search locally', stepOneBody: 'Filter properties by location, type and whether you want to buy or rent.',
      stepTwo: 'Explore the details', stepTwoBody: 'Review the photos, land size, price and information supplied for each listing.',
      stepThree: 'Arrange a viewing', stepThreeBody: 'Message the listing contact or send a viewing request when you are ready.',
      disclaimer: 'Listing review is not a legal check of ownership or title. Verify deeds and survey details independently before committing.',
      alertEyebrow: 'Keep looking with us', alertTitle: 'Hear about a new match',
      alertBody: 'Tell us what you are looking for and set up a property alert.',
      alertAction: 'Set a property alert',
      listEyebrow: 'Have a property to share?', listTitle: 'Reach buyers and renters across Jaffna',
      listBody: 'Create a listing with the right details so people can find and inquire about your property.',
      listAction: 'Add your property',
    },
    ta: {
      eyebrow: 'உங்கள் ஊரில் உங்கள் இடத்தைத் தேடுங்கள்',
      title: 'உங்கள் இடத்தை',
      titleAccent: 'யாழ்ப்பாணத்தில் கண்டுபிடியுங்கள்.',
      intro: 'யாழ் குடாநாடு முழுவதும் உள்ள வீடுகள், காணிகள், வணிக இடங்களைப் பாருங்கள். உங்கள் மொழியில் தேடி, விவரங்களை ஒப்பிட்டு, உள்ளூரில் தொடர்பு கொள்ளுங்கள்.',
      buy: 'வாங்க', rent: 'வாடகை', short: 'குறுகிய தங்கல்',
      area: 'எங்கே?', allAreas: 'எல்லாப் பகுதிகளும்', type: 'எந்த வகை?', allTypes: 'எல்லா சொத்து வகைகளும்',
      keyword: 'சொல் மூலம் தேடுங்கள்', keywordPlaceholder: 'வீதி, அருகிலுள்ள இடம் அல்லது சொத்தின் பெயர்',
      search: 'சொத்துகளைத் தேடுங்கள்', browse: 'அனைத்து சொத்துகளும்',
      visualLabel: 'விளக்கத்திற்கான படம்', visualTitle: 'புதிய அத்தியாயம் தொடங்கும் இடம்', visualSubtitle: 'தற்போதைய சொத்துகளை கீழே பாருங்கள்',
      eyebrowFeatured: 'கண்டறியுங்கள்', featured: 'பார்க்க வேண்டிய சொத்துகள்',
      featuredIntro: 'தேவையான விவரங்களுடன் தற்போதுள்ள சொத்து பட்டியல்கள்.',
      viewAll: 'எல்லா சொத்துகளையும் பாருங்கள்', empty: 'இப்போது சொத்துகள் இல்லை. புதிய பட்டியல்களுக்காக மீண்டும் பாருங்கள்.',
      eyebrowAreas: 'யாழ் குடாநாடு முழுவதும்', areas: 'உங்கள் பகுதியைக் கண்டறியுங்கள்',
      areasIntro: 'உங்களுக்குத் தெரிந்த பகுதியில் தொடங்குங்கள் அல்லது புதிய இடத்தைப் பாருங்கள்.',
      viewAreas: 'எல்லாப் பகுதிகளும்', areaListings: 'சொத்துகள்',
      eyebrowHelp: 'தெளிவான அடுத்த படி', help: 'நம்பிக்கையுடன் தொடருங்கள்',
      helpIntro: 'தேடவும், ஒப்பிடவும், அடுத்த கட்டத்தை ஏற்பாடு செய்யவும் எளிய வழி.',
      stepOne: 'பகுதிவாரியாக தேடுங்கள்', stepOneBody: 'இடம், சொத்து வகை, வாங்குதல் அல்லது வாடகை ஆகியவற்றின் அடிப்படையில் தேடுங்கள்.',
      stepTwo: 'விவரங்களைப் பாருங்கள்', stepTwoBody: 'ஒவ்வொரு பட்டியலிலும் உள்ள படங்கள், காணி அளவு, விலை மற்றும் வழங்கப்பட்ட தகவல்களைப் பாருங்கள்.',
      stepThree: 'பார்வையை ஏற்பாடு செய்யுங்கள்', stepThreeBody: 'தயாரானதும் WhatsApp வழியாகத் தொடர்பு கொள்ளுங்கள் அல்லது பார்வை கோரிக்கை அனுப்புங்கள்.',
      disclaimer: 'பட்டியல் மதிப்பாய்வு என்பது உரிமை அல்லது உறுதிக்கான சட்டச் சரிபார்ப்பு அல்ல. முடிவு எடுக்கும் முன் உறுதி மற்றும் நில அளவைத் தகவல்களை தனியாகச் சரிபார்க்கவும்.',
      alertEyebrow: 'தொடர்ந்து தேடுங்கள்', alertTitle: 'புதிய பொருத்தமான சொத்தை அறியுங்கள்',
      alertBody: 'நீங்கள் தேடும் சொத்தைச் சொல்லி அறிவிப்பை அமைக்கவும்.',
      alertAction: 'சொத்து அறிவிப்பை அமைக்கவும்',
      listEyebrow: 'விற்க அல்லது வாடகைக்கு விட சொத்து உள்ளதா?', listTitle: 'யாழ்ப்பாணம் முழுவதும் தேடுபவர்களைச் சென்றடையுங்கள்',
      listBody: 'உங்கள் சொத்தை மக்கள் கண்டறிந்து தொடர்பு கொள்ளத் தேவையான விவரங்களுடன் பட்டியலிடுங்கள்.',
      listAction: 'சொத்தைச் சேர்க்கவும்',
    },
  });

  const typeNames: Record<string, string> = locale === 'ta'
    ? { House: 'வீடு', Apartment: 'அபார்ட்மென்ட்', Villa: 'வில்லா', Land: 'காணி', Commercial: 'வணிக இடம்' }
    : { House: 'House', Apartment: 'Apartment', Villa: 'Villa', Land: 'Land', Commercial: 'Commercial' };
  const searchParams = new URLSearchParams();
  searchParams.set('intent', intent);
  if (area) searchParams.set('area', area);
  if (type) searchParams.set('type', type.toLowerCase());
  if (query.trim()) searchParams.set('q', query.trim());
  const searchHref = '/properties?' + searchParams.toString();
  const featured = properties.filter((property) => property.featured);
  const displayed = (featured.length ? featured : properties).slice(0, 6);
  const featuredAreas = areas.filter((item) => item.featured);
  const shownAreas = (featuredAreas.length ? featuredAreas : areas).slice(0, 4);
  const intents = [
    { value: 'sell', label: copy.buy, icon: Home },
    { value: 'rent', label: copy.rent, icon: Building2 },
    { value: 'short_rent', label: copy.short, icon: TreePine },
  ];
  const steps = [
    { n: '01', title: copy.stepOne, body: copy.stepOneBody, icon: Search },
    { n: '02', title: copy.stepTwo, body: copy.stepTwoBody, icon: ShieldCheck },
    { n: '03', title: copy.stepThree, body: copy.stepThreeBody, icon: MessageCircle },
  ];

  return (
    <div className="yn-home min-h-screen">
      <section className="yn-home-hero">
        <div className="mx-auto grid max-w-[1400px] items-center gap-10 px-5 py-12 sm:px-8 lg:grid-cols-[1fr_0.95fr] lg:gap-14 lg:py-20">
          <div className="relative z-10 min-w-0">
            <p className="yn-eyebrow">{copy.eyebrow}</p>
            <h1 className="mt-5 max-w-[680px] break-words text-[clamp(2.65rem,5.2vw,5rem)] font-bold leading-[1.09] tracking-[-0.045em] text-[#0d3935]">
              {copy.title} <span className="text-[#9b6d23]">{copy.titleAccent}</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-8 text-[#596b64] sm:text-lg">{copy.intro}</p>

            <form action="/properties/" method="get" role="search" onSubmit={(event) => { event.preventDefault(); router.push(searchHref); }} className="mt-8 rounded-[22px] border border-[#e0e7df] bg-white p-4 shadow-[0_24px_70px_rgba(11,40,33,0.11)] sm:p-5">
              <input type="hidden" name="intent" value={intent} />
              <div className="mb-5 flex flex-wrap gap-2" role="group" aria-label={locale === 'ta' ? 'தேடல் வகை' : 'Search purpose'}>
                {intents.map((item) => {
                  const Icon = item.icon;
                  return <button key={item.value} type="button" onClick={() => setIntent(item.value)} aria-pressed={intent === item.value}
                    className={'inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-bold transition-colors ' + (intent === item.value ? 'bg-[#0d3935] text-white' : 'bg-[#f2f5ef] text-[#51655d] hover:bg-[#e5ebe4]')}>
                    <Icon className="h-4 w-4" />{item.label}
                  </button>;
                })}
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#63746b]">
                  {copy.area}
                  <select name="area" aria-label={copy.area} value={area} onChange={(event) => setArea(event.target.value)}
                    className="mt-2 w-full rounded-xl border border-[#dce5dc] bg-[#f9faf7] px-4 py-3.5 text-sm font-semibold text-[#193d37] outline-none focus:border-[#0d3935] focus:ring-2 focus:ring-[#0d3935]/15">
                    <option value="">{copy.allAreas}</option>
                    {areas.map((item) => <option key={item.slug} value={item.slug}>{locale === 'ta' ? item.name_ta || item.name : item.name}</option>)}
                  </select>
                </label>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#63746b]">
                  {copy.type}
                  <select name="type" aria-label={copy.type} value={type} onChange={(event) => setType(event.target.value)}
                    className="mt-2 w-full rounded-xl border border-[#dce5dc] bg-[#f9faf7] px-4 py-3.5 text-sm font-semibold text-[#193d37] outline-none focus:border-[#0d3935] focus:ring-2 focus:ring-[#0d3935]/15">
                    <option value="">{copy.allTypes}</option>
                    {PROPERTY_TYPES.map((item) => <option key={item} value={item.toLowerCase()}>{typeNames[item] || item}</option>)}
                  </select>
                </label>
              </div>
              <label htmlFor="yn-search-keyword" className="mt-4 block text-xs font-bold uppercase tracking-wider text-[#63746b]">{copy.keyword}</label>
              <div className="mt-2 flex items-center gap-3 rounded-xl border border-[#dce5dc] bg-[#f9faf7] px-4 focus-within:border-[#0d3935] focus-within:ring-2 focus-within:ring-[#0d3935]/15">
                <Search className="h-5 w-5 shrink-0 text-[#687a70]" />
                <input id="yn-search-keyword" name="q" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={copy.keywordPlaceholder}
                  className="min-w-0 flex-1 bg-transparent py-3.5 text-sm text-[#193d37] outline-none placeholder:text-[#68796e]" />
                <VoiceSearch variant="inline" />
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-4">
                <button type="submit" className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#0d3935] px-6 py-3.5 text-sm font-bold text-white transition-colors hover:bg-[#18574d] sm:flex-none">
                  {copy.search}<ArrowRight className="h-4 w-4" />
                </button>
                <Link href="/properties" className="text-sm font-bold text-[#0d3935] underline-offset-4 hover:underline">{copy.browse}</Link>
              </div>
            </form>
          </div>

          <div className="relative min-h-[360px] overflow-hidden rounded-[24px] bg-[#dfe9dc] sm:min-h-[500px] lg:min-h-[650px]">
            <Image src="/design/jaffna-house-illustration.webp" alt={locale === 'ta' ? 'யாழ்ப்பாண பாணி வீட்டின் விளக்கப்படம்; விற்பனைப் பட்டியல் அல்ல' : 'Illustration of a Jaffna style house, not a property listing'} fill priority sizes="(max-width: 1024px) 100vw, 48vw" className="object-cover" />
            <div className="absolute left-4 top-4 rounded-full bg-[#152f2b]/80 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-white backdrop-blur-sm">{copy.visualLabel}</div>
            <div className="absolute inset-x-4 bottom-4 max-w-sm rounded-2xl border border-white/60 bg-white/95 p-5 shadow-xl backdrop-blur-sm sm:inset-x-auto sm:bottom-8 sm:left-8">
              <p className="text-xs font-bold uppercase tracking-widest text-[#806026]">Yaal Nilam</p>
              <p className="mt-2 text-lg font-bold leading-snug text-[#0d3935]">{copy.visualTitle}</p>
              <p className="mt-1 text-xs text-[#64746c]">{copy.visualSubtitle}</p>
            </div>
          </div>
        </div>
      </section>

      <section id="featured" className="mx-auto max-w-[1400px] px-5 py-16 sm:px-8 lg:py-24">
        <div className="mb-9 flex flex-wrap items-end justify-between gap-5">
          <div><p className="yn-eyebrow">{copy.eyebrowFeatured}</p><h2 className="yn-section-title">{copy.featured}</h2><p className="mt-3 text-[#67766e]">{copy.featuredIntro}</p></div>
          <Link href="/properties" className="inline-flex items-center gap-1 text-sm font-bold text-[#0d3935] hover:underline">{copy.viewAll}<ArrowRight className="h-4 w-4" /></Link>
        </div>
        {loading ? <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">{[0, 1, 2].map((index) => <div key={index} className="h-[410px] animate-pulse rounded-[20px] bg-[#e7ece5]" />)}</div>
          : displayed.length ? <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">{displayed.map((property) => <PropertyCard key={property.id} property={property} />)}</div>
            : <p className="rounded-xl border border-[#dce5dc] bg-white p-8 text-[#596b64]">{copy.empty}</p>}
      </section>

      <section className="bg-white py-16 lg:py-24">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
          <div className="mb-9 flex flex-wrap items-end justify-between gap-5">
            <div><p className="yn-eyebrow">{copy.eyebrowAreas}</p><h2 className="yn-section-title">{copy.areas}</h2><p className="mt-3 text-[#67766e]">{copy.areasIntro}</p></div>
            <Link href="/areas" className="inline-flex items-center gap-1 text-sm font-bold text-[#0d3935] hover:underline">{copy.viewAreas}<ArrowRight className="h-4 w-4" /></Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {shownAreas.map((item, index) => <Link key={item.slug} href={'/areas/' + item.slug} className="yn-area-card group relative flex min-h-[200px] flex-col justify-between overflow-hidden rounded-[20px] p-6 text-white">
              <span className="text-xs font-bold tracking-widest text-[#d0ad6b]">0{index + 1} / JAFFNA</span>
              <span><span className="block text-2xl font-bold">{locale === 'ta' ? item.name_ta || item.name : item.name}</span><span className="mt-1 block text-sm text-white/70">{locale === 'ta' ? item.name : item.name_ta}</span></span>
              <span className="flex items-center justify-between text-xs font-semibold text-white/80">{Number(item.properties_count) > 0 ? item.properties_count + ' ' + copy.areaListings : <span><MapPin className="inline h-4 w-4" /> Jaffna</span>}<ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></span>
            </Link>)}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-5 py-16 sm:px-8 lg:py-24">
        <div className="max-w-2xl"><p className="yn-eyebrow">{copy.eyebrowHelp}</p><h2 className="yn-section-title">{copy.help}</h2><p className="mt-3 text-[#67766e]">{copy.helpIntro}</p></div>
        <div className="mt-9 grid gap-4 md:grid-cols-3">
          {steps.map((step) => { const Icon = step.icon; return <div key={step.n} className="rounded-[20px] border border-[#dee7dd] bg-white p-7">
            <div className="flex items-start justify-between"><span className="rounded-full bg-[#eaf0e8] p-3 text-[#0d3935]"><Icon className="h-5 w-5" /></span><span className="font-serif text-3xl text-[#bf8b39]">{step.n}</span></div>
            <h3 className="mt-7 text-xl font-bold text-[#0d3935]">{step.title}</h3><p className="mt-3 text-sm leading-7 text-[#62736a]">{step.body}</p>
          </div>; })}
        </div>
        <p className="mt-6 text-sm leading-6 text-[#596b60]">{copy.disclaimer}</p>
      </section>

      <section className="bg-[#0d3935] px-5 py-16 text-white sm:px-8">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-20">
          <div><p className="yn-eyebrow text-[#d2a75d]">{copy.alertEyebrow}</p><h2 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl">{copy.alertTitle}</h2><p className="mt-3 max-w-lg text-white/70">{copy.alertBody}</p><Link href="/alerts" className="mt-7 inline-flex max-w-full items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-[#0d3935] hover:bg-[#f2efe5]">{copy.alertAction}<ArrowRight className="h-4 w-4" /></Link></div>
          <div className="border-t border-white/20 pt-9 lg:border-l lg:border-t-0 lg:pl-14 lg:pt-0"><p className="yn-eyebrow text-[#d2a75d]">{copy.listEyebrow}</p><h2 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl">{copy.listTitle}</h2><p className="mt-3 max-w-lg text-white/70">{copy.listBody}</p><Link href="/add-listing" className="mt-7 inline-flex max-w-full items-center gap-2 rounded-full bg-[#c99746] px-6 py-3 text-sm font-bold text-[#0d3935] hover:bg-[#e1b76f]">{copy.listAction}<ArrowRight className="h-4 w-4" /></Link></div>
        </div>
      </section>
    </div>
  );
}
