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
  email?: string;
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
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      // Locale — default English, can toggle to Tamil
      locale: "en",
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
    }),
    {
      name: "yaal-nilam-public-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ locale: state.locale }),
      skipHydration: true,
    }
  )
);
