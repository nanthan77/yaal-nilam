// @ts-nocheck
'use client';

import { useState } from 'react';
import { Plus, Clock, TrendingUp, Calendar } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface Promotion {
  id: string;
  listingTitle: string;
  listingId: string;
  planType: 'Featured' | 'Urgent' | 'Homepage Spotlight';
  startDate: string;
  endDate: string;
  revenue: number;
  status: 'active' | 'expiring' | 'expired';
  daysRemaining: number;
}

const promotions: Promotion[] = [
  {
    id: '1',
    listingTitle: 'Luxury Apartment in Jaffna City',
    listingId: 'YN-045',
    planType: 'Featured',
    startDate: '2026-03-10',
    endDate: '2026-04-10',
    revenue: 1500,
    status: 'active',
    daysRemaining: 17,
  },
  {
    id: '2',
    listingTitle: 'Modern 3-Bedroom House',
    listingId: 'YN-048',
    planType: 'Urgent',
    startDate: '2026-03-15',
    endDate: '2026-04-15',
    revenue: 2500,
    status: 'active',
    daysRemaining: 22,
  },  {
    id: '3',
    listingTitle: 'Land Plot with City View',
    listingId: 'YN-051',
    planType: 'Homepage Spotlight',
    startDate: '2026-03-20',
    endDate: '2026-03-27',
    revenue: 5000,
    status: 'expiring',
    daysRemaining: 3,
  },
  {
    id: '4',
    listingTitle: 'Beachfront Property',
    listingId: 'YN-042',
    planType: 'Featured',
    startDate: '2026-03-01',
    endDate: '2026-03-31',
    revenue: 1500,
    status: 'active',
    daysRemaining: 7,
  },
  {
    id: '5',
    listingTitle: 'Commercial Space Rental',
    listingId: 'YN-050',
    planType: 'Featured',
    startDate: '2026-02-20',
    endDate: '2026-03-20',
    revenue: 1500,
    status: 'expired',
    daysRemaining: 0,
  },
];

const chartData = [
  { month: 'Jan', revenue: 24000 },
  { month: 'Feb', revenue: 38000 },
  { month: 'Mar', revenue: 45200 },
];

const plans = [
  {
    name: 'Normal',
    price: 'Free',
    duration: 'Unlimited',
    color: 'bg-slate-100',
    textColor: 'text-slate-700',
  },
  {
    name: 'Featured',
    price: 'Rs.1,500',
    duration: '30 days',
    color: 'bg-blue-100',
    textColor: 'text-blue-700',
  },
  {
    name: 'Urgent',
    price: 'Rs.2,500',
    duration: '30 days',
    color: 'bg-red-100',
    textColor: 'text-red-700',
  },
  {
    name: 'Homepage Spotlight',
    price: 'Rs.5,000',
    duration: '30 days',
    color: 'bg-amber-100',
    textColor: 'text-amber-700',
  },
];

export default function PromotionsPage() {
  const [showModal, setShowModal] = useState(false);
  const activeCount = promotions.filter((p) => p.status === 'active').length;
  const expiringCount = promotions.filter((p) => p.status === 'expiring').length;
  const totalRevenue = promotions
    .filter((p) => p.status !== 'expired')
    .reduce((sum, p) => sum + p.revenue, 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-slate-900">Promotions & Featured Listings</h1>
          <p className="text-slate-600 mt-2">Manage listing promotions and monetization</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2"
        >
          <Plus size={20} />
          Add Promotion
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <p className="text-slate-600 text-sm font-medium">Active Promotions</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">{activeCount}</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <p className="text-slate-600 text-sm font-medium">Expiring Soon</p>
          <p className="text-3xl font-bold text-red-600 mt-2">{expiringCount}</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <p className="text-slate-600 text-sm font-medium">Monthly Revenue</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">Rs.{totalRevenue.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <p className="text-slate-600 text-sm font-medium">Total This Month</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">Rs.45.2K</p>
        </div>
      </div>
      {/* Plans */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-4">Promotion Plans</h2>
        <div className="grid grid-cols-4 gap-4">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`${plan.color} ${plan.textColor} rounded-2xl p-6 border-2 border-current`}
            >
              <p className="font-bold text-lg">{plan.name}</p>
              <p className="text-2xl font-bold mt-2">{plan.price}</p>
              <p className="text-sm mt-1">{plan.duration}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Active Promotions Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-bold text-slate-900">Active Promotions</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">
                  Listing
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">
                  Plan
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">
                  Start Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">
                  End Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">
                  Days Remaining
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">
                  Revenue
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-slate-600 uppercase">
                  Actions
                </th>
              </tr>
            </thead>            <tbody>
              {promotions
                .filter((p) => p.status !== 'expired')
                .map((promo) => (
                  <tr
                    key={promo.id}
                    className="border-b border-slate-100 hover:bg-slate-50"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-slate-900">{promo.listingTitle}</p>
                        <p className="text-xs text-slate-600">#{promo.listingId}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                        {promo.planType}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{promo.startDate}</td>
                    <td className="px-6 py-4 text-slate-600">{promo.endDate}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${
                          promo.daysRemaining <= 3
                            ? 'bg-red-100 text-red-700'
                            : 'bg-green-100 text-green-700'
                        }`}
                      >
                        <Clock size={14} />
                        {promo.daysRemaining}d
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-900">
                      Rs.{promo.revenue.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          promo.status === 'active'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {promo.status.charAt(0).toUpperCase() + promo.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center space-x-2">
                      <button className="text-teal-600 hover:text-teal-700 font-semibold text-sm">
                        Extend
                      </button>
                      <button className="text-red-600 hover:text-red-700 font-semibold text-sm">
                        Cancel
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>          </table>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <h2 className="text-lg font-bold text-slate-900 mb-4">Monthly Revenue</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="revenue" fill="#0d9488" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 space-y-6">
            <h2 className="text-2xl font-bold text-slate-900">Add Promotion</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Select Listing
                </label>
                <select className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500">
                  <option>Choose a listing...</option>
                  <option>Modern 3-Bedroom House (#YN-048)</option>
                  <option>Luxury Apartment (#YN-045)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Promotion Plan
                </label>
                <select className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500">
                  <option>Featured - Rs.1,500</option>
                  <option>Urgent - Rs.2,500</option>
                  <option>Homepage Spotlight - Rs.5,000</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-slate-200">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 bg-teal-600 text-white hover:bg-teal-700 rounded-lg font-semibold"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}