// @ts-nocheck
'use client'

import { useEffect, useState } from 'react'
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
import { getAnalyticsSummary } from '@/lib/firestore'

const COLORS = ['#1e3a5f', '#0f766e', '#d4a574', '#1f2937']

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState<'week' | 'month' | 'quarter'>('month')
  const [analytics, setAnalytics] = useState({
    trafficOverview: [],
    inquiriesBySource: [],
    listingsByType: [],
    demandVsSupply: [],
    topAreas: [],
    extra: { listingViews: 0, saveEvents: 0, viewingRequests: 0 },
  })

  useEffect(() => {
    async function loadAnalytics() {
      try {
        const summary = await getAnalyticsSummary()
        if (summary) setAnalytics(summary)
      } catch (error) {
        console.error('Failed to load analytics summary:', error)
      }
    }

    loadAnalytics()
  }, [])

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-charcoal-900">Analytics Dashboard</h1>
          <p className="text-charcoal-600 mt-1">Live marketplace signals from listings, inquiries, saves, and viewing requests</p>
        </div>
        <div className="flex gap-2">
          {(['week', 'month', 'quarter'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setDateRange(range)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                dateRange === range ? 'bg-navy-600 text-white' : 'bg-sand-100 text-charcoal-700 hover:bg-sand-200'
              }`}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white border border-sand-200 rounded-lg p-6">
          <p className="text-charcoal-600 text-sm font-medium">Listing Views</p>
          <p className="text-3xl font-bold text-navy-700 mt-2">{analytics.extra.listingViews}</p>
          <p className="text-teal-600 text-sm mt-2">Tracked from public property pages</p>
        </div>
        <div className="bg-white border border-sand-200 rounded-lg p-6">
          <p className="text-charcoal-600 text-sm font-medium">Saved Properties</p>
          <p className="text-3xl font-bold text-teal-700 mt-2">{analytics.extra.saveEvents}</p>
          <p className="text-teal-600 text-sm mt-2">Buyer shortlist intent</p>
        </div>
        <div className="bg-white border border-sand-200 rounded-lg p-6">
          <p className="text-charcoal-600 text-sm font-medium">Viewing Requests</p>
          <p className="text-3xl font-bold text-sand-700 mt-2">{analytics.extra.viewingRequests}</p>
          <p className="text-teal-600 text-sm mt-2">High-intent conversion signal</p>
        </div>
        <div className="bg-white border border-sand-200 rounded-lg p-6">
          <p className="text-charcoal-600 text-sm font-medium">Tracked Sources</p>
          <p className="text-3xl font-bold text-charcoal-700 mt-2">{analytics.inquiriesBySource.length}</p>
          <p className="text-teal-600 text-sm mt-2">Lead channels observed</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-sand-200 rounded-lg p-6">
          <h2 className="text-lg font-bold text-charcoal-900 mb-4">Traffic Overview</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analytics.trafficOverview}>
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
              <Line type="monotone" dataKey="views" stroke="#1e3a5f" strokeWidth={2} dot={{ fill: '#1e3a5f', r: 4 }} />
              <Line type="monotone" dataKey="inquiries" stroke="#0f766e" strokeWidth={2} dot={{ fill: '#0f766e', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white border border-sand-200 rounded-lg p-6">
          <h2 className="text-lg font-bold text-charcoal-900 mb-4">Inquiries by Source</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.inquiriesBySource}>
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

        <div className="bg-white border border-sand-200 rounded-lg p-6">
          <h2 className="text-lg font-bold text-charcoal-900 mb-4">Listings by Type</h2>
          <PieChart width={350} height={300}>
            <Pie
              data={analytics.listingsByType}
              dataKey="count"
              nameKey="type"
              cx={175}
              cy={120}
              outerRadius={100}
              fill="#8884d8"
              label={({ name, value }: { name: string; value: number }) => `${name}: ${value}`}
            >
              {analytics.listingsByType.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>

        <div className="bg-white border border-sand-200 rounded-lg p-6">
          <h2 className="text-lg font-bold text-charcoal-900 mb-4">Demand vs Supply by Area</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.demandVsSupply}>
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

      <div className="bg-white border border-sand-200 rounded-lg p-6">
        <h2 className="text-lg font-bold text-charcoal-900 mb-4">Top Performing Areas</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-sand-200">
                <th className="text-left py-3 px-4 font-semibold text-charcoal-700">Area</th>
                <th className="text-right py-3 px-4 font-semibold text-charcoal-700">Listings</th>
                <th className="text-right py-3 px-4 font-semibold text-charcoal-700">Share %</th>
              </tr>
            </thead>
            <tbody>
              {analytics.topAreas.map((area) => (
                <tr key={area.area} className="border-b border-sand-100 hover:bg-sand-50">
                  <td className="py-3 px-4 text-charcoal-700 font-medium">{area.area}</td>
                  <td className="text-right py-3 px-4 text-charcoal-600">{area.count}</td>
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
