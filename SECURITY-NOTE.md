# Security Note - RLS Policies

## Current Status: Development Mode

The RLS (Row Level Security) policies are currently set to **permissive mode** for development.

### What This Means

✅ **Allows you to:**
- Add, edit, and delete products from admin
- Manage all data without authentication issues
- Develop and test quickly

⚠️ **Security Note:**
- Current policies allow any connection to read/write data
- This is **ONLY for development**
- **MUST be updated before production launch**

## Current Policies (Development)

All tables have policies that allow:
```sql
FOR SELECT USING (true);      -- Anyone can read
FOR INSERT WITH CHECK (true);  -- Anyone can insert
FOR UPDATE USING (true);       -- Anyone can update
FOR DELETE USING (true);       -- Anyone can delete
```

## Before Going Live - Production Security

### Step 1: Implement Authentication

Add proper admin authentication using:
- Google OAuth (already configured)
- Check if user email is in `ADMIN_EMAILS`
- Create `is_admin` flag in users table

### Step 2: Update RLS Policies

Replace permissive policies with secure ones:

```sql
-- Example: Only admins can modify products
CREATE POLICY "Only admins can insert products" ON products
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.is_admin = true
    )
  );

-- Example: Public can only view active products
CREATE POLICY "Public can view active products" ON products
  FOR SELECT
  USING (is_active = true);
```

### Step 3: Protect Admin Routes

Add middleware to protect `/admin/*` routes:

```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Check if user is authenticated and is admin
    // Redirect to login if not
  }
}
```

## Why It's OK for Now

During development:
- ✅ Site is only accessible locally (localhost)
- ✅ Supabase project is behind authentication
- ✅ No public traffic can reach your admin
- ✅ Focus on building features first

## Production Checklist

Before launching:
- [ ] Implement Google OAuth admin login
- [ ] Update all RLS policies to restrict access
- [ ] Add middleware to protect admin routes
- [ ] Test that non-admins can't access admin pages
- [ ] Test that customers can only view products
- [ ] Enable Supabase RLS strict mode
- [ ] Review all API endpoints
- [ ] Add rate limiting
- [ ] Enable HTTPS only
- [ ] Review environment variables

## Resources

- [Supabase RLS Documentation](https://supabase.com/docs/guides/auth/row-level-security)
- [Next.js Authentication](https://nextjs.org/docs/app/building-your-application/authentication)
- [Next.js Middleware](https://nextjs.org/docs/app/building-your-application/routing/middleware)

---

**Current Priority**: Build features and test functionality

**Before Launch**: Implement proper authentication and security

**Questions?** Review this document before going live!
