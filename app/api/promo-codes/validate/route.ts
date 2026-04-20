import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

type CartLine = {
  product_id: string;
  price: number;
  quantity: number;
};

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
    const body = await request.json();
    const code = body.code as string | undefined;
    const cart = (body.cart as CartLine[] | undefined) || [];
    // Backwards-compat: older clients may still send cartTotal without items
    const fallbackCartTotal = typeof body.cartTotal === 'number' ? body.cartTotal : null;

    if (!code) {
      return NextResponse.json(
        { error: 'קוד הנחה לא סופק' },
        { status: 400 }
      );
    }

    const cartTotal = cart.length > 0
      ? cart.reduce((sum, l) => sum + (l.price || 0) * (l.quantity || 0), 0)
      : (fallbackCartTotal ?? 0);

    // Fetch promo code from database
    const { data: promoCode, error: fetchError } = await supabaseAdmin
      .from('promo_codes')
      .select('*')
      .eq('code', code.toUpperCase())
      .single();

    if (fetchError || !promoCode) {
      return NextResponse.json(
        { error: 'קוד ההנחה אינו תקף' },
        { status: 404 }
      );
    }

    // Check if promo code is active
    if (!promoCode.is_active) {
      return NextResponse.json(
        { error: 'קוד ההנחה אינו פעיל' },
        { status: 400 }
      );
    }

    // Check if promo code has expired
    if (promoCode.expires_at) {
      const expiryDate = new Date(promoCode.expires_at);
      if (expiryDate < new Date()) {
        return NextResponse.json(
          { error: 'קוד ההנחה פג תוקף' },
          { status: 400 }
        );
      }
    }

    // Check if max uses exceeded
    if (promoCode.max_uses && promoCode.current_uses >= promoCode.max_uses) {
      return NextResponse.json(
        { error: 'קוד ההנחה מוגבל לשימוש והגיע למקסימום השימושים' },
        { status: 400 }
      );
    }

    // Check minimum purchase amount — always against the full cart subtotal
    if (promoCode.min_purchase_amount > 0 && cartTotal < promoCode.min_purchase_amount) {
      return NextResponse.json(
        { error: `קוד הנחה זה דורש רכישה מינימלית של ₪${promoCode.min_purchase_amount}` },
        { status: 400 }
      );
    }

    // Determine eligible amount + product ids the discount applies to
    let eligibleAmount = cartTotal;
    let appliedToProductIds: string[] = [];

    // Free shipping always applies to the whole cart, regardless of any product targeting
    const isFreeShipping = promoCode.discount_type === 'free_shipping';

    if (promoCode.applies_to_all === false && !isFreeShipping) {
      // Look up the product whitelist
      const { data: links } = await supabaseAdmin
        .from('promo_code_products')
        .select('product_id')
        .eq('promo_code_id', promoCode.id);

      const allowedProductIds = new Set((links || []).map((l) => l.product_id));

      if (allowedProductIds.size === 0) {
        return NextResponse.json(
          { error: 'קוד ההנחה לא מוגדר עם מוצרים זכאים' },
          { status: 400 }
        );
      }

      const eligibleLines = cart.filter((l) => allowedProductIds.has(l.product_id));

      if (eligibleLines.length === 0) {
        return NextResponse.json(
          { error: 'קוד ההנחה אינו תקף עבור המוצרים בעגלה' },
          { status: 400 }
        );
      }

      eligibleAmount = eligibleLines.reduce((sum, l) => sum + (l.price || 0) * (l.quantity || 0), 0);
      appliedToProductIds = eligibleLines.map((l) => l.product_id);
    }

    // Calculate discount amount
    let discountAmount = 0;
    if (promoCode.discount_type === 'percentage') {
      discountAmount = (eligibleAmount * promoCode.discount_value) / 100;
    } else if (promoCode.discount_type === 'fixed') {
      discountAmount = promoCode.discount_value;
    } else if (isFreeShipping) {
      discountAmount = 0; // Delivery cost zeroed out in cart context
    }

    // Ensure discount doesn't exceed the eligible amount (or full cart for sitewide)
    if (!isFreeShipping) {
      discountAmount = Math.min(discountAmount, eligibleAmount);
    }

    return NextResponse.json({
      success: true,
      promoCode: {
        id: promoCode.id,
        code: promoCode.code,
        discount_type: promoCode.discount_type,
        discount_value: promoCode.discount_value,
        discountAmount,
        applies_to_all: promoCode.applies_to_all !== false,
        appliedToProductIds,
      },
      message: 'קוד ההנחה הופעל בהצלחה!'
    });

  } catch (error: any) {
    console.error('Promo code validation error:', error);
    return NextResponse.json(
      { error: 'שגיאה באימות קוד ההנחה' },
      { status: 500 }
    );
  }
}
