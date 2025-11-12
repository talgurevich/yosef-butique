# Product Subcategories - Setup Guide

## Overview

The product category system now supports hierarchical subcategories. Categories can have parent-child relationships, allowing you to organize products in a more structured way.

## Database Structure

The `categories` table includes a `parent_id` field that references another category:

```sql
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,  -- For subcategories
  image_url TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Adding Subcategories

### SQL Migration

The following subcategories have been added under a parent "שטיחים" (Carpets) category:

1. **שטיחים מודרנים** (Modern Rugs) - `modern-rugs`
2. **שטיחים אתנים** (Ethnic Rugs) - `ethnic-rugs`
3. **שטיחי לולאות** (Loop Rugs) - `loop-rugs`
4. **שטיחים עגולים** (Round Rugs) - `round-rugs`
5. **שטיחים לחדרי שינה** (Bedroom Rugs) - `bedroom-rugs`
6. **חדרי ילדים** (Kids Rooms) - `kids-rooms`

To apply these subcategories to your database, run:

```bash
# Using Supabase CLI or SQL editor in Supabase dashboard
psql -h <your-host> -U postgres -d postgres -f supabase-add-subcategories.sql
```

Or execute the SQL file contents in your Supabase SQL Editor.

### Admin Interface

The admin category management page at `/admin/categories` now supports:

1. **Creating Subcategories:**
   - When adding or editing a category, you can select a parent category from the dropdown
   - Leave "קטגוריה אב" (Parent Category) empty to create a top-level category
   - Select a parent to create a subcategory

2. **Hierarchical Display:**
   - Parent categories are displayed normally
   - Subcategories are shown with a light gray background and a "↳" arrow prefix
   - You can edit the parent category of any category

3. **Visual Indicators:**
   - Subcategories have a gray background in the table
   - Subcategories show their parent in the "קטגוריה אב" column

## Frontend Display

### Products Page

The products page (`/products`) now displays categories hierarchically:

- **Parent categories** are shown in bold
- **Subcategories** are indented under their parent with a "↳" symbol
- Both parent and subcategories are clickable and link to filtered product views

Example structure:
```
כל המוצרים (All Products)
שטיחים (Carpets)
  ↳ שטיחים מודרנים (Modern Rugs)
  ↳ שטיחים אתנים (Ethnic Rugs)
  ↳ שטיחי לולאות (Loop Rugs)
```

### Homepage Category Preview

The homepage continues to show featured parent categories in the category preview section.

## Usage Recommendations

### Category Organization

1. **Use parent categories** for broad product types:
   - שטיחים (Carpets/Rugs)
   - רצים (Runners)
   - ריהוט (Furniture)

2. **Use subcategories** for specific attributes or styles:
   - By style: Modern, Classic, Ethnic
   - By room: Living Room, Bedroom, Kids Rooms
   - By shape: Round, Rectangular, Runner
   - By material: Wool, Cotton, Synthetic

### Assigning Products to Categories

Products can be assigned to both parent and subcategories:

1. In the admin product form, all active categories (including subcategories) are shown
2. You can assign a product to multiple categories
3. It's recommended to assign products to the most specific category that applies

Example:
- A modern round bedroom rug could be assigned to:
  - שטיחים מודרנים (Modern Rugs)
  - שטיחים עגולים (Round Rugs)
  - שטיחים לחדרי שינה (Bedroom Rugs)

## Next Steps

### Optional Enhancements

1. **Category Filtering:**
   - Currently, category links on the products page don't filter products yet
   - Implement client-side or server-side filtering based on the `?category=slug` query parameter

2. **Breadcrumbs:**
   - Add breadcrumb navigation showing the category hierarchy
   - Example: Home > שטיחים > שטיחים מודרנים

3. **Category Images:**
   - Add image upload functionality for categories
   - Display category images in the preview section

4. **Deep Nesting:**
   - Currently supports 2 levels (parent → child)
   - Can be extended to support deeper nesting if needed

## Files Modified

1. **Database:**
   - `supabase-add-subcategories.sql` - Migration to add subcategories

2. **Admin Interface:**
   - `app/admin/categories/page.tsx` - Category management with hierarchical support

3. **Frontend:**
   - `app/products/page.tsx` - Hierarchical category display

4. **Documentation:**
   - `SUBCATEGORIES-SETUP.md` - This guide

## Troubleshooting

### Subcategories Not Showing

- Ensure categories are marked as active (`is_active = true`)
- Check that `parent_id` is correctly set to the parent category's ID
- Verify the migration script ran successfully

### Parent Category Dropdown Empty

- Make sure there are parent categories (categories with `parent_id = NULL`)
- Categories cannot be their own parent

### Products Not Showing in Subcategory

- Products need to be explicitly assigned to subcategories
- Check the `product_categories` junction table for the relationship
