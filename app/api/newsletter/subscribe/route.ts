import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import sgMail from '@sendgrid/mail';

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
    const { data: existing, error: checkError } = await supabaseAdmin
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

    // Generate unique promo code (10% off)
    const promoCode = `WELCOME${Date.now().toString().slice(-6)}`;

    // Create promo code in database
    const { error: promoError } = await supabaseAdmin
      .from('promo_codes')
      .insert([{
        code: promoCode,
        discount_type: 'percentage',
        discount_value: 10,
        min_purchase_amount: 0,
        max_uses: 1,
        uses_per_customer: 1,
        is_active: true,
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
      }]);

    if (promoError) {
      console.error('Error creating promo code:', promoError);
      // Continue even if promo code creation fails
    }

    // Add subscriber to database
    const { data: subscriber, error: insertError } = await supabaseAdmin
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

    // Send to SendGrid and send welcome email
    if (process.env.SENDGRID_API_KEY) {
      try {
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);

        // Send welcome email with promo code
        const msg = {
          to: email,
          from: process.env.SENDGRID_FROM_EMAIL || 'noreply@carpets-topaz.vercel.app',
          subject: 'ברוכים הבאים לשטיחי בוטיק יוסף - קוד הנחה בפנים! 🎁',
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
                .promo-box { background: #f8f9fa; border: 2px dashed #667eea; padding: 20px; margin: 20px 0; text-align: center; border-radius: 8px; }
                .promo-code { font-size: 28px; font-weight: bold; color: #667eea; letter-spacing: 2px; margin: 10px 0; }
                .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
                .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>🎉 ברוכים הבאים לשטיחי בוטיק יוסף!</h1>
                </div>
                <div class="content">
                  <h2>שלום ${full_name || 'לקוח יקר'},</h2>
                  <p>תודה שהצטרפת לניוזלטר שלנו! אנחנו שמחים שבחרת להצטרף למשפחת שטיחי בוטיק יוסף.</p>

                  <div class="promo-box">
                    <h3>🎁 מתנה מיוחדת בשבילך!</h3>
                    <p>קבל <strong>10% הנחה</strong> על הרכישה הראשונה שלך</p>
                    <div class="promo-code">${promoCode}</div>
                    <p style="font-size: 14px; color: #666;">העתק את הקוד והשתמש בו בקופה</p>
                    <p style="font-size: 12px; color: #999;">הקוד תקף ל-30 יום</p>
                  </div>

                  <p>בניוזלטר שלנו תקבל:</p>
                  <ul>
                    <li>✨ עדכונים על מוצרים חדשים</li>
                    <li>🎯 הצעות בלעדיות וקודי הנחה</li>
                    <li>💡 טיפים לעיצוב הבית</li>
                    <li>🎁 מבצעים מיוחדים רק למנויים</li>
                  </ul>

                  <div style="text-align: center;">
                    <a href="${process.env.NEXTAUTH_URL || 'https://carpets-topaz.vercel.app'}/products" class="button">התחל לקנות עכשיו</a>
                  </div>

                  <p>נשמח לעמוד לשירותך בכל שאלה!</p>
                  <p>
                    <strong>שטיחי בוטיק יוסף</strong><br>
                    📞 051-509-2208<br>
                    📍 השקד משק 47, מושב בית עזרא
                  </p>
                </div>
                <div class="footer">
                  <p>קיבלת מייל זה כי נרשמת לניוזלטר שלנו</p>
                  <p><a href="${process.env.NEXTAUTH_URL || 'https://carpets-topaz.vercel.app'}/newsletter/unsubscribe?email=${encodeURIComponent(email)}">בטל הירשמות</a></p>
                  <p>© ${new Date().getFullYear()} שטיחי בוטיק יוסף. כל הזכויות שמורות.</p>
                </div>
              </div>
            </body>
            </html>
          `,
          text: `
ברוכים הבאים לשטיחי בוטיק יוסף!

שלום ${full_name || 'לקוח יקר'},

תודה שהצטרפת לניוזלטר שלנו!

קוד הנחה מיוחד בשבילך: ${promoCode}
קבל 10% הנחה על הרכישה הראשונה שלך (תקף ל-30 יום)

בניוזלטר שלנו תקבל:
- עדכונים על מוצרים חדשים
- הצעות בלעדיות וקודי הנחה
- טיפים לעיצוב הבית
- מבצעים מיוחדים רק למנויים

התחל לקנות: ${process.env.NEXTAUTH_URL || 'https://carpets-topaz.vercel.app'}/products

שטיחי בוטיק יוסף
📞 051-509-2208
📍 השקד משק 47, מושב בית עזרא

לביטול הירשמות: ${process.env.NEXTAUTH_URL || 'https://carpets-topaz.vercel.app'}/newsletter/unsubscribe?email=${encodeURIComponent(email)}
          `,
        };

        await sgMail.send(msg);

        // Mark promo code as sent
        await supabaseAdmin
          .from('newsletter_subscribers')
          .update({ promo_code_sent: true })
          .eq('id', subscriber.id);

      } catch (emailError: any) {
        console.error('Error sending welcome email:', emailError);
        // Don't fail the subscription if email fails
      }
    }

    return NextResponse.json({
      success: true,
      message: 'תודה על ההרשמה! בדוק את המייל שלך לקוד הנחה של 10%',
      promoCode // Return the promo code for immediate display
    });

  } catch (error: any) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { error: 'שגיאה בהרשמה לניוזלטר. אנא נסה שוב' },
      { status: 500 }
    );
  }
}
