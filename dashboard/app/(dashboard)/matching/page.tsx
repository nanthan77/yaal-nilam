// @ts-nocheck
'use client';

import { useState, useMemo, useEffect } from 'react';
import { getRequirements, getListings, updateRequirement } from '@/lib/firestore';
import {
  MessageCircle,
  X,
  Check,
  TrendingUp,
  Package,
  Zap,
} from 'lucide-react';

// Deterministic scoring: area 40pts, type 25pts, budget 25pts, bedrooms 10pts
function computeScore(req: any, listing: any): { total: number; breakdown: Record<string, number> } {
  const breakdown: Record<string, number> = {
    area: 0,
    property_type: 0,
    budget: 0,
    bedrooms: 0,
  };

  // Area match (40pts)
  const reqArea = (req.preferred_area || '').toLowerCase().trim();
  const listingArea = (listing.area || '').toLowerCase().trim();
  if (reqArea && listingArea && reqArea === listingArea) {
    breakdown.area = 40;
  } else if (reqArea && listingArea && (reqArea.includes(listingArea) || listingArea.includes(reqArea))) {
    breakdown.area = 20;
  }

  // Property type (25pts)
  const reqType = (req.property_type || '').toLowerCase().trim();
  const listingType = (listing.property_type || listing.type || '').toLowerCase().trim();
  if (reqType && listingType && reqType === listingType) {
    breakdown.property_type = 25;
  } else if (reqType && listingType && (reqType.includes(listingType) || listingType.includes(reqType))) {
    breakdown.property_type = 12;
  }

  // Budget fit (25pts)
  const price = Number(listing.price || 0);
  const bMin = Number(req.budget_min || 0);
  const bMax = Number(req.budget_max || 0);
  if (bMin > 0 && bMax > 0) {
    if (price >= bMin && price <= bMax) {
      breakdown.budget = 25;
    } else if (price >= bMin * 0.85 && price <= bMax * 1.15) {
      breakdown.budget = 12;
    }
  } else {
    breakdown.budget = 12; // unknown budget: give half credit
  }

  // Bedrooms (10pts)
  const reqBeds = Number(req.bedrooms || 0);
  const listingBeds = Number(listing.bedrooms || 0);
  if (reqBeds > 0) {
    if (listingBeds === reqBeds) {
      breakdown.bedrooms = 10;
    } else if (Math.abs(listingBeds - reqBeds) === 1) {
      breakdown.bedrooms = 5;
    }
  } else {
    breakdown.bedrooms = 5; // no preference: half credit
  }

  const total = Object.values(breakdown).reduce((a, b) => a + b, 0);
  return { total, breakdown };
}

const getMatchColor = (score: number) => {
  if (score >= 75) return 'text-green-600 bg-green-50 border-green-200';
  if (score >= 50) return 'text-teal-600 bg-teal-50 border-teal-200';
  return 'text-orange-600 bg-orange-50 border-orange-200';
};

export default function MatchingPage() {
  const [requirements, setRequirements] = useState<any[]>([]);
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedRequirementId, setSelectedRequirementId] = useState<string | null>(null);
  const [hoveredListingId, setHoveredListingId] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const [reqs, lists] = await Promise.all([getRequirements(), getListings()]);
        setRequirements(reqs);
        setListings(lists.filter((l: any) => l.status === 'published'));
        if (reqs.length > 0) setSelectedRequirementId(reqs[0].id);
      } catch (err: any) {
        const msg = err?.message || '';
        if (msg.toLowerCase().includes('permission') || msg.includes('PERMISSION_DENIED')) {
          setError('Permission denied — your account lacks an admin role');
        } else {
          setError('Failed to load data. Check your connection.');
        }
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const showAction = (msg: string) => {
    setActionMessage(msg);
    window.setTimeout(() => setActionMessage(''), 3500);
  };

  const selectedRequirement = requirements.find((r) => r.id === selectedRequirementId) || requirements[0] || null;

  const matchedListings = useMemo(() => {
    if (!selectedRequirement) return [];
    return listings
      .map((listing) => {
        const { total, breakdown } = computeScore(selectedRequirement, listing);
        return { listing, matchScore: total, breakdown };
      })
      .filter((m) => m.matchScore >= 30)
      .sort((a, b) => b.matchScore - a.matchScore);
  }, [selectedRequirement, listings]);

  const handleMarkMatched = async (req: any) => {
    const updated = { status: 'matched', matches_count: (req.matches_count || 0) + 1 };
    setRequirements((curr) => curr.map((r) => r.id === req.id ? { ...r, ...updated } : r));
    const ok = await updateRequirement(req.id, updated);
    showAction(ok ? `${req.customer_name} marked as matched.` : 'Update failed — check admin access.');
  };

  const handleDismiss = async (req: any) => {
    setRequirements((curr) => curr.map((r) => r.id === req.id ? { ...r, status: 'closed' } : r));
    const ok = await updateRequirement(req.id, { status: 'closed' });
    showAction(ok ? `Requirement closed.` : 'Update failed — check admin access.');
    if (selectedRequirementId === req.id) {
      const next = requirements.find((r) => r.id !== req.id && r.status !== 'closed');
      setSelectedRequirementId(next?.id || null);
    }
  };

  const buildWaUrl = (req: any, listing: any) => {
    const phone = (req.whatsapp || req.phone || '').replace(/[^0-9]/g, '');
    if (!phone) return '#';
    const text = encodeURIComponent(
      `Hi ${req.customer_name}, we found a great match for your requirement!\n\n` +
      `Property: ${listing.title}\n` +
      `Price: Rs. ${(listing.price || 0).toLocaleString()}\n` +
      `Area: ${listing.area}\n\n` +
      `Would you like more details?`
    );
    return `https://wa.me/${phone}?text=${text}`;
  };

  const activeRequirements = requirements.filter((r) => r.status !== 'closed');

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-charcoal-900 flex items-center gap-3">
            <Zap className="w-8 h-8 text-navy-600" />
            Requirement Matching
          </h1>
          <p className="text-charcoal-600 mt-1">Match buyer requirements with available listings</p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700" role="alert">
            {error}
          </div>
        )}

        {/* Action message */}
        {actionMessage && (
          <div className="mb-4 rounded-lg border border-teal-200 bg-teal-50 px-4 py-3 text-sm font-semibold text-teal-800" role="status">
            {actionMessage}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="py-16 text-center text-charcoal-500 text-sm">Loading requirements and listings…</div>
        )}

        {/* Empty state */}
        {!loading && !error && requirements.length === 0 && (
          <div className="py-16 text-center">
            <Package className="w-12 h-12 text-charcoal-300 mx-auto mb-4" />
            <p className="text-charcoal-600 font-medium text-lg">No requirements yet</p>
            <p className="text-charcoal-400 text-sm mt-2">Add buyer requirements to start matching them with listings.</p>
          </div>
        )}

        {!loading && requirements.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Requirements */}
            <div className="lg:col-span-1">
              <div className="rounded-lg border border-charcoal-200 overflow-hidden">
                <div className="bg-charcoal-50 px-6 py-4 border-b border-charcoal-200">
                  <h2 className="text-lg font-semibold text-charcoal-900">Requirements</h2>
                  <p className="text-sm text-charcoal-500 mt-0.5">{activeRequirements.length} active</p>
                </div>
                <div className="divide-y divide-charcoal-200 max-h-[600px] overflow-y-auto">
                  {activeRequirements.map((req) => {
                    const matchCount = listings.filter((l) => computeScore(req, l).total >= 30).length;
                    const isSelected = selectedRequirementId === req.id || (!selectedRequirementId && req.id === requirements[0]?.id);
                    return (
                      <button
                        key={req.id}
                        onClick={() => setSelectedRequirementId(req.id)}
                        className={`w-full text-left px-6 py-4 border-l-4 transition ${
                          isSelected ? 'bg-teal-50 border-l-teal-500' : 'border-l-transparent hover:bg-charcoal-50'
                        }`}
                      >
                        <p className="font-semibold text-charcoal-900">{req.customer_name}</p>
                        <p className="text-sm text-charcoal-600 mt-1">{req.property_type} · {req.preferred_area || 'Any area'}</p>
                        <p className="text-xs text-charcoal-500 mt-1">
                          Rs. {(req.budget_min || 0).toLocaleString()} – {(req.budget_max || 0).toLocaleString()}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <TrendingUp className="w-3.5 h-3.5 text-teal-600" />
                          <span className="text-xs font-semibold text-teal-700">{matchCount} match{matchCount !== 1 ? 'es' : ''}</span>
                          {req.status === 'matched' && (
                            <span className="ml-auto text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">Matched</span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right: Matched Listings */}
            <div className="lg:col-span-2">
              {selectedRequirement && (
                <div className="rounded-lg border border-charcoal-200 overflow-hidden">
                  <div className="bg-charcoal-50 px-6 py-4 border-b border-charcoal-200 flex items-start justify-between">
                    <div>
                      <h2 className="text-lg font-semibold text-charcoal-900">
                        Matches for {selectedRequirement.customer_name}
                      </h2>
                      <p className="text-sm text-charcoal-600 mt-0.5">
                        {matchedListings.length} listing{matchedListings.length !== 1 ? 's' : ''} matched (score ≥ 30)
                      </p>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => handleMarkMatched(selectedRequirement)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-medium hover:bg-green-700 transition"
                      >
                        <Check className="w-3.5 h-3.5" />
                        Mark Matched
                      </button>
                      <button
                        onClick={() => handleDismiss(selectedRequirement)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-200 text-charcoal-700 rounded-lg text-xs font-medium hover:bg-gray-300 transition"
                      >
                        <X className="w-3.5 h-3.5" />
                        Dismiss
                      </button>
                    </div>
                  </div>

                  <div className="divide-y divide-charcoal-200 max-h-[600px] overflow-y-auto">
                    {matchedListings.length === 0 ? (
                      <div className="p-8 text-center">
                        <Package className="w-10 h-10 text-charcoal-300 mx-auto mb-3" />
                        <p className="text-charcoal-600 font-medium">No matching listings found</p>
                        <p className="text-charcoal-400 text-sm mt-1">Try publishing more listings in the required area and price range.</p>
                      </div>
                    ) : (
                      matchedListings.map((match) => (
                        <div
                          key={match.listing.id}
                          onMouseEnter={() => setHoveredListingId(match.listing.id)}
                          onMouseLeave={() => setHoveredListingId(null)}
                          className={`p-6 border-l-4 transition cursor-pointer ${
                            hoveredListingId === match.listing.id
                              ? 'bg-charcoal-50 border-l-teal-500'
                              : 'border-l-charcoal-200 hover:bg-charcoal-50'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-charcoal-900 truncate">{match.listing.title}</p>
                              <p className="text-sm text-charcoal-600 mt-0.5">
                                {match.listing.property_type} · {match.listing.area}
                              </p>
                              <p className="text-sm font-semibold text-charcoal-900 mt-1">
                                Rs. {(match.listing.price || 0).toLocaleString()}
                              </p>
                              {/* Score breakdown */}
                              <div className="flex flex-wrap gap-2 mt-2">
                                {Object.entries(match.breakdown).map(([key, pts]: [string, any]) => (
                                  pts > 0 && (
                                    <span key={key} className="text-xs bg-white border border-charcoal-200 px-2 py-0.5 rounded-full text-charcoal-600">
                                      {key.replace('_', ' ')}: +{pts}
                                    </span>
                                  )
                                ))}
                              </div>
                            </div>

                            <div className={`px-4 py-2 rounded-lg border text-center flex-shrink-0 ${getMatchColor(match.matchScore)}`}>
                              <p className="text-2xl font-bold">{match.matchScore}</p>
                              <p className="text-xs mt-0.5">/ 100</p>
                            </div>
                          </div>

                          {hoveredListingId === match.listing.id && (
                            <div className="flex gap-2 mt-4 pt-4 border-t border-charcoal-200">
                              <a
                                href={buildWaUrl(selectedRequirement, match.listing)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 flex-1 px-3 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition font-medium text-sm justify-center"
                              >
                                <MessageCircle className="w-4 h-4" />
                                WhatsApp
                              </a>
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
