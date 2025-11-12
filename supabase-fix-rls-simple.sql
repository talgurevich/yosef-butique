-- Simple RLS Fix - Remove ALL restrictions for development
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/misrndbeenoqmmicojxw/sql

-- OPTION 1: Disable RLS completely (simplest for development)
ALTER TABLE product_images DISABLE ROW LEVEL SECURITY;

-- OPTION 2: If you want to keep RLS enabled, run this instead:
-- First, drop ALL existing policies
-- DO $$
-- DECLARE
--     pol RECORD;
-- BEGIN
--     FOR pol IN
--         SELECT policyname
--         FROM pg_policies
--         WHERE tablename = 'product_images'
--     LOOP
--         EXECUTE format('DROP POLICY IF EXISTS %I ON product_images', pol.policyname);
--     END LOOP;
-- END $$;

-- Then create a single permissive policy
-- CREATE POLICY "Allow all operations on product_images" ON product_images
--   FOR ALL USING (true) WITH CHECK (true);
