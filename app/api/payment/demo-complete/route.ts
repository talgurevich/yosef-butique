import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendOrderConfirmationEmail, sendAdminOrderNotificationEmail } from '@/lib/order-emails';

export async function POST(request: NextRequest) {
  try {
    const { order_id, card_last_digits } = await request.json();

    if (!order_id) {
      return NextResponse.json({ error: 'Missing order_id' }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    // Fetch the order
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .select('*')
      .eq('id', order_id)
      .single();

    if (orderError || !order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Generate a demo approval number
    const approvalNumber = `DEMO-${Math.floor(100000 + Math.random() * 900000)}`;

    // Update order to paid
    const { error: updateError } = await supabaseAdmin
      .from('orders')
      .update({
        status: 'processing',
        payment_status: 'paid',
        payment_method: 'demo',
      })
      .eq('id', order_id);

    if (updateError) {
      console.error('Error updating order:', updateError);
      return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
    }

    // Fetch order items for inventory and emails
    const { data: orderItems } = await supabaseAdmin
      .from('order_items')
      .select('*')
      .eq('order_id', order_id);

    // Deduct inventory
    if (orderItems && orderItems.length > 0) {
      for (const item of orderItems) {
        const variantId = item.product_sku;

        const { data: variant } = await supabaseAdmin
          .from('product_variants')
          .select('stock_quantity')
          .eq('id', variantId)
          .single();

        if (variant) {
          await supabaseAdmin
            .from('product_variants')
            .update({ stock_quantity: Math.max(0, variant.stock_quantity - item.quantity) })
            .eq('id', variantId);
        }

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
    }

    // Send emails
    try {
      const billing = order.billing_address || {};
      const customerName = billing.name || order.customer_email;
      const discountAmount = billing.discount_amount || 0;
      const couponCode = billing.coupon_code || null;

      const emailItems = (orderItems || []).map((item: any) => ({
        product_name: item.product_name,
        variant_size: '',
        price: item.unit_price,
        quantity: item.quantity,
      }));

      const orderData = {
        order_number: order.order_number,
        subtotal: order.subtotal,
        delivery_cost: order.shipping_cost || 0,
        discount_amount: discountAmount,
        coupon_code: couponCode,
        total: order.total,
        tax: order.tax || 0,
        notes: order.notes,
      };

      const customerData = {
        customer_name: customerName,
        email: order.customer_email,
        phone: order.customer_phone || billing.phone || '',
      };

      await Promise.allSettled([
        sendOrderConfirmationEmail(orderData, emailItems, customerData),
        sendAdminOrderNotificationEmail(orderData, emailItems, customerData),
      ]);
    } catch (emailError) {
      console.error('Error sending emails:', emailError);
    }

    return NextResponse.json({
      success: true,
      approval_number: approvalNumber,
    });
  } catch (error: any) {
    console.error('Demo payment error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
