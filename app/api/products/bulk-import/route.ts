import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import Papa from 'papaparse';

type CSVRow = {
  name: string;
  description?: string;
  material?: string;
  categories?: string;
  is_featured?: string;
  is_active?: string;
  sizes: string;
  prices: string;
  compare_prices?: string;
  stock_quantities: string;
};

type ValidationError = {
  row: number;
  field: string;
  message: string;
};

export async function POST(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'לא נבחר קובץ' },
        { status: 400 }
      );
    }

    // Read file content
    const text = await file.text();

    // Parse CSV
    const parseResult = Papa.parse<CSVRow>(text, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.trim().toLowerCase(),
    });

    if (parseResult.errors.length > 0) {
      return NextResponse.json(
        { error: 'שגיאה בניתוח קובץ ה-CSV', details: parseResult.errors },
        { status: 400 }
      );
    }

    const rows = parseResult.data;
    const errors: ValidationError[] = [];
    let successCount = 0;
    let errorCount = 0;

    // Fetch all categories for mapping
    const { data: categories } = await supabaseAdmin
      .from('categories')
      .select('id, name');

    const categoryMap = new Map(
      categories?.map(cat => [cat.name.toLowerCase().trim(), cat.id]) || []
    );

    // Process each row
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const rowNumber = i + 2; // +2 because of header row and 0-index

      try {
        // Validate required fields
        if (!row.name || !row.name.trim()) {
          errors.push({
            row: rowNumber,
            field: 'name',
            message: 'שם המוצר הוא שדה חובה'
          });
          errorCount++;
          continue;
        }

        if (!row.sizes || !row.sizes.trim()) {
          errors.push({
            row: rowNumber,
            field: 'sizes',
            message: 'יש לציין לפחות מידה אחת'
          });
          errorCount++;
          continue;
        }

        if (!row.prices || !row.prices.trim()) {
          errors.push({
            row: rowNumber,
            field: 'prices',
            message: 'יש לציין לפחות מחיר אחד'
          });
          errorCount++;
          continue;
        }

        // Parse variants
        const sizes = row.sizes.split('|').map(s => s.trim()).filter(Boolean);
        const prices = row.prices.split('|').map(p => p.trim()).filter(Boolean);
        const comparePrices = row.compare_prices
          ? row.compare_prices.split('|').map(p => p.trim()).filter(Boolean)
          : [];
        const stockQuantities = row.stock_quantities
          ? row.stock_quantities.split('|').map(s => s.trim()).filter(Boolean)
          : [];

        // Validate variants match
        if (sizes.length !== prices.length) {
          errors.push({
            row: rowNumber,
            field: 'variants',
            message: `מספר המידות (${sizes.length}) והמחירים (${prices.length}) חייבים להיות זהים`
          });
          errorCount++;
          continue;
        }

        // If stock quantities provided, validate they match
        if (stockQuantities.length > 0 && stockQuantities.length !== sizes.length) {
          errors.push({
            row: rowNumber,
            field: 'stock_quantities',
            message: `מספר כמויות המלאי (${stockQuantities.length}) חייב להתאים למספר המידות (${sizes.length})`
          });
          errorCount++;
          continue;
        }

        if (sizes.length === 0) {
          errors.push({
            row: rowNumber,
            field: 'sizes',
            message: 'יש לציין לפחות מידה אחת'
          });
          errorCount++;
          continue;
        }

        // Generate slug
        const slug = `${row.name
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/[\s_-]+/g, '-')
          .replace(/^-+|-+$/g, '')}-${Date.now()}`;

        // Parse boolean fields
        const isFeatured = row.is_featured?.toLowerCase() === 'yes' || row.is_featured?.toLowerCase() === 'true';
        const isActive = row.is_active?.toLowerCase() !== 'no' && row.is_active?.toLowerCase() !== 'false'; // default true

        // Auto-generate SKU
        const baseSku = `PROD-${Date.now()}-${i}`;

        // Create product
        const { data: productData, error: productError } = await supabaseAdmin
          .from('products')
          .insert([{
            name: row.name.trim(),
            description: row.description?.trim() || '',
            price: parseFloat(prices[0]),
            sku: baseSku,
            size: sizes[0],
            material: row.material?.trim() || '',
            stock_quantity: 0,
            is_featured: isFeatured,
            is_active: isActive,
            slug,
            style: [],
            color: [],
            has_variants: sizes.length > 1,
          }])
          .select()
          .single();

        if (productError) {
          errors.push({
            row: rowNumber,
            field: 'product',
            message: productError.message
          });
          errorCount++;
          continue;
        }

        // Create variants
        const variantsToInsert = sizes.map((size, idx) => ({
          product_id: productData.id,
          size,
          sku: `${baseSku}-${idx + 1}`,
          price: parseFloat(prices[idx]),
          compare_at_price: comparePrices[idx] ? parseFloat(comparePrices[idx]) : null,
          stock_quantity: stockQuantities[idx] ? parseInt(stockQuantities[idx]) : 0,
          is_active: true,
          sort_order: idx,
        }));

        const { error: variantsError } = await supabaseAdmin
          .from('product_variants')
          .insert(variantsToInsert);

        if (variantsError) {
          errors.push({
            row: rowNumber,
            field: 'variants',
            message: variantsError.message
          });
          // Delete the product since variants failed
          await supabaseAdmin.from('products').delete().eq('id', productData.id);
          errorCount++;
          continue;
        }

        // Associate categories
        if (row.categories && row.categories.trim()) {
          const categoryNames = row.categories
            .split(',')
            .map(c => c.trim().toLowerCase())
            .filter(Boolean);

          const categoryIds = categoryNames
            .map(name => categoryMap.get(name))
            .filter(Boolean) as string[];

          if (categoryIds.length > 0) {
            const categoryRelations = categoryIds.map(categoryId => ({
              product_id: productData.id,
              category_id: categoryId,
            }));

            await supabaseAdmin
              .from('product_categories')
              .insert(categoryRelations);
          }
        }

        successCount++;

      } catch (error: any) {
        errors.push({
          row: rowNumber,
          field: 'general',
          message: error.message
        });
        errorCount++;
      }
    }

    return NextResponse.json({
      success: errorCount === 0,
      message: errorCount === 0
        ? 'כל המוצרים יובאו בהצלחה'
        : `יובאו ${successCount} מוצרים עם ${errorCount} שגיאות`,
      successCount,
      errorCount,
      errors: errors.slice(0, 100), // Limit to first 100 errors
    });

  } catch (error: any) {
    console.error('Bulk import error:', error);
    return NextResponse.json(
      { error: error.message || 'שגיאה בייבוא הקובץ' },
      { status: 500 }
    );
  }
}
