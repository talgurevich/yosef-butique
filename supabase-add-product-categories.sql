-- Add many-to-many relationship between products and categories
-- This allows a product to belong to multiple categories

-- Create product_categories junction table
CREATE TABLE IF NOT EXISTS product_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(product_id, category_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_product_categories_product ON product_categories(product_id);
CREATE INDEX IF NOT EXISTS idx_product_categories_category ON product_categories(category_id);

-- Enable RLS
ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;

-- Public can view product-category relationships
CREATE POLICY "Public can view product categories" ON product_categories
  FOR SELECT USING (true);

-- Anyone can insert/update/delete (for development - secure this before production!)
CREATE POLICY "Anyone can insert product categories" ON product_categories
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update product categories" ON product_categories
  FOR UPDATE USING (true);

CREATE POLICY "Anyone can delete product categories" ON product_categories
  FOR DELETE USING (true);

-- Also ensure categories table has permissive policies for development
DROP POLICY IF EXISTS "Anyone can insert categories" ON categories;
DROP POLICY IF EXISTS "Anyone can update categories" ON categories;
DROP POLICY IF EXISTS "Anyone can delete categories" ON categories;

CREATE POLICY "Anyone can insert categories" ON categories
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update categories" ON categories
  FOR UPDATE USING (true);

CREATE POLICY "Anyone can delete categories" ON categories
  FOR DELETE USING (true);
