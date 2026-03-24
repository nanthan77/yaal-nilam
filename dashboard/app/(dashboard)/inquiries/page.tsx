'use client';

import React, { useState, useMemo } from 'react';
import {
  MessageCircle,
  Phone,
  Mail,
  Calendar,
  X,
  Search,
  Filter,
  Plus,
  Send,
  Download,
  ChevronRight,
  Clock,
  AlertCircle,
  TrendingUp,
  MessageSquare,
  MapPin,
  Globe,
  ArrowRight,
  Dot,
  ExternalLink,
} from 'lucide-react';
import { MOCK_INQUIRIES } from '@/lib/mock-data';

interface Inquiry {
  id: string;
  customerName: string;
  phone: string;
  email: string;
  source: 'Website' | 'WhatsApp' | 'Phone' | 'Facebook' | 'Google' | 'Referral';
  priority: 'Hot' | 'Warm' | 'Cold';
  status: 'New' | 'Contacted' | 'Interested' | 'Site Visit' | 'Negotiating' | 'Closed Won' | 'Closed Lost';
  listingId: string;
  listingName: string;
  assignedAgent: string;
  followUpDate: string;
  lastContact: string;
  notes: string[];
  timeline: Array<{ date: string; action: string; status: string }>;
  leadScore: number;
  engagementLevel: number;
}

type StageType = 'New' | 'Contacted' | 'Interested' | 'Site Visit' | 'Negotiating' | 'Closed Won' | 'Closed Lost';

const PIPELINE_STAGES: StageType[] = ['New', 'Contacted', 'Interested', 'Site Visit', 'Negotiating', 'Closed Won', 'Closed Lost'];

const SOURCES = ['Website', 'WhatsApp', 'Phone', 'Facebook', 'Google', 'Referral'];
const PRIORITIES = ['Hot', 'Warm', 'Cold'];
const AGENTS = ['Raj Kumar', 'Priya Singh', 'Ahmed Hassan', 'Maria Lopez'];

const getSourceIcon = (source: string) => {
  switch (source) {
    case 'WhatsApp':
      return <MessageCircle className="w-4 h-4 text-green-600" />;
    case 'Phone':
      return <Phone className="w-4 h-4 text-purple-600" />;
    case 'Website':
      return <Globe className="w-4 h-4 text-blue-600" />;
    case 'Facebook':
      return <Globe className="w-4 h-4 text-blue-600" />;
    case 'Google':
      return <Globe className="w-4 h-4 text-blue-600" />;
    case 'Referral':
      return <TrendingUp className="w-4 h-4 text-orange-600" />;
    default:
      return null;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'New':
      return 'bg-blue-100 text-blue-800';
    case 'Contacted':
      return 'bg-cyan-100 text-cyan-800';
    case 'Interested':
      return 'bg-amber-100 text-amber-800';
    case 'Site Visit':
      return 'bg-purple-100 text-purple-800';
    case 'Negotiating':
      return 'bg-orange-100 text-orange-800';
    case 'Closed Won':
      return 'bg-green-100 text-green-800';
    case 'Closed Lost':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'Hot':
      return 'text-red-600';
    case 'Warm':
      return 'text-amber-600';
    case 'Cold':
      return 'text-blue-600';
    default:
      return 'text-gray-600';
  }
};

const getStageColor = (stage: string, index: number) => {
  if (stage === 'Closed Won') return 'from-green-50 to-green-100';
  if (stage === 'Closed Lost') return 'from-red-50 to-red-100';
  const hue = (index / PIPELINE_STAGES.length) * 180;
  return `from-blue-50 to-blue-100`;
};

export default function InquiriesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStage, setSelectedStage] = useState<StageType | 'All'>('All');
  const [priorityFilter, setPriorityFilter] = useState<string>('All');
  const [sourceFilter, setSourceFilter] = useState<string>('All');
  const [agentFilter, setAgentFilter] = useState<string>('All');
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [showDetailPanel, setShowDetailPanel] = useState(false);
  const [newNote, setNewNote] = useState('');

  // Type guard to check if inquiry has status property
  const inquiries = (MOCK_INQUIRIES as unknown as Inquiry[]) || [];

  const filteredInquiries = useMemo(() => {
    return inquiries.filter((inquiry) => {
      const matchesSearch =
        inquiry.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inquiry.phone.includes(searchTerm) ||
        inquiry.listingName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStage = selectedStage === 'All' || inquiry.status === selectedStage;
      const matchesPriority = priorityFilter === 'All' || inquiry.priority === priorityFilter;
      const matchesSource = sourceFilter === 'All' || inquiry.source === sourceFilter;
      const matchesAgent = agentFilter === 'All' || inquiry.assignedAgent === agentFilter;

      return matchesSearch && matchesStage && matchesPriority && matchesSource && matchesAgent;
    });
  }, [searchTerm, selectedStage, priorityFilter, sourceFilter, agentFilter, inquiries]);

  const stageStats = useMemo(() => {
    return PIPELINE_STAGES.map((stage) => {
      const stageInquiries = inquiries.filter((i) => i.status === stage);
      return {
        stage,
        count: stageInquiries.length,
        value: stageInquiries.length * 500000, // Mock value
      };
    });
  }, [inquiries]);

  const quickStats = useMemo(() => {
    const newLeads = inquiries.filter((i) => i.status === 'New').length;
    const hotLeads = inquiries.filter((i) => i.priority === 'Hot').length;
    const followupsDue = inquiries.filter((i) => {
      const dueDate = new Date(i.followUpDate);
      return dueDate <= new Date() && i.status !== 'Closed Won' && i.status !== 'Closed Lost';
    }).length;
    const closedWon = inquiries.filter((i) => i.status === 'Closed Won').length;
    const conversionRate = inquiries.length > 0 ? ((closedWon / inquiries.length) * 100).toFixed(1) : '0';

    return { newLeads, hotLeads, followupsDue, conversionRate };
  }, [inquiries]);

  const handleAddNote = () => {
    if (selectedInquiry && newNote.trim()) {
      selectedInquiry.notes.push(newNote);
      setNewNote('');
    }
  };

  const isOverdue = (date: string) => {
    return new Date(date) < new Date() && new Date().toDateString() !== new Date(date).toDateString();
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedStage('All');
    setPriorityFilter('All');
    setSourceFilter('All');
    setAgentFilter('All');
    setDateRange({ from: '', to: '' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Inquiries & Leads</h1>
              <p className="text-sm text-gray-500 mt-1">
                Total Leads: <span className="font-semibold text-gray-900">{inquiries.length}</span>
              </p>
            </div>
            <div className="flex gap-3">
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add Lead
              </button>
              <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition flex items-center gap-2">
                <Send className="w-4 h-4" />
                Send Bulk WhatsApp
              </button>
              <button className="px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg font-medium transition flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-600 font-medium">New Leads</p>
              <p className="text-2xl font-bold text-blue-900">{quickStats.newLeads}</p>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-lg border border-red-200">
              <p className="text-sm text-red-600 font-medium">Hot Leads</p>
              <p className="text-2xl font-bold text-red-900">{quickStats.hotLeads}</p>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg border border-orange-200">
              <p className="text-sm text-orange-600 font-medium">Follow-ups Due</p>
              <p className="text-2xl font-bold text-orange-900">{quickStats.followupsDue}</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
              <p className="text-sm text-green-600 font-medium">Conversion Rate</p>
              <p className="text-2xl font-bold text-green-900">{quickStats.conversionRate}%</p>
            </div>
          </div>
        </div>

        {/* Pipeline Visualization */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Sales Pipeline</h3>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {stageStats.map((stat, index) => (
              <button
                key={stat.stage}
                onClick={() => setSelectedStage(stat.stage as StageType)}
                className={`flex-shrink-0 px-4 py-3 rounded-lg border-2 transition cursor-pointer ${
                  selectedStage === stat.stage
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <p className="text-xs font-medium text-gray-600">{stat.stage}</p>
                <p className="text-lg font-bold text-gray-900 mt-1">{stat.count}</p>
                <p className="text-xs text-gray-500 mt-1">₨{(stat.value / 1000000).toFixed(0)}M</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="px-6 py-6 flex gap-6">
        {/* Main Content */}
        <div className="flex-1">
          {/* Filter Bar */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
            <div className="flex flex-col gap-4">
              {/* Search */}
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by name, phone, or listing..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Filters */}
              <div className="grid grid-cols-6 gap-3">
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="All">All Priorities</option>
                  {PRIORITIES.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>

                <select
                  value={sourceFilter}
                  onChange={(e) => setSourceFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="All">All Sources</option>
                  {SOURCES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>

                <select
                  value={agentFilter}
                  onChange={(e) => setAgentFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="All">All Agents</option>
                  {AGENTS.map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </select>

                <input
                  type="date"
                  value={dateRange.from}
                  onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <input
                  type="date"
                  value={dateRange.to}
                  onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <button
                  onClick={clearFilters}
                  className="px-3 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-medium transition"
                >
                  Clear Filters
                </button>
              </div>

              <p className="text-sm text-gray-600">
                Showing {filteredInquiries.length} of {inquiries.length} leads
              </p>
            </div>
          </div>

          {/* Lead Table */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Customer Name</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Phone</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Listing</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Source</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Priority</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Assigned To</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Follow-up</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Last Contact</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInquiries.map((inquiry) => (
                    <tr
                      key={inquiry.id}
                      className="border-b border-gray-200 hover:bg-gray-50 transition cursor-pointer"
                      onClick={() => {
                        setSelectedInquiry(inquiry);
                        setShowDetailPanel(true);
                      }}
                    >
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{inquiry.customerName}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          {inquiry.phone}
                          <button className="text-green-600 hover:text-green-700 transition" onClick={(e) => e.stopPropagation()}>
                            <MessageCircle className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{inquiry.listingName}</td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex items-center gap-2">
                          {getSourceIcon(inquiry.source)}
                          <span className="text-gray-600">{inquiry.source}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Dot className={`w-6 h-6 ${getPriorityColor(inquiry.priority)}`} />
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(inquiry.status)}`}>
                          {inquiry.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{inquiry.assignedAgent}</td>
                      <td className="px-6 py-4 text-sm">
                        {isOverdue(inquiry.followUpDate) ? (
                          <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-medium">
                            Overdue: {new Date(inquiry.followUpDate).toLocaleDateString()}
                          </span>
                        ) : (
                          <span className="text-gray-600">{new Date(inquiry.followUpDate).toLocaleDateString()}</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{new Date(inquiry.lastContact).toLocaleDateString()}</td>
                      <td className="px-6 py-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedInquiry(inquiry);
                            setShowDetailPanel(true);
                          }}
                          className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1"
                        >
                          View
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredInquiries.length === 0 && (
              <div className="px-6 py-12 text-center">
                <p className="text-gray-500">No inquiries found matching your filters.</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          <div className="mt-6 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing 1 to {Math.min(10, filteredInquiries.length)} of {filteredInquiries.length} results
            </p>
            <div className="flex gap-2">
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition">
                Previous
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition">
                Next
              </button>
            </div>
          </div>
        </div>

        {/* Detail Panel */}
        {showDetailPanel && selectedInquiry && (
          <div className="w-96 bg-white rounded-lg border border-gray-200 shadow-lg overflow-y-auto max-h-[calc(100vh-120px)]">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">Lead Details</h2>
              <button
                onClick={() => setShowDetailPanel(false)}
                className="text-gray-500 hover:text-gray-700 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-6">
              {/* Customer Info */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Customer Information</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-600 font-medium">Name</p>
                    <p className="text-sm text-gray-900">{selectedInquiry.customerName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 font-medium">Phone</p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-sm text-gray-900">{selectedInquiry.phone}</p>
                      <button className="text-green-600 hover:text-green-700 transition">
                        <MessageCircle className="w-4 h-4" />
                      </button>
                      <button className="text-blue-600 hover:text-blue-700 transition">
                        <Phone className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 font-medium">Email</p>
                    <p className="text-sm text-gray-900">{selectedInquiry.email}</p>
                  </div>
                </div>
              </div>

              {/* Lead Score */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Lead Score</h3>
                <div className="space-y-2">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-medium text-gray-700">Engagement Score</p>
                      <span className="text-sm font-bold text-gray-900">{selectedInquiry.leadScore}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition ${
                          selectedInquiry.leadScore >= 80
                            ? 'bg-red-600'
                            : selectedInquiry.leadScore >= 40
                              ? 'bg-amber-600'
                              : 'bg-blue-600'
                        }`}
                        style={{ width: `${selectedInquiry.leadScore}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      {selectedInquiry.leadScore >= 80 ? 'Hot' : selectedInquiry.leadScore >= 40 ? 'Warm' : 'Cold'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Listing Info */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Listing Interest</h3>
                <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-blue-600 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-blue-900">{selectedInquiry.listingName}</p>
                      <p className="text-xs text-blue-700 mt-1">ID: {selectedInquiry.listingId}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status & Priority Controls */}
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-gray-700 block mb-2">Status</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    {PIPELINE_STAGES.map((stage) => (
                      <option key={stage} value={stage}>
                        {stage}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-700 block mb-2">Priority</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    {PRIORITIES.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-700 block mb-2">Assigned Agent</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    {AGENTS.map((a) => (
                      <option key={a} value={a}>
                        {a}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-700 block mb-2">Follow-up Date</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Timeline */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Timeline</h3>
                <div className="space-y-3">
                  {selectedInquiry.timeline.map((event, index) => (
                    <div key={index} className="flex gap-3">
                      <div className="flex-shrink-0">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mt-2" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-900">{event.action}</p>
                        <p className="text-xs text-gray-500 mt-1">{new Date(event.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Notes</h3>
                <div className="space-y-2 mb-3">
                  {selectedInquiry.notes.map((note, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700">
                      {note}
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Add a note..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={handleAddNote}
                    className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="border-t border-gray-200 pt-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-2">
                  <button className="px-3 py-2 border border-gray-300 hover:bg-gray-50 rounded-lg text-sm font-medium text-gray-700 transition flex items-center justify-center gap-2">
                    <Phone className="w-4 h-4" />
                    Call
                  </button>
                  <button className="px-3 py-2 border border-gray-300 hover:bg-gray-50 rounded-lg text-sm font-medium text-gray-700 transition flex items-center justify-center gap-2">
                    <MessageCircle className="w-4 h-4" />
                    WhatsApp
                  </button>
                  <button className="px-3 py-2 border border-gray-300 hover:bg-gray-50 rounded-lg text-sm font-medium text-gray-700 transition flex items-center justify-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email
                  </button>
                  <button className="px-3 py-2 border border-gray-300 hover:bg-gray-50 rounded-lg text-sm font-medium text-gray-700 transition flex items-center justify-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Visit
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
