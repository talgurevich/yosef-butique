-- Migration: Add Color to Product Variants
-- This allows each variant (size) to have a specific color

-- Add color_id column to product_variants table
ALTER TABLE product_variants
  ADD COLUMN IF NOT EXISTS color_id UUID REFERENCES colors(id) ON DELETE SET NULL;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_product_variants_color ON product_variants(color_id);

-- Update comment
COMMENT ON COLUMN product_variants.color_id IS 'Color for this specific variant (optional - allows size+color combinations)';
COMMENT ON TABLE product_variants IS 'Different size and color combinations for each product';
