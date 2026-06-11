import { create } from "zustand";

export type DateRangePreset = "today" | "7d" | "30d" | "90d" | "ytd";

interface DashboardState {
  range: DateRangePreset;
  setRange: (range: DateRangePreset) => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  range: "30d",
  setRange: (range) => set({ range }),
}));
