import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });

  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'כתובת המייל היא שדה חובה' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'כתובת מייל לא תקינה' },
        { status: 400 }
      );
    }

    // Check if email exists
    const { data: existing } = await supabaseAdmin
      .from('newsletter_subscribers')
      .select('id, status')
      .eq('email', email.toLowerCase())
      .single();

    if (!existing) {
      return NextResponse.json(
        { error: 'כתובת המייל לא נמצאה ברשימת התפוצה' },
        { status: 404 }
      );
    }

    if (existing.status === 'unsubscribed') {
      return NextResponse.json(
        { error: 'כתובת המייל כבר מבוטלת מרשימת התפוצה' },
        { status: 400 }
      );
    }

    // Update subscriber status to unsubscribed
    const { error: updateError } = await supabaseAdmin
      .from('newsletter_subscribers')
      .update({
        status: 'unsubscribed',
        unsubscribed_at: new Date().toISOString()
      })
      .eq('id', existing.id);

    if (updateError) throw updateError;

    return NextResponse.json({
      success: true,
      message: 'ביטול ההרשמה בוצע בהצלחה'
    });

  } catch (error: any) {
    console.error('Newsletter unsubscribe error:', error);
    return NextResponse.json(
      { error: 'שגיאה בביטול ההרשמה. אנא נסה שוב' },
      { status: 500 }
    );
  }
}
