// @ts-nocheck
'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Calendar, Users, MapPin, Home } from 'lucide-react';
import { useStore } from '@/lib/store';
import { localize } from '@/lib/translations';
import { getProperties } from '@/lib/firestore';
import { filterListings, resolvePropertyImage } from '@/lib/marketplace';
import { DEVELOPMENT_PROPERTY_FIXTURES } from '@/lib/development-fixtures';
import PropertyCard from '@/components/PropertyCard';

const MOCK_FALLBACK = DEVELOPMENT_PROPERTY_FIXTURES.filter((p) => p.intent === 'short_rent');

export default function ShortTermRentalPage() {
  const { locale } = useStore();
  const [checkIn, setCheckIn] = useState('');
  const [guests, setGuests] = useState('');
  const [area, setArea] = useState('');
  const [searchApplied, setSearchApplied] = useState(false);

  const [allListings, setAllListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const data = await getProperties();
        if (!mounted) return;
        // Only short_rent intent listings
        setAllListings(data.filter((p: any) => p.intent === 'short_rent'));
        setUsingFallback(false);
      } catch {
        if (!mounted) return;
        setAllListings(MOCK_FALLBACK);
        setUsingFallback(MOCK_FALLBACK.length > 0);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  const copy = localize(locale, {
    en: {
      title: 'Short-Term Rentals in Jaffna',
      subtitle: 'Find villas, homestays, and furnished stays for short visits across the peninsula.',
      searchTitle: 'Search Rentals',
      checkIn: 'Check-in date',
      guests: 'Guests (min)',
      area: 'Area',
      allAreas: 'All Areas',
      search: 'Search',
      available: 'Available Rentals',
      viewDetails: 'View Details',
      noListings: 'No short-term rentals are currently listed.',
      noListingsSub: 'Please check back soon or contact us via WhatsApp.',
      sampleData: 'Sample data — live listings unavailable',
      loading: 'Loading...',
      guestSingle: 'Guest',
      guestPlural: 'Guests',
      night: '/night',
      bedrooms: 'Bedrooms',
      bathrooms: 'Bathrooms',
    },
    ta: {
      title: 'யாழ்ப்பாணத்தில் குறுகிய கால தங்குமிடங்கள்',
      subtitle: 'யாழ் குடாநாடு முழுவதும் குறுகிய கால வருகைகளுக்கான வில்லாக்கள், ஹோம்ஸ்டேக்கள், மற்றும் உபகரணங்களுடன் கூடிய தங்குமிடங்களைப் பாருங்கள்.',
      searchTitle: 'தங்குமிடங்களைத் தேடுங்கள்',
      checkIn: 'வருகை தேதி',
      guests: 'விருந்தினர்கள் (குறைந்தது)',
      area: 'பகுதி',
      allAreas: 'அனைத்து பகுதிகளும்',
      search: 'தேடுங்கள்',
      available: 'தற்போது கிடைக்கும் தங்குமிடங்கள்',
      viewDetails: 'விவரங்களைப் பார்க்கவும்',
      noListings: 'தற்போது குறுகிய கால வாடகை சொத்துகள் பட்டியலிடப்படவில்லை.',
      noListingsSub: 'விரைவில் மீண்டும் பாருங்கள் அல்லது WhatsApp மூலம் எங்களை தொடர்பு கொள்ளுங்கள்.',
      sampleData: 'மாதிரி தரவு — நேரடி சொத்துகள் கிடைக்கவில்லை',
      loading: 'ஏற்றப்படுகிறது...',
      guestSingle: 'விருந்தினர்',
      guestPlural: 'விருந்தினர்கள்',
      night: '/இரவு',
      bedrooms: 'படுக்கையறைகள்',
      bathrooms: 'குளியலறைகள்',
    },
  });

  // Collect unique area slugs for the area select
  const uniqueAreas = Array.from(new Set(allListings.map((p) => p.area_slug).filter(Boolean)));

  // Apply search filters
  const displayListings = useMemo(() => {
    if (!searchApplied) return allListings;
    return filterListings(allListings, {
      area: area || undefined,
      bedrooms: guests ? Number(guests) : undefined,
    } as any);
  }, [allListings, searchApplied, area, guests]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setSearchApplied(true);
  }

  return (
    <div className="min-h-screen bg-sand-50">
      <section className="bg-gradient-to-r from-teal-900 via-teal-800 to-teal-700 text-white py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-5xl font-bold mb-3">{copy.title}</h1>
          <p className="text-teal-100 text-lg max-w-2xl">{copy.subtitle}</p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto py-8 px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-charcoal-900 mb-6">{copy.searchTitle}</h2>
          <form onSubmit={handleSearch} className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-charcoal-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-2" />
                {copy.checkIn}
              </label>
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="w-full border border-charcoal-200 rounded-lg px-4 py-2 text-charcoal-900 focus:outline-none focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-charcoal-700 mb-2">
                <Users className="w-4 h-4 inline mr-2" />
                {copy.guests}
              </label>
              <select
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
                className="w-full border border-charcoal-200 rounded-lg px-4 py-2 text-charcoal-900 focus:outline-none focus:border-teal-500"
              >
                <option value="">—</option>
                <option value="1">1 {copy.guestSingle}</option>
                <option value="2">2 {copy.guestPlural}</option>
                <option value="3">3 {copy.guestPlural}</option>
                <option value="4">4+ {copy.guestPlural}</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-charcoal-700 mb-2">
                <MapPin className="w-4 h-4 inline mr-2" />
                {copy.area}
              </label>
              <select
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="w-full border border-charcoal-200 rounded-lg px-4 py-2 text-charcoal-900 focus:outline-none focus:border-teal-500"
              >
                <option value="">{copy.allAreas}</option>
                {uniqueAreas.map((slug) => (
                  <option key={slug} value={slug}>{slug}</option>
                ))}
              </select>
            </div>

            <div className="md:col-span-3">
              <button
                type="submit"
                className="w-full bg-teal-500 hover:bg-teal-600 text-white py-3 rounded-lg font-semibold transition-colors"
              >
                {copy.search}
              </button>
            </div>
          </form>
        </div>
      </section>

      <section className="max-w-6xl mx-auto py-8 px-4">
        <h2 className="text-2xl font-bold text-charcoal-900 mb-4">{copy.available}</h2>

        {usingFallback && (
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-amber-50 border border-amber-200 px-4 py-2 text-xs font-semibold text-amber-700">
            <span>⚠</span> {copy.sampleData}
          </div>
        )}

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-72 rounded-3xl bg-sand-100 animate-pulse" />
            ))}
          </div>
        ) : displayListings.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-sand-300 px-6 py-16 text-center text-charcoal-500">
            <Home className="w-10 h-10 mx-auto mb-4 opacity-40" />
            <p className="text-lg font-medium mb-2">{copy.noListings}</p>
            <p className="text-sm">{copy.noListingsSub}</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayListings.map((listing) => (
              <PropertyCard key={listing.id} property={listing} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
