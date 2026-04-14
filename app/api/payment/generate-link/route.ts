import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendSlackNotification } from '@/lib/slack';

type CartItemPayload = {
  productId: string;
  variantId: string;
  productName: string;
  variantSize: string;
  variantColor?: string;
  price: number;
  quantity: number;
  slug: string;
};

async function generateOrderNumber(supabaseAdmin: any): Promise<string> {
  const { data } = await supabaseAdmin
    .from('orders')
    .select('order_number')
    .order('created_at', { ascending: false })
    .limit(100);

  let maxNum = 0;
  if (data) {
    for (const row of data) {
      const num = parseInt(row.order_number, 10);
      if (!isNaN(num) && num > maxNum) maxNum = num;
    }
  }

  return String(maxNum + 1);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      amount,
      currency_code = 'ILS',
      customer,
      items,
      more_info,
      cartItems,
      deliveryCost = 0,
      discountAmount = 0,
      couponCode,
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
      console.error('Missing PayPlus credentials:', { apiKey: !!apiKey, secretKey: !!secretKey, paymentPageUid: !!paymentPageUid });
      return NextResponse.json(
        { error: 'Payment system not configured' },
        { status: 500 }
      );
    }

    // Create Supabase admin client for DB writes
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    // Generate sequential order number
    const orderNumber = await generateOrderNumber(supabaseAdmin);
    const total = parseFloat(amount);
    const subtotal = (cartItems as CartItemPayload[] | undefined)?.reduce(
      (sum: number, item: CartItemPayload) => sum + item.price * item.quantity,
      0
    ) ?? total;
    const tax = Math.round((total * 18 / 118) * 100) / 100;

    // Store extra data in billing_address JSON (existing jsonb column)
    const billingAddress = {
      name: customer?.customer_name || '',
      phone: customer?.phone || '',
      address: customer?.address || '',
      city: customer?.city || '',
      discount_amount: discountAmount,
      coupon_code: couponCode || null,
      currency: currency_code,
    };

    // Create pending order (using existing table schema)
    const { data: orderData, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert({
        order_number: orderNumber,
        status: 'pending',
        payment_status: 'pending',
        customer_email: customer?.email || '',
        customer_phone: customer?.phone || '',
        subtotal,
        shipping_cost: deliveryCost,
        total,
        tax,
        notes: more_info || null,
        billing_address: billingAddress,
        created_at: new Date().toISOString(),
      })
      .select('id')
      .single();

    if (orderError) {
      console.error('Error creating order:', orderError);
      return NextResponse.json(
        { error: 'Failed to create order' },
        { status: 500 }
      );
    }

    const orderId = orderData.id;

    // Create order items (using existing table schema)
    if (cartItems && Array.isArray(cartItems) && cartItems.length > 0) {
      const orderItems = (cartItems as CartItemPayload[]).map((item) => ({
        order_id: orderId,
        product_id: item.productId,
        product_name: item.productName,
        product_sku: item.variantId,
        variant_size: item.variantSize || null,
        variant_color: item.variantColor || null,
        quantity: item.quantity,
        unit_price: item.price,
        total_price: item.price * item.quantity,
      }));

      const { error: itemsError } = await supabaseAdmin
        .from('order_items')
        .insert(orderItems);

      if (itemsError) {
        console.error('Error creating order items:', itemsError);
      }
    }

    // Get the base URL for callbacks
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://boutique-yossef.co.il';

    // Prepare PayPlus request
    const payPlusRequest = {
      payment_page_uid: paymentPageUid,
      charge_method: 1, // 1 = Charge (J4) - immediate payment
      amount: total,
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

    const slackItems = (cartItems as CartItemPayload[] || []).map((item) => ({
      productName: item.productName,
      variantSize: item.variantSize,
      variantColor: item.variantColor,
      price: item.price,
      quantity: item.quantity,
    }));
    await sendSlackNotification({
      type: 'checkout_started',
      customerName: customer?.customer_name || '',
      customerEmail: customer?.email || '',
      customerPhone: customer?.phone || '',
      orderNumber,
      items: slackItems,
      total,
    });

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
      console.error('PayPlus API error:', JSON.stringify(data), 'status:', response.status, 'url:', apiUrl);
      // Return order info with fallback flag so checkout can redirect to demo page
      return NextResponse.json({
        success: false,
        fallback: true,
        order_number: orderNumber,
        order_id: orderId,
        error: 'PayPlus API unavailable',
        details: data,
      }, { status: 200 });
    }

    // Update order with PayPlus page_request_uid
    const { error: updateError } = await supabaseAdmin
      .from('orders')
      .update({ payplus_transaction_id: data.data.page_request_uid })
      .eq('id', orderId);

    if (updateError) {
      console.error('Error updating order with page_request_uid:', updateError);
    }

    console.log('Payment link generated successfully, order:', orderNumber);

    await sendSlackNotification({
      type: 'payment_link_generated',
      customerName: customer?.customer_name || '',
      customerEmail: customer?.email || '',
      customerPhone: customer?.phone || '',
      orderNumber,
      items: slackItems,
      total,
    });

    return NextResponse.json({
      success: true,
      payment_link: data.data.payment_page_link,
      page_request_uid: data.data.page_request_uid,
      order_number: orderNumber,
    });

  } catch (error: any) {
    console.error('Payment link generation error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    );
  }
}
