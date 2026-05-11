'use client';

import { ActivityCard, ActivitySource } from '@/lib/types';
import { useReportStore } from '@/store/report-store';

const SOURCE_LABELS: Record<ActivitySource, { label: string; color: string }> = {
  calendar: { label: 'カレンダー', color: 'bg-blue-100 text-blue-700' },
  gmail: { label: 'メール', color: 'bg-yellow-100 text-yellow-700' },
  drive: { label: 'ドライブ', color: 'bg-green-100 text-green-700' },
  meet: { label: 'Meet', color: 'bg-purple-100 text-purple-700' },
  manual: { label: '手入力', color: 'bg-gray-100 text-gray-700' },
};

function formatTime(iso?: string) {
  if (!iso) return null;
  return new Date(iso).toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' });
}

export function ActivityCardItem({ card }: { card: ActivityCard }) {
  const { toggleIncluded, updateMemo, removeCard } = useReportStore();
  const src = SOURCE_LABELS[card.source];
  const startTime = formatTime(card.startTime);
  const endTime = formatTime(card.endTime);

  return (
    <div
      className={`rounded-lg border p-4 transition-all ${
        card.isIncluded
          ? 'border-blue-300 bg-white shadow-sm'
          : 'border-gray-200 bg-gray-50 opacity-60'
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <button
          onClick={() => toggleIncluded(card.id)}
          className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
            card.isIncluded ? 'bg-blue-600 border-blue-600' : 'border-gray-300 bg-white'
          }`}
          aria-label={card.isIncluded ? '日報から除外' : '日報に含める'}
        >
          {card.isIncluded && (
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 12 12">
              <path d="M10 3L5 8.5 2 5.5l-1 1L5 10.5l6-7.5-1-1z" />
            </svg>
          )}
        </button>

        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${src.color}`}>
              {src.label}
            </span>
            {card.confidence === 'inferred' && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-orange-100 text-orange-600 font-medium">
                推測
              </span>
            )}
            {card.confidence === 'observed' && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-500 font-medium">
                カレンダー
              </span>
            )}
            {startTime && (
              <span className="text-xs text-gray-500">
                {startTime}{endTime ? `〜${endTime}` : ''}
              </span>
            )}
            {card.durationMinutes && !startTime && (
              <span className="text-xs text-gray-500">約{card.durationMinutes}分</span>
            )}
          </div>

          <h3 className="font-semibold text-gray-900 text-sm mb-1">{card.title}</h3>
          <p className="text-sm text-gray-600 mb-2">{card.description}</p>

          {card.participants && card.participants.length > 0 && (
            <p className="text-xs text-gray-500 mb-2">
              参加者: {card.participants.join('、')}
            </p>
          )}

          {/* Memo */}
          {card.isIncluded && (
            <textarea
              value={card.memo}
              onChange={(e) => updateMemo(card.id, e.target.value)}
              placeholder="補足メモを入力（任意）"
              rows={2}
              className="w-full text-sm border border-gray-200 rounded px-2 py-1.5 resize-none focus:outline-none focus:ring-1 focus:ring-blue-400 text-gray-700 placeholder-gray-400"
            />
          )}
        </div>

        {/* Action buttons */}
        <div className="flex flex-col gap-1 flex-shrink-0">
          {card.url && (
            <a
              href={card.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-blue-500 transition-colors"
              aria-label="Googleカレンダーで開く"
              title="Googleカレンダーで開く"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          )}
          {card.source === 'manual' && (
            <button
              onClick={() => removeCard(card.id)}
              className="text-gray-400 hover:text-red-500 transition-colors"
              aria-label="削除"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
