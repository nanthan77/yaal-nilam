'use client';

import { useState, useEffect } from 'react';
import { Bell, Check, MessageSquare, AlertCircle, Search, Package, Home } from 'lucide-react';
import { getActivityFeed } from '@/lib/firestore';
import Link from 'next/link';

const LS_KEY = 'yn_read_feed_ids';

function getReadIds(): Set<string> {
  if (typeof window === 'undefined') return new Set();
  try {
    const stored = localStorage.getItem(LS_KEY);
    return stored ? new Set(JSON.parse(stored)) : new Set();
  } catch {
    return new Set();
  }
}

function persistReadIds(ids: Set<string>) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(Array.from(ids)));
  } catch {}
}

const formatTime = (dateString: string) => {
  if (!dateString) return '—';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '—';
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
};

const typeConfig: Record<string, { icon: any; label: string; bg: string; dot: string }> = {
  inquiry: { icon: MessageSquare, label: 'New Inquiry', bg: 'bg-teal-50 border-teal-200', dot: 'bg-teal-500' },
  listing_submission: { icon: Home, label: 'Listing Submission', bg: 'bg-orange-50 border-orange-200', dot: 'bg-orange-500' },
  property_alert: { icon: Bell, label: 'Property Alert', bg: 'bg-purple-50 border-purple-200', dot: 'bg-purple-500' },
  viewing_request: { icon: Check, label: 'Viewing Request', bg: 'bg-green-50 border-green-200', dot: 'bg-green-500' },
};

export default function NotificationsPage() {
  const [feed, setFeed] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [readIds, setReadIds] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  useEffect(() => {
    setReadIds(getReadIds());
    async function load() {
      try {
        const data = await getActivityFeed();
        setFeed(data);
      } catch (err: any) {
        const msg = err?.message || '';
        if (msg.toLowerCase().includes('permission') || msg.includes('PERMISSION_DENIED')) {
          setError('Permission denied — your account lacks an admin role');
        } else {
          setError('Failed to load activity feed.');
        }
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const markRead = (id: string) => {
    const next = new Set(readIds);
    next.add(id);
    setReadIds(next);
    persistReadIds(next);
  };

  const markAllRead = () => {
    const next = new Set(feed.map((i) => i.id));
    setReadIds(next);
    persistReadIds(next);
  };

  const filtered = feed.filter((item) => {
    const matchesSearch =
      (item.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.message || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || item.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const unreadCount = feed.filter((i) => !readIds.has(i.id)).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-navy-900 flex items-center gap-3">
              <Bell className="w-9 h-9 text-navy-600" />
              Activity Feed
            </h1>
            <p className="text-slate-600 mt-1">Recent inquiries, submissions, and platform events</p>
          </div>
          {unreadCount > 0 && (
            <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
              {unreadCount} Unread
            </span>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700" role="alert">
            {error}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <p className="text-slate-600 text-sm font-medium mb-1">Total</p>
            <p className="text-3xl font-bold text-navy-900">{feed.length}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <p className="text-slate-600 text-sm font-medium mb-1">Unread</p>
            <p className="text-3xl font-bold text-red-600">{unreadCount}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <p className="text-slate-600 text-sm font-medium mb-1">Read</p>
            <p className="text-3xl font-bold text-emerald-600">{feed.length - unreadCount}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-sm p-4 mb-6 border border-gray-100 flex gap-4 flex-wrap">
          <div className="flex-1 relative min-w-48">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search activity…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="all">All Types</option>
            <option value="inquiry">Inquiries</option>
            <option value="listing_submission">Submissions</option>
            <option value="property_alert">Alerts</option>
            <option value="viewing_request">Viewings</option>
          </select>
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 transition"
            >
              Mark all read
            </button>
          )}
        </div>

        {/* Loading */}
        {loading && (
          <div className="py-16 text-center text-slate-500 text-sm">Loading activity…</div>
        )}

        {/* Empty state */}
        {!loading && !error && filtered.length === 0 && (
          <div className="py-16 text-center">
            <Package className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-600 font-medium text-lg">No activity yet</p>
            <p className="text-slate-400 text-sm mt-2">
              {feed.length === 0
                ? 'Activity will appear here as customers submit inquiries and listings.'
                : 'No results match your filters.'}
            </p>
          </div>
        )}

        {/* Feed list */}
        {!loading && filtered.length > 0 && (
          <div className="space-y-3">
            {filtered.map((item) => {
              const cfg = typeConfig[item.type] || { icon: Bell, label: item.type, bg: 'bg-gray-50 border-gray-200', dot: 'bg-gray-500' };
              const Icon = cfg.icon;
              const isRead = readIds.has(item.id);

              return (
                <div
                  key={item.id}
                  onClick={() => markRead(item.id)}
                  className={`border rounded-xl p-4 flex items-start gap-4 cursor-pointer hover:shadow transition ${cfg.bg} ${!isRead ? 'ring-1 ring-inset ring-current' : ''}`}
                >
                  <div className={`${cfg.dot} w-2.5 h-2.5 rounded-full mt-2 flex-shrink-0`} />
                  <div className="w-9 h-9 rounded-full bg-white border border-current/20 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold uppercase tracking-wide text-current/60">{cfg.label}</span>
                      {!isRead && <span className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0" />}
                    </div>
                    <p className="text-sm font-semibold text-slate-900 mt-0.5">{item.title}</p>
                    <p className="text-sm text-slate-600">{item.message}</p>
                    <p className="text-xs text-slate-400 mt-1">{formatTime(item.created_at)}</p>
                  </div>
                  {item.href && (
                    <Link
                      href={item.href}
                      onClick={(e) => e.stopPropagation()}
                      className="text-xs font-medium text-navy-600 hover:underline flex-shrink-0 mt-1"
                    >
                      View
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
