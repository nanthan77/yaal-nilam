'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ArrowRight, Bell, Building2, ChevronRight, Home, MapPin, MessageCircle, Phone, Search, ShieldCheck, TreePine } from 'lucide-react';
import PropertyCard from '@/components/PropertyCard';
import VoiceSearch from '@/components/VoiceSearch';
import { PROPERTY_TYPES } from '@/lib/data';
import { DEFAULT_AREA_CATALOG, DEFAULT_PROPERTY_CATALOG, getAreas, getProperties } from '@/lib/firestore';
import { useStore } from '@/lib/store';
import { BRAND, buildBrandWhatsAppUrl } from '@/lib/brand';
import { localize } from '@/lib/translations';
import type { NormalizedArea, NormalizedListing } from '@/lib/marketplace';

type ListingCategory = 'all' | 'house' | 'land' | 'rent';

export default function EditorialHome({ initialProperties }: { initialProperties?: NormalizedListing[] }) {
  const { locale } = useStore();
  const router = useRouter();
  const [properties, setProperties] = useState<NormalizedListing[]>(initialProperties ?? DEFAULT_PROPERTY_CATALOG);
  const [areas, setAreas] = useState<NormalizedArea[]>(DEFAULT_AREA_CATALOG);
  const [loading, setLoading] = useState(initialProperties === undefined);
  const [loadError, setLoadError] = useState(false);
  const [refresh, setRefresh] = useState(0);
  const [intent, setIntent] = useState('sell');
  const [area, setArea] = useState('');
  const [type, setType] = useState('');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<ListingCategory>('all');

  useEffect(() => {
    let mounted = true;
    setLoadError(false);
    getProperties()
      .then(async (listings) => {
        const areaList = await getAreas(listings);
        if (!mounted) return;
        setProperties(listings);
        setAreas(areaList);
      })
      .catch(() => { if (mounted) setLoadError(true); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, [refresh]);

  const copy = localize(locale, {
    en: {
      eyebrow: 'Homes. Land. A place of your own.', title: 'Your next chapter,', titleAccent: 'in Jaffna.',
      intro: 'Find homes, land and rentals. Compare the details, then connect locally.',
      buy: 'Buy', rent: 'Rent', short: 'Short stay', shortCompact: 'Short stay',
      area: 'Location', allAreas: 'All areas', type: 'Property type', allTypes: 'All types',
      keyword: 'Keyword', keywordPlaceholder: 'Street, landmark or property name', search: 'Search',
      browse: 'Browse all properties', visualLabel: 'Illustration · not a listing photo',
      featured: 'Find a place that feels right', featuredIntro: 'Explore current property listings across the peninsula.',
      all: 'All properties', houses: 'Homes', land: 'Land', rentals: 'Rentals', viewAll: 'View all',
      empty: 'No listings match this selection right now.', emptyAll: 'There are no current listings to show. You can set an alert or check again later.',
      unavailable: 'Listings could not be refreshed. Please try again.', retry: 'Try again',
      areas: 'Start with a neighbourhood', areasIntro: 'Explore the places you know. Discover a few you might love.', viewAreas: 'All areas', areaListings: 'listings',
      help: 'From searching to stepping inside',
      stepOne: 'Find your match', stepOneBody: 'Choose an area and a property type. Save your favourites and compare up to three.',
      stepTwo: 'Look a little closer', stepTwoBody: 'Review the supplied photos, price, land size and property details.',
      stepThree: 'Meet it in person', stepThreeBody: 'Contact the listing agent or send a viewing request when you are ready.',
      disclaimer: 'Platform listing review is not legal certification of ownership or deeds. Check title and survey documents independently.',
      waTitle: 'A little local help goes a long way.', waBody: 'Share your preferred area and budget with our WhatsApp property assistant. For personal help, call our team.',
      waAction: 'Ask on WhatsApp', call: 'Call our team',
      alertTitle: 'Still looking for the one?', alertBody: 'Set your preferences and hear about matching listings.', alertAction: 'Create a property alert',
      listTitle: 'Your property. Their next chapter.', listBody: 'Add the photos and details buyers and renters need to take the next step.', listAction: 'List your property',
      quickHouse: 'Houses for sale', quickLand: 'Land for sale', quickRent: 'Homes to rent', popular: 'Explore',
    },
    ta: {
      eyebrow: 'வீடு. காணி. உங்களுக்கான இடம்.', title: 'உங்கள் அடுத்த அத்தியாயம்,', titleAccent: 'யாழ்ப்பாணத்தில்.',
      intro: 'வீடுகள், காணிகள், வாடகை இடங்களைத் தேடுங்கள். விவரங்களை ஒப்பிட்டு, உள்ளூரில் தொடர்பு கொள்ளுங்கள்.',
      buy: 'வாங்க', rent: 'வாடகை', short: 'குறுகிய தங்கல்', shortCompact: 'தங்கல்',
      area: 'பகுதி', allAreas: 'எல்லாப் பகுதிகளும்', type: 'சொத்து வகை', allTypes: 'எல்லா வகைகளும்',
      keyword: 'தேடல் சொல்', keywordPlaceholder: 'வீதி, அருகிலுள்ள இடம் அல்லது சொத்தின் பெயர்', search: 'தேடுங்கள்',
      browse: 'அனைத்து சொத்துகளும்', visualLabel: 'விளக்கப்படம் · பட்டியல் படம் அல்ல',
      featured: 'உங்களுக்கான இடத்தைக் கண்டறியுங்கள்', featuredIntro: 'யாழ் குடாநாடு முழுவதும் உள்ள தற்போதைய சொத்து பட்டியல்கள்.',
      all: 'அனைத்தும்', houses: 'வீடுகள்', land: 'காணிகள்', rentals: 'வாடகை', viewAll: 'அனைத்தும்',
      empty: 'இந்தத் தேர்விற்கு இப்போது பட்டியல்கள் இல்லை.', emptyAll: 'இப்போது பட்டியல்கள் இல்லை. அறிவிப்பை அமைக்கவும் அல்லது பின்னர் மீண்டும் பார்க்கவும்.',
      unavailable: 'பட்டியல்களைப் புதுப்பிக்க முடியவில்லை. மீண்டும் முயற்சிக்கவும்.', retry: 'மீண்டும் முயற்சி',
      areas: 'உங்கள் பகுதியிலிருந்து தொடங்குங்கள்', areasIntro: 'பழகிய பகுதிகளையும் புதிய இடங்களையும் கண்டறியுங்கள்.', viewAreas: 'எல்லாப் பகுதிகளும்', areaListings: 'பட்டியல்கள்',
      help: 'தேடலில் இருந்து நேரில் பார்ப்பது வரை',
      stepOne: 'பொருத்தமான இடத்தைத் தேடுங்கள்', stepOneBody: 'பகுதி மற்றும் சொத்து வகையைத் தேர்ந்தெடுக்கவும். விருப்பமானவற்றைச் சேமித்து, மூன்று சொத்துகள் வரை ஒப்பிடவும்.',
      stepTwo: 'விவரங்களைப் பாருங்கள்', stepTwoBody: 'வழங்கப்பட்ட படங்கள், விலை, காணி அளவு மற்றும் சொத்து விவரங்களைப் பாருங்கள்.',
      stepThree: 'நேரில் பாருங்கள்', stepThreeBody: 'பட்டியல் தொடர்பாளரை அணுகவும் அல்லது பார்வைக் கோரிக்கை அனுப்பவும்.',
      disclaimer: 'பட்டியல் மதிப்பாய்வு என்பது உரிமை அல்லது உறுதிக்கான சட்டச் சான்று அல்ல. உறுதி மற்றும் நில அளவை ஆவணங்களைத் தனியாகச் சரிபார்க்கவும்.',
      waTitle: 'உள்ளூர் உதவி, எளிதான அடுத்த படி.', waBody: 'விரும்பும் பகுதி மற்றும் பட்ஜெட்டை WhatsApp சொத்து உதவியாளருடன் பகிருங்கள். நேரடி உதவிக்கு எங்கள் குழுவை அழைக்கவும்.',
      waAction: 'WhatsApp-ல் கேளுங்கள்', call: 'எங்களை அழைக்கவும்',
      alertTitle: 'இன்னும் தேடுகிறீர்களா?', alertBody: 'உங்கள் விருப்பங்களை அமைத்து, பொருத்தமான பட்டியல்களை அறியுங்கள்.', alertAction: 'சொத்து அறிவிப்பை அமைக்கவும்',
      listTitle: 'உங்கள் சொத்து. புதிய தொடக்கம்.', listBody: 'வாங்குவோரும் வாடகைக்கு எடுப்போரும் அறிய வேண்டிய படங்களையும் விவரங்களையும் சேர்க்கவும்.', listAction: 'சொத்தைச் சேர்க்கவும்',
      quickHouse: 'விற்பனை வீடுகள்', quickLand: 'விற்பனை காணிகள்', quickRent: 'வாடகை வீடுகள்', popular: 'கண்டறியுங்கள்',
    },
  });
  const typeNames: Record<string, string> = locale === 'ta'
    ? { House: 'வீடு', Apartment: 'அபார்ட்மென்ட்', Villa: 'வில்லா', Land: 'காணி', Commercial: 'வணிக இடம்' }
    : { House: 'House', Apartment: 'Apartment', Villa: 'Villa', Land: 'Land', Commercial: 'Commercial' };
  const searchParams = new URLSearchParams({ intent });
  if (area) searchParams.set('area', area);
  if (type) searchParams.set('type', type.toLowerCase());
  if (query.trim()) searchParams.set('q', query.trim());
  const searchHref = '/properties?' + searchParams.toString();
  const displayed = [...properties].sort((a, b) => Number(b.featured) - Number(a.featured)).filter((property) =>
    category === 'all' || (category === 'house' ? ['house', 'villa', 'apartment'].includes(property.property_type.toLowerCase())
      : category === 'land' ? property.property_type.toLowerCase() === 'land' : property.intent === 'rent' || property.intent === 'short_rent')).slice(0, 6);
  const shownAreas = [...areas].sort((a, b) => Number(b.featured) - Number(a.featured)).slice(0, 6);
  const intents = [{ value: 'sell', label: copy.buy, compact: copy.buy, icon: Home }, { value: 'rent', label: copy.rent, compact: copy.rent, icon: Building2 }, { value: 'short_rent', label: copy.short, compact: copy.shortCompact, icon: TreePine }];
  const categories: { value: ListingCategory; label: string }[] = [{ value: 'all', label: copy.all }, { value: 'house', label: copy.houses }, { value: 'land', label: copy.land }, { value: 'rent', label: copy.rentals }];
  const steps = [{ title: copy.stepOne, body: copy.stepOneBody, icon: Search }, { title: copy.stepTwo, body: copy.stepTwoBody, icon: ShieldCheck }, { title: copy.stepThree, body: copy.stepThreeBody, icon: Home }];
  const whatsappHref = buildBrandWhatsAppUrl(locale === 'ta' ? 'வணக்கம்! யாழ்ப்பாணத்தில் சொத்து தேட உதவி வேண்டும்.' : 'Hello! I would like help finding a property in Jaffna.');

  return (
    <div className="yn-home min-h-screen">
      {process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_ENABLE_PROPERTY_FIXTURES === 'true' && <div role="note" className="border-b border-amber-200 bg-amber-50 px-4 py-3 text-center text-xs font-semibold leading-6 text-amber-950">{locale === 'ta' ? 'DEVELOPMENT PREVIEW · மாதிரி பட்டியல்கள். உண்மையான சொத்துகள் அல்ல. WhatsApp விசாரணைகள் முடக்கப்பட்டுள்ளன.' : 'DEVELOPMENT PREVIEW · Sample inventory, not real properties. WhatsApp inquiries are disabled.'}</div>}
      <section className="yn-home-hero">
        <div className="yn-home-container yn-hero-inner">
          <div className="yn-hero-heading">
            <div className="yn-hero-copy">
              <p className="yn-eyebrow">{copy.eyebrow}</p>
              <h1>{copy.title} <span>{copy.titleAccent}</span></h1>
              <p className="yn-hero-intro">{copy.intro}</p>
            </div>
            <figure className="yn-hero-art">
              <Image src="/design/jaffna-house-illustration.webp" alt={locale === 'ta' ? 'யாழ்ப்பாண பாணி வீட்டின் விளக்கப்படம்; விற்பனைப் பட்டியல் அல்ல' : 'Illustration of a Jaffna-style home; not a property listing'} fill priority sizes="(max-width: 639px) 96px, (max-width: 1023px) 200px, 380px" className="object-cover" />
              <figcaption>{copy.visualLabel}</figcaption>
            </figure>
          </div>
          <form action="/properties/" method="get" role="search" aria-label={locale === 'ta' ? 'சொத்து தேடல்' : 'Property search'} onSubmit={(event) => { event.preventDefault(); router.push(searchHref); }} className="yn-home-search">
            <input type="hidden" name="intent" value={intent} />
            <div className="yn-search-intents" role="group" aria-label={locale === 'ta' ? 'தேடல் வகை' : 'Search purpose'}>
              {intents.map(({ icon: Icon, ...item }) => <button key={item.value} type="button" onClick={() => setIntent(item.value)} aria-label={item.label} aria-pressed={intent === item.value}><Icon size={18} aria-hidden="true" /><span className="yn-intent-full">{item.label}</span><span className="yn-intent-compact">{item.compact}</span></button>)}
            </div>
            <div className="yn-search-fields">
              <label className="yn-search-field">{copy.area}<select name="area" value={area} onChange={(event) => setArea(event.target.value)}><option value="">{copy.allAreas}</option>{areas.map((item) => <option key={item.slug} value={item.slug}>{locale === 'ta' ? item.name_ta || item.name : item.name}</option>)}</select></label>
              <label className="yn-search-field">{copy.type}<select name="type" value={type} onChange={(event) => setType(event.target.value)}><option value="">{copy.allTypes}</option>{PROPERTY_TYPES.map((item) => <option key={item} value={item.toLowerCase()}>{typeNames[item] || item}</option>)}</select></label>
              <div className="yn-search-field yn-keyword-field"><label htmlFor="yn-search-keyword">{copy.keyword}</label><div className="yn-keyword-input"><Search size={18} aria-hidden="true" /><input id="yn-search-keyword" name="q" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={copy.keywordPlaceholder} /><VoiceSearch variant="inline" /></div></div>
              <button type="submit" className="yn-search-submit"><Search size={20} aria-hidden="true" /><span>{copy.search}</span></button>
            </div>
          </form>
          <div className="yn-hero-links"><span>{copy.popular}</span><Link href="/properties?intent=sell&type=house">{copy.quickHouse}<ArrowRight size={14} aria-hidden="true" /></Link><Link href="/properties?intent=sell&type=land">{copy.quickLand}<ArrowRight size={14} aria-hidden="true" /></Link><Link href="/properties?intent=rent">{copy.quickRent}<ArrowRight size={14} aria-hidden="true" /></Link></div>
        </div>
      </section>

      <section id="featured" className="yn-home-container yn-home-section" aria-labelledby="yn-featured-title">
        <div className="yn-section-heading"><div><h2 id="yn-featured-title" className="yn-section-title">{copy.featured}</h2><p>{copy.featuredIntro}</p></div><Link href="/properties" className="yn-text-link">{copy.viewAll}<ArrowRight size={18} aria-hidden="true" /></Link></div>
        <div className="yn-listing-categories" role="group" aria-label={locale === 'ta' ? 'பட்டியல் வகைகள்' : 'Listing categories'}>{categories.map((item) => <button key={item.value} type="button" aria-pressed={category === item.value} onClick={() => setCategory(item.value)}>{item.label}</button>)}</div>
        {loadError && <div role="status" className="yn-load-message">{copy.unavailable}<button type="button" onClick={() => setRefresh((value) => value + 1)}>{copy.retry}</button></div>}
        {loading ? <div className="yn-property-grid" role="status" aria-label={locale === 'ta' ? 'பட்டியல்கள் ஏற்றப்படுகின்றன' : 'Loading listings'}>{[0, 1, 2].map((index) => <div key={index} className="h-[410px] animate-pulse rounded-2xl bg-[#e7ece5]" />)}</div>
          : displayed.length ? <div className="yn-property-grid">{displayed.map((property) => <PropertyCard key={property.id} property={property} />)}</div>
            : <div className="yn-home-empty"><Home size={32} aria-hidden="true" /><p>{properties.length ? copy.empty : copy.emptyAll}</p><Link href="/alerts" className="yn-text-link">{copy.alertAction}<ArrowRight size={18} aria-hidden="true" /></Link></div>}
        <Link href="/properties" className="yn-browse-button">{copy.browse}<ArrowRight size={18} aria-hidden="true" /></Link>
      </section>

      <section className="yn-areas-section"><div className="yn-home-container yn-home-section"><div className="yn-section-heading"><div><h2 className="yn-section-title">{copy.areas}</h2><p>{copy.areasIntro}</p></div><Link href="/areas" className="yn-text-link">{copy.viewAreas}<ArrowRight size={18} aria-hidden="true" /></Link></div><div className="yn-area-grid">{shownAreas.map((item) => <Link key={item.slug} href={'/areas/' + item.slug} className="yn-neighbourhood"><span className="yn-neighbourhood-icon"><MapPin size={23} aria-hidden="true" /></span><span className="min-w-0"><span className="block font-bold text-[#0d3935]">{locale === 'ta' ? item.name_ta || item.name : item.name}</span><span className="block text-sm text-[#68756d]">{Number(item.properties_count) > 0 ? `${item.properties_count} ${copy.areaListings}` : locale === 'ta' ? item.name : item.name_ta || 'Jaffna'}</span></span><ChevronRight size={18} aria-hidden="true" /></Link>)}</div></div></section>

      <section className="yn-home-container yn-home-section"><div className="yn-local-help"><span className="yn-local-help-icon"><MessageCircle size={32} aria-hidden="true" /></span><div><h2>{copy.waTitle}</h2><p>{copy.waBody}</p></div><div className="yn-local-help-actions"><a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="yn-primary-link"><MessageCircle size={18} aria-hidden="true" />{copy.waAction}</a><a href={BRAND.phoneTel} className="yn-text-link"><Phone size={16} aria-hidden="true" />{copy.call}</a></div></div></section>

      <section className="yn-home-container yn-home-section yn-how-section"><h2 className="yn-section-title">{copy.help}</h2><div className="yn-steps">{steps.map((step, index) => { const Icon = step.icon; return <div key={step.title}><span className="yn-step-icon"><Icon size={22} aria-hidden="true" /></span><p className="text-xs font-bold text-[#8a6227]">0{index + 1}</p><h3>{step.title}</h3><p>{step.body}</p></div>; })}</div><p className="yn-review-note"><ShieldCheck size={18} aria-hidden="true" />{copy.disclaimer}</p></section>

      <section className="yn-home-final"><div className="yn-home-container yn-final-grid"><div><Bell size={24} aria-hidden="true" /><h2>{copy.alertTitle}</h2><p>{copy.alertBody}</p><Link href="/alerts">{copy.alertAction}<ArrowRight size={18} aria-hidden="true" /></Link></div><div><Home size={24} aria-hidden="true" /><h2>{copy.listTitle}</h2><p>{copy.listBody}</p><Link href="/add-listing">{copy.listAction}<ArrowRight size={18} aria-hidden="true" /></Link></div></div></section>
    </div>
  );
}
