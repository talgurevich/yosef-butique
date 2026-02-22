import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';
import { sendOrderConfirmationEmail, sendAdminOrderNotificationEmail } from '@/lib/order-emails';

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

function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
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

    const supabaseAdmin = getSupabaseAdmin();

    // Store transaction in database
    try {
      const { error } = await supabaseAdmin.from('payment_transactions').insert({
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
    } catch (dbError) {
      console.error('Database error saving transaction:', dbError);
    }

    // Find the pending order by page_request_uid
    const { data: order, error: orderFetchError } = await supabaseAdmin
      .from('orders')
      .select('*')
      .eq('payplus_transaction_id', page_request_uid)
      .single();

    if (orderFetchError || !order) {
      console.error('Order not found for page_request_uid:', page_request_uid, orderFetchError);
      return NextResponse.json({ success: true, received: true });
    }

    // Check if payment was successful
    // PayPlus status codes: 000 = success, or status_code can be a string "000"
    const isSuccess = status_code === '000' || status_code === 0 || status_code === '0' || String(status_code) === '000';

    if (isSuccess) {
      // Update order status to processing / paid
      const { error: updateError } = await supabaseAdmin
        .from('orders')
        .update({
          status: 'processing',
          payment_status: 'paid',
          paid_at: new Date().toISOString(),
        })
        .eq('id', order.id);

      if (updateError) {
        console.error('Error updating order status:', updateError);
      } else {
        console.log('Order updated to processing:', order.order_number);
      }

      // Fetch order items for inventory deduction and emails
      const { data: orderItems, error: itemsFetchError } = await supabaseAdmin
        .from('order_items')
        .select('*')
        .eq('order_id', order.id);

      if (itemsFetchError) {
        console.error('Error fetching order items:', itemsFetchError);
      }

      // Deduct inventory
      if (orderItems && orderItems.length > 0) {
        for (const item of orderItems) {
          // Deduct from product_variants
          const { error: variantStockError } = await supabaseAdmin.rpc('decrement_stock', {
            p_variant_id: item.variant_id,
            p_quantity: item.quantity,
          });

          if (variantStockError) {
            // Fallback: direct update on product_variants
            console.error('RPC decrement_stock failed, trying direct update:', variantStockError);
            const { data: variant } = await supabaseAdmin
              .from('product_variants')
              .select('stock_quantity')
              .eq('id', item.variant_id)
              .single();

            if (variant) {
              await supabaseAdmin
                .from('product_variants')
                .update({ stock_quantity: Math.max(0, variant.stock_quantity - item.quantity) })
                .eq('id', item.variant_id);
            }
          }

          // Also deduct from products.stock_quantity
          const { data: product } = await supabaseAdmin
            .from('products')
            .select('stock_quantity')
            .eq('id', item.product_id)
            .single();

          if (product) {
            await supabaseAdmin
              .from('products')
              .update({ stock_quantity: Math.max(0, product.stock_quantity - item.quantity) })
              .eq('id', item.product_id);
          }
        }
        console.log('Inventory deducted for order:', order.order_number);
      }

      // Send emails
      try {
        const emailItems = (orderItems || []).map((item: any) => ({
          product_name: item.product_name,
          variant_size: item.variant_size,
          variant_color: item.variant_color,
          price: item.price,
          quantity: item.quantity,
        }));

        const orderData = {
          order_number: order.order_number,
          subtotal: order.subtotal,
          delivery_cost: order.delivery_cost,
          discount_amount: order.discount_amount,
          coupon_code: order.coupon_code,
          total: order.total,
          tax: order.tax,
          notes: order.notes,
        };

        const customerData = {
          customer_name: order.customer_name,
          email: order.customer_email,
          phone: order.customer_phone,
        };

        // Send both emails in parallel
        await Promise.allSettled([
          sendOrderConfirmationEmail(orderData, emailItems, customerData),
          sendAdminOrderNotificationEmail(orderData, emailItems, customerData),
        ]);

        console.log('Order emails sent for:', order.order_number);
      } catch (emailError) {
        console.error('Error sending order emails:', emailError);
        // Non-fatal: order is still processed even if emails fail
      }
    } else {
      // Payment failed - update order
      const { error: updateError } = await supabaseAdmin
        .from('orders')
        .update({
          payment_status: 'failed',
        })
        .eq('id', order.id);

      if (updateError) {
        console.error('Error updating order payment_status to failed:', updateError);
      }
      console.log('Payment failed for order:', order.order_number, 'status_code:', status_code);
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
