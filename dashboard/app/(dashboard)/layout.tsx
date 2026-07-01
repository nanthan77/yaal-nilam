'use client';

import { useEffect, useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { TopBar } from '@/components/TopBar';
import { useAdminStore } from '@/lib/store';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase';

const ADMIN_ROLES = ['super_admin', 'admin', 'listing_manager', 'lead_manager', 'content_manager'];

// Bootstrap super-admin allowlist. Configurable via env for production; defaults
// to the project owner. Exact, case-insensitive match — NOT a prefix, so
// look-alike addresses like "nanthan77@attacker.com" cannot escalate.
const SUPER_ADMIN_EMAILS = (process.env.NEXT_PUBLIC_SUPERADMIN_EMAILS || 'nanthan77@gmail.com')
  .split(',')
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

const isSuperAdminEmail = (email?: string | null) =>
  !!email && SUPER_ADMIN_EMAILS.includes(email.toLowerCase());

async function getAccessFromAdminUserRecord(email?: string | null) {
  if (!email) return '';
  const snap = await getDoc(doc(db, 'admin_users', email.toLowerCase()));
  if (!snap.exists()) return '';
  const data = snap.data() as any;
  return data?.status === 'active' && ADMIN_ROLES.includes(data?.role) ? data.role : '';
}

async function resolveAdminAccess(user: any) {
  const token = await user.getIdTokenResult(true);
  const claimRole = typeof token.claims.role === 'string' ? token.claims.role : '';
  const superAdmin = isSuperAdminEmail(user.email);
  const recordRole = claimRole || (superAdmin ? 'super_admin' : await getAccessFromAdminUserRecord(user.email));
  const allowed = token.claims.admin === true || ADMIN_ROLES.includes(recordRole) || superAdmin;
  return { allowed, role: superAdmin ? 'super_admin' : (recordRole || 'admin') };
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { sidebarOpen, setSidebarOpen, setCurrentUser } = useAdminStore();
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setCheckingAuth(false);
        router.replace('/login');
        return;
      }

      const access = await resolveAdminAccess(user);

      if (!access.allowed) {
        await signOut(auth);
        setCheckingAuth(false);
        router.replace('/login');
        return;
      }

      setCurrentUser({
        name: user.displayName || user.email?.split('@')[0] || 'Admin',
        role: access.role,
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

      {/* Mobile drawer backdrop — tap to close */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          aria-hidden="true"
        />
      )}

      <main
        className={`pt-16 transition-all duration-300 pl-0 ${
          sidebarOpen ? 'lg:pl-sidebar' : 'lg:pl-20'
        }`}
      >
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
