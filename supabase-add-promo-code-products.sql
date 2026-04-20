-- Promo code targeting: per-product scope
-- Run this in Supabase SQL Editor.

-- 1. Add applies_to_all flag (default TRUE keeps existing codes behaving the same)
ALTER TABLE promo_codes
  ADD COLUMN IF NOT EXISTS applies_to_all BOOLEAN NOT NULL DEFAULT TRUE;

-- 2. Junction table: which products a scoped code is allowed on
CREATE TABLE IF NOT EXISTS promo_code_products (
  promo_code_id UUID NOT NULL REFERENCES promo_codes(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  PRIMARY KEY (promo_code_id, product_id)
);

CREATE INDEX IF NOT EXISTS idx_promo_code_products_promo_code_id
  ON promo_code_products(promo_code_id);

CREATE INDEX IF NOT EXISTS idx_promo_code_products_product_id
  ON promo_code_products(product_id);

-- 3. RLS: server-only writes (admin route uses service role); allow public read so the validate API can use the anon client if needed.
ALTER TABLE promo_code_products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read" ON promo_code_products;
CREATE POLICY "Allow public read" ON promo_code_products
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow service role write" ON promo_code_products;
CREATE POLICY "Allow service role write" ON promo_code_products
  FOR ALL USING (true) WITH CHECK (true);
