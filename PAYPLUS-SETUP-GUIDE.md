# PayPlus Payment Integration Setup Guide

This guide will help you configure the PayPlus payment system for Boutique Yossef.

## Table of Contents
1. [Getting PayPlus Credentials](#getting-payplus-credentials)
2. [Environment Setup](#environment-setup)
3. [Database Setup](#database-setup)
4. [Testing the Integration](#testing-the-integration)
5. [Going Live](#going-live)
6. [Troubleshooting](#troubleshooting)

---

## Getting PayPlus Credentials

### Step 1: Create a PayPlus Account
1. Go to [PayPlus Signup](https://www.payplus.co.il/)
2. Fill out the registration form
3. Wait for PayPlus team to approve and activate your account

### Step 2: Get Your API Credentials
1. Log in to your PayPlus dashboard
2. Go to **Settings** (top left corner)
3. Click on **API Credentials**
4. You'll find:
   - **API Key** (api-key)
   - **Secret Key** (secret-key)
5. Copy these values - you'll need them for environment variables

### Step 3: Get Your Payment Page UID
1. In PayPlus dashboard, go to **Settings**
2. Click on **Payment Pages**
3. Either create a new payment page or use an existing one
4. Copy the **Payment Page UID**
5. Configure your payment page settings:
   - Charge method: Charge (J4) - Immediate payment
   - Enable email notifications
   - Set up your branding (logo, colors)

---

## Environment Setup

### Step 1: Copy Environment Template
```bash
cp .env.local.example .env.local
```

### Step 2: Add PayPlus Credentials
Edit `.env.local` and add your credentials:

```env
# For Testing - Use Staging Environment
PAYPLUS_API_URL=https://restapidev.payplus.co.il/api/v1.0
PAYPLUS_API_KEY=your_api_key_from_payplus_dashboard
PAYPLUS_SECRET_KEY=your_secret_key_from_payplus_dashboard
PAYPLUS_PAYMENT_PAGE_UID=your_payment_page_uid

# Site URL (important for callbacks)
NEXT_PUBLIC_SITE_URL=https://boutique-yossef.co.il
```

### Step 3: For Production
When ready to go live, update the API URL:
```env
PAYPLUS_API_URL=https://restapi.payplus.co.il/api/v1.0
```

---

## Database Setup

The payment integration requires a database table to store transaction data.

### Run the Migration
```bash
# If using Supabase, run this SQL in the SQL Editor:
```

Execute the SQL file: `supabase/migrations/create_payment_transactions_table.sql`

This creates:
- `payment_transactions` table
- Indexes for fast lookups
- Row Level Security policies

---

## Testing the Integration

### Use Test Credit Cards (Staging Only)

PayPlus provides test credit cards for the staging environment:

**Successful Transaction:**
- Card Number: `5326-1402-8077-9844`
- Expiration: `05/26`
- CVV: `000`

**Rejected Transaction:**
- Card Number: `5326-1402-0001-0120`
- Expiration: `05/26`
- CVV: `000`

### Test Flow

1. **Add products to cart**
   - Navigate to products page
   - Add items to cart

2. **Go to checkout**
   - Click "המשך לתשלום" in cart
   - Fill in customer details
   - Click "המשך לתשלום"

3. **Complete payment on PayPlus page**
   - You'll be redirected to PayPlus payment page
   - Enter test card details
   - Complete the payment

4. **Verify success**
   - You should be redirected to `/payment/success`
   - Check that the cart is cleared
   - Verify transaction is saved in database

5. **Check callback**
   - PayPlus will send a callback to `/api/payment/callback`
   - Check server logs to see callback data
   - Verify transaction is stored in database

---

## Payment Flow

### 1. Customer Journey
```
Cart → Checkout → PayPlus Page → Success/Failure → Homepage
```

### 2. API Flow
```
1. User clicks "המשך לתשלום"
2. Frontend calls: POST /api/payment/generate-link
3. Backend calls: PayPlus API to generate payment link
4. User redirected to PayPlus payment page
5. User completes payment
6. PayPlus sends callback to: POST /api/payment/callback
7. PayPlus redirects user to: /payment/success or /payment/failure
```

### 3. Callbacks and Redirects

**Server-to-Server Callback (refURL_callback):**
- URL: `https://boutique-yossef.co.il/api/payment/callback`
- Method: POST
- Purpose: Receive transaction updates server-side
- Validation: Hash signature verification
- Action: Store transaction in database

**Success Redirect (refURL_success):**
- URL: `https://boutique-yossef.co.il/payment/success`
- Method: GET
- Purpose: Show success message to user
- Includes: Transaction details in URL params

**Failure Redirect (refURL_failure):**
- URL: `https://boutique-yossef.co.il/payment/failure`
- Method: GET
- Purpose: Show error message to user
- Includes: Error details in URL params

---

## Going Live

### Checklist Before Launch

- [ ] PayPlus account is fully activated (not in test mode)
- [ ] API credentials are for production environment
- [ ] `PAYPLUS_API_URL` points to production: `https://restapi.payplus.co.il/api/v1.0`
- [ ] `NEXT_PUBLIC_SITE_URL` is set to your live domain
- [ ] Payment page is configured correctly in PayPlus dashboard
- [ ] Callback URL is accessible publicly (not localhost)
- [ ] SSL certificate is active on your domain
- [ ] Test a real transaction with a small amount
- [ ] Verify emails are being sent
- [ ] Check that transactions appear in PayPlus dashboard

### Production Environment Variables
```env
PAYPLUS_API_URL=https://restapi.payplus.co.il/api/v1.0
PAYPLUS_API_KEY=your_production_api_key
PAYPLUS_SECRET_KEY=your_production_secret_key
PAYPLUS_PAYMENT_PAGE_UID=your_production_payment_page_uid
NEXT_PUBLIC_SITE_URL=https://boutique-yossef.co.il
```

---

## Troubleshooting

### Payment Link Not Generating

**Error:** "Payment system not configured"
- **Fix:** Check that all environment variables are set in `.env.local`
- **Verify:** API Key, Secret Key, and Payment Page UID are correct

### Callback Not Working

**Error:** Callback signature validation fails
- **Fix:** Make sure `PAYPLUS_SECRET_KEY` matches the secret from PayPlus dashboard
- **Debug:** Check server logs for hash validation errors

**Error:** Callback not received
- **Fix:** Ensure callback URL is publicly accessible (not localhost)
- **Test:** Use ngrok or similar for local testing
- **Verify:** Check PayPlus dashboard logs

### User Redirected to Error Page

**Error:** Payment fails immediately
- **Check:** Verify payment page UID is correct
- **Check:** Make sure payment page is active in PayPlus dashboard
- **Test:** Try with test credit card in staging environment

### Database Errors

**Error:** "payment_transactions table does not exist"
- **Fix:** Run the migration SQL file
- **Verify:** Table exists in Supabase dashboard

---

## API Endpoints Created

### 1. Generate Payment Link
- **Endpoint:** `POST /api/payment/generate-link`
- **Purpose:** Create a PayPlus payment page link
- **Request Body:**
  ```json
  {
    "amount": 1500,
    "currency_code": "ILS",
    "customer": {
      "customer_name": "John Doe",
      "email": "john@example.com",
      "phone": "0501234567"
    },
    "items": [
      {
        "name": "Product Name",
        "price": 750,
        "quantity": 2
      }
    ]
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "payment_link": "https://payplus.co.il/...",
    "page_request_uid": "..."
  }
  ```

### 2. Payment Callback
- **Endpoint:** `POST /api/payment/callback`
- **Purpose:** Receive transaction updates from PayPlus
- **Security:** Validates hash signature
- **Action:** Stores transaction in database

---

## Monitoring and Logs

### Where to Check

1. **PayPlus Dashboard**
   - Go to Transactions
   - Filter by date, status, amount
   - View full transaction details

2. **Supabase Database**
   - Table: `payment_transactions`
   - Check raw_callback_data for full details

3. **Vercel Logs** (if deployed on Vercel)
   - Check function logs for API calls
   - Look for errors or validation issues

4. **Browser Console**
   - Check for frontend errors
   - Verify redirect flows

---

## Support

### PayPlus Support
- **Email:** tech@payplus.co.il
- **Dashboard:** [PayPlus Dashboard](https://app.payplus.co.il/)
- **Documentation:** [PayPlus API Docs](https://docs.payplus.co.il/)

### Internal Support
- Check server logs for detailed error messages
- Review `payplus.md` for API reference
- Test with staging environment first

---

## Security Notes

1. **Never expose Secret Key** in frontend code
2. **Always validate callbacks** using hash signature
3. **Use HTTPS** for all production URLs
4. **Verify user-agent** is "PayPlus" for callbacks
5. **Store sensitive data** securely in environment variables

---

**Last Updated:** 2025-01-17
