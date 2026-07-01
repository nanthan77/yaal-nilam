'use client';

import { useAdminStore } from '@/lib/store';
import {
  Menu,
  Search,
  Bell,
  Globe,
  LogOut,
  Settings as SettingsIcon,
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import Link from 'next/link';

export function TopBar() {
  const { toggleSidebar, currentUser, locale, setLocale, sidebarOpen } = useAdminStore();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = async () => {
    localStorage.removeItem('admin_auth');
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_role');
    await signOut(auth).catch(() => undefined);
    setShowUserMenu(false);
    router.push('/login');
  };

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      router.push(`/listings?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const userName = currentUser?.name || '—';
  const userRole = currentUser?.role || '—';
  const userEmail = currentUser?.email || '';
  const initials = userName !== '—' ? userName[0].toUpperCase() : '?';

  return (
    <header
      className={`fixed top-0 right-0 h-16 bg-white border-b border-navy-200 z-30 transition-all duration-300 left-0 ${
        sidebarOpen ? 'lg:left-sidebar' : 'lg:left-20'
      }`}
    >
      <div className="h-full px-6 flex items-center justify-between gap-4">
        {/* Left: Hamburger & Search */}
        <div className="flex items-center gap-4 flex-1">
          <button
            onClick={toggleSidebar}
            className="p-2 hover:bg-sand-100 rounded-lg transition-colors"
            aria-label="Toggle sidebar"
          >
            <Menu className="w-5 h-5 text-charcoal-700" />
          </button>
          <div className="hidden md:flex items-center gap-2 flex-1 max-w-sm">
            <Search className="w-4 h-4 text-charcoal-400 flex-shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
              placeholder="Search listings… (Enter)"
              className="input-field py-1.5 text-sm w-full focus:outline-none"
            />
          </div>
        </div>

        {/* Right: Notifications, Language, User */}
        <div className="flex items-center gap-2">
          {/* View Live Site */}
          <a
            href="https://yaal-nilam.web.app"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-teal-50 text-teal-700 rounded-lg text-xs font-semibold hover:bg-teal-100 transition-colors"
          >
            <Globe className="w-3.5 h-3.5" />
            View Live Site
          </a>

          {/* Notification Bell */}
          <Link
            href="/notifications"
            className="relative p-2 hover:bg-sand-100 rounded-lg transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5 text-charcoal-700" />
          </Link>

          {/* Language Toggle */}
          <div className="flex items-center bg-sand-100 rounded-lg p-0.5">
            <button
              onClick={() => setLocale('en')}
              className={`px-2 py-1 text-xs font-medium rounded transition-colors ${
                locale === 'en'
                  ? 'bg-white text-navy-600 shadow-sm'
                  : 'text-charcoal-600 hover:text-navy-600'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLocale('ta')}
              className={`px-2 py-1 text-xs font-medium rounded transition-colors ${
                locale === 'ta'
                  ? 'bg-white text-navy-600 shadow-sm'
                  : 'text-charcoal-600 hover:text-navy-600'
              }`}
            >
              தமிழ்
            </button>
          </div>

          {/* User Dropdown */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="p-2 hover:bg-sand-100 rounded-lg transition-colors flex items-center gap-2"
              aria-label="Account menu"
              aria-haspopup="true"
              aria-expanded={showUserMenu}
            >
              <div className="w-8 h-8 bg-navy-200 rounded-full flex items-center justify-center text-navy-700 font-bold text-sm">
                {initials}
              </div>
              <div className="hidden md:flex flex-col text-left">
                <span className="text-xs font-semibold text-charcoal-900">{userName}</span>
                <span className="text-xs text-charcoal-500 capitalize">{userRole.replace(/_/g, ' ')}</span>
              </div>
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-card-elevated border border-navy-100 py-1 z-50">
                <div className="px-4 py-2 border-b border-sand-200">
                  <p className="text-sm font-medium text-charcoal-900">{userName}</p>
                  <p className="text-xs text-charcoal-500 truncate">{userEmail}</p>
                </div>

                <Link
                  href="/settings"
                  onClick={() => setShowUserMenu(false)}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-charcoal-700 hover:bg-sand-50 transition-colors"
                >
                  <SettingsIcon className="w-4 h-4" />
                  Settings
                </Link>

                <div className="border-t border-sand-200 my-1"></div>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-danger hover:bg-danger hover:bg-opacity-10 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
