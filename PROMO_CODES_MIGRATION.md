# Promo Codes Table Migration

The `promo_codes` table needs several columns to work properly with the admin interface.

## Run this SQL in Supabase SQL Editor:

```sql
-- Add all missing columns to promo_codes table

-- Add current_uses if missing
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'promo_codes' AND column_name = 'current_uses'
  ) THEN
    ALTER TABLE promo_codes ADD COLUMN current_uses INTEGER DEFAULT 0 NOT NULL;
  END IF;
END $$;

-- Add expires_at if missing
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'promo_codes' AND column_name = 'expires_at'
  ) THEN
    ALTER TABLE promo_codes ADD COLUMN expires_at TIMESTAMP WITH TIME ZONE;
  END IF;
END $$;

-- Add updated_at if missing
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'promo_codes' AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE promo_codes ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW());
  END IF;
END $$;

-- Add min_purchase_amount if missing
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'promo_codes' AND column_name = 'min_purchase_amount'
  ) THEN
    ALTER TABLE promo_codes ADD COLUMN min_purchase_amount NUMERIC(10, 2) DEFAULT 0 NOT NULL;
  END IF;
END $$;

-- Add uses_per_customer if missing
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'promo_codes' AND column_name = 'uses_per_customer'
  ) THEN
    ALTER TABLE promo_codes ADD COLUMN uses_per_customer INTEGER DEFAULT 1 NOT NULL;
  END IF;
END $$;

-- Create indexes (will skip if they already exist)
CREATE INDEX IF NOT EXISTS idx_promo_codes_code ON promo_codes(code);
CREATE INDEX IF NOT EXISTS idx_promo_codes_is_active ON promo_codes(is_active);
CREATE INDEX IF NOT EXISTS idx_promo_codes_expires_at ON promo_codes(expires_at);

-- Show the current structure to verify
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'promo_codes'
ORDER BY ordinal_position;
```

## Alternatively, if the table doesn't exist at all, create it:

```sql
-- Create promo_codes table
CREATE TABLE IF NOT EXISTS promo_codes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code VARCHAR(50) UNIQUE NOT NULL,
  discount_type VARCHAR(20) NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value NUMERIC(10, 2) NOT NULL,
  min_purchase_amount NUMERIC(10, 2) DEFAULT 0 NOT NULL,
  max_uses INTEGER NOT NULL,
  current_uses INTEGER DEFAULT 0 NOT NULL,
  uses_per_customer INTEGER DEFAULT 1 NOT NULL,
  is_active BOOLEAN DEFAULT true NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Create indexes
CREATE INDEX idx_promo_codes_code ON promo_codes(code);
CREATE INDEX idx_promo_codes_is_active ON promo_codes(is_active);
CREATE INDEX idx_promo_codes_expires_at ON promo_codes(expires_at);

-- Enable RLS
ALTER TABLE promo_codes ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public read of active codes" ON promo_codes
  FOR SELECT USING (is_active = true);

CREATE POLICY "Allow authenticated insert" ON promo_codes
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow authenticated update" ON promo_codes
  FOR UPDATE USING (true);

CREATE POLICY "Allow authenticated delete" ON promo_codes
  FOR DELETE USING (true);
```

## After running the SQL:

1. Go to your Supabase Dashboard
2. Navigate to SQL Editor
3. Copy and paste the first SQL block (just the ALTER TABLE commands)
4. Click "Run"
5. Refresh your admin page and try creating a promo code again

The `current_uses` column will track how many times each code has been redeemed.
