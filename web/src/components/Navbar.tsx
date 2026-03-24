// @ts-nocheck
'use client';

import Link from 'next/link';
import { useState, useCallback } from 'react';
import { Menu, X, Globe, Building2, MapPin, Phone, Plus } from 'lucide-react';

type Language = 'en' | 'ta';

interface NavLink {
  href: string;
  labelEn: string;
  labelTa: string;
  icon?: React.ReactNode;
}

const NAV_LINKS: NavLink[] = [
  { href: '/', labelEn: 'Home', labelTa: 'முகப்பு' },
  { href: '/properties', labelEn: 'Properties', labelTa: 'சொத்துக்கள்' },
  { href: '/areas', labelEn: 'Areas', labelTa: 'பகுதிகள்' },
  { href: '/short-term-rental', labelEn: 'Short Stay', labelTa: 'குறுகிய தங்கல்' },
  { href: '/about', labelEn: 'About', labelTa: 'பற்றி' },
  { href: '/contact', labelEn: 'Contact', labelTa: 'தொடர்பு' },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [language, setLanguage] = useState<Language>('en');

  const toggleMenu = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguage(prev => (prev === 'en' ? 'ta' : 'en'));
  }, []);

  const getLabel = (link: NavLink) => {
    return language === 'en' ? link.labelEn : link.labelTa;
  };

  const navbarTitle = language === 'en' ? 'Yaal Nilam' : 'யாழ் நிலம்';
  const navbarSubtitle = language === 'en' ? 'யாழ் நிலம்' : 'Yaal Nilam';
  const addListingLabel = language === 'en' ? 'Add Listing' : 'பட்டியல் சேர்க்கவும்';

  return (
    <nav className="sticky top-0 z-50 w-full bg-white shadow-sm border-b border-sand-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex flex-col items-start gap-0">
            <span className="text-xl font-bold text-navy-900">
              {navbarTitle}
            </span>
            <span className="text-xs text-teal-600 font-medium">
              {navbarSubtitle}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1 lg:gap-2">
            {NAV_LINKS.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2 text-sm font-medium text-navy-600 hover:text-navy-500 transition-colors duration-200 rounded-md hover:bg-navy-50"
              >
                {getLabel(link)}
              </Link>
            ))}
          </div>

          {/* Right Section - Language Toggle & Add Listing */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="p-2 rounded-lg bg-sand-100 hover:bg-sand-200 transition-colors duration-200 flex items-center gap-1"
              aria-label="Toggle language"
            >
              <Globe className="w-4 h-4 text-navy-600" />
              <span className="text-xs font-semibold text-navy-600 hidden sm:inline">
                {language === 'en' ? 'EN' : 'தமிழ்'}
              </span>
            </button>

            {/* Add Listing CTA - Desktop */}
            <Link
              href="/add-listing"
              className="hidden sm:flex items-center gap-2 px-4 py-2 bg-warm-500 text-navy-900 rounded-lg font-bold hover:bg-warm-400 transition-all duration-200 shadow-sm hover:-translate-y-0.5"
            >
              <Plus className="w-4 h-4" />
              <span className="text-sm">{addListingLabel}</span>
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className="md:hidden p-2 rounded-lg hover:bg-sand-100 transition-colors duration-200"
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <X className="w-6 h-6 text-navy-600" />
              ) : (
                <Menu className="w-6 h-6 text-navy-600" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isOpen && (
          <div className="md:hidden border-t border-sand-200 bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {NAV_LINKS.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block px-4 py-2 text-base font-medium text-navy-600 hover:text-navy-500 hover:bg-navy-50 rounded-md transition-colors duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  {getLabel(link)}
                </Link>
              ))}

              {/* Mobile Add Listing Button */}
              <Link
                href="/add-listing"
                className="block mx-2 mt-4 px-4 py-2 bg-warm-500 text-navy-900 rounded-lg font-bold hover:bg-warm-400 transition-all duration-200 text-center"
                onClick={() => setIsOpen(false)}
              >
                {addListingLabel}
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}