-- One-off backfill for order #4
--
-- Order #4 was created before order_items had variant_size / variant_color
-- columns, so those fields are empty. However, order_items.product_sku stores
-- the product_variants.id, which lets us recover the size (and color, if a
-- color_id was set on the variant).
--
-- Prerequisite: run supabase-add-variant-to-order-items.sql first.
--
-- Safety: this only updates rows belonging to order #4 and only fills in
-- columns that are currently NULL/empty.

-- 1) Preview what will be written (run this first to sanity-check):
SELECT
  oi.id                AS order_item_id,
  oi.product_name,
  oi.product_sku       AS variant_id,
  pv.size              AS recovered_size,
  c.name               AS recovered_color,
  oi.variant_size      AS current_variant_size,
  oi.variant_color     AS current_variant_color
FROM order_items oi
JOIN orders o             ON o.id = oi.order_id
LEFT JOIN product_variants pv ON pv.id::text = oi.product_sku
LEFT JOIN colors c            ON c.id = pv.color_id
WHERE o.order_number = '4';

-- 2) Apply the backfill (uncomment to run):
-- UPDATE order_items oi
-- SET
--   variant_size  = COALESCE(NULLIF(oi.variant_size, ''),  pv.size),
--   variant_color = COALESCE(NULLIF(oi.variant_color, ''), c.name)
-- FROM orders o
-- LEFT JOIN product_variants pv ON pv.id::text = oi.product_sku
-- LEFT JOIN colors c            ON c.id = pv.color_id
-- WHERE oi.order_id = o.id
--   AND o.order_number = '4';
