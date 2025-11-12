# Category Management Setup Guide

## Overview
I've implemented a complete category management system with the ability to:
- Create and manage categories separately
- Assign multiple categories to each product
- Select categories when creating or editing products

## What Was Added

### 1. Database Changes (SQL File)
**File:** `supabase-add-product-categories.sql`

This file creates:
- **product_categories** junction table (many-to-many relationship)
- Indexes for better performance
- RLS policies (currently permissive for development)

### 2. TypeScript Types
**File:** `lib/supabase.ts`

Added new type:
```typescript
export type ProductCategory = {
  id: string;
  product_id: string;
  category_id: string;
  created_at: string;
};
```

### 3. Category Management Page
**File:** `app/admin/categories/page.tsx`

Full CRUD interface for categories:
- ✅ View all categories in a table
- ✅ Add new categories with name, description, sort order
- ✅ Edit categories inline
- ✅ Delete categories
- ✅ Toggle active/inactive status
- ✅ Auto-generate slugs from category names

**Access:** Navigate to `/admin/categories` in your admin panel

### 4. Multi-Select Category in Product Forms

#### New Product Form
**File:** `app/admin/products/new/page.tsx`

- ✅ Fetches all active categories
- ✅ Shows checkboxes for selecting multiple categories
- ✅ Creates product-category relationships when product is created
- ✅ Visual feedback for selected categories

#### Edit Product Form
**File:** `app/admin/products/[id]/page.tsx`

- ✅ Fetches existing category assignments
- ✅ Shows checkboxes with pre-selected categories
- ✅ Updates relationships when product is saved
- ✅ Syncs changes (removes old, adds new)

## Setup Instructions

### Step 1: Update the Database

1. Open your Supabase dashboard
2. Go to **SQL Editor**
3. Run the SQL file: `supabase-add-product-categories.sql`

This will create the junction table and necessary policies.

### Step 2: Create Some Categories

1. Navigate to `/admin/categories` in your admin panel
2. Click **"הוסף קטגוריה חדשה"** (Add New Category)
3. Fill in the category details:
   - **Name:** e.g., "שטיחים מודרניים" (Modern Carpets)
   - **Description:** Optional description
   - **Sort Order:** Number for ordering (0, 1, 2, etc.)
   - **Active:** Check to make it visible
4. Click **"שמור"** (Save)

Sample categories to create:
- שטיחים מודרניים (Modern Carpets)
- שטיחים קלאסיים (Classic Carpets)
- שטיחים מעוצבים (Designer Carpets)
- רצים (Runners)
- שטיחי צמר (Wool Carpets)
- שטיחי כותנה (Cotton Carpets)

### Step 3: Assign Categories to Products

#### When Creating a New Product:
1. Go to `/admin/products/new`
2. Fill in product details
3. In the **"קטגוריות"** section, check one or more categories
4. Add dimensions
5. Save the product

#### When Editing an Existing Product:
1. Go to `/admin/products` and click edit on any product
2. Scroll to the **"קטגוריות"** section
3. Check/uncheck categories as needed
4. Save changes

## How It Works

### Many-to-Many Relationship
```
products (1) ←→ (many) product_categories (many) ←→ (1) categories

One product can belong to multiple categories
One category can contain multiple products
```

### Database Structure
```sql
-- Junction table
product_categories
  ├── id (UUID, primary key)
  ├── product_id (references products)
  ├── category_id (references categories)
  └── created_at (timestamp)
```

### Product Creation Flow
1. User fills product form and selects categories
2. Product is created in `products` table
3. Product variants are created in `product_variants` table
4. For each selected category:
   - A row is inserted into `product_categories`
   - Links the product ID to the category ID

### Product Update Flow
1. User updates product and changes category selection
2. Product details are updated
3. **All existing category relationships are deleted**
4. **New category relationships are inserted**
5. This ensures categories are always in sync with the UI

## Features

### Category Management
- ✅ Create categories with unique slugs
- ✅ Edit categories inline in the table
- ✅ Delete categories (with confirmation)
- ✅ Sort categories by custom order
- ✅ Toggle active/inactive status
- ✅ RTL Hebrew interface

### Product-Category Assignment
- ✅ Visual checkboxes for easy selection
- ✅ Multiple categories per product
- ✅ Link to create categories if none exist
- ✅ Only shows active categories
- ✅ Saves relationships automatically

## Security Note

⚠️ **Current RLS Policies are PERMISSIVE for development**

The SQL file includes policies that allow anyone to:
- Read all categories
- Insert/update/delete categories
- Manage product-category relationships

**Before going to production:**
1. Implement proper admin authentication
2. Update RLS policies to restrict access
3. Only allow authenticated admins to modify data
4. See `SECURITY-NOTE.md` for full production checklist

## Testing the Implementation

### Test 1: Create a Category
1. Go to `/admin/categories`
2. Click "הוסף קטגוריה חדשה"
3. Create a category named "שטיחים מודרניים"
4. Verify it appears in the table

### Test 2: Assign Categories to New Product
1. Go to `/admin/products/new`
2. Create a product with name, SKU, and at least one dimension
3. Select 2-3 categories
4. Save and verify no errors

### Test 3: Edit Product Categories
1. Go to `/admin/products` and edit the product you just created
2. In the categories section, you should see your previous selections checked
3. Change the selection (add/remove categories)
4. Save and verify changes persist

### Test 4: View Products by Category
*Note: This will require frontend implementation to filter/display products by category on the public site*

## Next Steps

To complete the category system:

1. **Display categories on product pages**
   - Show which categories a product belongs to
   - Add category badges/tags

2. **Category filtering on homepage**
   - Filter products by category
   - Show category navigation

3. **Category pages**
   - Create `/category/[slug]` pages
   - Display all products in a category

4. **Breadcrumbs**
   - Show category path on product pages
   - Help with navigation

## Files Modified/Created

### Created:
- `supabase-add-product-categories.sql` - Database schema
- `app/admin/categories/page.tsx` - Category management UI
- `CATEGORY-SETUP-GUIDE.md` - This guide

### Modified:
- `lib/supabase.ts` - Added ProductCategory type
- `app/admin/products/new/page.tsx` - Added category selection
- `app/admin/products/[id]/page.tsx` - Added category selection

## Troubleshooting

### "Table 'product_categories' does not exist"
**Solution:** Run the `supabase-add-product-categories.sql` file in Supabase SQL Editor

### "New row violates RLS policy"
**Solution:** Run the RLS policy statements from the SQL file

### Categories not showing in product form
**Solution:**
1. Make sure you've created categories in `/admin/categories`
2. Verify categories are marked as active
3. Check browser console for errors

### Categories not saving with product
**Solution:**
1. Check browser console for errors
2. Verify the `product_categories` table exists
3. Ensure RLS policies are in place

## Summary

You now have a complete category management system! The workflow is:

1. **Create categories** → `/admin/categories`
2. **Assign to products** → Select checkboxes when creating/editing products
3. **Categories save automatically** → Junction table handles relationships

All category operations use the many-to-many relationship pattern, allowing maximum flexibility for organizing your carpet products.
