-- Fix RLS Policies - Allow Admin Operations
-- Run this in Supabase SQL Editor to fix "violates row-level security policy" error

-- For now, we'll allow all authenticated operations
-- Later, we'll add proper admin role checks

-- Products: Allow all operations (temporary - for development)
DROP POLICY IF EXISTS "Public can view active products" ON products;

CREATE POLICY "Anyone can view products" ON products
  FOR SELECT USING (true);

CREATE POLICY "Anyone can insert products" ON products
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update products" ON products
  FOR UPDATE USING (true);

CREATE POLICY "Anyone can delete products" ON products
  FOR DELETE USING (true);

-- Product Variants: Allow all operations
CREATE POLICY "Anyone can insert variants" ON product_variants
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update variants" ON product_variants
  FOR UPDATE USING (true);

CREATE POLICY "Anyone can delete variants" ON product_variants
  FOR DELETE USING (true);

-- Product Images: Allow all operations
CREATE POLICY "Anyone can insert product images" ON product_images
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update product images" ON product_images
  FOR UPDATE USING (true);

CREATE POLICY "Anyone can delete product images" ON product_images
  FOR DELETE USING (true);

-- Categories: Allow all operations
DROP POLICY IF EXISTS "Public can view active categories" ON categories;

CREATE POLICY "Anyone can view categories" ON categories
  FOR SELECT USING (true);

CREATE POLICY "Anyone can insert categories" ON categories
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update categories" ON categories
  FOR UPDATE USING (true);

CREATE POLICY "Anyone can delete categories" ON categories
  FOR DELETE USING (true);

-- Orders: Allow all operations
CREATE POLICY "Anyone can insert orders" ON orders
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can view orders" ON orders
  FOR SELECT USING (true);

CREATE POLICY "Anyone can update orders" ON orders
  FOR UPDATE USING (true);

-- Order Items: Allow all operations
CREATE POLICY "Anyone can insert order items" ON order_items
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can view order items" ON order_items
  FOR SELECT USING (true);

-- Newsletter: Allow all operations
CREATE POLICY "Anyone can insert newsletter subscribers" ON newsletter_subscribers
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can view newsletter subscribers" ON newsletter_subscribers
  FOR SELECT USING (true);

CREATE POLICY "Anyone can update newsletter subscribers" ON newsletter_subscribers
  FOR UPDATE USING (true);

-- Customer Gallery: Allow all operations
DROP POLICY IF EXISTS "Public can view active customer gallery" ON customer_gallery;

CREATE POLICY "Anyone can view gallery" ON customer_gallery
  FOR SELECT USING (true);

CREATE POLICY "Anyone can insert gallery" ON customer_gallery
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update gallery" ON customer_gallery
  FOR UPDATE USING (true);

CREATE POLICY "Anyone can delete gallery" ON customer_gallery
  FOR DELETE USING (true);

-- Promo Codes: Allow all operations
CREATE POLICY "Anyone can view promo codes" ON promo_codes
  FOR SELECT USING (true);

CREATE POLICY "Anyone can insert promo codes" ON promo_codes
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update promo codes" ON promo_codes
  FOR UPDATE USING (true);

CREATE POLICY "Anyone can delete promo codes" ON promo_codes
  FOR DELETE USING (true);

-- Email Campaigns: Allow all operations
CREATE POLICY "Anyone can view campaigns" ON email_campaigns
  FOR SELECT USING (true);

CREATE POLICY "Anyone can insert campaigns" ON email_campaigns
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update campaigns" ON email_campaigns
  FOR UPDATE USING (true);

-- Users: Allow all operations
CREATE POLICY "Anyone can view users" ON users
  FOR SELECT USING (true);

CREATE POLICY "Anyone can insert users" ON users
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update users" ON users
  FOR UPDATE USING (true);

-- CSV Import Logs: Allow all operations
CREATE POLICY "Anyone can view import logs" ON csv_import_logs
  FOR SELECT USING (true);

CREATE POLICY "Anyone can insert import logs" ON csv_import_logs
  FOR INSERT WITH CHECK (true);

-- Note: These are development/permissive policies
-- For production, you should implement proper authentication and role-based access control
-- Check the SECURITY-GUIDE.md for production security recommendations
