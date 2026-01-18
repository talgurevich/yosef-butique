import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import Papa from 'papaparse';

type CSVRow = {
  name: string;
  description?: string;
  product_type: string;
  material?: string;
  is_featured?: string;
  is_active?: string;
  sizes: string;
  prices: string;
  compare_prices?: string;
  stock_quantities?: string;
  categories?: string;
  colors?: string;
  shapes?: string;
  spaces?: string;
  plant_types?: string;
  plant_sizes?: string;
  plant_light?: string;
  plant_care?: string;
  plant_pet_safety?: string;
  image_urls?: string;
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
      transformHeader: (header) => header.trim().toLowerCase().replace(/ /g, '_'),
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

    // Fetch all attributes for mapping (slug and name based)
    const [
      categoriesData,
      colorsData,
      shapesData,
      spacesData,
      plantTypesData,
      plantSizesData,
      plantLightData,
      plantCareData,
      plantPetSafetyData,
      productTypesData
    ] = await Promise.all([
      supabaseAdmin.from('categories').select('id, slug, name'),
      supabaseAdmin.from('colors').select('id, slug, name'),
      supabaseAdmin.from('shapes').select('id, slug, name'),
      supabaseAdmin.from('spaces').select('id, slug, name'),
      supabaseAdmin.from('plant_types').select('id, slug, name'),
      supabaseAdmin.from('plant_sizes').select('id, slug, name'),
      supabaseAdmin.from('plant_light_requirements').select('id, slug, name'),
      supabaseAdmin.from('plant_care_levels').select('id, slug, name'),
      supabaseAdmin.from('plant_pet_safety').select('id, slug, name'),
      supabaseAdmin.from('product_types').select('id, slug'),
    ]);

    // Helper to create a map that supports both slug and Hebrew name lookups
    const createLookupMap = (data: any[] | null) => {
      const map = new Map<string, string>();
      (data || []).forEach(item => {
        map.set(item.slug.toLowerCase(), item.id);
        if (item.name) {
          map.set(item.name.toLowerCase(), item.id);
        }
      });
      return map;
    };

    // Create lookup maps (support both slug and Hebrew name)
    const slugMaps = {
      categories: createLookupMap(categoriesData.data),
      colors: createLookupMap(colorsData.data),
      shapes: createLookupMap(shapesData.data),
      spaces: createLookupMap(spacesData.data),
      plantTypes: createLookupMap(plantTypesData.data),
      plantSizes: createLookupMap(plantSizesData.data),
      plantLight: createLookupMap(plantLightData.data),
      plantCare: createLookupMap(plantCareData.data),
      plantPetSafety: createLookupMap(plantPetSafetyData.data),
      productTypes: new Map((productTypesData.data || []).map(item => [item.slug, item.id])),
    };

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

        if (!row.product_type || !row.product_type.trim()) {
          errors.push({
            row: rowNumber,
            field: 'product_type',
            message: 'סוג מוצר (product_type) הוא שדה חובה - carpet או plant'
          });
          errorCount++;
          continue;
        }

        const productType = row.product_type.trim().toLowerCase();
        if (productType !== 'carpet' && productType !== 'plant') {
          errors.push({
            row: rowNumber,
            field: 'product_type',
            message: 'סוג מוצר חייב להיות carpet או plant'
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
        // For plants, sizes can be empty - we'll use a default size
        const hasSizes = row.sizes && row.sizes.trim();
        const sizes = hasSizes
          ? row.sizes.split('|').map(s => s.trim()).filter(Boolean)
          : (productType === 'plant' ? ['Standard'] : []);
        const prices = row.prices.split('|').map(p => p.trim()).filter(Boolean);

        // Validate sizes for carpets
        if (productType === 'carpet' && sizes.length === 0) {
          errors.push({
            row: rowNumber,
            field: 'sizes',
            message: 'שטיחים חייבים לכלול לפחות מידה אחת'
          });
          errorCount++;
          continue;
        }
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

        if (stockQuantities.length > 0 && stockQuantities.length !== sizes.length) {
          errors.push({
            row: rowNumber,
            field: 'stock_quantities',
            message: `מספר כמויות המלאי (${stockQuantities.length}) חייב להתאים למספר המידות (${sizes.length})`
          });
          errorCount++;
          continue;
        }

        // Get product type ID
        const productTypeSlug = productType === 'carpet' ? 'carpets' : 'plants';
        const productTypeId = slugMaps.productTypes.get(productTypeSlug);

        if (!productTypeId) {
          errors.push({
            row: rowNumber,
            field: 'product_type',
            message: `לא נמצא סוג מוצר עבור ${productTypeSlug}`
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
            product_type_id: productTypeId,
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
          await supabaseAdmin.from('products').delete().eq('id', productData.id);
          errorCount++;
          continue;
        }

        // Helper function to associate attributes
        const associateAttributes = async (
          slugsString: string | undefined,
          slugMap: Map<string, string>,
          tableName: string,
          columnName: string
        ) => {
          if (!slugsString || !slugsString.trim()) return;

          const slugs = slugsString.split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
          const ids = slugs.map(slug => slugMap.get(slug)).filter(Boolean) as string[];

          if (ids.length === 0) return;

          const relations = ids.map(id => ({
            product_id: productData.id,
            [columnName]: id,
          }));

          await supabaseAdmin.from(tableName).insert(relations);
        };

        // Associate all attributes based on product type
        if (productType === 'carpet') {
          await Promise.all([
            associateAttributes(row.categories, slugMaps.categories, 'product_categories', 'category_id'),
            associateAttributes(row.colors, slugMaps.colors, 'product_colors', 'color_id'),
            associateAttributes(row.shapes, slugMaps.shapes, 'product_shapes', 'shape_id'),
            associateAttributes(row.spaces, slugMaps.spaces, 'product_spaces', 'space_id'),
          ]);
        } else if (productType === 'plant') {
          await Promise.all([
            associateAttributes(row.plant_types, slugMaps.plantTypes, 'product_plant_types', 'plant_type_id'),
            associateAttributes(row.plant_sizes, slugMaps.plantSizes, 'product_plant_sizes', 'plant_size_id'),
            associateAttributes(row.plant_light, slugMaps.plantLight, 'product_plant_light_requirements', 'plant_light_requirement_id'),
            associateAttributes(row.plant_care, slugMaps.plantCare, 'product_plant_care_levels', 'plant_care_level_id'),
            associateAttributes(row.plant_pet_safety, slugMaps.plantPetSafety, 'product_plant_pet_safety', 'plant_pet_safety_id'),
            associateAttributes(row.colors, slugMaps.colors, 'product_colors', 'color_id'),
          ]);
        }

        // Handle image URLs
        if (row.image_urls && row.image_urls.trim()) {
          const imageUrls = row.image_urls.split('|').map(url => url.trim()).filter(Boolean);

          const imagesToInsert = imageUrls.map((url, idx) => ({
            product_id: productData.id,
            image_url: url,
            alt_text: `${row.name} - Image ${idx + 1}`,
            sort_order: idx,
          }));

          if (imagesToInsert.length > 0) {
            await supabaseAdmin.from('product_images').insert(imagesToInsert);
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
