-- Add sort_order to products for manual ordering
ALTER TABLE products ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;

-- Initialize sort_order based on current created_at order
WITH ranked AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at DESC) as rn
  FROM products
)
UPDATE products SET sort_order = ranked.rn
FROM ranked WHERE products.id = ranked.id;
