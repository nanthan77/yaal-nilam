'use client';

import { useState, useMemo } from 'react';
import {
  Plus,
  Filter,
  Download,
  Search,
  X,
  MessageCircle,
  Eye,
  Edit2,
  XCircle,
  Phone,
  Mail,
  MapPin,
  Calendar,
  AlertCircle,
  TrendingUp,
} from 'lucide-react';
import { MOCK_REQUIREMENTS, JAFFNA_AREAS, PROPERTY_TYPES } from '@/lib/mock-data';

interface FilterState {
  search: string;
  intent: 'all' | 'buy' | 'rent';
  propertyType: string;
  area: string;
  budgetMin: number | null;
  budgetMax: number | null;
  urgency: string;
  status: string;
}

interface FormData {
  customerName: string;
  phone: string;
  whatsapp: string;
  email: string;
  intent: 'buy' | 'rent';
  propertyType: string;
  preferredArea: string;
  budgetMin: number | null;
  budgetMax: number | null;
  bedrooms: number | null;
  landSize: number | null;
  urgency: 'high' | 'medium' | 'low';
  notes: string;
}

export default function RequirementsPage() {
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    intent: 'all',
    propertyType: '',
    area: '',
    budgetMin: null,
    budgetMax: null,
    urgency: '',
    status: '',
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequirement, setSelectedRequirement] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    customerName: '',
    phone: '',
    whatsapp: '',
    email: '',
    intent: 'buy',
    propertyType: '',
    preferredArea: '',
    budgetMin: null,
    budgetMax: null,
    bedrooms: null,
    landSize: null,
    urgency: 'medium',
    notes: '',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const filteredRequirements = useMemo(() => {
    return MOCK_REQUIREMENTS.filter((req) => {
      if (
        filters.search &&
        !req.customer_name.toLowerCase().includes(filters.search.toLowerCase()) &&
        !req.phone.includes(filters.search)
      ) {
        return false;
      }

      if (filters.intent !== 'all' && req.intent !== filters.intent) {
        return false;
      }

      if (filters.propertyType && req.property_type !== filters.propertyType) {
        return false;
      }

      if (filters.area && req.preferred_area !== filters.area) {
        return false;
      }

      if (
        filters.budgetMin !== null &&
        req.budget_max < filters.budgetMin
      ) {
        return false;
      }

      if (
        filters.budgetMax !== null &&
        req.budget_min > filters.budgetMax
      ) {
        return false;
      }

      if (filters.urgency && req.urgency !== filters.urgency) {
        return false;
      }

      if (filters.status && req.status !== filters.status) {
        return false;
      }

      return true;
    });
  }, [filters]);

  const stats = {
    total: MOCK_REQUIREMENTS.length,
    active: MOCK_REQUIREMENTS.filter((r) => r.status !== 'closed').length,
    matchedFull: MOCK_REQUIREMENTS.filter((r) => (r.matches_count / 5) >= 0.75).length,
    matchedPartial: MOCK_REQUIREMENTS.filter(
      (r) => (r.matches_count / 5) >= 0.25 && (r.matches_count / 5) < 0.75
    ).length,
    unmatched: MOCK_REQUIREMENTS.filter((r) => (r.matches_count / 5) < 0.25).length,
    urgent: MOCK_REQUIREMENTS.filter((r) => r.urgency === 'high').length,
  };

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      intent: 'all',
      propertyType: '',
      area: '',
      budgetMin: null,
      budgetMax: null,
      urgency: '',
      status: '',
    });
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.customerName.trim()) {
      errors.customerName = 'Customer name is required';
    }
    if (!formData.phone.trim()) {
      errors.phone = 'Phone is required';
    }
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    }
    if (!formData.propertyType) {
      errors.propertyType = 'Property type is required';
    }
    if (!formData.preferredArea) {
      errors.preferredArea = 'Preferred area is required';
    }
    if (formData.budgetMin === null) {
      errors.budgetMin = 'Budget minimum is required';
    }
    if (formData.budgetMax === null) {
      errors.budgetMax = 'Budget maximum is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormChange = (key: keyof FormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleAddRequirement = () => {
    if (validateForm()) {
      setFormData({
        customerName: '',
        phone: '',
        whatsapp: '',
        email: '',
        intent: 'buy',
        propertyType: '',
        preferredArea: '',
        budgetMin: null,
        budgetMax: null,
        bedrooms: null,
        landSize: null,
        urgency: 'medium',
        notes: '',
      });
      setFormErrors({});
      setIsModalOpen(false);
    }
  };

  const getIntentBadgeColor = (intent: string) => {
    return intent === 'buy'
      ? 'bg-blue-100 text-blue-800'
      : 'bg-green-100 text-green-800';
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high':
        return 'text-red-600 bg-red-50';
      case 'medium':
        return 'text-amber-600 bg-amber-50';
      case 'low':
        return 'text-green-600 bg-green-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getMatchColor = (percentage: number) => {
    if (percentage < 25) return 'bg-red-500';
    if (percentage < 50) return 'bg-amber-500';
    if (percentage < 75) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const getMatchLabel = (percentage: number) => {
    if (percentage < 25) return 'No good matches';
    if (percentage < 50) return 'Partial matches';
    if (percentage < 75) return 'Good matches';
    return 'Excellent matches';
  };

  const formatBudget = (amount: number): string => {
    if (amount >= 10000000) {
      return `${(amount / 10000000).toFixed(1)} Cr`;
    }
    return `${(amount / 100000).toFixed(1)} L`;
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Property Requirements
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Manage customer property requirements and match them with available properties
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
            >
              <Plus size={20} />
              Add Requirement
            </button>
            <button className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 font-medium text-white hover:bg-teal-700">
              <TrendingUp size={20} />
              Run Auto-Match
            </button>
            <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 hover:bg-gray-50">
              <Download size={20} />
              Export
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-6 gap-4">
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <p className="text-sm font-medium text-gray-600">Active</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">
              {stats.active}
            </p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <p className="text-sm font-medium text-gray-600">Matched (Full)</p>
            <p className="mt-1 text-2xl font-bold text-green-600">
              {stats.matchedFull}
            </p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <p className="text-sm font-medium text-gray-600">Matched (Partial)</p>
            <p className="mt-1 text-2xl font-bold text-amber-600">
              {stats.matchedPartial}
            </p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <p className="text-sm font-medium text-gray-600">Unmatched</p>
            <p className="mt-1 text-2xl font-bold text-red-600">
              {stats.unmatched}
            </p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <p className="text-sm font-medium text-gray-600">Urgent</p>
            <p className="mt-1 text-2xl font-bold text-red-600">
              {stats.urgent}
            </p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <p className="text-sm font-medium text-gray-600">Total</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">
              {stats.total}
            </p>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-4">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Search
            </label>
            <div className="relative mt-1">
              <Search className="absolute left-3 top-2.5 size-5 text-gray-400" />
              <input
                type="text"
                placeholder="Name or phone..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full rounded-lg border border-gray-300 pl-10 pr-3 py-2 text-sm placeholder-gray-500 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Intent
            </label>
            <select
              value={filters.intent}
              onChange={(e) => handleFilterChange('intent', e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            >
              <option value="all">All</option>
              <option value="buy">Buy</option>
              <option value="rent">Rent</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Property Type
            </label>
            <select
              value={filters.propertyType}
              onChange={(e) => handleFilterChange('propertyType', e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            >
              <option value="">All Types</option>
              {PROPERTY_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Area
            </label>
            <select
              value={filters.area}
              onChange={(e) => handleFilterChange('area', e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            >
              <option value="">All Areas</option>
              {JAFFNA_AREAS.map((area) => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Urgency
            </label>
            <select
              value={filters.urgency}
              onChange={(e) => handleFilterChange('urgency', e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            >
              <option value="">All</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            >
              <option value="">All</option>
              <option value="new">New</option>
              <option value="in_progress">In Progress</option>
              <option value="matched_partial">Matched Partial</option>
              <option value="matched_full">Matched Full</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleClearFilters}
          className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          <X size={16} />
          Clear Filters
        </button>
      </div>

      {/* Requirements Grid */}
      <div className="grid auto-rows-max grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredRequirements.length > 0 ? (
          filteredRequirements.map((requirement) => (
            <div
              key={requirement.id}
              className="overflow-hidden rounded-lg border border-gray-200 bg-white hover:shadow-lg transition-shadow"
            >
              {/* Card Header */}
              <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100 p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">
                      {requirement.customer_name}
                    </h3>
                    <div className="mt-1 flex items-center gap-2 text-sm text-gray-600">
                      <Phone size={14} />
                      {requirement.phone}
                    </div>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${getIntentBadgeColor(
                      requirement.intent
                    )}`}
                  >
                    {requirement.intent === 'buy' ? 'Buy' : 'Rent'}
                  </span>
                </div>
              </div>

              {/* Card Content */}
              <div className="space-y-3 p-4">
                {/* Property Details */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <MapPin size={14} className="text-gray-400" />
                    <span>
                      {requirement.property_type} in {requirement.preferred_area}
                    </span>
                  </div>
                  <div className="text-sm text-gray-700">
                    <span className="font-medium">Budget:</span>{' '}
                    {formatBudget(requirement.budget_min)} -{' '}
                    {formatBudget(requirement.budget_max)}
                  </div>
                  <div className="text-sm text-gray-700">
                    <span className="font-medium">Bedrooms:</span>{' '}
                    {requirement.bedrooms || 'N/A'}
                  </div>
                </div>

                {/* Urgency Badge */}
                <div className="flex items-center gap-2">
                  <AlertCircle size={14} />
                  <span
                    className={`text-xs font-semibold capitalize ${getUrgencyColor(
                      requirement.urgency
                    )} rounded px-2 py-1`}
                  >
                    {requirement.urgency} Urgency
                  </span>
                </div>

                {/* Match Indicator */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-gray-700">
                      Match: {Math.round((requirement.matches_count / 5) * 100)}%
                    </span>
                    <span className="text-xs text-gray-600">
                      {requirement.matches_count} properties
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                    <div
                      className={`h-full transition-all ${getMatchColor(
                        Math.round((requirement.matches_count / 5) * 100)
                      )}`}
                      style={{ width: `${Math.round((requirement.matches_count / 5) * 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-600">
                    {getMatchLabel(Math.round((requirement.matches_count / 5) * 100))}
                  </p>
                </div>

                {/* Status and Date */}
                <div className="flex items-center justify-between pt-2">
                  <span className="inline-block rounded bg-gray-100 px-2.5 py-1 text-xs font-medium capitalize text-gray-800">
                    {requirement.status.replace('_', ' ')}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Calendar size={12} />
                    {new Date(requirement.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>

              {/* Card Actions */}
              <div className="border-t border-gray-200 bg-gray-50 px-4 py-3">
                <div className="grid grid-cols-4 gap-2">
                  <button className="inline-flex items-center justify-center gap-1 rounded-lg border border-gray-300 bg-white py-2 text-xs font-medium text-gray-700 hover:bg-gray-100">
                    <Eye size={14} />
                    View
                  </button>
                  <button className="inline-flex items-center justify-center gap-1 rounded-lg border border-gray-300 bg-white py-2 text-xs font-medium text-gray-700 hover:bg-gray-100">
                    <Edit2 size={14} />
                    Edit
                  </button>
                  <button className="inline-flex items-center justify-center gap-1 rounded-lg border border-gray-300 bg-white py-2 text-xs font-medium text-gray-700 hover:bg-gray-100">
                    <XCircle size={14} />
                    Close
                  </button>
                  <button className="inline-flex items-center justify-center gap-1 rounded-lg bg-green-600 py-2 text-xs font-medium text-white hover:bg-green-700">
                    <MessageCircle size={14} />
                    WhatsApp
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 py-12">
            <Filter size={48} className="text-gray-400" />
            <p className="mt-2 text-gray-600">No requirements found</p>
            <p className="text-sm text-gray-500">
              Try adjusting your filters
            </p>
          </div>
        )}
      </div>

      {/* Add Requirement Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="w-full max-w-2xl space-y-4 rounded-lg bg-white shadow-lg">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <h2 className="text-xl font-bold text-gray-900">
                Add New Requirement
              </h2>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setFormErrors({});
                }}
                className="rounded-lg p-1 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="max-h-96 space-y-4 overflow-y-auto px-6 py-4">
              {/* Customer Info */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900">
                  Customer Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Customer Name{' '}
                      <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.customerName}
                      onChange={(e) =>
                        handleFormChange('customerName', e.target.value)
                      }
                      className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:outline-none ${
                        formErrors.customerName
                          ? 'border-red-500 focus:border-red-500'
                          : 'border-gray-300 focus:border-blue-500'
                      }`}
                      placeholder="Enter name"
                    />
                    {formErrors.customerName && (
                      <p className="mt-1 text-xs text-red-600">
                        {formErrors.customerName}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Phone <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        handleFormChange('phone', e.target.value)
                      }
                      className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:outline-none ${
                        formErrors.phone
                          ? 'border-red-500 focus:border-red-500'
                          : 'border-gray-300 focus:border-blue-500'
                      }`}
                      placeholder="+94..."
                    />
                    {formErrors.phone && (
                      <p className="mt-1 text-xs text-red-600">
                        {formErrors.phone}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      WhatsApp
                    </label>
                    <input
                      type="tel"
                      value={formData.whatsapp}
                      onChange={(e) =>
                        handleFormChange('whatsapp', e.target.value)
                      }
                      className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                      placeholder="+94..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Email <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        handleFormChange('email', e.target.value)
                      }
                      className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:outline-none ${
                        formErrors.email
                          ? 'border-red-500 focus:border-red-500'
                          : 'border-gray-300 focus:border-blue-500'
                      }`}
                      placeholder="name@example.com"
                    />
                    {formErrors.email && (
                      <p className="mt-1 text-xs text-red-600">
                        {formErrors.email}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Property Requirements */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900">
                  Property Requirements
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Intent
                    </label>
                    <div className="mt-2 flex gap-4">
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="intent"
                          value="buy"
                          checked={formData.intent === 'buy'}
                          onChange={(e) =>
                            handleFormChange('intent', e.target.value)
                          }
                          className="rounded-full border-gray-300"
                        />
                        <span className="text-sm font-medium text-gray-700">
                          Buy
                        </span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="intent"
                          value="rent"
                          checked={formData.intent === 'rent'}
                          onChange={(e) =>
                            handleFormChange('intent', e.target.value)
                          }
                          className="rounded-full border-gray-300"
                        />
                        <span className="text-sm font-medium text-gray-700">
                          Rent
                        </span>
                      </label>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Property Type{' '}
                        <span className="text-red-600">*</span>
                      </label>
                      <select
                        value={formData.propertyType}
                        onChange={(e) =>
                          handleFormChange('propertyType', e.target.value)
                        }
                        className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:outline-none ${
                          formErrors.propertyType
                            ? 'border-red-500 focus:border-red-500'
                            : 'border-gray-300 focus:border-blue-500'
                        }`}
                      >
                        <option value="">Select type</option>
                        {PROPERTY_TYPES.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                      {formErrors.propertyType && (
                        <p className="mt-1 text-xs text-red-600">
                          {formErrors.propertyType}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Preferred Area{' '}
                        <span className="text-red-600">*</span>
                      </label>
                      <select
                        value={formData.preferredArea}
                        onChange={(e) =>
                          handleFormChange('preferredArea', e.target.value)
                        }
                        className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:outline-none ${
                          formErrors.preferredArea
                            ? 'border-red-500 focus:border-red-500'
                            : 'border-gray-300 focus:border-blue-500'
                        }`}
                      >
                        <option value="">Select area</option>
                        {JAFFNA_AREAS.map((area) => (
                          <option key={area} value={area}>
                            {area}
                          </option>
                        ))}
                      </select>
                      {formErrors.preferredArea && (
                        <p className="mt-1 text-xs text-red-600">
                          {formErrors.preferredArea}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Budget Min (LKR){' '}
                        <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="number"
                        value={formData.budgetMin || ''}
                        onChange={(e) =>
                          handleFormChange(
                            'budgetMin',
                            e.target.value ? parseInt(e.target.value) : null
                          )
                        }
                        className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:outline-none ${
                          formErrors.budgetMin
                            ? 'border-red-500 focus:border-red-500'
                            : 'border-gray-300 focus:border-blue-500'
                        }`}
                        placeholder="5000000"
                      />
                      {formErrors.budgetMin && (
                        <p className="mt-1 text-xs text-red-600">
                          {formErrors.budgetMin}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Budget Max (LKR){' '}
                        <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="number"
                        value={formData.budgetMax || ''}
                        onChange={(e) =>
                          handleFormChange(
                            'budgetMax',
                            e.target.value ? parseInt(e.target.value) : null
                          )
                        }
                        className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:outline-none ${
                          formErrors.budgetMax
                            ? 'border-red-500 focus:border-red-500'
                            : 'border-gray-300 focus:border-blue-500'
                        }`}
                        placeholder="10000000"
                      />
                      {formErrors.budgetMax && (
                        <p className="mt-1 text-xs text-red-600">
                          {formErrors.budgetMax}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Bedrooms
                      </label>
                      <input
                        type="number"
                        value={formData.bedrooms || ''}
                        onChange={(e) =>
                          handleFormChange(
                            'bedrooms',
                            e.target.value ? parseInt(e.target.value) : null
                          )
                        }
                        className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                        placeholder="3"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Land Size (Perch)
                      </label>
                      <input
                        type="number"
                        value={formData.landSize || ''}
                        onChange={(e) =>
                          handleFormChange(
                            'landSize',
                            e.target.value ? parseInt(e.target.value) : null
                          )
                        }
                        className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                        placeholder="20"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Urgency
                    </label>
                    <select
                      value={formData.urgency}
                      onChange={(e) =>
                        handleFormChange('urgency', e.target.value)
                      }
                      className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Notes
                    </label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) =>
                        handleFormChange('notes', e.target.value)
                      }
                      className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                      placeholder="Additional requirements or notes..."
                      rows={3}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex gap-3 border-t border-gray-200 px-6 py-4">
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setFormErrors({});
                }}
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddRequirement}
                className="flex-1 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
              >
                Save Requirement
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}