'use client';

import { create } from 'zustand';
import { ActivityCard, DailyReport } from '@/lib/types';

export type DataSource = 'mock' | 'calendar';

interface ReportStore {
  activities: ActivityCard[];
  report: DailyReport | null;
  dataSource: DataSource;
  isLoadingActivities: boolean;
  isGeneratingReport: boolean;
  calendarError: string | null;
  setActivities: (cards: ActivityCard[]) => void;
  toggleIncluded: (id: string) => void;
  updateMemo: (id: string, memo: string) => void;
  addManualCard: (card: ActivityCard) => void;
  removeCard: (id: string) => void;
  setReport: (report: DailyReport) => void;
  setDataSource: (source: DataSource) => void;
  setLoadingActivities: (v: boolean) => void;
  setGeneratingReport: (v: boolean) => void;
  setCalendarError: (error: string | null) => void;
  reset: () => void;
}

export const useReportStore = create<ReportStore>((set) => ({
  activities: [],
  report: null,
  dataSource: 'mock',
  isLoadingActivities: false,
  isGeneratingReport: false,
  calendarError: null,

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

  setDataSource: (source) => set({ dataSource: source }),

  setLoadingActivities: (v) => set({ isLoadingActivities: v }),

  setGeneratingReport: (v) => set({ isGeneratingReport: v }),

  setCalendarError: (error) => set({ calendarError: error }),

  reset: () => set({ activities: [], report: null, dataSource: 'mock', calendarError: null }),
}));
