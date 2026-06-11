import { create } from "zustand";

interface UIState {
  sidebarCollapsed: boolean;
  mobileSidebarOpen: boolean;
  setSidebarCollapsed: (v: boolean) => void;
  setMobileSidebarOpen: (v: boolean) => void;
  toggleSidebar: () => void;
}

export const useUIStore = create<UIState>((set, get) => ({
  sidebarCollapsed: false,
  mobileSidebarOpen: false,
  setSidebarCollapsed: (v) => set({ sidebarCollapsed: v }),
  setMobileSidebarOpen: (v) => set({ mobileSidebarOpen: v }),
  toggleSidebar: () => set({ sidebarCollapsed: !get().sidebarCollapsed }),
}));
