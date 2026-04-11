// @ts-nocheck
'use client';

import { LayoutDashboard, ExternalLink } from 'lucide-react';
import { useStore } from '@/lib/store';
import { localize } from '@/lib/translations';

export default function DashboardPage() {
  const { locale } = useStore();
  const copy = localize(locale, {
    en: {
      title: 'Dashboard',
      subtitle: 'Manage your properties and listing activity',
      welcome: 'Welcome to the Yaal Nilam dashboard',
      body: 'Open the full admin dashboard to manage listings, review leads, and keep your account details up to date.',
      adminUrl: 'Admin Dashboard URL',
      cta: 'Open Admin Dashboard',
      help: 'Need help? Contact us at',
    },
    ta: {
      title: 'டாஷ்போர்ட்',
      subtitle: 'உங்கள் சொத்துகள் மற்றும் பட்டியல் செயல்பாடுகளை நிர்வகிக்கவும்',
      welcome: 'யாழ் நிலம் டாஷ்போர்டிற்கு வரவேற்கிறோம்',
      body: 'முழு நிர்வாக டாஷ்போர்டைத் திறந்து உங்கள் பட்டியல்கள், வரவுகள் மற்றும் கணக்கு தகவல்களை எளிதாக நிர்வகிக்கலாம்.',
      adminUrl: 'நிர்வாக டாஷ்போர்ட் முகவரி',
      cta: 'நிர்வாக டாஷ்போர்டைத் திறக்கவும்',
      help: 'உதவி தேவையா? எங்களைத் தொடர்பு கொள்ளுங்கள்:',
    },
  });

  return (
    <div className="min-h-screen bg-sand-50">
      <div className="bg-gradient-to-r from-teal-900 to-teal-800 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">{copy.title}</h1>
          <p className="text-teal-100">{copy.subtitle}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="bg-white rounded-lg shadow-xl p-12 text-center">
          <div className="bg-teal-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
            <LayoutDashboard className="w-8 h-8 text-teal-600" />
          </div>

          <h2 className="text-3xl font-bold text-charcoal-900 mb-4">{copy.welcome}</h2>

          <p className="text-charcoal-600 text-lg mb-8 max-w-2xl mx-auto">
            {copy.body}
          </p>

          <div className="bg-sand-50 rounded-lg p-8 mb-8 border-2 border-dashed border-sand-200">
            <p className="text-charcoal-700 font-semibold mb-4">{copy.adminUrl}</p>
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
            {copy.cta}
          </a>

          <div className="mt-12 pt-8 border-t border-charcoal-200">
            <p className="text-charcoal-600 text-sm">
              {copy.help} <span className="font-semibold">hello@yaalnilam.lk</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
