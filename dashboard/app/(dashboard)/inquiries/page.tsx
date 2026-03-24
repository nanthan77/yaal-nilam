// @ts-nocheck
'use client';

import { useState, useMemo, useEffect } from 'react';
import { MOCK_INQUIRIES } from '@/lib/mock-data';
import { getInquiries, updateInquiry } from '@/lib/firestore';
import {
  Search,
  Filter,
  Eye,
  ChevronDown,
} from 'lucide-react';

type StatusFilter = 'All' | 'new' | 'contacted' | 'interested' | 'negotiating' | 'site_visit' | 'closed_won' | 'closed_lost' | 'no_answer' | 'spam';

export default function InquiriesPage() {
  const [allInquiries, setAllInquiries] = useState(MOCK_INQUIRIES);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All');
  const [sourceFilter, setSourceFilter] = useState('All');
  const [sortKey, setSortKey] = useState('date');

  useEffect(() => {
    async function loadInquiries() {
      try {
        const fsInquiries = await getInquiries();
        if (fsInquiries.length > 0) setAllInquiries(fsInquiries);
      } catch (err) {
        console.error('Firestore inquiries load error:', err);
      }
    }
    loadInquiries();
  }, []);

  const statusTabs: StatusFilter[] = ['All', 'new', 'contacted', 'interested', 'negotiating', 'site_visit', 'closed_won'];
  const sources = ['All', ...new Set(allInquiries.map(i => i.source))];

  const filteredInquiries = useMemo(() => {
    return allInquiries.filter(inquiry => {
      const matchesSearch = 
        inquiry.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (inquiry.listing_title || "").toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'All' || inquiry.status === statusFilter;
      const matchesSource = sourceFilter === 'All' || inquiry.source === sourceFilter;

      return matchesSearch && matchesStatus && matchesSource;
    }).sort((a, b) => {
      if (sortKey === 'date') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      return 0;
    });
  }, [searchTerm, statusFilter, sourceFilter, sortKey]);

  const getPriorityBadgeStyle = (priority: string) => {
    switch (priority) {
      case 'hot':
        return 'bg-red-100 text-red-800 border border-red-300';
      case 'warm':
        return 'bg-orange-100 text-orange-800 border border-orange-300';
      case 'cold':
        return 'bg-navy-100 text-navy-800 border border-navy-300';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-300';
    }
  };

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-teal-100 text-teal-800';
      case 'contacted':
        return 'bg-blue-100 text-blue-800';
      case 'interested':
        return 'bg-purple-100 text-purple-800';
      case 'negotiating':
        return 'bg-orange-100 text-orange-800';
      case 'site_visit':
        return 'bg-green-100 text-green-800';
      case 'closed_won':
        return 'bg-charcoal-100 text-charcoal-800';
      case 'closed_lost':
        return 'bg-red-100 text-red-800';
      case 'no_answer':
        return 'bg-gray-100 text-gray-800';
      case 'spam':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-charcoal-900">Property Inquiries</h1>
          <p className="text-charcoal-600 mt-1">Manage and track customer inquiries</p>
        </div>

        {/* Status Tabs */}
        <div className="flex flex-wrap gap-2 mb-6 border-b border-charcoal-200 pb-4">
          {statusTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                statusFilter === tab
                  ? 'bg-teal-500 text-white'
                  : 'bg-charcoal-100 text-charcoal-700 hover:bg-charcoal-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 text-charcoal-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by customer name or address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-charcoal-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="flex gap-2">
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="px-4 py-2 border border-charcoal-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              {sources.map((source) => (
                <option key={source} value={source}>
                  {source === 'All' ? 'All Sources' : source}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-lg border border-charcoal-200">
          <table className="w-full">
            <thead>
              <tr className="bg-charcoal-50 border-b border-charcoal-200">
                <th className="px-6 py-3 text-left text-sm font-semibold text-charcoal-900">Customer</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-charcoal-900">Listing</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-charcoal-900">Source</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-charcoal-900">Priority</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-charcoal-900">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-charcoal-900">Assigned To</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-charcoal-900">Date</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-charcoal-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInquiries.map((inquiry) => (
                <tr key={inquiry.id} className="border-b border-charcoal-100 hover:bg-charcoal-50 transition">
                  <td className="px-6 py-4 text-sm font-medium text-charcoal-900">{inquiry.customer_name}</td>
                  <td className="px-6 py-4 text-sm text-charcoal-700">{(inquiry.listing_title || "")}</td>
                  <td className="px-6 py-4 text-sm text-charcoal-600">{inquiry.source}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityBadgeStyle(inquiry.priority)}`}>
                      {inquiry.priority.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeStyle(inquiry.status)}`}>
                      {inquiry.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-charcoal-700">{inquiry.assigned_to || '—'}</td>
                  <td className="px-6 py-4 text-sm text-charcoal-600">{new Date(inquiry.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <button className="flex items-center gap-2 px-3 py-1 rounded-lg bg-teal-100 text-teal-700 hover:bg-teal-200 transition text-sm font-medium">
                      <Eye className="w-4 h-4" />
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredInquiries.length === 0 && (
          <div className="text-center py-12">
            <p className="text-charcoal-600">No inquiries found matching your criteria.</p>
          </div>
        )}

        {/* Footer Stats */}
        <div className="mt-6 flex justify-between items-center text-sm text-charcoal-600">
          <p>Showing {filteredInquiries.length} of {allInquiries.length} inquiries</p>
        </div>
      </div>
    </div>
  );
}