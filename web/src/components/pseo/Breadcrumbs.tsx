'use client';

import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { useStore } from '@/lib/store';
import { t } from '@/lib/translations';

interface BreadcrumbItem {
  name: string;
  href?: string;
}

export default function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  const { locale } = useStore();

  return (
    <nav aria-label="Breadcrumb" className="py-3 px-4 text-sm text-gray-500">
      <ol className="flex flex-wrap items-center gap-1">
        <li className="flex items-center">
          <Link href="/" className="hover:text-teal-700 transition-colors flex items-center gap-1">
            <Home className="w-3.5 h-3.5" />
            <span>{t('nav.home', locale)}</span>
          </Link>
        </li>
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-1">
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            {item.href ? (
              <Link href={item.href} className="hover:text-teal-700 transition-colors">
                {item.name}
              </Link>
            ) : (
              <span className="text-gray-800 font-medium">{item.name}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
