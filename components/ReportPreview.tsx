'use client';

import { useState } from 'react';
import { DailyReport, Priority, SuggestionCategory } from '@/lib/types';

const PRIORITY_LABELS: Record<Priority, { label: string; color: string }> = {
  high: { label: '高', color: 'bg-red-100 text-red-700' },
  medium: { label: '中', color: 'bg-yellow-100 text-yellow-700' },
  low: { label: '低', color: 'bg-green-100 text-green-700' },
};

const CATEGORY_LABELS: Record<SuggestionCategory, string> = {
  'time-management': '時間管理',
  communication: 'コミュニケーション',
  focus: '集中力',
  automation: '自動化',
};

function buildReportText(report: DailyReport): string {
  const date = new Date(report.date).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const lines: string[] = [
    `【日報】${date}`,
    '',
    '■ 本日のサマリー',
    report.summary,
    '',
    '■ 本日の活動',
    ...report.achievements.map((a) => `・${a}`),
    '',
    '■ 明日以降のネクストアクション',
    ...report.nextActions.map(
      (n) =>
        `・[${PRIORITY_LABELS[n.priority].label}] ${n.title}${n.dueDate ? ` (期限: ${n.dueDate})` : ''}`
    ),
  ];

  return lines.join('\n');
}

export function ReportPreview({ report }: { report: DailyReport }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    const text = buildReportText(report);
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const reportDate = new Date(report.date).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  });

  return (
    <div className="space-y-6">
      <section className="bg-white rounded-lg border border-gray-200 p-5">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
          サマリー — {reportDate}
        </h2>
        <p className="text-gray-800 leading-relaxed">{report.summary}</p>
      </section>

      <section className="bg-white rounded-lg border border-gray-200 p-5">
        <h2 className="text-base font-semibold text-gray-800 mb-3">本日の活動</h2>
        <ul className="space-y-2">
          {report.achievements.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
              <span className="text-blue-500 mt-0.5 flex-shrink-0">•</span>
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section className="bg-white rounded-lg border border-gray-200 p-5">
        <h2 className="text-base font-semibold text-gray-800 mb-3">ネクストアクション</h2>
        <ul className="space-y-2">
          {report.nextActions.map((action) => (
            <li key={action.id} className="flex items-start gap-2 text-sm">
              <span
                className={`flex-shrink-0 text-xs font-semibold px-1.5 py-0.5 rounded ${
                  PRIORITY_LABELS[action.priority].color
                }`}
              >
                {PRIORITY_LABELS[action.priority].label}
              </span>
              <span className="text-gray-700">
                {action.title}
                {action.dueDate && (
                  <span className="text-gray-400 ml-1 text-xs">期限: {action.dueDate}</span>
                )}
                {action.source === 'inferred' && (
                  <span className="ml-1 text-xs text-orange-500">（推測）</span>
                )}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="bg-amber-50 rounded-lg border border-amber-200 p-5">
        <h2 className="text-base font-semibold text-amber-800 mb-1">業務効率化ヒント</h2>
        <p className="text-xs text-amber-600 mb-3">
          ※ 以下はAIによる推測に基づく提案です。参考程度にご活用ください。
        </p>
        <ul className="space-y-3">
          {report.improvementSuggestions.map((sug) => (
            <li key={sug.id} className="text-sm">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-xs font-medium px-1.5 py-0.5 rounded bg-amber-100 text-amber-700">
                  {CATEGORY_LABELS[sug.category]}
                </span>
                <span className="font-semibold text-gray-800">{sug.title}</span>
              </div>
              <p className="text-gray-600 pl-0">{sug.description}</p>
            </li>
          ))}
        </ul>
      </section>

      <button
        onClick={handleCopy}
        className={`w-full py-3 rounded-lg font-semibold text-sm transition-all ${
          copied
            ? 'bg-green-600 text-white'
            : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-[0.99]'
        }`}
      >
        {copied ? '✓ コピーしました' : '日報をクリップボードにコピー'}
      </button>
    </div>
  );
}
