'use client';

import { useAdminStore } from '@/lib/store';
import {
  Menu,
  Search,
  Bell,
  Globe,
  LogOut,
  Settings as SettingsIcon,
  User as UserIcon,
} from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export function TopBar() {
  const { toggleSidebar, currentUser, locale, setLocale } = useAdminStore();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    localStorage.removeItem('admin_auth');
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_role');
    await signOut(auth).catch(() => undefined);
    setShowUserMenu(false);
    router.push('/login');
  };

  return (
    <header className="fixed top-0 left-sidebar right-0 h-16 bg-white border-b border-navy-200 z-30">
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
            <Search className="w-4 h-4 text-charcoal-400" />
            <input
              type="text"
              placeholder="Search listings, inquiries, agents..."
              className="input-field py-1.5 text-sm"
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
          <button className="relative p-2 hover:bg-sand-100 rounded-lg transition-colors">
            <Bell className="w-5 h-5 text-charcoal-700" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-danger rounded-full"></span>
          </button>

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
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="p-2 hover:bg-sand-100 rounded-lg transition-colors flex items-center gap-2"
            >
              <div className="w-8 h-8 bg-navy-200 rounded-full flex items-center justify-center text-navy-700 font-bold text-sm">
                {currentUser.name.charAt(0)}
              </div>
              <div className="hidden md:flex flex-col text-left">
                <span className="text-xs font-semibold text-charcoal-900">
                  {currentUser.name}
                </span>
                <span className="text-xs text-charcoal-500">
                  {currentUser.role === 'super_admin' ? 'Super Admin' : currentUser.role}
                </span>
              </div>
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-card-elevated border border-navy-100 py-1 z-50">
                <div className="px-4 py-2 border-b border-sand-200">
                  <p className="text-sm font-medium text-charcoal-900">{currentUser.name}</p>
                  <p className="text-xs text-charcoal-500">{currentUser.email}</p>
                </div>

                <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-charcoal-700 hover:bg-sand-50 transition-colors">
                  <UserIcon className="w-4 h-4" />
                  Profile
                </button>

                <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-charcoal-700 hover:bg-sand-50 transition-colors">
                  <SettingsIcon className="w-4 h-4" />
                  Settings
                </button>

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
