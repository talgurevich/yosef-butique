-- Add product types system to support different product categories (Carpets vs Plants)
-- This allows each product type to have its own specific attributes

-- Create product_types table
CREATE TABLE IF NOT EXISTS product_types (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert the two product types
INSERT INTO product_types (name, slug, description, is_active)
VALUES
  ('שטיחים', 'carpets', 'שטיחים וריצוף רך', true),
  ('עציצים', 'plants', 'צמחים ועציצים', true)
ON CONFLICT (slug) DO NOTHING;

-- Add product_type_id to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS product_type_id UUID REFERENCES product_types(id);

-- Set all existing products to carpets type
UPDATE products
SET product_type_id = (SELECT id FROM product_types WHERE slug = 'carpets')
WHERE product_type_id IS NULL;

-- Make product_type_id required going forward
ALTER TABLE products ALTER COLUMN product_type_id SET NOT NULL;

-- Create index
CREATE INDEX IF NOT EXISTS idx_products_product_type_id ON products(product_type_id);

-- ============================================================================
-- PLANT-SPECIFIC DIMENSIONS
-- ============================================================================

-- 1. Plant Types (סוג צמח)
CREATE TABLE IF NOT EXISTS plant_types (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

INSERT INTO plant_types (name, slug, description, sort_order, is_active)
VALUES
  ('צמחי בית', 'indoor', 'צמחים מתאימים לגידול בבית', 1, true),
  ('צמחי חוץ', 'outdoor', 'צמחים מתאימים לגידול בחוץ', 2, true),
  ('סוקולנטים', 'succulents', 'צמחים עם עלים עסיסיים', 3, true),
  ('צמחי תבלין', 'herbs', 'צמחי תבלין למטבח', 4, true),
  ('צמחים פורחים', 'flowering', 'צמחים עם פריחה', 5, true),
  ('עצי נוי', 'decorative-trees', 'עצים קטנים לנוי', 6, true)
ON CONFLICT (slug) DO NOTHING;

-- 2. Plant Sizes (גודל)
CREATE TABLE IF NOT EXISTS plant_sizes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

INSERT INTO plant_sizes (name, slug, description, sort_order, is_active)
VALUES
  ('קטן', 'small', 'עד 30 ס"מ', 1, true),
  ('בינוני', 'medium', '30-60 ס"מ', 2, true),
  ('גדול', 'large', '60-120 ס"מ', 3, true),
  ('ענק', 'extra-large', 'מעל 120 ס"מ', 4, true)
ON CONFLICT (slug) DO NOTHING;

-- 3. Light Requirements (דרישות אור)
CREATE TABLE IF NOT EXISTS plant_light_requirements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

INSERT INTO plant_light_requirements (name, slug, description, sort_order, is_active)
VALUES
  ('אור מועט', 'low-light', 'מתאים למקומות עם אור טבעי מועט', 1, true),
  ('אור בינוני', 'medium-light', 'מתאים לאור טבעי בינוני', 2, true),
  ('אור בהיר', 'bright-light', 'מתאים לאור טבעי בהיר עקיף', 3, true),
  ('שמש ישירה', 'direct-sunlight', 'דורש חשיפה לשמש ישירה', 4, true)
ON CONFLICT (slug) DO NOTHING;

-- 4. Care Levels (רמת טיפול)
CREATE TABLE IF NOT EXISTS plant_care_levels (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

INSERT INTO plant_care_levels (name, slug, description, sort_order, is_active)
VALUES
  ('קל - מתאים למתחילים', 'easy', 'צמח קל לטיפול, מתאים למתחילים', 1, true),
  ('בינוני', 'moderate', 'דורש תשומת לב בינונית', 2, true),
  ('מתקדם', 'advanced', 'דורש ידע וטיפול מתמיד', 3, true)
ON CONFLICT (slug) DO NOTHING;

-- 5. Pet Safety (בטוח לחיות מחמד)
CREATE TABLE IF NOT EXISTS plant_pet_safety (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

INSERT INTO plant_pet_safety (name, slug, description, sort_order, is_active)
VALUES
  ('בטוח', 'safe', 'בטוח לחיות מחמד', 1, true),
  ('רעיל - הרחק מחיות', 'toxic', 'רעיל לחיות מחמד - יש להרחיק', 2, true)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================================
-- PLANT JUNCTION TABLES (many-to-many relationships)
-- ============================================================================

CREATE TABLE IF NOT EXISTS product_plant_types (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  plant_type_id UUID NOT NULL REFERENCES plant_types(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(product_id, plant_type_id)
);

CREATE TABLE IF NOT EXISTS product_plant_sizes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  plant_size_id UUID NOT NULL REFERENCES plant_sizes(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(product_id, plant_size_id)
);

CREATE TABLE IF NOT EXISTS product_plant_light_requirements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  plant_light_requirement_id UUID NOT NULL REFERENCES plant_light_requirements(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(product_id, plant_light_requirement_id)
);

CREATE TABLE IF NOT EXISTS product_plant_care_levels (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  plant_care_level_id UUID NOT NULL REFERENCES plant_care_levels(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(product_id, plant_care_level_id)
);

CREATE TABLE IF NOT EXISTS product_plant_pet_safety (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  plant_pet_safety_id UUID NOT NULL REFERENCES plant_pet_safety(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(product_id, plant_pet_safety_id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_product_plant_types_product_id ON product_plant_types(product_id);
CREATE INDEX IF NOT EXISTS idx_product_plant_types_plant_type_id ON product_plant_types(plant_type_id);
CREATE INDEX IF NOT EXISTS idx_product_plant_sizes_product_id ON product_plant_sizes(product_id);
CREATE INDEX IF NOT EXISTS idx_product_plant_sizes_plant_size_id ON product_plant_sizes(plant_size_id);
CREATE INDEX IF NOT EXISTS idx_product_plant_light_requirements_product_id ON product_plant_light_requirements(product_id);
CREATE INDEX IF NOT EXISTS idx_product_plant_light_requirements_plant_light_requirement_id ON product_plant_light_requirements(plant_light_requirement_id);
CREATE INDEX IF NOT EXISTS idx_product_plant_care_levels_product_id ON product_plant_care_levels(product_id);
CREATE INDEX IF NOT EXISTS idx_product_plant_care_levels_plant_care_level_id ON product_plant_care_levels(plant_care_level_id);
CREATE INDEX IF NOT EXISTS idx_product_plant_pet_safety_product_id ON product_plant_pet_safety(product_id);
CREATE INDEX IF NOT EXISTS idx_product_plant_pet_safety_plant_pet_safety_id ON product_plant_pet_safety(plant_pet_safety_id);

-- Add updated_at triggers for all plant dimension tables
CREATE OR REPLACE FUNCTION update_plant_types_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER plant_types_updated_at_trigger
BEFORE UPDATE ON plant_types
FOR EACH ROW
EXECUTE FUNCTION update_plant_types_updated_at();

CREATE TRIGGER plant_sizes_updated_at_trigger
BEFORE UPDATE ON plant_sizes
FOR EACH ROW
EXECUTE FUNCTION update_plant_types_updated_at();

CREATE TRIGGER plant_light_requirements_updated_at_trigger
BEFORE UPDATE ON plant_light_requirements
FOR EACH ROW
EXECUTE FUNCTION update_plant_types_updated_at();

CREATE TRIGGER plant_care_levels_updated_at_trigger
BEFORE UPDATE ON plant_care_levels
FOR EACH ROW
EXECUTE FUNCTION update_plant_types_updated_at();

CREATE TRIGGER plant_pet_safety_updated_at_trigger
BEFORE UPDATE ON plant_pet_safety
FOR EACH ROW
EXECUTE FUNCTION update_plant_types_updated_at();

-- Verification queries (optional - run these after to verify)
-- SELECT * FROM product_types;
-- SELECT * FROM plant_types ORDER BY sort_order;
-- SELECT * FROM plant_sizes ORDER BY sort_order;
-- SELECT * FROM plant_light_requirements ORDER BY sort_order;
-- SELECT * FROM plant_care_levels ORDER BY sort_order;
-- SELECT * FROM plant_pet_safety ORDER BY sort_order;
