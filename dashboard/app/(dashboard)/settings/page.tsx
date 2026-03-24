'use client';

import { useState } from 'react';
import {
  Save,
  Eye,
  EyeOff,
  Upload,
  Settings,
  Lock,
  Server,
  Shield,
} from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'general' | 'property' | 'inquiry' | 'seo' | 'integrations' | 'security'>('general');
  const [showApiKey, setShowApiKey] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-navy-900 mb-2">Settings</h1>
        <p className="text-slate-600">Configure your platform settings and integrations</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-6">
        <div className="flex border-b border-slate-200 overflow-x-auto">
          {(['general', 'property', 'inquiry', 'seo', 'integrations', 'security'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-4 font-medium transition whitespace-nowrap ${
                activeTab === tab
                  ? 'border-b-2 border-teal-600 text-teal-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab === 'general'
                ? 'General'
                : tab === 'property'
                ? 'Property'
                : tab === 'inquiry'
                ? 'Inquiry'
                : tab === 'seo'
                ? 'SEO'
                : tab === 'integrations'
                ? 'Integrations'
                : 'Security'}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-8 max-w-4xl">
          {/* General Tab */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">General Settings</h2>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-2">
                    Platform Name
                  </label>
                  <input
                    type="text"
                    defaultValue="Yaal Nilam"
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-2">
                    Support Email
                  </label>
                  <input
                    type="email"
                    defaultValue="support@yaalnilam.com"
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">
                  Platform Description
                </label>
                <textarea
                  defaultValue="Leading property management and real estate platform in Jaffna"
                  rows={4}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              {/* Logo Upload */}
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-4">
                  Platform Logo
                </label>
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-teal-500 hover:bg-teal-50 transition cursor-pointer">
                  <Upload className="w-8 h-8 mx-auto text-slate-400 mb-2" />
                  <p className="text-slate-600">Click to upload logo</p>
                  <p className="text-xs text-slate-500 mt-1">PNG, JPG up to 5MB</p>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-6 flex gap-3">
                <button
                  onClick={handleSave}
                  className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-lg transition font-medium flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
                {saveSuccess && (
                  <span className="text-emerald-600 py-2 text-sm font-medium">✓ Saved successfully</span>
                )}
              </div>
            </div>
          )}

          {/* Property Tab */}
          {activeTab === 'property' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Property Settings</h2>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-2">
                    Default Currency
                  </label>
                  <select defaultValue="LKR" className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500">
                    <option>LKR</option>
                    <option>USD</option>
                    <option>INR</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-2">
                    Default Area Unit
                  </label>
                  <select defaultValue="sqft" className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500">
                    <option value="sqft">Square Feet</option>
                    <option value="sqm">Square Meters</option>
                    <option value="perches">Perches</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-slate-300 accent-teal-600" />
                  <span className="text-sm text-slate-700">Allow price negotiation on listings</span>
                </label>
              </div>

              <div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-slate-300 accent-teal-600" />
                  <span className="text-sm text-slate-700">Require document verification for agents</span>
                </label>
              </div>

              <div className="border-t border-slate-200 pt-6 flex gap-3">
                <button
                  onClick={handleSave}
                  className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-lg transition font-medium flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {/* Inquiry Tab */}
          {activeTab === 'inquiry' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Inquiry Settings</h2>

              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">
                  Auto-Response Message
                </label>
                <textarea
                  defaultValue="Thank you for your inquiry. We will get back to you within 24 hours."
                  rows={4}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-2">
                    Response Time (hours)
                  </label>
                  <input
                    type="number"
                    defaultValue="24"
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-2">
                    Max Inquiries per Day
                  </label>
                  <input
                    type="number"
                    defaultValue="50"
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div className="border-t border-slate-200 pt-6 flex gap-3">
                <button
                  onClick={handleSave}
                  className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-lg transition font-medium flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {/* SEO Tab */}
          {activeTab === 'seo' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">SEO Settings</h2>

              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">
                  Meta Title
                </label>
                <input
                  type="text"
                  defaultValue="Yaal Nilam - Property Management & Real Estate Platform"
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">
                  Meta Description
                </label>
                <textarea
                  defaultValue="Find properties for rent and sale in Jaffna. Browse apartments, houses, villas, and land with detailed listings."
                  rows={3}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">
                  Keywords (comma separated)
                </label>
                <input
                  type="text"
                  defaultValue="property, real estate, jaffna, rent, sale, apartments"
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="border-t border-slate-200 pt-6 flex gap-3">
                <button
                  onClick={handleSave}
                  className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-lg transition font-medium flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {/* Integrations Tab */}
          {activeTab === 'integrations' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Integrations</h2>

              <div className="border border-slate-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-900">Google Analytics</h3>
                    <p className="text-sm text-slate-600 mt-1">Track visitor behavior and analytics</p>
                  </div>
                  <button className="bg-teal-100 text-teal-700 px-4 py-2 rounded-lg font-medium">
                    Connected
                  </button>
                </div>
              </div>

              <div className="border border-slate-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-900">Firebase</h3>
                    <p className="text-sm text-slate-600 mt-1">Real-time database and authentication</p>
                  </div>
                  <button className="bg-slate-100 text-slate-700 px-4 py-2 rounded-lg font-medium">
                    Connect
                  </button>
                </div>
              </div>

              <div className="border border-slate-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-900">Stripe</h3>
                    <p className="text-sm text-slate-600 mt-1">Payment processing</p>
                  </div>
                  <button className="bg-slate-100 text-slate-700 px-4 py-2 rounded-lg font-medium">
                    Connect
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Security</h2>

              <div className="border-t border-slate-200 pt-4">
                <h3 className="font-semibold text-slate-900 mb-4">API Keys</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-900 mb-2">
                      API Key
                    </label>
                    <div className="flex gap-2">
                      <input
                        type={showApiKey ? 'text' : 'password'}
                        defaultValue="sk_live_jaffna_nilam_2024_xxxxx"
                        readOnly
                        className="flex-1 px-4 py-2 border border-slate-200 rounded-lg bg-slate-50 font-mono text-sm"
                      />
                      <button
                        onClick={() => setShowApiKey(!showApiKey)}
                        className="text-slate-600 hover:bg-slate-100 p-2 rounded transition"
                      >
                        {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <button className="text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg transition font-medium text-sm">
                    Regenerate Key
                  </button>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-4">
                <h3 className="font-semibold text-slate-900 mb-4">Two-Factor Authentication</h3>
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div>
                    <p className="font-medium text-slate-900">2FA Status</p>
                    <p className="text-sm text-slate-600">Enabled for admin accounts</p>
                  </div>
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold">
                    Enabled
                  </span>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-6 flex gap-3">
                <button
                  onClick={handleSave}
                  className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-lg transition font-medium flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
