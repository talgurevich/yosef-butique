-- Remove SKU requirement and unique constraints
-- This allows products to be created without SKU or with duplicate SKUs

-- 1. Drop unique constraint on products.sku
ALTER TABLE products DROP CONSTRAINT IF EXISTS products_sku_key;

-- 2. Make products.sku nullable (if not already)
ALTER TABLE products ALTER COLUMN sku DROP NOT NULL;

-- 3. Drop unique constraint on product_variants.sku
ALTER TABLE product_variants DROP CONSTRAINT IF EXISTS product_variants_sku_key;

-- 4. Make product_variants.sku nullable (if not already)
ALTER TABLE product_variants ALTER COLUMN sku DROP NOT NULL;

-- Note: SKU fields will still exist but won't be required or enforced as unique
-- The application will auto-generate SKUs in the background
