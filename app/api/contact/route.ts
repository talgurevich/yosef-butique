import { NextRequest, NextResponse } from 'next/server';
import { resend, EMAIL_FROM } from '@/lib/resend';

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, subject, message } = await request.json();

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'נא למלא את כל השדות החובה' },
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

    // Map subject to Hebrew
    const subjectMap: { [key: string]: string } = {
      product: 'שאלה על מוצר',
      order: 'מעקב הזמנה',
      return: 'החזרה או החלפה',
      shipping: 'שאלת משלוח',
      complaint: 'תלונה',
      other: 'אחר',
    };

    const subjectText = subjectMap[subject] || subject;

    // Send both emails via Resend
    try {
      // Email to business
      await resend.emails.send({
        from: EMAIL_FROM,
        to: 'info@boutique-yossef.co.il',
        replyTo: email,
        subject: `פנייה חדשה מהאתר: ${subjectText}`,
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
              .info-box { background: #f8f9fa; border-right: 4px solid #667eea; padding: 15px; margin: 15px 0; }
              .info-label { font-weight: bold; color: #667eea; margin-bottom: 5px; }
              .message-box { background: #fff9e6; border: 1px solid #ffd700; padding: 20px; margin: 20px 0; border-radius: 8px; }
              .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>פנייה חדשה מהאתר</h1>
              </div>
              <div class="content">
                <h2>פרטי הפונה:</h2>

                <div class="info-box">
                  <div class="info-label">שם מלא:</div>
                  <div>${name}</div>
                </div>

                <div class="info-box">
                  <div class="info-label">אימייל:</div>
                  <div><a href="mailto:${email}">${email}</a></div>
                </div>

                ${phone ? `
                <div class="info-box">
                  <div class="info-label">טלפון:</div>
                  <div><a href="tel:${phone}">${phone}</a></div>
                </div>
                ` : ''}

                <div class="info-box">
                  <div class="info-label">נושא:</div>
                  <div>${subjectText}</div>
                </div>

                <div class="message-box">
                  <div class="info-label">הודעה:</div>
                  <div style="white-space: pre-wrap; margin-top: 10px;">${message}</div>
                </div>

                <div style="margin-top: 30px; padding: 15px; background: #e8f5e9; border-radius: 8px;">
                  <p style="margin: 0; font-size: 14px;">
                    <strong>טיפ:</strong> ניתן להשיב ישירות למייל זה - התשובה תישלח אל ${email}
                  </p>
                </div>
              </div>
              <div class="footer">
                <p>מערכת ניהול פניות - שטיחי בוטיק יוסף</p>
                <p>&copy; ${new Date().getFullYear()} שטיחי בוטיק יוסף. כל הזכויות שמורות.</p>
              </div>
            </div>
          </body>
          </html>
        `,
        text: `
פנייה חדשה מהאתר - שטיחי בוטיק יוסף

שם מלא: ${name}
אימייל: ${email}
${phone ? `טלפון: ${phone}` : ''}
נושא: ${subjectText}

הודעה:
${message}

---
ניתן להשיב ישירות למייל זה
        `,
      });

      // Auto-reply to customer
      await resend.emails.send({
        from: EMAIL_FROM,
        to: email,
        subject: 'קיבלנו את פניייתך - שטיחי בוטיק יוסף',
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
              .success-box { background: #e8f5e9; border: 2px solid #4caf50; padding: 20px; margin: 20px 0; text-align: center; border-radius: 8px; }
              .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>קיבלנו את פניייתך!</h1>
              </div>
              <div class="content">
                <div class="success-box">
                  <h2 style="color: #4caf50; margin: 0;">תודה שפנית אלינו, ${name}</h2>
                </div>

                <p>שלום ${name},</p>
                <p>תודה שפנית לשטיחי בוטיק יוסף. קיבלנו את הודעתך בנושא "<strong>${subjectText}</strong>" ונחזור אליך בהקדם האפשרי.</p>

                <p>זמן מענה צפוי: <strong>24 שעות</strong> (בימי עסקים)</p>

                <div style="background: #f8f9fa; padding: 20px; margin: 20px 0; border-radius: 8px;">
                  <h3 style="margin-top: 0;">פרטי הפנייה שלך:</h3>
                  <p style="margin: 5px 0;"><strong>נושא:</strong> ${subjectText}</p>
                  <p style="margin: 5px 0;"><strong>הודעה:</strong></p>
                  <p style="white-space: pre-wrap; color: #666;">${message}</p>
                </div>

                <p>במידה ויש לך שאלות נוספות, אתה מוזמן ליצור קשר:</p>
                <ul>
                  <li>טלפון: <a href="tel:0515092208">051-509-2208</a></li>
                  <li>WhatsApp: <a href="https://wa.me/972515092208">שלח הודעה</a></li>
                  <li>אימייל: <a href="mailto:info@boutique-yossef.co.il">info@boutique-yossef.co.il</a></li>
                </ul>

                <p>שעות פעילות:</p>
                <ul>
                  <li>ראשון - חמישי: 9:00 - 18:00</li>
                  <li>שישי: 9:00 - 14:00</li>
                  <li>שבת: סגור</li>
                </ul>

                <p style="margin-top: 30px;">
                  <strong>שטיחי בוטיק יוסף</strong><br>
                  השקד משק 47, מושב בית עזרא
                </p>
              </div>
              <div class="footer">
                <p>&copy; ${new Date().getFullYear()} שטיחי בוטיק יוסף. כל הזכויות שמורות.</p>
              </div>
            </div>
          </body>
          </html>
        `,
        text: `
קיבלנו את פניייתך - שטיחי בוטיק יוסף

שלום ${name},

תודה שפנית לשטיחי בוטיק יוסף. קיבלנו את הודעתך בנושא "${subjectText}" ונחזור אליך בהקדם האפשרי.

זמן מענה צפוי: 24 שעות (בימי עסקים)

פרטי הפנייה שלך:
נושא: ${subjectText}
הודעה: ${message}

במידה ויש לך שאלות נוספות, אתה מוזמן ליצור קשר:
טלפון: 051-509-2208
WhatsApp: https://wa.me/972515092208
אימייל: info@boutique-yossef.co.il

שעות פעילות:
ראשון - חמישי: 9:00 - 18:00
שישי: 9:00 - 14:00
שבת: סגור

שטיחי בוטיק יוסף
השקד משק 47, מושב בית עזרא
        `,
      });
    } catch (emailError: any) {
      console.error('Resend error:', emailError);
      return NextResponse.json(
        { error: 'שגיאה בשליחת המייל. אנא נסה שוב או צור קשר טלפונית' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'ההודעה נשלחה בהצלחה! נחזור אליך בהקדם',
    });

  } catch (error: any) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'שגיאה בשליחת ההודעה. אנא נסה שוב' },
      { status: 500 }
    );
  }
}
