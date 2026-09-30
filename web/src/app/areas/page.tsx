// @ts-nocheck
'use client';

import Link from 'next/link';
import { useState, useEffect, useMemo } from 'react';
import { MapPin, ExternalLink, Search, Navigation, Compass } from 'lucide-react';
import { DEFAULT_AREA_CATALOG, getAreas } from '@/lib/firestore';
import { useStore } from '@/lib/store';
import { localize } from '@/lib/translations';

const REGION_CATEGORIES = [
  { id: 'all', en: 'All Areas', ta: 'அனைத்து பகுதிகள்' },
  { id: 'jaffna', en: 'Jaffna City & Suburbs', ta: 'யாழ் நகரும் புறநகரும்' },
  { id: 'valikamam', en: 'Valikamam', ta: 'வலிகாமம்' },
  { id: 'thenmarachchi', en: 'Thenmarachchi', ta: 'தென்மராட்சி' },
  { id: 'vadamarachchi', en: 'Vadamarachchi', ta: 'வடமராட்சி' },
  { id: 'islands', en: 'Islands', ta: 'தீவுகள்' },
  { id: 'northern-province', en: 'Northern Province', ta: 'வட மாகாணம்' },
];

function getRegionForArea(slug: string, district?: string): string {
  const norm = slug.toLowerCase();
  if (['jaffna', 'nallur', 'thirunelvely', 'kokkuvil', 'kondavil', 'chundikuli', 'passaiyoor', 'jaffna-fort', 'grand-bazaar', 'vannarpannai'].includes(norm)) {
    return 'jaffna';
  }
  if (norm.startsWith('valikamam') || ['chunnakam', 'tellippalai', 'maviddapuram', 'kopay', 'urumpirai', 'ilavalai', 'erlalai', 'manipay', 'sandilipay'].includes(norm)) {
    return 'valikamam';
  }
  if (['thenmarachchi', 'chavakachcheri', 'kodikamam'].includes(norm)) {
    return 'thenmarachchi';
  }
  if (['vadamarachchi-north', 'vadamarachchi-south-west', 'vadamarachchi-east', 'point-pedro', 'valvettithurai'].includes(norm)) {
    return 'vadamarachchi';
  }
  if (['karainagar', 'velanai', 'island-south', 'kayts'].includes(norm)) {
    return 'islands';
  }
  if (['vavuniya', 'kilinochchi', 'mullaitivu', 'mannar', 'trincomalee'].includes(norm)) {
    return 'northern-province';
  }
  if (district && district.toLowerCase() !== 'jaffna') {
    return 'northern-province';
  }
  return 'jaffna';
}

export default function AreasPage() {
  const { locale } = useStore();
  const [areas, setAreas] = useState(DEFAULT_AREA_CATALOG);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('all');

  const copy = localize(locale, {
    en: {
      title: 'Explore Areas in Jaffna & The North',
      subtitle: 'Verified local neighborhoods with exact Google Maps coordinates, market pricing, and property opportunities.',
      searchPlaceholder: 'Search by area name (e.g. Nallur, Chunnakam, Point Pedro)...',
      properties: 'properties',
      explore: 'Explore Area',
      openMaps: 'Open in Google Maps',
      coordinates: 'Coordinates',
      noResults: 'No areas matched your search. Try a different keyword.',
      clearSearch: 'Clear search',
    },
    ta: {
      title: 'யாழ்ப்பாணம் மற்றும் வடக்கின் பகுதிகள்',
      subtitle: 'துல்லியமான கூகுள் வரைபட இடங்கள், சந்தை விலைகள் மற்றும் சொத்து வாய்ப்புகளுடன் கூடிய பகுதிகளை ஆராயுங்கள்.',
      searchPlaceholder: 'பகுதியின் பெயரைத் தேடுங்கள் (உதா: நல்லூர், சுன்னாகம், பருத்தித்துறை)...',
      properties: 'சொத்துக்கள்',
      explore: 'பகுதியை பார்க்க',
      openMaps: 'கூகுள் மேப்பில் பார்க்க',
      coordinates: 'அமைவிடம்',
      noResults: 'உங்கள் தேடலுக்கு ஏற்ற பகுதிகள் கிடைக்கவில்லை. வேறு சொல்லைப் பயன்படுத்தவும்.',
      clearSearch: 'தேடலை நீக்கு',
    },
  });

  useEffect(() => {
    async function loadData() {
      try {
        const firestoreAreas = await getAreas();
        setAreas(firestoreAreas);
      } catch (err) {
        console.error('Firestore load error:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredAreas = useMemo(() => {
    return areas.filter((area) => {
      // Region filter
      if (selectedRegion !== 'all') {
        const areaRegion = getRegionForArea(area.slug, area.district);
        if (areaRegion !== selectedRegion) return false;
      }

      // Text search
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      const name = (area.name || '').toLowerCase();
      const nameTa = (area.name_ta || '').toLowerCase();
      const slug = (area.slug || '').toLowerCase();
      const desc = (area.description || '').toLowerCase();
      const descTa = (area.description_ta || '').toLowerCase();

      return name.includes(q) || nameTa.includes(q) || slug.includes(q) || desc.includes(q) || descTa.includes(q);
    });
  }, [areas, searchQuery, selectedRegion]);

  return (
    <div className="min-h-screen bg-sand-50">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-teal-950 via-teal-900 to-teal-800 text-white py-14 px-4 shadow-inner">
        <div className="max-w-6xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-800/80 text-teal-200 text-xs font-semibold uppercase tracking-wider mb-4 border border-teal-700/60">
            <Compass className="w-3.5 h-3.5 text-warm-400" />
            <span>{locale === 'ta' ? 'யாழ் குடாநாடு & வட மாகாணம்' : 'Jaffna Peninsula & Northern Province'}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-3 tracking-tight">
            {copy.title}
          </h1>
          <p className="text-teal-100/90 text-base sm:text-lg max-w-2xl font-light leading-relaxed">
            {copy.subtitle}
          </p>

          {/* Search bar inside hero */}
          <div className="mt-8 max-w-xl relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-teal-300" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={copy.searchPlaceholder}
              className="w-full pl-12 pr-10 py-3.5 rounded-xl bg-white/10 text-white placeholder-teal-200/70 border border-teal-500/40 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-warm-400 focus:bg-white/15 transition-all text-sm sm:text-base"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-teal-200 hover:text-white text-xs font-bold px-1.5 py-0.5 rounded bg-teal-800/80"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Region Filter Chips */}
      <div className="bg-white border-b border-sand-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth">
            {REGION_CATEGORIES.map((cat) => {
              const active = selectedRegion === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedRegion(cat.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
                    active
                      ? 'bg-teal-900 text-white shadow-sm'
                      : 'bg-sand-100 text-charcoal-700 hover:bg-sand-200 hover:text-charcoal-900 border border-sand-200/80'
                  }`}
                >
                  {locale === 'ta' ? cat.ta : cat.en}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Area Cards Grid */}
      <div className="max-w-6xl mx-auto py-10 px-4">
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-sand-200 animate-pulse">
                <div className="h-48 bg-charcoal-100" />
                <div className="p-6 space-y-3">
                  <div className="h-6 bg-charcoal-200 rounded w-1/2" />
                  <div className="h-4 bg-charcoal-100 rounded w-1/3" />
                  <div className="h-4 bg-charcoal-100 rounded w-3/4" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredAreas.length === 0 ? (
          <div className="text-center py-16 px-4 bg-white rounded-2xl border border-sand-200">
            <MapPin className="w-12 h-12 text-charcoal-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-charcoal-800 mb-1">{copy.noResults}</h3>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedRegion('all');
              }}
              className="mt-4 px-4 py-2 bg-teal-800 text-white text-sm font-semibold rounded-lg hover:bg-teal-700 transition-colors"
            >
              {copy.clearSearch}
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredAreas.map((area) => {
              const lat = typeof area.lat === 'number' && !Number.isNaN(area.lat) ? area.lat : 9.6615;
              const lng = typeof area.lng === 'number' && !Number.isNaN(area.lng) ? area.lng : 80.0255;
              const mapsEmbedUrl = area.google_maps_embed_url || `https://maps.google.com/maps?q=${lat},${lng}&hl=${locale === 'ta' ? 'ta' : 'en'}&z=14&output=embed`;
              const mapsExternalUrl = area.google_maps_url || `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;

              return (
                <div
                  key={area.slug}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-sand-200 flex flex-col group"
                >
                  {/* Real Google Map Embed Header */}
                  <div className="relative h-48 sm:h-52 w-full bg-sand-100 overflow-hidden">
                    <iframe
                      title={`${area.name} Google Map`}
                      src={mapsEmbedUrl}
                      width="100%"
                      height="100%"
                      className="w-full h-full border-0 pointer-events-none"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />

                    {/* Coordinates Badge */}
                    <div className="absolute top-3 left-3 bg-charcoal-900/80 text-white text-[11px] font-mono font-medium px-2.5 py-1 rounded-full backdrop-blur-md flex items-center gap-1 shadow-xs border border-white/10 z-10">
                      <Navigation className="w-3 h-3 text-warm-400" />
                      <span>{lat.toFixed(4)}° N, {lng.toFixed(4)}° E</span>
                    </div>

                    {/* Direct Google Maps Action Button */}
                    <a
                      href={mapsExternalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      title={copy.openMaps}
                      className="absolute top-3 right-3 inline-flex items-center gap-1.5 px-3 py-1 bg-white/95 hover:bg-white text-teal-900 text-xs font-bold rounded-full shadow-md backdrop-blur-sm transition-all hover:scale-105 active:scale-95 z-20 border border-sand-200"
                    >
                      <span>Google Maps</span>
                      <ExternalLink className="w-3.5 h-3.5 text-teal-700" />
                    </a>
                  </div>

                  {/* Card Content */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div>
                          <h3 className="text-xl font-bold text-charcoal-900 group-hover:text-teal-700 transition-colors">
                            {locale === 'ta' ? area.name_ta || area.name : area.name}
                          </h3>
                          <p className="text-sm font-semibold text-teal-600">
                            {locale === 'ta' ? area.name : area.name_ta}
                          </p>
                        </div>
                        <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-sand-100 text-charcoal-700 border border-sand-200 whitespace-nowrap">
                          {area.properties_count} {copy.properties}
                        </span>
                      </div>

                      <p className="text-charcoal-600 text-sm mt-3 line-clamp-2 leading-relaxed">
                        {locale === 'ta' ? area.description_ta || area.description : area.description}
                      </p>
                    </div>

                    {/* Card Actions Footer */}
                    <div className="mt-6 pt-4 border-t border-sand-100 flex items-center justify-between">
                      <a
                        href={mapsExternalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-xs font-bold text-charcoal-600 hover:text-teal-700 inline-flex items-center gap-1 transition-colors"
                      >
                        <MapPin className="w-3.5 h-3.5 text-teal-600" />
                        <span>{locale === 'ta' ? 'வரைபடம் ↗' : 'Maps ↗'}</span>
                      </a>

                      <Link
                        href={`/areas/${area.slug}`}
                        className="text-sm font-bold text-teal-700 hover:text-teal-800 inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                      >
                        <span>{copy.explore}</span>
                        <span>→</span>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
