// @ts-nocheck
'use client';

import { useState } from 'react';
import { Calendar, Users, MapPin, Star, Wifi, Home } from 'lucide-react';
import { useStore } from '@/lib/store';
import { getAmenityLabel, localize } from '@/lib/translations';

interface Rental {
  id: string;
  title: { en: string; ta: string };
  area: { en: string; ta: string };
  image_color: string;
  price_per_night: number;
  rating: number;
  reviews: number;
  amenities: string[];
  guests: number;
  bedrooms: number;
  bathrooms: number;
}

const RENTAL_DATA: Rental[] = [
  {
    id: '1',
    title: { en: 'Quiet Apartment near Nallur', ta: 'நல்லூருக்கு அருகிலுள்ள அமைதியான அபார்ட்மென்ட்' },
    area: { en: 'Nallur', ta: 'நல்லூர்' },
    image_color: 'from-teal-400 to-teal-600',
    price_per_night: 3500,
    rating: 4.8,
    reviews: 45,
    amenities: ['wifi', 'kitchen', 'ac'],
    guests: 2,
    bedrooms: 1,
    bathrooms: 1,
  },
  {
    id: '2',
    title: { en: 'Family Villa near Casuarina', ta: 'கசுவரினா அருகிலுள்ள குடும்ப வில்லா' },
    area: { en: 'Karainagar', ta: 'காரைநகர்' },
    image_color: 'from-teal-500 to-warm-400',
    price_per_night: 8500,
    rating: 4.9,
    reviews: 78,
    amenities: ['wifi', 'kitchen', 'pool'],
    guests: 6,
    bedrooms: 3,
    bathrooms: 2,
  },
  {
    id: '3',
    title: { en: 'Heritage Homestay in Jaffna Town', ta: 'யாழ்ப்பாண நகரில் பாரம்பரிய ஹோம்ஸ்டே' },
    area: { en: 'Jaffna Town', ta: 'யாழ்ப்பாணம்' },
    image_color: 'from-warm-400 to-teal-500',
    price_per_night: 2800,
    rating: 4.7,
    reviews: 32,
    amenities: ['wifi', 'meals', 'cultural'],
    guests: 4,
    bedrooms: 2,
    bathrooms: 1,
  },
  {
    id: '4',
    title: { en: 'Modern Studio on KKS Road', ta: 'கே.கே.எஸ். வீதியில் நவீன ஸ்டுடியோ' },
    area: { en: 'KKS Road', ta: 'கே.கே.எஸ். வீதி' },
    image_color: 'from-teal-600 to-teal-400',
    price_per_night: 4200,
    rating: 4.6,
    reviews: 28,
    amenities: ['wifi', 'kitchen', 'laundry'],
    guests: 2,
    bedrooms: 1,
    bathrooms: 1,
  },
];

const AMENITY_ICONS: { [key: string]: React.ReactNode } = {
  wifi: <Wifi className="w-4 h-4" />,
  kitchen: <Home className="w-4 h-4" />,
  pool: <Users className="w-4 h-4" />,
  ac: <Home className="w-4 h-4" />,
  meals: <Home className="w-4 h-4" />,
  cultural: <MapPin className="w-4 h-4" />,
  laundry: <Home className="w-4 h-4" />,
};

export default function ShortTermRentalPage() {
  const { locale } = useStore();
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState('1');
  const [area, setArea] = useState('');

  const copy = localize(locale, {
    en: {
      title: 'Short-Term Rentals in Jaffna',
      subtitle: 'Find villas, homestays, and furnished stays for short visits across the peninsula.',
      searchTitle: 'Search Rentals',
      checkIn: 'Check-in',
      checkOut: 'Check-out',
      guests: 'Guests',
      area: 'Area',
      allAreas: 'All Areas',
      search: 'Search Rentals',
      available: 'Available Rentals',
      night: '/night',
      guestSingle: 'Guest',
      guestPlural: 'Guests',
      bedrooms: 'Bedrooms',
      bathrooms: 'Bathrooms',
      viewDetails: 'View Details',
    },
    ta: {
      title: 'யாழ்ப்பாணத்தில் குறுகிய கால தங்குமிடங்கள்',
      subtitle: 'யாழ் குடாநாடு முழுவதும் குறுகிய கால வருகைகளுக்கான வில்லாக்கள், ஹோம்ஸ்டேக்கள், மற்றும் உபகரணங்களுடன் கூடிய தங்குமிடங்களைப் பாருங்கள்.',
      searchTitle: 'தங்குமிடங்களைத் தேடுங்கள்',
      checkIn: 'வருகை தேதி',
      checkOut: 'புறப்படும் தேதி',
      guests: 'விருந்தினர்கள்',
      area: 'பகுதி',
      allAreas: 'அனைத்து பகுதிகளும்',
      search: 'தங்குமிடங்களைத் தேடுங்கள்',
      available: 'தற்போது கிடைக்கும் தங்குமிடங்கள்',
      night: '/இரவு',
      guestSingle: 'விருந்தினர்',
      guestPlural: 'விருந்தினர்கள்',
      bedrooms: 'படுக்கையறைகள்',
      bathrooms: 'குளியலறைகள்',
      viewDetails: 'விவரங்களைப் பார்க்கவும்',
    },
  });

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

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                <Calendar className="w-4 h-4 inline mr-2" />
                {copy.checkOut}
              </label>
              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
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
                {RENTAL_DATA.map((rental) => (
                  <option key={rental.id} value={rental.area.en}>
                    {locale === 'ta' ? rental.area.ta : rental.area.en}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button className="mt-6 w-full bg-teal-500 hover:bg-teal-600 text-white py-3 rounded-lg font-semibold transition-colors">
            {copy.search}
          </button>
        </div>
      </section>

      <section className="max-w-6xl mx-auto py-8 px-4">
        <h2 className="text-2xl font-bold text-charcoal-900 mb-8">{copy.available}</h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {RENTAL_DATA.map((rental) => (
            <div
              key={rental.id}
              className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow cursor-pointer group"
            >
              <div className={`h-40 bg-gradient-to-br ${rental.image_color} relative flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform`}>
                <Home className="w-12 h-12 text-white opacity-50" />
              </div>

              <div className="p-4">
                <h3 className="font-bold text-charcoal-900 mb-1 line-clamp-2">
                  {locale === 'ta' ? rental.title.ta : rental.title.en}
                </h3>

                <p className="text-charcoal-600 text-sm flex items-center gap-1 mb-3">
                  <MapPin className="w-4 h-4" />
                  {locale === 'ta' ? rental.area.ta : rental.area.en}
                </p>

                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="font-semibold text-charcoal-900">{rental.rating}</span>
                  </div>
                  <span className="text-xs text-charcoal-600">({rental.reviews})</span>
                </div>

                <p className="text-2xl font-bold text-teal-600 mb-3">
                  Rs. {rental.price_per_night.toLocaleString()}
                  <span className="text-sm text-charcoal-600 font-normal">{copy.night}</span>
                </p>

                <div className="flex gap-2 mb-4">
                  {rental.amenities.map((amenity) => (
                    <div
                      key={amenity}
                      className="bg-sand-100 text-charcoal-600 p-2 rounded-lg hover:bg-teal-100 hover:text-teal-600 transition-colors"
                      title={getAmenityLabel(amenity, locale)}
                    >
                      {AMENITY_ICONS[amenity]}
                    </div>
                  ))}
                </div>

                <div className="text-xs text-charcoal-600 space-y-1 pb-4 border-b border-sand-200 mb-4">
                  <p>
                    <span className="font-semibold">{rental.guests}</span>{' '}
                    {rental.guests === 1 ? copy.guestSingle : copy.guestPlural}
                  </p>
                  <p>
                    <span className="font-semibold">{rental.bedrooms}</span> {copy.bedrooms} ·{' '}
                    <span className="font-semibold ml-1">{rental.bathrooms}</span> {copy.bathrooms}
                  </p>
                </div>

                <button className="w-full bg-teal-500 hover:bg-teal-600 text-white py-2 rounded-lg font-semibold transition-colors text-sm">
                  {copy.viewDetails}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
