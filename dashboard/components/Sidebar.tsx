'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAdminStore } from '@/lib/store';
import { MOCK_LISTINGS, MOCK_INQUIRIES, MOCK_REQUIREMENTS, MOCK_AGENTS, MOCK_NOTIFICATIONS } from '@/lib/mock-data';
import {
  LayoutDashboard,
  Home,
  MessageSquare,
  CheckCircle,
  Zap,
  Users,
  UserCheck,
  FileText,
  MapPin,
  Image,
  Search,
  TrendingUp,
  FileBarChart,
  Bell,
  Settings,
  Shield,
  BookOpen,
  ChevronLeft,
  Menu,
  MessageCircle,
} from 'lucide-react';

export function Sidebar() {
  const { sidebarOpen, toggleSidebar, setSidebarOpen } = useAdminStore();
  const pathname = usePathname();

  // Below lg the sidebar is an off-canvas drawer (starts hidden); at lg+ it is
  // a persistent rail. Align the auto-collapse breakpoint with the `lg:` styles.
  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 1023px)');
    const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
      if (e.matches) {
        setSidebarOpen(false);
      }
    };
    handleChange(mediaQuery);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [setSidebarOpen]);

  // On mobile, close the drawer after navigating so it doesn't cover the page.
  const closeOnMobile = () => {
    if (typeof window !== 'undefined' && window.matchMedia('(max-width: 1023px)').matches) {
      setSidebarOpen(false);
    }
  };

  const isActive = (path: string) => pathname.startsWith(path);

  const menuItems = [
    {
      section: 'OVERVIEW',
      items: [
        {
          label: 'Dashboard',
          href: '/',
          icon: LayoutDashboard,
          badge: null,
        },
      ],
    },
    {
      section: 'OPERATIONS',
      items: [
        {
          label: 'Listings',
          href: '/listings',
          icon: Home,
          badge: MOCK_LISTINGS.length,
        },
        {
          label: 'Inquiries',
          href: '/inquiries',
          icon: MessageSquare,
          badge: MOCK_INQUIRIES.length,
        },
        {
          label: 'Requirements',
          href: '/requirements',
          icon: CheckCircle,
          badge: MOCK_REQUIREMENTS.length,
        },        {
          label: 'Matching Engine',
          href: '/matching',
          icon: Zap,
          badge: null,
        },
      ],
    },
    {
      section: 'MANAGEMENT',
      items: [
        {
          label: 'Agents',
          href: '/agents',
          icon: Users,
          badge: MOCK_AGENTS.length,
        },
        {
          label: 'Users',
          href: '/users',
          icon: UserCheck,
          badge: null,
        },
      ],
    },
    {
      section: 'WHATSAPP CRM',
      items: [
        {
          label: 'WhatsApp Inbox',
          href: '/whatsapp',
          icon: MessageCircle,
          badge: null,
        },
      ],
    },
    {
      section: 'CONTENT',
      items: [
        {
          label: 'CMS',
          href: '/content',
          icon: FileText,
          badge: null,
        },        {
          label: 'Areas',
          href: '/areas',
          icon: MapPin,
          badge: null,
        },
        {
          label: 'Media Library',
          href: '/media',
          icon: Image,
          badge: null,
        },
        {
          label: 'SEO',
          href: '/seo',
          icon: Search,
          badge: null,
        },
      ],
    },
    {
      section: 'BUSINESS',
      items: [
        {
          label: 'Promotions',
          href: '/promotions',
          icon: TrendingUp,
          badge: null,
        },
        {
          label: 'Analytics',
          href: '/analytics',
          icon: FileBarChart,
          badge: null,
        },        {
          label: 'Reports',
          href: '/reports',
          icon: FileBarChart,
          badge: null,
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
          badge: MOCK_NOTIFICATIONS.filter(n => !n.read).length,
        },
        {
          label: 'Settings',
          href: '/settings',
          icon: Settings,
          badge: null,
        },
        {
          label: 'Roles & Permissions',
          href: '/roles',
          icon: Shield,
          badge: null,
        },
        {
          label: 'Audit Logs',
          href: '/audit-logs',
          icon: BookOpen,
          badge: null,
        },
      ],
    },
  ];
  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-white border-r border-navy-200 transition-all duration-300 z-50 w-sidebar ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 ${sidebarOpen ? 'lg:w-sidebar' : 'lg:w-20'}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-navy-200">
        {sidebarOpen && (
          <div className="flex items-center gap-2">
            <img src="/logo-mark.png" alt="" aria-hidden="true" className="w-9 h-9 object-contain shrink-0" />
            <div className="flex flex-col">
              <span className="text-sm font-bold text-navy-900">Yaal Nilam</span>
              <span className="text-xs text-navy-500">Admin</span>
            </div>
          </div>
        )}
        <button
          onClick={toggleSidebar}
          className="p-1 hover:bg-sand-100 rounded-lg transition-colors"
          aria-label="Toggle sidebar"
        >
          {sidebarOpen ? (
            <ChevronLeft className="w-5 h-5 text-navy-600" />
          ) : (
            <Menu className="w-5 h-5 text-navy-600" />
          )}
        </button>
      </div>
      {/* Menu */}
      <nav className="flex-1 overflow-y-auto py-4">
        {menuItems.map((group) => (
          <div key={group.section} className="mb-6">
            {sidebarOpen && (
              <h3 className="px-4 text-xs font-semibold text-charcoal-500 uppercase tracking-wider mb-3">
                {group.section}
              </h3>
            )}
            {group.items.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeOnMobile}
                  className={`flex items-center gap-3 px-4 py-2.5 mx-2 rounded-lg transition-all duration-150 ${
                    active
                      ? 'sidebar-link-active bg-navy-100 text-navy-700 border-l-4 border-navy-600'
                      : 'text-charcoal-700 hover:bg-sand-50'
                  }`}
                  title={item.label}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {sidebarOpen && (
                    <div className="flex items-center justify-between flex-1 min-w-0">
                      <span className="text-sm font-medium truncate">{item.label}</span>
                      {item.badge && (
                        <span className="ml-2 px-2 py-0.5 bg-info text-white text-xs font-semibold rounded-full flex-shrink-0">
                          {item.badge}
                        </span>
                      )}
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>
      {/* User Profile */}
      {sidebarOpen && (
        <div className="border-t border-navy-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-navy-200 rounded-full flex items-center justify-center text-navy-700 font-bold text-sm flex-shrink-0">
              N
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-charcoal-900 truncate">Nanthan</p>
              <p className="text-xs text-charcoal-500 truncate">Super Admin</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}