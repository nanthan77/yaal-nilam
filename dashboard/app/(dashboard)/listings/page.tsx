// @ts-nocheck
'use client';

import { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { createListing, deleteListing, getListings, publishListing, rejectListing, updateListing } from '@/lib/firestore';
import {
  Search,
  ChevronDown,
  Eye,
  MoreVertical,
  Star,
  CheckSquare,
  Square,
  Plus,
  LayoutGrid,
  LayoutList,
  X,
  AlertCircle,
  Home,
} from 'lucide-react';

// ============================================================================
// TYPE DEFINITIONS & MOCK DATA
// ============================================================================

export type ListingStatus =
  | 'draft'
  | 'pending'
  | 'published'
  | 'hidden'
  | 'rejected'
  | 'expired'
  | 'sold'
  | 'rented'
  | 'archived';

export interface Listing {
  id: string;
  listing_code: string;
  title: string;
  title_ta: string;
  property_type: 'house' | 'land' | 'apartment' | 'commercial' | 'villa';
  intent: 'buy' | 'sell' | 'rent' | 'short-term' | 'short_rent';
  price: number;
  area: string;
  district: string;
  address: string;
  bedrooms: number;
  bathrooms: number;
  land_size_perches: number;
  sqft: number;
  images: string[];
  status: ListingStatus;
  verified: boolean;
  featured: boolean;
  agent_id: string;
  agent_name: string;
  agent_phone: string;
  description: string;
  posted_date: string;
  updated_date: string;
  views: number;
  inquiries_count: number;
  whatsapp_clicks: number;
  negotiable?: boolean;
  furnishing?: 'furnished' | 'semi-furnished' | 'unfurnished';
  parking?: number;
  highlights?: string[];
  source_collection?: string;
  published_listing_id?: string;
}

const MOCK_LISTINGS: Listing[] = [
  {
    id: '1',
    listing_code: 'JN-2024-001',
    title: 'Traditional House in Nallur',
    title_ta: 'நல்லூரில் பாரம்பரிய வீடு',
    property_type: 'house',
    intent: 'buy',
    price: 4500000,
    area: 'Nallur',
    district: 'Jaffna',
    address: '123 Nallur Main Road, Nallur',
    bedrooms: 4,
    bathrooms: 2,
    land_size_perches: 12.5,
    sqft: 2500,
    images: [
      'https://images.unsplash.com/photo-1570129477492-45ea003588af?w=400',
    ],
    status: 'published',
    verified: true,
    featured: true,
    agent_id: 'A001',
    agent_name: 'Kumaran Samy',
    agent_phone: '+94771234567',
    description: 'Spacious house with modern amenities',
    posted_date: '2026-03-15',
    updated_date: '2026-03-24',
    views: 2450,
    inquiries_count: 18,
    whatsapp_clicks: 42,
    negotiable: true,
    furnishing: 'furnished',
    parking: 2,
    highlights: ['Modern kitchen', 'Large garden', 'Near temple'],
  },
  {
    id: '2',
    listing_code: 'JN-2024-002',
    title: 'Beach Land in Point Pedro',
    title_ta: 'கோட்டையூரில் கடற்கரை நிலம்',
    property_type: 'land',
    intent: 'buy',
    price: 2800000,
    area: 'Point Pedro',
    district: 'Jaffna',
    address: 'Coastal Road, Point Pedro',
    bedrooms: 0,
    bathrooms: 0,
    land_size_perches: 25,
    sqft: 12500,
    images: [
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400',
    ],
    status: 'published',
    verified: true,
    featured: false,
    agent_id: 'A002',
    agent_name: 'Priya Krishnan',
    agent_phone: '+94772345678',
    description: 'Clear title land, good access road',
    posted_date: '2026-03-20',
    updated_date: '2026-03-23',
    views: 890,
    inquiries_count: 5,
    whatsapp_clicks: 12,
    negotiable: false,
  },
  {
    id: '3',
    listing_code: 'JN-2024-003',
    title: 'Modern Apartment in Jaffna Fort',
    title_ta: 'யாழ் கோட்டையில் நவீன அபார்ட்மெண்ட்',
    property_type: 'apartment',
    intent: 'rent',
    price: 125000,
    area: 'Jaffna Fort',
    district: 'Jaffna',
    address: '456 Fort Road, Jaffna Fort',
    bedrooms: 2,
    bathrooms: 1,
    land_size_perches: 0,
    sqft: 950,
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400',
    ],
    status: 'published',
    verified: true,
    featured: true,
    agent_id: 'A001',
    agent_name: 'Kumaran Samy',
    agent_phone: '+94771234567',
    description: 'Well-maintained flat with city views',
    posted_date: '2026-03-18',
    updated_date: '2026-03-24',
    views: 3200,
    inquiries_count: 28,
    whatsapp_clicks: 67,
    negotiable: false,
    furnishing: 'semi-furnished',
    parking: 1,
    highlights: ['City view', 'Close to shops', 'Good ventilation'],
  },
  {
    id: '4',
    listing_code: 'JN-2024-004',
    title: 'Commercial Space in Chunnakam',
    title_ta: 'சுண்ணாக்கத்தில் வணிக இடம்',
    property_type: 'commercial',
    intent: 'rent',
    price: 85000,
    area: 'Chunnakam',
    district: 'Jaffna',
    address: 'Main Bazaar Road, Chunnakam',
    bedrooms: 0,
    bathrooms: 1,
    land_size_perches: 8,
    sqft: 2000,
    images: [
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400',
    ],
    status: 'draft',
    verified: false,
    featured: false,
    agent_id: 'A003',
    agent_name: 'Vikram Das',
    agent_phone: '+94773456789',
    description: 'Prime location for retail or office',
    posted_date: '2026-03-22',
    updated_date: '2026-03-22',
    views: 340,
    inquiries_count: 2,
    whatsapp_clicks: 3,
  },
  {
    id: '5',
    listing_code: 'JN-2024-005',
    title: 'Luxury Villa in Karainagar',
    title_ta: 'கராய்நாகரில் விலாசவாழ்க்கை வீடு',
    property_type: 'villa',
    intent: 'buy',
    price: 130000000,
    area: 'Karainagar',
    district: 'Jaffna',
    address: '789 Coastal Lane, Karainagar',
    bedrooms: 5,
    bathrooms: 4,
    land_size_perches: 50,
    sqft: 8000,
    images: [
      'https://images.unsplash.com/photo-1512917774080-9b274b3d0117?w=400',
    ],
    status: 'published',
    verified: true,
    featured: true,
    agent_id: 'A004',
    agent_name: 'Ashoka Weerasuriya',
    agent_phone: '+94774567890',
    description: 'Stunning villa with pool and garden',
    posted_date: '2026-03-10',
    updated_date: '2026-03-24',
    views: 5680,
    inquiries_count: 35,
    whatsapp_clicks: 89,
    negotiable: true,
    furnishing: 'furnished',
    parking: 4,
    highlights: ['Swimming pool', 'Large garden', 'Security', 'Gym'],
  },
  {
    id: '6',
    listing_code: 'JN-2024-006',
    title: 'Apartment in Thirunelvely',
    title_ta: 'திருநெல்வேலியில் அபார்ட்மெண்ட்',
    property_type: 'apartment',
    intent: 'buy',
    price: 3200000,
    area: 'Thirunelvely',
    district: 'Jaffna',
    address: 'New Road, Thirunelvely',
    bedrooms: 3,
    bathrooms: 2,
    land_size_perches: 0,
    sqft: 1500,
    images: [
      'https://images.unsplash.com/photo-1493857671505-72967e2e2760?w=400',
    ],
    status: 'pending',
    verified: false,
    featured: false,
    agent_id: 'A002',
    agent_name: 'Priya Krishnan',
    agent_phone: '+94772345678',
    description: 'Well-constructed apartment',
    posted_date: '2026-03-12',
    updated_date: '2026-03-21',
    views: 1200,
    inquiries_count: 8,
    whatsapp_clicks: 15,
  },
  {
    id: '7',
    listing_code: 'JN-2024-007',
    title: 'House for Rent in Kopay',
    title_ta: 'கோபாயில் வாடகை வீடு',
    property_type: 'house',
    intent: 'rent',
    price: 95000,
    area: 'Kopay',
    district: 'Jaffna',
    address: 'Main Road, Kopay',
    bedrooms: 3,
    bathrooms: 2,
    land_size_perches: 15,
    sqft: 1800,
    images: [
      'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400',
    ],
    status: 'published',
    verified: true,
    featured: false,
    agent_id: 'A003',
    agent_name: 'Vikram Das',
    agent_phone: '+94773456789',
    description: 'Family house near schools and shops',
    posted_date: '2026-03-19',
    updated_date: '2026-03-24',
    views: 1650,
    inquiries_count: 12,
    whatsapp_clicks: 28,
  },
  {
    id: '8',
    listing_code: 'JN-2024-008',
    title: 'Land in Chavakachcheri',
    title_ta: 'சவக்கச்சேரியில் நிலம்',
    property_type: 'land',
    intent: 'buy',
    price: 1800000,
    area: 'Chavakachcheri',
    district: 'Jaffna',
    address: 'Galle Road, Chavakachcheri',
    bedrooms: 0,
    bathrooms: 0,
    land_size_perches: 18,
    sqft: 9000,
    images: [
      'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400',
    ],
    status: 'published',
    verified: false,
    featured: false,
    agent_id: 'A004',
    agent_name: 'Ashoka Weerasuriya',
    agent_phone: '+94774567890',
    description: 'Corner plot near main road',
    posted_date: '2026-03-21',
    updated_date: '2026-03-24',
    views: 780,
    inquiries_count: 4,
    whatsapp_clicks: 8,
  },
];

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

const normalizeListingIntent = (intent?: string): Listing['intent'] => {
  const normalized = (intent || 'sell').toString().toLowerCase();
  if (normalized === 'buy' || normalized === 'sale') return 'sell';
  if (normalized === 'short-term' || normalized === 'short stay') return 'short_rent';
  return normalized as Listing['intent'];
};

const formatPrice = (price: number, intent: Listing['intent']): string => {
  if (intent === 'buy' || intent === 'sell') {
    if (price >= 10000000) {
      return `Rs. ${(price / 10000000).toFixed(1)}Cr`;
    } else if (price >= 100000) {
      return `Rs. ${(price / 100000).toFixed(1)}L`;
    }
    return `Rs. ${price.toLocaleString()}`;
  }

  if (intent === 'short-term' || intent === 'short_rent') {
    return `Rs. ${price.toLocaleString()}/night`;
  }

  return `Rs. ${price.toLocaleString()}/mo`;
};

const getStatusColor = (
  status: ListingStatus
): {
  bg: string;
  text: string;
  dot: string;
} => {
  const statusColors: Record<
    ListingStatus,
    { bg: string; text: string; dot: string }
  > = {
    published: {
      bg: 'bg-green-50',
      text: 'text-green-700',
      dot: 'bg-green-500',
    },
    pending: { bg: 'bg-yellow-50', text: 'text-yellow-700', dot: 'bg-yellow-500' },
    draft: { bg: 'bg-gray-50', text: 'text-gray-700', dot: 'bg-gray-500' },
    rejected: { bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500' },
    hidden: { bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500' },
    expired: { bg: 'bg-orange-50', text: 'text-orange-700', dot: 'bg-orange-500' },
    sold: { bg: 'bg-purple-50', text: 'text-purple-700', dot: 'bg-purple-500' },
    rented: { bg: 'bg-pink-50', text: 'text-pink-700', dot: 'bg-pink-500' },
    archived: { bg: 'bg-slate-50', text: 'text-slate-700', dot: 'bg-slate-500' },
  };
  return statusColors[status];
};

const getPropertyTypeLabel = (
  type: 'house' | 'land' | 'apartment' | 'commercial' | 'villa'
): string => {
  const labels: Record<typeof type, string> = {
    house: 'House',
    land: 'Land',
    apartment: 'Apartment',
    commercial: 'Commercial',
    villa: 'Villa',
  };
  return labels[type] || type;
};

const buildListingCode = () => `YN-${Date.now().toString().slice(-6)}`;

const buildBlankListing = (): Listing => {
  const now = new Date().toISOString();
  return {
    id: `new-${Date.now()}`,
    listing_code: buildListingCode(),
    title: '',
    title_ta: '',
    property_type: 'house',
    intent: 'sell',
    price: 0,
    area: 'Jaffna',
    district: 'Jaffna',
    address: '',
    bedrooms: 0,
    bathrooms: 0,
    land_size_perches: 0,
    sqft: 0,
    images: [],
    status: 'draft',
    verified: false,
    featured: false,
    agent_id: '',
    agent_name: '',
    agent_phone: '',
    description: '',
    posted_date: now,
    updated_date: now,
    views: 0,
    inquiries_count: 0,
    whatsapp_clicks: 0,
    negotiable: false,
    furnishing: 'unfurnished',
    parking: 0,
    highlights: [],
    source_collection: 'listings',
  };
};

// ============================================================================
// LISTING DETAIL MODAL COMPONENT
// ============================================================================

interface ListingDetailModalProps {
  listing: Listing | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (listing: Listing) => void;
}

function ListingDetailModal({
  listing,
  isOpen,
  onClose,
  onSave,
}: ListingDetailModalProps) {
  const [formData, setFormData] = useState<Listing | null>(listing);

  if (!isOpen || !formData) return null;

  const handleChange = (
    field: keyof Listing,
    value: any
  ) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleSave = () => {
    if (formData) {
      onSave(formData);
      onClose();
    }
  };

  const statusColors = getStatusColor(formData.status);

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-end overflow-y-auto">
      <div className="w-full max-w-2xl bg-white h-screen overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Edit Listing</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form Content */}
        <div className="p-6 space-y-8">
          {/* Basic Info Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
              Basic Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title (English)
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title (Tamil)
                </label>
                <input
                  type="text"
                  value={formData.title_ta}
                  onChange={(e) => handleChange('title_ta', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Listing Code
                </label>
                <input
                  type="text"
                  value={formData.listing_code}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Intent
                </label>
                <select
                  value={formData.intent}
                  onChange={(e) =>
                    handleChange('intent', normalizeListingIntent(e.target.value))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="sell">Sell</option>
                  <option value="rent">Rent</option>
                  <option value="short_rent">Short stay</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Property Type
                </label>
                <select
                  value={formData.property_type}
                  onChange={(e) =>
                    handleChange('property_type', e.target.value as any)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="house">House</option>
                  <option value="land">Land</option>
                  <option value="apartment">Apartment</option>
                  <option value="commercial">Commercial</option>
                  <option value="villa">Villa</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleChange('status', e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="draft">Draft</option>
                  <option value="pending">Pending</option>
                  <option value="published">Published</option>
                  <option value="hidden">Hidden</option>
                  <option value="rejected">Rejected</option>
                  <option value="expired">Expired</option>
                  <option value="sold">Sold</option>
                  <option value="rented">Rented</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>
          </div>

          {/* Location Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
              Location
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Area
                </label>
                <input
                  type="text"
                  value={formData.area}
                  onChange={(e) => handleChange('area', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  District
                </label>
                <input
                  type="text"
                  value={formData.district}
                  onChange={(e) => handleChange('district', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
              Property Details
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) =>
                    handleChange('price', parseInt(e.target.value))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bedrooms
                </label>
                <input
                  type="number"
                  value={formData.bedrooms}
                  onChange={(e) =>
                    handleChange('bedrooms', parseInt(e.target.value))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bathrooms
                </label>
                <input
                  type="number"
                  value={formData.bathrooms}
                  onChange={(e) =>
                    handleChange('bathrooms', parseInt(e.target.value))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Land Size (Perches)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.land_size_perches}
                  onChange={(e) =>
                    handleChange('land_size_perches', parseFloat(e.target.value))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Square Feet
                </label>
                <input
                  type="number"
                  value={formData.sqft}
                  onChange={(e) =>
                    handleChange('sqft', parseInt(e.target.value))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Parking
                </label>
                <input
                  type="number"
                  value={formData.parking || 0}
                  onChange={(e) =>
                    handleChange('parking', parseInt(e.target.value))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Furnishing
                </label>
                <select
                  value={formData.furnishing || 'unfurnished'}
                  onChange={(e) =>
                    handleChange('furnishing', e.target.value as any)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="unfurnished">Unfurnished</option>
                  <option value="semi-furnished">Semi-furnished</option>
                  <option value="furnished">Furnished</option>
                </select>
              </div>
              <div>
                <label className="flex items-center gap-2 mt-7">
                  <input
                    type="checkbox"
                    checked={formData.negotiable || false}
                    onChange={(e) =>
                      handleChange('negotiable', e.target.checked)
                    }
                    className="w-4 h-4 rounded border-gray-300"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Negotiable
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
              Description
            </h3>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={5}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Enter property description..."
            />
          </div>

          {/* Agent Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
              Agent Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Agent Name
                </label>
                <input
                  type="text"
                  value={formData.agent_name}
                  onChange={(e) => handleChange('agent_name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Agent Phone
                </label>
                <input
                  type="tel"
                  value={formData.agent_phone}
                  onChange={(e) => handleChange('agent_phone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>
          </div>

          {/* Settings Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
              Settings
            </h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.verified}
                  onChange={(e) => handleChange('verified', e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300"
                />
                <span className="text-sm font-medium text-gray-700">
                  Verified
                </span>
              </label>
              <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => handleChange('featured', e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300"
                />
                <span className="text-sm font-medium text-gray-700">
                  Featured
                </span>
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="border-t border-gray-200 pt-6 flex gap-3 justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition font-medium"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface ListingViewModalProps {
  listing: Listing | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (listing: Listing) => void;
}

function ListingViewModal({ listing, isOpen, onClose, onEdit }: ListingViewModalProps) {
  if (!isOpen || !listing) return null;

  const publicId = listing.published_listing_id || listing.id;
  const publicUrl = `/properties/${publicId}/`;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-end overflow-y-auto">
      <div className="w-full max-w-xl bg-white min-h-screen">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{listing.title || 'Untitled listing'}</h2>
            <p className="text-sm text-gray-500">{listing.listing_code}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition" aria-label="Close listing preview">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="relative h-64 overflow-hidden rounded-lg bg-sand-100">
            {listing.images?.[0] ? (
              <Image src={listing.images[0]} alt={listing.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 576px" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Home className="w-12 h-12 text-sand-400" />
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg border border-gray-200 p-4">
              <p className="text-xs font-semibold uppercase text-gray-500">Price</p>
              <p className="mt-1 text-lg font-bold text-teal-700">{formatPrice(listing.price, listing.intent)}</p>
            </div>
            <div className="rounded-lg border border-gray-200 p-4">
              <p className="text-xs font-semibold uppercase text-gray-500">Status</p>
              <p className="mt-1 font-semibold capitalize text-gray-900">{listing.status}</p>
            </div>
            <div className="rounded-lg border border-gray-200 p-4">
              <p className="text-xs font-semibold uppercase text-gray-500">Area</p>
              <p className="mt-1 font-semibold text-gray-900">{listing.area}</p>
            </div>
            <div className="rounded-lg border border-gray-200 p-4">
              <p className="text-xs font-semibold uppercase text-gray-500">Type</p>
              <p className="mt-1 font-semibold text-gray-900">{getPropertyTypeLabel(listing.property_type)}</p>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase text-gray-500">Address</p>
            <p className="mt-1 text-gray-900">{listing.address || 'No address added'}</p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase text-gray-500">Description</p>
            <p className="mt-1 text-gray-700">{listing.description || 'No description added.'}</p>
          </div>

          <div className="grid grid-cols-3 gap-3 text-sm">
            <div className="rounded-lg bg-gray-50 p-3">
              <p className="font-bold text-gray-900">{listing.views.toLocaleString()}</p>
              <p className="text-gray-500">Views</p>
            </div>
            <div className="rounded-lg bg-gray-50 p-3">
              <p className="font-bold text-gray-900">{listing.inquiries_count}</p>
              <p className="text-gray-500">Inquiries</p>
            </div>
            <div className="rounded-lg bg-gray-50 p-3">
              <p className="font-bold text-gray-900">{listing.whatsapp_clicks}</p>
              <p className="text-gray-500">WhatsApp</p>
            </div>
          </div>

          <div className="flex gap-3 border-t border-gray-200 pt-6">
            <button
              onClick={() => {
                onClose();
                onEdit(listing);
              }}
              className="px-5 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition font-medium"
            >
              Edit
            </button>
            {listing.status === 'published' && (
              <a
                href={publicUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
              >
                Open public page
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// MAIN LISTINGS PAGE COMPONENT
// ============================================================================

export default function ListingsPage() {
  const [listings, setListings] = useState<Listing[]>(() =>
    MOCK_LISTINGS.map((listing) => ({ ...listing, intent: normalizeListingIntent(listing.intent) }))
  );
  const [firestoreLoaded, setFirestoreLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [actionMessage, setActionMessage] = useState('');

  // Load listings from Firestore on mount
  useEffect(() => {
    async function loadFromFirestore() {
      try {
        const fsListings = await getListings();
        if (fsListings.length > 0) {
          // Map Firestore data to match the Listing interface
          const mapped = fsListings.map((l, idx) => ({
            ...l,
            listing_code: l.listing_code || `JN-${String(idx + 1).padStart(3, '0')}`,
            title_ta: l.title_ta || '',
            property_type: (l.type || l.property_type || 'house').toLowerCase(),
            intent: normalizeListingIntent(l.intent),
            area: l.area || '',
            district: l.district || 'Jaffna',
            address: l.address || '',
            bedrooms: l.bedrooms || 0,
            bathrooms: l.bathrooms || 0,
            land_size_perches: l.land_size_perches || 0,
            sqft: l.sqft || 0,
            images: l.images || [],
            status: (l.status === 'Available' ? 'published' : l.status === 'Pending' ? 'pending' : l.status || 'pending').toLowerCase(),
            verified: l.verified ?? false,
            featured: l.featured ?? false,
            agent_id: l.agent_id || '',
            agent_name: l.agent || l.agent_name || '',
            agent_phone: l.agent_phone || '',
            description: l.description || '',
            posted_date: l.created_at || l.posted_date || new Date().toISOString(),
            updated_date: l.updated_date || new Date().toISOString(),
            views: l.views || 0,
            inquiries_count: l.inquiries_count || 0,
            whatsapp_clicks: l.whatsapp_clicks || 0,
          }));
          setListings(mapped);
        }
      } catch (err) {
        console.error('Firestore listings load error:', err);
      } finally {
        setFirestoreLoaded(true);
      }
    }
    loadFromFirestore();
  }, []);
  const [statusFilter, setStatusFilter] = useState<ListingStatus | 'all'>('all');
  const [propertyTypeFilter, setPropertyTypeFilter] = useState<
    'house' | 'land' | 'apartment' | 'commercial' | 'villa' | 'all'
  >('all');
  const [intentFilter, setIntentFilter] = useState<'sell' | 'rent' | 'short_rent' | 'all'>('all');
  const [areaFilter, setAreaFilter] = useState('all');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'card'>('table');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [sortColumn, setSortColumn] = useState<keyof Listing | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [editingListing, setEditingListing] = useState<Listing | null>(null);
  const [viewingListing, setViewingListing] = useState<Listing | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Filter and search logic
  const filteredListings = useMemo(() => {
    let result = listings;

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (l) =>
          l.title.toLowerCase().includes(query) ||
          l.listing_code.toLowerCase().includes(query) ||
          l.area.toLowerCase().includes(query)
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter((l) => l.status === statusFilter);
    }

    // Property type filter
    if (propertyTypeFilter !== 'all') {
      result = result.filter((l) => l.property_type === propertyTypeFilter);
    }

    // Intent filter
    if (intentFilter !== 'all') {
      result = result.filter((l) => l.intent === intentFilter);
    }

    // Area filter
    if (areaFilter !== 'all') {
      result = result.filter((l) => l.area === areaFilter);
    }

    // Verified filter
    if (verifiedOnly) {
      result = result.filter((l) => l.verified);
    }

    // Featured filter
    if (featuredOnly) {
      result = result.filter((l) => l.featured);
    }

    // Sorting
    if (sortColumn) {
      result = [...result].sort((a, b) => {
        const aVal = a[sortColumn];
        const bVal = b[sortColumn];

        if (typeof aVal === 'number' && typeof bVal === 'number') {
          return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
        }

        if (typeof aVal === 'string' && typeof bVal === 'string') {
          return sortDirection === 'asc'
            ? aVal.localeCompare(bVal)
            : bVal.localeCompare(aVal);
        }

        return 0;
      });
    }

    return result;
  }, [
    listings,
    searchQuery,
    statusFilter,
    propertyTypeFilter,
    intentFilter,
    areaFilter,
    verifiedOnly,
    featuredOnly,
    sortColumn,
    sortDirection,
  ]);

  // Pagination
  const totalPages = Math.ceil(filteredListings.length / itemsPerPage);
  const paginatedListings = filteredListings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Get unique areas
  const uniqueAreas = Array.from(new Set(listings.map((l) => l.area))).sort();

  // Stats
  const stats = {
    total: listings.length,
    active: listings.filter((l) => l.status === 'published').length,
    pending: listings.filter((l) => l.status === 'pending').length,
    featured: listings.filter((l) => l.featured).length,
  };

  // Handlers
  const handleSort = (column: keyof Listing) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === paginatedListings.length) {
      setSelectedIds(new Set());
    } else {
      const allIds = new Set(paginatedListings.map((l) => l.id));
      setSelectedIds(allIds);
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setPropertyTypeFilter('all');
    setIntentFilter('all');
    setAreaFilter('all');
    setVerifiedOnly(false);
    setFeaturedOnly(false);
    setCurrentPage(1);
  };

  const showActionMessage = (message: string) => {
    setActionMessage(message);
    window.setTimeout(() => setActionMessage(''), 3500);
  };

  const handleSaveListing = async (updated: Listing) => {
    const normalized = {
      ...updated,
      intent: normalizeListingIntent(updated.intent),
      updated_date: new Date().toISOString(),
      source_collection: updated.source_collection || 'listings',
    };

    if (updated.id.startsWith('new-')) {
      const newId = await createListing(normalized);
      if (!newId) {
        showActionMessage('Could not create listing. Please check admin access and try again.');
        return;
      }
      setListings((current) => [{ ...normalized, id: newId }, ...current]);
      showActionMessage('Listing draft created.');
      return;
    }

    setListings((current) => current.map((l) => (l.id === normalized.id ? normalized : l)));
    const ok = await updateListing(normalized.id, { ...normalized, updated_at: new Date().toISOString() }, normalized);
    showActionMessage(ok ? 'Listing saved.' : 'Could not save listing. Please check admin access.');
  };

  const handleApproveListing = async (listing: Listing) => {
    setListings((current) =>
      current.map((item) => (item.id === listing.id ? { ...item, status: 'published' as const } : item))
    );
    await publishListing(listing);
  };

  const handleRejectListing = async (listing: Listing) => {
    setListings((current) =>
      current.map((item) => (item.id === listing.id ? { ...item, status: 'rejected' as const } : item))
    );
    await rejectListing(listing);
  };

  const handleFeatureListing = async (listing: Listing) => {
    setListings((current) =>
      current.map((item) => (item.id === listing.id ? { ...item, featured: true } : item))
    );
    await updateListing(listing.id, { featured: true, updated_at: new Date().toISOString() }, listing);
  };

  const handleDuplicateListing = async (listing: Listing) => {
    const duplicate: Listing = {
      ...listing,
      id: `new-${Date.now()}`,
      listing_code: buildListingCode(),
      title: `${listing.title || 'Untitled listing'} copy`,
      status: 'draft',
      featured: false,
      verified: false,
      views: 0,
      inquiries_count: 0,
      whatsapp_clicks: 0,
      posted_date: new Date().toISOString(),
      updated_date: new Date().toISOString(),
      source_collection: 'listings',
      published_listing_id: '',
    };

    const newId = await createListing(duplicate);
    if (!newId) {
      showActionMessage('Could not duplicate listing. Please check admin access.');
      return;
    }
    setListings((current) => [{ ...duplicate, id: newId }, ...current]);
    showActionMessage('Listing duplicated as a draft.');
  };

  const handleArchiveListing = async (listing: Listing) => {
    setListings((current) =>
      current.map((item) => (item.id === listing.id ? { ...item, status: 'archived' as const } : item))
    );
    await updateListing(listing.id, { status: 'archived', updated_at: new Date().toISOString() }, listing);
  };

  const handleDeleteListing = async (listing: Listing) => {
    if (confirm(`Delete ${listing.title}?`)) {
      setListings((current) => current.filter((item) => item.id !== listing.id));
      await deleteListing(listing.id, listing);
    }
  };

  const handleBulkApprove = async () => {
    const selectedListings = listings.filter((l) => selectedIds.has(l.id));
    const updated = listings.map((l) =>
      selectedIds.has(l.id) ? { ...l, status: 'published' as const } : l
    );
    setListings(updated);
    for (const listing of selectedListings) {
      await publishListing(listing);
    }
    setSelectedIds(new Set());
  };

  const handleBulkReject = async () => {
    const selectedListings = listings.filter((l) => selectedIds.has(l.id));
    const updated = listings.map((l) =>
      selectedIds.has(l.id) ? { ...l, status: 'rejected' as const } : l
    );
    setListings(updated);
    for (const listing of selectedListings) {
      await rejectListing(listing);
    }
    setSelectedIds(new Set());
  };

  const handleBulkFeature = async () => {
    const selectedListings = listings.filter((l) => selectedIds.has(l.id));
    const updated = listings.map((l) =>
      selectedIds.has(l.id) ? { ...l, featured: true } : l
    );
    setListings(updated);
    for (const listing of selectedListings) {
      await updateListing(listing.id, { featured: true, updated_at: new Date().toISOString() }, listing);
    }
    setSelectedIds(new Set());
  };

  const handleBulkArchive = async () => {
    const selectedListings = listings.filter((l) => selectedIds.has(l.id));
    const updated = listings.map((l) =>
      selectedIds.has(l.id) ? { ...l, status: 'archived' as const } : l
    );
    setListings(updated);
    for (const listing of selectedListings) {
      await updateListing(listing.id, { status: 'archived', updated_at: new Date().toISOString() }, listing);
    }
    setSelectedIds(new Set());
  };

  const handleBulkDelete = async () => {
    if (confirm(`Delete ${selectedIds.size} listing(s)?`)) {
      const selectedListings = listings.filter((l) => selectedIds.has(l.id));
      const updated = listings.filter((l) => !selectedIds.has(l.id));
      setListings(updated);
      for (const listing of selectedListings) {
        await deleteListing(listing.id, listing);
      }
      setSelectedIds(new Set());
    }
  };

  // ============================================================================
  // TABLE VIEW COMPONENT
  // ============================================================================

  const TableView = () => (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-6 py-3 text-left">
              <button
                onClick={toggleSelectAll}
                className="text-gray-600 hover:text-gray-900"
              >
                {selectedIds.size === paginatedListings.length ? (
                  <CheckSquare className="w-5 h-5 text-teal-600" />
                ) : (
                  <Square className="w-5 h-5" />
                )}
              </button>
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">
              Image
            </th>
            <th
              onClick={() => handleSort('title')}
              className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide cursor-pointer hover:bg-gray-100 transition"
            >
              Title
            </th>
            <th
              onClick={() => handleSort('property_type')}
              className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide cursor-pointer hover:bg-gray-100 transition"
            >
              Type
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">
              Area
            </th>
            <th
              onClick={() => handleSort('price')}
              className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide cursor-pointer hover:bg-gray-100 transition"
            >
              Price
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">
              Status
            </th>
            <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wide">
              Verified
            </th>
            <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wide">
              Featured
            </th>
            <th
              onClick={() => handleSort('views')}
              className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide cursor-pointer hover:bg-gray-100 transition"
            >
              Views
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">
              Inquiries
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">
              Posted
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {paginatedListings.map((listing) => {
            const statusColor = getStatusColor(listing.status);
            const isSelected = selectedIds.has(listing.id);

            return (
              <tr
                key={listing.id}
                className={`hover:bg-gray-50 transition ${
                  isSelected ? 'bg-teal-50' : ''
                }`}
              >
                <td className="px-6 py-4">
                  <button
                    onClick={() => toggleSelect(listing.id)}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    {isSelected ? (
                      <CheckSquare className="w-5 h-5 text-teal-600" />
                    ) : (
                      <Square className="w-5 h-5" />
                    )}
                  </button>
                </td>
                <td className="px-6 py-4">
                  {listing.images && listing.images.length > 0 ? (
                    <Image
                      src={listing.images[0]}
                      alt={listing.title}
                      width={48}
                      height={48}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-sand-100 flex items-center justify-center">
                      <Home className="w-6 h-6 text-sand-400" />
                    </div>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {listing.title}
                    </p>
                    <p className="text-xs text-gray-500">{listing.listing_code}</p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded">
                    {getPropertyTypeLabel(listing.property_type)}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {listing.area}
                </td>
                <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                  {formatPrice(listing.price, listing.intent)}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${statusColor.bg} ${statusColor.text}`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${statusColor.dot}`}
                    ></span>
                    {listing.status.charAt(0).toUpperCase() +
                      listing.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  {listing.verified ? (
                    <span className="text-green-600 font-bold">✓</span>
                  ) : (
                    <span className="text-gray-300">✗</span>
                  )}
                </td>
                <td className="px-6 py-4 text-center">
                  {listing.featured ? (
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mx-auto" />
                  ) : (
                    <Star className="w-4 h-4 text-gray-300 mx-auto" />
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {listing.views.toLocaleString()}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {listing.inquiries_count}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {new Date(listing.posted_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                </td>
                <td className="px-6 py-4">
                  <div className="relative group">
                    <button className="text-gray-400 hover:text-gray-600">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                    <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition z-10">
                      <button
                        onClick={() => setEditingListing(listing)}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 first:rounded-t-lg"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => setViewingListing(listing)}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                      >
                        👁️ View
                      </button>
                      <button
                        onClick={() => handleDuplicateListing(listing)}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                      >
                        📋 Duplicate
                      </button>
                      <button
                        onClick={() => handleApproveListing(listing)}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                      >
                        ✓ Approve
                      </button>
                      <button
                        onClick={() => handleRejectListing(listing)}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                      >
                        ✗ Reject
                      </button>
                      <button
                        onClick={() => handleFeatureListing(listing)}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                      >
                        ⭐ Feature
                      </button>
                      <button
                        onClick={() => handleArchiveListing(listing)}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                      >
                        📦 Archive
                      </button>
                      <button
                        onClick={() => handleDeleteListing(listing)}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 last:rounded-b-lg"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

  // ============================================================================
  // CARD VIEW COMPONENT
  // ============================================================================

  const CardView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {paginatedListings.map((listing) => {
        const statusColor = getStatusColor(listing.status);

        return (
          <div
            key={listing.id}
            className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition"
          >
            {/* Image */}
            <div className="relative h-40 overflow-hidden bg-gray-100">
              {listing.images && listing.images.length > 0 ? (
                <Image
                  src={listing.images[0]}
                  alt={listing.title}
                  fill
                  className="w-full h-full object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Home className="w-12 h-12 text-sand-300" />
                </div>
              )}
              <span
                className={`absolute top-3 right-3 inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusColor.bg} ${statusColor.text}`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${statusColor.dot}`}
                ></span>
                {listing.status.charAt(0).toUpperCase() + listing.status.slice(1)}
              </span>
            </div>

            {/* Content */}
            <div className="p-4 space-y-3">
              <div>
                <h3 className="font-semibold text-gray-900 line-clamp-2">
                  {listing.title}
                </h3>
                <p className="text-xs text-gray-500">{listing.listing_code}</p>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-bold text-teal-600">
                    {formatPrice(listing.price, listing.intent)}
                  </p>
                  <p className="text-xs text-gray-500">{listing.area}</p>
                </div>
                {listing.featured && (
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                )}
              </div>

              <div className="flex items-center gap-2 text-xs text-gray-600 pt-2 border-t border-gray-200">
                <span>Agent: {listing.agent_name}</span>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setEditingListing(listing)}
                  className="flex-1 px-3 py-2 text-xs font-medium text-teal-600 bg-teal-50 rounded hover:bg-teal-100 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => setViewingListing(listing)}
                  className="flex-1 px-3 py-2 text-xs font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition"
                >
                  View
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Listings Management
            </h1>
            <p className="text-gray-600">Manage all property listings</p>
          </div>
          <button
            onClick={() => setEditingListing(buildBlankListing())}
            className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition font-medium flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add New Listing
          </button>
        </div>

        {actionMessage && (
          <div className="mb-5 rounded-lg border border-teal-200 bg-teal-50 px-4 py-3 text-sm font-semibold text-teal-800" role="status">
            {actionMessage}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
            <p className="text-xs text-gray-600 uppercase tracking-wide font-semibold">
              Total
            </p>
            <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
            <p className="text-xs text-gray-600 uppercase tracking-wide font-semibold">
              Active
            </p>
            <p className="text-3xl font-bold text-gray-900">{stats.active}</p>
          </div>
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4">
            <p className="text-xs text-gray-600 uppercase tracking-wide font-semibold">
              Pending
            </p>
            <p className="text-3xl font-bold text-gray-900">{stats.pending}</p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4">
            <p className="text-xs text-gray-600 uppercase tracking-wide font-semibold">
              Featured
            </p>
            <p className="text-3xl font-bold text-gray-900">{stats.featured}</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {/* Filter Bar */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="space-y-4">
            {/* Search Row */}
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by title, code, or area..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            {/* Filters Row */}
            <div className="grid grid-cols-6 gap-3">
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value as any);
                  setCurrentPage(1);
                }}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
              >
                <option value="all">All Status</option>
                <option value="draft">Draft</option>
                <option value="pending">Pending</option>
                <option value="published">Published</option>
                <option value="hidden">Hidden</option>
                <option value="rejected">Rejected</option>
                <option value="expired">Expired</option>
                <option value="sold">Sold</option>
                <option value="rented">Rented</option>
                <option value="archived">Archived</option>
              </select>

              <select
                value={propertyTypeFilter}
                onChange={(e) => {
                  setPropertyTypeFilter(e.target.value as any);
                  setCurrentPage(1);
                }}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
              >
                <option value="all">All Types</option>
                <option value="house">House</option>
                <option value="land">Land</option>
                <option value="apartment">Apartment</option>
                <option value="commercial">Commercial</option>
                <option value="villa">Villa</option>
              </select>

              <select
                value={intentFilter}
                onChange={(e) => {
                  setIntentFilter(e.target.value as any);
                  setCurrentPage(1);
                }}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
              >
                <option value="all">All Intent</option>
                <option value="sell">Sell</option>
                <option value="rent">Rent</option>
                <option value="short_rent">Short stay</option>
              </select>

              <select
                value={areaFilter}
                onChange={(e) => {
                  setAreaFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
              >
                <option value="all">All Areas</option>
                {uniqueAreas.map((area) => (
                  <option key={area} value={area}>
                    {area}
                  </option>
                ))}
              </select>

              <label className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition">
                <input
                  type="checkbox"
                  checked={verifiedOnly}
                  onChange={(e) => {
                    setVerifiedOnly(e.target.checked);
                    setCurrentPage(1);
                  }}
                  className="w-4 h-4 rounded border-gray-300"
                />
                <span className="text-sm font-medium text-gray-700">
                  Verified
                </span>
              </label>

              <label className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition">
                <input
                  type="checkbox"
                  checked={featuredOnly}
                  onChange={(e) => {
                    setFeaturedOnly(e.target.checked);
                    setCurrentPage(1);
                  }}
                  className="w-4 h-4 rounded border-gray-300"
                />
                <span className="text-sm font-medium text-gray-700">
                  Featured
                </span>
              </label>
            </div>

            {/* Clear button */}
            {(searchQuery ||
              statusFilter !== 'all' ||
              propertyTypeFilter !== 'all' ||
              intentFilter !== 'all' ||
              areaFilter !== 'all' ||
              verifiedOnly ||
              featuredOnly) && (
              <button
                onClick={clearFilters}
                className="text-sm text-teal-600 hover:text-teal-700 font-medium flex items-center gap-1"
              >
                <X className="w-4 h-4" />
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* View Toggle & Bulk Actions */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 bg-white rounded-lg border border-gray-200 p-1">
            <button
              onClick={() => setViewMode('table')}
              className={`px-4 py-2 rounded flex items-center gap-2 font-medium transition ${
                viewMode === 'table'
                  ? 'bg-teal-600 text-white'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <LayoutList className="w-4 h-4" />
              Table
            </button>
            <button
              onClick={() => setViewMode('card')}
              className={`px-4 py-2 rounded flex items-center gap-2 font-medium transition ${
                viewMode === 'card'
                  ? 'bg-teal-600 text-white'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              Card
            </button>
          </div>

          {/* Bulk Actions */}
          {selectedIds.size > 0 && (
            <div className="flex items-center gap-3 bg-teal-50 px-4 py-3 rounded-lg border border-teal-200">
              <span className="text-sm font-medium text-gray-900">
                {selectedIds.size} selected
              </span>
              <div className="h-6 border-l border-teal-200"></div>
              <button
                onClick={handleBulkApprove}
                className="px-3 py-1 text-xs font-medium text-teal-600 hover:bg-teal-100 rounded transition"
              >
                Approve
              </button>
              <button
                onClick={handleBulkReject}
                className="px-3 py-1 text-xs font-medium text-teal-600 hover:bg-teal-100 rounded transition"
              >
                Reject
              </button>
              <button
                onClick={handleBulkFeature}
                className="px-3 py-1 text-xs font-medium text-teal-600 hover:bg-teal-100 rounded transition"
              >
                Feature
              </button>
              <button
                onClick={handleBulkArchive}
                className="px-3 py-1 text-xs font-medium text-teal-600 hover:bg-teal-100 rounded transition"
              >
                Archive
              </button>
              <button
                onClick={handleBulkDelete}
                className="px-3 py-1 text-xs font-medium text-red-600 hover:bg-red-100 rounded transition"
              >
                Delete
              </button>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {viewMode === 'table' ? <TableView /> : <CardView />}
        </div>

        {/* Pagination */}
        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing{' '}
            <span className="font-medium">
              {paginatedListings.length === 0
                ? 0
                : (currentPage - 1) * itemsPerPage + 1}
            </span>{' '}
            to{' '}
            <span className="font-medium">
              {Math.min(currentPage * itemsPerPage, filteredListings.length)}
            </span>{' '}
            of <span className="font-medium">{filteredListings.length}</span>{' '}
            listings
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .slice(
                Math.max(0, currentPage - 2),
                Math.min(totalPages, currentPage + 1)
              )
              .map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-2 rounded-lg font-medium transition ${
                    currentPage === page
                      ? 'bg-teal-600 text-white'
                      : 'border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
            <button
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
              className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      <ListingViewModal
        listing={viewingListing}
        isOpen={!!viewingListing}
        onClose={() => setViewingListing(null)}
        onEdit={setEditingListing}
      />
      <ListingDetailModal
        listing={editingListing}
        isOpen={!!editingListing}
        onClose={() => setEditingListing(null)}
        onSave={handleSaveListing}
      />
    </div>
  );
}
