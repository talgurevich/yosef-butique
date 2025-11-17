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
    const { data: existing, error: checkError } = await supabaseAdmin
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

    // Optionally: Remove from SendGrid Marketing Contacts
    // This is optional - you might want to keep them in SendGrid but mark as unsubscribed
    if (process.env.SENDGRID_API_KEY) {
      try {
        // Search for the contact in SendGrid
        const searchResponse = await fetch(
          `https://api.sendgrid.com/v3/marketing/contacts/search/emails`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              emails: [email.toLowerCase()],
            }),
          }
        );

        const searchResult = await searchResponse.json();

        // If found, you can optionally delete them from SendGrid
        // Or add them to a suppression group
        if (searchResult.result && searchResult.result[email.toLowerCase()]) {
          const contactId = searchResult.result[email.toLowerCase()].contact.id;

          // Option 1: Delete from SendGrid (commented out - you might prefer suppression)
          // await fetch(
          //   `https://api.sendgrid.com/v3/marketing/contacts?ids=${contactId}`,
          //   {
          //     method: 'DELETE',
          //     headers: {
          //       'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
          //     },
          //   }
          // );

          // Option 2: Add to suppression group (recommended)
          // This requires a suppression group to be created in SendGrid first
        }
      } catch (sendgridError) {
        console.error('Error updating SendGrid contact:', sendgridError);
        // Continue even if SendGrid update fails
      }
    }

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
