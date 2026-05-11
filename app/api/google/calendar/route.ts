import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { fetchTodayCalendarEvents } from '@/lib/google/calendar';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'NOT_AUTHENTICATED' }, { status: 401 });
  }

  if (!session.accessToken) {
    return NextResponse.json({ error: 'NO_ACCESS_TOKEN' }, { status: 401 });
  }

  try {
    const cards = await fetchTodayCalendarEvents(session.accessToken);
    return NextResponse.json({ cards });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';

    // Detect scope/permission errors from Google API
    if (message.includes('insufficient') || message.includes('403')) {
      return NextResponse.json({ error: 'INSUFFICIENT_SCOPE' }, { status: 403 });
    }

    console.error('[Calendar API error]', err);
    return NextResponse.json({ error: 'CALENDAR_FETCH_FAILED' }, { status: 500 });
  }
}
