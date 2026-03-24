// @ts-nocheck
'use client';

import { useState } from 'react';
import {
  Plus,
  Edit2,
  Eye,
  Trash2,
  Clock,
  Globe,
  FileText,
  Image as ImageIcon,
  Search,
} from 'lucide-react';

type TabType = 'pages' | 'blog' | 'homepage' | 'blocks';

interface Page {
  id: string;
  title: string;
  slug: string;
  status: 'published' | 'draft';
  lastUpdated: string;
  updatedBy: string;
}

interface BlogPost {
  id: string;
  title: string;
  category: string;
  author: string;
  status: 'published' | 'draft';
  views: number;
  date: string;
}
interface HomepageSection {
  id: string;
  name: string;
  currentValue: string;
  type: 'text' | 'textarea';
}

interface StaticBlock {
  id: string;
  label: string;
  value: string;
  type: 'text' | 'phone' | 'url';
}

export default function ContentPage() {
  const [activeTab, setActiveTab] = useState<TabType>('pages');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPage, setSelectedPage] = useState<Page | null>(null);
  const [showPageModal, setShowPageModal] = useState(false);
  const [showBlogModal, setShowBlogModal] = useState(false);
  const [showSectionModal, setShowSectionModal] = useState(false);
  const [selectedSection, setSelectedSection] = useState<HomepageSection | null>(
    null
  );

  const pages: Page[] = [
    {
      id: '1',
      title: 'About',
      slug: 'about',
      status: 'published',
      lastUpdated: '2026-03-15',
      updatedBy: 'Nanthan',
    },
    {
      id: '2',
      title: 'Contact',
      slug: 'contact',
      status: 'published',
      lastUpdated: '2026-03-10',
      updatedBy: 'Admin',
    },
    {
      id: '3',
      title: 'FAQ',
      slug: 'faq',
      status: 'draft',
      lastUpdated: '2026-03-12',
      updatedBy: 'Content Manager',
    },
    {
      id: '4',
      title: 'Privacy Policy',
      slug: 'privacy',
      status: 'published',
      lastUpdated: '2026-02-20',
      updatedBy: 'Legal',
    },    {
      id: '5',
      title: 'Terms & Conditions',
      slug: 'terms',
      status: 'published',
      lastUpdated: '2026-02-20',
      updatedBy: 'Legal',
    },
    {
      id: '6',
      title: 'Listing Policy',
      slug: 'listing-policy',
      status: 'published',
      lastUpdated: '2026-03-05',
      updatedBy: 'Nanthan',
    },
    {
      id: '7',
      title: 'Price Guide',
      slug: 'price-guide',
      status: 'published',
      lastUpdated: '2026-02-28',
      updatedBy: 'Content Manager',
    },
    {
      id: '8',
      title: 'Documents Checklist',
      slug: 'documents',
      status: 'draft',
      lastUpdated: '2026-03-18',
      updatedBy: 'Nanthan',
    },
  ];

  const blogPosts: BlogPost[] = [
    {
      id: '1',
      title: 'Top 5 Properties in Jaffna This Month',
      category: 'Market Trends',
      author: 'Content Manager',
      status: 'published',
      views: 1240,
      date: '2026-03-20',
    },
    {
      id: '2',
      title: 'How to Find Your Dream Home in Jaffna',
      category: 'Buying Guide',
      author: 'Nanthan',
      status: 'published',
      views: 856,
      date: '2026-03-15',
    },
    {
      id: '3',
      title: 'Investment Opportunities in Peninsula',
      category: 'Investment',
      author: 'Admin',
      status: 'draft',
      views: 0,
      date: '2026-03-22',
    },
  ];
  const homepageSections: HomepageSection[] = [
    {
      id: 'hero-title',
      name: 'Hero Title',
      currentValue: 'Find Your Perfect Property in Jaffna',
      type: 'text',
    },
    {
      id: 'hero-subtitle',
      name: 'Hero Subtitle',
      currentValue: 'Discover premium properties in the Jaffna Peninsula',
      type: 'text',
    },
    {
      id: 'hero-cta',
      name: 'Hero CTA Button',
      currentValue: 'Browse Listings',
      type: 'text',
    },
    {
      id: 'featured-title',
      name: 'Featured Section Title',
      currentValue: 'Featured Listings',
      type: 'text',
    },
    {
      id: 'trust-title',
      name: 'Trust Section Title',
      currentValue: 'Why Trust Yaal Nilam',
      type: 'text',
    },
    {
      id: 'stats-title',
      name: 'Stats Section Title',
      currentValue: 'Market Statistics',
      type: 'text',
    },
    {
      id: 'cta-banner',
      name: 'CTA Banner Text',
      currentValue: 'Ready to list your property? Join 45+ agents today',
      type: 'textarea',
    },
  ];

  const staticBlocks: StaticBlock[] = [
    {
      id: '1',
      label: 'Footer Copyright Text',
      value: '© 2026 Yaal Nilam. All rights reserved.',
      type: 'text',
    },
    {
      id: '2',
      label: 'Main Phone Number',
      value: '+94 21 222 0055',
      type: 'phone',
    },
    {
      id: '3',
      label: 'WhatsApp Number',
      value: '+94 76 123 4567',
      type: 'phone',
    },
    {
      id: '4',
      label: 'Contact Email',
      value: 'info@yaalnilam.lk',
      type: 'url',
    },
    {
      id: '5',
      label: 'Announcement Bar',
      value: 'New listing: Beautiful house in Nallur - Starting at Rs. 45L',
      type: 'text',
    },
    {
      id: '6',
      label: 'Promo Banner Text',
      value: 'Get 15% commission for agent referrals this month',
      type: 'text',
    },
  ];
  const filteredPages = pages.filter(
    (page) =>
      page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      page.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredBlogs = blogPosts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-navy-900 mb-2">
          Content Management
        </h1>
        <p className="text-slate-600">Manage website content without developers</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-6 border-b border-slate-200">
        {[
          { id: 'pages' as TabType, label: 'Pages' },
          { id: 'blog' as TabType, label: 'Blog' },
          { id: 'homepage' as TabType, label: 'Homepage' },
          { id: 'blocks' as TabType, label: 'Static Blocks' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              setSearchTerm('');
            }}
            className={`pb-3 px-1 font-medium transition ${
              activeTab === tab.id
                ? 'text-navy-900 border-b-2 border-navy-900'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {/* Pages Tab */}
      {activeTab === 'pages' && (
        <div className="space-y-4">
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search pages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <button className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition">
              <Plus className="w-4 h-4" />
              New Page
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                    Title
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                    Slug
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                    Last Updated
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                    By
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredPages.map((page) => (
                  <tr
                    key={page.id}
                    className="border-b border-slate-200 hover:bg-slate-50 transition"
                  >
                    <td className="px-6 py-4">
                      <p className="font-medium text-slate-900">{page.title}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-slate-600 text-sm">/{page.slug}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block text-xs font-medium px-3 py-1 rounded-full border ${
                          page.status === 'published'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}
                      >
                        {page.status === 'published'
                          ? 'Published'
                          : 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-slate-600 text-sm">
                        {new Date(page.lastUpdated).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-slate-600 text-sm">{page.updatedBy}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setSelectedPage(page);
                            setShowPageModal(true);
                          }}
                          className="text-teal-600 hover:bg-teal-50 p-2 rounded transition"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button className="text-slate-600 hover:bg-slate-100 p-2 rounded transition">
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {/* Blog Tab */}
      {activeTab === 'blog' && (
        <div className="space-y-4">
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search blog posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <button
              onClick={() => setShowBlogModal(true)}
              className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
            >
              <Plus className="w-4 h-4" />
              New Post
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                    Title
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                    Category
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                    Author
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                    Views
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredBlogs.map((post) => (
                  <tr
                    key={post.id}
                    className="border-b border-slate-200 hover:bg-slate-50 transition"
                  >
                    <td className="px-6 py-4">
                      <p className="font-medium text-slate-900">{post.title}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-600">
                        {post.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-slate-600 text-sm">{post.author}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block text-xs font-medium px-3 py-1 rounded-full border ${
                          post.status === 'published'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}
                      >
                        {post.status === 'published'
                          ? 'Published'
                          : 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-slate-600 text-sm">{post.views}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-slate-600 text-sm">
                        {new Date(post.date).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button className="text-teal-600 hover:bg-teal-50 p-2 rounded transition">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button className="text-slate-600 hover:bg-slate-100 p-2 rounded transition">
                          <Eye className="w-4 h-4" />
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
      )}
      {/* Homepage Tab */}
      {activeTab === 'homepage' && (
        <div className="grid grid-cols-2 gap-6">
          {homepageSections.map((section) => (
            <div
              key={section.id}
              className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-bold text-slate-900">{section.name}</h3>
                  <p className="text-sm text-slate-500 mt-1">
                    Current value:
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSelectedSection(section);
                    setShowSectionModal(true);
                  }}
                  className="text-teal-600 hover:bg-teal-50 p-2 rounded transition"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>
              <div className="bg-slate-50 rounded-lg p-3 min-h-[60px]">
                <p className="text-sm text-slate-700 break-words">
                  {section.currentValue}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Static Blocks Tab */}
      {activeTab === 'blocks' && (
        <div className="grid grid-cols-2 gap-6">
          {staticBlocks.map((block) => (
            <div
              key={block.id}
              className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition"
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="font-bold text-slate-900">{block.label}</h3>
                <button className="text-teal-600 hover:bg-teal-50 p-2 rounded transition">
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>
              <div className="bg-slate-50 rounded-lg p-3 min-h-[60px]">
                <p className="text-sm text-slate-700 break-words">
                  {block.value}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Page Edit Modal */}
      {showPageModal && selectedPage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full">
            <div className="border-b border-slate-200 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900">
                Edit Page: {selectedPage.title}
              </h2>
              <button
                onClick={() => setShowPageModal(false)}
                className="text-slate-500 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-1">
                  Page Title
                </label>
                <input
                  type="text"
                  defaultValue={selectedPage.title}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-1">
                  Slug
                </label>
                <input
                  type="text"
                  defaultValue={selectedPage.slug}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-1">
                  Page Content
                </label>
                <textarea
                  defaultValue="Page content goes here..."
                  rows={8}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-1">
                  Status
                </label>
                <select defaultValue={selectedPage.status} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500">
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowPageModal(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-2 rounded-lg transition"
                >
                  Cancel
                </button>
                <button className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 rounded-lg transition">
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Blog Post Modal */}
      {showBlogModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 border-b border-slate-200 p-6 bg-white flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900">
                Create Blog Post
              </h2>
              <button
                onClick={() => setShowBlogModal(false)}
                className="text-slate-500 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-1">
                  Post Title
                </label>
                <input
                  type="text"
                  placeholder="Enter post title"
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-1">
                  Slug
                </label>
                <input
                  type="text"
                  placeholder="post-slug"
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-1">
                  Category
                </label>
                <select className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500">
                  <option>Market Trends</option>
                  <option>Buying Guide</option>
                  <option>Investment</option>
                  <option>Local News</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-1">
                  Content
                </label>
                <textarea
                  placeholder="Write your blog post content here..."
                  rows={8}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-1">
                  Featured Image
                </label>
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:bg-slate-50 transition">
                  <ImageIcon className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm text-slate-600">
                    Drag and drop or click to upload
                  </p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-1">
                  Meta Description
                </label>
                <textarea
                  placeholder="SEO meta description (160 characters)"
                  rows={2}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-1">
                  Keywords
                </label>
                <input
                  type="text"
                  placeholder="Comma separated keywords"
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div className="flex items-center gap-4 pt-4">
                <button className="flex items-center gap-2 text-slate-600 hover:bg-slate-50 px-4 py-2 rounded-lg transition">
                  <Clock className="w-4 h-4" />
                  Schedule
                </button>
                <div className="flex-1"></div>
                <button
                  onClick={() => setShowBlogModal(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium px-4 py-2 rounded-lg transition"
                >
                  Cancel
                </button>
                <button className="bg-teal-600 hover:bg-teal-700 text-white font-medium px-4 py-2 rounded-lg transition">
                  Publish
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Homepage Section Modal */}
      {showSectionModal && selectedSection && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full">
            <div className="border-b border-slate-200 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900">
                Edit {selectedSection.name}
              </h2>
              <button
                onClick={() => setShowSectionModal(false)}
                className="text-slate-500 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              {selectedSection.type === 'text' ? (
                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-1">
                    Value
                  </label>
                  <input
                    type="text"
                    defaultValue={selectedSection.currentValue}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-1">
                    Value
                  </label>
                  <textarea
                    defaultValue={selectedSection.currentValue}
                    rows={4}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  ></textarea>
                </div>
              )}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowSectionModal(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-2 rounded-lg transition"
                >
                  Cancel
                </button>
                <button className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 rounded-lg transition">
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}