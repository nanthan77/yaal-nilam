'use client';

import { useState } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  TrendingUp,
  DollarSign,
  Users,
  Calendar,
  BarChart3,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface Promotion {
  id: string;
  name: string;
  type: 'featured' | 'premium' | 'standard';
  price: number;
  listings: number;
  revenue: number;
  active: boolean;
}

interface ChartData {
  month: string;
  revenue: number;
}

const mockPromotions: Promotion[] = [
  {
    id: '1',
    name: 'Featured Listing',
    type: 'featured',
    price: 5000,
    listings: 48,
    revenue: 240000,
    active: true,
  },
  {
    id: '2',
    name: 'Premium Promotion',
    type: 'premium',
    price: 3000,
    listings: 92,
    revenue: 276000,
    active: true,
  },
  {
    id: '3',
    name: 'Standard Listing',
    type: 'standard',
    price: 1000,
    listings: 312,
    revenue: 312000,
    active: true,
  },
];

const chartData: ChartData[] = [
  { month: 'Jan', revenue: 450000 },
  { month: 'Feb', revenue: 520000 },
  { month: 'Mar', revenue: 580000 },
  { month: 'Apr', revenue: 670000 },
  { month: 'May', revenue: 750000 },
  { month: 'Jun', revenue: 828000 },
];

const getPromotionColor = (type: string) => {
  switch (type) {
    case 'featured':
      return { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700' };
    case 'premium':
      return { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700' };
    case 'standard':
      return { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700' };
    default:
      return { bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-700' };
  }
};

export default function PromotionsPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [promotions, setPromotions] = useState<Promotion[]>(mockPromotions);
  const [newPromotion, setNewPromotion] = useState({
    name: '',
    type: 'standard' as 'featured' | 'premium' | 'standard',
    price: 0,
  });

  const totalRevenue = promotions.reduce((sum, p) => sum + p.revenue, 0);
  const totalListings = promotions.reduce((sum, p) => sum + p.listings, 0);
  const avgPrice = Math.round(totalRevenue / totalListings);

  const handleAddPromotion = () => {
    if (newPromotion.name && newPromotion.price > 0) {
      setShowAddModal(false);
      setNewPromotion({
        name: '',
        type: 'standard',
        price: 0,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-navy-900 mb-2">Promotions</h1>
        <p className="text-slate-600">Manage listing promotion plans and pricing</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <p className="text-slate-600 text-sm font-medium">Total Revenue</p>
            <DollarSign className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="text-3xl font-bold text-emerald-600">
            Rs. {(totalRevenue / 100000).toFixed(1)}L
          </p>
          <p className="text-xs text-slate-500 mt-2">This month</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <p className="text-slate-600 text-sm font-medium">Active Listings</p>
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-3xl font-bold text-blue-600">{totalListings}</p>
          <p className="text-xs text-slate-500 mt-2">Using promotions</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <p className="text-slate-600 text-sm font-medium">Avg Per Listing</p>
            <TrendingUp className="w-5 h-5 text-teal-600" />
          </div>
          <p className="text-3xl font-bold text-teal-600">Rs. {avgPrice.toLocaleString()}</p>
          <p className="text-xs text-slate-500 mt-2">Average revenue</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <p className="text-slate-600 text-sm font-medium">Plans</p>
            <BarChart3 className="w-5 h-5 text-orange-600" />
          </div>
          <p className="text-3xl font-bold text-orange-600">{promotions.length}</p>
          <p className="text-xs text-slate-500 mt-2">Active plans</p>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 mb-8">
        <h2 className="text-xl font-bold text-navy-900 mb-4">Monthly Revenue</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="month" stroke="#64748b" />
            <YAxis stroke="#64748b" />
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
              dataKey="revenue"
              stroke="#14b8a6"
              strokeWidth={2}
              dot={{ fill: '#14b8a6', r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Promotions Cards */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        {promotions.map((promo) => {
          const colors = getPromotionColor(promo.type);
          return (
            <div
              key={promo.id}
              className={`rounded-2xl border ${colors.border} p-6 ${colors.bg}`}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className={`text-lg font-bold ${colors.text}`}>{promo.name}</h3>
                  <p className="text-sm text-slate-600 mt-1 capitalize">{promo.type}</p>
                </div>
                {promo.active && (
                  <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-semibold">
                    Active
                  </span>
                )}
              </div>

              {/* Pricing */}
              <div className="bg-white bg-opacity-60 rounded-lg p-3 mb-4">
                <p className="text-xs text-slate-600 mb-1">Price per Listing</p>
                <p className="text-2xl font-bold text-slate-900">
                  Rs. {promo.price.toLocaleString()}
                </p>
              </div>

              {/* Stats */}
              <div className="space-y-2 mb-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Active Listings</span>
                  <span className="font-semibold text-slate-900">{promo.listings}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Revenue</span>
                  <span className="font-semibold text-emerald-600">
                    Rs. {(promo.revenue / 100000).toFixed(1)}L
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="border-t border-slate-200 pt-4 flex gap-2">
                <button className="flex-1 text-slate-600 hover:bg-slate-200 hover:bg-opacity-50 py-2 rounded transition font-medium text-sm">
                  <Edit2 className="w-4 h-4 mx-auto" />
                </button>
                <button className="flex-1 text-slate-600 hover:bg-slate-200 hover:bg-opacity-50 py-2 rounded transition font-medium text-sm">
                  View Details
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Promotions Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-xl font-bold text-navy-900">Active Promotions</h2>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition font-medium"
          >
            <Plus className="w-4 h-4" />
            Add Promotion
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                  Plan Name
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                  Type
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-slate-900">
                  Price
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-slate-900">
                  Listings
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-slate-900">
                  Revenue
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-slate-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {promotions.map((promo) => (
                <tr key={promo.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <span className="font-medium text-slate-900">{promo.name}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold border ${
                        getPromotionColor(promo.type).bg
                      } ${getPromotionColor(promo.type).text}`}
                    >
                      {promo.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center font-medium text-slate-900">
                    Rs. {promo.price.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-center font-medium text-slate-900">
                    {promo.listings}
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-emerald-600">
                    Rs. {(promo.revenue / 100000).toFixed(1)}L
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex gap-2 justify-center">
                      <button className="text-slate-600 hover:bg-slate-100 p-2 rounded transition">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="text-red-600 hover:bg-red-50 p-2 rounded transition">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Promotion Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full">
            <div className="border-b border-slate-200 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900">Add Promotion Plan</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-500 hover:text-slate-700 font-bold text-xl"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-1">
                  Plan Name
                </label>
                <input
                  type="text"
                  placeholder="e.g., Featured Listing"
                  value={newPromotion.name}
                  onChange={(e) => setNewPromotion({ ...newPromotion, name: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-900 mb-1">
                  Plan Type
                </label>
                <select
                  value={newPromotion.type}
                  onChange={(e) =>
                    setNewPromotion({
                      ...newPromotion,
                      type: e.target.value as 'featured' | 'premium' | 'standard',
                    })
                  }
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="standard">Standard</option>
                  <option value="premium">Premium</option>
                  <option value="featured">Featured</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-900 mb-1">
                  Price (Rs.)
                </label>
                <input
                  type="number"
                  placeholder="Enter price"
                  value={newPromotion.price}
                  onChange={(e) => setNewPromotion({ ...newPromotion, price: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="border-t border-slate-200 pt-4 flex gap-3">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-2 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddPromotion}
                  className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 rounded-lg transition"
                >
                  Add Plan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
