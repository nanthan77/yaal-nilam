// @ts-nocheck
'use client';

import { useState } from 'react';
import {
  Edit2,
  Plus,
  Trash2,
  AlertCircle,
  CheckCircle,
  LinkIcon,
} from 'lucide-react';

interface PageSEO {
  id: string;
  name: string;
  path: string;
  metaTitle: string;
  metaDescription: string;
  indexed: boolean;
}

interface Redirect {
  id: string;
  from: string;
  to: string;
  status: number;
  created: string;
}

const pagesSEO: PageSEO[] = [
  {
    id: '1',
    name: 'Homepage',
    path: '/',
    metaTitle: 'Jaffna Property Platform - Buy, Rent, Sell Real Estate',
    metaDescription: 'Find properties in Jaffna: buy, rent, or sell apartments, houses, and land with ease.',
    indexed: true,
  },
  {
    id: '2',
    name: 'Buy Properties',
    path: '/buy',
    metaTitle: 'Buy Properties in Jaffna - Homes & Land',
    metaDescription: 'Browse available properties for sale in Jaffna. Find your perfect home today.',
    indexed: true,
  },  {
    id: '3',
    name: 'Rent Properties',
    path: '/rent',
    metaTitle: 'Rent Properties in Jaffna - Apartments & Houses',
    metaDescription: 'Search rental properties in Jaffna. Affordable apartments and houses available.',
    indexed: true,
  },
  {
    id: '4',
    name: 'Sell Property',
    path: '/sell',
    metaTitle: 'Sell Your Property in Jaffna',
    metaDescription: 'List your property for sale on Jaffna Property Platform. Reach thousands of buyers.',
    indexed: false,
  },
  {
    id: '5',
    name: 'Land for Sale',
    path: '/land',
    metaTitle: 'Land for Sale in Jaffna - Plots & Parcels',
    metaDescription: 'Discover available land plots for sale in Jaffna. Perfect for building projects.',
    indexed: true,
  },
];

const redirects: Redirect[] = [
  {
    id: '1',
    from: '/old-listings',
    to: '/buy',
    status: 301,
    created: '2026-02-15',
  },
  {
    id: '2',
    from: '/apartments',
    to: '/buy?type=apartment',
    status: 301,
    created: '2026-01-20',
  },
];

export default function SEOManagementPage() {
  const [activeTab, setActiveTab] = useState<'pages' | 'redirects' | 'sitemap' | 'schema'>('pages');
  const [editingPage, setEditingPage] = useState<string | null>(null);
  const [pages, setPages] = useState(pagesSEO);
  const toggleIndexed = (id: string) => {
    setPages(pages.map((p) => (p.id === id ? { ...p, indexed: !p.indexed } : p)));
  };

  const updateMeta = (id: string, field: 'metaTitle' | 'metaDescription', value: string) => {
    setPages(pages.map((p) => (p.id === id ? { ...p, [field]: value } : p)));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-slate-900">SEO Management</h1>
        <p className="text-slate-600 mt-2">Manage site SEO, redirects, and structured data</p>
      </div>

      {/* Health Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-red-50 rounded-2xl p-6 border border-red-200 shadow-sm">
          <div className="flex items-start gap-3">
            <AlertCircle className="text-red-600 mt-1" size={20} />
            <div>
              <p className="text-red-900 font-semibold">3 pages missing meta</p>
              <p className="text-red-700 text-sm mt-1">Critical SEO issue</p>
            </div>
          </div>
        </div>
        <div className="bg-amber-50 rounded-2xl p-6 border border-amber-200 shadow-sm">
          <div className="flex items-start gap-3">
            <AlertCircle className="text-amber-600 mt-1" size={20} />
            <div>
              <p className="text-amber-900 font-semibold">2 duplicate titles</p>
              <p className="text-amber-700 text-sm mt-1">Needs improvement</p>
            </div>
          </div>
        </div>
        <div className="bg-amber-50 rounded-2xl p-6 border border-amber-200 shadow-sm">
          <div className="flex items-start gap-3">
            <AlertCircle className="text-amber-600 mt-1" size={20} />
            <div>
              <p className="text-amber-900 font-semibold">5 pages with no content</p>
              <p className="text-amber-700 text-sm mt-1">Add more details</p>
            </div>
          </div>
        </div>
      </div>
      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100">
        <div className="flex border-b border-slate-200">
          {(['pages', 'redirects', 'sitemap', 'schema'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 px-6 py-4 font-semibold text-center transition ${
                activeTab === tab
                  ? 'text-teal-600 border-b-2 border-teal-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div className="p-6">
          {/* Page SEO Tab */}
          {activeTab === 'pages' && (
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">
                        Page Name
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">
                        Meta Title
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">
                        Meta Description
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-slate-600 uppercase">
                        Indexed
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-slate-600 uppercase">
                        Action
                      </th>
                    </tr>
                  </thead>                  <tbody>
                    {pages.map((page) => (
                      <tr key={page.id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="px-4 py-4 font-semibold text-slate-900">{page.name}</td>
                        <td className="px-4 py-4">
                          {editingPage === page.id ? (
                            <input
                              type="text"
                              value={page.metaTitle}
                              onChange={(e) =>
                                updateMeta(page.id, 'metaTitle', e.target.value)
                              }
                              className="w-full px-2 py-1 border border-teal-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                            />
                          ) : (
                            <span className="text-slate-600 text-sm">{page.metaTitle}</span>
                          )}
                        </td>
                        <td className="px-4 py-4">
                          {editingPage === page.id ? (
                            <input
                              type="text"
                              value={page.metaDescription}
                              onChange={(e) =>
                                updateMeta(page.id, 'metaDescription', e.target.value)
                              }
                              className="w-full px-2 py-1 border border-teal-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                            />
                          ) : (
                            <span className="text-slate-600 text-sm line-clamp-2">
                              {page.metaDescription}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-4 text-center">
                          <button
                            onClick={() => toggleIndexed(page.id)}
                            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium cursor-pointer transition ${
                              page.indexed
                                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }`}
                          >
                            {page.indexed ? (
                              <>
                                <CheckCircle size={14} />
                                Yes
                              </>
                            ) : (
                              <>
                                <AlertCircle size={14} />
                                No
                              </>
                            )}
                          </button>
                        </td>                        <td className="px-4 py-4 text-center">
                          <button
                            onClick={() =>
                              setEditingPage(
                                editingPage === page.id ? null : page.id
                              )
                            }
                            className="inline-flex items-center gap-2 px-4 py-2 bg-teal-100 text-teal-700 hover:bg-teal-200 rounded-lg text-sm font-medium"
                          >
                            <Edit2 size={16} />
                            {editingPage === page.id ? 'Save' : 'Edit'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Redirects Tab */}
          {activeTab === 'redirects' && (
            <div className="space-y-4">
              <button className="flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 font-semibold">
                <Plus size={20} />
                Add Redirect
              </button>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">
                        From
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">
                        To
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">
                        Created
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-slate-600 uppercase">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {redirects.map((redirect) => (
                      <tr
                        key={redirect.id}
                        className="border-b border-slate-100 hover:bg-slate-50"
                      >
                        <td className="px-4 py-4 font-mono text-sm text-slate-900">
                          {redirect.from}
                        </td>
                        <td className="px-4 py-4 font-mono text-sm text-slate-600">
                          {redirect.to}
                        </td>
                        <td className="px-4 py-4">
                          <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                            {redirect.status}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-sm text-slate-600">
                          {redirect.created}
                        </td>
                        <td className="px-4 py-4 text-center">
                          <button className="text-red-600 hover:text-red-700 font-semibold">
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {/* Sitemap Tab */}
          {activeTab === 'sitemap' && (
            <div className="space-y-4">
              <button className="flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 font-semibold mb-4">
                <LinkIcon size={20} />
                Generate Sitemap
              </button>

              <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                <p className="text-blue-900 text-sm">
                  <span className="font-semibold">Sitemap URL:</span>{' '}
                  <span className="font-mono">yoursite.com/sitemap.xml</span>
                </p>
              </div>

              <div>
                <p className="text-slate-600 font-semibold mb-3">Last Generated</p>
                <p className="text-slate-900">2026-03-24 at 10:30 AM</p>
              </div>
            </div>
          )}

          {/* Schema Tab */}
          {activeTab === 'schema' && (
            <div className="space-y-4">
              <p className="text-slate-600 font-semibold mb-4">Organization & Website Schema</p>

              <div className="bg-slate-100 rounded-xl p-4 font-mono text-xs text-slate-800 overflow-x-auto">
                <pre>{`{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Jaffna Property Platform",
  "url": "https://jaffnaproperty.com",
  "telephone": "+94-21-2223456",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Main Street, Jaffna",
    "addressLocality": "Jaffna",
    "addressCountry": "LK"
  }
}`}</pre>
              </div>

              <button className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 font-semibold">
                Edit Schema
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}