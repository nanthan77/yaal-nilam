'use client';

import Link from 'next/link';
import { useState, useCallback, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, X, Globe, Plus } from 'lucide-react';
import { useStore } from '@/lib/store';

interface NavLink {
  href: string;
  labelEn: string;
  labelTa: string;
}

const NAV_LINKS: NavLink[] = [
  { href: '/', labelEn: 'Home', labelTa: 'முகப்பு' },
  { href: '/properties', labelEn: 'Properties', labelTa: 'சொத்துக்கள்' },
  { href: '/areas', labelEn: 'Areas', labelTa: 'பகுதிகள்' },
  { href: '/short-term-rental', labelEn: 'Short Stay', labelTa: 'குறுகிய தங்கல்' },
  { href: '/alerts', labelEn: 'Alerts', labelTa: 'அறிவிப்புகள்' },
  { href: '/for-agents', labelEn: 'For Agents', labelTa: 'முகவர்கள்' },
  { href: '/about', labelEn: 'About', labelTa: 'பற்றி' },
  { href: '/contact', labelEn: 'Contact', labelTa: 'தொடர்பு' },
];

export function Navbar() {
  const { locale, setLocale } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, [isOpen]);

  const toggleMenu = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  const toggleLanguage = useCallback(() => {
    setLocale(locale === 'en' ? 'ta' : 'en');
  }, [locale, setLocale]);

  const getLabel = (link: NavLink) => {
    return locale === 'en' ? link.labelEn : link.labelTa;
  };

  const navbarTitle = locale === 'en' ? 'Yaal Nilam' : 'யாழ் நிலம்';
  const navbarSubtitle = locale === 'en' ? 'Trusted Property Marketplace' : 'யாழ்ப்பாணச் சொத்து சந்தை';
  const addListingLabel = locale === 'en' ? 'Add Listing' : 'சொத்தைச் சேர்க்கவும்';
  const languageButtonLabel = locale === 'en' ? 'தமிழ்' : 'EN';

  return (
    <nav aria-label={locale === 'ta' ? 'முதன்மை வழிசெலுத்தல்' : 'Main navigation'} className="sticky top-0 z-50 w-full border-b border-[#e0e7df] bg-white/95 backdrop-blur-md">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
        <div className="flex h-20 items-center justify-between gap-2 sm:gap-4">
          {/* Logo */}
          <Link href="/" className="group flex min-w-0 items-center gap-2.5" aria-label={locale === 'ta' ? 'யாழ் நிலம் — முகப்பு' : 'Yaal Nilam — home'}>
            <img src="/logo-mark.png" alt="" aria-hidden="true" className="h-8 w-auto shrink-0 sm:h-10" />
            <span className="flex flex-col items-start leading-none">
              <span className="whitespace-nowrap text-base font-black tracking-tight sm:text-xl text-[#0d3935] group-hover:text-[#1a6657]">
                {navbarTitle}
              </span>
              <span className="mt-0.5 hidden text-[10px] sm:block font-bold uppercase tracking-wider text-[#806026]">
                {navbarSubtitle}
              </span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-1 xl:flex xl:gap-3">
            {NAV_LINKS.slice(0, 5).map(link => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={pathname === link.href || (link.href !== '/' && pathname?.startsWith(link.href + '/')) ? 'page' : undefined}
                className="rounded-full px-3 py-2 text-sm font-semibold text-[#496056] transition-colors hover:bg-[#edf3ec] hover:text-[#0d3935]"
              >
                {getLabel(link)}
              </Link>
            ))}
          </div>

          {/* Right Section - Language Toggle & Add Listing */}
          <div className="flex shrink-0 items-center gap-2 md:gap-4">
            {/* Language Toggle */}
            <button
              type="button"
              onClick={toggleLanguage}
              lang={locale === 'ta' ? 'en' : 'ta'}
              className="flex min-h-11 min-w-11 items-center justify-center gap-1.5 rounded-full border border-[#dce5db] px-2.5 py-2.5 sm:px-3 transition-colors hover:bg-[#f2f6ef]"
              aria-label={locale === 'ta' ? 'Switch to English' : 'தமிழுக்கு மாற்றவும்'}
            >
              <Globe className="hidden h-4 w-4 text-teal-700 sm:block" aria-hidden="true" />
              <span className="text-xs font-bold text-teal-700">
                {languageButtonLabel}
              </span>
            </button>

            {/* Add Listing CTA - Desktop */}
            <Link
              href="/add-listing"
              className="hidden items-center gap-2 rounded-full bg-[#0d3935] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#18574d] sm:flex"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>{addListingLabel}</span>
            </Link>

            {/* Mobile Menu Button */}
            <button
              ref={menuButtonRef}
              type="button"
              onClick={toggleMenu}
              className="flex min-h-11 min-w-11 items-center justify-center rounded-xl p-2 transition-colors hover:bg-[#f2f6ef] xl:hidden"
              aria-label={locale === 'ta' ? (isOpen ? 'பட்டியலை மூடவும்' : 'பட்டியலைத் திறக்கவும்') : (isOpen ? 'Close menu' : 'Open menu')}
              aria-expanded={isOpen}
              aria-controls="mobile-navigation"
            >
              {isOpen ? (
                <X className="w-6 h-6 text-teal-700" />
              ) : (
                <Menu className="w-6 h-6 text-teal-700" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
          <div hidden={!isOpen} id="mobile-navigation" className="max-h-[calc(100dvh-5rem)] overflow-y-auto border-t border-[#e0e7df] bg-white xl:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {NAV_LINKS.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={pathname === link.href || (link.href !== '/' && pathname?.startsWith(link.href + '/')) ? 'page' : undefined}
                  className="block px-4 py-2 text-base font-medium text-teal-600 hover:text-teal-500 hover:bg-teal-50 rounded-md transition-colors duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  {getLabel(link)}
                </Link>
              ))}

              {/* Mobile Add Listing Button */}
              <Link
                href="/add-listing"
                className="mx-2 mt-4 block rounded-xl bg-[#0d3935] px-4 py-3 text-center font-bold text-white"
                onClick={() => setIsOpen(false)}
              >
                {addListingLabel}
              </Link>
            </div>
          </div>

      </div>
    </nav>
  );
}
