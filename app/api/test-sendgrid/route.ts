import { NextRequest, NextResponse } from 'next/server';
import sgMail from '@sendgrid/mail';

export async function GET(request: NextRequest) {
  try {
    const apiKey = process.env.SENDGRID_API_KEY;
    const fromEmail = process.env.SENDGRID_FROM_EMAIL;

    if (!apiKey) {
      return NextResponse.json({
        success: false,
        error: 'SENDGRID_API_KEY not configured',
      });
    }

    if (!fromEmail) {
      return NextResponse.json({
        success: false,
        error: 'SENDGRID_FROM_EMAIL not configured',
      });
    }

    sgMail.setApiKey(apiKey);

    const testEmail = request.nextUrl.searchParams.get('email');

    if (!testEmail) {
      return NextResponse.json({
        success: false,
        error: 'Please provide ?email=your@email.com in the URL',
      });
    }

    const msg = {
      to: testEmail,
      from: fromEmail,
      subject: 'SendGrid Test Email - Boutique Yossef',
      html: `
        <h1>SendGrid Test Successful!</h1>
        <p>This is a test email from your newsletter system.</p>
        <p><strong>From Email:</strong> ${fromEmail}</p>
        <p><strong>API Key:</strong> ${apiKey.substring(0, 10)}...</p>
        <p><strong>Time:</strong> ${new Date().toISOString()}</p>
      `,
      text: 'SendGrid Test Successful! This is a test email from your newsletter system.',
    };

    await sgMail.send(msg);

    return NextResponse.json({
      success: true,
      message: 'Test email sent successfully',
      from: fromEmail,
      to: testEmail,
      time: new Date().toISOString(),
    });

  } catch (error: any) {
    console.error('SendGrid test error:', error);

    return NextResponse.json({
      success: false,
      error: error.message || 'Unknown error',
      code: error.code,
      response: error.response?.body,
    }, { status: 500 });
  }
}
