# Database Setup Instructions

## Quick Setup (5 minutes)

### Step 1: Open Supabase SQL Editor

1. Go to: https://supabase.com/dashboard/project/misrndbeenoqmmicojxw
2. Click **"SQL Editor"** in the left sidebar (looks like </> icon)
3. Click the **"New Query"** button (top right)

### Step 2: Copy and Run the Schema

1. Open the file `supabase-schema.sql` in your code editor
2. **Select all** and **copy** the contents (Cmd+A, Cmd+C)
3. **Paste** into the Supabase SQL Editor
4. Click **"Run"** button (or press Cmd+Enter)

### Step 3: Verify Tables Were Created

1. Click **"Database"** in the left sidebar
2. Click **"Tables"** tab
3. You should see these tables:
   - ✅ categories
   - ✅ products
   - ✅ product_images
   - ✅ users
   - ✅ orders
   - ✅ order_items
   - ✅ newsletter_subscribers
   - ✅ email_campaigns
   - ✅ customer_gallery
   - ✅ promo_codes
   - ✅ csv_import_logs

### Step 4: Check Sample Data

1. Click on **"categories"** table
2. You should see 4 sample categories:
   - שטיחים מודרניים
   - שטיחים קלאסיים
   - שטיחים מעוצבים
   - רצים

## ✅ Success!

Your database is ready! Now you can:
- Add products via the admin dashboard
- Test the site functionality

## 🚨 Troubleshooting

**Error: "permission denied"**
→ Check that you're logged into the correct Supabase account

**Error: "syntax error"**
→ Make sure you copied the ENTIRE file contents

**Tables not showing up**
→ Refresh the page or click "Database" → "Tables" again

---

## Alternative: Run via Command Line (Advanced)

If you have Supabase CLI installed:

```bash
# Install Supabase CLI
npm install -g supabase

# Link to your project
supabase link --project-ref misrndbeenoqmmicojxw

# Run migrations
supabase db push

# Or run the SQL file directly
psql "postgresql://postgres:[YOUR-PASSWORD]@db.misrndbeenoqmmicojxw.supabase.co:5432/postgres" < supabase-schema.sql
```

---

**Next:** After database setup, proceed to Vercel deployment!
