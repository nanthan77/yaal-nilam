// @ts-nocheck
'use client';

import { useState, useEffect, useMemo } from 'react';
import { getAgentPerformanceReport, getAgents, updateAgent } from '@/lib/firestore';
import {
  CheckCircle,
  Shield,
  AlertCircle,
  MapPin,
  Building2,
  MessageSquare,
  MoreVertical,
  Users,
  Award,
  BarChart3,
  ExternalLink,
  Eye,
  Share2,
  TrendingUp,
} from 'lucide-react';

type StatusFilter = 'all' | 'active' | 'pending' | 'suspended';

export default function AgentsPage() {
  const [allAgents, setAllAgents] = useState([]);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [agentsError, setAgentsError] = useState('');
  const [performance, setPerformance] = useState([]);
  useEffect(() => {
    async function load() {
      try {
        const [data, report] = await Promise.all([getAgents(), getAgentPerformanceReport()]);
        setAllAgents(data || []);
        setPerformance(report || []);
      } catch (e: any) {
        const msg = e?.message || '';
        if (msg.toLowerCase().includes('permission') || msg.includes('PERMISSION_DENIED')) {
          setAgentsError('Permission denied — your account lacks an admin role');
        } else {
          setAgentsError('Failed to load agents.');
        }
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

  const reportTotals = useMemo(() => {
    return performance.reduce(
      (acc, item) => ({
        listings: acc.listings + Number(item.published_listings || 0),
        views: acc.views + Number(item.listing_views || 0),
        whatsapp: acc.whatsapp + Number(item.whatsapp_clicks || 0),
        inquiries: acc.inquiries + Number(item.inquiries || 0),
        trusted: acc.trusted + (Number(item.trust_score || 0) >= 70 ? 1 : 0),
      }),
      { listings: 0, views: 0, whatsapp: 0, inquiries: 0, trusted: 0 }
    );
  }, [performance]);

  const topAgent = performance[0];

  function publicProfileUrl(agentId: string) {
    if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
      return `http://localhost:3000/agents/${agentId}`;
    }
    return `${process.env.NEXT_PUBLIC_WEB_URL || 'https://yaal-nilam.web.app'}/agents/${agentId}`;
  }
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

  async function handleAgentUpdate(agent: any, data: Record<string, any>) {
    const optimistic = { ...agent, ...data };
    setAllAgents((current) => current.map((item) => (item.id === agent.id ? optimistic : item)));
    const ok = await updateAgent(agent.id, { ...data, updated_at: new Date().toISOString() });
    if (!ok) {
      setAllAgents((current) => current.map((item) => (item.id === agent.id ? agent : item)));
    }
  }

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
        {agentsError && (
          <div className="mb-6 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700" role="alert">
            {agentsError}
          </div>
        )}

        {!loading && performance.length > 0 && (
          <section className="mb-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="rounded-lg border border-charcoal-200 bg-white p-5">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-charcoal-600">Top agent</p>
                  <Award className="w-5 h-5 text-warm-600" />
                </div>
                <p className="mt-3 text-2xl font-bold text-charcoal-900 truncate">{topAgent?.name || '—'}</p>
                <p className="mt-1 text-sm text-charcoal-500">{topAgent ? `${topAgent.trust_score} trust score` : 'No ranking yet'}</p>
              </div>
              <div className="rounded-lg border border-charcoal-200 bg-white p-5">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-charcoal-600">Published listings</p>
                  <Building2 className="w-5 h-5 text-teal-600" />
                </div>
                <p className="mt-3 text-2xl font-bold text-charcoal-900">{reportTotals.listings}</p>
                <p className="mt-1 text-sm text-charcoal-500">Connected to agent profiles</p>
              </div>
              <div className="rounded-lg border border-charcoal-200 bg-white p-5">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-charcoal-600">Listing traffic</p>
                  <Eye className="w-5 h-5 text-navy-600" />
                </div>
                <p className="mt-3 text-2xl font-bold text-charcoal-900">{reportTotals.views}</p>
                <p className="mt-1 text-sm text-charcoal-500">{reportTotals.whatsapp} WhatsApp clicks</p>
              </div>
              <div className="rounded-lg border border-charcoal-200 bg-white p-5">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-charcoal-600">Trust-ready agents</p>
                  <Shield className="w-5 h-5 text-green-600" />
                </div>
                <p className="mt-3 text-2xl font-bold text-charcoal-900">{reportTotals.trusted}</p>
                <p className="mt-1 text-sm text-charcoal-500">{reportTotals.inquiries} inquiry signals</p>
              </div>
            </div>

            <div className="rounded-lg border border-charcoal-200 bg-white overflow-hidden">
              <div className="border-b border-charcoal-200 px-5 py-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-bold text-charcoal-900">Agent performance board</h2>
                  <p className="text-sm text-charcoal-500">Ranks agents by verified trust, published inventory, listing traffic, profile views, WhatsApp clicks, and inquiries.</p>
                </div>
                <BarChart3 className="w-6 h-6 text-teal-600" />
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[980px] text-sm">
                  <thead className="bg-charcoal-50 text-charcoal-600">
                    <tr>
                      <th className="text-left px-5 py-3 font-semibold">Rank</th>
                      <th className="text-left px-5 py-3 font-semibold">Agent</th>
                      <th className="text-right px-5 py-3 font-semibold">Trust</th>
                      <th className="text-right px-5 py-3 font-semibold">Traffic</th>
                      <th className="text-right px-5 py-3 font-semibold">Listings</th>
                      <th className="text-right px-5 py-3 font-semibold">Views</th>
                      <th className="text-right px-5 py-3 font-semibold">WhatsApp</th>
                      <th className="text-right px-5 py-3 font-semibold">Inquiries</th>
                      <th className="text-right px-5 py-3 font-semibold">Profile views</th>
                      <th className="text-right px-5 py-3 font-semibold">Profile</th>
                    </tr>
                  </thead>
                  <tbody>
                    {performance.slice(0, 12).map((agent) => (
                      <tr key={agent.id} className="border-t border-charcoal-100 hover:bg-sand-50">
                        <td className="px-5 py-4 font-bold text-charcoal-900">#{agent.rank}</td>
                        <td className="px-5 py-4">
                          <p className="font-semibold text-charcoal-900">{agent.name}</p>
                          <p className="text-xs text-charcoal-500">{agent.company || 'Independent'} · {agent.status}</p>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <span className={`rounded-full px-3 py-1 text-xs font-bold ${agent.trust_score >= 70 ? 'bg-green-100 text-green-800' : agent.trust_score >= 45 ? 'bg-orange-100 text-orange-800' : 'bg-charcoal-100 text-charcoal-700'}`}>
                            {agent.trust_score}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-right font-semibold text-charcoal-900">{agent.traffic_score}</td>
                        <td className="px-5 py-4 text-right text-charcoal-700">{agent.published_listings}</td>
                        <td className="px-5 py-4 text-right text-charcoal-700">{agent.listing_views}</td>
                        <td className="px-5 py-4 text-right text-charcoal-700">{agent.whatsapp_clicks}</td>
                        <td className="px-5 py-4 text-right text-charcoal-700">{agent.inquiries}</td>
                        <td className="px-5 py-4 text-right text-charcoal-700">{agent.profile_views}</td>
                        <td className="px-5 py-4 text-right">
                          <a
                            href={publicProfileUrl(agent.id)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-end gap-1 font-semibold text-teal-700 hover:text-teal-900"
                          >
                            Open
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

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

        {/* Empty state */}
        {!loading && !agentsError && allAgents.length === 0 && (
          <div className="py-16 text-center">
            <Users className="w-12 h-12 text-charcoal-300 mx-auto mb-4" />
            <p className="text-charcoal-600 font-medium text-lg">No agents yet</p>
            <p className="text-charcoal-400 text-sm mt-2">Agents will appear here once they register on the platform.</p>
          </div>
        )}

        {/* Agent Cards Grid */}
        {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAgents.map((agent) => {
            const report = performance.find((item) => item.id === agent.id);
            return (
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
                    <p className="text-lg font-bold text-charcoal-900">{report?.trust_score || 0}</p>
                    <p className="text-xs text-charcoal-600">Trust</p>
                  </div>
                </div>

                {report && (
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="rounded-lg bg-sand-50 px-3 py-2 text-center">
                      <Eye className="w-4 h-4 text-navy-600 mx-auto mb-1" />
                      <p className="text-sm font-bold text-charcoal-900">{report.listing_views}</p>
                      <p className="text-[11px] text-charcoal-500">Views</p>
                    </div>
                    <div className="rounded-lg bg-sand-50 px-3 py-2 text-center">
                      <Share2 className="w-4 h-4 text-teal-600 mx-auto mb-1" />
                      <p className="text-sm font-bold text-charcoal-900">{report.profile_views}</p>
                      <p className="text-[11px] text-charcoal-500">Profile</p>
                    </div>
                    <div className="rounded-lg bg-sand-50 px-3 py-2 text-center">
                      <TrendingUp className="w-4 h-4 text-warm-600 mx-auto mb-1" />
                      <p className="text-sm font-bold text-charcoal-900">{report.traffic_score}</p>
                      <p className="text-[11px] text-charcoal-500">Score</p>
                    </div>
                  </div>
                )}

                <div className="mb-4 rounded-lg border border-charcoal-200 bg-white p-3 text-xs text-charcoal-700">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="font-semibold text-charcoal-500">Plan</p>
                      <p className="mt-0.5 font-bold capitalize text-charcoal-900">{agent.agency_plan || 'starter'}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-charcoal-500">Billing</p>
                      <p className="mt-0.5 font-bold capitalize text-charcoal-900">{agent.billing_status || 'free'}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-charcoal-500">BR / Reg no.</p>
                      <p className="mt-0.5 truncate font-bold text-charcoal-900">{agent.company_registration_no || 'Missing'}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-charcoal-500">Social links</p>
                      <p className="mt-0.5 font-bold text-charcoal-900">{Object.values(agent.social_links || {}).filter(Boolean).length}</p>
                    </div>
                  </div>
                  {agent.website && (
                    <a href={agent.website} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex font-semibold text-teal-700 hover:text-teal-900">
                      Website: {agent.website}
                    </a>
                  )}
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
                  <button
                    onClick={() => handleAgentUpdate(agent, { status: 'active', verified: true, nic_uploaded: true })}
                    className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium text-sm"
                  >
                    Verify
                  </button>
                )}

                {agent.status === 'active' && (
                  <button
                    onClick={() => handleAgentUpdate(agent, { status: 'suspended' })}
                    className="flex-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium text-sm"
                  >
                    Suspend
                  </button>
                )}

                {agent.status === 'suspended' && (
                  <button
                    onClick={() => handleAgentUpdate(agent, { status: 'active' })}
                    className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium text-sm"
                  >
                    Reactivate
                  </button>
                )}

                <a
                  href={publicProfileUrl(agent.id)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 px-3 py-2 bg-teal-100 text-teal-700 rounded-lg hover:bg-teal-200 transition font-medium text-sm text-center"
                >
                  View Profile
                </a>
              </div>
            </div>
            );
          })}
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
