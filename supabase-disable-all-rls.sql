-- Disable RLS on ALL tables for development
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/misrndbeenoqmmicojxw/sql

-- This will remove all RLS restrictions for development

ALTER TABLE categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
ALTER TABLE product_images DISABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants DISABLE ROW LEVEL SECURITY;
ALTER TABLE product_categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE order_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers DISABLE ROW LEVEL SECURITY;
ALTER TABLE email_campaigns DISABLE ROW LEVEL SECURITY;
ALTER TABLE customer_gallery DISABLE ROW LEVEL SECURITY;
ALTER TABLE promo_codes DISABLE ROW LEVEL SECURITY;
ALTER TABLE csv_import_logs DISABLE ROW LEVEL SECURITY;
