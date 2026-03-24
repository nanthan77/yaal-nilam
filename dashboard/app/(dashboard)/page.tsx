"use client";

import { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  FunnelChart,
  Funnel,
} from "recharts";
import {
  Building2,
  Clock,
  MessageSquare,
  MessageCircle,
  Home,
  Target,
  TrendingUp,
  Percent,
  Plus,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Eye,
  AlertTriangle,
  Activity,
  Bell,
  BarChart3,
  Calendar,
  DollarSign,
  Users,
  Zap,
  CheckCheck,
} from "lucide-react";
import {
  DASHBOARD_STATS,
  MOCK_LISTINGS,
  MOCK_INQUIRIES,
  MOCK_REQUIREMENTS,
  MOCK_NOTIFICATIONS,
  MOCK_AUDIT_LOGS,
  INQUIRIES_WEEKLY,
  DEMAND_VS_SUPPLY,
  LISTINGS_BY_TYPE,
  TOP_AREAS,
  REVENUE_TREND,
  INQUIRY_FUNNEL,
  LEASE_EXPIRY_FORECAST,
  COLLECTION_STATUS,
} from "@/lib/mock-data";

// Color palette
const COLORS = {
  navy: "#1a365d",
  teal: "#0d9488",
  emerald: "#10b981",
  amber: "#f59e0b",
  red: "#dc2626",
  orange: "#f97316",
  blue: "#3b82f6",
  purple: "#8b5cf6",
  slate: "#64748b",
  lightGray: "#f3f4f6",
  darkGray: "#374151",
};

// KPI Card Component with Enhanced Features
interface KPICardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  delta?: number;
  deltaType?: "positive" | "neutral" | "negative";
  tooltip?: string;
  breakdown?: string;
  badge?: { text: string; color: string };
}

function KPICard({
  icon,
  label,
  value,
  delta,
  deltaType = "neutral",
  tooltip,
  breakdown,
  badge,
}: KPICardProps) {
  return (
    <div className="relative group">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200 h-full">
        <div className="flex items-start justify-between mb-4">
          <div className="p-3 rounded-lg bg-slate-100">{icon}</div>
          {badge && (
            <span
              className="px-2.5 py-1 text-xs font-bold text-white rounded-full"
              style={{ backgroundColor: badge.color }}
            >
              {badge.text}
            </span>
          )}
        </div>

        <p className="text-gray-600 text-sm font-medium mb-2">{label}</p>

        <div className="flex items-baseline gap-2 mb-3">
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {delta !== undefined && (
            <span
              className={`text-sm font-semibold flex items-center gap-0.5 ${
                deltaType === "positive"
                  ? "text-emerald-600"
                  : deltaType === "negative"
                    ? "text-red-600"
                    : "text-slate-600"
              }`}
            >
              {deltaType === "positive" ? "↑" : deltaType === "negative" ? "↓" : "→"}{" "}
              {Math.abs(delta)}%
            </span>
          )}
        </div>

        {breakdown && (
          <p className="text-xs text-gray-600 leading-relaxed">{breakdown}</p>
        )}
      </div>

      {tooltip && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-900 text-white text-xs rounded-lg p-2 whitespace-nowrap z-10">
          {tooltip}
        </div>
      )}
    </div>
  );
}

// Status Badge Component
function StatusBadge({ status }: { status: string }) {
  const config: Record<
    string,
    { bg: string; text: string; label: string }
  > = {
    hot: { bg: "bg-red-100", text: "text-red-700", label: "Hot" },
    warm: { bg: "bg-amber-100", text: "text-amber-700", label: "Warm" },
    cold: { bg: "bg-blue-100", text: "text-blue-700", label: "Cold" },
    new: { bg: "bg-emerald-100", text: "text-emerald-700", label: "New" },
    contacted: {
      bg: "bg-purple-100",
      text: "text-purple-700",
      label: "Contacted",
    },
    interested: {
      bg: "bg-blue-100",
      text: "text-blue-700",
      label: "Interested",
    },
    negotiating: {
      bg: "bg-yellow-100",
      text: "text-yellow-700",
      label: "Negotiating",
    },
    site_visit: {
      bg: "bg-indigo-100",
      text: "text-indigo-700",
      label: "Site Visit",
    },
    no_answer: {
      bg: "bg-gray-100",
      text: "text-gray-700",
      label: "No Answer",
    },
    closed_won: {
      bg: "bg-emerald-100",
      text: "text-emerald-700",
      label: "Closed Won",
    },
    closed_lost: {
      bg: "bg-red-100",
      text: "text-red-700",
      label: "Closed Lost",
    },
    spam: { bg: "bg-red-100", text: "text-red-700", label: "Spam" },
    scheduled: {
      bg: "bg-indigo-100",
      text: "text-indigo-700",
      label: "Scheduled",
    },
    waiting: { bg: "bg-gray-100", text: "text-gray-700", label: "Waiting" },
    approved: {
      bg: "bg-emerald-100",
      text: "text-emerald-700",
      label: "Approved",
    },
    rejected: { bg: "bg-red-100", text: "text-red-700", label: "Rejected" },
  };
  const cfg = config[status] || { bg: "bg-gray-100", text: "text-gray-700", label: status };
  return (
    <span
      className={`px-2.5 py-1 text-xs font-semibold rounded-full ${cfg.bg} ${cfg.text}`}
    >
      {cfg.label}
    </span>
  );
}

// Source Badge Component
function SourceBadge({ source }: { source: string }) {
  const config: Record<string, { label: string; color: string }> = {
    website_form: { label: "Website", color: "#3b82f6" },
    whatsapp: { label: "WhatsApp", color: "#25d366" },
    facebook: { label: "Facebook", color: "#1877f2" },
    google: { label: "Google", color: "#ea4335" },
    phone: { label: "Phone", color: "#8b5cf6" },
    referral: { label: "Referral", color: "#10b981" },
    walk_in: { label: "Walk In", color: "#f59e0b" },
  };
  const cfg = config[source] || { label: source, color: "#6b7280" };
  return (
    <span
      className="px-2.5 py-1 text-xs font-semibold rounded-full text-white"
      style={{ backgroundColor: cfg.color }}
    >
      {cfg.label}
    </span>
  );
}

// Utility Functions
function formatCurrency(value: number): string {
  if (value >= 100000) {
    return `Rs. ${(value / 100000).toFixed(1)}L`;
  }
  return `Rs. ${value.toLocaleString()}`;
}

function timeAgo(date: Date | string): string {
  const now = new Date();
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const seconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);
  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function formatDate(): string {
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return new Date().toLocaleDateString("en-US", options);
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

export default function DashboardHome() {
  // Memoized data selectors
  const pendingListings = useMemo(
    () => MOCK_LISTINGS.filter((l) => l.status === "pending").slice(0, 5),
    []
  );

  const recentInquiries = useMemo(() => MOCK_INQUIRIES.slice(0, 5), []);

  const unreadNotifications = useMemo(
    () => MOCK_NOTIFICATIONS.filter((n) => !n.read).slice(0, 5),
    []
  );

  // Calculate urgent tasks
  const urgentTasks = {
    maintenance: MOCK_LISTINGS.filter((l) =>
      l.missing.includes("maintenance")
    ).length,
    delinquencies: MOCK_INQUIRIES.filter((i) => i.priority === "hot").length,
    expiringLeases: 12,
    missingImages: MOCK_LISTINGS.filter((l) =>
      l.missing.includes("images")
    ).length,
    unansweredInquiries: MOCK_INQUIRIES.filter(
      (i) => i.status === "new"
    ).length,
  };

  // Portfolio summary calculations
  const portfolioSummary = {
    totalUnits: MOCK_LISTINGS.length,
    rented: MOCK_LISTINGS.filter((l) => l.status === "active").length,
    available: MOCK_LISTINGS.filter((l) => l.status === "pending").length,
    vacant: MOCK_LISTINGS.filter((l) => l.status === "inactive").length,
    maintenance: urgentTasks.maintenance,
  };

  const occupancyRate = Math.round(
    (portfolioSummary.rented / portfolioSummary.totalUnits) * 100
  );

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: COLORS.lightGray }}
    >
      {/* Welcome Header - F-Pattern Top Left */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-1">
                {getGreeting()}, Nanthan
              </h1>
              <p className="text-gray-600 text-sm">{formatDate()}</p>
            </div>
            <div className="flex gap-3">
              <button
                className="px-4 py-2.5 rounded-lg font-medium text-white flex items-center gap-2 transition-colors hover:opacity-90"
                style={{ backgroundColor: COLORS.navy }}
              >
                <Plus size={18} /> Add Listing
              </button>
              <button
                className="px-4 py-2.5 rounded-lg font-medium text-white flex items-center gap-2 transition-colors hover:opacity-90"
                style={{ backgroundColor: COLORS.teal }}
              >
                <Eye size={18} /> Review Pending
              </button>
              <button
                className="px-4 py-2.5 rounded-lg font-medium text-white flex items-center gap-2 transition-colors hover:opacity-90"
                style={{ backgroundColor: COLORS.navy }}
              >
                <Home size={18} /> Add Requirement
              </button>
              <button
                className="px-4 py-2.5 rounded-lg font-medium text-white flex items-center gap-2 transition-colors hover:opacity-90"
                style={{ backgroundColor: COLORS.teal }}
              >
                <AlertCircle size={18} /> Send Alert
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Portfolio Summary Section - 8 KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <KPICard
            icon={<Building2 size={22} style={{ color: COLORS.navy }} />}
            label="Total Units"
            value={portfolioSummary.totalUnits}
            tooltip={`${portfolioSummary.rented} rented, ${portfolioSummary.available} available, ${portfolioSummary.vacant} vacant`}
            breakdown={`${portfolioSummary.rented} rented • ${portfolioSummary.available} available`}
          />
          <KPICard
            icon={<Percent size={22} style={{ color: COLORS.teal }} />}
            label="Occupancy Rate"
            value={`${occupancyRate}%`}
            delta={5}
            deltaType="positive"
            tooltip="Percentage of rented units"
          />
          <KPICard
            icon={<DollarSign size={22} style={{ color: COLORS.emerald }} />}
            label="NOI"
            value={formatCurrency(DASHBOARD_STATS.revenueThisMonth.value * 0.65)}
            delta={8}
            deltaType="positive"
            tooltip="Net Operating Income"
          />
          <KPICard
            icon={<TrendingUp size={22} style={{ color: COLORS.navy }} />}
            label="Revenue Growth"
            value={`${DASHBOARD_STATS.revenueThisMonth.change}%`}
            delta={DASHBOARD_STATS.revenueThisMonth.change}
            deltaType="positive"
            tooltip="Month-over-month growth"
          />

          <KPICard
            icon={<Building2 size={22} style={{ color: COLORS.teal }} />}
            label="Active Listings"
            value={DASHBOARD_STATS.activeListings.value}
            delta={DASHBOARD_STATS.activeListings.change}
            deltaType="positive"
            tooltip="Currently published listings"
          />
          <KPICard
            icon={<AlertCircle size={22} style={{ color: COLORS.amber }} />}
            label="Pending Approval"
            value={DASHBOARD_STATS.pendingApproval.value}
            badge={{ text: "⚠ Review", color: COLORS.amber }}
            tooltip="Listings awaiting approval"
          />
          <KPICard
            icon={<MessageSquare size={22} style={{ color: COLORS.navy }} />}
            label="Today's Inquiries"
            value={DASHBOARD_STATS.todayInquiries.value}
            delta={DASHBOARD_STATS.todayInquiries.change}
            deltaType="positive"
            tooltip="Inquiries received today"
          />
          <KPICard
            icon={<Percent size={22} style={{ color: COLORS.teal }} />}
            label="Conversion Rate"
            value={`${DASHBOARD_STATS.conversionRate.value}%`}
            delta={DASHBOARD_STATS.conversionRate.change}
            deltaType="positive"
            tooltip="Inquiry to booking conversion"
          />
        </div>

        {/* Charts Row - Revenue Trend & Inquiry Funnel & Demand vs Supply */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Revenue Trend Chart */}
          <div className="lg:col-span-1 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Revenue Trend
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={REVENUE_TREND || INQUIRIES_WEEKLY}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="day" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke={COLORS.teal}
                  strokeWidth={2}
                  dot={{ fill: COLORS.teal, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Inquiry Pipeline Funnel */}
          <div className="lg:col-span-1 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Inquiry Pipeline
            </h3>
            <div className="space-y-3">
              {[
                { stage: "Inquiries", value: 145, color: COLORS.navy },
                { stage: "Viewings", value: 98, color: COLORS.teal },
                { stage: "Offers", value: 65, color: COLORS.blue },
                { stage: "Negotiation", value: 42, color: COLORS.emerald },
                { stage: "Closed", value: 28, color: COLORS.purple },
              ].map((item, idx) => {
                const width = (item.value / 145) * 100;
                return (
                  <div key={idx}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-900">
                        {item.stage}
                      </span>
                      <span className="text-xs font-bold text-gray-600">
                        {item.value}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all"
                        style={{
                          width: `${width}%`,
                          backgroundColor: item.color,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Demand vs Supply */}
          <div className="lg:col-span-1 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Demand vs Supply
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={DEMAND_VS_SUPPLY.slice(0, 3)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="area" stroke="#6b7280" fontSize={11} />
                <YAxis stroke="#6b7280" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Bar dataKey="demand" fill={COLORS.teal} radius={[8, 8, 0, 0]} />
                <Bar dataKey="supply" fill={COLORS.navy} radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Action Panels - Left (Listings & Inquiries) + Right (Urgent Tasks) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Left Column - 2 Tables (2/3 width) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Listings Pending Review */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-6">
                Listings Pending Review
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">
                        Title
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">
                        Area
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">
                        Price
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">
                        Agent
                      </th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-900">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingListings.map((listing) => (
                      <tr
                        key={listing.id}
                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                      >
                        <td className="py-4 px-4 text-gray-900 font-medium">
                          {listing.title}
                        </td>
                        <td className="py-4 px-4 text-gray-600">{listing.area}</td>
                        <td className="py-4 px-4 text-gray-900 font-medium">
                          {formatCurrency(listing.price)}
                        </td>
                        <td className="py-4 px-4 text-gray-600">{listing.agent}</td>
                        <td className="py-4 px-4">
                          <div className="flex justify-center gap-2">
                            <button
                              className="p-1.5 rounded hover:bg-emerald-100 text-emerald-600 transition-colors"
                              title="Approve"
                            >
                              <CheckCircle2 size={18} />
                            </button>
                            <button
                              className="p-1.5 rounded hover:bg-red-100 text-red-600 transition-colors"
                              title="Reject"
                            >
                              <XCircle size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recent Inquiries */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-6">
                Recent Inquiries
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">
                        Name
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">
                        Listing
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">
                        Source
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">
                        Priority
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentInquiries.map((inquiry) => (
                      <tr
                        key={inquiry.id}
                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                      >
                        <td className="py-4 px-4 text-gray-900 font-medium">
                          {inquiry.customer_name}
                        </td>
                        <td className="py-4 px-4 text-gray-600 text-xs">
                          {inquiry.listing_title}
                        </td>
                        <td className="py-4 px-4">
                          <SourceBadge source={inquiry.source} />
                        </td>
                        <td className="py-4 px-4">
                          <StatusBadge status={inquiry.priority} />
                        </td>
                        <td className="py-4 px-4">
                          <StatusBadge status={inquiry.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column - 3 Cards (1/3 width) */}
          <div className="space-y-6">
            {/* Urgent Tasks Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
                <Zap size={20} style={{ color: COLORS.red }} />
                Urgent Tasks
              </h3>
              <div className="space-y-3">
                {[
                  {
                    label: "Maintenance Emergencies",
                    count: urgentTasks.maintenance,
                  },
                  {
                    label: "Delinquencies",
                    count: urgentTasks.delinquencies,
                  },
                  {
                    label: "Expiring Leases",
                    count: urgentTasks.expiringLeases,
                  },
                  {
                    label: "Missing Images",
                    count: urgentTasks.missingImages,
                  },
                  {
                    label: "Unanswered Inquiries",
                    count: urgentTasks.unansweredInquiries,
                  },
                ].map((task, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between py-2.5 px-3 hover:bg-gray-50 rounded cursor-pointer transition-colors"
                  >
                    <span className="text-sm text-gray-700">{task.label}</span>
                    <span
                      className="px-2.5 py-1 text-xs font-bold text-white rounded-full"
                      style={{
                        backgroundColor: task.count > 0 ? COLORS.red : COLORS.slate,
                      }}
                    >
                      {task.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Lease Expiry Forecast */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
                <Calendar size={20} style={{ color: COLORS.navy }} />
                Lease Expiry Forecast
              </h3>
              <div className="space-y-4">
                {[
                  {
                    period: "30 Days",
                    count: 8,
                    color: COLORS.emerald,
                  },
                  {
                    period: "60 Days",
                    count: 12,
                    color: COLORS.amber,
                  },
                  {
                    period: "90 Days",
                    count: 15,
                    color: COLORS.orange,
                  },
                ].map((item, idx) => (
                  <div key={idx}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-900">
                        {item.period}
                      </span>
                      <span className="text-sm font-bold text-gray-700">
                        {item.count} leases
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="h-2.5 rounded-full"
                        style={{
                          width: `${(item.count / 20) * 100}%`,
                          backgroundColor: item.color,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Collection Status */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
                <CheckCheck size={20} style={{ color: COLORS.teal }} />
                Collection Status
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900">
                      Collection Rate
                    </span>
                    <span className="text-lg font-bold text-emerald-600">
                      94.2%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="h-3 rounded-full"
                      style={{
                        width: "94.2%",
                        backgroundColor: COLORS.emerald,
                      }}
                    />
                  </div>
                </div>
                <div className="pt-2 space-y-2 text-xs">
                  <div className="flex justify-between text-gray-600">
                    <span>Collected</span>
                    <span className="font-bold text-gray-900">
                      Rs. {formatCurrency(DASHBOARD_STATS.revenueThisMonth.value * 0.942).split("Rs. ")[1]}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Pending</span>
                    <span className="font-bold text-amber-600">
                      Rs. {formatCurrency(DASHBOARD_STATS.revenueThisMonth.value * 0.058).split("Rs. ")[1]}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Row - Charts & Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Listings by Type */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-6">
              Listings by Type
            </h3>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={LISTINGS_BY_TYPE}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(props: any) => {
                    const { name, value } = props;
                    const total = LISTINGS_BY_TYPE.reduce((sum, item) => sum + item.count, 0);
                    const percentage = ((value || 0) / total) * 100;
                    return `${name || ''} (${percentage.toFixed(0)}%)`;
                  }}
                  outerRadius={90}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {LISTINGS_BY_TYPE.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        [
                          COLORS.navy,
                          COLORS.teal,
                          COLORS.orange,
                          COLORS.blue,
                          COLORS.purple,
                        ][index % 5]
                      }
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Top Areas */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Top Areas</h3>
            <div className="space-y-4">
              {TOP_AREAS.map((area, idx) => (
                <div key={idx}>
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {idx + 1}. {area.area}
                      </p>
                      <p className="text-xs text-gray-600">
                        {area.count} listings
                      </p>
                    </div>
                    <span className="text-sm font-bold text-gray-700">
                      {area.percentage.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full"
                      style={{
                        width: `${area.percentage}%`,
                        backgroundColor: [
                          COLORS.navy,
                          COLORS.teal,
                          COLORS.orange,
                          COLORS.blue,
                          COLORS.purple,
                          COLORS.emerald,
                        ][idx % 6],
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity Feed */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Activity size={20} style={{ color: COLORS.teal }} />
              Recent Activity
            </h3>
            <div className="space-y-4">
              {MOCK_AUDIT_LOGS.slice(0, 6).map((log) => (
                <div key={log.id} className="flex gap-3 pb-3 border-b border-gray-100 last:border-b-0">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold text-white"
                    style={{ backgroundColor: COLORS.teal }}
                  >
                    {getInitials(log.user)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-900">
                      <span className="font-semibold">{log.user}</span>{" "}
                      <span className="text-gray-600">{log.action}</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {timeAgo(log.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
