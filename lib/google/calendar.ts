import { google } from 'googleapis';
import { ActivityCard } from '@/lib/types';
import { calendar_v3 } from 'googleapis';

function getTodayRangeJST(): { timeMin: string; timeMax: string; dateStr: string } {
  const jstOffsetMs = 9 * 60 * 60 * 1000;
  const nowUtc = Date.now();
  const jstDate = new Date(nowUtc + jstOffsetMs);
  const dateStr = jstDate.toISOString().split('T')[0]; // YYYY-MM-DD in JST
  return {
    timeMin: `${dateStr}T00:00:00+09:00`,
    timeMax: `${dateStr}T23:59:59+09:00`,
    dateStr,
  };
}

function buildDescription(event: calendar_v3.Schema$Event): string {
  const parts: string[] = [];

  if (event.location) {
    parts.push(`場所: ${event.location}`);
  }

  const externalAttendees = (event.attendees ?? []).filter((a) => !a.self);
  if (externalAttendees.length > 0) {
    const names = externalAttendees
      .slice(0, 5)
      .map((a) => a.displayName ?? a.email?.split('@')[0] ?? '参加者');
    parts.push(`参加者: ${names.join('、')}`);
  }

  if (event.description) {
    // strip HTML tags and truncate
    const text = event.description.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    if (text) parts.push(text.slice(0, 120));
  }

  return parts.join(' / ') || '詳細なし';
}

function getParticipantNames(event: calendar_v3.Schema$Event): string[] {
  return (event.attendees ?? [])
    .filter((a) => !a.self)
    .map((a) => a.displayName ?? a.email?.split('@')[0] ?? '参加者')
    .filter(Boolean);
}

function calcDurationMinutes(
  startIso: string | undefined,
  endIso: string | undefined
): number | undefined {
  if (!startIso || !endIso) return undefined;
  const diff = new Date(endIso).getTime() - new Date(startIso).getTime();
  return diff > 0 ? Math.round(diff / 60000) : undefined;
}

export async function fetchTodayCalendarEvents(accessToken: string): Promise<ActivityCard[]> {
  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token: accessToken });

  const calendar = google.calendar({ version: 'v3', auth });
  const { timeMin, timeMax } = getTodayRangeJST();

  const response = await calendar.events.list({
    calendarId: 'primary',
    timeMin,
    timeMax,
    singleEvents: true,
    orderBy: 'startTime',
    maxResults: 50,
  });

  const events = response.data.items ?? [];
  const now = new Date().toISOString();

  return events
    .filter((e) => e.status !== 'cancelled' && e.id)
    .map((event): ActivityCard => {
      const isAllDay = Boolean(event.start?.date && !event.start?.dateTime);
      const startIso = event.start?.dateTime ?? event.start?.date ?? undefined;
      const endIso = event.end?.dateTime ?? event.end?.date ?? undefined;
      const participants = getParticipantNames(event);

      return {
        id: `calendar-${event.id}`,
        title: event.summary ?? '無題の予定',
        description: buildDescription(event),
        source: 'calendar',
        startTime: isAllDay ? undefined : startIso,
        endTime: isAllDay ? undefined : endIso,
        durationMinutes: calcDurationMinutes(startIso, endIso),
        participants: participants.length > 0 ? participants : undefined,
        confidence: 'observed',
        isIncluded: true,
        memo: '',
        url: event.htmlLink ?? undefined,
        metadata: {
          calendarEventId: event.id ?? undefined,
        },
      };
    });
}
