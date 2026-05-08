import { ActivityCard, DailyReport, NextAction, ImprovementSuggestion } from './types';

const TODAY = new Date().toISOString().split('T')[0];

export const mockActivities: ActivityCard[] = [
  {
    id: 'act-001',
    title: '週次定例ミーティング',
    description: 'チーム全体の進捗共有と課題確認。Q2ロードマップについて議論。',
    source: 'calendar',
    startTime: `${TODAY}T10:00:00+09:00`,
    endTime: `${TODAY}T11:00:00+09:00`,
    durationMinutes: 60,
    participants: ['田中 太郎', '鈴木 花子', '佐藤 健'],
    confidence: 'fact',
    isIncluded: true,
    memo: '',
    metadata: { calendarEventId: 'cal-event-001' },
  },
  {
    id: 'act-002',
    title: '顧客ヒアリング: ABC商事',
    description: '新機能要件のヒアリング。ダッシュボード改善について具体的なフィードバックを収集。',
    source: 'meet',
    startTime: `${TODAY}T13:00:00+09:00`,
    endTime: `${TODAY}T14:00:00+09:00`,
    durationMinutes: 60,
    participants: ['山田 営業部長 (ABC商事)', '鈴木 花子'],
    confidence: 'fact',
    isIncluded: true,
    memo: '',
    metadata: { calendarEventId: 'cal-event-002', meetMeetingId: 'meet-001' },
  },
  {
    id: 'act-003',
    title: '設計ドキュメント更新: API仕様書 v2',
    description: 'REST API v2の仕様書を更新。認証フローとエラーコード一覧を追記。',
    source: 'drive',
    durationMinutes: 90,
    confidence: 'fact',
    isIncluded: true,
    memo: '',
    metadata: { driveFileId: 'drive-file-001', driveFileName: 'API仕様書_v2.docx' },
  },
  {
    id: 'act-004',
    title: 'バグ修正対応: ログイン画面エラー',
    description: '特定ブラウザでログインできない問題の調査・修正対応をメールで報告。',
    source: 'gmail',
    confidence: 'fact',
    isIncluded: true,
    memo: '',
    metadata: { gmailThreadId: 'gmail-thread-001', gmailSubject: '[緊急] ログイン画面エラー報告と対応状況' },
  },
  {
    id: 'act-005',
    title: 'スプリントレビュー準備',
    description: '明日のスプリントレビューに向けてデモ環境のセットアップと発表資料の確認。',
    source: 'calendar',
    startTime: `${TODAY}T15:30:00+09:00`,
    endTime: `${TODAY}T16:00:00+09:00`,
    durationMinutes: 30,
    participants: ['田中 太郎'],
    confidence: 'fact',
    isIncluded: false,
    memo: '',
    metadata: { calendarEventId: 'cal-event-003' },
  },
  {
    id: 'act-006',
    title: 'Slackチャンネルでの技術相談対応',
    description: '#dev-helpチャンネルでの後輩エンジニアからの質問対応（推測）',
    source: 'gmail',
    durationMinutes: 20,
    confidence: 'inferred',
    isIncluded: false,
    memo: '',
    metadata: { gmailSubject: 'Re: TypeScriptの型エラーについて' },
  },
];

export const mockNextActions: NextAction[] = [
  {
    id: 'next-001',
    title: 'ABC商事へのフォローアップメール送付',
    priority: 'high',
    dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    source: 'inferred',
    relatedActivityId: 'act-002',
  },
  {
    id: 'next-002',
    title: 'スプリントレビュー本番実施',
    priority: 'high',
    dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    source: 'fact',
    relatedActivityId: 'act-005',
  },
  {
    id: 'next-003',
    title: 'ログイン画面バグの本番デプロイ確認',
    priority: 'medium',
    source: 'inferred',
    relatedActivityId: 'act-004',
  },
];

export const mockImprovementSuggestions: ImprovementSuggestion[] = [
  {
    id: 'sug-001',
    category: 'time-management',
    title: '午後のミーティング集中を検討',
    description: '本日は午前・午後ともにミーティングが分散しています。深い作業のための連続時間を確保するため、ミーティングを午後にまとめることを検討してみてください。',
    confidence: 'inferred',
  },
  {
    id: 'sug-002',
    category: 'communication',
    title: '顧客ヒアリングの議事録共有',
    description: 'ABC商事とのミーティング内容を当日中にチームへ共有すると、フォローアップのスピードが上がります。',
    confidence: 'inferred',
  },
  {
    id: 'sug-003',
    category: 'automation',
    title: 'バグ報告テンプレートの活用',
    description: '緊急バグ対応が発生しました。報告メールのテンプレート化により、次回の初動対応時間を短縮できる可能性があります。',
    confidence: 'inferred',
  },
];

export function buildMockReport(activities: ActivityCard[]): Omit<DailyReport, 'id' | 'activities'> {
  const included = activities.filter((a) => a.isIncluded);
  const totalMinutes = included.reduce((sum, a) => sum + (a.durationMinutes ?? 0), 0);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  const summary = `本日は${included.length}件の業務を実施しました。${
    hours > 0 ? `合計約${hours}時間${minutes > 0 ? minutes + '分' : ''}` : `合計約${minutes}分`
  }の記録活動があります。主な成果はミーティングによる顧客・チームとのコミュニケーションと、ドキュメント整備です。`;

  const achievements = included.map((a) => {
    const time =
      a.startTime
        ? `${new Date(a.startTime).toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}〜`
        : '';
    const memo = a.memo ? `（${a.memo}）` : '';
    return `${time}${a.title}${memo}`;
  });

  return {
    date: TODAY,
    generatedAt: new Date().toISOString(),
    summary,
    achievements,
    nextActions: mockNextActions,
    improvementSuggestions: mockImprovementSuggestions,
  };
}
