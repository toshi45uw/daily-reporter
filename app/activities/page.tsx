'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { StepIndicator } from '@/components/StepIndicator';
import { ActivityCardItem } from '@/components/ActivityCardItem';
import { ManualCardForm } from '@/components/ManualCardForm';
import { useReportStore } from '@/store/report-store';
import { workspaceDataSource } from '@/lib/google-workspace';
import { reportGenerator } from '@/lib/ai-generator';

const CALENDAR_ERROR_MESSAGES: Record<string, string> = {
  NOT_AUTHENTICATED: 'Googleログインが必要です。ホームに戻ってログインしてください。',
  NO_ACCESS_TOKEN: 'アクセストークンを取得できませんでした。再ログインしてください。',
  INSUFFICIENT_SCOPE: 'カレンダーの読み取り権限がありません。再ログインして権限を許可してください。',
  CALENDAR_FETCH_FAILED: 'Google Calendar APIの取得に失敗しました。しばらく後にお試しください。',
};

export default function ActivitiesPage() {
  const router = useRouter();
  const {
    activities,
    dataSource,
    isLoadingActivities,
    isGeneratingReport,
    calendarError,
    setActivities,
    setReport,
    setLoadingActivities,
    setGeneratingReport,
    setCalendarError,
  } = useReportStore();

  useEffect(() => {
    if (activities.length > 0) return;

    async function load() {
      setLoadingActivities(true);
      setCalendarError(null);
      try {
        if (dataSource === 'calendar') {
          const res = await fetch('/api/google/calendar');
          const data = await res.json();

          if (!res.ok) {
            setCalendarError(data.error ?? 'CALENDAR_FETCH_FAILED');
            return;
          }

          setActivities(data.cards ?? []);
        } else {
          const today = new Date().toISOString().split('T')[0];
          const cards = await workspaceDataSource.fetchTodayActivities(today);
          setActivities(cards);
        }
      } catch {
        if (dataSource === 'calendar') {
          setCalendarError('CALENDAR_FETCH_FAILED');
        }
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
  const observedCards = activities.filter((a) => a.confidence === 'observed');
  const inferredCards = activities.filter((a) => a.confidence === 'inferred');

  const isCalendar = dataSource === 'calendar';
  const errorMessage = calendarError ? (CALENDAR_ERROR_MESSAGES[calendarError] ?? CALENDAR_ERROR_MESSAGES.CALENDAR_FETCH_FAILED) : null;

  return (
    <div>
      <StepIndicator currentStep={2} />

      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-bold text-gray-900">今日の活動</h1>
          <p className="text-sm text-gray-500 mt-0.5 flex items-center gap-1.5">
            {isCalendar ? (
              <><span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-medium">Google Calendar</span> 本日の予定</>
            ) : (
              <><span className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded font-medium">モック</span> サンプルデータ</>
            )}
          </p>
        </div>
        <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
          {includedCount}件選択中
        </span>
      </div>

      {/* Error state */}
      {errorMessage && !isLoadingActivities && (
        <div className="mb-5 p-4 rounded-lg bg-red-50 border border-red-200">
          <p className="text-sm font-medium text-red-700 mb-1">取得に失敗しました</p>
          <p className="text-sm text-red-600">{errorMessage}</p>
          <Link href="/" className="inline-block mt-2 text-sm text-red-700 underline">
            ← ホームに戻る
          </Link>
        </div>
      )}

      {/* Loading state */}
      {isLoadingActivities ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-100 rounded-lg animate-pulse" />
          ))}
          <p className="text-center text-sm text-gray-400 py-2">
            {isCalendar ? 'Google Calendarから予定を取得中…' : 'データを読み込み中…'}
          </p>
        </div>
      ) : !calendarError && (
        <div className="space-y-6">
          {/* Observed (Google Calendar real data) */}
          {observedCards.length > 0 && (
            <section>
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />
                本日のカレンダー予定
              </h2>
              <div className="space-y-2">
                {observedCards.map((card) => (
                  <ActivityCardItem key={card.id} card={card} />
                ))}
              </div>
            </section>
          )}

          {/* Fact (mock confirmed activities) */}
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

          {/* Inferred */}
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

          {/* Empty state */}
          {activities.length === 0 && !calendarError && (
            <div className="text-center py-12 text-gray-500">
              <p className="text-3xl mb-3">📅</p>
              <p className="font-medium">今日の予定は0件です</p>
              <p className="text-sm mt-1">手動で活動を追加できます</p>
            </div>
          )}

          {/* Manual add */}
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
          disabled={includedCount === 0 || isGeneratingReport || isLoadingActivities}
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
