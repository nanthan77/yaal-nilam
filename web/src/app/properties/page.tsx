// @ts-nocheck
'use client';

import { useState, useMemo, useEffect } from 'react';
import { Search, Filter, ArrowUpDown } from 'lucide-react';
import PropertyCard from '@/components/PropertyCard';
import { PROPERTIES as MOCK_PROPERTIES, PROPERTY_TYPES } from '@/lib/data';
import { getProperties } from '@/lib/firestore';
import { useStore } from '@/lib/store';
import { getPropertyTypeLabel, localize } from '@/lib/translations';

export default function PropertiesPage() {
  const { locale } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [allProperties, setAllProperties] = useState(MOCK_PROPERTIES);
  const [loading, setLoading] = useState(true);

  const copy = localize(locale, {
    en: {
      title: 'Browse All Properties',
      subtitle: 'Search houses, land, apartments, villas, and commercial spaces across Jaffna.',
      searchPlaceholder: 'Search by area or property title...',
      propertyType: 'Property Type',
      allTypes: 'All Types',
      sortBy: 'Sort By',
      newest: 'Newest First',
      lowToHigh: 'Price: Low to High',
      highToLow: 'Price: High to Low',
      showing: 'Showing',
      properties: 'properties',
      noResultsTitle: 'No properties found',
      noResultsBody: 'Try adjusting your search terms or filters.',
    },
    ta: {
      title: 'அனைத்து சொத்துக்களையும் பாருங்கள்',
      subtitle: 'யாழ்ப்பாணம் முழுவதும் உள்ள வீடுகள், காணிகள், அபார்ட்மென்ட்கள், வில்லாக்கள், மற்றும் வணிகச் சொத்துக்களை தேடுங்கள்.',
      searchPlaceholder: 'பகுதி அல்லது சொத்து பெயர் மூலம் தேடுங்கள்...',
      propertyType: 'சொத்து வகை',
      allTypes: 'அனைத்து வகைகளும்',
      sortBy: 'வரிசைப்படுத்தல்',
      newest: 'புதியவை முதலில்',
      lowToHigh: 'விலை: குறைவிலிருந்து அதிகம்',
      highToLow: 'விலை: அதிகத்திலிருந்து குறைவு',
      showing: 'காட்டப்படுவது',
      properties: 'சொத்துக்கள்',
      noResultsTitle: 'பொருத்தமான சொத்துக்கள் எதுவும் இல்லை',
      noResultsBody: 'தேடல் சொற்கள் அல்லது வடிப்பான்களை மாற்றிப் பாருங்கள்.',
    },
  });

  useEffect(() => {
    async function loadData() {
      try {
        const firestoreProps = await getProperties();
        if (firestoreProps.length > 0) setAllProperties(firestoreProps);
      } catch (err) {
        console.error('Firestore load error, using mock data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredAndSortedProperties = useMemo(() => {
    let filtered = [...allProperties];

    if (searchQuery) {
      filtered = filtered.filter((p) => {
        const title = locale === 'ta' && p.title_ta ? p.title_ta : p.title;
        return (
          title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.area?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.address?.toLowerCase().includes(searchQuery.toLowerCase())
        );
      });
    }

    if (selectedType) {
      filtered = filtered.filter(
        (p) => p.type === selectedType || p.property_type?.toLowerCase() === selectedType.toLowerCase()
      );
    }

    if (sortBy === 'price-low') {
      filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortBy === 'price-high') {
      filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
    }

    return filtered;
  }, [allProperties, searchQuery, selectedType, sortBy, locale]);

  return (
    <div className="min-h-screen bg-sand-50">
      <div className="bg-gradient-to-r from-teal-900 to-teal-800 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">{copy.title}</h1>
          <p className="text-teal-100">{copy.subtitle}</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto py-12 px-4">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="mb-6">
            <div className="flex items-center bg-sand-50 rounded-lg px-4 py-3">
              <Search className="w-5 h-5 text-charcoal-400 mr-3" />
              <input
                type="text"
                placeholder={copy.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent outline-none text-charcoal-900"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-charcoal-700 mb-3">
                <Filter className="w-4 h-4 inline mr-2" />
                {copy.propertyType}
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full border border-charcoal-200 rounded-lg px-4 py-2 text-charcoal-900 focus:outline-none focus:border-teal-500"
              >
                <option value="">{copy.allTypes}</option>
                {PROPERTY_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {getPropertyTypeLabel(type, locale)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-charcoal-700 mb-3">
                <ArrowUpDown className="w-4 h-4 inline mr-2" />
                {copy.sortBy}
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full border border-charcoal-200 rounded-lg px-4 py-2 text-charcoal-900 focus:outline-none focus:border-teal-500"
              >
                <option value="newest">{copy.newest}</option>
                <option value="price-low">{copy.lowToHigh}</option>
                <option value="price-high">{copy.highToLow}</option>
              </select>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-charcoal-600">
            {copy.showing} <span className="font-semibold">{filteredAndSortedProperties.length}</span> {copy.properties}
          </p>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-lg overflow-hidden shadow-lg animate-pulse">
                <div className="h-48 bg-charcoal-200" />
                <div className="p-6 space-y-3">
                  <div className="h-5 bg-charcoal-200 rounded w-3/4" />
                  <div className="h-4 bg-charcoal-100 rounded w-1/2" />
                  <div className="h-6 bg-charcoal-200 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredAndSortedProperties.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {filteredAndSortedProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <Search className="w-12 h-12 text-charcoal-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-charcoal-900 mb-2">{copy.noResultsTitle}</h3>
            <p className="text-charcoal-600">{copy.noResultsBody}</p>
          </div>
        )}
      </div>
    </div>
  );
}
