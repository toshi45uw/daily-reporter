export type ActivitySource = 'calendar' | 'gmail' | 'drive' | 'meet' | 'manual';
export type ConfidenceLevel = 'fact' | 'inferred';
export type Priority = 'high' | 'medium' | 'low';
export type SuggestionCategory = 'time-management' | 'communication' | 'focus' | 'automation';

export interface ActivityCard {
  id: string;
  title: string;
  description: string;
  source: ActivitySource;
  startTime?: string;
  endTime?: string;
  durationMinutes?: number;
  participants?: string[];
  confidence: ConfidenceLevel;
  isIncluded: boolean;
  memo: string;
  metadata: {
    calendarEventId?: string;
    gmailThreadId?: string;
    gmailSubject?: string;
    driveFileId?: string;
    driveFileName?: string;
    meetMeetingId?: string;
  };
}

export interface NextAction {
  id: string;
  title: string;
  priority: Priority;
  dueDate?: string;
  source: ConfidenceLevel;
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
  date: string;
  generatedAt: string;
  activities: ActivityCard[];
  summary: string;
  achievements: string[];
  nextActions: NextAction[];
  improvementSuggestions: ImprovementSuggestion[];
}

export interface WorkspaceDataSource {
  fetchTodayActivities(date: string): Promise<ActivityCard[]>;
}

export interface ReportGenerator {
  generateReport(
    activities: ActivityCard[],
    date: string
  ): Promise<Omit<DailyReport, 'id' | 'activities'>>;
}
