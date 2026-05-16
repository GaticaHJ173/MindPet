import { create } from 'zustand';

interface HabitosStatsStoreState {
  version: number;
  bumpVersion: () => void;
}

export const useHabitosStatsStore = create<HabitosStatsStoreState>((set) => ({
  version: 0,
  bumpVersion: () => set((s) => ({ version: s.version + 1 })),
}));

