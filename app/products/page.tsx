import { supabase } from '@/lib/supabase';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductsPageClient from '@/components/ProductsPageClient';
import Breadcrumbs from '@/components/Breadcrumbs';

// Revalidate every 60 seconds
export const revalidate = 60;

type FilterParams = {
  category?: string;
  productType?: string;
  color?: string;
  shape?: string;
  space?: string;
  plantType?: string;
  plantSize?: string;
  plantLight?: string;
  plantCare?: string;
  plantPetSafety?: string;
};

async function getProducts(filters: FilterParams = {}) {
  if (!supabase) {
    return [];
  }

  let query = supabase
    .from('products')
    .select(`
      *,
      product_images (
        id,
        image_url,
        alt_text,
        sort_order
      ),
      product_types (
        id,
        name,
        slug
      ),
      product_categories (
        categories (
          id,
          name,
          slug
        )
      ),
      product_colors (
        colors (
          id,
          name,
          slug
        )
      ),
      product_shapes (
        shapes (
          id,
          name,
          slug
        )
      ),
      product_spaces (
        spaces (
          id,
          name,
          slug
        )
      ),
      product_plant_types (
        plant_types (
          id,
          name,
          slug
        )
      ),
      product_plant_sizes (
        plant_sizes (
          id,
          name,
          slug
        )
      )
    `)
    .eq('is_active', true);

  // Filter by product type
  if (filters.productType) {
    const { data: productType } = await supabase
      .from('product_types')
      .select('id')
      .eq('slug', filters.productType)
      .single();

    if (productType) {
      query = query.eq('product_type_id', productType.id);
    }
  }

  // Get initial products
  const { data: products, error } = await query.order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }

  if (!products) return [];

  // Filter by category (junction table) - supports multiple values
  let filteredProducts = products;

  if (filters.category) {
    const categorySlugs = filters.category.split(',');
    const { data: categoryData } = await supabase
      .from('categories')
      .select('id')
      .in('slug', categorySlugs);

    if (categoryData && categoryData.length > 0) {
      const categoryIds = categoryData.map(c => c.id);
      const { data: productCategories } = await supabase
        .from('product_categories')
        .select('product_id')
        .in('category_id', categoryIds);

      const productIds = new Set(productCategories?.map(pc => pc.product_id) || []);
      filteredProducts = filteredProducts.filter(p => productIds.has(p.id));
    }
  }

  // Filter by color (junction table) - supports multiple values
  if (filters.color) {
    const colorSlugs = filters.color.split(',');
    const { data: colorData } = await supabase
      .from('colors')
      .select('id')
      .in('slug', colorSlugs);

    if (colorData && colorData.length > 0) {
      const colorIds = colorData.map(c => c.id);
      const { data: productColors } = await supabase
        .from('product_colors')
        .select('product_id')
        .in('color_id', colorIds);

      const productIds = new Set(productColors?.map(pc => pc.product_id) || []);
      filteredProducts = filteredProducts.filter(p => productIds.has(p.id));
    }
  }

  // Filter by shape (junction table) - supports multiple values
  if (filters.shape) {
    const shapeSlugs = filters.shape.split(',');
    const { data: shapeData } = await supabase
      .from('shapes')
      .select('id')
      .in('slug', shapeSlugs);

    if (shapeData && shapeData.length > 0) {
      const shapeIds = shapeData.map(s => s.id);
      const { data: productShapes } = await supabase
        .from('product_shapes')
        .select('product_id')
        .in('shape_id', shapeIds);

      const productIds = new Set(productShapes?.map(ps => ps.product_id) || []);
      filteredProducts = filteredProducts.filter(p => productIds.has(p.id));
    }
  }

  // Filter by space (junction table) - supports multiple values
  if (filters.space) {
    const spaceSlugs = filters.space.split(',');
    const { data: spaceData } = await supabase
      .from('spaces')
      .select('id')
      .in('slug', spaceSlugs);

    if (spaceData && spaceData.length > 0) {
      const spaceIds = spaceData.map(s => s.id);
      const { data: productSpaces } = await supabase
        .from('product_spaces')
        .select('product_id')
        .in('space_id', spaceIds);

      const productIds = new Set(productSpaces?.map(ps => ps.product_id) || []);
      filteredProducts = filteredProducts.filter(p => productIds.has(p.id));
    }
  }

  // Filter by plant type (junction table) - supports multiple values
  if (filters.plantType) {
    const plantTypeSlugs = filters.plantType.split(',');
    const { data: plantTypeData } = await supabase
      .from('plant_types')
      .select('id')
      .in('slug', plantTypeSlugs);

    if (plantTypeData && plantTypeData.length > 0) {
      const plantTypeIds = plantTypeData.map(pt => pt.id);
      const { data: productPlantTypes } = await supabase
        .from('product_plant_types')
        .select('product_id')
        .in('plant_type_id', plantTypeIds);

      const productIds = new Set(productPlantTypes?.map(pt => pt.product_id) || []);
      filteredProducts = filteredProducts.filter(p => productIds.has(p.id));
    }
  }

  // Filter by plant size (junction table) - supports multiple values
  if (filters.plantSize) {
    const plantSizeSlugs = filters.plantSize.split(',');
    const { data: plantSizeData } = await supabase
      .from('plant_sizes')
      .select('id')
      .in('slug', plantSizeSlugs);

    if (plantSizeData && plantSizeData.length > 0) {
      const plantSizeIds = plantSizeData.map(ps => ps.id);
      const { data: productPlantSizes } = await supabase
        .from('product_plant_sizes')
        .select('product_id')
        .in('plant_size_id', plantSizeIds);

      const productIds = new Set(productPlantSizes?.map(ps => ps.product_id) || []);
      filteredProducts = filteredProducts.filter(p => productIds.has(p.id));
    }
  }

  // Filter by plant light requirements (junction table) - supports multiple values
  if (filters.plantLight) {
    const plantLightSlugs = filters.plantLight.split(',');
    const { data: plantLightData } = await supabase
      .from('plant_light_requirements')
      .select('id')
      .in('slug', plantLightSlugs);

    if (plantLightData && plantLightData.length > 0) {
      const plantLightIds = plantLightData.map(pl => pl.id);
      const { data: productPlantLights } = await supabase
        .from('product_plant_light_requirements')
        .select('product_id')
        .in('plant_light_requirement_id', plantLightIds);

      const productIds = new Set(productPlantLights?.map(pl => pl.product_id) || []);
      filteredProducts = filteredProducts.filter(p => productIds.has(p.id));
    }
  }

  // Filter by plant care level (junction table) - supports multiple values
  if (filters.plantCare) {
    const plantCareSlugs = filters.plantCare.split(',');
    const { data: plantCareData } = await supabase
      .from('plant_care_levels')
      .select('id')
      .in('slug', plantCareSlugs);

    if (plantCareData && plantCareData.length > 0) {
      const plantCareIds = plantCareData.map(pc => pc.id);
      const { data: productPlantCares } = await supabase
        .from('product_plant_care_levels')
        .select('product_id')
        .in('plant_care_level_id', plantCareIds);

      const productIds = new Set(productPlantCares?.map(pc => pc.product_id) || []);
      filteredProducts = filteredProducts.filter(p => productIds.has(p.id));
    }
  }

  // Filter by plant pet safety (junction table) - supports multiple values
  if (filters.plantPetSafety) {
    const plantPetSafetySlugs = filters.plantPetSafety.split(',');
    const { data: plantPetSafetyData } = await supabase
      .from('plant_pet_safety')
      .select('id')
      .in('slug', plantPetSafetySlugs);

    if (plantPetSafetyData && plantPetSafetyData.length > 0) {
      const plantPetSafetyIds = plantPetSafetyData.map(pps => pps.id);
      const { data: productPlantPetSafety } = await supabase
        .from('product_plant_pet_safety')
        .select('product_id')
        .in('plant_pet_safety_id', plantPetSafetyIds);

      const productIds = new Set(productPlantPetSafety?.map(pps => pps.product_id) || []);
      filteredProducts = filteredProducts.filter(p => productIds.has(p.id));
    }
  }

  // Sort images by sort_order
  const productsWithSortedImages = filteredProducts.map(product => ({
    ...product,
    product_images: product.product_images?.sort((a: any, b: any) => a.sort_order - b.sort_order) || []
  }));

  return productsWithSortedImages;
}

async function getCategories() {
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('sort_order');

  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }

  return data || [];
}

async function getProductTypes() {
  if (!supabase) return [];
  const { data } = await supabase
    .from('product_types')
    .select('*')
    .eq('is_active', true);
  return data || [];
}

async function getColors() {
  if (!supabase) return [];
  const { data } = await supabase
    .from('colors')
    .select('*')
    .eq('is_active', true)
    .order('sort_order');
  return data || [];
}

async function getShapes() {
  if (!supabase) return [];
  const { data } = await supabase
    .from('shapes')
    .select('*')
    .eq('is_active', true)
    .order('sort_order');
  return data || [];
}

async function getSpaces() {
  if (!supabase) return [];
  const { data } = await supabase
    .from('spaces')
    .select('*')
    .eq('is_active', true)
    .order('sort_order');
  return data || [];
}

async function getPlantTypes() {
  if (!supabase) return [];
  const { data } = await supabase
    .from('plant_types')
    .select('*')
    .eq('is_active', true)
    .order('sort_order');
  return data || [];
}

async function getPlantSizes() {
  if (!supabase) return [];
  const { data } = await supabase
    .from('plant_sizes')
    .select('*')
    .eq('is_active', true)
    .order('sort_order');
  return data || [];
}

async function getPlantLightRequirements() {
  if (!supabase) return [];
  const { data } = await supabase
    .from('plant_light_requirements')
    .select('*')
    .eq('is_active', true)
    .order('sort_order');
  return data || [];
}

async function getPlantCareLevels() {
  if (!supabase) return [];
  const { data } = await supabase
    .from('plant_care_levels')
    .select('*')
    .eq('is_active', true)
    .order('sort_order');
  return data || [];
}

async function getPlantPetSafety() {
  if (!supabase) return [];
  const { data } = await supabase
    .from('plant_pet_safety')
    .select('*')
    .eq('is_active', true)
    .order('sort_order');
  return data || [];
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // Parse filters from search params
  const filters: FilterParams = {
    category: searchParams.category as string,
    productType: searchParams.type as string,
    color: searchParams.color as string,
    shape: searchParams.shape as string,
    space: searchParams.space as string,
    plantType: searchParams.plantType as string,
    plantSize: searchParams.plantSize as string,
    plantLight: searchParams.plantLight as string,
    plantCare: searchParams.plantCare as string,
    plantPetSafety: searchParams.plantPetSafety as string,
  };

  const products = await getProducts(filters);
  const categories = await getCategories();
  const productTypes = await getProductTypes();
  const colors = await getColors();
  const shapes = await getShapes();
  const spaces = await getSpaces();
  const plantTypes = await getPlantTypes();
  const plantSizes = await getPlantSizes();
  const plantLightRequirements = await getPlantLightRequirements();
  const plantCareLevels = await getPlantCareLevels();
  const plantPetSafety = await getPlantPetSafety();

  return (
    <>
      <Header />

      <div className="min-h-screen bg-cream">
        {/* Page Header */}
        <div className="relative text-white py-20 overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=1920&q=80"
              alt="Beautiful rug store"
              className="w-full h-full object-cover"
            />
            {/* Dark gradient overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary-900/90 via-primary-800/85 to-terracotta/90"></div>
          </div>

          {/* Decorative background elements */}
          <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-terracotta/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-10">
            <svg className="w-[600px] h-[600px]" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
              <path fill="currentColor" d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,79.6,-45.8C87.4,-32.6,90,-16.3,88.5,-0.9C87,14.6,81.4,29.2,73.1,42.2C64.8,55.2,53.8,66.6,40.3,74.1C26.8,81.6,10.8,85.2,-4.9,83.9C-20.6,82.6,-36,76.4,-48.9,67.4C-61.8,58.4,-72.2,46.6,-78.1,33C-84,19.4,-85.4,3.9,-82.7,-10.3C-80,-24.5,-73.2,-37.4,-64.1,-48.6C-55,-59.8,-43.6,-69.3,-30.8,-77C-18,-84.7,-3.8,-90.6,9.2,-87.8C22.2,-85,30.6,-83.6,44.7,-76.4Z" transform="translate(100 100)" />
            </svg>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-block mb-6">
                <span className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold border border-white/30">
                  ✨ מוצרים איכותיים במחירים משתלמים
                </span>
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight">
                הקולקציה שלנו
              </h1>
              <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed">
                גלו את המוצרים שלנו
              </p>
              <div className="flex items-center justify-center gap-3 text-sm text-white/80">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>משלוח חינם מעל ₪500</span>
                </div>
                <span className="text-white/40">•</span>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>החזרה בחינם</span>
                </div>
                <span className="text-white/40">•</span>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>אחריות מלאה</span>
                </div>
              </div>
            </div>
          </div>

          {/* Wavy Bottom Border */}
          <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none rotate-180">
            <svg className="relative block w-full h-[60px]" viewBox="0 0 1200 120" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="fill-cream"></path>
            </svg>
          </div>
        </div>

        {/* Breadcrumbs */}
        <Breadcrumbs items={[{ label: 'מוצרים' }]} />

        {/* Products Grid with Client Interaction */}
        <ProductsPageClient
          products={products}
          categories={categories}
          productTypes={productTypes}
          colors={colors}
          shapes={shapes}
          spaces={spaces}
          plantTypes={plantTypes}
          plantSizes={plantSizes}
          plantLightRequirements={plantLightRequirements}
          plantCareLevels={plantCareLevels}
          plantPetSafety={plantPetSafety}
          filters={filters}
        />
      </div>

      <Footer />
    </>
  );
}
