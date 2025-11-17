import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabase } from '@/lib/supabase';

// Validate PayPlus hash to ensure request authenticity
function validatePayPlusHash(body: any, hash: string, secretKey: string): boolean {
  if (!body || !hash) {
    return false;
  }

  const message = JSON.stringify(body);
  const genHash = crypto
    .createHmac('sha256', secretKey)
    .update(message)
    .digest('base64');

  return genHash === hash;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const headers = request.headers;

    // Validate that request is from PayPlus
    const userAgent = headers.get('user-agent');
    const hash = headers.get('hash');
    const secretKey = process.env.PAYPLUS_SECRET_KEY;

    if (!secretKey) {
      console.error('Missing PayPlus secret key');
      return NextResponse.json({ error: 'Configuration error' }, { status: 500 });
    }

    // Verify user-agent is PayPlus
    if (userAgent !== 'PayPlus') {
      console.error('Invalid user-agent:', userAgent);
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Validate hash
    if (!hash || !validatePayPlusHash(body, hash, secretKey)) {
      console.error('Invalid hash signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    console.log('PayPlus callback received:', body);

    // Extract transaction data
    const {
      transaction_uid,
      page_request_uid,
      status_code,
      amount,
      currency_code,
      customer_name,
      customer_email,
      transaction_type,
      approval_number,
      voucher_number,
      four_digits,
      more_info,
      items,
    } = body.data || body;

    // Store transaction in database
    if (supabase) {
      try {
        const { error } = await supabase.from('payment_transactions').insert({
          transaction_uid,
          page_request_uid,
          status_code,
          amount,
          currency_code: currency_code || 'ILS',
          customer_name,
          customer_email,
          transaction_type,
          approval_number,
          voucher_number,
          card_last_digits: four_digits,
          more_info,
          items_data: items ? JSON.stringify(items) : null,
          raw_callback_data: JSON.stringify(body),
          created_at: new Date().toISOString(),
        });

        if (error) {
          console.error('Error saving transaction to database:', error);
        } else {
          console.log('Transaction saved to database:', transaction_uid);
        }

        // If successful payment, you might want to:
        // 1. Update order status
        // 2. Send confirmation email
        // 3. Clear shopping cart
        // etc.

      } catch (dbError) {
        console.error('Database error:', dbError);
      }
    }

    // Return success response to PayPlus
    return NextResponse.json({ success: true, received: true });

  } catch (error: any) {
    console.error('Payment callback error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    );
  }
}
