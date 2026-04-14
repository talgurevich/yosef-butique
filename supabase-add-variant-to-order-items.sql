-- Migration: Add variant details (size, color) to order_items
-- Previously, only product_sku (which stores the variant_id) was persisted,
-- so the confirmation emails could not display size/color. This migration
-- adds dedicated columns so the checkout flow can persist them and the
-- email template can render them.

ALTER TABLE order_items
  ADD COLUMN IF NOT EXISTS variant_size TEXT,
  ADD COLUMN IF NOT EXISTS variant_color TEXT;

COMMENT ON COLUMN order_items.variant_size IS 'Human-readable size of the variant at the time of order (e.g., 160×230)';
COMMENT ON COLUMN order_items.variant_color IS 'Human-readable color name of the variant at the time of order';
