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
    const { imageId, imageUrl } = await request.json();

    if (!imageId || !imageUrl) {
      return NextResponse.json(
        { error: 'Missing imageId or imageUrl' },
        { status: 400 }
      );
    }

    // Extract filename from URL
    const urlParts = imageUrl.split('/');
    const fileName = urlParts.slice(-2).join('/'); // productId/filename

    // Delete from storage
    const { error: storageError } = await supabaseAdmin.storage
      .from('product-images')
      .remove([fileName]);

    if (storageError) {
      console.error('Storage error:', storageError);
    }

    // Delete from database
    const { error: dbError } = await supabaseAdmin
      .from('product_images')
      .delete()
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
