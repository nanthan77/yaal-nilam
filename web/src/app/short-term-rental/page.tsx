// @ts-nocheck
'use client';

import { useState } from 'react';
import { Calendar, Users, MapPin, Star, Wifi, Home } from 'lucide-react';

interface Rental {
  id: string;
  title: string;
  area: string;
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
    title: 'Cozy Apartment in Jaffna City',
    area: 'City Center',
    image_color: 'from-teal-400 to-navy-600',
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
    title: 'Spacious Villa near Beach',
    area: 'Mullaitivu',
    image_color: 'from-navy-500 to-warm-400',
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
    title: 'Heritage Homestay',
    area: 'Old Town',
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
    title: 'Modern Studio with Kitchen',
    area: 'KKS',
    image_color: 'from-navy-600 to-teal-400',
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
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState('1');
  const [area, setArea] = useState('');

  return (
    <div className="min-h-screen bg-sand-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-navy-900 via-navy-800 to-navy-700 text-white py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-5xl font-bold mb-3">Short-Term Rentals in Jaffna</h1>
          <p className="text-2xl text-navy-100 mb-2">குறுகிய கால வாடகை</p>
          <p className="text-navy-100 text-lg max-w-2xl">
            Find the perfect place to stay for your visit to Jaffna
          </p>
        </div>
      </section>

      {/* Filter Section */}
      <section className="max-w-6xl mx-auto py-8 px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-charcoal-900 mb-6">Search Rentals</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Check-in Date */}
            <div>
              <label className="block text-sm font-semibold text-charcoal-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-2" />
                Check-in
              </label>
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="w-full border border-charcoal-200 rounded-lg px-4 py-2 text-charcoal-900 focus:outline-none focus:border-teal-500"
              />
            </div>

            {/* Check-out Date */}
            <div>
              <label className="block text-sm font-semibold text-charcoal-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-2" />
                Check-out
              </label>
              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full border border-charcoal-200 rounded-lg px-4 py-2 text-charcoal-900 focus:outline-none focus:border-teal-500"
              />
            </div>

            {/* Guests */}
            <div>
              <label className="block text-sm font-semibold text-charcoal-700 mb-2">
                <Users className="w-4 h-4 inline mr-2" />
                Guests
              </label>
              <select
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
                className="w-full border border-charcoal-200 rounded-lg px-4 py-2 text-charcoal-900 focus:outline-none focus:border-teal-500"
              >
                <option value="1">1 Guest</option>
                <option value="2">2 Guests</option>
                <option value="3">3 Guests</option>
                <option value="4">4+ Guests</option>
              </select>
            </div>

            {/* Area */}
            <div>
              <label className="block text-sm font-semibold text-charcoal-700 mb-2">
                <MapPin className="w-4 h-4 inline mr-2" />
                Area
              </label>
              <select
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="w-full border border-charcoal-200 rounded-lg px-4 py-2 text-charcoal-900 focus:outline-none focus:border-teal-500"
              >
                <option value="">All Areas</option>
                <option value="city">City Center</option>
                <option value="beach">Near Beach</option>
                <option value="old">Old Town</option>
                <option value="kks">KKS</option>
              </select>
            </div>
          </div>

          <button className="mt-6 w-full bg-teal-500 hover:bg-teal-600 text-white py-3 rounded-lg font-semibold transition-colors">
            Search Rentals
          </button>
        </div>
      </section>

      {/* Rental Grid */}
      <section className="max-w-6xl mx-auto py-8 px-4">
        <h2 className="text-2xl font-bold text-charcoal-900 mb-8">Available Rentals</h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {RENTAL_DATA.map((rental) => (
            <div
              key={rental.id}
              className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow cursor-pointer group"
            >
              {/* Image Placeholder */}
              <div className={`h-40 bg-gradient-to-br ${rental.image_color} relative flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform`}>
                <Home className="w-12 h-12 text-white opacity-50" />
              </div>

              {/* Info */}
              <div className="p-4">
                <h3 className="font-bold text-charcoal-900 mb-1 line-clamp-2">{rental.title}</h3>

                <p className="text-charcoal-600 text-sm flex items-center gap-1 mb-3">
                  <MapPin className="w-4 h-4" />
                  {rental.area}
                </p>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="font-semibold text-charcoal-900">{rental.rating}</span>
                  </div>
                  <span className="text-xs text-charcoal-600">({rental.reviews})</span>
                </div>

                {/* Price */}
                <p className="text-2xl font-bold text-teal-600 mb-3">
                  Rs. {rental.price_per_night.toLocaleString()}
                  <span className="text-sm text-charcoal-600 font-normal">/night</span>
                </p>

                {/* Amenities */}
                <div className="flex gap-2 mb-4">
                  {rental.amenities.map((amenity) => (
                    <div
                      key={amenity}
                      className="bg-sand-100 text-charcoal-600 p-2 rounded-lg hover:bg-teal-100 hover:text-teal-600 transition-colors"
                      title={amenity}
                    >
                      {AMENITY_ICONS[amenity]}
                    </div>
                  ))}
                </div>

                {/* Guests/Bedrooms */}
                <div className="text-xs text-charcoal-600 space-y-1 pb-4 border-b border-sand-200 mb-4">
                  <p>
                    <span className="font-semibold">{rental.guests}</span> Guests
                  </p>
                  <p>
                    <span className="font-semibold">{rental.bedrooms}</span> Bedrooms · 
                    <span className="font-semibold ml-1">{rental.bathrooms}</span> Bathrooms
                  </p>
                </div>

                <button className="w-full bg-teal-500 hover:bg-teal-600 text-white py-2 rounded-lg font-semibold transition-colors text-sm">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
