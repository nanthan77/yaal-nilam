'use client';

import { useEffect } from 'react';
import { useStore } from '@/lib/store';

/**
 * Triggers Zustand persist rehydration from localStorage
 * inside a useEffect (after mount), avoiding the
 * "Cannot update component while rendering" error.
 */
export default function StoreInitializer() {
  useEffect(() => {
    useStore.persist.rehydrate();
  }, []);

  return null;
}
