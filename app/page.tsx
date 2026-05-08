'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { StepIndicator } from '@/components/StepIndicator';
import { useReportStore } from '@/store/report-store';

const SOURCE_ITEMS = [
  { icon: '📅', label: 'Googleカレンダー', desc: '本日の予定・会議' },
  { icon: '📧', label: 'Gmail', desc: '送受信メールの件名' },
  { icon: '📁', label: 'Google Drive', desc: '編集・閲覧したファイル' },
  { icon: '🎥', label: 'Google Meet', desc: '参加した通話の記録' },
];

export default function HomePage() {
  const reset = useReportStore((s) => s.reset);

  useEffect(() => {
    reset();
  }, [reset]);

  const today = new Date().toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });

  return (
    <div>
      <StepIndicator currentStep={1} />

      <div className="text-center mb-10">
        <p className="text-sm text-gray-500 mb-1">{today}</p>
        <h1 className="text-2xl font-bold text-gray-900 mb-3">今日の日報を作成しましょう</h1>
        <p className="text-gray-600 text-sm leading-relaxed">
          Google Workspaceの活動履歴から<br />
          日報のドラフトを3ステップで自動生成します
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">使い方</h2>
        <ol className="space-y-4">
          {[
            { step: 1, title: '活動を確認・選択', desc: 'Google Workspaceから取得した今日の活動候補を確認します' },
            { step: 2, title: '補足メモを入力', desc: '各活動に補足メモを追加したり、手入力で活動を追加できます' },
            { step: 3, title: '日報を生成・コピー', desc: '選択した活動から日報ドラフトを生成し、クリップボードにコピーします' },
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
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-8">
        <h2 className="text-sm font-semibold text-gray-700 mb-3">取得データソース</h2>
        <div className="grid grid-cols-2 gap-2">
          {SOURCE_ITEMS.map(({ icon, label, desc }) => (
            <div key={label} className="flex items-start gap-2 p-2 rounded-lg bg-gray-50">
              <span className="text-lg leading-none mt-0.5">{icon}</span>
              <div>
                <p className="text-xs font-medium text-gray-800">{label}</p>
                <p className="text-xs text-gray-500">{desc}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-3">
          ※ このデモ版はモックデータで動作します。メール本文などの機密情報は取得しません。
        </p>
      </div>

      <Link
        href="/activities"
        className="block w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white text-center font-semibold rounded-xl transition-colors active:scale-[0.99]"
      >
        今日の活動を確認する →
      </Link>
    </div>
  );
}
