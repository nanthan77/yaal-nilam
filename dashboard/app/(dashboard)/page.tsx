// @ts-nocheck
'use client';

import { useState, useEffect } from 'react';
import { getAnalyticsSummary, getDashboardStats, getListings, getInquiries, publishListing, rejectListing, getActivityFeed } from '@/lib/firestore';
import {
  Home,
  TrendingUp,
  TrendingDown,
  Building2,
  Users,
  MessageSquare,
  DollarSign,
  Target,
  Eye,
  Clock,
  AlertTriangle,
  Bell,
  ChevronRight,
  BarChart3,
  Package,
} from 'lucide-react';
import Link from 'next/link';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [listings, setListings] = useState<any[]>([]);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [feed, setFeed] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState({
    inquiriesWeekly: [] as any[],
    listingsByType: [] as any[],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionMessage, setActionMessage] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        const [fsStats, fsListings, fsInquiries, fsAnalytics, fsFeed] = await Promise.all([
          getDashboardStats(),
          getListings(),
          getInquiries(),
          getAnalyticsSummary(),
          getActivityFeed(),
        ]);
        if (fsStats) setStats(fsStats);
        setListings(fsListings);
        setInquiries(fsInquiries);
        if (fsAnalytics) setAnalytics(fsAnalytics);
        setFeed(fsFeed);
      } catch (err: any) {
        const msg = err?.message || '';
        if (msg.toLowerCase().includes('permission') || msg.includes('PERMISSION_DENIED')) {
          setError('Permission denied — your account lacks an admin role');
        } else {
          setError('Failed to load dashboard data. Check your connection and try again.');
        }
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const showAction = (msg: string) => {
    setActionMessage(msg);
    window.setTimeout(() => setActionMessage(''), 3500);
  };

  const handleApprove = async (listing: any) => {
    setListings((curr) => curr.map((l) => l.id === listing.id ? { ...l, status: 'published' } : l));
    const result = await publishListing(listing);
    showAction(result ? `"${listing.title}" approved.` : 'Approval failed — check admin access.');
  };

  const handleReject = async (listing: any) => {
    setListings((curr) => curr.map((l) => l.id === listing.id ? { ...l, status: 'rejected' } : l));
    const ok = await rejectListing(listing);
    showAction(ok ? `"${listing.title}" rejected.` : 'Rejection failed — check admin access.');
  };

  const pendingListings = listings.filter((l) => l.status === 'pending');
  const recentInquiries = inquiries.slice(0, 5);
  const pieColors = ['#345290', '#28beb4', '#f59e0b', '#ef4444', '#9d8a58'];

  const kpis = stats ? [
    {
      label: 'Active Listings',
      value: stats.activeListings.value,
      change: stats.activeListings.change,
      icon: Building2,
      bgColor: 'bg-navy-50',
      iconColor: 'text-navy-600',
    },
    {
      label: 'Pending Approval',
      value: stats.pendingApproval.value,
      change: stats.pendingApproval.change,
      icon: Clock,
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600',
    },
    {
      label: "Today's Inquiries",
      value: stats.todayInquiries.value,
      change: stats.todayInquiries.change,
      icon: MessageSquare,
      bgColor: 'bg-teal-50',
      iconColor: 'text-teal-600',
    },
    {
      label: 'WhatsApp Leads',
      value: stats.whatsappLeads.value,
      change: stats.whatsappLeads.change,
      icon: Eye,
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
    },
    {
      label: 'Active Requirements',
      value: stats.activeRequirements.value,
      change: stats.activeRequirements.change,
      icon: Target,
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
    },
    {
      label: 'Matches Today',
      value: stats.matchesToday.value,
      change: stats.matchesToday.change,
      icon: TrendingUp,
      bgColor: 'bg-pink-50',
      iconColor: 'text-pink-600',
    },
    {
      label: 'Revenue This Month',
      value: `Rs. ${(stats.revenueThisMonth.value || 0).toLocaleString()}`,
      change: stats.revenueThisMonth.change,
      icon: DollarSign,
      bgColor: 'bg-sand-50',
      iconColor: 'text-sand-600',
    },
    {
      label: 'Conversion Rate',
      value: `${stats.conversionRate.value}%`,
      change: stats.conversionRate.change,
      icon: BarChart3,
      bgColor: 'bg-charcoal-50',
      iconColor: 'text-charcoal-600',
    },
  ] : [];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
        <div className="text-charcoal-600 text-sm font-medium">Loading dashboard…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-charcoal-900 flex items-center gap-3">
          <Home className="w-10 h-10 text-navy-600" />
          Yaal Nilam Dashboard
        </h1>
        <p className="text-charcoal-600 mt-2">
          Welcome back! Here&apos;s your property platform overview.
        </p>
      </div>

      {/* Error banner */}
      {error && (
        <div className="mb-6 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700" role="alert">
          {error}
        </div>
      )}

      {/* Action message */}
      {actionMessage && (
        <div className="mb-6 rounded-lg border border-teal-200 bg-teal-50 px-4 py-3 text-sm font-semibold text-teal-800" role="status">
          {actionMessage}
        </div>
      )}

      {/* KPI Cards Grid */}
      {kpis.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {kpis.map((kpi, idx) => {
            const Icon = kpi.icon;
            const isPositive = kpi.change >= 0;
            return (
              <div
                key={idx}
                className="bg-white rounded-lg shadow p-6 border border-gray-200 hover:shadow-lg transition"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`${kpi.bgColor} p-3 rounded-lg`}>
                    <Icon className={`w-6 h-6 ${kpi.iconColor}`} />
                  </div>
                  <div
                    className={`flex items-center gap-1 text-sm font-semibold ${
                      isPositive ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {isPositive ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                    {Math.abs(kpi.change)}%
                  </div>
                </div>
                <h3 className="text-charcoal-600 text-sm font-medium mb-2">
                  {kpi.label}
                </h3>
                <p className="text-3xl font-bold text-charcoal-900">
                  {kpi.value}
                </p>
              </div>
            );
          })}
        </div>
      )}

      {/* Charts Section */}
      {(analytics.inquiriesWeekly.length > 0 || analytics.listingsByType.length > 0) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Inquiries Weekly Bar Chart */}
          <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
            <h2 className="text-lg font-bold text-charcoal-900 mb-4">
              Inquiries This Week
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.inquiriesWeekly}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="day" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="count" fill="#345290" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Listings by Type Pie Chart */}
          <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
            <h2 className="text-lg font-bold text-charcoal-900 mb-4">
              Listings by Type
            </h2>
            <PieChart width={350} height={300}>
              <Pie
                data={analytics.listingsByType}
                cx={175}
                cy={130}
                labelLine={false}
                label={({ name, value }: { name: string; value: number }) => `${name}: ${value}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="count"
                nameKey="type"
              >
                {analytics.listingsByType.map((entry: any, index: number) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={pieColors[index % pieColors.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </div>
        </div>
      )}

      {/* Pending Listings Table */}
      <div className="bg-white rounded-lg shadow border border-gray-200 mb-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-charcoal-900">
              Pending Listings for Approval
            </h2>
            <span className="text-sm font-semibold text-teal-600 bg-teal-50 px-3 py-1 rounded-full">
              {pendingListings.length} pending
            </span>
          </div>
        </div>
        <div className="overflow-x-auto">
          {pendingListings.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <Package className="w-10 h-10 text-charcoal-300 mx-auto mb-3" />
              <p className="text-charcoal-500 font-medium">No pending listings at the moment</p>
              <p className="text-charcoal-400 text-sm mt-1">New submissions will appear here for review.</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-charcoal-700">Title</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-charcoal-700">Area</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-charcoal-700">Price</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-charcoal-700">Agent</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-charcoal-700">Images</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-charcoal-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {pendingListings.map((listing) => (
                  <tr key={listing.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-charcoal-900">{listing.title}</td>
                    <td className="px-6 py-4 text-sm text-charcoal-600">{listing.area}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-charcoal-900">
                      Rs. {(listing.price || 0).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-charcoal-600">{listing.agent_name}</td>
                    <td className="px-6 py-4 text-sm text-center">
                      <span className="text-teal-600 font-semibold">
                        {Array.isArray(listing.images) ? listing.images.length : 0}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm flex gap-2">
                      <button
                        onClick={() => handleApprove(listing)}
                        className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition text-xs font-medium"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(listing)}
                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition text-xs font-medium"
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Recent Inquiries Table */}
      <div className="bg-white rounded-lg shadow border border-gray-200 mb-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-charcoal-900">Recent Inquiries</h2>
        </div>
        {recentInquiries.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <MessageSquare className="w-10 h-10 text-charcoal-300 mx-auto mb-3" />
            <p className="text-charcoal-500 font-medium">No inquiries yet</p>
            <p className="text-charcoal-400 text-sm mt-1">Customer inquiries will appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-charcoal-700">Customer</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-charcoal-700">Listing</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-charcoal-700">Source</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-charcoal-700">Priority</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-charcoal-700">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentInquiries.map((inquiry) => (
                  <tr key={inquiry.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-charcoal-900">{inquiry.customer_name}</td>
                    <td className="px-6 py-4 text-sm text-charcoal-600">{inquiry.listing_title}</td>
                    <td className="px-6 py-4 text-sm text-charcoal-600">
                      <span className="inline-flex items-center gap-1">
                        {inquiry.source === 'whatsapp' ? (
                          <MessageSquare className="w-4 h-4 text-green-600" />
                        ) : (
                          <Bell className="w-4 h-4 text-blue-600" />
                        )}
                        {inquiry.source}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          inquiry.priority === 'hot'
                            ? 'bg-red-100 text-red-700'
                            : inquiry.priority === 'warm'
                              ? 'bg-orange-100 text-orange-700'
                              : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {inquiry.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          inquiry.status === 'new'
                            ? 'bg-teal-100 text-teal-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {inquiry.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Activity Feed Panel */}
      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-charcoal-900 flex items-center gap-2">
              <Bell className="w-5 h-5 text-navy-600" />
              Recent Activity
            </h2>
            <Link href="/notifications" className="text-sm text-teal-600 hover:text-teal-700 flex items-center gap-1">
              View All
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
        <div className="divide-y divide-gray-200">
          {feed.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <Bell className="w-10 h-10 text-charcoal-300 mx-auto mb-3" />
              <p className="text-charcoal-500 font-medium">No recent activity</p>
              <p className="text-charcoal-400 text-sm mt-1">New inquiries and submissions will appear here.</p>
            </div>
          ) : (
            feed.slice(0, 8).map((item) => {
              let dotColor = 'bg-blue-500';
              if (item.type === 'inquiry') dotColor = 'bg-teal-500';
              if (item.type === 'listing_submission') dotColor = 'bg-orange-500';
              if (item.type === 'property_alert') dotColor = 'bg-purple-500';
              if (item.type === 'viewing_request') dotColor = 'bg-green-500';

              return (
                <div key={item.id} className="px-6 py-4 hover:bg-gray-50 transition flex items-start gap-4">
                  <div className={`${dotColor} w-3 h-3 rounded-full mt-2 flex-shrink-0`}></div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-charcoal-900">{item.title}</p>
                    <p className="text-sm text-charcoal-600 mt-1">{item.message}</p>
                    <p className="text-xs text-charcoal-500 mt-2">
                      {new Date(item.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  {item.href && (
                    <Link href={item.href} className="text-xs text-navy-600 hover:underline flex-shrink-0 mt-1">
                      View
                    </Link>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
