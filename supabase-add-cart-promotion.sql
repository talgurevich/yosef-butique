-- Cart promotion: stores which product+variant to promote in the cart
CREATE TABLE IF NOT EXISTS cart_promotion (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  variant_id UUID REFERENCES product_variants(id) ON DELETE SET NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS: public read, no public write
ALTER TABLE cart_promotion ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON cart_promotion FOR SELECT USING (true);
