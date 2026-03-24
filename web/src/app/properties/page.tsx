// @ts-nocheck
'use client';

import Link from 'next/link';
import { useState, useMemo, useEffect } from 'react';
import { Search, MapPin, Home, Filter, ArrowUpDown } from 'lucide-react';
import { PROPERTIES as MOCK_PROPERTIES, PROPERTY_TYPES } from '@/lib/data';
import { getProperties } from '@/lib/firestore';

export default function PropertiesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [allProperties, setAllProperties] = useState(MOCK_PROPERTIES);
  const [loading, setLoading] = useState(true);

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
      filtered = filtered.filter(
        (p) =>
          p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.area?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedType) {
      filtered = filtered.filter((p) => p.type === selectedType);
    }

    if (sortBy === 'price-low') {
      filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortBy === 'price-high') {
      filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
    }

    return filtered;
  }, [allProperties, searchQuery, selectedType, sortBy]);

  return (
    <div className="min-h-screen bg-sand-50">
      <div className="bg-gradient-to-r from-navy-900 to-navy-800 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">Browse All Properties</h1>
          <p className="text-navy-100">Find your perfect property in Jaffna</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto py-12 px-4">
        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="mb-6">
            <div className="flex items-center bg-sand-50 rounded-lg px-4 py-3">
              <Search className="w-5 h-5 text-charcoal-400 mr-3" />
              <input
                type="text"
                placeholder="Search properties or areas..."
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
                Property Type
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full border border-charcoal-200 rounded-lg px-4 py-2 text-charcoal-900 focus:outline-none focus:border-navy-500"
              >
                <option value="">All Types</option>
                {PROPERTY_TYPES.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-charcoal-700 mb-3">
                <ArrowUpDown className="w-4 h-4 inline mr-2" />
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full border border-charcoal-200 rounded-lg px-4 py-2 text-charcoal-900 focus:outline-none focus:border-navy-500"
              >
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-charcoal-600">
            Showing <span className="font-semibold">{filteredAndSortedProperties.length}</span> properties
          </p>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1,2,3,4,5,6].map((i) => (
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
              <Link key={property.id} href={`/properties/${property.id}`} className="group">
                <div className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
                  <div className="h-48 bg-gradient-to-br from-navy-600 to-navy-800 relative flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform">
                    <MapPin className="w-12 h-12 text-white opacity-50" />
                  </div>
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-bold text-charcoal-900 flex-1">{property.title}</h3>
                      <span className="inline-block bg-navy-50 text-teal-700 text-xs font-semibold px-3 py-1 rounded-full ml-2">
                        {property.type}
                      </span>
                    </div>
                    <p className="text-charcoal-600 text-sm mb-3 flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {property.area}
                    </p>
                    <p className="text-2xl font-bold text-navy-700 mb-4">
                      Rs. {property.price?.toLocaleString()}
                    </p>
                    <div className="flex gap-4 text-charcoal-600 text-sm mb-6 flex-wrap">
                      <span className="flex items-center gap-1">
                        <Home className="w-4 h-4" />
                        {property.bedrooms} Beds
                      </span>
                      <span className="flex items-center gap-1">
                        <Home className="w-4 h-4" />
                        {property.bathrooms} Baths
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {property.sqft} sqft
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="inline-block bg-sand-100 text-charcoal-700 text-xs font-semibold px-3 py-1 rounded">
                        {property.status}
                      </span>
                      <span className="text-navy-700 font-semibold text-sm group-hover:text-teal-700">
                        View →
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <MapPin className="w-12 h-12 text-charcoal-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-charcoal-900 mb-2">No properties found</h3>
            <p className="text-charcoal-600">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
