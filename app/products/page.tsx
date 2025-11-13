import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { FaShoppingCart, FaEye } from 'react-icons/fa';
import ProductFilters from '@/components/ProductFilters';

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

        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar - Filters */}
            <ProductFilters
              categories={categories}
              colors={colors}
              shapes={shapes}
              spaces={spaces}
              plantTypes={plantTypes}
              plantSizes={plantSizes}
              plantLightRequirements={plantLightRequirements}
              plantCareLevels={plantCareLevels}
              plantPetSafety={plantPetSafety}
              filters={filters}
              productsCount={products.length}
            />

            {/* Products Grid */}
            <div className="flex-1">
              {products.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-12 text-center">
                  <p className="text-gray-600 text-lg mb-4">
                    אין מוצרים זמינים כרגע
                  </p>
                  <p className="text-gray-500">
                    נא לחזור בקרוב לעדכונים חדשים!
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product: any) => (
                    <div
                      key={product.id}
                      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow group"
                    >
                      {/* Product Image */}
                      <div className="relative h-64 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center overflow-hidden">
                        {product.product_images && product.product_images.length > 0 ? (
                          <img
                            src={product.product_images[0].image_url}
                            alt={product.product_images[0].alt_text || product.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        ) : (
                          <div className="text-gray-400 text-6xl">🏠</div>
                        )}
                        {product.is_featured && (
                          <span className="absolute top-4 left-4 bg-terracotta text-white px-3 py-1 rounded-full text-sm font-semibold">
                            מומלץ
                          </span>
                        )}
                        {product.compare_at_price && product.compare_at_price > product.price && (
                          <span className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                            מבצע!
                          </span>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-primary-600 transition-colors">
                          {product.name}
                        </h3>

                        {product.description && (
                          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                            {product.description}
                          </p>
                        )}

                        {/* Material */}
                        {product.material && (
                          <p className="text-gray-500 text-sm mb-2">
                            <strong>חומר:</strong> {product.material}
                          </p>
                        )}

                        {/* Size */}
                        {product.size && (
                          <p className="text-gray-500 text-sm mb-2">
                            <strong>מידה:</strong> {product.size}
                          </p>
                        )}

                        {/* Price */}
                        <div className="flex items-center gap-3 mb-4">
                          {product.compare_at_price && product.compare_at_price > product.price ? (
                            <>
                              <span className="text-2xl font-bold text-terracotta">
                                ₪{product.price.toFixed(2)}
                              </span>
                              <span className="text-lg text-gray-400 line-through">
                                ₪{product.compare_at_price.toFixed(2)}
                              </span>
                            </>
                          ) : (
                            <span className="text-2xl font-bold text-gray-800">
                              ₪{product.price.toFixed(2)}
                            </span>
                          )}
                        </div>

                        {/* Has Variants Indicator */}
                        {product.has_variants && (
                          <p className="text-sm text-primary-600 mb-4">
                            ✓ זמין במספר מידות
                          </p>
                        )}

                        {/* Actions */}
                        <div className="flex gap-2">
                          <Link
                            href={`/product/${product.slug}`}
                            className="flex-1 bg-primary-600 text-white px-4 py-3 rounded-lg hover:bg-primary-700 transition-colors text-center font-semibold flex items-center justify-center gap-2"
                          >
                            <FaEye />
                            צפה במוצר
                          </Link>
                          <button
                            className="bg-terracotta text-white p-3 rounded-lg hover:bg-terracotta-dark transition-colors"
                            title="הוסף לסל"
                          >
                            <FaShoppingCart />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
