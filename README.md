# שטיחי בוטיק יוסף (Boutique Joseph Carpets)

A modern, full-featured e-commerce website for carpets and flooring products, built with Next.js, Tailwind CSS, and Supabase.

**Site Name**: שטיחי בוטיק יוסף
**Primary Language**: Hebrew (RTL)
**Target Market**: Israel

## Project Overview

This platform enables customers to browse, filter, and purchase carpets and flooring products online with an integrated payment system. The site includes a comprehensive admin backend for catalog management and bulk product uploads.

## Tech Stack

### Frontend
- **Framework**: Next.js (React)
- **Styling**: Tailwind CSS
- **Hosting**: Vercel
- **Primary Language**: Hebrew (RTL)

### Backend & Database
- **Database & Auth**: Supabase
- **Authentication**: Google OAuth integration
- **Payment Gateway**: PayPlus
- **Email Marketing**: SendGrid (newsletter and promotional emails)

### Admin Tools
- Product CRUD operations
- CSV bulk upload for mass product import

## Features

### Homepage Layout (Main Page)

The homepage consists of the following sections in order:

```
┌─────────────────────────────────────────────┐
│            HEADER (Fixed/Sticky)             │
│   Logo | Navigation | Cart | WhatsApp       │
└─────────────────────────────────────────────┘
┌─────────────────────────────────────────────┐
│                                              │
│          HERO SECTION                        │
│   Large banner image/video + CTA            │
│                                              │
└─────────────────────────────────────────────┘
┌─────────────────────────────────────────────┐
│         MOST WANTED SECTION                  │
│   ┌────┐  ┌────┐  ┌────┐  ┌────┐          │
│   │Img │  │Img │  │Img │  │Img │          │
│   └────┘  └────┘  └────┘  └────┘          │
│   Product Grid (Featured/Best Sellers)      │
└─────────────────────────────────────────────┘
┌─────────────────────────────────────────────┐
│       CUSTOMER IMAGES SECTION                │
│   ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐          │
│   │   │ │   │ │   │ │   │ │   │          │
│   └───┘ └───┘ └───┘ └───┘ └───┘          │
│   Customer photos + testimonials            │
└─────────────────────────────────────────────┘
┌─────────────────────────────────────────────┐
│          ABOUT US SECTION                    │
│   Brief company intro + trust signals       │
│   "Learn More" link to About page          │
└─────────────────────────────────────────────┘
┌─────────────────────────────────────────────┐
│               FOOTER                         │
│   Newsletter signup | Quick links           │
│   Contact info | Social media | Payment     │
└─────────────────────────────────────────────┘
```

**Section Breakdown:**
1. **Header** - Navigation and cart
2. **Hero Section** - Main banner with call-to-action
3. **Most Wanted Section** - Featured product grid
4. **Customer Images Section** - Social proof gallery
5. **About Us Section** - Company introduction
6. **Footer** - Newsletter signup and links

### Customer-Facing Features

#### 1. Homepage Structure

**Header:**
- Logo (שטיחי בוטיק יוסף)
- Main navigation menu (Home, Products, About, Contact)
- Shopping cart icon with item count
- WhatsApp contact button
- Language selector (if needed)

**Hero Section:**
- Large banner with hero image/video
- Main headline and subheadline
- Call-to-action button (Shop Now / View Collection)
- Optional: Rotating slides for multiple promotions

**Most Wanted Section:**
- Grid display of best-selling/featured products
- Product cards with image, name, price
- Quick view or link to product page
- "Add to Cart" button

**Customer Images Section:**
- Social proof gallery
- Customer photos with their purchased carpets
- Instagram-style grid or carousel
- Optional: Customer testimonials/reviews overlay

**About Us Section:**
- Brief company introduction
- Value propositions (quality, service, expertise)
- Trust badges (free shipping, secure payment, warranty)
- "Learn More" link to full About page

**Footer:**
- Newsletter signup form (email input + subscribe button)
- Quick links (About, Contact, Privacy, Terms)
- Contact information (phone, email, address)
- Social media links
- Payment method icons
- Copyright information

#### 2. Individual Product Pages
- Product name and SKU
- High-quality image gallery with zoom/lightbox
- Product specifications:
  - Dimensions (size)
  - Material
  - Color
  - Style
  - Origin/manufacturer
  - Care instructions
- Price display
- Stock availability status
- Quantity selector
- "Add to Cart" button
- "Buy Now" button (direct checkout)
- Product description (rich text)
- Related/similar products section
- Breadcrumb navigation
- Share buttons (WhatsApp, social media)

#### 3. About Page
- Company story and history
- Mission and values
- Why choose שטיחי בוטיק יוסף
- Product quality and sourcing
- Team introduction (optional)
- Store location/showroom information
- Contact details
- Image gallery of store/products

#### 4. Contact Page
- Contact form (name, email, phone, message)
- Direct contact information:
  - Phone number (clickable for mobile)
  - Email address
  - Physical address
  - Business hours
- WhatsApp contact link
- Embedded Google Maps (store location)
- Social media links

#### 5. Privacy Policy Page
- Data collection and usage
- Cookie policy
- Third-party services (Google, SendGrid, PayPlus, Supabase)
- User rights (GDPR compliance)
- Data security measures
- Contact for privacy concerns
- Last updated date

#### 6. Terms & Conditions Page
- General terms of use
- Purchase terms and conditions
- Pricing and payment terms
- Shipping and delivery policy
- Return and refund policy
- Product warranties
- Limitation of liability
- Dispute resolution
- Last updated date

#### 7. Shopping Cart
- Cart icon in header with item count badge
- Cart page or slide-out drawer
- Product thumbnail, name, size, price
- Quantity adjustment (+ / - buttons)
- Remove item option
- Subtotal calculation
- "Continue Shopping" button
- "Proceed to Checkout" button

#### 8. Checkout Process
- Customer information form:
  - Full name
  - Email address
  - Phone number
  - Shipping address (street, city, postal code)
  - Billing address (same as shipping or different)
- Promo code/discount code field
- Shipping method selection
- Order summary:
  - Items list
  - Subtotal
  - Shipping cost
  - Discount applied
  - Tax (if applicable)
  - Total price
- Payment button (PayPlus integration)
- Guest checkout (no account required)

#### 9. Payment & Order Confirmation (PayPlus)
- Secure payment processing via PayPlus
- Multiple payment methods (credit card, etc.)
- Order confirmation page:
  - Order number
  - Thank you message
  - Order summary
  - Estimated delivery date
  - Contact information
- Order confirmation email (SendGrid)
- Return to homepage button

### Admin Backend Features

#### 1. Authentication
- Admin login with Google OAuth
- Role-based access control
- Secure admin routes

#### 2. Product Management (CRUD)
**Create:**
- Add new products with form inputs
- Upload multiple product images
- Set product attributes (name, description, price, SKU, category, style, color, size, material, stock quantity)
- SEO fields (meta title, meta description, slug)

**Read:**
- View all products in table format
- Search and filter products
- Pagination
- View product details

**Update:**
- Edit existing product information
- Update images
- Modify stock levels
- Update pricing

**Delete:**
- Remove products from catalog
- Soft delete option (archive instead of permanent deletion)

#### 3. Bulk Upload (CSV)
- CSV template download
- File upload interface with drag-and-drop
- Data validation and error reporting
- Preview before import
- Batch processing for large files
- Import history and logs

**CSV Format Example:**
```csv
name,description,price,sku,category,style,color,size,material,stock_quantity,image_url_1,image_url_2,image_url_3
Modern Gray Rug,Contemporary geometric pattern,299.99,RUG-001,Rugs,Modern,Gray,160×230,Wool,15,https://...,https://...,https://...
```

#### 4. Category Management
- Create/Edit/Delete categories
- Category hierarchy (parent/child)
- Category images and descriptions
- SEO fields for category pages

#### 5. Order Management
- View all orders
- Order details and status tracking
- Update order status (pending, processing, shipped, delivered, cancelled)
- Customer information
- Export orders to CSV

#### 6. Dashboard & Analytics
- Sales overview (daily, weekly, monthly)
- Top-selling products
- Revenue charts
- Inventory alerts (low stock notifications)
- Recent orders summary

#### 7. Customer Gallery Management
- Upload customer photos/testimonials
- Image upload with drag-and-drop
- Add customer name and testimonial text
- Link photo to specific product (optional)
- Set featured status for homepage display
- Sort order management
- Activate/deactivate images
- Delete images

#### 8. Promo Code Management
**Create/Edit Promo Codes:**
- Unique code generation
- Discount type (percentage or fixed amount)
- Discount value
- Minimum purchase requirement
- Usage limits (total uses)
- Validity period (start and end dates)
- Activate/deactivate codes

**View & Track:**
- List all promo codes
- Usage statistics
- Active/expired status
- Edit or delete codes

#### 9. Newsletter Management (SendGrid)
**Subscriber Management:**
- View all newsletter subscribers
- Export subscriber list to CSV
- Manually add/remove subscribers
- View subscription date and status
- Segment subscribers (active, unsubscribed)

**Email Campaign Tools:**
- Create and send promotional email campaigns
- Email template editor
- Schedule campaigns for future sending
- A/B testing support
- Campaign analytics (open rate, click rate, conversions)

**Automated Emails:**
- Welcome email for new subscribers with promo code
- Order confirmation emails
- Shipping notification emails
- Abandoned cart reminders (future)
- Back-in-stock notifications (future)

## Database Schema (Supabase)

### Tables

#### products
```sql
id: uuid (PK)
name: text
description: text
price: decimal
compare_at_price: decimal (optional)
sku: text (unique)
category_id: uuid (FK)
style: text[]
color: text[]
size: text
material: text
stock_quantity: integer
is_featured: boolean
is_active: boolean
slug: text (unique)
meta_title: text
meta_description: text
created_at: timestamp
updated_at: timestamp
```

#### product_images
```sql
id: uuid (PK)
product_id: uuid (FK)
image_url: text
alt_text: text
sort_order: integer
created_at: timestamp
```

#### categories
```sql
id: uuid (PK)
name: text
slug: text (unique)
description: text
parent_id: uuid (FK, nullable)
image_url: text
sort_order: integer
is_active: boolean
created_at: timestamp
updated_at: timestamp
```

#### orders
```sql
id: uuid (PK)
user_id: uuid (FK, nullable for guest)
order_number: text (unique)
status: text (pending, processing, shipped, delivered, cancelled)
subtotal: decimal
shipping_cost: decimal
tax: decimal
total: decimal
payment_method: text
payment_status: text (pending, paid, failed, refunded)
payplus_transaction_id: text
shipping_address: jsonb
billing_address: jsonb
customer_email: text
customer_phone: text
notes: text
created_at: timestamp
updated_at: timestamp
```

#### order_items
```sql
id: uuid (PK)
order_id: uuid (FK)
product_id: uuid (FK)
product_name: text
product_sku: text
quantity: integer
unit_price: decimal
total_price: decimal
created_at: timestamp
```

#### users
```sql
id: uuid (PK)
email: text (unique)
full_name: text
google_id: text
avatar_url: text
is_admin: boolean
created_at: timestamp
updated_at: timestamp
```

#### csv_import_logs
```sql
id: uuid (PK)
user_id: uuid (FK)
filename: text
total_rows: integer
success_count: integer
error_count: integer
errors: jsonb
status: text (processing, completed, failed)
created_at: timestamp
```

#### newsletter_subscribers
```sql
id: uuid (PK)
email: text (unique)
full_name: text
status: text (active, unsubscribed)
source: text (homepage, checkout, popup)
promo_code_sent: boolean
subscribed_at: timestamp
unsubscribed_at: timestamp
```

#### email_campaigns
```sql
id: uuid (PK)
name: text
subject: text
content: text
html_content: text
status: text (draft, scheduled, sent)
scheduled_at: timestamp
sent_at: timestamp
recipient_count: integer
open_count: integer
click_count: integer
sendgrid_campaign_id: text
created_by: uuid (FK)
created_at: timestamp
updated_at: timestamp
```

#### customer_gallery
```sql
id: uuid (PK)
image_url: text
customer_name: text (optional)
testimonial: text (optional)
product_id: uuid (FK, optional)
is_featured: boolean
sort_order: integer
is_active: boolean
created_at: timestamp
```

#### promo_codes
```sql
id: uuid (PK)
code: text (unique)
discount_type: text (percentage, fixed_amount)
discount_value: decimal
min_purchase: decimal (optional)
usage_limit: integer (optional)
usage_count: integer
valid_from: timestamp
valid_until: timestamp
is_active: boolean
created_at: timestamp
```

## Site Structure

```
# Public Routes
/                           # Homepage (Hero, Most Wanted, Customer Images, About, Footer)
/products                   # All products listing page (optional/future)
/product/[slug]             # Individual product detail page
/cart                       # Shopping cart page
/checkout                   # Checkout process
/checkout/success           # Order confirmation page
/about                      # About us page
/contact                    # Contact page
/privacy                    # Privacy policy page
/terms                      # Terms & conditions page

# Admin Routes (protected)
/admin                      # Admin dashboard
/admin/products             # Product list
/admin/products/new         # Add new product
/admin/products/[id]        # Edit product
/admin/products/bulk-upload # CSV bulk upload
/admin/categories           # Category management
/admin/orders               # Order management
/admin/orders/[id]          # Order details
/admin/gallery              # Customer gallery management
/admin/promo-codes          # Promo code management
/admin/newsletter           # Newsletter dashboard
/admin/newsletter/subscribers # Subscriber list
/admin/newsletter/campaigns # Email campaigns
/admin/newsletter/new       # Create new campaign
```

## Development Roadmap

### Phase 1: Foundation (MVP)
- [ ] Next.js project setup with Tailwind CSS (RTL configuration)
- [ ] Supabase project initialization
- [ ] Database schema implementation
- [ ] Google OAuth integration for admin
- [ ] Basic responsive layout (header, footer)
- [ ] RTL Hebrew language setup

### Phase 2: Homepage Implementation
- [ ] Hero section with image/video
- [ ] Most Wanted products section (featured products grid)
- [ ] Customer gallery section (images with testimonials)
- [ ] About Us section (brief intro)
- [ ] Footer with newsletter signup
- [ ] WhatsApp integration button
- [ ] Mobile responsive design

### Phase 3: Product Pages
- [ ] Individual product page design
- [ ] Product image gallery with zoom/lightbox
- [ ] Product specifications display
- [ ] Add to cart functionality
- [ ] Related products section
- [ ] Product sharing buttons (WhatsApp, social)

### Phase 4: Shopping & Checkout
- [ ] Shopping cart page/drawer
- [ ] Cart item management (add, remove, update quantity)
- [ ] Checkout form (customer info, shipping address)
- [ ] Promo code validation and application
- [ ] Order summary calculation
- [ ] PayPlus payment integration
- [ ] Order confirmation page
- [ ] Order confirmation email (SendGrid)

### Phase 5: Static Pages
- [ ] About page design and content
- [ ] Contact page with form and map
- [ ] Privacy policy page
- [ ] Terms & conditions page
- [ ] Contact form email notifications

### Phase 6: Admin Backend - Products
- [ ] Admin authentication and authorization
- [ ] Admin dashboard with analytics
- [ ] Product CRUD interface
- [ ] Product image upload
- [ ] Category management
- [ ] CSV bulk upload feature
- [ ] Order management dashboard
- [ ] Order status updates

### Phase 7: Admin Backend - Marketing Tools
- [ ] Customer gallery management interface
- [ ] Gallery image upload and editing
- [ ] Promo code creation and management
- [ ] Promo code tracking and analytics
- [ ] SendGrid integration setup
- [ ] Newsletter subscriber management
- [ ] Email campaign creation tool
- [ ] Campaign scheduling and sending
- [ ] Campaign analytics dashboard

### Phase 8: Enhancement & Polish
- [ ] SEO optimization (meta tags, Open Graph, structured data)
- [ ] Performance optimization (image optimization, lazy loading)
- [ ] Analytics integration (Google Analytics, Facebook Pixel)
- [ ] Mobile responsiveness final polish
- [ ] Accessibility improvements (WCAG compliance)
- [ ] Loading states and error handling
- [ ] Form validation and user feedback

### Phase 9: Testing & Launch
- [ ] End-to-end testing
- [ ] Payment testing (sandbox and production)
- [ ] Security audit
- [ ] Performance testing
- [ ] Production deployment to Vercel

## Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Google OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
NEXTAUTH_URL=
NEXTAUTH_SECRET=

# PayPlus
PAYPLUS_API_KEY=
PAYPLUS_SECRET_KEY=
PAYPLUS_TERMINAL_ID=
NEXT_PUBLIC_PAYPLUS_MODE=sandbox # or production

# SendGrid
SENDGRID_API_KEY=
SENDGRID_FROM_EMAIL=
SENDGRID_FROM_NAME=
SENDGRID_WELCOME_TEMPLATE_ID=
SENDGRID_ORDER_CONFIRMATION_TEMPLATE_ID=
SENDGRID_SHIPPING_NOTIFICATION_TEMPLATE_ID=

# Admin
ADMIN_EMAILS= # Comma-separated list of admin emails
```

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account
- Google Cloud Console project (for OAuth)
- PayPlus merchant account
- SendGrid account with API key

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd carpets

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your credentials

# Run database migrations
npm run db:migrate

# Start development server
npm run dev
```

Visit `http://localhost:3000` to view the application.

## API Routes

### Public APIs
- `GET /api/products` - Get all products with filters
- `GET /api/products/featured` - Get featured/most wanted products
- `GET /api/products/[slug]` - Get product by slug
- `GET /api/categories` - Get all categories
- `GET /api/gallery` - Get customer gallery images for homepage
- `POST /api/checkout` - Create checkout session
- `POST /api/checkout/validate-promo` - Validate promo code
- `POST /api/payment/webhook` - PayPlus webhook handler
- `POST /api/newsletter/subscribe` - Subscribe to newsletter
- `POST /api/newsletter/unsubscribe` - Unsubscribe from newsletter
- `POST /api/contact` - Submit contact form

### Protected APIs (Admin)
- `POST /api/admin/products` - Create product
- `PUT /api/admin/products/[id]` - Update product
- `DELETE /api/admin/products/[id]` - Delete product
- `POST /api/admin/products/bulk-upload` - Bulk upload CSV
- `GET /api/admin/orders` - Get all orders
- `PUT /api/admin/orders/[id]` - Update order status
- `GET /api/admin/gallery` - Get all customer gallery images
- `POST /api/admin/gallery` - Upload new gallery image
- `PUT /api/admin/gallery/[id]` - Update gallery image
- `DELETE /api/admin/gallery/[id]` - Delete gallery image
- `GET /api/admin/promo-codes` - Get all promo codes
- `POST /api/admin/promo-codes` - Create promo code
- `PUT /api/admin/promo-codes/[id]` - Update promo code
- `DELETE /api/admin/promo-codes/[id]` - Delete promo code
- `GET /api/admin/newsletter/subscribers` - Get all subscribers
- `POST /api/admin/newsletter/campaigns` - Create email campaign
- `POST /api/admin/newsletter/campaigns/[id]/send` - Send campaign
- `GET /api/admin/newsletter/analytics` - Get campaign analytics

## Design Considerations

### RTL Support (Hebrew)
- Tailwind CSS configured for RTL (Hebrew)
- Right-to-left text direction and layout
- Proper text alignment and layout mirroring
- RTL-aware component positioning

### Performance
- Next.js Image optimization
- Lazy loading for product images
- Server-side rendering for SEO
- Static generation for category pages
- Edge caching via Vercel

### Security
- Row-level security (RLS) in Supabase
- Admin route protection
- CSRF protection
- Input sanitization
- Secure payment processing

### Accessibility
- WCAG 2.1 AA compliance
- Keyboard navigation
- Screen reader support
- High contrast mode
- Focus indicators

## Contributing

(Add contribution guidelines as needed)

## License

(Add license information)

## Support

For questions or issues, please contact: [Your contact information]

---

**Last Updated**: 2025-11-10
**Version**: 1.0.0-planning

---

## Page Summary

### Public Pages (6 pages total)
1. **Homepage** (`/`) - Main landing page with all sections
2. **Individual Product Page** (`/product/[slug]`) - Detailed product information
3. **About Page** (`/about`) - Company information and story
4. **Contact Page** (`/contact`) - Contact form and information
5. **Privacy Policy** (`/privacy`) - Privacy policy and data usage
6. **Terms & Conditions** (`/terms`) - Legal terms and policies

### Shopping Flow (3 pages)
1. **Shopping Cart** (`/cart`) - Review items before checkout
2. **Checkout** (`/checkout`) - Enter shipping and payment details
3. **Order Confirmation** (`/checkout/success`) - Order completed successfully

### Admin Pages (Protected)
Multiple admin dashboard pages for managing products, orders, gallery, promo codes, and newsletter campaigns.

---

## Newsletter & Promotional Strategy

### Subscription Incentives
- **First-time subscriber discount**: 10% off first purchase
- Popup modal trigger: After 30 seconds or on exit intent
- Footer form: Always visible
- Checkout page: Optional newsletter opt-in

### Email Types (SendGrid)

**Transactional Emails:**
1. Welcome email with promo code
2. Order confirmation with tracking
3. Shipping notification
4. Delivery confirmation

**Marketing Emails:**
1. Weekly deals and promotions
2. New product announcements
3. Seasonal sales campaigns
4. Abandoned cart reminders
5. Back-in-stock notifications
6. Birthday/anniversary offers (if customer data available)

### SendGrid Integration Details

**API Usage:**
- SendGrid API v3 for sending emails
- Dynamic templates for consistent branding
- Personalization using merge tags
- Unsubscribe link management
- Bounce and spam report handling

**Tracking & Analytics:**
- Open rate tracking
- Click-through rate tracking
- Conversion tracking (promo code usage)
- A/B testing for subject lines
- Engagement scoring

**Compliance:**
- GDPR compliant unsubscribe mechanism
- Clear privacy policy
- Double opt-in option (configurable)
- Subscription preference center
