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
    const { imageId, sortOrder } = await request.json();

    if (!imageId || sortOrder === undefined) {
      return NextResponse.json(
        { error: 'Missing imageId or sortOrder' },
        { status: 400 }
      );
    }

    // Update sort order
    const { error: dbError } = await supabaseAdmin
      .from('product_images')
      .update({ sort_order: sortOrder })
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
