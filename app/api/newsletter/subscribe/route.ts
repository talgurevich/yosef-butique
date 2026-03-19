import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { resend, EMAIL_FROM } from '@/lib/resend';

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
    const { email, full_name, source = 'footer' } = await request.json();

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

    // Check if email already exists
    const { data: existing } = await supabaseAdmin
      .from('newsletter_subscribers')
      .select('id, status')
      .eq('email', email.toLowerCase())
      .single();

    if (existing) {
      if (existing.status === 'active') {
        return NextResponse.json(
          { error: 'כתובת המייל כבר רשומה לניוזלטר' },
          { status: 400 }
        );
      } else {
        // Reactivate unsubscribed user
        const { error: updateError } = await supabaseAdmin
          .from('newsletter_subscribers')
          .update({
            status: 'active',
            subscribed_at: new Date().toISOString(),
            unsubscribed_at: null
          })
          .eq('id', existing.id);

        if (updateError) throw updateError;

        return NextResponse.json({
          success: true,
          message: 'ברוך שובך! הופעלת מחדש בניוזלטר שלנו'
        });
      }
    }

    // Add subscriber to database
    const { error: insertError } = await supabaseAdmin
      .from('newsletter_subscribers')
      .insert([{
        email: email.toLowerCase(),
        full_name: full_name || null,
        status: 'active',
        source,
        promo_code_sent: false,
      }])
      .select()
      .single();

    if (insertError) throw insertError;

    // Send welcome email via Resend
    try {
      await resend.emails.send({
        from: EMAIL_FROM,
        to: email,
        subject: 'ברוכים הבאים לשטיחי בוטיק יוסף!',
        html: `
          <!DOCTYPE html>
          <html dir="rtl" lang="he">
          <head>
            <meta charset="UTF-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; }
              .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
              .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>ברוכים הבאים לשטיחי בוטיק יוסף!</h1>
              </div>
              <div class="content">
                <h2>שלום ${full_name || 'לקוח יקר'},</h2>
                <p>תודה שהצטרפת לניוזלטר שלנו! אנחנו שמחים שבחרת להצטרף למשפחת שטיחי בוטיק יוסף.</p>

                <p>בניוזלטר שלנו תקבל:</p>
                <ul>
                  <li>עדכונים על מוצרים חדשים</li>
                  <li>הצעות בלעדיות והטבות</li>
                  <li>טיפים לעיצוב הבית</li>
                  <li>מבצעים מיוחדים רק למנויים</li>
                </ul>

                <div style="text-align: center;">
                  <a href="https://boutique-yossef.co.il/products" class="button">צפו במוצרים שלנו</a>
                </div>

                <p>נשמח לעמוד לשירותך בכל שאלה!</p>
                <p>
                  <strong>שטיחי בוטיק יוסף</strong><br>
                  051-509-2208<br>
                  השקד משק 47, מושב בית עזרא
                </p>
              </div>
              <div class="footer">
                <p>קיבלת מייל זה כי נרשמת לניוזלטר שלנו</p>
                <p><a href="https://boutique-yossef.co.il/newsletter/unsubscribe?email=${encodeURIComponent(email)}">בטל הירשמות</a></p>
                <p>&copy; ${new Date().getFullYear()} שטיחי בוטיק יוסף. כל הזכויות שמורות.</p>
              </div>
            </div>
          </body>
          </html>
        `,
        text: `
ברוכים הבאים לשטיחי בוטיק יוסף!

שלום ${full_name || 'לקוח יקר'},

תודה שהצטרפת לניוזלטר שלנו!

בניוזלטר שלנו תקבל:
- עדכונים על מוצרים חדשים
- הצעות בלעדיות והטבות
- טיפים לעיצוב הבית
- מבצעים מיוחדים רק למנויים

צפו במוצרים שלנו: https://boutique-yossef.co.il/products

שטיחי בוטיק יוסף
051-509-2208
השקד משק 47, מושב בית עזרא

לביטול הירשמות: https://boutique-yossef.co.il/newsletter/unsubscribe?email=${encodeURIComponent(email)}
        `,
      });
    } catch (emailError) {
      console.error('Error sending welcome email:', emailError);
    }

    return NextResponse.json({
      success: true,
      message: 'תודה על ההרשמה! נשמח לעדכן אותך במבצעים והטבות'
    });

  } catch (error: any) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { error: 'שגיאה בהרשמה לניוזלטר. אנא נסה שוב' },
      { status: 500 }
    );
  }
}
