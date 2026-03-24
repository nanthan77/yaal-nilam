// @ts-nocheck
'use client'

import { useState } from 'react'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts'
import {
  INQUIRIES_WEEKLY,
  DEMAND_VS_SUPPLY,
  LISTINGS_BY_TYPE,
  TOP_AREAS,
} from '@/lib/mock-data'

const COLORS = ['#1e3a5f', '#0f766e', '#d4a574', '#1f2937']

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState<'week' | 'month' | 'quarter'>('month')

  const trafficData = [
    { date: 'Mon', views: 2400, inquiries: 1398 },
    { date: 'Tue', views: 1398, inquiries: 9800 },
    { date: 'Wed', views: 9800, inquiries: 3908 },
    { date: 'Thu', views: 3908, inquiries: 4800 },
    { date: 'Fri', views: 4800, inquiries: 3800 },
    { date: 'Sat', views: 3800, inquiries: 4300 },
    { date: 'Sun', views: 4300, inquiries: 2100 },
  ]

  const inquiriesBySource = [
    { source: 'Direct', count: 340 },
    { source: 'Search', count: 280 },
    { source: 'Social', count: 190 },
    { source: 'Referral', count: 120 },
  ]

  return (
    <div className="space-y-8">
      {/* Header with Date Range Selector */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-charcoal-900">Analytics Dashboard</h1>
          <p className="text-charcoal-600 mt-1">Property market insights and performance metrics</p>
        </div>
        <div className="flex gap-2">
          {(['week', 'month', 'quarter'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setDateRange(range)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                dateRange === range
                  ? 'bg-navy-600 text-white'
                  : 'bg-sand-100 text-charcoal-700 hover:bg-sand-200'
              }`}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white border border-sand-200 rounded-lg p-6">
          <p className="text-charcoal-600 text-sm font-medium">Total Listings</p>
          <p className="text-3xl font-bold text-navy-700 mt-2">1,248</p>
          <p className="text-teal-600 text-sm mt-2">+12% from last month</p>
        </div>
        <div className="bg-white border border-sand-200 rounded-lg p-6">
          <p className="text-charcoal-600 text-sm font-medium">Active Inquiries</p>
          <p className="text-3xl font-bold text-teal-700 mt-2">584</p>
          <p className="text-teal-600 text-sm mt-2">+8% from last month</p>
        </div>
        <div className="bg-white border border-sand-200 rounded-lg p-6">
          <p className="text-charcoal-600 text-sm font-medium">Page Views</p>
          <p className="text-3xl font-bold text-sand-700 mt-2">28,294</p>
          <p className="text-teal-600 text-sm mt-2">+24% from last month</p>
        </div>
        <div className="bg-white border border-sand-200 rounded-lg p-6">
          <p className="text-charcoal-600 text-sm font-medium">Avg Response Time</p>
          <p className="text-3xl font-bold text-charcoal-700 mt-2">2.4h</p>
          <p className="text-teal-600 text-sm mt-2">-15% from last month</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Traffic Overview */}
        <div className="bg-white border border-sand-200 rounded-lg p-6">
          <h2 className="text-lg font-bold text-charcoal-900 mb-4">Traffic Overview</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trafficData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#d4a574" />
              <XAxis dataKey="date" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#f5f5f5',
                  border: '1px solid #d4a574',
                  borderRadius: '8px',
                }}
              />
              <Line
                type="monotone"
                dataKey="views"
                stroke="#1e3a5f"
                strokeWidth={2}
                dot={{ fill: '#1e3a5f', r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="inquiries"
                stroke="#0f766e"
                strokeWidth={2}
                dot={{ fill: '#0f766e', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Inquiries by Source */}
        <div className="bg-white border border-sand-200 rounded-lg p-6">
          <h2 className="text-lg font-bold text-charcoal-900 mb-4">Inquiries by Source</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={inquiriesBySource}>
              <CartesianGrid strokeDasharray="3 3" stroke="#d4a574" />
              <XAxis dataKey="source" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#f5f5f5',
                  border: '1px solid #d4a574',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="count" fill="#1e3a5f" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Listings by Type */}
        <div className="bg-white border border-sand-200 rounded-lg p-6">
          <h2 className="text-lg font-bold text-charcoal-900 mb-4">Listings by Type</h2>
          <PieChart width={350} height={300}>
            <Pie
              data={LISTINGS_BY_TYPE}
              dataKey="count"
              nameKey="type"
              cx={175}
              cy={120}
              outerRadius={100}
              fill="#8884d8"
              label={({ name, value }: { name: string; value: number }) => `${name}: ${value}`}
            >
              {LISTINGS_BY_TYPE.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>

        {/* Demand vs Supply by Area */}
        <div className="bg-white border border-sand-200 rounded-lg p-6">
          <h2 className="text-lg font-bold text-charcoal-900 mb-4">Demand vs Supply by Area</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={DEMAND_VS_SUPPLY}>
              <CartesianGrid strokeDasharray="3 3" stroke="#d4a574" />
              <XAxis dataKey="area" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#f5f5f5',
                  border: '1px solid #d4a574',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="demand" fill="#0f766e" />
              <Bar dataKey="supply" fill="#d4a574" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Areas Table */}
      <div className="bg-white border border-sand-200 rounded-lg p-6">
        <h2 className="text-lg font-bold text-charcoal-900 mb-4">Top Performing Areas</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-sand-200">
                <th className="text-left py-3 px-4 font-semibold text-charcoal-700">Area</th>
                <th className="text-right py-3 px-4 font-semibold text-charcoal-700">Listings</th>
                <th className="text-right py-3 px-4 font-semibold text-charcoal-700">Inquiries</th>
                <th className="text-right py-3 px-4 font-semibold text-charcoal-700">Share %</th>
              </tr>
            </thead>
            <tbody>
              {TOP_AREAS.map((area) => (
                <tr key={area.area} className="border-b border-sand-100 hover:bg-sand-50">
                  <td className="py-3 px-4 text-charcoal-700 font-medium">{area.area}</td>
                  <td className="text-right py-3 px-4 text-charcoal-600">{area.count}</td>
                  <td className="text-right py-3 px-4 text-charcoal-600">{Math.round(area.count * area.percentage / 100)}</td>
                  <td className="text-right py-3 px-4">
                    <span className="text-teal-600 font-medium">{area.percentage}%</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
