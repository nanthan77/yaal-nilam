'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAdminStore } from '@/lib/store';
import { useState } from 'react';
import {
  LayoutDashboard,
  Building2,
  MessageSquare,
  ClipboardList,
  Sparkles,
  Users,
  UserCog,
  Wrench,
  FileText,
  MapPin,
  Image,
  Search,
  Megaphone,
  BarChart3,
  FileBarChart,
  Wallet,
  Bell,
  Settings,
  Shield,
  ScrollText,
  ChevronLeft,
  Menu,
  LogOut,
  User as UserIcon,
} from 'lucide-react';

interface MenuItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number | null;
}

interface MenuSection {
  section: string;
  items: MenuItem[];
}

export function Sidebar() {
  const { sidebarOpen, toggleSidebar, currentUser } = useAdminStore();
  const pathname = usePathname();
  const [hoveredIcon, setHoveredIcon] = useState<string | null>(null);

  const isActive = (path: string) => pathname.startsWith(path);

  const menuItems: MenuSection[] = [
    {
      section: 'OVERVIEW',
      items: [
        {
          label: 'Dashboard',
          href: '/dashboard',
          icon: LayoutDashboard,
        },
      ],
    },
    {
      section: 'PROPERTY MANAGEMENT',
      items: [
        {
          label: 'Listings',
          href: '/listings',
          icon: Building2,
          badge: 48,
        },
        {
          label: 'Inquiries',
          href: '/inquiries',
          icon: MessageSquare,
          badge: 18,
        },
        {
          label: 'Requirements',
          href: '/requirements',
          icon: ClipboardList,
          badge: 5,
        },
        {
          label: 'Matching Engine',
          href: '/matching',
          icon: Sparkles,
        },
      ],
    },
    {
      section: 'OPERATIONS',
      items: [
        {
          label: 'Agents',
          href: '/agents',
          icon: Users,
          badge: 8,
        },
        {
          label: 'Users',
          href: '/users',
          icon: UserCog,
        },
        {
          label: 'Maintenance',
          href: '/maintenance',
          icon: Wrench,
        },
      ],
    },
    {
      section: 'CONTENT & SEO',
      items: [
        {
          label: 'CMS',
          href: '/content',
          icon: FileText,
        },
        {
          label: 'Areas',
          href: '/areas',
          icon: MapPin,
        },
        {
          label: 'Media Library',
          href: '/media',
          icon: Image,
        },
        {
          label: 'SEO',
          href: '/seo',
          icon: Search,
        },
      ],
    },
    {
      section: 'BUSINESS',
      items: [
        {
          label: 'Promotions',
          href: '/promotions',
          icon: Megaphone,
        },
        {
          label: 'Analytics',
          href: '/analytics',
          icon: BarChart3,
        },
        {
          label: 'Reports',
          href: '/reports',
          icon: FileBarChart,
        },
        {
          label: 'Collections',
          href: '/collections',
          icon: Wallet,
        },
      ],
    },
    {
      section: 'SYSTEM',
      items: [
        {
          label: 'Notifications',
          href: '/notifications',
          icon: Bell,
          badge: 3,
        },
        {
          label: 'Settings',
          href: '/settings',
          icon: Settings,
        },
        {
          label: 'Roles & Permissions',
          href: '/roles',
          icon: Shield,
        },
        {
          label: 'Audit Logs',
          href: '/audit-logs',
          icon: ScrollText,
        },
      ],
    },
  ];

  const getBadgeColor = (label: string): string => {
    // Red for urgent items (low counts or pending)
    if (['Requirements', 'Notifications'].includes(label)) {
      return 'bg-danger text-white';
    }
    // Blue for info counts
    return 'bg-info text-white';
  };

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-white border-r border-navy-200 transition-all duration-300 z-40 flex flex-col ${
        sidebarOpen ? 'w-sidebar' : 'w-20'
      }`}
    >
      {/* Header */}
      <div className="h-16 border-b border-navy-200 flex items-center justify-between px-3">
        {sidebarOpen && (
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-10 h-10 bg-gradient-to-br from-navy-600 to-navy-700 rounded-lg flex items-center justify-center text-white font-bold text-base flex-shrink-0">
              YN
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-sm font-bold text-navy-900 truncate">Yaal Nilam</span>
              <span className="text-xs text-navy-500">Property Admin</span>
            </div>
          </div>
        )}
        <button
          onClick={toggleSidebar}
          className="p-2 hover:bg-sand-100 rounded-lg transition-colors flex-shrink-0"
          aria-label="Toggle sidebar"
          title={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          {sidebarOpen ? (
            <ChevronLeft className="w-5 h-5 text-navy-600" />
          ) : (
            <Menu className="w-5 h-5 text-navy-600" />
          )}
        </button>
      </div>

      {/* Menu */}
      <nav className="flex-1 overflow-y-auto py-4 px-2">
        {menuItems.map((group) => (
          <div key={group.section} className="mb-6">
            {sidebarOpen && (
              <h3 className="px-3 text-xs font-bold text-navy-700 uppercase tracking-widest mb-2 opacity-70">
                {group.section}
              </h3>
            )}
            <div className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                const tooltipId = `sidebar-tooltip-${item.label}`;

                return (
                  <div
                    key={item.href}
                    className="relative"
                    onMouseEnter={() => !sidebarOpen && setHoveredIcon(tooltipId)}
                    onMouseLeave={() => setHoveredIcon(null)}
                  >
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 group relative ${
                        active
                          ? 'bg-navy-50 text-navy-900 font-semibold border-l-4 border-navy-600'
                          : 'text-charcoal-700 hover:bg-sand-50'
                      }`}
                      title={item.label}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      {sidebarOpen && (
                        <div className="flex items-center justify-between flex-1 min-w-0">
                          <span className="text-sm font-medium truncate">{item.label}</span>
                          {item.badge && (
                            <span
                              className={`ml-2 px-2 py-0.5 text-xs font-bold rounded-full flex-shrink-0 ${getBadgeColor(
                                item.label
                              )}`}
                            >
                              {item.badge}
                            </span>
                          )}
                        </div>
                      )}
                    </Link>

                    {/* Tooltip for collapsed sidebar */}
                    {!sidebarOpen && hoveredIcon === tooltipId && (
                      <div className="absolute left-24 top-1/2 -translate-y-1/2 bg-charcoal-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap pointer-events-none z-50">
                        {item.label}
                        {item.badge && <span className="ml-1.5">({item.badge})</span>}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Quick Stats Widget */}
      {sidebarOpen && (
        <div className="mx-2 mb-4 p-3 bg-gradient-to-br from-navy-50 to-teal-50 rounded-lg border border-navy-200">
          <h4 className="text-xs font-bold text-navy-700 uppercase tracking-widest mb-2">
            Quick Stats
          </h4>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-charcoal-600">Occupancy</span>
              <span className="font-bold text-navy-900">94.2%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-charcoal-600">Revenue</span>
              <span className="font-bold text-teal-600">Rs.185K</span>
            </div>
          </div>
        </div>
      )}

      {/* User Profile Section */}
      <div className="border-t border-navy-200 p-3">
        {sidebarOpen ? (
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-navy-400 to-teal-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                {currentUser.name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-charcoal-900 truncate">{currentUser.name}</p>
                <p className="text-xs text-charcoal-500 truncate">
                  {currentUser.role === 'super_admin' ? 'Super Admin' : currentUser.role}
                </p>
              </div>
            </div>
            <button className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm text-danger hover:bg-danger hover:bg-opacity-10 rounded-lg transition-colors font-medium">
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        ) : (
          <div className="flex justify-center">
            <button
              className="w-8 h-8 bg-gradient-to-br from-navy-400 to-teal-500 rounded-full flex items-center justify-center text-white font-bold text-xs hover:shadow-lg transition-shadow"
              title={`${currentUser.name} - Super Admin`}
            >
              {currentUser.name.charAt(0).toUpperCase()}
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
