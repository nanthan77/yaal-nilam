// @ts-nocheck
'use client';

import { useState, useMemo } from 'react';
import { MOCK_REQUIREMENTS, MOCK_LISTINGS } from '@/lib/mock-data';
import {
  MessageCircle,
  X,
  Check,
  TrendingUp,
} from 'lucide-react';

interface MatchedListing {
  listing: typeof MOCK_LISTINGS[0];
  matchScore: number;
}

export default function MatchingPage() {
  const [selectedRequirementId, setSelectedRequirementId] = useState<string | null>(null);
  const [hoveredListingId, setHoveredListingId] = useState<string | null>(null);

  const selectedRequirement = selectedRequirementId
    ? MOCK_REQUIREMENTS.find(r => r.id === selectedRequirementId)
    : MOCK_REQUIREMENTS[0];

  const matchedListings = useMemo((): MatchedListing[] => {
    if (!selectedRequirement) return [];

    return MOCK_LISTINGS
      .map(listing => {
        let score = 0;

        // Type matching
        const listingType = listing.property_type || listing.type || '';
        if (listingType === selectedRequirement.property_type) score += 30;
        else if (listingType.includes(selectedRequirement.property_type)) score += 15;

        // Budget matching
        if (listing.price >= selectedRequirement.budget_min && listing.price <= selectedRequirement.budget_max) {
          score += 30;
        } else if (
          listing.price >= selectedRequirement.budget_min * 0.9 &&
          listing.price <= selectedRequirement.budget_max * 1.1
        ) {
          score += 15;
        }

        // Location matching (simplified)
        score += 20;

        // Size preference
        score += 10;

        // Add some randomness for mock data
        score = Math.min(100, Math.max(0, score + (Math.random() - 0.5) * 10));

        return {
          listing,
          matchScore: Math.round(score),
        };
      })
      .filter(m => m.matchScore >= 50)
      .sort((a, b) => b.matchScore - a.matchScore);
  }, [selectedRequirement]);

  const getMatchColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 60) return 'text-teal-600 bg-teal-50 border-teal-200';
    return 'text-orange-600 bg-orange-50 border-orange-200';
  };

  const getMatchBgColor = (score: number) => {
    if (score >= 80) return 'from-green-50 to-green-100';
    if (score >= 60) return 'from-teal-50 to-teal-100';
    return 'from-orange-50 to-orange-100';
  };

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-charcoal-900">Requirement Matching</h1>
          <p className="text-charcoal-600 mt-1">Match buyer requirements with available listings</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Panel: Requirements */}
          <div className="lg:col-span-1">
            <div className="rounded-lg border border-charcoal-200 overflow-hidden">
              <div className="bg-charcoal-50 px-6 py-4 border-b border-charcoal-200">
                <h2 className="text-lg font-semibold text-charcoal-900">Requirements</h2>
              </div>

              <div className="divide-y divide-charcoal-200 max-h-[600px] overflow-y-auto">
                {MOCK_REQUIREMENTS.map((req) => {
                  const matches = MOCK_LISTINGS.filter(l => {
                    return (l.type === req.property_type || l.type.includes(req.property_type)) &&
                           l.price >= req.budget_min * 0.9 &&
                           l.price <= req.budget_max * 1.1;
                  }).length;

                  return (
                    <button
                      key={req.id}
                      onClick={() => setSelectedRequirementId(req.id)}
                      className={`w-full text-left px-6 py-4 border-l-4 transition ${
                        selectedRequirementId === req.id
                          ? 'bg-teal-50 border-l-teal-500'
                          : 'border-l-transparent hover:bg-charcoal-50'
                      }`}
                    >
                      <p className="font-semibold text-charcoal-900">{req.customer_name}</p>
                      <p className="text-sm text-charcoal-600 mt-1">{req.property_type}</p>
                      <p className="text-xs text-charcoal-500 mt-2">
                        Rs. {req.budget_min.toLocaleString()} - {req.budget_max.toLocaleString()}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <TrendingUp className="w-4 h-4 text-teal-600" />
                        <span className="text-xs font-semibold text-teal-700">{matches} matches</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Panel: Matched Listings */}
          <div className="lg:col-span-2">
            {selectedRequirement && (
              <div className="rounded-lg border border-charcoal-200 overflow-hidden">
                <div className="bg-charcoal-50 px-6 py-4 border-b border-charcoal-200">
                  <h2 className="text-lg font-semibold text-charcoal-900">
                    Matches for {selectedRequirement.customer_name}
                  </h2>
                  <p className="text-sm text-charcoal-600 mt-1">
                    {matchedListings.length} listings matched
                  </p>
                </div>

                <div className="divide-y divide-charcoal-200 max-h-[600px] overflow-y-auto">
                  {matchedListings.length > 0 ? (
                    matchedListings.map((match) => (
                      <div
                        key={match.listing.id}
                        onMouseEnter={() => setHoveredListingId(match.listing.id)}
                        onMouseLeave={() => setHoveredListingId(null)}
                        className={`p-6 border-l-4 transition cursor-pointer ${
                          hoveredListingId === match.listing.id
                            ? 'bg-charcoal-50 border-l-teal-500'
                            : 'border-l-charcoal-200 hover:bg-charcoal-25'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <p className="font-semibold text-charcoal-900">{match.listing.address}</p>
                            <p className="text-sm text-charcoal-600 mt-1">{match.listing.property_type || match.listing.type}</p>
                            <p className="text-sm font-semibold text-charcoal-900 mt-2">
                              Rs. {match.listing.price.toLocaleString()}
                            </p>
                            <div className="flex gap-2 mt-3 text-xs text-charcoal-600">
                              <span>{match.listing.bedrooms} beds</span>
                              <span>•</span>
                              <span>{match.listing.bathrooms} baths</span>
                              <span>•</span>
                              <span>{match.listing.sqft} sqft</span>
                            </div>
                          </div>

                          <div className="text-right">
                            <div className={`px-4 py-2 rounded-lg border ${getMatchColor(match.matchScore)}`}>
                              <p className="text-2xl font-bold">{match.matchScore}%</p>
                              <p className="text-xs mt-1">Match</p>
                            </div>
                          </div>
                        </div>

                        {hoveredListingId === match.listing.id && (
                          <div className="flex gap-2 mt-4 pt-4 border-t border-charcoal-200">
                            <button className="flex items-center gap-2 flex-1 px-3 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition font-medium text-sm">
                              <MessageCircle className="w-4 h-4" />
                              WhatsApp
                            </button>
                            <button className="flex items-center gap-2 px-3 py-2 bg-charcoal-100 text-charcoal-700 rounded-lg hover:bg-charcoal-200 transition font-medium text-sm">
                              <Check className="w-4 h-4" />
                            </button>
                            <button className="flex items-center gap-2 px-3 py-2 bg-charcoal-100 text-charcoal-700 rounded-lg hover:bg-charcoal-200 transition font-medium text-sm">
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="p-6 text-center text-charcoal-600">
                      <p>No matching listings found for this requirement.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}