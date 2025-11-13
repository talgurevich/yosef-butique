import { supabase } from '@/lib/supabase';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductsPageClient from '@/components/ProductsPageClient';

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

  // Filter by category (junction table)
  let filteredProducts = products;

  if (filters.category) {
    const { data: categoryData } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', filters.category)
      .single();

    if (categoryData) {
      const { data: productCategories } = await supabase
        .from('product_categories')
        .select('product_id')
        .eq('category_id', categoryData.id);

      const productIds = new Set(productCategories?.map(pc => pc.product_id) || []);
      filteredProducts = filteredProducts.filter(p => productIds.has(p.id));
    }
  }

  // Filter by color (junction table)
  if (filters.color) {
    const { data: colorData } = await supabase
      .from('colors')
      .select('id')
      .eq('slug', filters.color)
      .single();

    if (colorData) {
      const { data: productColors } = await supabase
        .from('product_colors')
        .select('product_id')
        .eq('color_id', colorData.id);

      const productIds = new Set(productColors?.map(pc => pc.product_id) || []);
      filteredProducts = filteredProducts.filter(p => productIds.has(p.id));
    }
  }

  // Filter by shape (junction table)
  if (filters.shape) {
    const { data: shapeData } = await supabase
      .from('shapes')
      .select('id')
      .eq('slug', filters.shape)
      .single();

    if (shapeData) {
      const { data: productShapes } = await supabase
        .from('product_shapes')
        .select('product_id')
        .eq('shape_id', shapeData.id);

      const productIds = new Set(productShapes?.map(ps => ps.product_id) || []);
      filteredProducts = filteredProducts.filter(p => productIds.has(p.id));
    }
  }

  // Filter by space (junction table)
  if (filters.space) {
    const { data: spaceData } = await supabase
      .from('spaces')
      .select('id')
      .eq('slug', filters.space)
      .single();

    if (spaceData) {
      const { data: productSpaces } = await supabase
        .from('product_spaces')
        .select('product_id')
        .eq('space_id', spaceData.id);

      const productIds = new Set(productSpaces?.map(ps => ps.product_id) || []);
      filteredProducts = filteredProducts.filter(p => productIds.has(p.id));
    }
  }

  // Filter by plant type (junction table)
  if (filters.plantType) {
    const { data: plantTypeData } = await supabase
      .from('plant_types')
      .select('id')
      .eq('slug', filters.plantType)
      .single();

    if (plantTypeData) {
      const { data: productPlantTypes } = await supabase
        .from('product_plant_types')
        .select('product_id')
        .eq('plant_type_id', plantTypeData.id);

      const productIds = new Set(productPlantTypes?.map(pt => pt.product_id) || []);
      filteredProducts = filteredProducts.filter(p => productIds.has(p.id));
    }
  }

  // Filter by plant size (junction table)
  if (filters.plantSize) {
    const { data: plantSizeData } = await supabase
      .from('plant_sizes')
      .select('id')
      .eq('slug', filters.plantSize)
      .single();

    if (plantSizeData) {
      const { data: productPlantSizes } = await supabase
        .from('product_plant_sizes')
        .select('product_id')
        .eq('plant_size_id', plantSizeData.id);

      const productIds = new Set(productPlantSizes?.map(ps => ps.product_id) || []);
      filteredProducts = filteredProducts.filter(p => productIds.has(p.id));
    }
  }

  // Filter by plant light requirements (junction table)
  if (filters.plantLight) {
    const { data: plantLightData } = await supabase
      .from('plant_light_requirements')
      .select('id')
      .eq('slug', filters.plantLight)
      .single();

    if (plantLightData) {
      const { data: productPlantLights } = await supabase
        .from('product_plant_light_requirements')
        .select('product_id')
        .eq('plant_light_requirement_id', plantLightData.id);

      const productIds = new Set(productPlantLights?.map(pl => pl.product_id) || []);
      filteredProducts = filteredProducts.filter(p => productIds.has(p.id));
    }
  }

  // Filter by plant care level (junction table)
  if (filters.plantCare) {
    const { data: plantCareData } = await supabase
      .from('plant_care_levels')
      .select('id')
      .eq('slug', filters.plantCare)
      .single();

    if (plantCareData) {
      const { data: productPlantCares } = await supabase
        .from('product_plant_care_levels')
        .select('product_id')
        .eq('plant_care_level_id', plantCareData.id);

      const productIds = new Set(productPlantCares?.map(pc => pc.product_id) || []);
      filteredProducts = filteredProducts.filter(p => productIds.has(p.id));
    }
  }

  // Filter by plant pet safety (junction table)
  if (filters.plantPetSafety) {
    const { data: plantPetSafetyData } = await supabase
      .from('plant_pet_safety')
      .select('id')
      .eq('slug', filters.plantPetSafety)
      .single();

    if (plantPetSafetyData) {
      const { data: productPlantPetSafety } = await supabase
        .from('product_plant_pet_safety')
        .select('product_id')
        .eq('plant_pet_safety_id', plantPetSafetyData.id);

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
        <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
              הקולקציה שלנו
            </h1>
            <p className="text-xl text-center text-primary-100">
              גלה את מגוון השטיחים האיכותיים שלנו
            </p>
          </div>
        </div>

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
