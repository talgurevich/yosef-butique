-- Add spaces (room types) taxonomy table
-- This creates a dimension for different room types where rugs can be used

-- Create spaces table
CREATE TABLE IF NOT EXISTS spaces (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create product_spaces junction table (many-to-many)
CREATE TABLE IF NOT EXISTS product_spaces (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  space_id UUID NOT NULL REFERENCES spaces(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(product_id, space_id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_product_spaces_product_id ON product_spaces(product_id);
CREATE INDEX IF NOT EXISTS idx_product_spaces_space_id ON product_spaces(space_id);
CREATE INDEX IF NOT EXISTS idx_spaces_slug ON spaces(slug);

-- Insert common room types (Hebrew names)
INSERT INTO spaces (name, slug, description, sort_order, is_active)
VALUES
  ('סלון', 'living-room', 'שטיחים מתאימים לסלון', 1, true),
  ('חדר שינה', 'bedroom', 'שטיחים מתאימים לחדרי שינה', 2, true),
  ('חדר ילדים', 'kids-room', 'שטיחים מתאימים לחדרי ילדים', 3, true),
  ('חדר אוכל', 'dining-room', 'שטיחים מתאימים לחדר אוכל', 4, true),
  ('מסדרון', 'hallway', 'שטיחים מתאימים למסדרון', 5, true),
  ('משרד', 'office', 'שטיחים מתאימים למשרד', 6, true),
  ('חדר רחצה', 'bathroom', 'שטיחים מתאימים לחדר רחצה', 7, true),
  ('מרפסת', 'balcony', 'שטיחים חיצוניים למרפסת', 8, true)
ON CONFLICT (slug) DO NOTHING;

-- Add updated_at trigger for spaces
CREATE OR REPLACE FUNCTION update_spaces_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER spaces_updated_at_trigger
BEFORE UPDATE ON spaces
FOR EACH ROW
EXECUTE FUNCTION update_spaces_updated_at();

-- Migration: Move existing products from bedroom/kids categories to spaces
-- First, create space associations for products in bedroom category
INSERT INTO product_spaces (product_id, space_id)
SELECT DISTINCT pc.product_id, s.id
FROM product_categories pc
JOIN categories c ON pc.category_id = c.id
JOIN spaces s ON s.slug = 'bedroom'
WHERE c.slug = 'bedroom-rugs'
ON CONFLICT (product_id, space_id) DO NOTHING;

-- Create space associations for products in kids room category
INSERT INTO product_spaces (product_id, space_id)
SELECT DISTINCT pc.product_id, s.id
FROM product_categories pc
JOIN categories c ON pc.category_id = c.id
JOIN spaces s ON s.slug = 'kids-room'
WHERE c.slug = 'kids-rooms'
ON CONFLICT (product_id, space_id) DO NOTHING;

-- Now remove the redundant category associations
DELETE FROM product_categories
WHERE category_id IN (
  SELECT id FROM categories WHERE slug IN ('bedroom-rugs', 'kids-rooms')
);

-- Delete the redundant style categories
DELETE FROM categories WHERE slug IN ('bedroom-rugs', 'kids-rooms');

-- Verification query (optional - run this after to verify)
-- SELECT name, slug FROM categories WHERE parent_id IS NOT NULL ORDER BY sort_order;
-- SELECT name, slug FROM spaces ORDER BY sort_order;
