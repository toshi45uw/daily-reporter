'use client';

import { useState } from 'react';
import { ActivityCard } from '@/lib/types';
import { useReportStore } from '@/store/report-store';

export function ManualCardForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('');
  const addManualCard = useReportStore((s) => s.addManualCard);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;

    const card: ActivityCard = {
      id: `manual-${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      source: 'manual',
      durationMinutes: duration ? parseInt(duration, 10) : undefined,
      confidence: 'fact',
      isIncluded: true,
      memo: '',
      metadata: {},
    };

    addManualCard(card);
    setTitle('');
    setDescription('');
    setDuration('');
    setIsOpen(false);
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full flex items-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-400 hover:text-blue-600 transition-colors text-sm font-medium"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        活動を手動で追加
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="border-2 border-blue-300 rounded-lg p-4 bg-blue-50"
    >
      <h3 className="text-sm font-semibold text-gray-700 mb-3">活動を手動追加</h3>
      <div className="space-y-3">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="活動名（必須）"
          required
          className="w-full text-sm border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-400"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="詳細・内容（任意）"
          rows={2}
          className="w-full text-sm border border-gray-300 rounded px-3 py-2 resize-none focus:outline-none focus:ring-1 focus:ring-blue-400"
        />
        <input
          type="number"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          placeholder="所要時間（分）"
          min="1"
          className="w-32 text-sm border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-400"
        />
      </div>
      <div className="flex gap-2 mt-3">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 font-medium"
        >
          追加
        </button>
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="px-4 py-2 border border-gray-300 text-gray-600 text-sm rounded hover:bg-gray-50"
        >
          キャンセル
        </button>
      </div>
    </form>
  );
}
