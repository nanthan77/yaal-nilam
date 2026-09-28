'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { Home, Search, MapPin, CalendarDays, Bell, Users, Compass, Phone, Globe, Plus, ChevronDown, X, ArrowUpRight, type LucideIcon } from 'lucide-react';
import { useStore } from '@/lib/store';

interface NavLink {
  href: string;
  en: string;
  ta: string;
  mobileTa?: string;
  icon: LucideIcon;
  desktopOnly?: boolean;
}

const PRIMARY_LINKS: NavLink[] = [
  { href: '/', en: 'Home', ta: 'முகப்பு', icon: Home, desktopOnly: true },
  { href: '/properties', en: 'Properties', ta: 'சொத்துகள்', mobileTa: 'தேடல்', icon: Search },
  { href: '/areas', en: 'Areas', ta: 'பகுதிகள்', icon: MapPin },
  { href: '/short-term-rental', en: 'Short stay', ta: 'குறுகிய தங்கல்', mobileTa: 'தங்கல்', icon: CalendarDays },
  { href: '/alerts', en: 'Property alerts', ta: 'சொத்து அறிவிப்புகள்', icon: Bell, desktopOnly: true },
];

const MORE_LINKS: (NavLink & { detailEn: string; detailTa: string })[] = [
  { href: '/', en: 'Home', ta: 'முகப்பு', icon: Home, detailEn: 'Start exploring', detailTa: 'இங்கிருந்து தொடங்குங்கள்' },
  { href: '/alerts', en: 'Property alerts', ta: 'சொத்து அறிவிப்புகள்', icon: Bell, detailEn: 'Find your next match', detailTa: 'பொருத்தமான சொத்தை அறியுங்கள்' },
  { href: '/diaspora', en: 'Overseas owners', ta: 'புலம்பெயர் சேவைகள்', icon: Globe, detailEn: 'Manage your Jaffna home', detailTa: 'உங்கள் யாழ் வீட்டைப் பராமரிக்க' },
  { href: '/for-agents', en: 'For agents', ta: 'முகவர்களுக்கு', icon: Users, detailEn: 'List and connect', detailTa: 'பட்டியலிட்டு தொடர்பு கொள்ள' },
  { href: '/about', en: 'About us', ta: 'எங்களைப் பற்றி', icon: Compass, detailEn: 'Meet Yaal Nilam', detailTa: 'யாழ் நிலத்தை அறியுங்கள்' },
  { href: '/contact', en: 'Contact', ta: 'தொடர்பு', icon: Phone, detailEn: 'We are here to help', detailTa: 'உதவிக்கு எங்களை அணுகுங்கள்' },
];

function isCurrentPath(pathname: string, href: string) {
  if (href === '/properties') {
    return /^\/(?:properties|property|buy|rent|lands|real-estate|new-today)(?:\/|$)/.test(pathname);
  }
  return href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`);
}

export function Navbar() {
  const { locale, setLocale } = useStore();
  const tamil = locale === 'ta';
  const pathname = usePathname() || '/';
  const [isOpen, setIsOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => { setIsOpen(false); }, [pathname]);

  useEffect(() => {
    if (!isOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    const closeOutside = (event: Event) => {
      if (event.target instanceof Node && !navRef.current?.contains(event.target)) setIsOpen(false);
    };
    document.addEventListener('keydown', closeOnEscape);
    document.addEventListener('pointerdown', closeOutside);
    document.addEventListener('focusin', closeOutside);
    return () => {
      document.removeEventListener('keydown', closeOnEscape);
      document.removeEventListener('pointerdown', closeOutside);
      document.removeEventListener('focusin', closeOutside);
    };
  }, [isOpen]);

  const moreCurrent = MORE_LINKS.some((link) => link.href !== '/' && link.href !== '/alerts' && isCurrentPath(pathname, link.href));
  const addListingLabel = tamil ? 'சொத்தைச் சேர்க்கவும்' : 'Add listing';

  return (
    <header className="yn-site-header">
      <nav ref={navRef} aria-label={tamil ? 'முதன்மை வழிசெலுத்தல்' : 'Main navigation'} className="yn-nav-shell">
        <div className="yn-brand-row">
          <Link href="/" className="yn-brand" aria-label={tamil ? 'யாழ் நிலம் — முகப்பு' : 'Yaal Nilam — home'} aria-current={pathname === '/' ? 'page' : undefined}>
            <Image src="/logo-mark.png" alt="" aria-hidden="true" width={460} height={279} priority className="yn-brand-mark" />
            <span className="yn-brand-wordmark">
              <span className="yn-brand-title">{tamil ? 'யாழ் நிலம்' : 'Yaal Nilam'}</span>
              <span className="yn-brand-subtitle">{tamil ? 'யாழ்ப்பாணச் சொத்து சந்தை' : 'Jaffna property marketplace'}</span>
            </span>
          </Link>
          <div className="yn-header-actions">
            <button type="button" onClick={() => setLocale(tamil ? 'en' : 'ta')} lang={tamil ? 'en' : 'ta'} className="yn-language-button" aria-label={tamil ? 'Switch to English' : 'தமிழுக்கு மாற்றவும்'}>
              <Globe size={18} aria-hidden="true" />
              <span>{tamil ? 'EN' : 'தமிழ்'}</span>
            </button>
            <Link href="/add-listing" className="yn-header-add">
              <Plus size={20} aria-hidden="true" />
              <span>{addListingLabel}</span>
            </Link>
          </div>
        </div>

        <div className="yn-nav-tabs">
          {PRIMARY_LINKS.map(({ icon: Icon, ...link }) => (
            <Link key={link.href} href={link.href} onClick={() => setIsOpen(false)}
              aria-current={isCurrentPath(pathname, link.href) ? 'page' : undefined}
              aria-label={tamil && link.mobileTa ? `${link.mobileTa} — ${link.ta}` : undefined}
              className={`yn-nav-tab${link.desktopOnly ? ' yn-nav-tab-desktop' : ''}`}>
              <Icon aria-hidden="true" />
              <span className="yn-nav-label-full">{tamil ? link.ta : link.en}</span>
              <span className="yn-nav-label-compact">{tamil ? link.mobileTa || link.ta : link.en}</span>
            </Link>
          ))}
          <button ref={menuButtonRef} type="button" onClick={() => setIsOpen((open) => !open)}
            className={`yn-nav-tab yn-nav-more${moreCurrent ? ' yn-nav-more-current' : ''}`}
            aria-label={tamil ? (isOpen ? 'மேலும்: பட்டியலை மூடவும்' : 'மேலும்: பட்டியலைத் திறக்கவும்') : (isOpen ? 'Close more menu' : 'Open more menu')}
            aria-expanded={isOpen} aria-controls="mobile-navigation">
            {isOpen ? <X aria-hidden="true" /> : <ChevronDown aria-hidden="true" />}
            <span>{tamil ? 'மேலும்' : 'More'}</span>
          </button>
        </div>

        <div hidden={!isOpen} id="mobile-navigation" className="yn-nav-menu">
          <div className="yn-nav-menu-heading">
            <span>{tamil ? 'மேலும் கண்டறியுங்கள்' : 'More from Yaal Nilam'}</span>
            <span className="yn-nav-menu-caption">{tamil ? 'உங்கள் அடுத்த படி' : 'Your next step'}</span>
          </div>
          <div className="yn-nav-menu-grid">
            {MORE_LINKS.map(({ icon: Icon, ...link }) => (
              <Link key={link.href} href={link.href} className="yn-nav-menu-link" aria-current={isCurrentPath(pathname, link.href) ? 'page' : undefined} onClick={() => setIsOpen(false)}>
                <span className="yn-nav-menu-icon"><Icon size={21} aria-hidden="true" /></span>
                <span><span className="yn-nav-menu-title">{tamil ? link.ta : link.en}</span><span className="yn-nav-menu-detail">{tamil ? link.detailTa : link.detailEn}</span></span>
              </Link>
            ))}
          </div>
          <Link href="/add-listing" className="yn-nav-menu-add" onClick={() => setIsOpen(false)}>
            <Plus size={20} aria-hidden="true" /><span>{addListingLabel}</span><ArrowUpRight size={18} aria-hidden="true" />
          </Link>
        </div>
      </nav>
    </header>
  );
}
