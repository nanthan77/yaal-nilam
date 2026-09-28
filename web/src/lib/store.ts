/**
 * Global state management using Zustand
 */

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { Locale } from "./translations";

interface User {
  id: string;
  name: string;
  phone: string;
  email: string;
  user_type: "buyer" | "seller" | "agent" | "admin";
}

interface AppState {
  // Locale
  locale: Locale;
  setLocale: (locale: Locale) => void;

  // Auth
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;

  // UI
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  loginModalOpen: boolean;
  setLoginModalOpen: (open: boolean) => void;
  signupModalOpen: boolean;
  setSignupModalOpen: (open: boolean) => void;

  // Filters
  filters: {
    type?: string;
    intent?: string;
    min_price?: number;
    max_price?: number;
    bedrooms?: number;
    division?: string;
    search?: string;
  };
  setFilters: (filters: Partial<AppState["filters"]>) => void;
  clearFilters: () => void;

  // Compare (max 3)
  compareIds: string[];
  toggleCompare: (id: string) => void;
  clearCompare: () => void;
}

function persistedPreferences(value: unknown): Pick<AppState, "locale" | "compareIds"> {
  const state = value && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {};
  const compareIds = Array.isArray(state.compareIds)
    ? Array.from(new Set(state.compareIds
      .filter((id): id is string => typeof id === "string" && id.trim().length > 0)
      .map((id) => id.trim()))).slice(0, 3)
    : [];
  return { locale: state.locale === "en" ? "en" : "ta", compareIds };
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      // Tamil first for local visitors; persisted language preference still wins.
      locale: "ta",
      setLocale: (locale) => set({ locale }),

      // Auth
      user: null,
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: !!user }),

      // UI state
      mobileMenuOpen: false,
      setMobileMenuOpen: (mobileMenuOpen) => set({ mobileMenuOpen }),
      loginModalOpen: false,
      setLoginModalOpen: (loginModalOpen) => set({ loginModalOpen }),
      signupModalOpen: false,
      setSignupModalOpen: (signupModalOpen) => set({ signupModalOpen }),

      // Property filters
      filters: {},
      setFilters: (newFilters) =>
        set((state) => ({ filters: { ...state.filters, ...newFilters } })),
      clearFilters: () => set({ filters: {} }),

      // Compare list (max 3)
      compareIds: [],
      toggleCompare: (id) =>
        set((state) => {
          if (state.compareIds.includes(id)) {
            return { compareIds: state.compareIds.filter((x) => x !== id) };
          }
          if (state.compareIds.length >= 3) return state;
          return { compareIds: [...state.compareIds, id] };
        }),
      clearCompare: () => set({ compareIds: [] }),
    }),
    {
      name: "yaal-nilam-public-store",
      storage: createJSONStorage(() => localStorage),
      // The existing live site wrote version 2. Preserve explicit preferences
      // from earlier releases without restoring cached account or UI state.
      version: 2,
      migrate: (persistedState) => persistedPreferences(persistedState),
      merge: (persistedState, currentState) => ({
        ...currentState,
        ...persistedPreferences(persistedState),
      }),
      partialize: (state) => ({ locale: state.locale, compareIds: state.compareIds }),
      skipHydration: true,
    }
  )
);
