import { create } from 'zustand';

export type Locale = 'en' | 'ta';

export interface CurrentUser {
  name: string;
  role: string;
  email: string;
  avatar: string | null;
}

export interface AdminStore {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  currentUser: CurrentUser;
  setCurrentUser: (user: CurrentUser) => void;
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

export const useAdminStore = create<AdminStore>((set) => ({
  sidebarOpen: true,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open: boolean) => set({ sidebarOpen: open }),
  currentUser: {
    name: 'Nanthan',
    role: 'super_admin',
    email: 'nanthan77@gmail.com',
    avatar: null,
  },
  setCurrentUser: (currentUser) => set({ currentUser }),
  locale: 'en',
  setLocale: (locale: Locale) => set({ locale }),
}));
