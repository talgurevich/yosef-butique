import { NextRequest, NextResponse } from 'next/server';
import { sendSlackNotification } from '@/lib/slack';

export async function POST(request: NextRequest) {
  try {
    const { items, total, minutesIdle } = await request.json();
    sendSlackNotification({ type: 'cart_abandoned', items: items || [], total: total || 0, minutesIdle: minutesIdle || 0 });
  } catch {
    // always 200
  }
  return NextResponse.json({ ok: true });
}
