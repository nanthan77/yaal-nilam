// @ts-nocheck
'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

type SettingsTab = 'general' | 'property' | 'inquiry' | 'seo' | 'integrations' | 'security'

interface FormState {
  [key: string]: string | boolean
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('general')
  const [formData, setFormData] = useState<FormState>({
    siteName: 'Yaal Nilam',
    tagline: 'Your Gateway to Jaffna Property',
    contactEmail: 'contact@yaalnilam.lk',
    contactPhone: '+94 21 222 2222',
    defaultLanguage: 'en',
    currency: 'LKR',
    maxListingsPerUser: '50',
    listingExpiryDays: '90',
    enableComments: true,
    requirePhoneVerification: true,
    minInquiryResponse: '24',
    maxInquiryCharacters: '1000',
    metaDescription: 'Discover properties in Jaffna Peninsula',
    focusKeywords: 'Jaffna property, land, apartment',
    enableGoogleAnalytics: true,
    googleAnalyticsId: 'UA-XXXXXXXXX-X',
    enableHotjar: true,
    stripeApiKey: '***********',
    enableBackups: true,
    backupFrequency: 'daily',
    twoFactorAuth: false,
    sessionTimeout: '30',
  })

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSave = () => {
    console.log('Saving settings:', formData)
    alert('Settings saved successfully!')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-charcoal-900">Settings</h1>
        <p className="text-charcoal-600 mt-1">Manage your platform configuration</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Tabs */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-sand-200 rounded-lg overflow-hidden sticky top-6">
            {(['general', 'property', 'inquiry', 'seo', 'integrations', 'security'] as const).map(
              (tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`w-full text-left px-4 py-3 border-b border-sand-100 last:border-b-0 font-medium transition-colors ${
                    activeTab === tab
                      ? 'bg-navy-50 text-navy-700 border-l-4 border-l-navy-600'
                      : 'text-charcoal-700 hover:bg-sand-50'
                  }`}
                >
                  {tab === 'general' && 'General'}
                  {tab === 'property' && 'Property'}
                  {tab === 'inquiry' && 'Inquiry'}
                  {tab === 'seo' && 'SEO'}
                  {tab === 'integrations' && 'Integrations'}
                  {tab === 'security' && 'Security'}
                </button>
              )
            )}
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
          <div className="bg-white border border-sand-200 rounded-lg p-6 space-y-6">
            {/* General Settings */}
            {activeTab === 'general' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-charcoal-900 mb-4">General Settings</h2>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-charcoal-700 mb-2">Site Name</label>
                  <input
                    type="text"
                    value={formData.siteName as string}
                    onChange={(e) => handleInputChange('siteName', e.target.value)}
                    className="w-full px-4 py-2 border border-sand-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-charcoal-700 mb-2">Tagline</label>
                  <input
                    type="text"
                    value={formData.tagline as string}
                    onChange={(e) => handleInputChange('tagline', e.target.value)}
                    className="w-full px-4 py-2 border border-sand-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-charcoal-700 mb-2">Contact Email</label>
                  <input
                    type="email"
                    value={formData.contactEmail as string}
                    onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                    className="w-full px-4 py-2 border border-sand-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-charcoal-700 mb-2">Contact Phone</label>
                  <input
                    type="tel"
                    value={formData.contactPhone as string}
                    onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                    className="w-full px-4 py-2 border border-sand-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-charcoal-700 mb-2">Default Language</label>
                    <select
                      value={formData.defaultLanguage as string}
                      onChange={(e) => handleInputChange('defaultLanguage', e.target.value)}
                      className="w-full px-4 py-2 border border-sand-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-500"
                    >
                      <option>English</option>
                      <option>Tamil</option>
                      <option>Sinhala</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-charcoal-700 mb-2">Currency</label>
                    <select
                      value={formData.currency as string}
                      onChange={(e) => handleInputChange('currency', e.target.value)}
                      className="w-full px-4 py-2 border border-sand-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-500"
                    >
                      <option>LKR</option>
                      <option>USD</option>
                      <option>EUR</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Property Settings */}
            {activeTab === 'property' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-charcoal-900 mb-4">Property Settings</h2>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-charcoal-700 mb-2">
                      Max Listings Per User
                    </label>
                    <input
                      type="number"
                      value={formData.maxListingsPerUser as string}
                      onChange={(e) => handleInputChange('maxListingsPerUser', e.target.value)}
                      className="w-full px-4 py-2 border border-sand-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-charcoal-700 mb-2">
                      Listing Expiry (days)
                    </label>
                    <input
                      type="number"
                      value={formData.listingExpiryDays as string}
                      onChange={(e) => handleInputChange('listingExpiryDays', e.target.value)}
                      className="w-full px-4 py-2 border border-sand-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-500"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.enableComments as boolean}
                      onChange={(e) => handleInputChange('enableComments', e.target.checked)}
                      className="w-4 h-4 rounded border-sand-300 text-navy-600"
                    />
                    <span className="text-charcoal-700 font-medium">Enable Comments on Listings</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.requirePhoneVerification as boolean}
                      onChange={(e) => handleInputChange('requirePhoneVerification', e.target.checked)}
                      className="w-4 h-4 rounded border-sand-300 text-navy-600"
                    />
                    <span className="text-charcoal-700 font-medium">Require Phone Verification</span>
                  </label>
                </div>
              </div>
            )}

            {/* Inquiry Settings */}
            {activeTab === 'inquiry' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-charcoal-900 mb-4">Inquiry Settings</h2>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-charcoal-700 mb-2">
                    Min Response Time (hours)
                  </label>
                  <input
                    type="number"
                    value={formData.minInquiryResponse as string}
                    onChange={(e) => handleInputChange('minInquiryResponse', e.target.value)}
                    className="w-full px-4 py-2 border border-sand-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-charcoal-700 mb-2">
                    Max Inquiry Characters
                  </label>
                  <input
                    type="number"
                    value={formData.maxInquiryCharacters as string}
                    onChange={(e) => handleInputChange('maxInquiryCharacters', e.target.value)}
                    className="w-full px-4 py-2 border border-sand-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-500"
                  />
                </div>
              </div>
            )}

            {/* SEO Settings */}
            {activeTab === 'seo' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-charcoal-900 mb-4">SEO Settings</h2>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-charcoal-700 mb-2">
                    Meta Description
                  </label>
                  <textarea
                    value={formData.metaDescription as string}
                    onChange={(e) => handleInputChange('metaDescription', e.target.value)}
                    className="w-full px-4 py-2 border border-sand-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-500"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-charcoal-700 mb-2">
                    Focus Keywords (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formData.focusKeywords as string}
                    onChange={(e) => handleInputChange('focusKeywords', e.target.value)}
                    className="w-full px-4 py-2 border border-sand-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-500"
                  />
                </div>
              </div>
            )}

            {/* Integrations Settings */}
            {activeTab === 'integrations' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-charcoal-900 mb-4">Integrations</h2>
                </div>

                <div className="space-y-4 border border-sand-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-charcoal-900">Google Analytics</h3>
                      <p className="text-sm text-charcoal-600 mt-1">Track visitor behavior</p>
                    </div>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.enableGoogleAnalytics as boolean}
                        onChange={(e) => handleInputChange('enableGoogleAnalytics', e.target.checked)}
                        className="w-4 h-4 rounded border-sand-300 text-navy-600"
                      />
                    </label>
                  </div>
                  {(formData.enableGoogleAnalytics as boolean) && (
                    <div>
                      <label className="block text-sm font-semibold text-charcoal-700 mb-2">API Key</label>
                      <input
                        type="password"
                        value={formData.googleAnalyticsId as string}
                        onChange={(e) => handleInputChange('googleAnalyticsId', e.target.value)}
                        className="w-full px-4 py-2 border border-sand-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-500"
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-4 border border-sand-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-charcoal-900">Hotjar</h3>
                      <p className="text-sm text-charcoal-600 mt-1">User session recording</p>
                    </div>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.enableHotjar as boolean}
                        onChange={(e) => handleInputChange('enableHotjar', e.target.checked)}
                        className="w-4 h-4 rounded border-sand-300 text-navy-600"
                      />
                    </label>
                  </div>
                </div>

                <div className="space-y-4 border border-sand-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-charcoal-900">Stripe Payments</h3>
                      <p className="text-sm text-charcoal-600 mt-1">Payment processing</p>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-charcoal-700 mb-2">API Key</label>
                    <input
                      type="password"
                      value={formData.stripeApiKey as string}
                      onChange={(e) => handleInputChange('stripeApiKey', e.target.value)}
                      className="w-full px-4 py-2 border border-sand-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Security Settings */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-charcoal-900 mb-4">Security Settings</h2>
                </div>

                <div className="space-y-4 border border-sand-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-charcoal-900">Automatic Backups</h3>
                      <p className="text-sm text-charcoal-600 mt-1">Enable daily database backups</p>
                    </div>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.enableBackups as boolean}
                        onChange={(e) => handleInputChange('enableBackups', e.target.checked)}
                        className="w-4 h-4 rounded border-sand-300 text-navy-600"
                      />
                    </label>
                  </div>
                  {(formData.enableBackups as boolean) && (
                    <div>
                      <label className="block text-sm font-semibold text-charcoal-700 mb-2">Backup Frequency</label>
                      <select
                        value={formData.backupFrequency as string}
                        onChange={(e) => handleInputChange('backupFrequency', e.target.value)}
                        className="w-full px-4 py-2 border border-sand-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-500"
                      >
                        <option>Hourly</option>
                        <option>Daily</option>
                        <option>Weekly</option>
                      </select>
                    </div>
                  )}
                </div>

                <div className="space-y-3 border border-sand-200 rounded-lg p-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.twoFactorAuth as boolean}
                      onChange={(e) => handleInputChange('twoFactorAuth', e.target.checked)}
                      className="w-4 h-4 rounded border-sand-300 text-navy-600"
                    />
                    <span className="text-charcoal-700 font-medium">Require Two-Factor Authentication</span>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-charcoal-700 mb-2">
                    Session Timeout (minutes)
                  </label>
                  <input
                    type="number"
                    value={formData.sessionTimeout as string}
                    onChange={(e) => handleInputChange('sessionTimeout', e.target.value)}
                    className="w-full px-4 py-2 border border-sand-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-500"
                  />
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="flex gap-3 pt-6 border-t border-sand-200">
              <button
                onClick={handleSave}
                className="px-6 py-2 rounded-lg bg-navy-600 text-white font-medium hover:bg-navy-700 transition-colors"
              >
                Save Changes
              </button>
              <button className="px-6 py-2 rounded-lg border border-sand-300 text-charcoal-700 font-medium hover:bg-sand-50">
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
