'use client';

import { useAdminStore } from '@/lib/store';
import { usePathname } from 'next/navigation';
import {
  Menu,
  Search,
  Bell,
  Globe,
  LogOut,
  Settings as SettingsIcon,
  User as UserIcon,
  HelpCircle,
  Command,
} from 'lucide-react';
import { useState } from 'react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function TopBar() {
  const { toggleSidebar, currentUser, locale, setLocale } = useAdminStore();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const pathname = usePathname();

  // Generate breadcrumbs based on pathname
  const getBreadcrumbs = (): BreadcrumbItem[] => {
    const segments = pathname.split('/').filter(Boolean);

    if (segments.length === 0 || segments[0] === 'dashboard') {
      return [{ label: 'Dashboard', href: '/dashboard' }];
    }

    const breadcrumbs: BreadcrumbItem[] = [{ label: 'Dashboard', href: '/dashboard' }];

    // Map path to readable labels
    const pathLabels: Record<string, string> = {
      listings: 'Listings',
      inquiries: 'Inquiries',
      requirements: 'Requirements',
      matching: 'Matching Engine',
      agents: 'Agents',
      users: 'Users',
      maintenance: 'Maintenance',
      content: 'CMS',
      areas: 'Areas',
      media: 'Media Library',
      seo: 'SEO',
      promotions: 'Promotions',
      analytics: 'Analytics',
      reports: 'Reports',
      collections: 'Collections',
      notifications: 'Notifications',
      settings: 'Settings',
      roles: 'Roles & Permissions',
      'audit-logs': 'Audit Logs',
    };

    if (pathLabels[segments[0]]) {
      breadcrumbs.push({ label: pathLabels[segments[0]], href: `/${segments[0]}` });
    }

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();
  const unreadNotifications = 3;

  return (
    <header className="fixed top-0 left-20 right-0 h-16 bg-white border-b border-navy-200 z-30 backdrop-blur-sm bg-opacity-95">
      <div className="h-full px-6 flex items-center justify-between gap-6">
        {/* Left Section: Hamburger & Search */}
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <button
            onClick={toggleSidebar}
            className="p-2 hover:bg-sand-100 rounded-lg transition-colors flex-shrink-0"
            aria-label="Toggle sidebar"
            title="Toggle sidebar"
          >
            <Menu className="w-5 h-5 text-charcoal-700" />
          </button>

          {/* Global Search Bar */}
          <div className="hidden lg:flex items-center gap-2 flex-1 max-w-md px-3 py-2 bg-sand-50 rounded-lg border border-navy-100 hover:border-navy-300 transition-colors">
            <Search className="w-4 h-4 text-charcoal-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search listings, inquiries, agents..."
              className="flex-1 bg-transparent text-sm outline-none placeholder-charcoal-400 text-charcoal-900"
            />
            <span className="text-xs text-charcoal-400 ml-2 flex items-center gap-0.5 flex-shrink-0">
              <Command className="w-3 h-3" />K
            </span>
          </div>

          {/* Mobile Search Toggle */}
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="lg:hidden p-2 hover:bg-sand-100 rounded-lg transition-colors flex-shrink-0"
            aria-label="Open search"
            title="Open search"
          >
            <Search className="w-5 h-5 text-charcoal-700" />
          </button>
        </div>

        {/* Center Section: Breadcrumb Trail */}
        <div className="hidden md:flex items-center gap-2 flex-1 justify-center min-w-0">
          {breadcrumbs.map((crumb, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <a
                href={crumb.href}
                className="text-charcoal-600 hover:text-navy-600 transition-colors truncate"
              >
                {crumb.label}
              </a>
              {index < breadcrumbs.length - 1 && (
                <span className="text-charcoal-400">/</span>
              )}
            </div>
          ))}
        </div>

        {/* Right Section: Actions & User Menu */}
        <div className="flex items-center gap-1">
          {/* Add Listing Button */}
          <button className="hidden sm:flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-lg transition-colors">
            <span>+ Add Listing</span>
          </button>

          {/* Notification Bell */}
          <div className="relative group">
            <button
              className="relative p-2 hover:bg-sand-100 rounded-lg transition-colors"
              aria-label="Notifications"
              title="Notifications"
            >
              <Bell className="w-5 h-5 text-charcoal-700" />
              {unreadNotifications > 0 && (
                <div className="absolute top-1 right-1">
                  <span className="flex h-2 w-2">
                    <span className="animate-pulse absolute inline-flex h-full w-full rounded-full bg-danger opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-danger"></span>
                  </span>
                </div>
              )}
            </button>

            {/* Notification Dropdown Hint */}
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-card-elevated border border-navy-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none group-hover:pointer-events-auto z-50 p-4">
              <h3 className="text-sm font-semibold text-charcoal-900 mb-3">
                Notifications ({unreadNotifications})
              </h3>
              <div className="space-y-2 text-sm">
                <div className="p-2 bg-danger bg-opacity-10 rounded border border-danger border-opacity-20">
                  <p className="text-danger font-medium">New Inquiry</p>
                  <p className="text-charcoal-600 text-xs">Premium apartment listing request</p>
                </div>
              </div>
            </div>
          </div>

          {/* Language Toggle */}
          <div className="flex items-center bg-sand-100 rounded-lg p-0.5 ml-2">
            <button
              onClick={() => setLocale('en')}
              className={`px-2.5 py-1 text-xs font-semibold rounded transition-colors ${
                locale === 'en'
                  ? 'bg-white text-navy-600 shadow-sm'
                  : 'text-charcoal-600 hover:text-navy-600'
              }`}
              title="English"
            >
              EN
            </button>
            <div className="w-px h-4 bg-navy-200"></div>
            <button
              onClick={() => setLocale('ta')}
              className={`px-2.5 py-1 text-xs font-semibold rounded transition-colors ${
                locale === 'ta'
                  ? 'bg-white text-navy-600 shadow-sm'
                  : 'text-charcoal-600 hover:text-navy-600'
              }`}
              title="Tamil"
            >
              தமிழ்
            </button>
          </div>

          {/* User Avatar Dropdown */}
          <div className="relative ml-2">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="p-1 hover:bg-sand-100 rounded-lg transition-colors flex items-center gap-2 group"
              aria-label="User menu"
              title={currentUser.name}
            >
              <div className="w-8 h-8 bg-gradient-to-br from-navy-400 to-teal-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 group-hover:shadow-md transition-shadow">
                {currentUser.name.charAt(0).toUpperCase()}
              </div>
              <div className="hidden sm:flex flex-col text-left text-xs">
                <span className="font-semibold text-charcoal-900">{currentUser.name}</span>
                <span className="text-charcoal-500">
                  {currentUser.role === 'super_admin' ? 'Super Admin' : currentUser.role}
                </span>
              </div>
            </button>

            {/* User Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-card-elevated border border-navy-100 py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-4 py-3 border-b border-sand-200">
                  <p className="text-sm font-semibold text-charcoal-900">{currentUser.name}</p>
                  <p className="text-xs text-charcoal-500 mt-0.5">{currentUser.email}</p>
                </div>

                <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-charcoal-700 hover:bg-sand-50 transition-colors">
                  <UserIcon className="w-4 h-4" />
                  Profile
                </button>

                <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-charcoal-700 hover:bg-sand-50 transition-colors">
                  <SettingsIcon className="w-4 h-4" />
                  Settings
                </button>

                <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-charcoal-700 hover:bg-sand-50 transition-colors">
                  <HelpCircle className="w-4 h-4" />
                  Help Center
                </button>

                <div className="border-t border-sand-200 my-1"></div>

                <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-danger hover:bg-danger hover:bg-opacity-10 transition-colors font-medium">
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Search Panel */}
      {showSearch && (
        <div className="lg:hidden border-t border-navy-200 bg-sand-50 px-4 py-3">
          <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg border border-navy-100">
            <Search className="w-4 h-4 text-charcoal-400" />
            <input
              type="text"
              placeholder="Search listings, inquiries, agents..."
              className="flex-1 bg-transparent text-sm outline-none placeholder-charcoal-400"
              autoFocus
            />
          </div>
        </div>
      )}
    </header>
  );
}
