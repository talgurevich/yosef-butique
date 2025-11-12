-- Migration: Add Product Variants for Multiple Dimensions
-- This allows each carpet to have multiple size options

-- Create product_variants table
CREATE TABLE IF NOT EXISTS product_variants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  size TEXT NOT NULL,
  sku TEXT UNIQUE NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  compare_at_price DECIMAL(10, 2),
  stock_quantity INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for better performance
CREATE INDEX idx_product_variants_product ON product_variants(product_id);
CREATE INDEX idx_product_variants_sku ON product_variants(sku);

-- Create trigger for updated_at
CREATE TRIGGER update_product_variants_updated_at BEFORE UPDATE ON product_variants
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;

-- Public read access for active variants
CREATE POLICY "Public can view active product variants" ON product_variants
  FOR SELECT USING (is_active = true);

-- Update products table - remove size field (now in variants)
-- Keep price as base/starting price for display
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS has_variants BOOLEAN DEFAULT false;

-- Comment on tables
COMMENT ON TABLE product_variants IS 'Different size/dimension options for each product';
COMMENT ON COLUMN product_variants.size IS 'Size in format: 160×230, 200×290, etc.';
COMMENT ON COLUMN product_variants.sku IS 'Unique SKU for this specific variant (e.g., RUG-001-M)';
COMMENT ON COLUMN product_variants.price IS 'Price for this specific size (can vary by size)';
