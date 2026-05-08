'use client';

import { create } from 'zustand';
import { ActivityCard, DailyReport } from '@/lib/types';

interface ReportStore {
  activities: ActivityCard[];
  report: DailyReport | null;
  isLoadingActivities: boolean;
  isGeneratingReport: boolean;
  setActivities: (cards: ActivityCard[]) => void;
  toggleIncluded: (id: string) => void;
  updateMemo: (id: string, memo: string) => void;
  addManualCard: (card: ActivityCard) => void;
  removeCard: (id: string) => void;
  setReport: (report: DailyReport) => void;
  setLoadingActivities: (v: boolean) => void;
  setGeneratingReport: (v: boolean) => void;
  reset: () => void;
}

export const useReportStore = create<ReportStore>((set) => ({
  activities: [],
  report: null,
  isLoadingActivities: false,
  isGeneratingReport: false,

  setActivities: (cards) => set({ activities: cards }),

  toggleIncluded: (id) =>
    set((state) => ({
      activities: state.activities.map((a) =>
        a.id === id ? { ...a, isIncluded: !a.isIncluded } : a
      ),
    })),

  updateMemo: (id, memo) =>
    set((state) => ({
      activities: state.activities.map((a) => (a.id === id ? { ...a, memo } : a)),
    })),

  addManualCard: (card) =>
    set((state) => ({ activities: [...state.activities, card] })),

  removeCard: (id) =>
    set((state) => ({ activities: state.activities.filter((a) => a.id !== id) })),

  setReport: (report) => set({ report }),

  setLoadingActivities: (v) => set({ isLoadingActivities: v }),

  setGeneratingReport: (v) => set({ isGeneratingReport: v }),

  reset: () => set({ activities: [], report: null }),
}));
