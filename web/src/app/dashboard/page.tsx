// @ts-nocheck
'use client';

import Link from 'next/link';
import { LayoutDashboard, ExternalLink } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-sand-50">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-teal-900 to-teal-800 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Dashboard</h1>
          <p className="text-teal-100">Manage your properties and listings</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="bg-white rounded-lg shadow-xl p-12 text-center">
          <div className="bg-teal-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
            <LayoutDashboard className="w-8 h-8 text-teal-600" />
          </div>

          <h2 className="text-3xl font-bold text-charcoal-900 mb-4">Welcome to Yaal Nilam Dashboard</h2>

          <p className="text-charcoal-600 text-lg mb-8 max-w-2xl mx-auto">
            Access the full admin dashboard to manage your property listings, view analytics, 
            and manage your account.
          </p>

          <div className="bg-sand-50 rounded-lg p-8 mb-8 border-2 border-dashed border-sand-200">
            <p className="text-charcoal-700 font-semibold mb-4">Admin Dashboard URL:</p>
            <p className="text-teal-600 font-mono text-sm break-all mb-4">
              https://yaal-nilam-admin.web.app
            </p>
          </div>

          <a
            href="https://yaal-nilam-admin.web.app"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            Go to Admin Dashboard
          </a>

          <div className="mt-12 pt-8 border-t border-charcoal-200">
            <p className="text-charcoal-600 text-sm">
              Need help? Contact us at <span className="font-semibold">hello@yaalnilam.lk</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
