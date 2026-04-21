-- Toggle the "עד" prefix above the hero promo percentage
-- Run in Supabase SQL Editor.

ALTER TABLE hero_slides
  ADD COLUMN IF NOT EXISTS promo_prefix_enabled BOOLEAN NOT NULL DEFAULT TRUE;
