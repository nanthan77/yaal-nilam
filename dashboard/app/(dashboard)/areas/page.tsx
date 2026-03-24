'use client';

import { useState } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Star,
  Search,
  MapPin,
  Home,
  Settings,
} from 'lucide-react';

interface Area {
  id: string;
  name: string;
  name_ta: string;
  slug: string;
  district: string;
  listings_count: number;
  featured: boolean;
  seo_title?: string;
  seo_description?: string;
  color_gradient?: string;
}

const mockAreas: Area[] = [
  {
    id: '1',
    name: 'Jaffna Town',
    name_ta: 'யாழ்ப்பாணம்',
    slug: 'jaffna-town',
    district: 'Jaffna',
    listings_count: 148,
    featured: true,
    color_gradient: 'from-teal-500 to-cyan-500',
  },
  {
    id: '2',
    name: 'Nallur',
    name_ta: 'நல்லூர்',
    slug: 'nallur',
    district: 'Jaffna',
    listings_count: 92,
    featured: true,
    color_gradient: 'from-blue-500 to-indigo-500',
  },
  {
    id: '3',
    name: 'Kopay',
    name_ta: 'கோப்பை',
    slug: 'kopay',
    district: 'Jaffna',
    listings_count: 56,
    featured: false,
    color_gradient: 'from-purple-500 to-pink-500',
  },
  {
    id: '4',
    name: 'Point Pedro',
    name_ta: 'பொன்னாலை',
    slug: 'point-pedro',
    district: 'Jaffna',
    listings_count: 64,
    featured: false,
    color_gradient: 'from-orange-500 to-red-500',
  },
];

export default function AreasPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [areas, setAreas] = useState<Area[]>(mockAreas);
  const [newArea, setNewArea] = useState({
    name: '',
    name_ta: '',
    slug: '',
    district: 'Jaffna',
    seo_title: '',
    seo_description: '',
  });

  const filteredAreas = areas.filter((area) =>
    area.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    area.name_ta.includes(searchTerm)
  );

  const toggleFeatured = (id: string) => {
    setAreas(
      areas.map((area) =>
        area.id === id ? { ...area, featured: !area.featured } : area
      )
    );
  };

  const handleAddArea = () => {
    if (newArea.name && newArea.slug) {
      setShowAddModal(false);
      setNewArea({
        name: '',
        name_ta: '',
        slug: '',
        district: 'Jaffna',
        seo_title: '',
        seo_description: '',
      });
    }
  };

  const colors = [
    'from-teal-500 to-cyan-500',
    'from-blue-500 to-indigo-500',
    'from-purple-500 to-pink-500',
    'from-orange-500 to-red-500',
    'from-green-500 to-emerald-500',
    'from-rose-500 to-pink-500',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-navy-900 mb-2">Area Management</h1>
        <p className="text-slate-600">Manage property areas and locations</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <p className="text-slate-600 text-sm font-medium mb-1">Total Areas</p>
          <p className="text-3xl font-bold text-navy-900">{areas.length}</p>
          <p className="text-xs text-slate-500 mt-2">Active areas</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <p className="text-slate-600 text-sm font-medium mb-1">Featured</p>
          <p className="text-3xl font-bold text-amber-600">
            {areas.filter((a) => a.featured).length}
          </p>
          <p className="text-xs text-slate-500 mt-2">Featured areas</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <p className="text-slate-600 text-sm font-medium mb-1">Total Listings</p>
          <p className="text-3xl font-bold text-emerald-600">
            {areas.reduce((sum, a) => sum + a.listings_count, 0)}
          </p>
          <p className="text-xs text-slate-500 mt-2">Across all areas</p>
        </div>
      </div>

      {/* Search and Actions */}
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-6 border border-gray-100 flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search areas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition font-medium"
        >
          <Plus className="w-4 h-4" />
          Add Area
        </button>
      </div>

      {/* Area Cards Grid */}
      <div className="grid grid-cols-4 gap-6">
        {filteredAreas.map((area) => (
          <div
            key={area.id}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition group"
          >
            {/* Gradient Header */}
            <div className={`h-24 bg-gradient-to-r ${area.color_gradient || 'from-teal-500 to-cyan-500'}`} />

            {/* Content */}
            <div className="p-6">
              {/* Title and Featured */}
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-slate-900">{area.name}</h3>
                  <p className="text-sm text-slate-600">{area.name_ta}</p>
                </div>
                <button
                  onClick={() => toggleFeatured(area.id)}
                  className={`p-2 rounded-lg transition ${
                    area.featured
                      ? 'bg-amber-100 text-amber-600'
                      : 'bg-gray-100 text-gray-400'
                  }`}
                  title={area.featured ? 'Remove from featured' : 'Add to featured'}
                >
                  <Star className="w-4 h-4 fill-current" />
                </button>
              </div>

              {/* Slug */}
              <p className="text-xs text-slate-500 mb-4">/{area.slug}</p>

              {/* Stats */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2">
                  <Home className="w-4 h-4 text-slate-400" />
                  <span className="text-sm text-slate-600">
                    <span className="font-bold text-slate-900">{area.listings_count}</span> listings
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  <span className="text-sm text-slate-600">{area.district} District</span>
                </div>
              </div>

              {/* Actions */}
              <div className="border-t border-slate-200 pt-4 flex gap-2">
                <button className="flex-1 text-teal-600 hover:bg-teal-50 py-2 rounded transition font-medium text-sm flex items-center justify-center gap-1">
                  <Settings className="w-4 h-4" />
                  SEO
                </button>
                <button className="flex-1 text-slate-600 hover:bg-slate-100 py-2 rounded transition font-medium text-sm">
                  <Edit2 className="w-4 h-4 mx-auto" />
                </button>
                <button className="flex-1 text-red-600 hover:bg-red-50 py-2 rounded transition font-medium text-sm">
                  <Trash2 className="w-4 h-4 mx-auto" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Area Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="border-b border-slate-200 p-6 flex items-center justify-between sticky top-0 bg-white">
              <h2 className="text-2xl font-bold text-slate-900">Add New Area</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-500 hover:text-slate-700 font-bold text-xl"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-1">
                    Area Name (English)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Jaffna Town"
                    value={newArea.name}
                    onChange={(e) => setNewArea({ ...newArea, name: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-1">
                    Area Name (Tamil)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., யாழ்ப்பாணம்"
                    value={newArea.name_ta}
                    onChange={(e) => setNewArea({ ...newArea, name_ta: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-900 mb-1">
                  URL Slug
                </label>
                <input
                  type="text"
                  placeholder="jaffna-town"
                  value={newArea.slug}
                  onChange={(e) => setNewArea({ ...newArea, slug: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-900 mb-1">
                  District
                </label>
                <select
                  value={newArea.district}
                  onChange={(e) => setNewArea({ ...newArea, district: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option>Jaffna</option>
                  <option>Mullaitivu</option>
                  <option>Batticaloa</option>
                </select>
              </div>

              <div className="border-t border-slate-200 pt-4">
                <h3 className="text-lg font-bold text-slate-900 mb-4">SEO Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-900 mb-1">
                      SEO Title (60 chars)
                    </label>
                    <input
                      type="text"
                      placeholder="Jaffna Town Properties | Buy & Rent"
                      value={newArea.seo_title}
                      onChange={(e) => setNewArea({ ...newArea, seo_title: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-900 mb-1">
                      SEO Description (160 chars)
                    </label>
                    <textarea
                      placeholder="Discover premium properties in Jaffna Town. Browse apartments, houses, and commercial spaces."
                      value={newArea.seo_description}
                      onChange={(e) => setNewArea({ ...newArea, seo_description: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-4 flex gap-3">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-2 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddArea}
                  className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 rounded-lg transition"
                >
                  Add Area
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
