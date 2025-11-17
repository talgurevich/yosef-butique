-- Create payment_transactions table to store PayPlus transactions
CREATE TABLE IF NOT EXISTS payment_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  transaction_uid VARCHAR(255) UNIQUE,
  page_request_uid VARCHAR(255),
  status_code VARCHAR(50),
  amount DECIMAL(10, 2),
  currency_code VARCHAR(10) DEFAULT 'ILS',
  customer_name VARCHAR(255),
  customer_email VARCHAR(255),
  transaction_type VARCHAR(50),
  approval_number VARCHAR(100),
  voucher_number VARCHAR(100),
  card_last_digits VARCHAR(4),
  more_info TEXT,
  items_data JSONB,
  raw_callback_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on transaction_uid for faster lookups
CREATE INDEX IF NOT EXISTS idx_payment_transactions_transaction_uid
ON payment_transactions(transaction_uid);

-- Create index on page_request_uid for faster lookups
CREATE INDEX IF NOT EXISTS idx_payment_transactions_page_request_uid
ON payment_transactions(page_request_uid);

-- Create index on customer_email for faster lookups
CREATE INDEX IF NOT EXISTS idx_payment_transactions_customer_email
ON payment_transactions(customer_email);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_payment_transactions_created_at
ON payment_transactions(created_at DESC);

-- Add RLS (Row Level Security) policies
ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;

-- Policy: Allow service role to do everything
CREATE POLICY "Allow service role full access"
ON payment_transactions
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Add comment to table
COMMENT ON TABLE payment_transactions IS 'Stores PayPlus payment transaction data including callbacks and status updates';
