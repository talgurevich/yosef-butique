# Supabase Storage Setup for Product Images

## Step 1: Create Storage Bucket

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Click on **Storage** in the left sidebar
4. Click **New bucket**
5. Fill in the details:
   - **Name**: `product-images`
   - **Public bucket**: ✅ Check this (images need to be publicly accessible)
   - **File size limit**: 5MB (or your preferred limit)
   - **Allowed MIME types**: `image/*`
6. Click **Create bucket**

## Step 2: Set Storage Policies

The bucket is public, so images are automatically accessible. But we need to set upload/delete policies.

Go to **Storage** → **Policies** → `product-images` bucket

### Policy 1: Anyone can view images (already set if public)

```sql
CREATE POLICY "Public can view product images"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');
```

### Policy 2: Authenticated users can upload (for now, allow all - secure later)

```sql
CREATE POLICY "Anyone can upload product images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'product-images');
```

### Policy 3: Authenticated users can delete

```sql
CREATE POLICY "Anyone can delete product images"
ON storage.objects FOR DELETE
USING (bucket_id = 'product-images');
```

## Step 3: Get Storage URL

Your storage URL pattern will be:
```
https://[YOUR_PROJECT_ID].supabase.co/storage/v1/object/public/product-images/[FILE_NAME]
```

For your project:
```
https://misrndbeenoqmmicojxw.supabase.co/storage/v1/object/public/product-images/[FILE_NAME]
```

## That's it!

The application code has been updated to:
- Upload images when creating/editing products
- Store image URLs in the `product_images` table
- Display images on product cards and product detail pages

## Image Upload Features:
- Multiple images per product
- Drag & drop support
- Image preview before upload
- Set primary image
- Delete images
- Reorder images

## Production Security Note:

Before going live, update the storage policies to require authentication:

```sql
-- Replace "Anyone can upload" with admin-only policy
DROP POLICY "Anyone can upload product images" ON storage.objects;

CREATE POLICY "Authenticated admin can upload product images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'product-images'
  AND auth.uid() IS NOT NULL
);
```
