'use client';

import { useState } from 'react';
import {
  Download,
  TrendingUp,
  TrendingDown,
  Eye,
  Users,
  Clock,
  Target,
  Zap,
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
} from 'recharts';
import {
  REVENUE_TREND,
  PROPERTY_VALUE_TREND,
  DEMAND_VS_SUPPLY,
  INQUIRY_FUNNEL,
  MONTHLY_COLLECTIONS,
  COLLECTION_STATUS,
  AGENT_PERFORMANCE,
  TOP_AREAS,
  LISTINGS_BY_TYPE,
  DASHBOARD_STATS,
  INQUIRIES_WEEKLY,
} from '@/lib/mock-data';

type DateRange = 'week' | 'month' | 'quarter' | 'year' | 'custom';

interface KPICard {
  label: string;
  value: string | number;
  unit?: string;
  icon: React.ReactNode;
  delta: number;
  deltaType: 'positive' | 'negative' | 'neutral';
  color: string;
}

const COLORS = {
  navy: '#1a365d',
  teal: '#0d9488',
  emerald: '#10b981',
  amber: '#f59e0b',
  red: '#ef4444',
  blue: '#3b82f6',
  purple: '#8b5cf6',
  slate: '#64748b',
};

const CHART_COLORS = ['#0d9488', '#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6', '#ec4899'];

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState<DateRange>('month');

  // KPI Cards
  const kpis: KPICard[] = [
    {
      label: 'Active Listings',
      value: DASHBOARD_STATS?.activeListings?.value || '623',
      icon: <Eye className="w-8 h-8" />,
      delta: DASHBOARD_STATS?.activeListings?.change || 5.2,
      deltaType: 'positive',
      color: 'teal',
    },
    {
      label: 'Today Inquiries',
      value: DASHBOARD_STATS?.todayInquiries?.value || '18',
      icon: <Users className="w-8 h-8" />,
      delta: DASHBOARD_STATS?.todayInquiries?.change || 12,
      deltaType: 'positive',
      color: 'blue',
    },
    {
      label: 'Active Requirements',
      value: DASHBOARD_STATS?.activeRequirements?.value || '189',
      icon: <Clock className="w-8 h-8" />,
      delta: DASHBOARD_STATS?.activeRequirements?.change || 3.1,
      deltaType: 'positive',
      color: 'amber',
    },
    {
      label: 'Occupancy Rate',
      value: `${DASHBOARD_STATS?.occupancyRate?.value || 89.2}%`,
      icon: <TrendingDown className="w-8 h-8" />,
      delta: DASHBOARD_STATS?.occupancyRate?.change || 1.5,
      deltaType: 'positive',
      color: 'red',
    },
    {
      label: 'Lead Conversion Rate',
      value: `${DASHBOARD_STATS?.conversionRate?.value || 8.3}%`,
      icon: <Target className="w-8 h-8" />,
      delta: 3,
      deltaType: 'positive',
      color: 'emerald',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-slate-900">Analytics & Insights</h1>
          <p className="text-slate-600 mt-2">Comprehensive PropTech performance metrics and market insights</p>
        </div>

        <div className="flex gap-3">
          {/* Date Range Tabs */}
          <div className="flex gap-2 bg-slate-100 p-1 rounded-lg">
            {(['week', 'month', 'quarter', 'year', 'custom'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className={`px-4 py-2 rounded-md font-medium text-sm transition ${
                  dateRange === range
                    ? 'bg-white text-teal-600 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {range === 'week'
                  ? 'This Week'
                  : range === 'month'
                    ? 'This Month'
                    : range === 'quarter'
                      ? 'This Quarter'
                      : range === 'year'
                        ? 'This Year'
                        : 'Custom'}
              </button>
            ))}
          </div>

          {/* Export Button */}
          <button className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition font-medium">
            <Download size={18} />
            Export
          </button>
        </div>
      </div>

      {/* KPI Summary Row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {kpis.map((kpi, index) => (
          <div
            key={index}
            className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">{kpi.label}</p>
                <p className="text-2xl font-bold text-slate-900 mt-2">{kpi.value}</p>
              </div>
              <div
                className={`p-3 rounded-lg ${
                  kpi.color === 'teal'
                    ? 'bg-teal-100 text-teal-600'
                    : kpi.color === 'blue'
                      ? 'bg-blue-100 text-blue-600'
                      : kpi.color === 'amber'
                        ? 'bg-amber-100 text-amber-600'
                        : kpi.color === 'red'
                          ? 'bg-red-100 text-red-600'
                          : 'bg-emerald-100 text-emerald-600'
                }`}
              >
                {kpi.icon}
              </div>
            </div>
            <p
              className={`text-sm font-semibold mt-3 flex items-center gap-1 ${
                kpi.deltaType === 'positive' ? 'text-emerald-600' : 'text-red-600'
              }`}
            >
              {kpi.deltaType === 'positive' ? (
                kpi.delta < 0 ? (
                  <TrendingDown size={14} />
                ) : (
                  <TrendingUp size={14} />
                )
              ) : (
                <TrendingDown size={14} />
              )}
              {Math.abs(kpi.delta)}% from last period
            </p>
          </div>
        ))}
      </div>

      {/* Revenue Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-2">Revenue & Expenses Trend</h2>
          <p className="text-slate-600 text-sm mb-4">12-month overview</p>

          {/* Stats above chart */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-emerald-50 rounded-lg p-4">
              <p className="text-slate-600 text-sm">Total Revenue</p>
              <p className="text-2xl font-bold text-emerald-600 mt-1">
                {REVENUE_TREND
                  ? `Rs. ${REVENUE_TREND.reduce((sum, item: any) => sum + (item.revenue || 0), 0).toLocaleString()}`
                  : 'N/A'}
              </p>
            </div>
            <div className="bg-red-50 rounded-lg p-4">
              <p className="text-slate-600 text-sm">Total Expenses</p>
              <p className="text-2xl font-bold text-red-600 mt-1">
                {REVENUE_TREND
                  ? `Rs. ${REVENUE_TREND.reduce((sum, item: any) => sum + (item.expenses || 0), 0).toLocaleString()}`
                  : 'N/A'}
              </p>
            </div>
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-slate-600 text-sm">Net Operating Income</p>
              <p className="text-2xl font-bold text-blue-600 mt-1">
                {REVENUE_TREND
                  ? `Rs. ${(
                      REVENUE_TREND.reduce((sum: number, item: any) => sum + (item.revenue || 0), 0) -
                      REVENUE_TREND.reduce((sum: number, item: any) => sum + (item.expenses || 0), 0)
                    ).toLocaleString()}`
                  : 'N/A'}
              </p>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={REVENUE_TREND || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="revenue"
                fill="#d1fae5"
                stroke="#10b981"
                name="Revenue"
              />
              <Bar dataKey="expenses" fill="#fee2e2" name="Expenses" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Collections Status */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Collection Status</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={COLLECTION_STATUS || []}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {(COLLECTION_STATUS || []).map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Property Market Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Property Value Index */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Property Value Index by Area</h2>
          <p className="text-slate-600 text-sm mb-4">Quarterly trends</p>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={PROPERTY_VALUE_TREND || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="quarter" />
              <YAxis />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="jaffnaCity"
                stroke="#0d9488"
                name="Jaffna City"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="mullaitivu"
                stroke="#f59e0b"
                name="Mullaitivu"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="vavuniya"
                stroke="#3b82f6"
                name="Vavuniya"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Demand vs Supply */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Demand vs Supply</h2>
          <p className="text-slate-600 text-sm mb-4">Property type distribution</p>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={DEMAND_VS_SUPPLY || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="demand" fill="#0d9488" name="Demand" />
              <Bar dataKey="supply" fill="#f59e0b" name="Supply" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Lead Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Inquiry Funnel */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Inquiry Funnel</h2>
          <div className="space-y-3">
            {(INQUIRY_FUNNEL || []).map((stage: any, index: number) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-600">{stage.stage}</span>
                  <span className="text-sm font-bold text-slate-900">{stage.count}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div
                    className="bg-teal-600 h-2 rounded-full transition-all"
                    style={{
                      width: `${((stage.count || 0) / ((INQUIRY_FUNNEL?.[0]?.count || 100))) * 100}%`,
                    }}
                  />
                </div>
                <p className="text-xs text-slate-500 mt-1">{stage.conversion}% conversion</p>
              </div>
            ))}
          </div>
        </div>

        {/* Lead Source Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Lead Source Distribution</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={INQUIRIES_WEEKLY || []}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={70}
                fill="#8884d8"
                dataKey="value"
              >
                {(INQUIRIES_WEEKLY || []).map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Lead Volume */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Monthly Lead Volume</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={MONTHLY_COLLECTIONS?.slice(0, 6) || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="target" fill="#0d9488" name="Target" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Collection Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Collections */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Monthly Collections</h2>
          <p className="text-slate-600 text-sm mb-4">Target vs Actual</p>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={MONTHLY_COLLECTIONS || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="target" fill="#cbd5e1" name="Target" />
              <Bar dataKey="actual" fill="#0d9488" name="Actual" />
              <Line type="monotone" dataKey="percentage" stroke="#ef4444" name="Achievement %" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Outstanding Balance Trend */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Outstanding Balance Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={MONTHLY_COLLECTIONS || []}>
              <defs>
                <linearGradient id="colorOutstanding" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="outstanding"
                stroke="#ef4444"
                fillOpacity={1}
                fill="url(#colorOutstanding)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Agent Performance Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100">
          <h2 className="text-lg font-bold text-slate-900">Agent Performance</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Agent</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">
                  Closed Deals
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">
                  Revenue
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">
                  Avg Response Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Rating</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">
                  Performance
                </th>
              </tr>
            </thead>
            <tbody>
              {(AGENT_PERFORMANCE || []).map((agent: any, index: number) => (
                <tr key={index} className="border-b border-slate-100 hover:bg-slate-50 transition">
                  <td className="px-6 py-4 font-semibold text-slate-900">{agent.name}</td>
                  <td className="px-6 py-4 text-slate-600">{agent.closedDeals}</td>
                  <td className="px-6 py-4 text-slate-600">Rs. {agent.revenue?.toLocaleString()}</td>
                  <td className="px-6 py-4 text-slate-600">{agent.avgResponseTime}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={`text-lg ${
                            i < Math.floor(agent.rating || 0) ? 'text-amber-400' : 'text-slate-300'
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="w-32 bg-slate-100 rounded-full h-2">
                      <div
                        className="bg-teal-600 h-2 rounded-full transition-all"
                        style={{ width: `${(agent.rating || 0) * 20}%` }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Area Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Areas by Listings */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Top Areas by Listings</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={TOP_AREAS || []}
              layout="vertical"
              margin={{ left: 120, right: 30 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" />
              <YAxis dataKey="area" type="category" width={110} />
              <Tooltip />
              <Bar dataKey="listings" fill="#0d9488" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top Areas by Views */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Top Areas - Heat Map</h2>
          <div className="grid grid-cols-2 gap-4">
            {(TOP_AREAS || [])
              .sort((a: any, b: any) => (b.views || 0) - (a.views || 0))
              .slice(0, 6)
              .map((area: any, index: number) => {
                const maxViews = Math.max(...((TOP_AREAS || []).map((a: any) => a.views || 0) as number[]));
                const intensity = ((area.views || 0) / maxViews) * 100;
                return (
                  <div
                    key={index}
                    className="p-4 rounded-lg transition"
                    style={{
                      backgroundColor: `rgba(13, 148, 136, ${intensity / 100})`,
                      color: intensity > 50 ? 'white' : '#1f2937',
                    }}
                  >
                    <p className="font-semibold">{area.area}</p>
                    <p className="text-sm opacity-90">{area.views} views</p>
                  </div>
                );
              })}
          </div>
        </div>
      </div>

      {/* Listings Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Listings by Type */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Listings by Type</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={LISTINGS_BY_TYPE || []}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={70}
                fill="#8884d8"
                dataKey="value"
              >
                {(LISTINGS_BY_TYPE || []).map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Listings by Status */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Listings by Status</h2>
          <div className="space-y-4">
            {[
              { label: 'Active', value: 156, color: 'emerald' },
              { label: 'Pending', value: 42, color: 'amber' },
              { label: 'Sold', value: 89, color: 'blue' },
              { label: 'Archived', value: 28, color: 'slate' },
            ].map((status, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-600">{status.label}</span>
                  <span className="text-sm font-bold text-slate-900">{status.value}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      status.color === 'emerald'
                        ? 'bg-emerald-500'
                        : status.color === 'amber'
                          ? 'bg-amber-500'
                          : status.color === 'blue'
                            ? 'bg-blue-500'
                            : 'bg-slate-500'
                    }`}
                    style={{ width: `${(status.value / 315) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Days on Market */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Average Days on Market</h2>
          <div className="space-y-4">
            {[
              { type: 'Apartment', days: 12, trend: 'down' },
              { type: 'House', days: 18, trend: 'up' },
              { type: 'Land', days: 24, trend: 'down' },
              { type: 'Commercial', days: 31, trend: 'neutral' },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div>
                  <p className="font-medium text-slate-900">{item.type}</p>
                  <p className="text-sm text-slate-600">{item.days} days avg</p>
                </div>
                <div className="flex items-center gap-1">
                  {item.trend === 'down' ? (
                    <TrendingDown className="text-emerald-600" size={18} />
                  ) : item.trend === 'up' ? (
                    <TrendingUp className="text-red-600" size={18} />
                  ) : (
                    <Zap className="text-slate-600" size={18} />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
