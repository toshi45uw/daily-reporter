'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { StepIndicator } from '@/components/StepIndicator';
import { ReportPreview } from '@/components/ReportPreview';
import { useReportStore } from '@/store/report-store';

export default function ReportPage() {
  const router = useRouter();
  const report = useReportStore((s) => s.report);

  useEffect(() => {
    if (!report) {
      router.replace('/activities');
    }
  }, [report, router]);

  if (!report) return null;

  const reportDate = new Date(report.date).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div>
      <StepIndicator currentStep={3} />

      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-bold text-gray-900">日報プレビュー</h1>
          <p className="text-sm text-gray-500 mt-0.5">{reportDate} — {report.activities.length}件の活動</p>
        </div>
        <Link
          href="/activities"
          className="text-sm text-gray-500 hover:text-gray-700 underline underline-offset-2"
        >
          ← 活動に戻る
        </Link>
      </div>

      <ReportPreview report={report} />

      <div className="mt-6">
        <Link
          href="/"
          className="block w-full py-3 border border-gray-300 text-gray-600 text-center text-sm rounded-xl hover:bg-gray-50 transition-colors"
        >
          ホームに戻る（セッションをリセット）
        </Link>
      </div>
    </div>
  );
}
