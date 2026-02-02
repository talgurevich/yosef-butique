import { createClient } from '@supabase/supabase-js';
import sharp from 'sharp';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Logo URL
const logoUrl = 'https://boutique-yossef.co.il/logo-new.png';

async function getLogoBuffer(): Promise<Buffer> {
  console.log('Fetching logo from:', logoUrl);
  const response = await fetch(logoUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch logo: ${response.status}`);
  }
  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

async function addWatermark(imageBuffer: Buffer, logoBuffer: Buffer): Promise<Buffer> {
  const image = sharp(imageBuffer);
  const metadata = await image.metadata();
  const imageWidth = metadata.width || 800;
  const imageHeight = metadata.height || 600;

  // Calculate logo size (60% of image width)
  const logoWidth = Math.round(imageWidth * 0.6);

  // Resize the logo
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
}

async function processExistingImages() {
  console.log('Starting watermark process for existing images...\n');

  // Fetch logo once
  const logoBuffer = await getLogoBuffer();
  console.log('Logo loaded successfully\n');

  // Get all images from product_images table
  const { data: images, error: fetchError } = await supabase
    .from('product_images')
    .select('id, image_url, product_id');

  if (fetchError) {
    console.error('Error fetching images:', fetchError);
    return;
  }

  console.log(`Found ${images?.length || 0} images to process\n`);

  let processed = 0;
  let failed = 0;

  for (const image of images || []) {
    try {
      // Extract the storage path from the URL
      const url = new URL(image.image_url);
      const pathMatch = url.pathname.match(/\/product-images\/(.+)$/);

      if (!pathMatch) {
        console.log(`Skipping ${image.id}: Could not parse path from URL`);
        failed++;
        continue;
      }

      const storagePath = decodeURIComponent(pathMatch[1]);
      console.log(`Processing: ${storagePath}`);

      // Download the image
      const { data: imageData, error: downloadError } = await supabase.storage
        .from('product-images')
        .download(storagePath);

      if (downloadError || !imageData) {
        console.log(`  Failed to download: ${downloadError?.message}`);
        failed++;
        continue;
      }

      // Convert to buffer
      const imageBuffer = Buffer.from(await imageData.arrayBuffer());

      // Add watermark
      const watermarkedBuffer = await addWatermark(imageBuffer, logoBuffer);

      // Upload back (overwrite)
      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(storagePath, watermarkedBuffer, {
          contentType: 'image/jpeg',
          upsert: true, // Overwrite existing
        });

      if (uploadError) {
        console.log(`  Failed to upload: ${uploadError.message}`);
        failed++;
        continue;
      }

      console.log(`  Done!`);
      processed++;
    } catch (err) {
      console.log(`  Error: ${err}`);
      failed++;
    }
  }

  console.log(`\nCompleted: ${processed} processed, ${failed} failed`);
}

processExistingImages().catch(console.error);
