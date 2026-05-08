/**
 * AI report generation abstraction.
 * Replace the mock implementation with real Claude / OpenAI API calls
 * by swapping out generateReport while keeping the interface identical.
 */
import { ActivityCard, DailyReport, ReportGenerator } from './types';
import { buildMockReport } from './mock-data';

class MockReportGenerator implements ReportGenerator {
  async generateReport(
    activities: ActivityCard[],
    date: string
  ): Promise<Omit<DailyReport, 'id' | 'activities'>> {
    await new Promise((r) => setTimeout(r, 800));
    return buildMockReport(activities);
  }
}

// TODO: Replace with ClaudeReportGenerator when AI integration is ready
// class ClaudeReportGenerator implements ReportGenerator {
//   constructor(private apiKey: string) {}
//   async generateReport(activities: ActivityCard[], date: string) {
//     const client = new Anthropic({ apiKey: this.apiKey });
//     const prompt = buildPrompt(activities, date);
//     const response = await client.messages.create({ ... });
//     return parseResponse(response);
//   }
// }

export const reportGenerator: ReportGenerator = new MockReportGenerator();
