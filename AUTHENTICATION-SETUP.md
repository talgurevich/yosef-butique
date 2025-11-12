# Google OAuth Authentication Setup Guide

## Overview
The admin panel is now protected with Google OAuth authentication. Only authorized email addresses can access the admin dashboard.

## What Was Implemented

### 1. NextAuth.js Configuration
**File:** `app/api/auth/[...nextauth]/route.ts`

- Configured Google OAuth provider
- Email whitelist verification in signIn callback
- JWT-based session strategy
- Custom login page at `/admin/login`

### 2. Environment Variables
**File:** `.env.local`

```env
ADMIN_EMAILS=your-email@gmail.com
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-key-change-this-in-production
```

### 3. Session Provider
**File:** `components/SessionProvider.tsx`

Wraps the entire app to provide authentication context throughout the application.

### 4. Admin Login Page
**File:** `app/admin/login/page.tsx`

Features:
- Beautiful login UI with Google sign-in button
- Auto-redirect to /admin after successful login
- RTL Hebrew support
- Loading states
- Info message about admin-only access

### 5. Protected Routes (Middleware)
**File:** `middleware.ts`

- Protects all `/admin/*` routes (except `/admin/login`)
- Redirects unauthenticated users to login page
- Uses NextAuth middleware for authentication checks

### 6. Admin Layout Updates
**File:** `app/admin/layout.tsx`

- Shows logged-in user profile (avatar, name, email)
- Sign-out button with red hover state
- Real-time session status

## How It Works

### Authentication Flow

1. **User visits `/admin`**
   - Middleware checks if user is authenticated
   - If not authenticated → redirects to `/admin/login`

2. **User clicks "המשך עם Google"**
   - NextAuth initiates Google OAuth flow
   - User logs in with Google account
   - Google returns user profile to NextAuth

3. **Email Verification**
   - NextAuth checks if user's email is in `ADMIN_EMAILS`
   - If email matches → create session and redirect to `/admin`
   - If email doesn't match → deny access (returns to login page)

4. **Accessing Admin Panel**
   - User can now access all `/admin/*` pages
   - Session persists across page reloads
   - User info displayed in sidebar

5. **Sign Out**
   - Click "התנתק" (Sign Out) button
   - NextAuth clears session
   - Redirects to `/admin/login`

## Current Access

**Authorized Emails:**
- Check `.env.local` for configured admin emails

## Adding More Admin Users

To add more admin users, update `.env.local`:

```env
ADMIN_EMAILS=first@email.com,second@email.com,third@email.com
```

**Important:** Emails are comma-separated, no spaces needed (the code trims whitespace automatically).

## Google Cloud Console Setup

### Required Configuration

1. **Authorized JavaScript origins:**
   - http://localhost:3000
   - https://your-production-domain.com

2. **Authorized redirect URIs:**
   - http://localhost:3000/api/auth/callback/google
   - https://your-production-domain.com/api/auth/callback/google

### Where to Configure
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Navigate to: **APIs & Services** → **Credentials**
4. Click on your OAuth 2.0 Client ID
5. Add the URLs above to the respective fields

## Production Deployment

### Step 1: Update Environment Variables

In your production environment (Vercel, etc.), set:

```env
ADMIN_EMAILS=your-email@gmail.com
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
NEXTAUTH_URL=https://your-production-domain.com
NEXTAUTH_SECRET=GENERATE_A_SECURE_RANDOM_STRING_HERE
```

**Important:** Generate a new `NEXTAUTH_SECRET` for production:
```bash
openssl rand -base64 32
```

### Step 2: Update Google OAuth Redirect URIs

Add your production domain to Google Cloud Console:
- https://your-production-domain.com
- https://your-production-domain.com/api/auth/callback/google

### Step 3: Test Authentication

1. Visit `https://your-production-domain.com/admin`
2. Should redirect to `/admin/login`
3. Click "המשך עם Google"
4. Sign in with authorized email
5. Should redirect to admin dashboard

## Security Features

✅ **Email Whitelist**
- Only specified emails can access admin panel
- Verification happens on the server (cannot be bypassed)

✅ **Protected Routes**
- Middleware blocks unauthenticated access
- Automatic redirect to login page

✅ **JWT Sessions**
- Secure token-based authentication
- Session data stored in HTTP-only cookies

✅ **HTTPS in Production**
- All OAuth flows require HTTPS
- Tokens encrypted in transit

## Troubleshooting

### "Error: Configuration" on login page

**Cause:** Missing or incorrect environment variables

**Solution:**
1. Check `.env.local` file exists
2. Verify all required variables are set
3. Restart dev server: `npm run dev`

### "Access Denied" after Google login

**Cause:** Email not in whitelist

**Solution:**
1. Check `ADMIN_EMAILS` in `.env.local`
2. Ensure your Google account email matches exactly
3. No extra spaces in email list

### Infinite redirect loop

**Cause:** Middleware or NextAuth misconfiguration

**Solution:**
1. Check `middleware.ts` matcher excludes `/admin/login`
2. Verify `NEXTAUTH_URL` matches your actual URL
3. Clear browser cookies and try again

### "Invalid redirect URI" error

**Cause:** Google OAuth redirect URI not configured

**Solution:**
1. Go to Google Cloud Console → Credentials
2. Add: `http://localhost:3000/api/auth/callback/google`
3. Also add production URL when deploying

## Files Created/Modified

### Created:
- `app/api/auth/[...nextauth]/route.ts` - NextAuth API route
- `components/SessionProvider.tsx` - Session provider wrapper
- `app/admin/login/page.tsx` - Admin login page
- `middleware.ts` - Route protection middleware
- `AUTHENTICATION-SETUP.md` - This guide

### Modified:
- `.env.local` - Added OAuth credentials and admin emails
- `app/layout.tsx` - Wrapped app with SessionProvider
- `app/admin/layout.tsx` - Added user info and sign-out button

## Testing Locally

1. **Start the dev server:**
   ```bash
   npm run dev
   ```

2. **Visit admin panel:**
   ```
   http://localhost:3000/admin
   ```

3. **Should redirect to:**
   ```
   http://localhost:3000/admin/login
   ```

4. **Click "המשך עם Google"**

5. **Sign in with an authorized email** (configured in `.env.local`)

6. **Success!** You should see the admin dashboard

## Summary

Your admin panel is now fully protected with Google OAuth authentication! Only authorized emails (configured in `.env.local`) can access the admin dashboard. The system is production-ready - just update the environment variables and Google OAuth settings when deploying.
