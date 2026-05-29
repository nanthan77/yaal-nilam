'use client';

import { useEffect, useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { TopBar } from '@/components/TopBar';
import { useAdminStore } from '@/lib/store';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';

const ADMIN_ROLES = ['super_admin', 'admin', 'listing_manager', 'lead_manager', 'content_manager', 'viewer'];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { sidebarOpen, setCurrentUser } = useAdminStore();
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setCheckingAuth(false);
        router.replace('/login');
        return;
      }

      const token = await user.getIdTokenResult(true);
      const role = typeof token.claims.role === 'string' ? token.claims.role : '';
      const allowed = token.claims.admin === true || ADMIN_ROLES.includes(role);

      if (!allowed) {
        await signOut(auth);
        setCheckingAuth(false);
        router.replace('/login');
        return;
      }

      setCurrentUser({
        name: user.displayName || user.email?.split('@')[0] || 'Admin',
        role: role || 'admin',
        email: user.email || '',
        avatar: user.photoURL || null,
      });
      setCheckingAuth(false);
    });

    return unsubscribe;
  }, [router, setCurrentUser]);

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-sand-50 flex items-center justify-center">
        <div className="rounded-lg bg-white border border-navy-100 px-6 py-4 text-sm font-semibold text-charcoal-700 shadow-sm">
          Checking admin access...
        </div>
      </div>
    );
  }

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
