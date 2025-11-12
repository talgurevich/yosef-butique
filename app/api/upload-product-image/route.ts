import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  // Server-side admin client with service role key
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const productId = formData.get('productId') as string;
    const sortOrder = parseInt(formData.get('sortOrder') as string);

    if (!file || !productId) {
      return NextResponse.json(
        { error: 'Missing file or productId' },
        { status: 400 }
      );
    }

    // Create unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${productId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

    // Convert file to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Supabase Storage
    const { error: uploadError } = await supabaseAdmin.storage
      .from('product-images')
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: false
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return NextResponse.json(
        { error: uploadError.message },
        { status: 500 }
      );
    }

    // Get public URL
    const { data: urlData } = supabaseAdmin.storage
      .from('product-images')
      .getPublicUrl(fileName);

    // Save to database (bypasses RLS with service role key)
    const { data: imageData, error: dbError } = await supabaseAdmin
      .from('product_images')
      .insert([
        {
          product_id: productId,
          image_url: urlData.publicUrl,
          alt_text: file.name,
          sort_order: sortOrder,
        },
      ])
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json(
        { error: dbError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ data: imageData });
  } catch (error: any) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
