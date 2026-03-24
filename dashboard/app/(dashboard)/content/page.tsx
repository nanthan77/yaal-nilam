'use client';

import { useState } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  Search,
  Calendar,
  User,
  Eye as EyeIcon,
  BarChart3,
} from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  category: string;
  status: 'published' | 'draft' | 'archived';
  author: string;
  views: number;
  created_at: string;
  updated_at: string;
}

interface Page {
  id: string;
  title: string;
  slug: string;
  status: 'published' | 'draft';
  updated_at: string;
  seo_title?: string;
  seo_description?: string;
}

const mockBlogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Property Investment Guide 2024',
    category: 'Guides',
    status: 'published',
    author: 'Ravi Kumar',
    views: 1245,
    created_at: '2024-01-15',
    updated_at: '2024-03-20',
  },
  {
    id: '2',
    title: 'Jaffna Real Estate Market Trends',
    category: 'Market Analysis',
    status: 'published',
    author: 'Priya Singh',
    views: 892,
    created_at: '2024-02-10',
    updated_at: '2024-03-18',
  },
];

const mockPages: Page[] = [
  {
    id: '1',
    title: 'Home',
    slug: 'home',
    status: 'published',
    updated_at: '2024-03-20',
    seo_title: 'Yaal Nilam - Property Management & Real Estate',
    seo_description: 'Leading property management platform in Jaffna',
  },
  {
    id: '2',
    title: 'About Us',
    slug: 'about',
    status: 'published',
    updated_at: '2024-03-15',
  },
];

export default function ContentPage() {
  const [activeTab, setActiveTab] = useState<'pages' | 'blog' | 'sections' | 'blocks'>('pages');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredBlogPosts = mockBlogPosts.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-navy-900 mb-2">Content Management</h1>
        <p className="text-slate-600">Manage pages, blog posts, and website content</p>
      </div>

      {/* Content Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <p className="text-slate-600 text-sm font-medium mb-1">Total Pages</p>
          <p className="text-3xl font-bold text-navy-900">24</p>
          <p className="text-xs text-slate-500 mt-2">Website pages</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <p className="text-slate-600 text-sm font-medium mb-1">Blog Posts</p>
          <p className="text-3xl font-bold text-teal-600">42</p>
          <p className="text-xs text-slate-500 mt-2">Published & draft</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <p className="text-slate-600 text-sm font-medium mb-1">Total Views</p>
          <p className="text-3xl font-bold text-blue-600">12.5K</p>
          <p className="text-xs text-slate-500 mt-2">This month</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <p className="text-slate-600 text-sm font-medium mb-1">Drafts</p>
          <p className="text-3xl font-bold text-orange-600">8</p>
          <p className="text-xs text-slate-500 mt-2">Awaiting review</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-6">
        <div className="flex border-b border-slate-200">
          {(['pages', 'blog', 'sections', 'blocks'] as const).map((tab) => (
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
                : tab === 'blog'
                ? 'Blog Posts'
                : tab === 'sections'
                ? 'Homepage Sections'
                : 'Static Blocks'}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* Search and Actions */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder={`Search ${activeTab === 'blog' ? 'blog posts' : 'pages'}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            {activeTab === 'blog' && (
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="all">All Categories</option>
                <option value="Guides">Guides</option>
                <option value="Market Analysis">Market Analysis</option>
                <option value="News">News</option>
              </select>
            )}
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition font-medium"
            >
              <Plus className="w-4 h-4" />
              Add {activeTab === 'blog' ? 'Post' : 'Item'}
            </button>
          </div>

          {/* Pages Tab */}
          {activeTab === 'pages' && (
            <div className="space-y-3">
              {mockPages.map((page) => (
                <div
                  key={page.id}
                  className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900">{page.title}</h3>
                      <div className="flex items-center gap-4 mt-2 text-sm text-slate-600">
                        <span>/{page.slug}</span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            page.status === 'published'
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-orange-50 text-orange-700'
                          }`}
                        >
                          {page.status === 'published' ? 'Published' : 'Draft'}
                        </span>
                        <span>Updated {new Date(page.updated_at).toLocaleDateString()}</span>
                      </div>
                      {page.seo_title && (
                        <div className="mt-2 text-sm bg-slate-50 p-2 rounded border border-slate-200">
                          <p className="text-slate-600">SEO: {page.seo_title}</p>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button className="text-teal-600 hover:bg-teal-50 p-2 rounded transition">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-slate-600 hover:bg-slate-200 p-2 rounded transition">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="text-red-600 hover:bg-red-50 p-2 rounded transition">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Blog Posts Tab */}
          {activeTab === 'blog' && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="px-4 py-3 text-left font-semibold text-slate-900">Title</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-900">Category</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-900">Author</th>
                    <th className="px-4 py-3 text-center font-semibold text-slate-900">Views</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-900">Status</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-900">Updated</th>
                    <th className="px-4 py-3 text-center font-semibold text-slate-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBlogPosts.map((post) => (
                    <tr key={post.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="px-4 py-3 font-medium text-slate-900">{post.title}</td>
                      <td className="px-4 py-3 text-slate-600">
                        <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium">
                          {post.category}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {post.author}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-1 text-blue-600">
                          <EyeIcon className="w-3 h-3" />
                          {post.views}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            post.status === 'published'
                              ? 'bg-emerald-50 text-emerald-700'
                              : post.status === 'draft'
                              ? 'bg-orange-50 text-orange-700'
                              : 'bg-gray-50 text-gray-700'
                          }`}
                        >
                          {post.status === 'published'
                            ? 'Published'
                            : post.status === 'draft'
                            ? 'Draft'
                            : 'Archived'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-600 text-sm">
                        {new Date(post.updated_at).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex justify-center gap-2">
                          <button className="text-teal-600 hover:bg-teal-50 p-2 rounded transition">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="text-slate-600 hover:bg-slate-200 p-2 rounded transition">
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
          )}

          {/* Homepage Sections Tab */}
          {activeTab === 'sections' && (
            <div className="text-center py-12">
              <p className="text-slate-600 mb-4">No homepage sections configured</p>
              <button className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg font-medium transition">
                Add Section
              </button>
            </div>
          )}

          {/* Static Blocks Tab */}
          {activeTab === 'blocks' && (
            <div className="text-center py-12">
              <p className="text-slate-600 mb-4">No static blocks configured</p>
              <button className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg font-medium transition">
                Add Block
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full">
            <div className="border-b border-slate-200 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900">
                Add New {activeTab === 'blog' ? 'Blog Post' : 'Page'}
              </h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-500 hover:text-slate-700 font-bold text-xl"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  placeholder="Enter title"
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              {activeTab === 'blog' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-900 mb-1">
                      Category
                    </label>
                    <select className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500">
                      <option>Select category</option>
                      <option>Guides</option>
                      <option>Market Analysis</option>
                      <option>News</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-900 mb-1">
                      Content
                    </label>
                    <textarea
                      placeholder="Enter blog post content"
                      rows={6}
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-900 mb-1">
                  SEO Title
                </label>
                <input
                  type="text"
                  placeholder="SEO title (60 characters)"
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-900 mb-1">
                  SEO Description
                </label>
                <textarea
                  placeholder="SEO description (160 characters)"
                  rows={3}
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
                <button className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-2 rounded-lg transition">
                  Save as Draft
                </button>
                <button className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 rounded-lg transition">
                  Publish
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
