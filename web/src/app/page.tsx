// @ts-nocheck
'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import {
  Search,
  MapPin,
  Users,
  ShieldCheck,
  Globe,
  TrendingUp,
  Calculator,
  Star,
  MessageCircle,
  Home,
  Building,
  TreePine,
  ChevronRight,
  ArrowRight,
} from 'lucide-react';
import PropertyCard from '@/components/PropertyCard';
import VoiceSearch from '@/components/VoiceSearch';
import { PROPERTIES, AREAS, PROPERTY_TYPES } from '@/lib/data';
import { getProperties, getAreas } from '@/lib/firestore';
import { useStore } from '@/lib/store';
import { formatCompactPrice, localize } from '@/lib/translations';

function MortgageCalculator({ locale }: { locale: 'en' | 'ta' }) {
  const [price, setPrice] = useState(5000000);
  const [down, setDown] = useState(20);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(20);

  const copy = localize(locale, {
    en: {
      title: 'Mortgage Calculator',
      subtitle: 'Estimate your monthly payment',
      propertyPrice: 'Property Price (LKR)',
      downPayment: 'Down Payment (%)',
      interest: 'Interest Rate (%)',
      term: 'Loan Term (years)',
      monthly: 'Estimated Monthly Payment',
      loanAmount: 'Loan Amount',
    },
    ta: {
      title: 'வீட்டு கடன் கணிப்பான்',
      subtitle: 'மாதாந்திர கட்டணத்தை கணிக்கவும்',
      propertyPrice: 'சொத்து விலை (LKR)',
      downPayment: 'முன் கட்டணம் (%)',
      interest: 'வட்டி விகிதம் (%)',
      term: 'கடன் காலம் (ஆண்டுகள்)',
      monthly: 'கணிக்கப்பட்ட மாதக் கட்டணம்',
      loanAmount: 'கடன் தொகை',
    },
  });

  const loanAmount = price * (1 - down / 100);
  const monthlyRate = rate / 100 / 12;
  const numPayments = years * 12;
  const monthly =
    monthlyRate > 0
      ? (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
        (Math.pow(1 + monthlyRate, numPayments) - 1)
      : loanAmount / numPayments;

  return (
    <div className="bg-white rounded-2xl shadow-card-lg p-8 border border-sand-200">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-teal-50 p-3 rounded-xl">
          <Calculator className="w-6 h-6 text-teal-700" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-charcoal-900">{copy.title}</h3>
          <p className="text-sm text-charcoal-500">{copy.subtitle}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="text-sm font-semibold text-charcoal-600 mb-1 block">{copy.propertyPrice}</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="w-full px-3 py-2.5 border border-sand-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none text-charcoal-900"
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-charcoal-600 mb-1 block">{copy.downPayment}</label>
          <input
            type="number"
            value={down}
            onChange={(e) => setDown(Number(e.target.value))}
            className="w-full px-3 py-2.5 border border-sand-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none text-charcoal-900"
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-charcoal-600 mb-1 block">{copy.interest}</label>
          <input
            type="number"
            value={rate}
            onChange={(e) => setRate(Number(e.target.value))}
            step="0.1"
            className="w-full px-3 py-2.5 border border-sand-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none text-charcoal-900"
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-charcoal-600 mb-1 block">{copy.term}</label>
          <input
            type="number"
            value={years}
            onChange={(e) => setYears(Number(e.target.value))}
            className="w-full px-3 py-2.5 border border-sand-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none text-charcoal-900"
          />
        </div>
      </div>
      <div className="bg-gradient-to-r from-teal-900 to-teal-700 rounded-xl p-6 text-center">
        <p className="text-sm text-teal-100 mb-1">{copy.monthly}</p>
        <p className="text-4xl font-black text-white">Rs. {Math.round(monthly).toLocaleString()}</p>
        <p className="text-xs text-teal-200 mt-2">
          {copy.loanAmount}: Rs. {Math.round(loanAmount).toLocaleString()}
        </p>
      </div>
    </div>
  );
}

const TESTIMONIALS = {
  en: [
    {
      name: 'Aravinthan K.',
      area: 'Nallur',
      text: 'We found our family home in Nallur through Yaal Nilam. The WhatsApp follow-up made the process very easy.',
      rating: 5,
    },
    {
      name: 'Priya S.',
      area: 'Jaffna Town',
      text: 'I listed my commercial space and received serious inquiries within the first week. The platform feels local and trustworthy.',
      rating: 5,
    },
    {
      name: 'Kumaran R.',
      area: 'Point Pedro',
      text: 'Being able to browse in Tamil made a big difference for our family. The property details were much clearer.',
      rating: 4,
    },
  ],
  ta: [
    {
      name: 'அரவிந்தன் க.',
      area: 'நல்லூர்',
      text: 'எங்கள் குடும்பத்திற்கான வீட்டை நல்லூரில் யாழ் நிலம் மூலமாக கண்டுபிடித்தோம். WhatsApp வழி தொடர்ந்து தொடர்பில் இருந்தது மிகவும் உதவியாக இருந்தது.',
      rating: 5,
    },
    {
      name: 'பிரியா ச.',
      area: 'யாழ்ப்பாணம்',
      text: 'என் வணிக இடத்தை பட்டியலிட்ட ஒரு வாரத்திற்குள் நம்பகமான விசாரணைகள் வந்தன. தளம் உள்ளூர் தேவையை நன்றாகப் புரிந்திருக்கிறது.',
      rating: 5,
    },
    {
      name: 'குமரன் ர.',
      area: 'பருத்தித்துறை',
      text: 'தமிழில் பார்த்து புரிந்துகொள்ள முடிந்தது எங்கள் குடும்பத்துக்கு பெரும் நிம்மதியைத் தந்தது. சொத்து விவரங்கள் தெளிவாக இருந்தன.',
      rating: 4,
    },
  ],
};

const NEIGHBORHOOD_HIGHLIGHTS = {
  en: [
    {
      area: 'Nallur',
      slug: 'nallur',
      desc: 'A premium residential zone with schools, temples, and strong long-term demand.',
      avgPrice: 8500000,
      trend: '+12%',
    },
    {
      area: 'Jaffna Fort',
      slug: 'jaffna-fort',
      desc: 'Historic character, central access, and a healthy mix of residential and commercial demand.',
      avgPrice: 6200000,
      trend: '+8%',
    },
    {
      area: 'Chunnakam',
      slug: 'chunnakam',
      desc: 'Popular for growing families and investors looking for road connectivity and price value.',
      avgPrice: 4100000,
      trend: '+15%',
    },
    {
      area: 'Point Pedro',
      slug: 'point-pedro',
      desc: 'Strong coastal and land investment interest with tourism upside in selected pockets.',
      avgPrice: 5800000,
      trend: '+10%',
    },
  ],
  ta: [
    {
      area: 'நல்லூர்',
      slug: 'nallur',
      desc: 'பாடசாலைகள், கோவில்கள், மற்றும் நிலையான தேவை காரணமாக உயர்தர குடியிருப்பு பகுதியாகத் திகழ்கிறது.',
      avgPrice: 8500000,
      trend: '+12%',
    },
    {
      area: 'யாழ் கோட்டை',
      slug: 'jaffna-fort',
      desc: 'வரலாற்றுச் சிறப்பும் மையப்பகுதி அணுகலும் உள்ளதால் குடியிருப்புக்கும் வணிகத்துக்கும் ஏற்ற பகுதி.',
      avgPrice: 6200000,
      trend: '+8%',
    },
    {
      area: 'சுன்னாகம்',
      slug: 'chunnakam',
      desc: 'சாலை இணைப்பு, வசதியான விலை, மற்றும் வளர்ந்து வரும் குடியிருப்பு தேவை ஆகியவற்றால் முதலீட்டாளர்களுக்கு விருப்பமான பகுதி.',
      avgPrice: 4100000,
      trend: '+15%',
    },
    {
      area: 'பருத்தித்துறை',
      slug: 'point-pedro',
      desc: 'கடற்கரை மற்றும் காணி முதலீட்டுக்கு நல்ல வாய்ப்புகள் உள்ள வடக்கு பகுதி.',
      avgPrice: 5800000,
      trend: '+10%',
    },
  ],
};

const WHY_US = {
  en: [
    {
      title: 'Verified Listings',
      body: 'Every property is reviewed with accuracy and trust in mind before it is highlighted.',
      icon: ShieldCheck,
      badge: 'bg-teal-50 text-teal-700',
    },
    {
      title: 'WhatsApp-First Support',
      body: 'Speak to us through the channel most families already use every day.',
      icon: MessageCircle,
      badge: 'bg-green-50 text-green-600',
    },
    {
      title: 'Local Expertise',
      body: 'Our recommendations are grounded in real neighborhood knowledge, not generic real-estate language.',
      icon: MapPin,
      badge: 'bg-teal-50 text-teal-700',
    },
    {
      title: 'Bilingual Experience',
      body: 'Browse with confidence in Tamil or English without losing clarity or context.',
      icon: Globe,
      badge: 'bg-warm-50 text-warm-600',
    },
  ],
  ta: [
    {
      title: 'சரிபார்க்கப்பட்ட பட்டியல்கள்',
      body: 'ஒவ்வொரு சொத்தும் நம்பகத்தன்மை மற்றும் துல்லியம் கருத்தில் கொண்டு மதிப்பாய்வு செய்யப்பட்ட பிறகே முன்னிலைப்படுத்தப்படுகிறது.',
      icon: ShieldCheck,
      badge: 'bg-teal-50 text-teal-700',
    },
    {
      title: 'WhatsApp முன்னுரிமை உதவி',
      body: 'பெரும்பாலான குடும்பங்கள் ஏற்கனவே பயன்படுத்தும் WhatsApp வழியாகவே எங்களுடன் உடனே பேசலாம்.',
      icon: MessageCircle,
      badge: 'bg-green-50 text-green-600',
    },
    {
      title: 'உள்ளூர் நிபுணத்துவம்',
      body: 'எங்கள் பரிந்துரைகள் பொதுவான real-estate சொல்லாடல்களில் அல்ல; உண்மையான பகுதி அறிவில் இருந்து உருவாகின்றன.',
      icon: MapPin,
      badge: 'bg-teal-50 text-teal-700',
    },
    {
      title: 'இருமொழி அனுபவம்',
      body: 'தமிழிலும் English-லும்வும் தெளிவை இழக்காமல் சொத்துகளை ஆராயலாம்.',
      icon: Globe,
      badge: 'bg-warm-50 text-warm-600',
    },
  ],
};

export default function HomePage() {
  const { locale } = useStore();
  const [selectedType, setSelectedType] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [properties, setProperties] = useState(PROPERTIES);
  const [areas, setAreas] = useState(AREAS);
  const [loading, setLoading] = useState(true);
  const [activePathway, setActivePathway] = useState('buy');

  const copy = localize(locale, {
    en: {
      eyebrow: "Jaffna's trusted property platform",
      titleStart: 'Find the right property in',
      titleAccent: 'Jaffna',
      heroBody:
        'Browse houses, land, apartments, villas, and commercial spaces across the Jaffna Peninsula with Tamil and English support.',
      pathways: { buy: 'Buy', rent: 'Rent', 'short-stay': 'Short Stay' },
      searchPlaceholder: 'Search by location, area, or property type...',
      searchButton: 'Search Properties',
      chatHelp: 'Chat on WhatsApp for faster help',
      statsListings: 'Active Listings',
      statsAreas: 'Areas Covered',
      statsAgents: 'Verified Agents',
      statsFamilies: 'Happy Families',
      featuredTitle: 'Featured Properties',
      featuredSubtitle: 'Hand-picked listings from across the peninsula',
      areaTitle: 'Browse by Area',
      areaSubtitle: 'Compare neighborhoods and discover where to buy, rent, or invest',
      propertiesLabel: 'properties',
      neighborhoodTitle: 'Neighborhood Guide',
      neighborhoodSubtitle: "Quick market context for some of Jaffna's most searched areas",
      avgPrice: 'Average price',
      explore: 'Explore',
      testimonialsTitle: 'What Our Clients Say',
      testimonialsSubtitle: 'Real feedback from buyers, renters, and owners',
      whyTitle: 'Why Choose Yaal Nilam?',
      whySubtitle: 'A property experience designed around clarity, trust, and local context',
      ctaTitle: 'Ready to List Your Property?',
      ctaBody: 'Bring your property to the right audience with a bilingual platform built for Jaffna.',
      ctaPrimary: 'Add Your Listing',
      ctaSecondary: 'Chat on WhatsApp',
    },
    ta: {
      eyebrow: 'யாழ்ப்பாணத்தின் நம்பகமான சொத்து தளம்',
      titleStart: 'உங்களுக்கான சரியான சொத்தை',
      titleAccent: 'யாழ்ப்பாணத்தில் கண்டுபிடிக்கவும்',
      heroBody:
        'யாழ் குடாநாடு முழுவதும் உள்ள வீடுகள், காணிகள், அபார்ட்மென்ட்கள், வில்லாக்கள், மற்றும் வணிகச் சொத்துக்களை தமிழ் மற்றும் English ஆதரவுடன் ஆராயுங்கள்.',
      pathways: { buy: 'வாங்க', rent: 'வாடகை', 'short-stay': 'குறுகிய தங்கல்' },
      searchPlaceholder: 'இடம், பகுதி, அல்லது சொத்து வகை மூலம் தேடுங்கள்...',
      searchButton: 'சொத்துகளைத் தேடுங்கள்',
      chatHelp: 'வேகமான உதவிக்கு WhatsApp-ல் தொடர்பு கொள்ளுங்கள்',
      statsListings: 'செயலில் உள்ள பட்டியல்கள்',
      statsAreas: 'சேவை வழங்கும் பகுதிகள்',
      statsAgents: 'சரிபார்க்கப்பட்ட முகவர்கள்',
      statsFamilies: 'திருப்தியான குடும்பங்கள்',
      featuredTitle: 'முன்னிலை சொத்துக்கள்',
      featuredSubtitle: 'யாழ் குடாநாடு முழுவதும் இருந்து தேர்ந்தெடுக்கப்பட்ட சொத்துக்கள்',
      areaTitle: 'பகுதிவாரியாகப் பாருங்கள்',
      areaSubtitle: 'வாங்க, வாடகைக்கு எடுக்க, அல்லது முதலீடு செய்ய ஏற்ற பகுதிகளை ஒப்பிட்டு பாருங்கள்',
      propertiesLabel: 'சொத்துக்கள்',
      neighborhoodTitle: 'பகுதி வழிகாட்டி',
      neighborhoodSubtitle: 'அதிகம் தேடப்படும் பகுதிகளுக்கான சுருக்கமான சந்தை விளக்கம்',
      avgPrice: 'சராசரி விலை',
      explore: 'பார்க்கவும்',
      testimonialsTitle: 'எங்கள் வாடிக்கையாளர்கள் சொல்வது',
      testimonialsSubtitle: 'வாங்குபவர்கள், வாடகையாளர்கள், மற்றும் உரிமையாளர்களிடமிருந்து வந்த உண்மையான கருத்துகள்',
      whyTitle: 'ஏன் யாழ் நிலம்?',
      whySubtitle: 'தெளிவு, நம்பிக்கை, மற்றும் உள்ளூர் புரிதலை மையமாகக் கொண்ட சொத்து அனுபவம்',
      ctaTitle: 'உங்கள் சொத்தை பட்டியலிடத் தயாரா?',
      ctaBody: 'யாழ்ப்பாணத்துக்காக வடிவமைக்கப்பட்ட இருமொழி தளத்தின் மூலம் உங்கள் சொத்தை சரியான மக்களிடம் கொண்டு செல்லுங்கள்.',
      ctaPrimary: 'சொத்தைச் சேர்க்கவும்',
      ctaSecondary: 'WhatsApp-ல் பேசுங்கள்',
    },
  });

  useEffect(() => {
    async function loadData() {
      try {
        const [firestoreProps, firestoreAreas] = await Promise.all([getProperties(), getAreas()]);
        if (firestoreProps.length > 0) setProperties(firestoreProps);
        if (firestoreAreas.length > 0) setAreas(firestoreAreas);
      } catch (err) {
        console.error('Firestore load error, using mock data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const featuredProperties = properties.filter((p) => p.featured).slice(0, 6);
  const displayFeatured = featuredProperties.length > 0 ? featuredProperties : properties.slice(0, 6);
  const testimonials = TESTIMONIALS[locale];
  const highlights = NEIGHBORHOOD_HIGHLIGHTS[locale];
  const whyCards = WHY_US[locale];

  const pathways = [
    { key: 'buy', icon: Home },
    { key: 'rent', icon: Building },
    { key: 'short-stay', icon: TreePine },
  ];

  const heroSearchParams = new URLSearchParams(
    Object.entries({
      q: searchQuery || undefined,
      type: selectedType ? selectedType.toLowerCase() : undefined,
      intent:
        activePathway === 'buy'
          ? 'sell'
          : activePathway === 'rent'
            ? 'rent'
            : 'short_rent',
    }).filter(([, value]) => Boolean(value))
  ).toString();

  return (
    <div className="min-h-screen bg-sand-50">
      <section className="relative bg-gradient-to-br from-teal-900 via-teal-800 to-teal-700 text-white py-20 md:py-28 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-teal-400 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-20 w-96 h-96 bg-warm-500 rounded-full blur-3xl" />
        </div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="max-w-3xl">
            <p className="text-warm-400 font-semibold mb-3 text-sm tracking-wider uppercase">{copy.eyebrow}</p>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight font-display">
              {copy.titleStart} <span className="text-warm-400">{copy.titleAccent}</span>
            </h1>
            <p className="text-lg md:text-xl text-teal-100 mb-8 max-w-2xl">{copy.heroBody}</p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-1.5 mb-6 flex overflow-x-auto whitespace-nowrap scrollbar-none max-w-full sm:inline-flex gap-1.5 border border-white/10 shadow-lg">
            {pathways.map((path) => {
              const Icon = path.icon;
              return (
                <button
                  key={path.key}
                  onClick={() => setActivePathway(path.key)}
                  className={`flex items-center gap-2 px-4 sm:px-6 py-3 sm:py-3.5 rounded-xl font-bold transition-all duration-300 shrink-0 whitespace-nowrap ${
                    activePathway === path.key ? 'bg-white text-teal-900 shadow-lg scale-102' : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-4.5 h-4.5" />
                  <span className="text-sm tracking-tight">{copy.pathways[path.key]}</span>
                </button>
              );
            })}
          </div>

          <div className="bg-white rounded-3xl shadow-[0_24px_50px_rgba(15,46,37,0.15)] border border-sand-300/50 p-6 md:p-8 animate-fade-in">
            <div className="flex flex-col md:flex-row gap-4 mb-5">
              <div className="flex-1 flex items-center bg-sand-50/80 rounded-2xl px-4 py-4 border border-sand-200 focus-within:border-teal-700/60 focus-within:ring-4 focus-within:ring-teal-700/5 transition-all">
                <Search className="w-5.5 h-5.5 text-teal-700/80 mr-3" />
                <input
                  id="hero-searchbox"
                  role="searchbox"
                  type="search"
                  placeholder={copy.searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent outline-none text-charcoal-900 placeholder:text-charcoal-400 font-medium text-base"
                />
                <VoiceSearch variant="inline" />
              </div>
              <Link
                href={heroSearchParams ? `/properties?${heroSearchParams}` : '/properties'}
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-teal-950 px-9 py-4 rounded-2xl font-black transition-all hover:-translate-y-0.5 shadow-md flex items-center justify-center gap-2 text-center text-base"
              >
                <Search className="w-4.5 h-4.5 stroke-[3]" />
                <span>{copy.searchButton}</span>
              </Link>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {PROPERTY_TYPES.map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(selectedType === type ? '' : type)}
                  className={`px-4.5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 hover:-translate-y-0.5 ${
                    selectedType === type
                      ? 'bg-teal-700 text-white shadow-md'
                      : 'bg-sand-100/80 text-charcoal-700 hover:bg-sand-200 border border-sand-200'
                  }`}
                >
                  {locale === 'ta'
                    ? {
                        House: 'வீடு',
                        Apartment: 'அபார்ட்மென்ட்',
                        Villa: 'வில்லா',
                        Land: 'காணி',
                        Commercial: 'வணிகச் சொத்து',
                      }[type]
                    : type}
                </button>
              ))}
            </div>
            <div className="mt-4 text-center">
              <a
                href="https://wa.me/94704846555?text=Hi%2C%20I%27m%20looking%20for%20a%20property%20in%20Jaffna"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-bold text-teal-700 hover:text-teal-900 transition-colors"
              >
                <MessageCircle className="w-4.5 h-4.5 text-green-600 fill-green-600" />
                <span>{copy.chatHelp}</span>
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/10">
              <Building className="w-5 h-5 text-warm-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">{properties.length}+</p>
              <p className="text-xs text-teal-200">{copy.statsListings}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/10">
              <MapPin className="w-5 h-5 text-warm-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">{areas.length}</p>
              <p className="text-xs text-teal-200">{copy.statsAreas}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/10">
              <ShieldCheck className="w-5 h-5 text-warm-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">25+</p>
              <p className="text-xs text-teal-200">{copy.statsAgents}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/10">
              <Users className="w-5 h-5 text-warm-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">150+</p>
              <p className="text-xs text-teal-200">{copy.statsFamilies}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto py-16 md:py-20 px-4">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-charcoal-900 mb-2">{copy.featuredTitle}</h2>
            <p className="text-charcoal-500">{copy.featuredSubtitle}</p>
          </div>
          <Link href="/properties" className="hidden md:flex items-center gap-1 text-teal-700 font-semibold hover:text-teal-500 transition-colors">
            {locale === 'ta' ? 'அனைத்தையும் பார்க்கவும்' : 'View All'} <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl overflow-hidden shadow-card animate-pulse">
                <div className="h-52 bg-sand-200" />
                <div className="p-5 space-y-3">
                  <div className="h-5 bg-sand-200 rounded w-3/4" />
                  <div className="h-4 bg-sand-100 rounded w-1/2" />
                  <div className="h-6 bg-sand-200 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayFeatured.slice(0, 6).map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}

        <div className="mt-8 text-center md:hidden">
          <Link href="/properties" className="inline-flex items-center gap-2 text-teal-700 font-semibold">
            {locale === 'ta' ? 'அனைத்து சொத்துகளும்' : 'View All Properties'} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <section className="bg-white py-16 md:py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-charcoal-900 mb-2">{copy.areaTitle}</h2>
              <p className="text-charcoal-500">{copy.areaSubtitle}</p>
            </div>
            <Link href="/areas" className="hidden md:flex items-center gap-1 text-teal-700 font-semibold hover:text-teal-500 transition-colors">
              {locale === 'ta' ? 'அனைத்தையும் பார்க்கவும்' : 'View All'} <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="flex overflow-x-auto md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-4 md:pb-0 scrollbar-none snap-x snap-mandatory">
            {areas.filter((a) => a.featured !== false).slice(0, 4).map((area) => (
              <Link key={area.slug} href={`/areas/${area.slug}`} className="min-w-[260px] md:min-w-0 snap-start group">
                <div className="bg-gradient-to-br from-teal-800 to-teal-600 rounded-xl p-6 text-white hover:shadow-card-lg transition-all duration-300 group-hover:-translate-y-1 min-h-[120px] flex flex-col justify-between h-full">
                  <div>
                    <h3 className="text-xl font-bold mb-0.5">
                      {locale === 'ta' ? area.name_ta || area.name : area.name}
                    </h3>
                    <p className="text-teal-200 text-xs">{locale === 'ta' ? area.name : area.name_ta}</p>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <p className="text-sm font-semibold text-warm-300">
                      {area.properties_count} {copy.propertiesLabel}
                    </p>
                    <ChevronRight className="w-4 h-4 opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-6 text-center md:hidden">
            <Link href="/areas" className="inline-flex items-center gap-2 text-teal-700 font-semibold hover:text-teal-500">
              {locale === 'ta' ? 'அனைத்து பகுதிகளும்' : 'View All Areas'} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto py-16 md:py-20 px-4">
        <div className="mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-charcoal-900 mb-2">{copy.neighborhoodTitle}</h2>
          <p className="text-charcoal-500">{copy.neighborhoodSubtitle}</p>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {highlights.map((n) => (
            <div key={n.slug} className="bg-white rounded-xl p-6 shadow-card hover:shadow-card-lg transition-all border-l-4 border-l-teal-700">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-bold text-charcoal-900">{n.area}</h3>
                <span className="flex items-center gap-1 text-teal-700 text-sm font-semibold bg-teal-50 px-2 py-1 rounded-full">
                  <TrendingUp className="w-3.5 h-3.5" /> {n.trend}
                </span>
              </div>
              <p className="text-charcoal-600 text-sm mb-4">{n.desc}</p>
              <div className="flex items-center justify-between">
                <p className="text-sm text-charcoal-500">
                  {copy.avgPrice}: <span className="font-bold text-teal-700">{formatCompactPrice(n.avgPrice, locale)}</span>
                </p>
                <Link href={`/areas/${n.slug}`} className="text-teal-700 text-sm font-semibold hover:text-teal-500 flex items-center gap-1">
                  {copy.explore} <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-sand-100 py-16 md:py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8">
            <MortgageCalculator locale={locale} />
            <div>
              <h2 className="text-3xl font-bold text-charcoal-900 mb-2">{copy.testimonialsTitle}</h2>
              <p className="text-charcoal-500 mb-6">{copy.testimonialsSubtitle}</p>
              <div className="space-y-4">
                {testimonials.map((testimonial, i) => (
                  <div key={i} className="bg-white rounded-xl p-5 shadow-card border border-sand-200 relative">
                    <span className="absolute top-3 left-5 text-5xl text-teal-700 opacity-10 font-serif leading-none">&ldquo;</span>
                    <div className="flex gap-1 mb-2">
                      {Array.from({ length: 5 }).map((_, s) => (
                        <Star
                          key={s}
                          className={`w-4 h-4 ${s < testimonial.rating ? 'text-warm-500 fill-warm-500' : 'text-charcoal-200'}`}
                        />
                      ))}
                    </div>
                    <p className="text-charcoal-700 text-sm mb-3 relative z-10">&ldquo;{testimonial.text}&rdquo;</p>
                    <p className="text-sm font-semibold text-charcoal-900">
                      {testimonial.name} <span className="text-charcoal-500 font-normal">- {testimonial.area}</span>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto py-16 md:py-20 px-4">
        <div className="mb-10 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-charcoal-900 mb-2">{copy.whyTitle}</h2>
          <p className="text-charcoal-500">{copy.whySubtitle}</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {whyCards.map((card) => {
            const Icon = card.icon;
            return (
              <div key={card.title} className="bg-white rounded-xl p-6 shadow-card hover:shadow-card-lg transition-all text-center border border-sand-200">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 ${card.badge}`}>
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-charcoal-900 mb-2">{card.title}</h3>
                <p className="text-charcoal-500 text-sm">{card.body}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Property alerts CTA */}
      <section className="bg-[#0F2E25] text-white py-14 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[#D4A853] font-bold text-sm uppercase tracking-wider mb-2">
            {locale === 'ta' ? 'சொத்து எச்சரிக்கைகள்' : 'Property alerts'}
          </p>
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            {locale === 'ta'
              ? 'பொருந்தும் புதிய சொத்து வந்ததும் WhatsApp அறிவிப்பு பெறுங்கள்'
              : 'Get a WhatsApp alert when your perfect property is listed'}
          </h2>
          <p className="text-white/70 mb-7 max-w-2xl mx-auto">
            {locale === 'ta'
              ? 'நீங்கள் தேடுவதை ஒருமுறை சொல்லுங்கள் — பொருத்தம் கிடைத்ததும் உடனே தெரிவிப்போம். இலவசம்.'
              : "Tell us what you want once — we'll message you the moment a match goes live. Free."}
          </p>
          <Link
            href="/alerts"
            className="inline-flex items-center justify-center gap-2 bg-[#D4A853] hover:bg-[#c79a45] text-[#0F2E25] px-8 py-3 rounded-lg font-bold transition-all hover:-translate-y-0.5 shadow-lg"
          >
            <MessageCircle className="w-5 h-5" /> {locale === 'ta' ? 'என் எச்சரிக்கையை அமைக்கவும்' : 'Set my alert'}
          </Link>
        </div>
      </section>

      <section className="bg-gradient-to-r from-teal-800 to-teal-700 text-white py-16 px-4 my-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{copy.ctaTitle}</h2>
          <p className="text-lg text-teal-200 mb-8">{copy.ctaBody}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/add-listing"
              className="inline-flex items-center justify-center gap-2 bg-warm-500 hover:bg-warm-400 text-teal-900 px-8 py-3 rounded-lg font-bold transition-all hover:-translate-y-0.5 shadow-lg"
            >
              <Home className="w-5 h-5" /> {copy.ctaPrimary}
            </Link>
            <a
              href="https://wa.me/94704846555?text=Hi%2C%20I%20want%20to%20list%20my%20property"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg font-bold transition-all hover:-translate-y-0.5"
            >
              <MessageCircle className="w-5 h-5" /> {copy.ctaSecondary}
            </a>
          </div>
          <p className="mt-6 text-sm text-teal-100">
            {locale === 'ta' ? 'முகவரா அல்லது நிறுவனமா?' : 'Are you an agent or agency?'}{' '}
            <Link href="/for-agents" className="font-bold underline underline-offset-2 hover:text-white">
              {locale === 'ta' ? 'எப்படி பட்டியலிடுவது அறிக →' : 'See how to list & use the system →'}
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
