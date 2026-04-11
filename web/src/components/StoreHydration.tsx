'use client';

import { useEffect, useState } from 'react';

/**
 * Suppresses hydration warnings by delaying client-side rendering
 * until after the first mount. This avoids mismatches caused by
 * Zustand rehydrating locale from localStorage.
 */
export default function StoreHydration({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div key={mounted ? 'hydrated' : 'ssr'} suppressHydrationWarning>
      {children}
    </div>
  );
}
