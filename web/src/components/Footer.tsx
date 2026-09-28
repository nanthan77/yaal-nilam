'use client';

import Link from 'next/link';
import { useCallback } from 'react';
import { Globe, Phone, Mail, BookOpen, Wrench, Search } from 'lucide-react';
import { useStore } from '@/lib/store';
import { FooterAppLinks } from './FooterAppLinks';

interface Column1Config {
  titleEn: string;
  titleTa: string;
  taglineEn: string;
  taglineTa: string;
}

interface PropertySearchConfig {
  titleEn: string;
  titleTa: string;
  links: Array<{ href: string; labelEn: string; labelTa: string }>;
}

interface ResourceLinksConfig {
  titleEn: string;
  titleTa: string;
  links: Array<{ href: string; labelEn: string; labelTa: string }>;
}

interface UtilityLinksConfig {
  titleEn: string;
  titleTa: string;
  links: Array<{ href: string; labelEn: string; labelTa: string }>;
}

interface ContactConfig {
  titleEn: string;
  titleTa: string;
  phone: string;
  email: string;
}

const BRAND_CONFIG: Column1Config = {
  titleEn: 'Yaal Nilam',
  titleTa: 'யாழ் நிலம்',
  taglineEn: 'Your trusted hyper-local property marketplace in Jaffna and Northern Sri Lanka.',
  taglineTa: 'யாழ்ப்பாணம் மற்றும் வட இலங்கையின் நம்பகமான சொத்து சந்தை.',
};

const PROPERTY_SEARCH: PropertySearchConfig = {
  titleEn: 'Property Search',
  titleTa: 'சொத்து தேடல்',
  links: [
    { href: '/properties?type=house', labelEn: 'Houses for Sale', labelTa: 'விற்பனைக்கு வீடுகள்' },
    { href: '/properties?type=apartment', labelEn: 'Apartments for Sale', labelTa: 'விற்பனைக்கு அபார்ட்மென்ட்கள்' },
    { href: '/properties?type=villa', labelEn: 'Villas & Luxury Homes', labelTa: 'சொகுசு வில்லாக்கள்' },
    { href: '/properties?type=land', labelEn: 'Land & Plots for Sale', labelTa: 'விற்பனைக்கு நிலங்கள்' },
    { href: '/properties?type=commercial', labelEn: 'Commercial Real Estate', labelTa: 'வணிகச் சொத்துக்கள்' },
    { href: '/short-term-rental', labelEn: 'Short-Term Rentals', labelTa: 'குறுகிய கால வாடகை' },
  ],
};

const RESOURCES_LINKS: ResourceLinksConfig = {
  titleEn: 'Resources & Guides',
  titleTa: 'வழிகாட்டிகள்',
  links: [
    { href: '/blog/jaffna-real-estate-market-trends', labelEn: '2026 Land Valuations', labelTa: '2026 நில மதிப்புகள்' },
    { href: '/blog/buying-property-sri-lanka-diaspora', labelEn: 'Diaspora Land Purchase Laws', labelTa: 'வெளிநாட்டு தமிழர் சட்டங்கள்' },
    { href: '/blog/interior-design-jaffna', labelEn: 'Jaffna Modern Interior Ideas', labelTa: 'உட்புற வடிவமைப்பு யோசனைகள்' },
    { href: '/blog/best-property-services', labelEn: 'Best Local Services Directory', labelTa: 'சிறந்த சேவைகள் அடைவு' },
    { href: '/blog', labelEn: 'All Expert Resource Guides', labelTa: 'அனைத்து வழிகாட்டிகள்' },
  ],
};

const UTILITY_LINKS: UtilityLinksConfig = {
  titleEn: 'Free Utilities & Tools',
  titleTa: 'இலவச கருவிகள்',
  links: [
    { href: '/tools/land-size-converter', labelEn: 'Land Size Converter', labelTa: 'நில அளவீடு அலகுகள் மாற்றி' },
    { href: '/tools/stamp-duty-calculator', labelEn: 'Stamp Duty & Notary Calculator', labelTa: 'முத்திரைத்தாள் கணக்கீடு' },
    { href: '/price-index', labelEn: 'House Price Index', labelTa: 'விலைச் சுட்டெண்' },
    { href: '/about', labelEn: 'About Yaal Nilam', labelTa: 'எங்களைப் பற்றி' },
    { href: '/contact', labelEn: 'Contact Support & FAQ', labelTa: 'தொடர்பு / உதவிகள்' },
  ],
};

const CONTACT_INFO: ContactConfig = {
  titleEn: 'Direct Hotline',
  titleTa: 'நேரடித் தொடர்பு',
  phone: '+94 70 484 6555',
  email: 'info@yaalnilam.lk',
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
    <footer className="bg-[#0F2E25] text-sand-200 border-t border-[#D4A853]/20">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          
          {/* Column 1: Brand */}
          <div className="space-y-5">
            <div className="flex flex-col gap-3">
              <Link href="/" className="inline-block bg-white rounded-xl p-3 w-fit shadow-sm" aria-label="Yaal Nilam — home">
                <img src="/logo.png" alt="Yaal Nilam — Jaffna Real Estate" className="h-16 w-auto" />
              </Link>
              <p className="text-xs text-sand-300 leading-relaxed font-medium">
                {locale === 'en' ? BRAND_CONFIG.taglineEn : BRAND_CONFIG.taglineTa}
              </p>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-4 pt-2">
              {SOCIAL_LINKS.map(social => (
                <Link
                  key={social.label}
                  href={social.href}
                  className="text-sand-200 hover:text-[#D4A853] transition-colors duration-200"
                  aria-label={social.label}
                >
                  <social.icon />
                </Link>
              ))}
            </div>

            <FooterAppLinks locale={locale} />
          </div>

          {/* Column 2: Property Search */}
          <div className="space-y-4">
            <h4 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
              <Search className="w-4 h-4 text-[#D4A853]" />
              {getLabel(PROPERTY_SEARCH)}
            </h4>
            <ul className="space-y-2.5">
              {PROPERTY_SEARCH.links.map(link => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sand-300 hover:text-white transition-colors duration-200 text-xs font-semibold"
                  >
                    {getLabel(link)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Resources & Guides */}
          <div className="space-y-4">
            <h4 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#D4A853]" />
              {getLabel(RESOURCES_LINKS)}
            </h4>
            <ul className="space-y-2.5">
              {RESOURCES_LINKS.links.map(link => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sand-300 hover:text-white transition-colors duration-200 text-xs font-semibold block leading-relaxed"
                  >
                    {getLabel(link)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Free Utilities & Support */}
          <div className="space-y-6">
            <div className="space-y-4">
              <h4 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                <Wrench className="w-4 h-4 text-[#D4A853]" />
                {getLabel(UTILITY_LINKS)}
              </h4>
              <ul className="space-y-2.5">
                {UTILITY_LINKS.links.map(link => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sand-300 hover:text-white transition-colors duration-200 text-xs font-semibold"
                    >
                      {getLabel(link)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Direct Contact info integrated */}
            <div className="pt-4 border-t border-white/5 space-y-2">
              <h5 className="text-[10px] font-black text-white uppercase tracking-wider">
                {locale === 'en' ? CONTACT_INFO.titleEn : CONTACT_INFO.titleTa}
              </h5>
              <div className="flex flex-col gap-1.5 text-xs text-sand-300 font-bold">
                <Link
                  href={`tel:${CONTACT_INFO.phone}`}
                  className="hover:text-[#D4A853] transition flex items-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5 text-[#D4A853]" />
                  {CONTACT_INFO.phone}
                </Link>
                <Link
                  href={`mailto:${CONTACT_INFO.email}`}
                  className="hover:text-[#D4A853] transition flex items-center gap-1.5"
                >
                  <Mail className="w-3.5 h-3.5 text-[#D4A853]" />
                  {CONTACT_INFO.email}
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/5 bg-[#0a201a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-[11px] text-sand-400 font-semibold text-center sm:text-left">
            {copyrightText}
          </p>

          {/* Website credit */}
          <a
            href="https://safenetcreations.com"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-1.5 text-[11px] text-sand-400 font-semibold text-center hover:text-[#D4A853] transition-colors duration-200"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-3.5 h-3.5 text-[#D4A853] shrink-0"
              aria-hidden="true"
            >
              <circle cx="12" cy="4.5" r="1.6" />
              <path d="M12 6 L7 20" />
              <path d="M12 6 L17 20" />
              <path d="M9 13 H15" />
            </svg>
            {locale === 'en' ? 'Building digital homes — ' : 'டிஜிட்டல் இல்லங்களை உருவாக்குகிறோம் — '}
            <span className="text-sand-200 group-hover:text-[#D4A853]">SafeNet Creations</span>
          </a>

          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-200 text-[11px] font-bold text-sand-200 border border-white/10 shadow-sm"
            aria-label="Toggle language"
          >
            <Globe className="w-3.5 h-3.5 text-[#D4A853]" />
            {locale === 'en' ? 'English' : 'தமிழ்'}
          </button>
        </div>
      </div>
    </footer>
  );
}
