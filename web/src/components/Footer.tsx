// @ts-nocheck
'use client';

import Link from 'next/link';
import { useCallback } from 'react';
import { Globe, MapPin, Phone, Mail } from 'lucide-react';
import { useStore } from '@/lib/store';

interface Column1Config {
  titleEn: string;
  titleTa: string;
  taglineEn: string;
  taglineTa: string;
}

interface QuickLinksConfig {
  titleEn: string;
  titleTa: string;
  links: Array<{ href: string; labelEn: string; labelTa: string }>;
}

interface PropertyTypesConfig {
  titleEn: string;
  titleTa: string;
  types: Array<{ href: string; labelEn: string; labelTa: string }>;
}

interface ContactConfig {
  titleEn: string;
  titleTa: string;
  address: { labelEn: string; labelTa: string; value: string };
  phone: { labelEn: string; labelTa: string; value: string };
  email: { labelEn: string; labelTa: string; value: string };
}

const BRAND_CONFIG: Column1Config = {
  titleEn: 'Yaal Nilam',
  titleTa: 'யாழ் நிலம்',
  taglineEn: 'Your trusted property marketplace in Jaffna',
  taglineTa: 'யாழ்ப்பாணத்தில் உங்கள் நம்பகமான சொத்து சந்தை',
};

const QUICK_LINKS: QuickLinksConfig = {
  titleEn: 'Quick Links',
  titleTa: 'விரைவு இணைப்புகள்',
  links: [
    { href: '/', labelEn: 'Home', labelTa: 'முகப்பு' },
    { href: '/properties', labelEn: 'Properties', labelTa: 'சொத்துக்கள்' },
    { href: '/areas', labelEn: 'Areas', labelTa: 'பகுதிகள்' },
    { href: '/about', labelEn: 'About', labelTa: 'எங்களைப் பற்றி' },
    { href: '/contact', labelEn: 'Contact', labelTa: 'தொடர்பு' },
  ],
};

const PROPERTY_TYPES: PropertyTypesConfig = {
  titleEn: 'Property Types',
  titleTa: 'சொத்து வகைகள்',
  types: [
    { href: '/properties?type=house', labelEn: 'House', labelTa: 'வீடு' },
    { href: '/properties?type=apartment', labelEn: 'Apartment', labelTa: 'அபார்ட்மென்ட்' },
    { href: '/properties?type=villa', labelEn: 'Villa', labelTa: 'வில்லா' },
    { href: '/properties?type=land', labelEn: 'Land', labelTa: 'காணி' },
    { href: '/properties?type=commercial', labelEn: 'Commercial', labelTa: 'வணிகச் சொத்து' },
    { href: '/short-term-rental', labelEn: 'Short-Term Rentals', labelTa: 'குறுகிய கால வாடகை' },
  ],
};

const CONTACT_INFO: ContactConfig = {
  titleEn: 'Contact Info',
  titleTa: 'தொடர்பு தகவல்',
  address: {
    labelEn: 'Address',
    labelTa: 'முகவரி',
    value: 'Jaffna, Sri Lanka',
  },
  phone: {
    labelEn: 'Phone',
    labelTa: 'தொலைபேசி',
    value: '+94 77 786 3333',
  },
  email: {
    labelEn: 'Email',
    labelTa: 'மின்னஞ்சல்',
    value: 'info@yaalnilam.lk',
  },
};

const FacebookIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
);
const InstagramIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
);
const TwitterIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
);
const YoutubeIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
);

const SOCIAL_LINKS = [
  { icon: FacebookIcon, href: 'https://www.facebook.com/yaalnilam', label: 'Facebook' },
  { icon: InstagramIcon, href: 'https://www.instagram.com/yaalnilam', label: 'Instagram' },
  { icon: TwitterIcon, href: 'https://x.com/yaalnilam', label: 'X' },
  { icon: YoutubeIcon, href: 'https://www.youtube.com/@yaalnilam', label: 'YouTube' },
];

export function Footer() {
  const { locale, setLocale } = useStore();

  const toggleLanguage = useCallback(() => {
    setLocale(locale === 'en' ? 'ta' : 'en');
  }, [locale, setLocale]);

  const getLabel = (config: { labelEn?: string; labelTa?: string; titleEn?: string; titleTa?: string }) => {
    if (locale === 'en') {
      return config.labelEn || config.titleEn || '';
    }
    return config.labelTa || config.titleTa || '';
  };

  const copyrightText = locale === 'en'
    ? '© 2026 Yaal Nilam. All rights reserved.'
    : '© 2026 யாழ் நிலம். அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டுள்ளன.';

  return (
    <footer className="bg-teal-900 text-sand-200">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {/* Column 1: Brand */}
          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <h3 className="text-2xl font-bold text-white">
                {locale === 'en' ? BRAND_CONFIG.titleEn : BRAND_CONFIG.titleTa}
              </h3>
              <p className="text-xs text-sand-300">
                {locale === 'en' ? BRAND_CONFIG.taglineEn : BRAND_CONFIG.taglineTa}
              </p>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-4 pt-2">
              {SOCIAL_LINKS.map(social => (
                <Link
                  key={social.label}
                  href={social.href}
                  className="text-sand-200 hover:text-warm-400 transition-colors duration-200"
                  aria-label={social.label}
                >
                  <social.icon />
                </Link>
              ))}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">
              {getLabel(QUICK_LINKS)}
            </h4>
            <ul className="space-y-2">
              {QUICK_LINKS.links.map(link => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sand-200 hover:text-white transition-colors duration-200 text-sm"
                  >
                    {getLabel(link)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Property Types */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">
              {getLabel(PROPERTY_TYPES)}
            </h4>
            <ul className="space-y-2">
              {PROPERTY_TYPES.types.map(type => (
                <li key={type.href}>
                  <Link
                    href={type.href}
                    className="text-sand-200 hover:text-white transition-colors duration-200 text-sm"
                  >
                    {getLabel(type)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">
              {getLabel(CONTACT_INFO)}
            </h4>
            <ul className="space-y-3">
              {/* Address */}
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-warm-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-sand-300">
                    {getLabel(CONTACT_INFO.address)}
                  </p>
                  <p className="text-sm text-sand-200">
                    {CONTACT_INFO.address.value}
                  </p>
                </div>
              </li>

              {/* Phone */}
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-warm-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-sand-300">
                    {getLabel(CONTACT_INFO.phone)}
                  </p>
                  <Link
                    href={`tel:${CONTACT_INFO.phone.value}`}
                    className="text-sm text-sand-200 hover:text-warm-400 transition-colors duration-200"
                  >
                    {CONTACT_INFO.phone.value}
                  </Link>
                </div>
              </li>

              {/* Email */}
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-warm-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-sand-300">
                    {getLabel(CONTACT_INFO.email)}
                  </p>
                  <Link
                    href={`mailto:${CONTACT_INFO.email.value}`}
                    className="text-sm text-sand-200 hover:text-warm-400 transition-colors duration-200"
                  >
                    {CONTACT_INFO.email.value}
                  </Link>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-teal-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-sand-300 text-center sm:text-left">
            {copyrightText}
          </p>

          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-teal-800 hover:bg-teal-700 transition-colors duration-200 text-xs font-semibold text-sand-200"
            aria-label="Toggle language"
          >
            <Globe className="w-4 h-4" />
            {locale === 'en' ? 'English' : 'தமிழ்'}
          </button>
        </div>
      </div>
    </footer>
  );
}
