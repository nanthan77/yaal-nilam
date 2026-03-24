'use client';

import { Sidebar } from '@/components/Sidebar';
import { TopBar } from '@/components/TopBar';
import { useAdminStore } from '@/lib/store';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { sidebarOpen } = useAdminStore();

  return (
    <div className="min-h-screen bg-sand-50">
      <Sidebar />
      <TopBar />

      <main
        className={`pt-16 transition-all duration-300 ${
          sidebarOpen ? 'pl-sidebar' : 'pl-20'
        }`}
      >
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
