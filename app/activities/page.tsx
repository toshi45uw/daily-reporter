'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { StepIndicator } from '@/components/StepIndicator';
import { ActivityCardItem } from '@/components/ActivityCardItem';
import { ManualCardForm } from '@/components/ManualCardForm';
import { useReportStore } from '@/store/report-store';
import { workspaceDataSource } from '@/lib/google-workspace';
import { reportGenerator } from '@/lib/ai-generator';

export default function ActivitiesPage() {
  const router = useRouter();
  const {
    activities,
    isLoadingActivities,
    isGeneratingReport,
    setActivities,
    setReport,
    setLoadingActivities,
    setGeneratingReport,
  } = useReportStore();

  useEffect(() => {
    if (activities.length > 0) return;

    async function load() {
      setLoadingActivities(true);
      try {
        const today = new Date().toISOString().split('T')[0];
        const cards = await workspaceDataSource.fetchTodayActivities(today);
        setActivities(cards);
      } finally {
        setLoadingActivities(false);
      }
    }

    load();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const includedCount = activities.filter((a) => a.isIncluded).length;

  async function handleGenerate() {
    setGeneratingReport(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      const result = await reportGenerator.generateReport(activities, today);
      setReport({
        id: `report-${Date.now()}`,
        ...result,
        activities: activities.filter((a) => a.isIncluded),
      });
      router.push('/report');
    } finally {
      setGeneratingReport(false);
    }
  }

  const factCards = activities.filter((a) => a.confidence === 'fact');
  const inferredCards = activities.filter((a) => a.confidence === 'inferred');

  return (
    <div>
      <StepIndicator currentStep={2} />

      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-bold text-gray-900">今日の活動</h1>
          <p className="text-sm text-gray-500 mt-0.5">日報に含める活動を選択してください</p>
        </div>
        <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
          {includedCount}件選択中
        </span>
      </div>

      {isLoadingActivities ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-100 rounded-lg animate-pulse" />
          ))}
          <p className="text-center text-sm text-gray-400 py-2">
            Google Workspaceから活動を取得中…
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {factCards.length > 0 && (
            <section>
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />
                確認された活動
              </h2>
              <div className="space-y-2">
                {factCards.map((card) => (
                  <ActivityCardItem key={card.id} card={card} />
                ))}
              </div>
            </section>
          )}

          {inferredCards.length > 0 && (
            <section>
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-orange-400 inline-block" />
                推測された活動（要確認）
              </h2>
              <div className="space-y-2">
                {inferredCards.map((card) => (
                  <ActivityCardItem key={card.id} card={card} />
                ))}
              </div>
            </section>
          )}

          <section>
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
              手動追加
            </h2>
            <ManualCardForm />
          </section>
        </div>
      )}

      <div className="mt-8 pt-6 border-t border-gray-200">
        <button
          onClick={handleGenerate}
          disabled={includedCount === 0 || isGeneratingReport}
          className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors active:scale-[0.99] text-sm"
        >
          {isGeneratingReport ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              日報を生成中…
            </span>
          ) : includedCount === 0 ? (
            '活動を1件以上選択してください'
          ) : (
            `${includedCount}件の活動から日報を生成する →`
          )}
        </button>
      </div>
    </div>
  );
}
