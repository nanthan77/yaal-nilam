'use client';

import { useState, useMemo } from 'react';
import {
  Sparkles,
  Target,
  CheckCircle,
  XCircle,
  Send,
  Bookmark,
  X,
  Filter,
  Clock,
  TrendingUp,
} from 'lucide-react';
import { MOCK_REQUIREMENTS, MOCK_LISTINGS } from '@/lib/mock-data';

// Type definitions
interface Listing {
  id: string;
  title: string;
  area: string;
  price: number;
  type: string;
  status: string;
  agent: string;
  date: Date;
  images: number;
  bedrooms?: number;
}

interface MatchResult {
  listing: Listing;
  score: number;
  breakdown: {
    areaMatch: { score: number; weight: 30; matched: boolean };
    typeMatch: { score: number; weight: 25; matched: boolean };
    budgetFit: { score: number; weight: 25; percentage: number };
    bedroomMatch: { score: number; weight: 20; matched: boolean };
  };
}

interface SavedMatch {
  id: string;
  requirementId: string;
  requirementName: string;
  listingId: string;
  listingTitle: string;
  score: number;
  date: string;
  status: 'sent' | 'saved' | 'dismissed';
}

// Matching algorithm
function calculateMatchScore(
  listing: Listing,
  requirement: any
): MatchResult {
  let score = 0;

  // Area Match (30%)
  const areaMatch = listing.area === requirement.preferred_area;
  if (areaMatch) score += 30;

  // Property Type Match (25%)
  const typeMatch = listing.type === requirement.property_type;
  if (typeMatch) score += 25;

  // Budget Fit (25%)
  let budgetScore = 0;
  let budgetPercentage = 0;
  if (
    listing.price >= requirement.budget_min &&
    listing.price <= requirement.budget_max
  ) {
    budgetScore = 25;
    budgetPercentage = 100;
  } else if (
    listing.price >= requirement.budget_min * 0.8 &&
    listing.price <= requirement.budget_max * 1.2
  ) {
    budgetScore = 15;
    budgetPercentage = 60;
  }
  score += budgetScore;

  // Bedrooms Match (20%)
  let bedroomScore = 0;
  const bedroomMatch =
    listing.bedrooms && requirement.bedrooms
      ? listing.bedrooms === requirement.bedrooms
      : !listing.bedrooms && !requirement.bedrooms;

  if (bedroomMatch) {
    bedroomScore = 20;
  } else if (
    listing.bedrooms &&
    requirement.bedrooms &&
    Math.abs(listing.bedrooms - requirement.bedrooms) === 1
  ) {
    bedroomScore = 10;
  }
  score += bedroomScore;

  return {
    listing,
    score: Math.round(score),
    breakdown: {
      areaMatch: { score: areaMatch ? 30 : 0, weight: 30, matched: areaMatch },
      typeMatch: { score: typeMatch ? 25 : 0, weight: 25, matched: typeMatch },
      budgetFit: { score: budgetScore, weight: 25, percentage: budgetPercentage },
      bedroomMatch: { score: bedroomScore, weight: 20, matched: bedroomMatch },
    },
  };
}

// Score color indicator
function getScoreColor(score: number): string {
  if (score >= 70) return 'text-green-600';
  if (score >= 40) return 'text-amber-600';
  return 'text-red-600';
}

function getScoreBgColor(score: number): string {
  if (score >= 70) return 'bg-green-100';
  if (score >= 40) return 'bg-amber-100';
  return 'bg-red-100';
}

export default function MatchingPage() {
  const [selectedRequirement, setSelectedRequirement] = useState<any | null>(
    null
  );
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [savedMatches, setSavedMatches] = useState<SavedMatch[]>([]);
  const [filter, setFilter] = useState<'unmatched' | 'all' | 'recent'>(
    'unmatched'
  );
  const [isMatching, setIsMatching] = useState(false);
  const [historyFilter, setHistoryFilter] = useState<
    'all' | 'sent' | 'saved' | 'dismissed'
  >('all');

  // Filter requirements based on selected filter
  const filteredRequirements = useMemo(() => {
    if (filter === 'unmatched') {
      return MOCK_REQUIREMENTS.filter((r) => r.matches_count === 0);
    } else if (filter === 'recent') {
      return [...MOCK_REQUIREMENTS].sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    }
    return MOCK_REQUIREMENTS;
  }, [filter]);

  // Calculate stats
  const stats = useMemo(() => {
    const unmatchedCount = MOCK_REQUIREMENTS.filter(
      (r) => r.matches_count === 0
    ).length;
    const todayMatches = Math.floor(Math.random() * 15) + 8;
    const successRate = 78;
    const avgScore =
      savedMatches.length > 0
        ? Math.round(
            savedMatches.reduce((sum, m) => sum + m.score, 0) /
              savedMatches.length
          )
        : 0;

    return {
      requirementsPending: unmatchedCount,
      matchesFoundToday: todayMatches,
      autoMatchSuccessRate: successRate,
      avgMatchScore: avgScore,
    };
  }, [savedMatches]);

  // Handle finding matches
  const handleFindMatches = (requirement: any) => {
    setSelectedRequirement(requirement);
    setIsMatching(true);

    // Simulate matching delay
    setTimeout(() => {
      const allMatches = (MOCK_LISTINGS as Listing[]).map((listing) =>
        calculateMatchScore(listing, requirement)
      );
      const sortedMatches = allMatches.sort((a, b) => b.score - a.score);
      setMatches(sortedMatches);
      setIsMatching(false);
    }, 1500);
  };

  // Handle saving a match
  const handleSaveMatch = (match: MatchResult) => {
    const newSavedMatch: SavedMatch = {
      id: `SM${Date.now()}`,
      requirementId: selectedRequirement.id,
      requirementName: selectedRequirement.customer_name,
      listingId: match.listing.id,
      listingTitle: match.listing.title,
      score: match.score,
      date: new Date().toLocaleDateString(),
      status: 'saved',
    };
    setSavedMatches([...savedMatches, newSavedMatch]);
  };

  // Handle dismissing a match
  const handleDismissMatch = (matchId: string) => {
    setMatches(matches.filter((m) => m.listing.id !== matchId));
  };

  // Handle sending match to customer
  const handleSendMatch = (match: MatchResult) => {
    const newSavedMatch: SavedMatch = {
      id: `SM${Date.now()}`,
      requirementId: selectedRequirement.id,
      requirementName: selectedRequirement.customer_name,
      listingId: match.listing.id,
      listingTitle: match.listing.title,
      score: match.score,
      date: new Date().toLocaleDateString(),
      status: 'sent',
    };
    setSavedMatches([...savedMatches, newSavedMatch]);
    handleDismissMatch(match.listing.id);
  };

  // Filter saved matches for history
  const filteredSavedMatches = useMemo(() => {
    if (historyFilter === 'all') return savedMatches;
    return savedMatches.filter((m) => m.status === historyFilter);
  }, [savedMatches, historyFilter]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-600 rounded-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900">
              AI Matching Engine
            </h1>
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors">
            <Sparkles className="w-5 h-5" />
            Run Full Auto-Match
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-200">
            <div className="text-sm text-slate-600 mb-1">
              Requirements Pending Match
            </div>
            <div className="text-3xl font-bold text-slate-900">
              {stats.requirementsPending}
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-200">
            <div className="text-sm text-slate-600 mb-1">Matches Found Today</div>
            <div className="text-3xl font-bold text-green-600">
              {stats.matchesFoundToday}
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-200">
            <div className="text-sm text-slate-600 mb-1">
              Auto-Match Success Rate
            </div>
            <div className="text-3xl font-bold text-blue-600">
              {stats.autoMatchSuccessRate}%
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-200">
            <div className="text-sm text-slate-600 mb-1">Avg Match Score</div>
            <div className="text-3xl font-bold text-purple-600">
              {stats.avgMatchScore}
            </div>
          </div>
        </div>
      </div>

      {/* Main Layout - Two Panel */}
      <div className="grid grid-cols-10 gap-6">
        {/* Left Panel - Requirements (40%) */}
        <div className="col-span-4 bg-white rounded-lg shadow-md border border-slate-200 flex flex-col">
          <div className="p-4 border-b border-slate-200">
            <h2 className="text-lg font-semibold text-slate-900 mb-3">
              Requirements
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('unmatched')}
                className={`px-3 py-1 text-sm rounded transition-colors ${
                  filter === 'unmatched'
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Unmatched Only
              </button>
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1 text-sm rounded transition-colors ${
                  filter === 'all'
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('recent')}
                className={`px-3 py-1 text-sm rounded transition-colors ${
                  filter === 'recent'
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Recently Updated
              </button>
            </div>
          </div>

          {/* Requirements List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {filteredRequirements.map((req) => (
              <div
                key={req.id}
                onClick={() => handleFindMatches(req)}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedRequirement?.id === req.id
                    ? 'border-purple-600 bg-purple-50'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-slate-900">
                      {req.customer_name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      {req.intent === 'buy' ? 'Buy' : 'Rent'} -{' '}
                      {req.property_type}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded ${
                      req.urgency === 'high'
                        ? 'bg-red-100 text-red-700'
                        : req.urgency === 'medium'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    {req.urgency.charAt(0).toUpperCase() + req.urgency.slice(1)}
                  </span>
                </div>
                <p className="text-sm text-slate-600 mb-2">{req.preferred_area}</p>
                <div className="flex justify-between items-center text-xs text-slate-500">
                  <span>
                    {req.intent === 'buy'
                      ? `${(req.budget_min / 1000000).toFixed(1)}M - ${(req.budget_max / 1000000).toFixed(1)}M`
                      : `${req.budget_min.toLocaleString()} - ${req.budget_max.toLocaleString()}`}
                  </span>
                  <span className="font-semibold text-purple-600">
                    {req.matches_count} match{req.matches_count !== 1 ? 'es' : ''}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel - Matching Results (60%) */}
        <div className="col-span-6 bg-white rounded-lg shadow-md border border-slate-200 flex flex-col">
          <div className="p-4 border-b border-slate-200">
            <h2 className="text-lg font-semibold text-slate-900">
              {selectedRequirement
                ? 'Matching Results'
                : 'Select a requirement to find matches'}
            </h2>
          </div>

          {/* Results Area */}
          {selectedRequirement ? (
            <div className="flex-1 overflow-y-auto p-4">
              {isMatching ? (
                <div className="flex items-center justify-center h-96">
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-full border-4 border-slate-200 border-t-purple-600 animate-spin mx-auto mb-4" />
                    <p className="text-slate-600 font-medium">Analyzing properties...</p>
                  </div>
                </div>
              ) : matches.length > 0 ? (
                <div className="space-y-4">
                  {matches.map((match) => (
                    <div
                      key={match.listing.id}
                      className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      {/* Score Card */}
                      <div className="flex gap-4 mb-4">
                        {/* Circular Score */}
                        <div className="flex-shrink-0">
                          <div
                            className={`w-20 h-20 rounded-full flex items-center justify-center font-bold text-xl ${getScoreBgColor(match.score)} ${getScoreColor(match.score)}`}
                          >
                            {match.score}%
                          </div>
                        </div>

                        {/* Listing Info */}
                        <div className="flex-1">
                          <h3 className="font-semibold text-slate-900">
                            {match.listing.title}
                          </h3>
                          <p className="text-sm text-slate-600 mt-1">
                            {match.listing.area} • {match.listing.type}
                          </p>
                          <p className="text-sm font-semibold text-slate-900 mt-2">
                            {selectedRequirement.intent === 'buy'
                              ? `${(match.listing.price / 1000000).toFixed(2)}M`
                              : `${match.listing.price.toLocaleString()} per month`}
                          </p>
                        </div>
                      </div>

                      {/* Score Breakdown */}
                      <div className="bg-slate-50 rounded-lg p-3 mb-4 grid grid-cols-2 gap-3">
                        {/* Area Match */}
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-semibold text-slate-700">
                              Area Match
                            </span>
                            {match.breakdown.areaMatch.matched ? (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            ) : (
                              <XCircle className="w-4 h-4 text-red-600" />
                            )}
                          </div>
                          <div className="w-full h-2 bg-slate-200 rounded">
                            <div
                              className="h-full bg-green-600 rounded"
                              style={{
                                width: `${(match.breakdown.areaMatch.score / 30) * 100}%`,
                              }}
                            />
                          </div>
                          <p className="text-xs text-slate-600 mt-1">
                            {match.breakdown.areaMatch.score}/30
                          </p>
                        </div>

                        {/* Property Type */}
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-semibold text-slate-700">
                              Type Match
                            </span>
                            {match.breakdown.typeMatch.matched ? (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            ) : (
                              <XCircle className="w-4 h-4 text-red-600" />
                            )}
                          </div>
                          <div className="w-full h-2 bg-slate-200 rounded">
                            <div
                              className="h-full bg-blue-600 rounded"
                              style={{
                                width: `${(match.breakdown.typeMatch.score / 25) * 100}%`,
                              }}
                            />
                          </div>
                          <p className="text-xs text-slate-600 mt-1">
                            {match.breakdown.typeMatch.score}/25
                          </p>
                        </div>

                        {/* Budget Fit */}
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-semibold text-slate-700">
                              Budget Fit
                            </span>
                            <span className="text-xs font-semibold text-slate-900">
                              {match.breakdown.budgetFit.percentage}%
                            </span>
                          </div>
                          <div className="w-full h-2 bg-slate-200 rounded">
                            <div
                              className="h-full bg-purple-600 rounded"
                              style={{
                                width: `${(match.breakdown.budgetFit.score / 25) * 100}%`,
                              }}
                            />
                          </div>
                          <p className="text-xs text-slate-600 mt-1">
                            {match.breakdown.budgetFit.score}/25
                          </p>
                        </div>

                        {/* Bedrooms Match */}
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-semibold text-slate-700">
                              Bedrooms
                            </span>
                            {match.breakdown.bedroomMatch.matched ? (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            ) : (
                              <XCircle className="w-4 h-4 text-red-600" />
                            )}
                          </div>
                          <div className="w-full h-2 bg-slate-200 rounded">
                            <div
                              className="h-full bg-amber-600 rounded"
                              style={{
                                width: `${(match.breakdown.bedroomMatch.score / 20) * 100}%`,
                              }}
                            />
                          </div>
                          <p className="text-xs text-slate-600 mt-1">
                            {match.breakdown.bedroomMatch.score}/20
                          </p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSendMatch(match)}
                          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded transition-colors"
                        >
                          <Send className="w-4 h-4" />
                          Send to Customer
                        </button>
                        <button
                          onClick={() => handleSaveMatch(match)}
                          className="flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded transition-colors"
                        >
                          <Bookmark className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDismissMatch(match.listing.id)}
                          className="flex items-center justify-center gap-2 px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-sm font-semibold rounded transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-96">
                  <p className="text-slate-500 text-center">
                    <Target className="w-12 h-12 mx-auto mb-2 text-slate-400" />
                    No matches found. Refine search criteria or check listings.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center flex-1">
              <p className="text-slate-500 text-center">
                <Target className="w-12 h-12 mx-auto mb-2 text-slate-400" />
                Select a requirement from the left panel to begin matching
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Match History Section */}
      <div className="mt-6 bg-white rounded-lg shadow-md border border-slate-200">
        <div className="p-4 border-b border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-purple-600" />
              Match History
            </h2>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setHistoryFilter('all')}
              className={`px-3 py-1 text-sm rounded transition-colors ${
                historyFilter === 'all'
                  ? 'bg-purple-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setHistoryFilter('sent')}
              className={`px-3 py-1 text-sm rounded transition-colors ${
                historyFilter === 'sent'
                  ? 'bg-purple-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Sent
            </button>
            <button
              onClick={() => setHistoryFilter('saved')}
              className={`px-3 py-1 text-sm rounded transition-colors ${
                historyFilter === 'saved'
                  ? 'bg-purple-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Saved
            </button>
            <button
              onClick={() => setHistoryFilter('dismissed')}
              className={`px-3 py-1 text-sm rounded transition-colors ${
                historyFilter === 'dismissed'
                  ? 'bg-purple-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Dismissed
            </button>
          </div>
        </div>

        {/* History Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">
                  Requirement
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">
                  Matched Property
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">
                  Score
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredSavedMatches.length > 0 ? (
                filteredSavedMatches.map((match) => (
                  <tr key={match.id} className="border-b border-slate-200 hover:bg-slate-50">
                    <td className="px-4 py-3 text-sm text-slate-900">
                      {match.requirementName}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-900">
                      {match.listingTitle}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`font-semibold ${getScoreColor(match.score)}`}>
                        {match.score}%
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">
                      {match.date}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded ${
                          match.status === 'sent'
                            ? 'bg-green-100 text-green-700'
                            : match.status === 'saved'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {match.status.charAt(0).toUpperCase() +
                          match.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                    No matches in this category yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
