// @ts-nocheck
'use client';

import Link from 'next/link';
import { useState, useCallback } from 'react';
import { ExternalLink, Globe, MapPin, Phone, Mail } from 'lucide-react';

type Language = 'en' | 'ta';

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
    { href: '/about', labelEn: 'About', labelTa: 'பற்றி' },
    { href: '/contact', labelEn: 'Contact', labelTa: 'தொடர்பு' },
  ],
};

const PROPERTY_TYPES: PropertyTypesConfig = {
  titleEn: 'Property Types',
  titleTa: 'சொத்து வகைகள்',
  types: [
    { href: '/properties?type=house', labelEn: 'House', labelTa: 'வீடு' },
    { href: '/properties?type=apartment', labelEn: 'Apartment', labelTa: 'அபார்टमெண்ட்' },
    { href: '/properties?type=villa', labelEn: 'Villa', labelTa: 'வில்லா' },
    { href: '/properties?type=land', labelEn: 'Land', labelTa: 'நிலம்' },
    { href: '/properties?type=commercial', labelEn: 'Commercial', labelTa: 'வணிக' },
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
    value: '+94 21 222 3456',
  },
  email: {
    labelEn: 'Email',
    labelTa: 'மின்னஞ்சல்',
    value: 'info@yaalnilam.lk',
  },
};

const SOCIAL_LINKS = [
  { icon: ExternalLink, href: '#', label: 'Facebook' },
  { icon: ExternalLink, href: '#', label: 'Instagram' },
  { icon: ExternalLink, href: '#', label: 'Twitter' },
  { icon: ExternalLink, href: '#', label: 'LinkedIn' },
];

export function Footer() {
  const [language, setLanguage] = useState<Language>('en');

  const toggleLanguage = useCallback(() => {
    setLanguage(prev => (prev === 'en' ? 'ta' : 'en'));
  }, []);

  const getLabel = (config: { labelEn?: string; labelTa?: string; titleEn?: string; titleTa?: string }) => {
    if (language === 'en') {
      return config.labelEn || config.titleEn || '';
    }
    return config.labelTa || config.titleTa || '';
  };

  const copyrightText = language === 'en'
    ? '© 2026 Yaal Nilam. All rights reserved.'
    : '© 2026 யாழ் நிலம். அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டுள்ளன.';

  return (
    <footer className="bg-navy-900 text-sand-200">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {/* Column 1: Brand */}
          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <h3 className="text-2xl font-bold text-white">
                {language === 'en' ? BRAND_CONFIG.titleEn : BRAND_CONFIG.titleTa}
              </h3>
              <p className="text-xs text-sand-300">
                {language === 'en' ? BRAND_CONFIG.taglineEn : BRAND_CONFIG.taglineTa}
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
                  <social.icon className="w-5 h-5" />
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
      <div className="border-t border-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-sand-300 text-center sm:text-left">
            {copyrightText}
          </p>

          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-navy-800 hover:bg-navy-700 transition-colors duration-200 text-xs font-semibold text-sand-200"
            aria-label="Toggle language"
          >
            <Globe className="w-4 h-4" />
            {language === 'en' ? 'English' : 'தமிழ்'}
          </button>
        </div>
      </div>
    </footer>
  );
}