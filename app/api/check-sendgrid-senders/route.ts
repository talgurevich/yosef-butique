import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const apiKey = process.env.SENDGRID_API_KEY;

    if (!apiKey) {
      return NextResponse.json({
        success: false,
        error: 'SENDGRID_API_KEY not configured',
      });
    }

    // Get verified senders from SendGrid
    const response = await fetch('https://api.sendgrid.com/v3/verified_senders', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({
        success: false,
        error: 'Failed to fetch verified senders',
        details: data,
      }, { status: response.status });
    }

    return NextResponse.json({
      success: true,
      verifiedSenders: data.results || data,
      currentFromEmail: process.env.SENDGRID_FROM_EMAIL,
      message: 'Check if your FROM email matches any verified sender below',
    });

  } catch (error: any) {
    console.error('SendGrid check error:', error);

    return NextResponse.json({
      success: false,
      error: error.message || 'Unknown error',
    }, { status: 500 });
  }
}
