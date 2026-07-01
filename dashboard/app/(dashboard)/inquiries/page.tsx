// @ts-nocheck
'use client';

import { useState, useMemo, useEffect } from 'react';
import { getInquiries, updateInquiry } from '@/lib/firestore';
import {
  Search,
  Eye,
  X,
  MessageCircle,
  Phone,
  Package,
} from 'lucide-react';

type StatusFilter = 'All' | 'new' | 'contacted' | 'interested' | 'negotiating' | 'site_visit' | 'closed_won' | 'closed_lost' | 'no_answer' | 'spam';
const STATUSES: StatusFilter[] = ['new', 'contacted', 'interested', 'negotiating', 'site_visit', 'closed_won', 'closed_lost', 'no_answer', 'spam'];
const PRIORITIES = ['hot', 'warm', 'cold'];

function DetailModal({ inquiry, onClose, onSave }: { inquiry: any; onClose: () => void; onSave: (data: any) => void }) {
  const [notes, setNotes] = useState(inquiry.notes || '');
  const [followUp, setFollowUp] = useState(inquiry.follow_up_date || '');
  const [assignedTo, setAssignedTo] = useState(inquiry.assigned_to || '');
  const [status, setStatus] = useState(inquiry.status || 'new');
  const [priority, setPriority] = useState(inquiry.priority || 'warm');
  const [saving, setSaving] = useState(false);

  const phone = inquiry.phone || '';
  const whatsapp = inquiry.whatsapp || phone;

  const handleSave = async () => {
    setSaving(true);
    await onSave({ notes, follow_up_date: followUp, assigned_to: assignedTo, status, priority });
    setSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-y-auto max-h-[90vh]">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-charcoal-900">{inquiry.customer_name}</h2>
            <p className="text-sm text-charcoal-500 mt-0.5">{inquiry.listing_title || 'No listing linked'}</p>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100 transition" aria-label="Close">
            <X className="w-5 h-5 text-charcoal-600" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Message */}
          <div>
            <p className="text-xs font-semibold uppercase text-charcoal-500 mb-2">Message</p>
            <p className="text-sm text-charcoal-800 bg-gray-50 rounded-lg p-4">{inquiry.message || 'No message provided.'}</p>
          </div>

          {/* Contact links */}
          <div className="flex gap-3">
            {phone && (
              <a
                href={`tel:${phone}`}
                className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-100 transition"
              >
                <Phone className="w-4 h-4" />
                {phone}
              </a>
            )}
            {whatsapp && (
              <a
                href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg text-sm font-medium hover:bg-green-100 transition"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp
              </a>
            )}
          </div>

          {/* Status + Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-charcoal-500 mb-2">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-charcoal-500 mb-2">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                {PRIORITIES.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Assigned to */}
          <div>
            <label className="block text-xs font-semibold uppercase text-charcoal-500 mb-2">Assigned To</label>
            <input
              type="text"
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Agent name or email"
            />
          </div>

          {/* Follow-up date */}
          <div>
            <label className="block text-xs font-semibold uppercase text-charcoal-500 mb-2">Follow-up Date</label>
            <input
              type="date"
              value={followUp}
              onChange={(e) => setFollowUp(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold uppercase text-charcoal-500 mb-2">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Internal notes about this inquiry…"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 border-t border-gray-200 pt-4">
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-5 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 transition disabled:opacity-50"
            >
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
            <button
              onClick={onClose}
              className="px-5 py-2 border border-gray-300 text-charcoal-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function InquiriesPage() {
  const [allInquiries, setAllInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All');
  const [sourceFilter, setSourceFilter] = useState('All');
  const [sortKey, setSortKey] = useState('date');
  const [viewingInquiry, setViewingInquiry] = useState<any>(null);
  const [actionMessage, setActionMessage] = useState('');

  useEffect(() => {
    async function loadInquiries() {
      try {
        const fsInquiries = await getInquiries();
        setAllInquiries(fsInquiries);
      } catch (err: any) {
        const msg = err?.message || '';
        if (msg.toLowerCase().includes('permission') || msg.includes('PERMISSION_DENIED')) {
          setError('Permission denied — your account lacks an admin role');
        } else {
          setError('Failed to load inquiries. Check your connection.');
        }
      } finally {
        setLoading(false);
      }
    }
    loadInquiries();
  }, []);

  const showAction = (msg: string) => {
    setActionMessage(msg);
    window.setTimeout(() => setActionMessage(''), 3000);
  };

  const handleStatusChange = async (inquiry: any, newStatus: string) => {
    setAllInquiries((curr) => curr.map((i) => i.id === inquiry.id ? { ...i, status: newStatus } : i));
    const ok = await updateInquiry(inquiry.id, { status: newStatus });
    if (!ok) showAction('Status update failed — check admin access.');
  };

  const handlePriorityChange = async (inquiry: any, newPriority: string) => {
    setAllInquiries((curr) => curr.map((i) => i.id === inquiry.id ? { ...i, priority: newPriority } : i));
    const ok = await updateInquiry(inquiry.id, { priority: newPriority });
    if (!ok) showAction('Priority update failed — check admin access.');
  };

  const handleDetailSave = async (inquiry: any, data: any) => {
    setAllInquiries((curr) => curr.map((i) => i.id === inquiry.id ? { ...i, ...data } : i));
    const ok = await updateInquiry(inquiry.id, data);
    showAction(ok ? 'Inquiry updated.' : 'Update failed — check admin access.');
  };

  const statusTabs: StatusFilter[] = ['All', 'new', 'contacted', 'interested', 'negotiating', 'site_visit', 'closed_won'];
  const sources = ['All', ...Array.from(new Set(allInquiries.map((i) => i.source).filter(Boolean)))];

  const filteredInquiries = useMemo(() => {
    return allInquiries.filter((inquiry) => {
      const matchesSearch =
        (inquiry.customer_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (inquiry.listing_title || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'All' || inquiry.status === statusFilter;
      const matchesSource = sourceFilter === 'All' || inquiry.source === sourceFilter;
      return matchesSearch && matchesStatus && matchesSource;
    }).sort((a, b) => {
      if (sortKey === 'date') {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
      return 0;
    });
  }, [allInquiries, searchTerm, statusFilter, sourceFilter, sortKey]);

  const getPriorityBadgeStyle = (priority: string) => {
    switch (priority) {
      case 'hot': return 'bg-red-100 text-red-800 border border-red-300';
      case 'warm': return 'bg-orange-100 text-orange-800 border border-orange-300';
      case 'cold': return 'bg-navy-100 text-navy-800 border border-navy-300';
      default: return 'bg-gray-100 text-gray-800 border border-gray-300';
    }
  };

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'new': return 'bg-teal-100 text-teal-800';
      case 'contacted': return 'bg-blue-100 text-blue-800';
      case 'interested': return 'bg-purple-100 text-purple-800';
      case 'negotiating': return 'bg-orange-100 text-orange-800';
      case 'site_visit': return 'bg-green-100 text-green-800';
      case 'closed_won': return 'bg-charcoal-100 text-charcoal-800';
      case 'closed_lost': return 'bg-red-100 text-red-800';
      case 'no_answer': return 'bg-gray-100 text-gray-800';
      case 'spam': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
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

        {/* Error banner */}
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
              placeholder="Search by customer name or listing…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-charcoal-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
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

        {/* Loading */}
        {loading && (
          <div className="py-12 text-center text-charcoal-500 text-sm">Loading inquiries…</div>
        )}

        {/* Empty state */}
        {!loading && !error && filteredInquiries.length === 0 && (
          <div className="py-16 text-center">
            <Package className="w-10 h-10 text-charcoal-300 mx-auto mb-3" />
            <p className="text-charcoal-600 font-medium">No inquiries found</p>
            <p className="text-charcoal-400 text-sm mt-1">
              {allInquiries.length === 0
                ? 'Customer inquiries will appear here once submitted.'
                : 'Try adjusting your filters.'}
            </p>
          </div>
        )}

        {/* Table */}
        {!loading && filteredInquiries.length > 0 && (
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
                    <td className="px-6 py-4 text-sm text-charcoal-700">{inquiry.listing_title || '—'}</td>
                    <td className="px-6 py-4 text-sm text-charcoal-600">{inquiry.source}</td>
                    <td className="px-6 py-4">
                      <select
                        value={inquiry.priority}
                        onChange={(e) => handlePriorityChange(inquiry, e.target.value)}
                        className={`px-2 py-1 rounded-full text-xs font-semibold border-0 focus:outline-none focus:ring-2 focus:ring-teal-400 cursor-pointer ${getPriorityBadgeStyle(inquiry.priority)}`}
                      >
                        {PRIORITIES.map((p) => <option key={p} value={p}>{p.toUpperCase()}</option>)}
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={inquiry.status}
                        onChange={(e) => handleStatusChange(inquiry, e.target.value)}
                        className={`px-2 py-1 rounded-full text-xs font-semibold border-0 focus:outline-none focus:ring-2 focus:ring-teal-400 cursor-pointer ${getStatusBadgeStyle(inquiry.status)}`}
                      >
                        {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                    <td className="px-6 py-4 text-sm text-charcoal-700">{inquiry.assigned_to || '—'}</td>
                    <td className="px-6 py-4 text-sm text-charcoal-600">
                      {new Date(inquiry.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setViewingInquiry(inquiry)}
                        className="flex items-center gap-2 px-3 py-1 rounded-lg bg-teal-100 text-teal-700 hover:bg-teal-200 transition text-sm font-medium"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && (
          <div className="mt-6 text-sm text-charcoal-600">
            Showing {filteredInquiries.length} of {allInquiries.length} inquiries
          </div>
        )}
      </div>

      {/* Detail modal */}
      {viewingInquiry && (
        <DetailModal
          inquiry={viewingInquiry}
          onClose={() => setViewingInquiry(null)}
          onSave={(data) => handleDetailSave(viewingInquiry, data)}
        />
      )}
    </div>
  );
}
