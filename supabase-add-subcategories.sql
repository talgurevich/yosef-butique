-- Add subcategories to product categories
-- This script creates a hierarchical category structure with a parent "שטיחים" category
-- and adds the requested subcategories under it

-- First, create a parent category for all carpets/rugs
INSERT INTO categories (name, slug, description, parent_id, sort_order, is_active)
VALUES (
  'שטיחים',
  'carpets',
  'כל סוגי השטיחים שלנו',
  NULL,
  0,
  true
)
ON CONFLICT (slug) DO NOTHING;

-- Get the parent category ID for use in subcategory inserts
DO $$
DECLARE
  parent_category_id UUID;
BEGIN
  -- Get the parent category ID
  SELECT id INTO parent_category_id
  FROM categories
  WHERE slug = 'carpets';

  -- Insert subcategories under the parent category
  INSERT INTO categories (name, slug, description, parent_id, sort_order, is_active)
  VALUES
    (
      'שטיחים מודרנים',
      'modern-rugs',
      'שטיחים בעיצוב מודרני ועכשווי',
      parent_category_id,
      1,
      true
    ),
    (
      'שטיחים אתנים',
      'ethnic-rugs',
      'שטיחים בסגנון אתני ומסורתי',
      parent_category_id,
      2,
      true
    ),
    (
      'שטיחי לולאות',
      'loop-rugs',
      'שטיחים עם מרקם לולאות מיוחד',
      parent_category_id,
      3,
      true
    ),
    (
      'שטיחים עגולים',
      'round-rugs',
      'שטיחים בצורה עגולה',
      parent_category_id,
      4,
      true
    ),
    (
      'שטיחים לחדרי שינה',
      'bedroom-rugs',
      'שטיחים מתאימים לחדרי שינה',
      parent_category_id,
      5,
      true
    ),
    (
      'חדרי ילדים',
      'kids-rooms',
      'שטיחים מתאימים לחדרי ילדים',
      parent_category_id,
      6,
      true
    )
  ON CONFLICT (slug) DO NOTHING;
END $$;
