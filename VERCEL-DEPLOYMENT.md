# Vercel Deployment Guide

## Step-by-Step Deployment to Vercel

### Prerequisites
✅ Code pushed to GitHub: https://github.com/talgurevich/yosef-butique
✅ Supabase database schema set up

### Step 1: Connect to Vercel

1. Go to: https://vercel.com
2. Click **"Sign Up"** or **"Log In"**
3. Choose **"Continue with GitHub"**
4. Authorize Vercel to access your GitHub account

### Step 2: Import Your Project

1. Click **"Add New..."** → **"Project"**
2. Find **"yosef-butique"** in the list
3. Click **"Import"**

### Step 3: Configure Project

**Framework Preset:** Next.js (auto-detected ✅)

**Root Directory:** `./` (leave as default)

**Build Command:** `npm run build` (auto-detected ✅)

**Output Directory:** `.next` (auto-detected ✅)

### Step 4: Add Environment Variables

Click **"Environment Variables"** and add these:

```
Name: NEXT_PUBLIC_SUPABASE_URL
Value: https://misrndbeenoqmmicojxw.supabase.co
```

```
Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1pc3JuZGJlZW5vcW1taWNvanh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5MzY1ODksImV4cCI6MjA3ODUxMjU4OX0.HMFS3WbRlGkt3LZE-xBKGsjwekHjriNsqZBkBVtOZgw
```

```
Name: SUPABASE_SERVICE_ROLE_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1pc3JuZGJlZW5vcW1taWNvanh3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjkzNjU4OSwiZXhwIjoyMDc4NTEyNTg5fQ.kVMvNsWpJjxFmEPPpBbR2D7KgzOQcSa85NeeeQ0BKdM
```

```
Name: ADMIN_EMAILS
Value: your-email@example.com
```

**Important:** Make sure to add all 4 environment variables!

### Step 5: Deploy

1. Click **"Deploy"**
2. Wait 2-3 minutes for build to complete
3. You'll see: "🎉 Congratulations!"

### Step 6: Visit Your Live Site

Your site will be at: **https://yosef-butique.vercel.app**

Or click the **"Visit"** button in Vercel dashboard.

---

## 🎯 Post-Deployment

### Test Your Live Site

1. **Homepage**: https://yosef-butique.vercel.app
   - Should see complete homepage with all sections

2. **Admin Dashboard**: https://yosef-butique.vercel.app/admin
   - Should see admin interface
   - Try adding a product!

### Add a Custom Domain (Optional)

1. In Vercel project settings
2. Click **"Domains"** tab
3. Add your custom domain
4. Follow DNS configuration instructions

---

## 🔄 Continuous Deployment

**Automatic updates are now enabled!**

Every time you push to GitHub:
```bash
git add .
git commit -m "Your changes"
git push
```

Vercel will automatically:
1. Detect the push
2. Build your site
3. Deploy the new version
4. Your site updates in ~2 minutes!

---

## 📊 Vercel Dashboard Features

- **Analytics**: See visitor stats
- **Logs**: Debug issues
- **Deployments**: View deployment history
- **Settings**: Manage environment variables

---

## 🚨 Troubleshooting

### Build Failed

**Check build logs** in Vercel dashboard for errors.

Common issues:
- Missing environment variables → Add them in Settings
- TypeScript errors → Fix in code and push again
- Module not found → Check package.json

### Site Shows Error

**Check runtime logs** in Vercel dashboard.

Common issues:
- Database not connected → Verify Supabase credentials
- Wrong environment variable names → Check spelling
- Database tables missing → Run supabase-schema.sql

### Changes Not Showing

- Wait 2-3 minutes for deployment
- Clear browser cache (Cmd+Shift+R)
- Check deployment status in Vercel

---

## ✅ Success Checklist

- [ ] Vercel account created
- [ ] GitHub repository imported
- [ ] All 4 environment variables added
- [ ] First deployment successful
- [ ] Homepage loads correctly
- [ ] Admin dashboard accessible
- [ ] Can add products in admin
- [ ] Products show on homepage

---

**Your live site:** https://yosef-butique.vercel.app

**Admin dashboard:** https://yosef-butique.vercel.app/admin

Enjoy your new e-commerce site! 🎉
