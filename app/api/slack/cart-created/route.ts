import { NextRequest, NextResponse } from 'next/server';
import { sendSlackNotification } from '@/lib/slack';

export async function POST(request: NextRequest) {
  try {
    const { items, total } = await request.json();
    await sendSlackNotification({ type: 'cart_created', items: items || [], total: total || 0 });
  } catch {
    // always 200
  }
  return NextResponse.json({ ok: true });
}
