import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });

  try {
    // Fetch all attributes
    const [
      categories,
      colors,
      shapes,
      spaces,
      plantTypes,
      plantSizes,
      plantLight,
      plantCare,
      plantPetSafety,
      variantSizes
    ] = await Promise.all([
      supabaseAdmin.from('categories').select('slug, name').eq('is_active', true).order('sort_order'),
      supabaseAdmin.from('colors').select('slug, name').eq('is_active', true).order('sort_order'),
      supabaseAdmin.from('shapes').select('slug, name').eq('is_active', true).order('sort_order'),
      supabaseAdmin.from('spaces').select('slug, name').eq('is_active', true).order('sort_order'),
      supabaseAdmin.from('plant_types').select('slug, name').eq('is_active', true).order('sort_order'),
      supabaseAdmin.from('plant_sizes').select('slug, name').eq('is_active', true).order('sort_order'),
      supabaseAdmin.from('plant_light_requirements').select('slug, name').eq('is_active', true).order('sort_order'),
      supabaseAdmin.from('plant_care_levels').select('slug, name').eq('is_active', true).order('sort_order'),
      supabaseAdmin.from('plant_pet_safety').select('slug, name').eq('is_active', true).order('sort_order'),
      supabaseAdmin.from('product_variants').select('size').not('size', 'is', null).order('size'),
    ]);

    // Extract distinct sizes
    const sizes = Array.from(new Set((variantSizes.data || []).map((v: { size: string }) => v.size))).sort();

    return NextResponse.json({
      categories: categories.data || [],
      colors: colors.data || [],
      shapes: shapes.data || [],
      spaces: spaces.data || [],
      plantTypes: plantTypes.data || [],
      plantSizes: plantSizes.data || [],
      plantLight: plantLight.data || [],
      plantCare: plantCare.data || [],
      plantPetSafety: plantPetSafety.data || [],
      sizes,
    });

  } catch (error: any) {
    console.error('Attribute reference error:', error);
    return NextResponse.json(
      { error: error.message || 'שגיאה בטעינת נתוני ייחוס' },
      { status: 500 }
    );
  }
}
