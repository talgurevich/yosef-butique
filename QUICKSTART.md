# Quick Start - שטיחי בוטיק יוסף

Your e-commerce website is ready to go! Follow these steps to get started.

## ✅ What's Been Built

### Frontend (Customer-Facing)
- ✅ **Homepage** with all sections:
  - Header with navigation and cart
  - Hero section with call-to-action
  - Most Wanted products section
  - Customer gallery (placeholders)
  - About Us section with trust signals
  - Footer with newsletter signup
- ✅ **RTL Hebrew support** throughout
- ✅ **Responsive design** for mobile and desktop
- ✅ **Custom color palette**:
  - Cream (#F8F5F0) background
  - Sage green (#A3B18A) primary brand color
  - Terracotta (#C1784D) accent color
  - Charcoal (#2B2B2B) for text

### Backend (Admin Dashboard)
- ✅ **Admin Dashboard** at `/admin`
- ✅ **Product Management**:
  - List all products with search
  - Add new products
  - Edit products (ready for implementation)
  - Delete products
- ✅ **Database Schema** ready for Supabase
- ✅ **Product CRUD operations** working

## 🚀 Getting Started (3 Steps)

### 1. Set Up Supabase (5 minutes)

1. Create free account at [supabase.com](https://supabase.com)
2. Create new project
3. Go to SQL Editor → Run the `supabase-schema.sql` file
4. Get your credentials from Project Settings → API

### 2. Configure Environment (1 minute)

Create `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-key
ADMIN_EMAILS=your-email@example.com
```

### 3. Run the Site (30 seconds)

```bash
npm run dev
```

Visit:
- **Homepage**: http://localhost:3000
- **Admin**: http://localhost:3000/admin

## 📝 Next Steps

### Immediate Tasks

1. **Add Your First Product**
   - Go to http://localhost:3000/admin/products
   - Click "הוסף מוצר"
   - Fill in product details
   - Mark as "מוצר מומלץ" to show on homepage

2. **Update Contact Information**
   - Edit `components/Header.tsx` - Update WhatsApp number
   - Edit `components/Footer.tsx` - Update phone, email, address

3. **Add Your Logo**
   - Replace text logo in `components/Header.tsx` with image

### Content to Prepare

Reference `CLIENT-INFORMATION-REQUEST.md` for all content needed:
- [ ] Company logo (PNG/SVG)
- [ ] Hero section images (3-5 images)
- [ ] About Us content
- [ ] Contact information
- [ ] Product photos and details
- [ ] Customer gallery images

## 📂 Project Structure

```
carpets/
├── app/
│   ├── admin/              ← Admin dashboard
│   │   └── products/       ← Product management
│   ├── page.tsx            ← Homepage
│   └── layout.tsx          ← Root layout (RTL config)
├── components/             ← All page sections
│   ├── Header.tsx
│   ├── Hero.tsx
│   ├── MostWanted.tsx
│   ├── CustomerGallery.tsx
│   ├── AboutSection.tsx
│   └── Footer.tsx
├── lib/
│   └── supabase.ts         ← Database client
├── supabase-schema.sql     ← Database setup
├── SETUP.md                ← Detailed setup guide
└── README.md               ← Full documentation
```

## 🎨 Customization

### Colors
All colors are defined in `tailwind.config.ts`:
- `cream` - Background color
- `sage` - Primary brand color
- `terracotta` - Accent color
- `charcoal` - Text color

### Components
Edit files in `/components` folder to customize:
- `Header.tsx` - Navigation and logo
- `Hero.tsx` - Main banner
- `MostWanted.tsx` - Featured products display
- `Footer.tsx` - Footer links and newsletter

## 🔐 Security Notes

Before going live:
1. Set up Google OAuth for admin authentication
2. Configure RLS policies in Supabase
3. Never commit `.env.local` to Git
4. Keep service role key secret

## 📖 Documentation

- **SETUP.md** - Complete setup instructions
- **README.md** - Full project documentation
- **CLIENT-INFORMATION-REQUEST.md** - Content requirements

## 🐛 Common Issues

**Products not showing on homepage?**
- Check products are marked as "מוצר מומלץ" (Featured)
- Check products are marked as "פעיל" (Active)

**Connection error?**
- Verify Supabase credentials in `.env.local`
- Check database tables were created

**Styling looks wrong?**
- Run `npm run dev` to regenerate Tailwind CSS
- Clear browser cache

## 🚢 Deployment

Ready to deploy? Push to GitHub and deploy to Vercel:

```bash
git init
git add .
git commit -m "Initial commit"
# Push to GitHub
# Connect to Vercel
# Add environment variables
# Deploy!
```

## ✨ What's Next?

After you have products and content:
1. Shopping cart functionality
2. Checkout process with PayPlus
3. SendGrid email integration
4. Customer accounts
5. Order management
6. Advanced features (AR, reviews, etc.)

---

**Need help?** Check SETUP.md for detailed instructions or README.md for full documentation.

**Start adding products now at:** http://localhost:3000/admin/products
