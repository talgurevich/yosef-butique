-- Add image_url column to shapes table
ALTER TABLE shapes ADD COLUMN IF NOT EXISTS image_url TEXT;
