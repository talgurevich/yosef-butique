-- Add promotion fields to hero_slides
ALTER TABLE hero_slides ADD COLUMN IF NOT EXISTS promo_enabled BOOLEAN DEFAULT false;
ALTER TABLE hero_slides ADD COLUMN IF NOT EXISTS promo_text TEXT;
ALTER TABLE hero_slides ADD COLUMN IF NOT EXISTS promo_subtitle TEXT;
ALTER TABLE hero_slides ADD COLUMN IF NOT EXISTS promo_description TEXT;
ALTER TABLE hero_slides ADD COLUMN IF NOT EXISTS promo_disclaimer TEXT;
ALTER TABLE hero_slides ADD COLUMN IF NOT EXISTS promo_code TEXT;
