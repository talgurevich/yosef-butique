# Product Variants Guide - Multiple Dimensions for Carpets

## Overview

Your carpet e-commerce site now supports **multiple dimensions** for each product! This means a single carpet model (e.g., "Modern Grey Carpet") can have multiple size options.

## Why Use Variants?

**Before**: Each size was a separate product
- Modern Grey Carpet 160×230
- Modern Grey Carpet 200×290
- Modern Grey Carpet 240×340

**After**: One product with multiple sizes
- Modern Grey Carpet
  - Size: 160×230 - ₪299
  - Size: 200×290 - ₪399
  - Size: 240×340 - ₪499

**Benefits:**
- ✅ Easier to manage (one product instead of many)
- ✅ Better customer experience (choose size on one page)
- ✅ Accurate inventory tracking per size
- ✅ Different prices per size
- ✅ Better SEO (one product page, multiple sizes)

## Database Changes

### New Table: `product_variants`

Stores different size options for each product:

```sql
- id (UUID)
- product_id (links to main product)
- size (e.g., "160×230")
- sku (unique per variant, e.g., "RUG-001-M")
- price (can vary by size)
- compare_at_price (original price)
- stock_quantity (inventory per size)
- is_active (show/hide this size)
- sort_order (display order)
```

### Updated: `products` table

Added field:
- `has_variants` (boolean) - indicates if product has multiple sizes

## How to Use in Admin

### Step 1: Run Database Migration

1. Go to Supabase Dashboard → SQL Editor
2. Open `supabase-product-variants-migration.sql`
3. Copy and run the SQL

### Step 2: Create or Edit a Product

1. Go to **Admin** → **Products**
2. Click **"הוסף מוצר"** (Add Product) or edit existing
3. Fill in basic product info

### Step 3: Add Dimensions

After saving the product, you'll see the **"מידות וגדלים"** (Dimensions and Sizes) section:

1. Click **"הוסף מידה"** (Add Dimension)
2. Fill in for each size:
   - **מידה** (Size): e.g., "160×230"
   - **מק״ט** (SKU): e.g., "RUG-001-M"
   - **מחיר** (Price): e.g., 299
   - **מחיר לפני הנחה** (Compare Price): Optional
   - **מלאי** (Stock): e.g., 10
3. Click **"שמור"** (Save) for each size
4. Repeat for all sizes

### Example Setup

**Product**: שטיח מודרני אפור (Modern Grey Carpet)
**SKU**: RUG-001

**Variants:**
1. Size: 120×170, SKU: RUG-001-S, Price: ₪199, Stock: 15
2. Size: 160×230, SKU: RUG-001-M, Price: ₪299, Stock: 10
3. Size: 200×290, SKU: RUG-001-L, Price: ₪399, Stock: 8
4. Size: 240×340, SKU: RUG-001-XL, Price: ₪499, Stock: 5

## SKU Naming Convention

**Recommended format**: `BASE-SIZE`

Examples:
- `RUG-001-S` (Small: 120×170)
- `RUG-001-M` (Medium: 160×230)
- `RUG-001-L` (Large: 200×290)
- `RUG-001-XL` (Extra Large: 240×340)
- `RUG-001-XXL` (Double XL: 290×390)

Or use actual dimensions:
- `RUG-001-160x230`
- `RUG-001-200x290`

## Common Carpet Sizes

### Small (S) - 120×170 cm
Best for: Small rooms, bedside, entryway

### Medium (M) - 160×230 cm
Best for: Living rooms, dining rooms

### Large (L) - 200×290 cm
Best for: Large living rooms, master bedrooms

### Extra Large (XL) - 240×340 cm
Best for: Open spaces, combined areas

### Double XL (XXL) - 290×390 cm
Best for: Very large spaces, halls

## Pricing Strategy

Typically, larger carpets cost more:

| Size | Approximate Price |
|------|------------------|
| 120×170 | ₪199 - ₪299 |
| 160×230 | ₪299 - ₪499 |
| 200×290 | ₪399 - ₪699 |
| 240×340 | ₪499 - ₪899 |
| 290×390 | ₪699 - ₪1,299 |

## Tips & Best Practices

### 1. Always Add Dimensions
For carpets, customers **always** need to choose a size. Add at least 2-3 size options per product.

### 2. Stock Management
Track inventory separately for each size. Popular sizes may sell out faster.

### 3. Pricing
Adjust prices based on size. Larger = more material = higher price.

### 4. SKU Organization
Keep SKUs consistent and logical for easy inventory management.

### 5. Sort Order
List sizes from smallest to largest (sort_order: 0, 1, 2, 3...).

## Frontend Display (Coming Soon)

When implemented on the product page, customers will:
1. See all available sizes
2. Select their preferred size
3. See price update based on size
4. Check stock availability for that size
5. Add specific size to cart

## Bulk Import with Variants

When using CSV import (future feature), you can import variants:

```csv
product_name,product_sku,variant_size,variant_sku,variant_price,variant_stock
Modern Grey Carpet,RUG-001,160×230,RUG-001-M,299,10
Modern Grey Carpet,RUG-001,200×290,RUG-001-L,399,8
Modern Grey Carpet,RUG-001,240×340,RUG-001-XL,499,5
```

## Migration Guide

### For Existing Products

If you already have products and want to convert to variants:

1. Keep one product (e.g., RUG-001)
2. Add all sizes as variants
3. Update inventory for each variant
4. Deactivate or delete duplicate size products
5. Update product images if needed

## Troubleshooting

### "Product has no variants"
→ Click "הוסף מידה" to add at least one size

### "SKU already exists"
→ Each variant needs a unique SKU

### "Size not showing"
→ Check that variant `is_active` is true

### "Price is 0"
→ Enter a price for each variant and save

## API Endpoints (For Developers)

```typescript
// Get product with variants
const { data } = await supabase
  .from('products')
  .select(`
    *,
    product_variants (*)
  `)
  .eq('id', productId)
  .single();

// Get active variants only
const { data } = await supabase
  .from('product_variants')
  .select('*')
  .eq('product_id', productId)
  .eq('is_active', true)
  .order('sort_order');
```

## Next Steps

1. ✅ Run migration SQL
2. ✅ Edit products to add variants
3. ⏳ Implement size selector on product pages
4. ⏳ Update cart to handle variants
5. ⏳ Update checkout to include variant info
6. ⏳ Update order management to show variant details

---

**Questions?** Check the main README.md or contact support.
