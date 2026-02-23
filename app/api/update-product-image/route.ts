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
    const { imageId, sortOrder, colorId } = await request.json();

    if (!imageId || (sortOrder === undefined && colorId === undefined)) {
      return NextResponse.json(
        { error: 'Missing imageId or update fields' },
        { status: 400 }
      );
    }

    // Build update object dynamically
    const updateData: Record<string, any> = {};
    if (sortOrder !== undefined) updateData.sort_order = sortOrder;
    if (colorId !== undefined) updateData.color_id = colorId || null;

    const { error: dbError } = await supabaseAdmin
      .from('product_images')
      .update(updateData)
      .eq('id', imageId);

    if (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json(
        { error: dbError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
