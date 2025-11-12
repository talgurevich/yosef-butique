-- Fix RLS policies for product_images table
-- Run this in your Supabase SQL Editor

-- Drop existing policies if any
DROP POLICY IF EXISTS "Anyone can insert product images" ON product_images;
DROP POLICY IF EXISTS "Anyone can update product images" ON product_images;
DROP POLICY IF EXISTS "Anyone can delete product images" ON product_images;
DROP POLICY IF EXISTS "Anyone can read product images" ON product_images;

-- Enable RLS
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;

-- Create permissive policies for development
CREATE POLICY "Anyone can insert product images" ON product_images
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update product images" ON product_images
  FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Anyone can delete product images" ON product_images
  FOR DELETE USING (true);

CREATE POLICY "Anyone can read product images" ON product_images
  FOR SELECT USING (true);
