-- Add sort_order to product_colors for controlling color display order
ALTER TABLE product_colors ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;
