'use client';

import { useState, useMemo } from 'react';
import {
  Plus,
  Upload,
  Download,
  Search,
  Grid3x3,
  List,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Eye,
  MessageCircle,
  MessageSquare,
  Star,
  Archive,
  Edit2,
  MoreHorizontal,
  Check,
  X,
  Filter,
  AlertCircle,
} from 'lucide-react';

// Types
interface Listing {
  id: string;
  code: string;
  title: string;
  type: 'House' | 'Apartment' | 'Villa' | 'Land' | 'Commercial';
  area: string;
  price: number;
  status: 'Published' | 'Pending' | 'Draft' | 'Rejected' | 'Archived' | 'Sold' | 'Rented';
  agent: string;
  views: number;
  inquiries: number;
  whatsappClicks: number;
  isFeatured: boolean;
  isVerified: boolean;
  dateAdded: string;
  image?: string;
}

interface FilterState {
  search: string;
  status: string;
  propertyType: string;
  area: string;
  priceMin: string;
  priceMax: string;
  sortBy: string;
}

// Mock Data
const MOCK_LISTINGS: Listing[] = [
  {
    id: '1',
    code: 'JP-001',
    title: 'Spacious 3BR House in Colombo North',
    type: 'House',
    area: 'Colombo North',
    price: 8500000,
    status: 'Published',
    agent: 'Rajeev Kumar',
    views: 2341,
    inquiries: 15,
    whatsappClicks: 42,
    isFeatured: true,
    isVerified: true,
    dateAdded: '2026-03-15',
  },
  {
    id: '2',
    code: 'JP-002',
    title: 'Modern Apartment in Jaffna Central',
    type: 'Apartment',
    area: 'Jaffna Central',
    price: 4200000,
    status: 'Published',
    agent: 'Priya Sharma',
    views: 1823,
    inquiries: 9,
    whatsappClicks: 28,
    isFeatured: false,
    isVerified: true,
    dateAdded: '2026-03-14',
  },
  {
    id: '3',
    code: 'JP-003',
    title: 'Luxury Villa with Pool',
    type: 'Villa',
    area: 'Mullaitivu',
    price: 15000000,
    status: 'Published',
    agent: 'Arun Pillai',
    views: 5421,
    inquiries: 34,
    whatsappClicks: 89,
    isFeatured: true,
    isVerified: true,
    dateAdded: '2026-03-13',
  },
  {
    id: '4',
    code: 'JP-004',
    title: 'Commercial Space Downtown',
    type: 'Commercial',
    area: 'Jaffna Central',
    price: 12000000,
    status: 'Pending',
    agent: 'Vikram Singh',
    views: 892,
    inquiries: 6,
    whatsappClicks: 15,
    isFeatured: false,
    isVerified: false,
    dateAdded: '2026-03-12',
  },
  {
    id: '5',
    code: 'JP-005',
    title: 'Land Plot - Prime Location',
    type: 'Land',
    area: 'Nallur',
    price: 3500000,
    status: 'Draft',
    agent: 'Anjali Nair',
    views: 234,
    inquiries: 2,
    whatsappClicks: 5,
    isFeatured: false,
    isVerified: false,
    dateAdded: '2026-03-10',
  },
  {
    id: '6',
    code: 'JP-006',
    title: 'Cozy Apartment Near Market',
    type: 'Apartment',
    area: 'Colombo North',
    price: 3800000,
    status: 'Published',
    agent: 'Rajeev Kumar',
    views: 1456,
    inquiries: 8,
    whatsappClicks: 22,
    isFeatured: false,
    isVerified: true,
    dateAdded: '2026-03-09',
  },
  {
    id: '7',
    code: 'JP-007',
    title: '2BR House with Garden',
    type: 'House',
    area: 'Nallur',
    price: 5200000,
    status: 'Published',
    agent: 'Priya Sharma',
    views: 2103,
    inquiries: 12,
    whatsappClicks: 35,
    isFeatured: true,
    isVerified: true,
    dateAdded: '2026-03-08',
  },
  {
    id: '8',
    code: 'JP-008',
    title: 'Villa with Sea View',
    type: 'Villa',
    area: 'Mullaitivu',
    price: 18000000,
    status: 'Published',
    agent: 'Arun Pillai',
    views: 6234,
    inquiries: 42,
    whatsappClicks: 125,
    isFeatured: true,
    isVerified: true,
    dateAdded: '2026-03-07',
  },
  {
    id: '9',
    code: 'JP-009',
    title: 'Office Space in Plaza',
    type: 'Commercial',
    area: 'Colombo North',
    price: 9500000,
    status: 'Pending',
    agent: 'Vikram Singh',
    views: 567,
    inquiries: 3,
    whatsappClicks: 8,
    isFeatured: false,
    isVerified: false,
    dateAdded: '2026-03-06',
  },
  {
    id: '10',
    code: 'JP-010',
    title: 'Residential Land - Nallur',
    type: 'Land',
    area: 'Nallur',
    price: 2800000,
    status: 'Rejected',
    agent: 'Anjali Nair',
    views: 412,
    inquiries: 1,
    whatsappClicks: 3,
    isFeatured: false,
    isVerified: false,
    dateAdded: '2026-03-05',
  },
  {
    id: '11',
    code: 'JP-011',
    title: 'Modern Studio Apartment',
    type: 'Apartment',
    area: 'Jaffna Central',
    price: 2500000,
    status: 'Published',
    agent: 'Priya Sharma',
    views: 1234,
    inquiries: 7,
    whatsappClicks: 18,
    isFeatured: false,
    isVerified: true,
    dateAdded: '2026-03-04',
  },
  {
    id: '12',
    code: 'JP-012',
    title: 'Heritage House - Colombo North',
    type: 'House',
    area: 'Colombo North',
    price: 6800000,
    status: 'Draft',
    agent: 'Rajeev Kumar',
    views: 234,
    inquiries: 0,
    whatsappClicks: 2,
    isFeatured: false,
    isVerified: false,
    dateAdded: '2026-03-03',
  },
  {
    id: '13',
    code: 'JP-013',
    title: 'Beachfront Villa',
    type: 'Villa',
    area: 'Mullaitivu',
    price: 22000000,
    status: 'Published',
    agent: 'Arun Pillai',
    views: 7893,
    inquiries: 56,
    whatsappClicks: 189,
    isFeatured: true,
    isVerified: true,
    dateAdded: '2026-03-02',
  },
  {
    id: '14',
    code: 'JP-014',
    title: 'Business Park Unit',
    type: 'Commercial',
    area: 'Colombo North',
    price: 11000000,
    status: 'Archived',
    agent: 'Vikram Singh',
    views: 1203,
    inquiries: 8,
    whatsappClicks: 12,
    isFeatured: false,
    isVerified: true,
    dateAdded: '2026-03-01',
  },
  {
    id: '15',
    code: 'JP-015',
    title: '5 Acre Agricultural Land',
    type: 'Land',
    area: 'Nallur',
    price: 4500000,
    status: 'Published',
    agent: 'Anjali Nair',
    views: 654,
    inquiries: 4,
    whatsappClicks: 11,
    isFeatured: false,
    isVerified: true,
    dateAdded: '2026-02-28',
  },
];

const JAFFNA_AREAS = [
  'All Areas',
  'Colombo North',
  'Jaffna Central',
  'Nallur',
  'Mullaitivu',
];

const PROPERTY_TYPES = [
  'All Types',
  'House',
  'Apartment',
  'Villa',
  'Land',
  'Commercial',
];

const STATUS_OPTIONS = [
  'All',
  'Published',
  'Pending',
  'Draft',
  'Rejected',
  'Archived',
  'Sold',
  'Rented',
];

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'price-high', label: 'Price High to Low' },
  { value: 'price-low', label: 'Price Low to High' },
  { value: 'views', label: 'Most Views' },
];

// Status badge colors
const getStatusColor = (status: string) => {
  switch (status) {
    case 'Published':
      return 'bg-green-100 text-green-800';
    case 'Pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'Draft':
      return 'bg-gray-100 text-gray-800';
    case 'Rejected':
      return 'bg-red-100 text-red-800';
    case 'Archived':
      return 'bg-blue-100 text-blue-800';
    case 'Sold':
      return 'bg-purple-100 text-purple-800';
    case 'Rented':
      return 'bg-cyan-100 text-cyan-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

// Format price
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'LKR',
    maximumFractionDigits: 0,
  }).format(price);
};

// Format date
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

// Property type icon colors
const getPropertyTypeColor = (type: string) => {
  switch (type) {
    case 'House':
      return 'from-amber-400 to-orange-500';
    case 'Apartment':
      return 'from-blue-400 to-blue-600';
    case 'Villa':
      return 'from-purple-400 to-pink-500';
    case 'Land':
      return 'from-green-400 to-emerald-500';
    case 'Commercial':
      return 'from-red-400 to-rose-600';
    default:
      return 'from-gray-400 to-gray-600';
  }
};

export default function ListingsPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [showDetailPanel, setShowDetailPanel] = useState(false);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    status: 'All',
    propertyType: 'All Types',
    area: 'All Areas',
    priceMin: '',
    priceMax: '',
    sortBy: 'newest',
  });

  // Filter and sort listings
  const filteredListings = useMemo(() => {
    let result = [...MOCK_LISTINGS];

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        (listing) =>
          listing.title.toLowerCase().includes(searchLower) ||
          listing.code.toLowerCase().includes(searchLower) ||
          listing.area.toLowerCase().includes(searchLower)
      );
    }

    // Status filter
    if (filters.status !== 'All') {
      result = result.filter((listing) => listing.status === filters.status);
    }

    // Property type filter
    if (filters.propertyType !== 'All Types') {
      result = result.filter((listing) => listing.type === filters.propertyType);
    }

    // Area filter
    if (filters.area !== 'All Areas') {
      result = result.filter((listing) => listing.area === filters.area);
    }

    // Price range filter
    if (filters.priceMin) {
      const minPrice = parseFloat(filters.priceMin);
      result = result.filter((listing) => listing.price >= minPrice);
    }
    if (filters.priceMax) {
      const maxPrice = parseFloat(filters.priceMax);
      result = result.filter((listing) => listing.price <= maxPrice);
    }

    // Sort
    switch (filters.sortBy) {
      case 'newest':
        result.sort(
          (a, b) =>
            new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
        );
        break;
      case 'oldest':
        result.sort(
          (a, b) =>
            new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime()
        );
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'views':
        result.sort((a, b) => b.views - a.views);
        break;
    }

    return result;
  }, [filters]);

  // Pagination
  const totalPages = Math.ceil(filteredListings.length / itemsPerPage);
  const paginatedListings = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredListings.slice(start, start + itemsPerPage);
  }, [filteredListings, currentPage, itemsPerPage]);

  // Stats
  const stats = useMemo(() => {
    return {
      total: MOCK_LISTINGS.length,
      published: MOCK_LISTINGS.filter((l) => l.status === 'Published').length,
      pending: MOCK_LISTINGS.filter((l) => l.status === 'Pending').length,
      draft: MOCK_LISTINGS.filter((l) => l.status === 'Draft').length,
    };
  }, []);

  // Handlers
  const handleSelectItem = (id: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedItems(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedItems.size === paginatedListings.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(paginatedListings.map((l) => l.id)));
    }
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      status: 'All',
      propertyType: 'All Types',
      area: 'All Areas',
      priceMin: '',
      priceMax: '',
      sortBy: 'newest',
    });
    setCurrentPage(1);
  };

  const handleViewDetails = (listing: Listing) => {
    setSelectedListing(listing);
    setShowDetailPanel(true);
  };

  // Render grid card
  const GridCard = ({ listing }: { listing: Listing }) => (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
      {/* Image placeholder */}
      <div
        className={`h-48 bg-gradient-to-br ${getPropertyTypeColor(
          listing.type
        )} flex items-center justify-center relative`}
      >
        <div className="text-white text-center">
          <div className="text-4xl mb-2">🏠</div>
          <div className="text-sm font-medium">{listing.type}</div>
        </div>
        {listing.isFeatured && (
          <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 px-2 py-1 rounded text-xs font-semibold flex items-center gap-1">
            <Star size={12} className="fill-current" /> Featured
          </div>
        )}
        {listing.isVerified && (
          <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-semibold">
            Verified
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
          {listing.title}
        </h3>

        <div className="flex items-center text-gray-600 text-sm mb-2">
          <MapPin size={14} className="mr-1" />
          {listing.area}
        </div>

        <div className="text-lg font-bold text-gray-900 mb-3">
          {formatPrice(listing.price)}
        </div>

        {/* Status badge */}
        <div className="mb-3">
          <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${getStatusColor(listing.status)}`}>
            {listing.status}
          </span>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 py-3 border-t border-b border-gray-100 mb-3">
          <div className="text-center">
            <div className="text-eye-600 font-semibold">{listing.views}</div>
            <div className="text-gray-500 text-xs">Views</div>
          </div>
          <div className="text-center">
            <div className="text-gray-600 font-semibold">{listing.inquiries}</div>
            <div className="text-gray-500 text-xs">Inquiries</div>
          </div>
          <div className="text-center">
            <div className="text-gray-600 font-semibold">
              {listing.whatsappClicks}
            </div>
            <div className="text-gray-500 text-xs">Chats</div>
          </div>
        </div>

        {/* Agent and date */}
        <div className="text-sm mb-3">
          <div className="text-gray-600">
            <span className="font-medium">{listing.agent}</span>
          </div>
          <div className="text-gray-500 text-xs">{formatDate(listing.dateAdded)}</div>
        </div>

        {/* Quick actions */}
        <div className="flex gap-2">
          <button
            onClick={() => handleViewDetails(listing)}
            className="flex-1 px-3 py-2 bg-blue-50 text-blue-600 rounded font-medium text-sm hover:bg-blue-100 transition"
          >
            View
          </button>
          <button className="flex-1 px-3 py-2 bg-gray-100 text-gray-600 rounded font-medium text-sm hover:bg-gray-200 transition">
            Edit
          </button>
          <button className="px-3 py-2 bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition">
            <MoreHorizontal size={16} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Property Listings
              </h1>
              <p className="text-gray-600 mt-1">
                Manage all your property listings
              </p>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition">
                <Plus size={20} /> Add New Listing
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition">
                <Upload size={20} /> Bulk Import
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition">
                <Download size={20} /> Export CSV
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="text-sm text-gray-600 font-medium">
                Total Listings
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {stats.total}
              </div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <div className="text-sm text-green-600 font-medium">Published</div>
              <div className="text-2xl font-bold text-green-900">
                {stats.published}
              </div>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
              <div className="text-sm text-yellow-600 font-medium">Pending</div>
              <div className="text-2xl font-bold text-yellow-900">
                {stats.pending}
              </div>
            </div>
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <div className="text-sm text-blue-600 font-medium">Draft</div>
              <div className="text-2xl font-bold text-blue-900">
                {stats.draft}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter bar */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 mb-4">
            {/* Search */}
            <div className="relative lg:col-span-2">
              <Search
                size={18}
                className="absolute left-3 top-3 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search by title or code..."
                value={filters.search}
                onChange={(e) =>
                  setFilters({ ...filters, search: e.target.value })
                }
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Status filter */}
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>

            {/* Property type filter */}
            <select
              value={filters.propertyType}
              onChange={(e) =>
                setFilters({ ...filters, propertyType: e.target.value })
              }
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {PROPERTY_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>

            {/* Area filter */}
            <select
              value={filters.area}
              onChange={(e) => setFilters({ ...filters, area: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {JAFFNA_AREAS.map((area) => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 mb-4">
            {/* Price range */}
            <input
              type="number"
              placeholder="Min price"
              value={filters.priceMin}
              onChange={(e) =>
                setFilters({ ...filters, priceMin: e.target.value })
              }
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              placeholder="Max price"
              value={filters.priceMax}
              onChange={(e) =>
                setFilters({ ...filters, priceMax: e.target.value })
              }
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* Sort by */}
            <select
              value={filters.sortBy}
              onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            {/* View toggle */}
            <div className="flex gap-2 border border-gray-300 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`flex-1 p-2 rounded transition ${
                  viewMode === 'grid'
                    ? 'bg-blue-100 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Grid3x3 size={18} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`flex-1 p-2 rounded transition ${
                  viewMode === 'list'
                    ? 'bg-blue-100 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <List size={18} />
              </button>
            </div>

            {/* Clear filters */}
            <button
              onClick={handleClearFilters}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition flex items-center gap-2 justify-center"
            >
              <X size={16} /> Clear
            </button>
          </div>
        </div>

        {/* Bulk actions bar */}
        {selectedItems.size > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium text-blue-900">
                {selectedItems.size} item(s) selected
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1 bg-green-600 text-white rounded text-sm font-medium hover:bg-green-700 transition">
                  Approve Selected
                </button>
                <button className="px-3 py-1 bg-red-600 text-white rounded text-sm font-medium hover:bg-red-700 transition">
                  Reject Selected
                </button>
                <button className="px-3 py-1 bg-yellow-600 text-white rounded text-sm font-medium hover:bg-yellow-700 transition">
                  Feature Selected
                </button>
                <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 transition">
                  Archive Selected
                </button>
                <button
                  onClick={() => setSelectedItems(new Set())}
                  className="px-3 py-1 bg-gray-300 text-gray-700 rounded text-sm font-medium hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Grid View */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {paginatedListings.map((listing) => (
              <GridCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}

        {/* List View */}
        {viewMode === 'list' && (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-8">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedItems.size === paginatedListings.length}
                      onChange={handleSelectAll}
                      className="rounded"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Code
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Area
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Agent
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Views
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Inquiries
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Date
                  </th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedListings.map((listing, index) => (
                  <tr
                    key={listing.id}
                    className={`border-t border-gray-200 hover:bg-gray-50 transition ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                    }`}
                  >
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedItems.has(listing.id)}
                        onChange={() => handleSelectItem(listing.id)}
                        className="rounded"
                      />
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {listing.code}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                      {listing.title}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {listing.type}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {listing.area}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                      {formatPrice(listing.price)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-2 py-1 rounded text-xs font-semibold ${getStatusColor(
                          listing.status
                        )}`}
                      >
                        {listing.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {listing.agent}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {listing.views}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {listing.inquiries}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {formatDate(listing.dateAdded)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleViewDetails(listing)}
                        className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(parseInt(e.target.value));
                setCurrentPage(1);
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={10}>10 per page</option>
              <option value={25}>25 per page</option>
              <option value={50}>50 per page</option>
            </select>
            <span className="text-sm text-gray-600">
              Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
              {Math.min(currentPage * itemsPerPage, filteredListings.length)} of{' '}
              {filteredListings.length} listings
            </span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <ChevronLeft size={18} />
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                      currentPage === page
                        ? 'bg-blue-600 text-white'
                        : 'border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                )
              )}
            </div>

            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Detail Slide-over Panel */}
      {showDetailPanel && selectedListing && (
        <div className="fixed inset-0 z-50">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={() => setShowDetailPanel(false)}
          />

          {/* Panel */}
          <div className="fixed right-0 top-0 bottom-0 w-full max-w-2xl bg-white shadow-lg overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                Listing Details
              </h2>
              <button
                onClick={() => setShowDetailPanel(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Image gallery placeholder */}
              <div className={`h-64 bg-gradient-to-br ${getPropertyTypeColor(selectedListing.type)} rounded-lg flex items-center justify-center text-white mb-6`}>
                <div className="text-center">
                  <div className="text-6xl mb-2">🖼</div>
                  <div className="text-lg font-medium">Image Gallery</div>
                </div>
              </div>

              {/* Basic info */}
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {selectedListing.title}
                </h3>
                <div className="flex items-center gap-2 text-gray-600 mb-4">
                  <MapPin size={18} />
                  {selectedListing.area}
                </div>
                <div className="flex gap-2 mb-4">
                  {selectedListing.isFeatured && (
                    <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold">
                      Featured
                    </span>
                  )}
                  {selectedListing.isVerified && (
                    <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                      Verified
                    </span>
                  )}
                </div>
              </div>

              {/* Property details grid */}
              <div className="grid grid-cols-2 gap-4 mb-6 pb-6 border-b border-gray-200">
                <div>
                  <div className="text-sm text-gray-600 font-medium">Code</div>
                  <div className="text-lg font-semibold text-gray-900">
                    {selectedListing.code}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 font-medium">Type</div>
                  <div className="text-lg font-semibold text-gray-900">
                    {selectedListing.type}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 font-medium">Price</div>
                  <div className="text-lg font-semibold text-gray-900">
                    {formatPrice(selectedListing.price)}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 font-medium">Status</div>
                  <div className="mt-1">
                    <span className={`inline-block px-3 py-1 rounded text-sm font-semibold ${getStatusColor(selectedListing.status)}`}>
                      {selectedListing.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                  Engagement Stats
                </h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <Eye size={20} className="text-blue-600 mb-2" />
                    <div className="text-sm text-blue-600 font-medium">Views</div>
                    <div className="text-2xl font-bold text-blue-900">
                      {selectedListing.views}
                    </div>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4">
                    <MessageCircle size={20} className="text-purple-600 mb-2" />
                    <div className="text-sm text-purple-600 font-medium">
                      Inquiries
                    </div>
                    <div className="text-2xl font-bold text-purple-900">
                      {selectedListing.inquiries}
                    </div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4">
                    <MessageSquare size={20} className="text-green-600 mb-2" />
                    <div className="text-sm text-green-600 font-medium">Chats</div>
                    <div className="text-2xl font-bold text-green-900">
                      {selectedListing.whatsappClicks}
                    </div>
                  </div>
                </div>
              </div>

              {/* Agent info */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                  Agent Information
                </h4>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-xl">👤</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">
                      {selectedListing.agent}
                    </div>
                    <div className="text-sm text-gray-600">Real Estate Agent</div>
                  </div>
                </div>
              </div>

              {/* Map placeholder */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                  Location Map
                </h4>
                <div className="bg-gray-100 h-64 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                  <div className="text-center">
                    <MapPin size={40} className="text-gray-400 mx-auto mb-2" />
                    <div className="text-gray-500 font-medium">Map Placeholder</div>
                  </div>
                </div>
              </div>

              {/* Inquiry history */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                  Recent Inquiries
                </h4>
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <div className="font-medium text-gray-900">
                          Inquiry #{i}
                        </div>
                        <div className="text-sm text-gray-600">
                          2 days ago
                        </div>
                      </div>
                      <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                        View
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-6 border-t border-gray-200">
                <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition">
                  <Edit2 size={18} /> Edit Listing
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition">
                  <Archive size={18} /> Archive
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
