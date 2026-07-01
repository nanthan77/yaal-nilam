// @ts-nocheck
'use client';

import { useState, useEffect } from 'react';
import {
  Plus,
  Edit2,
  Eye,
  Star,
  MapPin,
  TrendingUp,
  MessageSquare,
  Image as ImageIcon,
  Map,
  Search,
} from 'lucide-react';
import { createArea, getAreas, updateArea } from '@/lib/firestore';

export default function AreasPage() {
  const [allAreas, setAllAreas] = useState<any[]>([]);
  const [areasError, setAreasError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArea, setSelectedArea] = useState<any | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function load() {
      try {
        const data = await getAreas();
        setAllAreas(data || []);
      } catch (e: any) {
        const msg = e?.message || '';
        if (msg.toLowerCase().includes('permission') || msg.includes('PERMISSION_DENIED')) {
          setAreasError('Permission denied — your account lacks an admin role');
        } else {
          setAreasError('Failed to load areas.');
        }
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filteredAreas = allAreas.filter(
    (area) =>
      area.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (area.name_ta || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (area.district || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getColorForArea = (index: number) => {
    const colors = [
      'bg-gradient-to-br from-teal-400 to-teal-600',
      'bg-gradient-to-br from-blue-400 to-blue-600',
      'bg-gradient-to-br from-indigo-400 to-indigo-600',
      'bg-gradient-to-br from-purple-400 to-purple-600',
      'bg-gradient-to-br from-amber-400 to-amber-600',
      'bg-gradient-to-br from-orange-400 to-orange-600',
      'bg-gradient-to-br from-rose-400 to-rose-600',
      'bg-gradient-to-br from-cyan-400 to-cyan-600',
    ];
    return colors[index % colors.length];
  };

  const handleViewArea = (area: any) => {
    setSelectedArea(area);
    setShowDetailModal(true);
  };

  const showMessage = (text: string) => {
    setMessage(text);
    window.setTimeout(() => setMessage(''), 3500);
  };

  const handleToggleFeatured = async (area: any) => {
    const featured = !area.featured;
    setAllAreas((current) => current.map((item) => (item.id === area.id ? { ...item, featured } : item)));
    const ok = await updateArea(area.id, { featured, updated_at: new Date().toISOString() });
    showMessage(ok ? 'Area updated.' : 'Could not update area.');
  };

  const handleCreateArea = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const payload = {
      name: String(form.get('name') || ''),
      name_ta: String(form.get('name_ta') || ''),
      slug: String(form.get('slug') || ''),
      district: String(form.get('district') || 'Jaffna'),
      description: String(form.get('description') || ''),
      lat: String(form.get('lat') || ''),
      lng: String(form.get('lng') || ''),
      seo_title: String(form.get('seo_title') || ''),
      seo_description: String(form.get('seo_description') || ''),
      keywords: String(form.get('keywords') || ''),
      nearby_landmarks: String(form.get('nearby_landmarks') || ''),
      status: form.get('status') ? 'active' : 'inactive',
      featured: Boolean(form.get('featured')),
    };

    if (!payload.name || !payload.slug) {
      showMessage('Area name and slug are required.');
      return;
    }

    const newId = await createArea(payload);
    if (newId) {
      setAllAreas((current) => [{ ...payload, id: newId, listings_count: 0, monthly_views: 0 }, ...current]);
      setShowAddModal(false);
      showMessage('Area created.');
    } else {
      showMessage('Could not create area. Check admin access.');
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-navy-900 mb-2">
          Area Management
        </h1>
        <p className="text-slate-600">
          Manage Jaffna Peninsula areas for local SEO
        </p>
      </div>
      {areasError && (
        <div className="mb-6 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700" role="alert">
          {areasError}
        </div>
      )}
      {message && (
        <div className="mb-6 rounded-lg border border-teal-200 bg-teal-50 px-4 py-3 text-sm font-semibold text-teal-800" role="status">
          {message}
        </div>
      )}

      {/* Filters and Actions */}
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-6 border border-slate-200">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search areas by name or district..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
          >
            <Plus className="w-4 h-4" />
            Add Area
          </button>
        </div>
      </div>
      {/* Loading State */}
      {loading && (
        <div className="grid grid-cols-3 gap-6">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="h-40 bg-slate-200 animate-pulse" />
              <div className="p-6 space-y-3">
                <div className="h-5 bg-slate-200 rounded animate-pulse w-3/4" />
                <div className="h-4 bg-slate-200 rounded animate-pulse w-1/2" />
                <div className="grid grid-cols-2 gap-3">
                  <div className="h-16 bg-slate-100 rounded-lg animate-pulse" />
                  <div className="h-16 bg-slate-100 rounded-lg animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && !areasError && allAreas.length === 0 && (
        <div className="py-16 text-center">
          <MapPin className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-600 font-medium text-lg">No areas yet</p>
          <p className="text-slate-400 text-sm mt-2">Add areas of the Jaffna Peninsula to help buyers find properties by location.</p>
        </div>
      )}

      {/* Areas Grid */}
      {!loading && (
      <div className="grid grid-cols-3 gap-6">
        {filteredAreas.map((area, index) => (
          <div
            key={area.id}
            className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition group"
          >
            {/* Area Image */}
            <div
              className={`relative h-40 ${getColorForArea(index)} flex items-center justify-center text-white font-bold text-2xl`}
            >
              <MapPin className="w-8 h-8 absolute top-3 right-3 opacity-60" />
              <span className="text-center px-4">{area.name}</span>
            </div>
            {/* Area Content */}
            <div className="p-6">
              {/* Name and Tamil */}
              <div className="mb-4">
                <h3 className="font-bold text-slate-900 text-lg">{area.name}</h3>
                {area.name_ta && (
                  <p className="text-slate-600 text-sm">{area.name_ta}</p>
                )}
                <p className="text-xs text-slate-500 mt-1">{area.district}</p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-slate-50 rounded-lg p-3">
                  <p className="text-xs text-slate-500">Listings</p>
                  <p className="font-bold text-slate-900">
                    {area.listings_count || 0}
                  </p>
                </div>
                <div className="bg-slate-50 rounded-lg p-3">
                  <p className="text-xs text-slate-500">Views (Mo)</p>
                  <p className="font-bold text-slate-900">
                    {area.monthly_views || 0}
                  </p>
                </div>
              </div>
              {/* Featured Toggle */}
              <button
                onClick={() => handleToggleFeatured(area)}
                className="w-full flex items-center justify-center gap-2 mb-4 text-amber-600 hover:bg-amber-50 py-2 rounded-lg transition border border-amber-100"
              >
                <Star className={`w-4 h-4 ${area.featured ? 'fill-amber-600' : ''}`} />
                <span className="text-sm font-medium">
                  {area.featured ? 'Featured' : 'Add to Featured'}
                </span>
              </button>

              {/* Status Badge */}
              <div className="mb-4">
                <span
                  className={`text-xs font-medium px-3 py-1 rounded-full border ${
                    area.status === 'active'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  {area.status === 'active' ? 'Active' : 'Inactive'}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleViewArea(area)}
                  className="flex-1 flex items-center justify-center gap-2 text-sm font-medium text-teal-600 hover:bg-teal-50 py-2 rounded-lg transition"
                >
                  <Eye className="w-4 h-4" />
                  View
                </button>
                <button
                  onClick={() => handleViewArea(area)}
                  className="flex-1 flex items-center justify-center gap-2 text-sm font-medium text-slate-600 hover:bg-slate-50 py-2 rounded-lg transition"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      )}
      {/* Area Detail Modal */}
      {showDetailModal && selectedArea && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900">
                Area: {selectedArea.name}
              </h2>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-slate-500 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Basic Info */}
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-4">
                  Basic Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-600">Area Name (English)</p>
                    <p className="font-medium text-slate-900">{selectedArea.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Area Name (Tamil)</p>
                    <p className="font-medium text-slate-900">{selectedArea.name_ta || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Slug</p>
                    <p className="font-medium text-slate-900">{selectedArea.slug}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">District</p>
                    <p className="font-medium text-slate-900">{selectedArea.district}</p>
                  </div>
                </div>
              </div>
              {/* Description */}
              {selectedArea.description && (
                <div className="border-t border-slate-200 pt-6">
                  <h3 className="text-lg font-bold text-slate-900 mb-3">Description</h3>
                  <p className="text-slate-700 text-sm">{selectedArea.description}</p>
                </div>
              )}

              {/* Statistics */}
              <div className="border-t border-slate-200 pt-6">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Area Statistics</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-4 h-4 text-slate-500" />
                      <p className="text-sm text-slate-600">Listings</p>
                    </div>
                    <p className="text-2xl font-bold text-slate-900">{selectedArea.listings_count || 0}</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-4 h-4 text-teal-600" />
                      <p className="text-sm text-slate-600">Views (Mo)</p>
                    </div>
                    <p className="text-2xl font-bold text-teal-600">{selectedArea.monthly_views || 0}</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <MessageSquare className="w-4 h-4 text-orange-600" />
                      <p className="text-sm text-slate-600">Inquiries</p>
                    </div>
                    <p className="text-2xl font-bold text-orange-600">{selectedArea.inquiries || 0}</p>
                  </div>
                </div>
              </div>

              {/* SEO Settings */}
              <div className="border-t border-slate-200 pt-6">
                <h3 className="text-lg font-bold text-slate-900 mb-4">SEO Settings</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-slate-600">Meta Title</p>
                    <p className="font-medium text-slate-900">{selectedArea.meta_title || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Meta Description</p>
                    <p className="font-medium text-slate-900">{selectedArea.meta_description || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Keywords</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedArea.keywords ? (
                        selectedArea.keywords.split(',').map((keyword, idx) => (
                          <span key={idx} className="text-xs bg-teal-50 text-teal-700 px-2 py-1 rounded border border-teal-200">
                            {keyword.trim()}
                          </span>
                        ))
                      ) : (
                        <span className="text-slate-500 text-sm">-</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Location */}
              {selectedArea.latitude && selectedArea.longitude && (
                <div className="border-t border-slate-200 pt-6">
                  <h3 className="text-lg font-bold text-slate-900 mb-4">Location Coordinates</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-slate-600">Latitude</p>
                      <p className="font-medium text-slate-900">{selectedArea.latitude}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Longitude</p>
                      <p className="font-medium text-slate-900">{selectedArea.longitude}</p>
                    </div>
                  </div>
                </div>
              )}
              {/* Nearby Landmarks */}
              {selectedArea.nearby_landmarks && (
                <div className="border-t border-slate-200 pt-6">
                  <h3 className="text-lg font-bold text-slate-900 mb-3">Nearby Landmarks</h3>
                  <p className="text-slate-700 text-sm">{selectedArea.nearby_landmarks}</p>
                </div>
              )}

              {/* Status and Featured */}
              <div className="border-t border-slate-200 pt-6">
                <h3 className="text-lg font-bold text-slate-900 mb-3">Publishing</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-slate-900">Status</p>
                      <p className="text-xs text-slate-500">Control visibility of this area</p>
                    </div>
                    <span className={`text-xs font-medium px-3 py-1 rounded-full border ${
                      selectedArea.status === 'active'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-slate-100 text-slate-700 border-slate-300'
                    }`}>
                      {selectedArea.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-slate-900">Featured</p>
                      <p className="text-xs text-slate-500">Show on featured section</p>
                    </div>
                    <Star className={`w-5 h-5 ${selectedArea.featured ? 'fill-amber-600 text-amber-600' : 'text-slate-400'}`} />
                  </div>
                </div>
              </div>
              {/* Action Buttons */}
              <div className="border-t border-slate-200 pt-6 flex gap-3">
                <button className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 rounded-lg transition flex items-center justify-center gap-2">
                  <Edit2 className="w-4 h-4" />
                  Edit Area
                </button>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-2 rounded-lg transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Area Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900">Add New Area</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-500 hover:text-slate-700"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleCreateArea} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-1">Area Name (English)</label>
                <input name="name" type="text" placeholder="e.g., Nallur" className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-1">Area Name (Tamil)</label>
                <input name="name_ta" type="text" placeholder="தமிழ் பெயர்" className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-1">Slug</label>
                <input name="slug" type="text" placeholder="nallur" className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-1">District</label>
                <select name="district" defaultValue="Jaffna" className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500">
                  <option value="Jaffna">Jaffna</option>
                  <option>Mullaitivu</option>
                  <option>Vavuniya</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-1">Description</label>
                <textarea name="description" placeholder="Describe the area..." rows={3} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-1">Hero Image</label>
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:bg-slate-50 transition">
                  <ImageIcon className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm text-slate-600">Drag and drop or click to upload</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-1">Latitude</label>
                  <input name="lat" type="text" placeholder="6.9271" className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-1">Longitude</label>
                  <input name="lng" type="text" placeholder="80.7744" className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-1">SEO Meta Title</label>
                <input name="seo_title" type="text" placeholder="Nallur Properties for Sale" className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-1">SEO Meta Description</label>
                <textarea name="seo_description" placeholder="Meta description for search engines..." rows={2} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-1">Keywords</label>
                <input name="keywords" type="text" placeholder="Comma separated keywords" className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-1">Nearby Landmarks</label>
                <textarea name="nearby_landmarks" placeholder="List nearby landmarks and attractions..." rows={2} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"></textarea>
              </div>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input name="status" type="checkbox" defaultChecked className="w-4 h-4 rounded border-slate-300" />
                  <span className="text-sm text-slate-700">Active Status</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input name="featured" type="checkbox" className="w-4 h-4 rounded border-slate-300" />
                  <span className="text-sm text-slate-700">Featured</span>
                </label>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-2 rounded-lg transition">
                  Cancel
                </button>
                <button type="submit" className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 rounded-lg transition">
                  Create Area
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
