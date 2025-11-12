# Setup Guide - שטיחי בוטיק יוסף

This guide will help you set up and run the Boutique Joseph Carpets e-commerce website.

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Supabase account (free tier works)
- Git (for version control)

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Set Up Supabase Database

### 2.1 Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Fill in project details:
   - Name: `boutique-joseph-carpets`
   - Database Password: (create a strong password)
   - Region: Choose closest to Israel
4. Wait for project creation (~2 minutes)

### 2.2 Run the Database Schema

1. In Supabase dashboard, go to **SQL Editor**
2. Click "New Query"
3. Copy the entire contents of `supabase-schema.sql`
4. Paste into the SQL Editor
5. Click "Run" to execute
6. Verify tables were created in **Database** → **Tables**

### 2.3 Get Your Supabase Credentials

1. Go to **Project Settings** → **API**
2. Copy the following:
   - Project URL
   - `anon` `public` key
   - `service_role` key (keep this secret!)

## Step 3: Configure Environment Variables

1. Copy the example environment file:
```bash
cp .env.example .env.local
```

2. Edit `.env.local` and add your Supabase credentials:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Admin (add your email)
ADMIN_EMAILS=your-email@example.com
```

## Step 4: Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Step 5: Access the Admin Dashboard

1. Navigate to [http://localhost:3000/admin](http://localhost:3000/admin)
2. You should see the admin dashboard
3. Go to "מוצרים" (Products) to start adding products

## Adding Your First Product

1. Click "הוסף מוצר" (Add Product)
2. Fill in the required fields:
   - שם המוצר (Product Name)
   - מק״ט (SKU)
   - מחיר (Price)
   - כמות במלאי (Stock Quantity)
3. Optionally add:
   - תיאור (Description)
   - מידה (Size)
   - חומר (Material)
4. Check "מוצר מומלץ" (Featured Product) to show on homepage
5. Click "שמור מוצר" (Save Product)

## Project Structure

```
carpets/
├── app/                    # Next.js app directory
│   ├── admin/             # Admin dashboard pages
│   │   ├── products/      # Product management
│   │   └── page.tsx       # Admin home
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Homepage
├── components/            # React components
│   ├── Header.tsx         # Site header
│   ├── Hero.tsx           # Hero section
│   ├── MostWanted.tsx     # Featured products
│   ├── CustomerGallery.tsx # Customer images
│   ├── AboutSection.tsx   # About section
│   └── Footer.tsx         # Site footer
├── lib/                   # Utility functions
│   └── supabase.ts        # Supabase client
├── public/                # Static files
├── styles/                # Additional styles
├── supabase-schema.sql    # Database schema
├── package.json           # Dependencies
└── README.md              # Project documentation
```

## Color Palette

The site uses a natural, earthy color scheme:

- **Cream** (#F8F5F0) - Base background color
- **Charcoal** (#2B2B2B) - Text and UI elements
- **Sage Green** (#A3B18A) - Primary brand color
- **Terracotta** (#C1784D) - Accent color for buttons

## Available Scripts

```bash
# Development
npm run dev          # Start development server

# Production
npm run build        # Build for production
npm run start        # Start production server

# Linting
npm run lint         # Run ESLint
```

## Next Steps

### Customize Content

1. **Update Logo**: Replace "שטיחי בוטיק יוסף" text in `components/Header.tsx` with an actual logo image
2. **Update Contact Info**:
   - Edit `components/Header.tsx` for WhatsApp number
   - Edit `components/Footer.tsx` for phone, email, address
3. **Update About Section**: Edit `components/AboutSection.tsx` with your company story
4. **Hero Images**: Add hero images (will need image upload implementation)

### Add More Features

Based on your needs, you can add:
- Google OAuth authentication for admin
- Product image upload (Supabase Storage)
- PayPlus payment integration
- SendGrid email integration
- Shopping cart functionality
- Checkout process

## Troubleshooting

### "Error fetching products"
- Check your Supabase credentials in `.env.local`
- Verify the database schema was created correctly
- Check Supabase dashboard for any errors

### Products not showing on homepage
- Make sure products are marked as "מוצר מומלץ" (is_featured = true)
- Make sure products are marked as "מוצר פעיל" (is_active = true)
- Check browser console for errors

### RTL issues
- The site is configured for RTL (Hebrew) by default
- Check `html` tag has `dir="rtl"` attribute
- Tailwind classes use `mr-` for right margin, `ml-` for left margin (reversed in RTL)

## Deploying to Vercel

1. Push your code to GitHub:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Add environment variables from `.env.local`
6. Click "Deploy"

Your site will be live at `https://your-project.vercel.app`

## Support

For questions or issues:
- Check the main [README.md](./README.md) for detailed project documentation
- Review [CLIENT-INFORMATION-REQUEST.md](./CLIENT-INFORMATION-REQUEST.md) for required content

## Security Notes

⚠️ **Important Security Reminders:**

1. **Never commit `.env.local`** to version control
2. Keep your `SUPABASE_SERVICE_ROLE_KEY` secret
3. Set up Row Level Security (RLS) policies in Supabase for production
4. Implement proper admin authentication before going live

---

**Built with Next.js 14, TypeScript, Tailwind CSS, and Supabase**
