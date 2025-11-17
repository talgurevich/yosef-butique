import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      amount,
      currency_code = 'ILS',
      customer,
      items,
      more_info,
    } = body;

    // Validate required fields
    if (!amount) {
      return NextResponse.json(
        { error: 'Amount is required' },
        { status: 400 }
      );
    }

    // PayPlus API credentials from environment variables
    const apiKey = process.env.PAYPLUS_API_KEY;
    const secretKey = process.env.PAYPLUS_SECRET_KEY;
    const paymentPageUid = process.env.PAYPLUS_PAYMENT_PAGE_UID;
    const apiUrl = process.env.PAYPLUS_API_URL || 'https://restapi.payplus.co.il/api/v1.0';

    if (!apiKey || !secretKey || !paymentPageUid) {
      console.error('Missing PayPlus credentials');
      return NextResponse.json(
        { error: 'Payment system not configured' },
        { status: 500 }
      );
    }

    // Get the base URL for callbacks
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://boutique-yossef.co.il';

    // Prepare PayPlus request
    const payPlusRequest = {
      payment_page_uid: paymentPageUid,
      charge_method: 1, // 1 = Charge (J4) - immediate payment
      amount: parseFloat(amount),
      currency_code,
      sendEmailApproval: true,
      sendEmailFailure: false,
      refURL_success: `${baseUrl}/payment/success`,
      refURL_failure: `${baseUrl}/payment/failure`,
      refURL_callback: `${baseUrl}/api/payment/callback`,
      send_failure_callback: true,
      create_token: false,
      initial_invoice: true,
      paying_vat: true,
      customer: customer || undefined,
      items: items || undefined,
      more_info: more_info || undefined,
    };

    console.log('Generating PayPlus payment link...');

    // Call PayPlus API
    const response = await fetch(`${apiUrl}/PaymentPages/generateLink`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': apiKey,
        'secret-key': secretKey,
      },
      body: JSON.stringify(payPlusRequest),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('PayPlus API error:', data);
      return NextResponse.json(
        { error: 'Failed to generate payment link', details: data },
        { status: response.status }
      );
    }

    console.log('Payment link generated successfully');

    return NextResponse.json({
      success: true,
      payment_link: data.data.payment_page_link,
      page_request_uid: data.data.page_request_uid,
    });

  } catch (error: any) {
    console.error('Payment link generation error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    );
  }
}
