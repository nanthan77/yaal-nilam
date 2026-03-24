// @ts-nocheck
'use client';

import { useState, useEffect, useMemo } from 'react';
import { MOCK_AGENTS } from '@/lib/mock-data';
import { getAgents, updateAgent } from '@/lib/firestore';
import {
  CheckCircle,
  Shield,
  AlertCircle,
  MapPin,
  Building2,
  MessageSquare,
  MoreVertical,
} from 'lucide-react';

type StatusFilter = 'all' | 'active' | 'pending' | 'suspended';

export default function AgentsPage() {
  const [allAgents, setAllAgents] = useState(MOCK_AGENTS);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function load() {
      try {
        const data = await getAgents();
        if (data && data.length > 0) {
          setAllAgents(data);
        }
      } catch (e) {
        console.error('Failed to load agents from Firestore:', e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filteredAgents = useMemo(() => {
    return allAgents.filter(agent => {
      const matchesStatus = statusFilter === 'all' || agent.status === statusFilter;
      const matchesSearch = agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (agent.company || '').toLowerCase().includes(searchTerm.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [statusFilter, searchTerm, allAgents]);
  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border border-green-300';
      case 'pending':
        return 'bg-orange-100 text-orange-800 border border-orange-300';
      case 'suspended':
        return 'bg-red-100 text-red-800 border border-red-300';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'pending':
        return <AlertCircle className="w-4 h-4 text-orange-600" />;
      case 'suspended':
        return <Shield className="w-4 h-4 text-red-600" />;
      default:
        return null;
    }
  };
  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-charcoal-900">Property Agents</h1>
          <p className="text-charcoal-600 mt-1">Manage and verify real estate agents</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <input
            type="text"
            placeholder="Search agents or companies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 border border-charcoal-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          />

          <div className="flex gap-2">
            {(['all', 'active', 'pending', 'suspended'] as StatusFilter[]).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-lg font-medium transition capitalize ${
                  statusFilter === status
                    ? 'bg-teal-500 text-white'
                    : 'bg-charcoal-100 text-charcoal-700 hover:bg-charcoal-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3].map(i => (
              <div key={i} className="rounded-lg border border-charcoal-200 overflow-hidden">
                <div className="bg-charcoal-100 h-32 animate-pulse" />
                <div className="p-6 space-y-3">
                  <div className="h-4 bg-charcoal-100 rounded animate-pulse w-3/4" />
                  <div className="h-4 bg-charcoal-100 rounded animate-pulse w-1/2" />
                  <div className="h-20 bg-charcoal-100 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Agent Cards Grid */}
        {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAgents.map((agent) => (
            <div
              key={agent.id}
              className="rounded-lg border border-charcoal-200 overflow-hidden hover:shadow-lg transition"
            >
              {/* Card Header */}
              <div className="bg-gradient-to-r from-teal-50 to-navy-50 px-6 py-6 border-b border-charcoal-200">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-charcoal-900">{agent.name}</h3>
                    <p className="text-sm text-charcoal-600">{agent.company}</p>
                  </div>
                  <button className="p-2 hover:bg-charcoal-100 rounded-lg transition">
                    <MoreVertical className="w-5 h-5 text-charcoal-600" />
                  </button>
                </div>

                {/* Verified Badge */}
                <div className="flex items-center gap-2">
                  {agent.verified && (
                    <div className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                      <CheckCircle className="w-3 h-3" />
                      Verified
                    </div>
                  )}
                  <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeStyle(agent.status)}`}>
                    {getStatusIcon(agent.status)}
                    {agent.status.charAt(0).toUpperCase() + agent.status.slice(1)}
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6">
                {/* Service Areas */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin className="w-4 h-4 text-teal-600" />
                    <p className="text-sm font-semibold text-charcoal-900">Service Areas</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(agent.service_areas || []).map((area, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-sand-100 text-sand-800 rounded text-xs font-medium"
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-charcoal-50 rounded-lg">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Building2 className="w-4 h-4 text-teal-600" />
                    </div>
                    <p className="text-lg font-bold text-charcoal-900">{agent.active_listings || 0}</p>
                    <p className="text-xs text-charcoal-600">Listings</p>
                  </div>

                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <MessageSquare className="w-4 h-4 text-teal-600" />
                    </div>
                    <p className="text-lg font-bold text-charcoal-900">{agent.total_inquiries || 0}</p>
                    <p className="text-xs text-charcoal-600">Inquiries</p>
                  </div>

                  <div className="text-center">
                    <p className="text-lg font-bold text-charcoal-900">{agent.response_rate || 0}%</p>
                    <p className="text-xs text-charcoal-600">Response</p>
                  </div>
                </div>

                {/* Contact */}
                <div className="text-sm text-charcoal-600 mb-4 space-y-1">
                  <p>Email: {agent.email}</p>
                  <p>Phone: {agent.phone}</p>
                </div>
              </div>
              {/* Card Footer - Actions */}
              <div className="border-t border-charcoal-200 px-6 py-4 bg-charcoal-50 flex gap-3">
                {agent.status === 'pending' && (
                  <button className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium text-sm">
                    Verify
                  </button>
                )}

                {agent.status === 'active' && (
                  <button className="flex-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium text-sm">
                    Suspend
                  </button>
                )}

                {agent.status === 'suspended' && (
                  <button className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium text-sm">
                    Reactivate
                  </button>
                )}

                <button className="flex-1 px-3 py-2 bg-teal-100 text-teal-700 rounded-lg hover:bg-teal-200 transition font-medium text-sm">
                  View Profile
                </button>
              </div>
            </div>
          ))}
        </div>
        )}

        {!loading && filteredAgents.length === 0 && (
          <div className="text-center py-12">
            <p className="text-charcoal-600">No agents found matching your criteria.</p>
          </div>
        )}

        {/* Footer Stats */}
        <div className="mt-8 text-sm text-charcoal-600">
          <p>Showing {filteredAgents.length} of {allAgents.length} agents</p>
        </div>
      </div>
    </div>
  );
}