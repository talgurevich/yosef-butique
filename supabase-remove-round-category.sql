-- Remove the "שטיחים עגולים" (Round Rugs) category
-- Since "round" is now a separate shape dimension, this category is redundant

-- First, remove all product associations with this category
DELETE FROM product_categories
WHERE category_id IN (
  SELECT id FROM categories WHERE slug = 'round-rugs'
);

-- Then, delete the category itself
DELETE FROM categories WHERE slug = 'round-rugs';

-- Verification query (optional - run this after to verify)
-- SELECT name, slug FROM categories WHERE parent_id IS NOT NULL ORDER BY sort_order;
