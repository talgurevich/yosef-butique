-- ============================================================
-- RLS Security Migration
-- Run this AFTER deploying the code changes (admin API routes)
-- ============================================================

-- ============================================================
-- Step 1: Drop all existing permissive policies
-- ============================================================

-- products
DROP POLICY IF EXISTS "Anyone can view products" ON products;
DROP POLICY IF EXISTS "Anyone can insert products" ON products;
DROP POLICY IF EXISTS "Anyone can update products" ON products;
DROP POLICY IF EXISTS "Anyone can delete products" ON products;
DROP POLICY IF EXISTS "Public can view active products" ON products;

-- categories
DROP POLICY IF EXISTS "Anyone can view categories" ON categories;
DROP POLICY IF EXISTS "Anyone can insert categories" ON categories;
DROP POLICY IF EXISTS "Anyone can update categories" ON categories;
DROP POLICY IF EXISTS "Anyone can delete categories" ON categories;
DROP POLICY IF EXISTS "Public can view active categories" ON categories;

-- product_images
DROP POLICY IF EXISTS "Anyone can read product images" ON product_images;
DROP POLICY IF EXISTS "Anyone can insert product images" ON product_images;
DROP POLICY IF EXISTS "Anyone can update product images" ON product_images;
DROP POLICY IF EXISTS "Anyone can delete product images" ON product_images;
DROP POLICY IF EXISTS "Public can view product images" ON product_images;

-- product_variants
DROP POLICY IF EXISTS "Anyone can insert variants" ON product_variants;
DROP POLICY IF EXISTS "Anyone can update variants" ON product_variants;
DROP POLICY IF EXISTS "Anyone can delete variants" ON product_variants;
DROP POLICY IF EXISTS "Public can view active product variants" ON product_variants;

-- orders
DROP POLICY IF EXISTS "Anyone can view orders" ON orders;
DROP POLICY IF EXISTS "Anyone can insert orders" ON orders;
DROP POLICY IF EXISTS "Anyone can update orders" ON orders;

-- order_items
DROP POLICY IF EXISTS "Anyone can view order items" ON order_items;
DROP POLICY IF EXISTS "Anyone can insert order items" ON order_items;

-- users
DROP POLICY IF EXISTS "Anyone can view users" ON users;
DROP POLICY IF EXISTS "Anyone can insert users" ON users;
DROP POLICY IF EXISTS "Anyone can update users" ON users;

-- newsletter_subscribers
DROP POLICY IF EXISTS "Anyone can view newsletter subscribers" ON newsletter_subscribers;
DROP POLICY IF EXISTS "Anyone can insert newsletter subscribers" ON newsletter_subscribers;
DROP POLICY IF EXISTS "Anyone can update newsletter subscribers" ON newsletter_subscribers;

-- customer_gallery
DROP POLICY IF EXISTS "Anyone can view gallery" ON customer_gallery;
DROP POLICY IF EXISTS "Anyone can insert gallery" ON customer_gallery;
DROP POLICY IF EXISTS "Anyone can update gallery" ON customer_gallery;
DROP POLICY IF EXISTS "Anyone can delete gallery" ON customer_gallery;

-- promo_codes
DROP POLICY IF EXISTS "Anyone can view promo codes" ON promo_codes;
DROP POLICY IF EXISTS "Anyone can insert promo codes" ON promo_codes;
DROP POLICY IF EXISTS "Anyone can update promo codes" ON promo_codes;
DROP POLICY IF EXISTS "Anyone can delete promo codes" ON promo_codes;

-- product_categories
DROP POLICY IF EXISTS "Anyone can view product categories" ON product_categories;
DROP POLICY IF EXISTS "Anyone can insert product categories" ON product_categories;
DROP POLICY IF EXISTS "Anyone can update product categories" ON product_categories;
DROP POLICY IF EXISTS "Anyone can delete product categories" ON product_categories;

-- product_colors
DROP POLICY IF EXISTS "Anyone can view product colors" ON product_colors;
DROP POLICY IF EXISTS "Anyone can insert product colors" ON product_colors;
DROP POLICY IF EXISTS "Anyone can update product colors" ON product_colors;
DROP POLICY IF EXISTS "Anyone can delete product colors" ON product_colors;

-- product_shapes
DROP POLICY IF EXISTS "Anyone can view product shapes" ON product_shapes;
DROP POLICY IF EXISTS "Anyone can insert product shapes" ON product_shapes;
DROP POLICY IF EXISTS "Anyone can update product shapes" ON product_shapes;
DROP POLICY IF EXISTS "Anyone can delete product shapes" ON product_shapes;

-- product_spaces
DROP POLICY IF EXISTS "Anyone can view product spaces" ON product_spaces;
DROP POLICY IF EXISTS "Anyone can insert product spaces" ON product_spaces;
DROP POLICY IF EXISTS "Anyone can update product spaces" ON product_spaces;
DROP POLICY IF EXISTS "Anyone can delete product spaces" ON product_spaces;

-- colors
DROP POLICY IF EXISTS "Anyone can view colors" ON colors;
DROP POLICY IF EXISTS "Anyone can insert colors" ON colors;
DROP POLICY IF EXISTS "Anyone can update colors" ON colors;
DROP POLICY IF EXISTS "Anyone can delete colors" ON colors;

-- shapes
DROP POLICY IF EXISTS "Anyone can view shapes" ON shapes;
DROP POLICY IF EXISTS "Anyone can insert shapes" ON shapes;
DROP POLICY IF EXISTS "Anyone can update shapes" ON shapes;
DROP POLICY IF EXISTS "Anyone can delete shapes" ON shapes;

-- spaces
DROP POLICY IF EXISTS "Anyone can view spaces" ON spaces;
DROP POLICY IF EXISTS "Anyone can insert spaces" ON spaces;
DROP POLICY IF EXISTS "Anyone can update spaces" ON spaces;
DROP POLICY IF EXISTS "Anyone can delete spaces" ON spaces;

-- banner
DROP POLICY IF EXISTS "Allow authenticated delete" ON banner;
DROP POLICY IF EXISTS "Allow authenticated insert" ON banner;
DROP POLICY IF EXISTS "Allow authenticated update" ON banner;
DROP POLICY IF EXISTS "Allow public read" ON banner;

-- csv_import_logs
DROP POLICY IF EXISTS "Anyone can view import logs" ON csv_import_logs;
DROP POLICY IF EXISTS "Anyone can insert import logs" ON csv_import_logs;

-- email_campaigns
DROP POLICY IF EXISTS "Anyone can view campaigns" ON email_campaigns;
DROP POLICY IF EXISTS "Anyone can insert campaigns" ON email_campaigns;
DROP POLICY IF EXISTS "Anyone can update campaigns" ON email_campaigns;

-- plant taxonomy
DROP POLICY IF EXISTS "Anyone can view plant types" ON plant_types;
DROP POLICY IF EXISTS "Anyone can insert plant types" ON plant_types;
DROP POLICY IF EXISTS "Anyone can update plant types" ON plant_types;
DROP POLICY IF EXISTS "Anyone can delete plant types" ON plant_types;

DROP POLICY IF EXISTS "Anyone can view plant sizes" ON plant_sizes;
DROP POLICY IF EXISTS "Anyone can insert plant sizes" ON plant_sizes;
DROP POLICY IF EXISTS "Anyone can update plant sizes" ON plant_sizes;
DROP POLICY IF EXISTS "Anyone can delete plant sizes" ON plant_sizes;

DROP POLICY IF EXISTS "Anyone can view plant care levels" ON plant_care_levels;
DROP POLICY IF EXISTS "Anyone can insert plant care levels" ON plant_care_levels;
DROP POLICY IF EXISTS "Anyone can update plant care levels" ON plant_care_levels;
DROP POLICY IF EXISTS "Anyone can delete plant care levels" ON plant_care_levels;

DROP POLICY IF EXISTS "Anyone can view plant light requirements" ON plant_light_requirements;
DROP POLICY IF EXISTS "Anyone can insert plant light requirements" ON plant_light_requirements;
DROP POLICY IF EXISTS "Anyone can update plant light requirements" ON plant_light_requirements;
DROP POLICY IF EXISTS "Anyone can delete plant light requirements" ON plant_light_requirements;

DROP POLICY IF EXISTS "Anyone can view plant pet safety" ON plant_pet_safety;
DROP POLICY IF EXISTS "Anyone can insert plant pet safety" ON plant_pet_safety;
DROP POLICY IF EXISTS "Anyone can update plant pet safety" ON plant_pet_safety;
DROP POLICY IF EXISTS "Anyone can delete plant pet safety" ON plant_pet_safety;

-- plant junction tables
DROP POLICY IF EXISTS "Anyone can view product plant types" ON product_plant_types;
DROP POLICY IF EXISTS "Anyone can insert product plant types" ON product_plant_types;
DROP POLICY IF EXISTS "Anyone can delete product plant types" ON product_plant_types;

DROP POLICY IF EXISTS "Anyone can view product plant sizes" ON product_plant_sizes;
DROP POLICY IF EXISTS "Anyone can insert product plant sizes" ON product_plant_sizes;
DROP POLICY IF EXISTS "Anyone can delete product plant sizes" ON product_plant_sizes;

DROP POLICY IF EXISTS "Anyone can view product plant light requirements" ON product_plant_light_requirements;
DROP POLICY IF EXISTS "Anyone can insert product plant light requirements" ON product_plant_light_requirements;
DROP POLICY IF EXISTS "Anyone can delete product plant light requirements" ON product_plant_light_requirements;

DROP POLICY IF EXISTS "Anyone can view product plant care levels" ON product_plant_care_levels;
DROP POLICY IF EXISTS "Anyone can insert product plant care levels" ON product_plant_care_levels;
DROP POLICY IF EXISTS "Anyone can delete product plant care levels" ON product_plant_care_levels;

DROP POLICY IF EXISTS "Anyone can view product plant pet safety" ON product_plant_pet_safety;
DROP POLICY IF EXISTS "Anyone can insert product plant pet safety" ON product_plant_pet_safety;
DROP POLICY IF EXISTS "Anyone can delete product plant pet safety" ON product_plant_pet_safety;

-- product_types
DROP POLICY IF EXISTS "Anyone can view product types" ON product_types;
DROP POLICY IF EXISTS "Anyone can insert product types" ON product_types;
DROP POLICY IF EXISTS "Anyone can update product types" ON product_types;
DROP POLICY IF EXISTS "Anyone can delete product types" ON product_types;


-- ============================================================
-- Step 2: Enable RLS on ALL tables
-- ============================================================

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE colors ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_colors ENABLE ROW LEVEL SECURITY;
ALTER TABLE shapes ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_shapes ENABLE ROW LEVEL SECURITY;
ALTER TABLE spaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_spaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE plant_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE plant_sizes ENABLE ROW LEVEL SECURITY;
ALTER TABLE plant_light_requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE plant_care_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE plant_pet_safety ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_plant_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_plant_sizes ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_plant_light_requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_plant_care_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_plant_pet_safety ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE banner ENABLE ROW LEVEL SECURITY;
ALTER TABLE promo_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE csv_import_logs ENABLE ROW LEVEL SECURITY;


-- ============================================================
-- Step 3: Create PUBLIC SELECT policies (catalog tables only)
-- These allow the frontend to read product data with the anon key
-- ============================================================

CREATE POLICY "Public read" ON products FOR SELECT USING (true);
CREATE POLICY "Public read" ON product_variants FOR SELECT USING (true);
CREATE POLICY "Public read" ON product_images FOR SELECT USING (true);
CREATE POLICY "Public read" ON categories FOR SELECT USING (true);
CREATE POLICY "Public read" ON product_categories FOR SELECT USING (true);
CREATE POLICY "Public read" ON colors FOR SELECT USING (true);
CREATE POLICY "Public read" ON product_colors FOR SELECT USING (true);
CREATE POLICY "Public read" ON shapes FOR SELECT USING (true);
CREATE POLICY "Public read" ON product_shapes FOR SELECT USING (true);
CREATE POLICY "Public read" ON spaces FOR SELECT USING (true);
CREATE POLICY "Public read" ON product_spaces FOR SELECT USING (true);
CREATE POLICY "Public read" ON product_types FOR SELECT USING (true);
CREATE POLICY "Public read" ON plant_types FOR SELECT USING (true);
CREATE POLICY "Public read" ON plant_sizes FOR SELECT USING (true);
CREATE POLICY "Public read" ON plant_light_requirements FOR SELECT USING (true);
CREATE POLICY "Public read" ON plant_care_levels FOR SELECT USING (true);
CREATE POLICY "Public read" ON plant_pet_safety FOR SELECT USING (true);
CREATE POLICY "Public read" ON product_plant_types FOR SELECT USING (true);
CREATE POLICY "Public read" ON product_plant_sizes FOR SELECT USING (true);
CREATE POLICY "Public read" ON product_plant_light_requirements FOR SELECT USING (true);
CREATE POLICY "Public read" ON product_plant_care_levels FOR SELECT USING (true);
CREATE POLICY "Public read" ON product_plant_pet_safety FOR SELECT USING (true);
CREATE POLICY "Public read" ON customer_gallery FOR SELECT USING (true);
CREATE POLICY "Public read" ON banner FOR SELECT USING (true);
CREATE POLICY "Public read" ON promo_codes FOR SELECT USING (true);


-- ============================================================
-- Step 4: Service role access for sensitive tables
-- (service_role bypasses RLS by default, but explicit policy for clarity)
-- No anon policies = no public access to these tables
-- ============================================================

-- payment_transactions already has service_role policy, keep it
-- orders, order_items, users, newsletter_subscribers, email_campaigns, csv_import_logs
-- get NO anon policies — only accessible via API routes using service role key


-- ============================================================
-- Step 5: Fix function search paths (security warnings)
-- ============================================================

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_colors_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_shapes_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_spaces_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_plant_types_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$;
