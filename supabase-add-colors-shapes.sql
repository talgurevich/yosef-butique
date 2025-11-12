-- Add colors and shapes taxonomy tables
-- This creates separate dimension tables for better product filtering and organization

-- Create colors table
CREATE TABLE IF NOT EXISTS colors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE,
  hex_code VARCHAR(7), -- For visual display (e.g., #FF5733)
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create shapes table
CREATE TABLE IF NOT EXISTS shapes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create product_colors junction table (many-to-many)
CREATE TABLE IF NOT EXISTS product_colors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  color_id UUID NOT NULL REFERENCES colors(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(product_id, color_id)
);

-- Create product_shapes junction table (many-to-many)
CREATE TABLE IF NOT EXISTS product_shapes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  shape_id UUID NOT NULL REFERENCES shapes(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(product_id, shape_id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_product_colors_product_id ON product_colors(product_id);
CREATE INDEX IF NOT EXISTS idx_product_colors_color_id ON product_colors(color_id);
CREATE INDEX IF NOT EXISTS idx_product_shapes_product_id ON product_shapes(product_id);
CREATE INDEX IF NOT EXISTS idx_product_shapes_shape_id ON product_shapes(shape_id);
CREATE INDEX IF NOT EXISTS idx_colors_slug ON colors(slug);
CREATE INDEX IF NOT EXISTS idx_shapes_slug ON shapes(slug);

-- Insert common carpet colors (Hebrew names)
INSERT INTO colors (name, slug, hex_code, sort_order, is_active)
VALUES
  ('אפור', 'gray', '#808080', 1, true),
  ('שחור', 'black', '#000000', 2, true),
  ('לבן', 'white', '#FFFFFF', 3, true),
  ('בז''', 'beige', '#F5F5DC', 4, true),
  ('חום', 'brown', '#8B4513', 5, true),
  ('כחול', 'blue', '#0000FF', 6, true),
  ('ירוק', 'green', '#008000', 7, true),
  ('אדום', 'red', '#FF0000', 8, true),
  ('ורוד', 'pink', '#FFC0CB', 9, true),
  ('צהוב', 'yellow', '#FFFF00', 10, true),
  ('כתום', 'orange', '#FFA500', 11, true),
  ('סגול', 'purple', '#800080', 12, true),
  ('רב צבעי', 'multicolor', NULL, 13, true)
ON CONFLICT (slug) DO NOTHING;

-- Insert common carpet shapes (Hebrew names)
INSERT INTO shapes (name, slug, description, sort_order, is_active)
VALUES
  ('מלבן', 'rectangle', 'שטיח בצורה מלבנית קלאסית', 1, true),
  ('ריבוע', 'square', 'שטיח בצורה מרובעת', 2, true),
  ('עגול', 'round', 'שטיח בצורה עגולה', 3, true),
  ('אובלי', 'oval', 'שטיח בצורה אובלית', 4, true),
  ('מעבר', 'runner', 'שטיח מעבר צר וארוך', 5, true),
  ('לא סימטרי', 'irregular', 'שטיח בצורה לא סטנדרטית', 6, true)
ON CONFLICT (slug) DO NOTHING;

-- Add updated_at trigger for colors
CREATE OR REPLACE FUNCTION update_colors_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER colors_updated_at_trigger
BEFORE UPDATE ON colors
FOR EACH ROW
EXECUTE FUNCTION update_colors_updated_at();

-- Add updated_at trigger for shapes
CREATE OR REPLACE FUNCTION update_shapes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER shapes_updated_at_trigger
BEFORE UPDATE ON shapes
FOR EACH ROW
EXECUTE FUNCTION update_shapes_updated_at();
