'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { StepIndicator } from '@/components/StepIndicator';
import { LoginButton } from '@/components/LoginButton';
import { useReportStore } from '@/store/report-store';

export default function HomePage() {
  const { data: session, status } = useSession();
  const { reset, setDataSource } = useReportStore();

  useEffect(() => {
    reset();
  }, [reset]);

  const today = new Date().toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });

  const isLoggedIn = Boolean(session?.user);

  return (
    <div>
      <StepIndicator currentStep={1} />

      <div className="text-center mb-8">
        <p className="text-sm text-gray-500 mb-1">{today}</p>
        <h1 className="text-2xl font-bold text-gray-900 mb-3">今日の日報を作成しましょう</h1>
        <p className="text-gray-600 text-sm leading-relaxed">
          Google Workspaceの活動履歴から<br />
          日報のドラフトを3ステップで自動生成します
        </p>
      </div>

      {/* Auth section */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-5">
        <h2 className="text-sm font-semibold text-gray-700 mb-3">Googleアカウント</h2>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <LoginButton />
          {isLoggedIn && (
            <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full font-medium">
              ✓ カレンダー連携可能
            </span>
          )}
        </div>
      </div>

      {/* Data source selection */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-5">
        <h2 className="text-sm font-semibold text-gray-700 mb-3">データソースを選択</h2>
        <div className="space-y-2">
          {/* Google Calendar */}
          <div className={`relative rounded-lg border-2 p-4 transition-all ${
            isLoggedIn
              ? 'border-blue-200 hover:border-blue-400 cursor-pointer'
              : 'border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed'
          }`}>
            <div className="flex items-start gap-3">
              <span className="text-2xl mt-0.5">📅</span>
              <div className="flex-1">
                <p className="font-semibold text-gray-800 text-sm">Google Calendarから取得</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  今日のGoogleカレンダー予定を読み取って表示します
                </p>
                {!isLoggedIn && (
                  <p className="text-xs text-amber-600 mt-1">← 先にGoogleログインしてください</p>
                )}
              </div>
              {isLoggedIn && (
                <Link
                  href="/activities"
                  onClick={() => setDataSource('calendar')}
                  className="flex-shrink-0 px-3 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                >
                  取得する →
                </Link>
              )}
            </div>
          </div>

          {/* Mock data */}
          <div className="rounded-lg border-2 border-gray-200 hover:border-gray-300 p-4 transition-all cursor-pointer">
            <div className="flex items-start gap-3">
              <span className="text-2xl mt-0.5">🧪</span>
              <div className="flex-1">
                <p className="font-semibold text-gray-800 text-sm">モックデータで試す</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  サンプルデータを使ってUIと日報生成フローを確認できます
                </p>
              </div>
              <Link
                href="/activities"
                onClick={() => setDataSource('mock')}
                className="flex-shrink-0 px-3 py-1.5 bg-gray-800 text-white text-xs font-semibold rounded-lg hover:bg-gray-900 transition-colors"
              >
                試してみる →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* How it works */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="text-sm font-semibold text-gray-700 mb-3">使い方</h2>
        <ol className="space-y-3">
          {[
            { step: 1, title: '活動を確認・選択', desc: '取得した今日の活動候補を確認します' },
            { step: 2, title: '補足メモを入力', desc: '各活動にメモを追加したり、手入力で活動を追加できます' },
            { step: 3, title: '日報を生成・コピー', desc: '選択した活動から日報ドラフトを生成します' },
          ].map(({ step, title, desc }) => (
            <li key={step} className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center mt-0.5">
                {step}
              </div>
              <div>
                <p className="font-medium text-gray-800 text-sm">{title}</p>
                <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
              </div>
            </li>
          ))}
        </ol>
        <p className="text-xs text-gray-400 mt-4 pt-3 border-t border-gray-100">
          ※ カレンダー予定はあくまで活動候補です。実施済みとは限らない前提で確認してください。
        </p>
      </div>
    </div>
  );
}
