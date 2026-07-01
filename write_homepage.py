#!/usr/bin/env python3
"""Write the green-themed enhanced homepage for Yaal Nilam"""

content = r'''// @ts-nocheck
'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Search, MapPin, Bed, Bath, Users, ShieldCheck, Globe, TrendingUp, Calculator, Star, MessageCircle, Home, Building, Landmark, TreePine, ChevronRight, ArrowRight, Phone } from 'lucide-react';
import { PROPERTIES, AREAS, PROPERTY_TYPES } from '@/lib/data';
import { getProperties, getAreas } from '@/lib/firestore';

// Mortgage Calculator Component
function MortgageCalculator() {
  const [price, setPrice] = useState(5000000);
  const [down, setDown] = useState(20);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(20);

  const loanAmount = price * (1 - down / 100);
  const monthlyRate = rate / 100 / 12;
  const numPayments = years * 12;
  const monthly = monthlyRate > 0
    ? (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1)
    : loanAmount / numPayments;

  return (
    <div className="bg-white rounded-2xl shadow-card-lg p-8 border border-sand-200">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-navy-50 p-3 rounded-xl">
          <Calculator className="w-6 h-6 text-navy-700" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-charcoal-900">Mortgage Calculator</h3>
          <p className="text-sm text-charcoal-500">Estimate your monthly payments</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="text-sm font-semibold text-charcoal-600 mb-1 block">Property Price (Rs.)</label>
          <input type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))}
            className="w-full px-3 py-2.5 border border-sand-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-navy-500 outline-none text-charcoal-900" />
        </div>
        <div>
          <label className="text-sm font-semibold text-charcoal-600 mb-1 block">Down Payment (%)</label>
          <input type="number" value={down} onChange={(e) => setDown(Number(e.target.value))}
            className="w-full px-3 py-2.5 border border-sand-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-navy-500 outline-none text-charcoal-900" />
        </div>
        <div>
          <label className="text-sm font-semibold text-charcoal-600 mb-1 block">Interest Rate (%)</label>
          <input type="number" value={rate} onChange={(e) => setRate(Number(e.target.value))} step="0.1"
            className="w-full px-3 py-2.5 border border-sand-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-navy-500 outline-none text-charcoal-900" />
        </div>
        <div>
          <label className="text-sm font-semibold text-charcoal-600 mb-1 block">Loan Term (years)</label>
          <input type="number" value={years} onChange={(e) => setYears(Number(e.target.value))}
            className="w-full px-3 py-2.5 border border-sand-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-navy-500 outline-none text-charcoal-900" />
        </div>
      </div>
      <div className="bg-gradient-to-r from-navy-900 to-navy-700 rounded-xl p-6 text-center">
        <p className="text-sm text-navy-100 mb-1">Estimated Monthly Payment</p>
        <p className="text-4xl font-black text-white">Rs. {Math.round(monthly).toLocaleString()}</p>
        <p className="text-xs text-navy-200 mt-2">Loan Amount: Rs. {Math.round(loanAmount).toLocaleString()}</p>
      </div>
    </div>
  );
}
'''

content += '''
// Testimonials data
const TESTIMONIALS = [
  { name: "Aravinthan K.", area: "Nallur", text: "Found our dream home in Nallur through Yaal Nilam. The WhatsApp support made everything seamless!", rating: 5 },
  { name: "Priya S.", area: "Jaffna Town", text: "Listed my commercial property and got 5 inquiries in the first week. Excellent platform for Jaffna.", rating: 5 },
  { name: "Kumaran R.", area: "Point Pedro", text: "The bilingual support in Tamil was incredibly helpful. Best property platform for the Northern Province.", rating: 4 },
];

// Neighborhood highlights
const NEIGHBORHOOD_HIGHLIGHTS = [
  { area: "Nallur", slug: "nallur", desc: "Cultural heart of Jaffna. Home to the famous Nallur Kandaswamy Temple. Premium residential zone.", avgPrice: "8.5M", trend: "+12%" },
  { area: "Jaffna Fort", slug: "jaffna-fort", desc: "Historic district with colonial charm. Mix of heritage and modern properties near the coast.", avgPrice: "6.2M", trend: "+8%" },
  { area: "Chunnakam", slug: "chunnakam", desc: "Growing commercial hub. Affordable properties with excellent road connectivity.", avgPrice: "4.1M", trend: "+15%" },
  { area: "Point Pedro", slug: "point-pedro", desc: "Northernmost tip of Sri Lanka. Beachfront properties and tourism investment opportunities.", avgPrice: "5.8M", trend: "+10%" },
];

export default function HomePage() {
  const [selectedType, setSelectedType] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [properties, setProperties] = useState(PROPERTIES);
  const [areas, setAreas] = useState(AREAS);
  const [loading, setLoading] = useState(true);
  const [activePathway, setActivePathway] = useState('buy');

  useEffect(() => {
    async function loadData() {
      try {
        const [firestoreProps, firestoreAreas] = await Promise.all([
          getProperties(),
          getAreas(),
        ]);
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
  if (featuredProperties.length === 0) {
    featuredProperties.push(...properties.slice(0, 6));
  }

  const pathwayLabels: Record<string, string> = { buy: 'Buy', rent: 'Rent', 'short-stay': 'Short Stay' };
  const PathwayIcons: Record<string, any> = { buy: Home, rent: Building, 'short-stay': TreePine };

  return (
    <div className="min-h-screen bg-sand-50">
      {/* Hero Section — Deep Green Gradient */}
      <section className="relative bg-gradient-to-br from-navy-900 via-navy-800 to-navy-700 text-white py-20 md:py-28 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-navy-400 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-20 w-96 h-96 bg-warm-500 rounded-full blur-3xl" />
        </div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="max-w-3xl">
            <p className="text-warm-400 font-semibold mb-3 text-sm tracking-wider uppercase">Jaffna&apos;s Premier Property Platform</p>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight font-display">
              Find Your Dream Property in <span className="text-warm-400">Jaffna</span>
            </h1>
            <p className="text-lg md:text-xl text-navy-100 mb-8 max-w-2xl">
              Discover houses, lands, apartments and commercial spaces across the Jaffna Peninsula with WhatsApp-first support.
            </p>
          </div>

          {/* Pathway Tabs — Green/White */}
          <div className="bg-white/15 backdrop-blur-sm rounded-xl p-1.5 mb-6 inline-flex gap-1">
'''

content += """            {['buy', 'rent', 'short-stay'].map((path) => {
              const Icon = PathwayIcons[path];
              return (
                <button key={path} onClick={() => setActivePathway(path)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${activePathway === path ? 'bg-white text-navy-800 shadow-lg' : 'text-white/80 hover:text-white hover:bg-white/10'}`}>
                  <Icon className="w-4 h-4" />
                  {pathwayLabels[path]}
                </button>
              );
            })}
          </div>

          {/* Search Bar */}
          <div className="bg-white rounded-xl shadow-card-xl p-6">
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="flex-1 flex items-center bg-sand-50 rounded-lg px-4 py-3 border border-sand-200">
                <Search className="w-5 h-5 text-charcoal-400 mr-3" />
                <input type="text" placeholder="Search by location, property type..."
                  value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent outline-none text-charcoal-900 placeholder:text-charcoal-400" />
              </div>
              <Link href="/properties" className="bg-navy-700 hover:bg-navy-600 text-white px-8 py-3 rounded-lg font-semibold transition-all hover:-translate-y-0.5 shadow-float text-center">
                Search Properties
              </Link>
            </div>
            <div className="flex flex-wrap gap-2">
              {PROPERTY_TYPES.map((type) => (
                <button key={type} onClick={() => setSelectedType(selectedType === type ? '' : type)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedType === type ? 'bg-navy-700 text-white shadow-md' : 'bg-sand-100 text-charcoal-700 hover:bg-sand-200 border border-sand-200'}`}>
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/10">
              <Building className="w-5 h-5 text-warm-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">{properties.length}+</p>
              <p className="text-xs text-navy-200">Active Listings</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/10">
              <MapPin className="w-5 h-5 text-warm-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">{areas.length}</p>
              <p className="text-xs text-navy-200">Areas Covered</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/10">
              <ShieldCheck className="w-5 h-5 text-warm-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">25+</p>
              <p className="text-xs text-navy-200">Verified Agents</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/10">
              <Users className="w-5 h-5 text-warm-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">150+</p>
              <p className="text-xs text-navy-200">Happy Families</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="max-w-6xl mx-auto py-16 md:py-20 px-4">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-charcoal-900 mb-2">Featured Properties</h2>
            <p className="text-charcoal-500">Hand-picked properties listed on Yaal Nilam</p>
          </div>
          <Link href="/properties" className="hidden md:flex items-center gap-1 text-navy-700 font-semibold hover:text-navy-500 transition-colors">
            View All <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3].map((i) => (
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
            {featuredProperties.slice(0, 6).map((property) => (
              <Link key={property.id} href={`/properties/${property.id}`} className="group">
                <div className="bg-white rounded-xl overflow-hidden shadow-card hover:shadow-card-lg transition-all duration-300 group-hover:-translate-y-1 border border-sand-200">
                  <div className="h-52 bg-gradient-to-br from-navy-600 to-navy-800 relative flex items-center justify-center">
                    <MapPin className="w-12 h-12 text-white opacity-30" />
                    {property.verified && (
                      <span className="absolute top-3 left-3 bg-navy-600 text-white text-xs px-2.5 py-1 rounded-full font-semibold flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" /> Verified
                      </span>
                    )}
                    {property.featured && (
                      <span className="absolute top-3 right-3 bg-warm-500 text-navy-900 text-xs px-2.5 py-1 rounded-full font-bold">Featured</span>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-charcoal-900 mb-1 group-hover:text-navy-700 transition-colors">{property.title}</h3>
                    <p className="text-charcoal-500 text-sm mb-3 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" /> {property.area}
                    </p>
                    <p className="text-xl font-bold text-navy-700 mb-3">Rs. {property.price?.toLocaleString()}</p>
                    <div className="flex gap-4 text-charcoal-500 text-sm">
                      {property.bedrooms > 0 && <span className="flex items-center gap-1"><Bed className="w-4 h-4" /> {property.bedrooms}</span>}
                      {property.bathrooms > 0 && <span className="flex items-center gap-1"><Bath className="w-4 h-4" /> {property.bathrooms}</span>}
                      {property.land_size_perches && <span className="flex items-center gap-1"><Landmark className="w-4 h-4" /> {property.land_size_perches}p</span>}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
        <div className="mt-8 text-center md:hidden">
          <Link href="/properties" className="inline-flex items-center gap-2 text-navy-700 font-semibold">
            View All Properties <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Browse by Area — Green gradient cards */}
      <section className="bg-white py-16 md:py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-charcoal-900 mb-2">Browse by Area</h2>
            <p className="text-charcoal-500">Explore properties across the Jaffna Peninsula</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {areas.map((area) => (
              <Link key={area.slug} href={`/areas/${area.slug}`} className="group">
                <div className="bg-gradient-to-br from-navy-800 to-navy-600 rounded-xl p-6 text-white hover:shadow-card-lg transition-all duration-300 group-hover:-translate-y-1 min-h-[120px] flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold mb-0.5">{area.name}</h3>
                    <p className="text-navy-200 text-xs">{area.name_ta}</p>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <p className="text-sm font-semibold text-warm-300">{area.properties_count} properties</p>
                    <ChevronRight className="w-4 h-4 opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Neighborhood Guide — Green left-border cards */}
      <section className="max-w-6xl mx-auto py-16 md:py-20 px-4">
        <div className="mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-charcoal-900 mb-2">Neighborhood Guide</h2>
          <p className="text-charcoal-500">Market insights for Jaffna&apos;s top areas</p>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {NEIGHBORHOOD_HIGHLIGHTS.map((n) => (
            <div key={n.area} className="bg-white rounded-xl p-6 shadow-card hover:shadow-card-lg transition-all border-l-4 border-l-navy-700">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-bold text-charcoal-900">{n.area}</h3>
                <span className="flex items-center gap-1 text-navy-700 text-sm font-semibold bg-navy-50 px-2 py-1 rounded-full">
                  <TrendingUp className="w-3.5 h-3.5" /> {n.trend}
                </span>
              </div>
              <p className="text-charcoal-600 text-sm mb-4">{n.desc}</p>
              <div className="flex items-center justify-between">
                <p className="text-sm text-charcoal-500">Avg. Price: <span className="font-bold text-navy-700">Rs. {n.avgPrice}</span></p>
                <Link href={`/areas/${n.slug}`} className="text-navy-700 text-sm font-semibold hover:text-navy-500 flex items-center gap-1">
                  Explore <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Mortgage Calculator + Testimonials */}
      <section className="bg-sand-100 py-16 md:py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8">
            <MortgageCalculator />
            <div>
              <h2 className="text-3xl font-bold text-charcoal-900 mb-2">What Our Clients Say</h2>
              <p className="text-charcoal-500 mb-6">Trusted by homebuyers across Jaffna</p>
              <div className="space-y-4">
                {TESTIMONIALS.map((t, i) => (
                  <div key={i} className="bg-white rounded-xl p-5 shadow-card border border-sand-200 relative">
                    <span className="absolute top-3 left-5 text-5xl text-navy-700 opacity-10 font-serif leading-none">&ldquo;</span>
                    <div className="flex gap-1 mb-2">
                      {Array.from({ length: 5 }).map((_, s) => (
                        <Star key={s} className={`w-4 h-4 ${s < t.rating ? 'text-warm-500 fill-warm-500' : 'text-charcoal-200'}`} />
                      ))}
                    </div>
                    <p className="text-charcoal-700 text-sm mb-3 relative z-10">&ldquo;{t.text}&rdquo;</p>
                    <p className="text-sm font-semibold text-charcoal-900">{t.name} <span className="font-normal text-charcoal-500">&mdash; {t.area}</span></p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us — Green icons */}
      <section className="max-w-6xl mx-auto py-16 md:py-20 px-4">
        <div className="mb-10 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-charcoal-900 mb-2">Why Choose Yaal Nilam?</h2>
          <p className="text-charcoal-500">The best way to discover property in Jaffna</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-card hover:shadow-card-lg transition-all text-center border border-sand-200">
            <div className="bg-navy-50 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="w-7 h-7 text-navy-700" />
            </div>
            <h3 className="text-lg font-bold text-charcoal-900 mb-2">Verified Listings</h3>
            <p className="text-charcoal-500 text-sm">Every property vetted for accuracy. Only genuine listings from verified agents.</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-card hover:shadow-card-lg transition-all text-center border border-sand-200">
            <div className="bg-green-50 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-7 h-7 text-green-600" />
            </div>
            <h3 className="text-lg font-bold text-charcoal-900 mb-2">WhatsApp-First</h3>
            <p className="text-charcoal-500 text-sm">Chat instantly with agents via WhatsApp. No downloads, no signups required.</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-card hover:shadow-card-lg transition-all text-center border border-sand-200">
            <div className="bg-navy-50 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-7 h-7 text-navy-700" />
            </div>
            <h3 className="text-lg font-bold text-charcoal-900 mb-2">Local Expertise</h3>
            <p className="text-charcoal-500 text-sm">Deep knowledge of every Jaffna neighborhood. Area insights and price trends.</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-card hover:shadow-card-lg transition-all text-center border border-sand-200">
            <div className="bg-warm-50 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
              <Globe className="w-7 h-7 text-warm-600" />
            </div>
            <h3 className="text-lg font-bold text-charcoal-900 mb-2">Bilingual Support</h3>
            <p className="text-charcoal-500 text-sm">Full Tamil and English support. Browse in your preferred language.</p>
          </div>
        </div>
      </section>

      {/* CTA Section — Gold accent */}
      <section className="bg-gradient-to-r from-navy-800 to-navy-700 text-white py-16 px-4 my-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to List Your Property?</h2>
          <p className="text-lg text-navy-200 mb-8">
            Join hundreds of property owners and agents on Yaal Nilam. List your property today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/add-listing" className="inline-flex items-center justify-center gap-2 bg-warm-500 hover:bg-warm-400 text-navy-900 px-8 py-3 rounded-lg font-bold transition-all hover:-translate-y-0.5 shadow-lg">
              <Home className="w-5 h-5" /> Add Your Listing
            </Link>
            <a href="https://wa.me/94212223456?text=Hi%2C%20I%20want%20to%20list%20my%20property" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg font-bold transition-all hover:-translate-y-0.5">
              <MessageCircle className="w-5 h-5" /> Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
"""

target = '/Users/nanthan/Desktop/JAFFNA-PROPERTY/web/src/app/page.tsx'
with open(target, 'w', encoding='utf-8') as f:
    f.write(content)

with open(target, 'r') as f:
    written = f.read()
tl_count = written.count('${')
bt_count = written.count('`')
lines = written.count('\n')
print(f"Homepage written: {len(written)} chars, {lines} lines")
print(f"Template literals: {tl_count}, Backticks: {bt_count}")
