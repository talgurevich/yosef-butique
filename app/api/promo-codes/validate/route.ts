import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

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
    const { code, cartTotal } = await request.json();

    if (!code) {
      return NextResponse.json(
        { error: 'קוד הנחה לא סופק' },
        { status: 400 }
      );
    }

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

    // Check minimum purchase amount
    if (promoCode.min_purchase_amount > 0 && cartTotal < promoCode.min_purchase_amount) {
      return NextResponse.json(
        { error: `קוד הנחה זה דורש רכישה מינימלית של ₪${promoCode.min_purchase_amount}` },
        { status: 400 }
      );
    }

    // Calculate discount amount
    let discountAmount = 0;
    if (promoCode.discount_type === 'percentage') {
      discountAmount = (cartTotal * promoCode.discount_value) / 100;
    } else if (promoCode.discount_type === 'fixed') {
      discountAmount = promoCode.discount_value;
    }

    // Ensure discount doesn't exceed cart total
    discountAmount = Math.min(discountAmount, cartTotal);

    return NextResponse.json({
      success: true,
      promoCode: {
        id: promoCode.id,
        code: promoCode.code,
        discount_type: promoCode.discount_type,
        discount_value: promoCode.discount_value,
        discountAmount,
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
