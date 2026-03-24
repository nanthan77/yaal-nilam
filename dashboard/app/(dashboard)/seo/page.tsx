'use client';

import { useState } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  Activity,
  Link as LinkIcon,
  Globe,
  Code,
  TrendingUp,
} from 'lucide-react';

interface SEOPage {
  id: string;
  title: string;
  url: string;
  seo_score: number;
  status: 'good' | 'needs_improvement' | 'poor';
}

interface Redirect {
  id: string;
  from_url: string;
  to_url: string;
  type: '301' | '302';
  created_at: string;
}

const mockSEOPages: SEOPage[] = [
  {
    id: '1',
    title: 'Home',
    url: '/',
    seo_score: 92,
    status: 'good',
  },
  {
    id: '2',
    title: 'Properties in Jaffna',
    url: '/properties/jaffna',
    seo_score: 78,
    status: 'needs_improvement',
  },
  {
    id: '3',
    title: 'About Us',
    url: '/about',
    seo_score: 65,
    status: 'needs_improvement',
  },
];

const mockRedirects: Redirect[] = [
  {
    id: '1',
    from_url: '/old-listings',
    to_url: '/properties',
    type: '301',
    created_at: '2024-01-15',
  },
  {
    id: '2',
    from_url: '/blog/2023',
    to_url: '/blog',
    type: '301',
    created_at: '2024-02-10',
  },
];

const getSEOStatusColor = (score: number) => {
  if (score >= 80) return 'text-emerald-600';
  if (score >= 60) return 'text-orange-600';
  return 'text-red-600';
};

const getSEOStatusBg = (score: number) => {
  if (score >= 80) return 'bg-emerald-50';
  if (score >= 60) return 'bg-orange-50';
  return 'bg-red-50';
};

export default function SEOPage() {
  const [activeTab, setActiveTab] = useState<'pages' | 'redirects' | 'sitemap' | 'schema'>('pages');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddRedirectModal, setShowAddRedirectModal] = useState(false);
  const [newRedirect, setNewRedirect] = useState({
    from_url: '',
    to_url: '',
    type: '301' as '301' | '302',
  });

  const filteredPages = mockSEOPages.filter((page) =>
    page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    page.url.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredRedirects = mockRedirects.filter((redirect) =>
    redirect.from_url.toLowerCase().includes(searchTerm.toLowerCase()) ||
    redirect.to_url.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddRedirect = () => {
    if (newRedirect.from_url && newRedirect.to_url) {
      setShowAddRedirectModal(false);
      setNewRedirect({
        from_url: '',
        to_url: '',
        type: '301',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-navy-900 mb-2">SEO Management</h1>
        <p className="text-slate-600">Monitor and optimize your site's search engine performance</p>
      </div>

      {/* Health Score Cards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <p className="text-slate-600 text-sm font-medium">Overall SEO Score</p>
            <TrendingUp className="w-5 h-5 text-teal-600" />
          </div>
          <p className="text-3xl font-bold text-teal-600">82</p>
          <p className="text-xs text-slate-500 mt-2">Good</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <p className="text-slate-600 text-sm font-medium">Pages Indexed</p>
            <Globe className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-3xl font-bold text-blue-600">24</p>
          <p className="text-xs text-slate-500 mt-2">In Google</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <p className="text-slate-600 text-sm font-medium">Broken Links</p>
            <LinkIcon className="w-5 h-5 text-orange-600" />
          </div>
          <p className="text-3xl font-bold text-orange-600">3</p>
          <p className="text-xs text-slate-500 mt-2">To fix</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <p className="text-slate-600 text-sm font-medium">Schema Markup</p>
            <Code className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-3xl font-bold text-purple-600">18</p>
          <p className="text-xs text-slate-500 mt-2">Structured data</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-6">
        <div className="flex border-b border-slate-200">
          {(['pages', 'redirects', 'sitemap', 'schema'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-4 font-medium transition ${
                activeTab === tab
                  ? 'border-b-2 border-teal-600 text-teal-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab === 'pages'
                ? 'Pages'
                : tab === 'redirects'
                ? 'Redirects'
                : tab === 'sitemap'
                ? 'Sitemap'
                : 'Schema Markup'}
            </button>
          ))}
        </div>

        {/* Pages Tab */}
        {activeTab === 'pages' && (
          <div className="p-6">
            <div className="mb-6 relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search pages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div className="space-y-3">
              {filteredPages.map((page) => (
                <div
                  key={page.id}
                  className={`border border-slate-200 rounded-lg p-4 hover:shadow transition ${getSEOStatusBg(page.seo_score)}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-900">{page.title}</h4>
                      <p className="text-sm text-slate-600 mt-1">{page.url}</p>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className={`text-2xl font-bold ${getSEOStatusColor(page.seo_score)}`}>
                          {page.seo_score}
                        </p>
                        <p className="text-xs text-slate-600">SEO Score</p>
                      </div>
                      <div className="flex gap-2">
                        <button className="text-teal-600 hover:bg-teal-100 p-2 rounded transition">
                          <Edit2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Redirects Tab */}
        {activeTab === 'redirects' && (
          <div className="p-6">
            <div className="mb-6 flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search redirects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <button
                onClick={() => setShowAddRedirectModal(true)}
                className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition font-medium"
              >
                <Plus className="w-4 h-4" />
                Add Redirect
              </button>
            </div>

            <div className="space-y-3">
              {filteredRedirects.map((redirect) => (
                <div
                  key={redirect.id}
                  className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-mono text-slate-600">{redirect.from_url}</span>
                        <span className="text-slate-400">→</span>
                        <span className="text-sm font-mono text-slate-900">{redirect.to_url}</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-600">
                        <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded">
                          {redirect.type}
                        </span>
                        <span>
                          Added {new Date(redirect.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <button className="text-red-600 hover:bg-red-50 p-2 rounded transition">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sitemap Tab */}
        {activeTab === 'sitemap' && (
          <div className="p-6 text-center py-12">
            <Globe className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Sitemap</h3>
            <p className="text-slate-600 mb-4">
              Your sitemap is automatically generated and updated
            </p>
            <button className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg font-medium transition">
              View Sitemap
            </button>
          </div>
        )}

        {/* Schema Markup Tab */}
        {activeTab === 'schema' && (
          <div className="p-6 text-center py-12">
            <Code className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Schema Markup</h3>
            <p className="text-slate-600 mb-4">
              Manage structured data for rich snippets
            </p>
            <button className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg font-medium transition">
              Configure Schema
            </button>
          </div>
        )}
      </div>

      {/* Add Redirect Modal */}
      {showAddRedirectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full">
            <div className="border-b border-slate-200 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900">Add Redirect</h2>
              <button
                onClick={() => setShowAddRedirectModal(false)}
                className="text-slate-500 hover:text-slate-700 font-bold text-xl"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-1">
                  From URL
                </label>
                <input
                  type="text"
                  placeholder="/old-page"
                  value={newRedirect.from_url}
                  onChange={(e) => setNewRedirect({ ...newRedirect, from_url: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-900 mb-1">
                  To URL
                </label>
                <input
                  type="text"
                  placeholder="/new-page"
                  value={newRedirect.to_url}
                  onChange={(e) => setNewRedirect({ ...newRedirect, to_url: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-900 mb-1">
                  Redirect Type
                </label>
                <select
                  value={newRedirect.type}
                  onChange={(e) => setNewRedirect({ ...newRedirect, type: e.target.value as '301' | '302' })}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="301">301 (Permanent)</option>
                  <option value="302">302 (Temporary)</option>
                </select>
              </div>

              <div className="border-t border-slate-200 pt-4 flex gap-3">
                <button
                  onClick={() => setShowAddRedirectModal(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-2 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddRedirect}
                  className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 rounded-lg transition"
                >
                  Add Redirect
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
