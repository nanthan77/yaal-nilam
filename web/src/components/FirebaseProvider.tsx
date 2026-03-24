// @ts-nocheck
'use client';
import { useEffect } from 'react';

export default function FirebaseProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    import('@/lib/firebase').catch(() => {});
  }, []);
  return <>{children}</>;
}