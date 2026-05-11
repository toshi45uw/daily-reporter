export type ActivitySource = 'calendar' | 'gmail' | 'drive' | 'meet' | 'manual';
export type ConfidenceLevel = 'fact' | 'inferred' | 'observed';
export type Priority = 'high' | 'medium' | 'low';
export type SuggestionCategory = 'time-management' | 'communication' | 'focus' | 'automation';

export interface ActivityCard {
  id: string;
  title: string;
  description: string;
  source: ActivitySource;
  startTime?: string; // ISO 8601
  endTime?: string;
  durationMinutes?: number;
  participants?: string[]; // display names only, no email addresses
  confidence: ConfidenceLevel;
  isIncluded: boolean;
  memo: string;
  url?: string; // external link (e.g. Google Calendar event URL)
  // source-specific metadata — raw content (email body, file content) is intentionally excluded
  metadata: {
    calendarEventId?: string;
    gmailThreadId?: string;
    gmailSubject?: string; // subject only, not body
    driveFileId?: string;
    driveFileName?: string;
    meetMeetingId?: string;
  };
}

export interface NextAction {
  id: string;
  title: string;
  priority: Priority;
  dueDate?: string; // ISO 8601 date string
  source: ConfidenceLevel; // 'fact' = explicitly mentioned, 'inferred' = AI inferred
  relatedActivityId?: string;
}

export interface ImprovementSuggestion {
  id: string;
  category: SuggestionCategory;
  title: string;
  description: string;
  confidence: ConfidenceLevel;
}

export interface DailyReport {
  id: string;
  date: string; // YYYY-MM-DD
  generatedAt: string; // ISO 8601
  activities: ActivityCard[];
  summary: string;
  achievements: string[];
  nextActions: NextAction[];
  improvementSuggestions: ImprovementSuggestion[];
}

// Abstraction interfaces for external API layers
export interface WorkspaceDataSource {
  fetchTodayActivities(date: string): Promise<ActivityCard[]>;
}

export interface ReportGenerator {
  generateReport(
    activities: ActivityCard[],
    date: string
  ): Promise<Omit<DailyReport, 'id' | 'activities'>>;
}
