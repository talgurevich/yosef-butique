import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import sharp from 'sharp';

// Cache for logo buffer
let cachedLogoBuffer: Buffer | null = null;

async function getLogoBuffer(): Promise<Buffer> {
  if (cachedLogoBuffer) {
    return cachedLogoBuffer;
  }

  // Get the site URL from environment or use production URL
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'https://boutique-yossef.co.il';

  const logoUrl = `${siteUrl}/logo-new.png`;

  console.log('Fetching logo from:', logoUrl);

  const response = await fetch(logoUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch logo: ${response.status}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  cachedLogoBuffer = Buffer.from(arrayBuffer);
  return cachedLogoBuffer;
}

async function addWatermark(imageBuffer: Buffer): Promise<Buffer> {
  try {
    // Get the original image metadata
    const image = sharp(imageBuffer);
    const metadata = await image.metadata();
    const imageWidth = metadata.width || 800;
    const imageHeight = metadata.height || 600;

    // Calculate logo size (60% of image width)
    const logoWidth = Math.round(imageWidth * 0.6);

    // Load and resize the logo
    const logoBuffer = await getLogoBuffer();
    const resizedLogo = await sharp(logoBuffer)
      .resize(logoWidth)
      .toBuffer();

    // Get resized logo dimensions
    const logoMetadata = await sharp(resizedLogo).metadata();
    const logoHeight = logoMetadata.height || 50;

    // Calculate position: centered horizontally, 50px from bottom
    const left = Math.round((imageWidth - logoWidth) / 2);
    const top = imageHeight - logoHeight - 50;

    // Composite the logo onto the image
    const watermarkedImage = await sharp(imageBuffer)
      .composite([
        {
          input: resizedLogo,
          top: Math.max(0, top),
          left: Math.max(0, left),
        },
      ])
      .toBuffer();

    return watermarkedImage;
  } catch (error) {
    console.error('Error adding watermark:', error);
    // Return original if watermarking fails
    return imageBuffer;
  }
}

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
    const fileExt = file.name.split('.').pop()?.toLowerCase();
    const fileName = `${productId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

    // Convert file to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    let buffer = Buffer.from(arrayBuffer);

    // Add watermark to the image (only for supported formats)
    if (['jpg', 'jpeg', 'png', 'webp'].includes(fileExt || '')) {
      buffer = await addWatermark(buffer);
    }

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
