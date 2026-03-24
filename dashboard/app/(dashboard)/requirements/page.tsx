// @ts-nocheck
'use client';

import { useState, useMemo, useEffect } from 'react';
import { MOCK_REQUIREMENTS } from '@/lib/mock-data';
import { getRequirements } from '@/lib/firestore';
import {
  Search,
  Plus,
  Eye,
  Trash2,
} from 'lucide-react';

type StatusType = 'new' | 'in_progress' | 'matched_partial' | 'matched_full';

export default function RequirementsPage() {
  const [allRequirements, setAllRequirements] = useState(MOCK_REQUIREMENTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [intentFilter, setIntentFilter] = useState('All');
  const [propertyTypeFilter, setPropertyTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState<'All' | StatusType>('All');
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    async function loadReqs() {
      try {
        const fsReqs = await getRequirements();
        if (fsReqs.length > 0) setAllRequirements(fsReqs);
      } catch (err) { console.error('Firestore requirements load error:', err); }
    }
    loadReqs();
  }, []);

  const intents = ['All', ...new Set(allRequirements.map(r => r.intent))];
  const propertyTypes = ['All', ...new Set(allRequirements.map(r => r.property_type || r.propertyType))];
  const statuses: (StatusType | 'All')[] = ['All', 'new', 'in_progress', 'matched_partial', 'matched_full'];

  const filteredRequirements = useMemo(() => {
    return allRequirements.filter(req => {
      const matchesSearch = req.customer_name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesIntent = intentFilter === 'All' || req.intent === intentFilter;
      const matchesType = propertyTypeFilter === 'All' || req.property_type === propertyTypeFilter;
      const matchesStatus = statusFilter === 'All' || req.status === statusFilter;

      return matchesSearch && matchesIntent && matchesType && matchesStatus;
    });
  }, [searchTerm, intentFilter, propertyTypeFilter, statusFilter]);

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-teal-100 text-teal-800';
      case 'in_progress':
        return 'bg-orange-100 text-orange-800';
      case 'matched_partial':
        return 'bg-blue-100 text-blue-800';
      case 'matched_full':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'new':
        return 'New';
      case 'in_progress':
        return 'In Progress';
      case 'matched_partial':
        return 'Partial Match';
      case 'matched_full':
        return 'Full Match';
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-charcoal-900">Buyer Requirements</h1>
            <p className="text-charcoal-600 mt-1">Track and match property requirements</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition font-medium"
          >
            <Plus className="w-5 h-5" />
            Add Requirement
          </button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 text-charcoal-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by customer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-charcoal-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <select
            value={intentFilter}
            onChange={(e) => setIntentFilter(e.target.value)}
            className="px-4 py-2 border border-charcoal-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            {intents.map((intent) => (
              <option key={intent} value={intent}>
                {intent === 'All' ? 'All Intents' : intent}
              </option>
            ))}
          </select>

          <select
            value={propertyTypeFilter}
            onChange={(e) => setPropertyTypeFilter(e.target.value)}
            className="px-4 py-2 border border-charcoal-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            {propertyTypes.map((type) => (
              <option key={type} value={type}>
                {type === 'All' ? 'All Types' : type}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-4 py-2 border border-charcoal-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status === 'All' ? 'All Statuses' : getStatusLabel(status)}
              </option>
            ))}
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-lg border border-charcoal-200">
          <table className="w-full">
            <thead>
              <tr className="bg-charcoal-50 border-b border-charcoal-200">
                <th className="px-6 py-3 text-left text-sm font-semibold text-charcoal-900">Customer</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-charcoal-900">Intent</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-charcoal-900">Property Type</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-charcoal-900">Area</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-charcoal-900">Budget Range</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-charcoal-900">Urgency</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-charcoal-900">Matches</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-charcoal-900">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-charcoal-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequirements.map((req) => (
                <tr key={req.id} className="border-b border-charcoal-100 hover:bg-charcoal-50 transition">
                  <td className="px-6 py-4 text-sm font-medium text-charcoal-900">{req.customer_name}</td>
                  <td className="px-6 py-4 text-sm text-charcoal-700">{req.intent}</td>
                  <td className="px-6 py-4 text-sm text-charcoal-700">{req.property_type}</td>
                  <td className="px-6 py-4 text-sm text-charcoal-700">{req.preferred_area}</td>
                  <td className="px-6 py-4 text-sm text-charcoal-700">Rs. {req.budget_min.toLocaleString()} - {req.budget_max.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      req.urgency === 'high' ? 'bg-red-100 text-red-800' :
                      req.urgency === 'medium' ? 'bg-orange-100 text-orange-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {req.urgency.charAt(0).toUpperCase() + req.urgency.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-charcoal-900">{req.matches_count}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeStyle(req.status)}`}>
                      {getStatusLabel(req.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                    <button className="p-2 hover:bg-charcoal-100 rounded-lg transition">
                      <Eye className="w-4 h-4 text-charcoal-600" />
                    </button>
                    <button className="p-2 hover:bg-red-100 rounded-lg transition">
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredRequirements.length === 0 && (
          <div className="text-center py-12">
            <p className="text-charcoal-600">No requirements found matching your criteria.</p>
          </div>
        )}

        {/* Footer Stats */}
        <div className="mt-6 text-sm text-charcoal-600">
          <p>Showing {filteredRequirements.length} of {allRequirements.length} requirements</p>
        </div>
      </div>

      {/* Add Modal (placeholder) */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold text-charcoal-900 mb-4">Add New Requirement</h2>
            <p className="text-charcoal-600 mb-6">Modal form would go here</p>
            <button
              onClick={() => setShowAddModal(false)}
              className="w-full px-4 py-2 bg-charcoal-200 text-charcoal-900 rounded-lg hover:bg-charcoal-300 transition font-medium"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}