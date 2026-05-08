/**
 * Google Workspace data source abstraction.
 * Replace the mock implementation with real Google API calls
 * by swapping out fetchTodayActivities while keeping the interface identical.
 */
import { ActivityCard, WorkspaceDataSource } from './types';
import { mockActivities } from './mock-data';

class MockWorkspaceDataSource implements WorkspaceDataSource {
  async fetchTodayActivities(_date: string): Promise<ActivityCard[]> {
    await new Promise((r) => setTimeout(r, 600));
    return mockActivities.map((a) => ({ ...a }));
  }
}

// TODO: Replace with GoogleWorkspaceDataSource when API integration is ready
// class GoogleWorkspaceDataSource implements WorkspaceDataSource {
//   constructor(private accessToken: string) {}
//   async fetchTodayActivities(date: string): Promise<ActivityCard[]> {
//     const [calendarEvents, gmailThreads, driveFiles] = await Promise.all([
//       fetchCalendarEvents(this.accessToken, date),
//       fetchGmailThreads(this.accessToken, date),
//       fetchDriveActivity(this.accessToken, date),
//     ]);
//     return normalizeToActivityCards(calendarEvents, gmailThreads, driveFiles);
//   }
// }

export const workspaceDataSource: WorkspaceDataSource = new MockWorkspaceDataSource();
