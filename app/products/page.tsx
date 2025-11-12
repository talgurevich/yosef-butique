import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductFilters from '@/components/ProductFilters';
import { FaShoppingCart, FaEye } from 'react-icons/fa';

// Revalidate every 60 seconds
export const revalidate = 60;

type SearchParams = {
  type?: string;
  category?: string;
  space?: string;
  shape?: string;
  color?: string;
  plant_type?: string;
  plant_size?: string;
  light?: string;
  care?: string;
  pet_safe?: string;
};

async function getProducts(filters: SearchParams) {
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
      product_types!inner (
        id,
        name,
        slug
      )
    `)
    .eq('is_active', true);

  // Filter by product type
  if (filters.type) {
    query = query.eq('product_types.slug', filters.type);
  }

  // Execute the query
  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }

  // Sort images by sort_order
  let productsWithSortedImages = data?.map((product) => ({
    ...product,
    product_images:
      product.product_images?.sort((a: any, b: any) => a.sort_order - b.sort_order) || [],
  }));

  // Client-side filtering for attributes (we'll need to join these tables in a real implementation)
  // For now, this is a placeholder for the full implementation
  if (filters.space || filters.shape || filters.color || filters.plant_type ||
      filters.plant_size || filters.light || filters.care || filters.pet_safe) {
    // TODO: Implement proper joins with attribute tables
    // This requires querying the junction tables (product_spaces, product_shapes, etc.)
  }

  return productsWithSortedImages || [];
}

async function getFilterOptions(productType: 'carpets' | 'plants' | null) {
  if (!supabase) {
    return {};
  }

  const options: any = {};

  if (productType === 'carpets') {
    // Fetch rug-specific filters
    const [spacesRes, shapesRes, colorsRes] = await Promise.all([
      supabase.from('spaces').select('*').eq('is_active', true).order('sort_order'),
      supabase.from('shapes').select('*').eq('is_active', true).order('sort_order'),
      supabase.from('colors').select('*').eq('is_active', true).order('sort_order'),
    ]);

    options.spaces = spacesRes.data || [];
    options.shapes = shapesRes.data || [];
    options.colors = colorsRes.data || [];
  } else if (productType === 'plants') {
    // Fetch plant-specific filters
    const [typesRes, sizesRes, lightRes, careRes, petSafetyRes] = await Promise.all([
      supabase.from('plant_types').select('*').eq('is_active', true).order('sort_order'),
      supabase.from('plant_sizes').select('*').eq('is_active', true).order('sort_order'),
      supabase
        .from('plant_light_requirements')
        .select('*')
        .eq('is_active', true)
        .order('sort_order'),
      supabase
        .from('plant_care_levels')
        .select('*')
        .eq('is_active', true)
        .order('sort_order'),
      supabase
        .from('plant_pet_safety')
        .select('*')
        .eq('is_active', true)
        .order('sort_order'),
    ]);

    options.plantTypes = typesRes.data || [];
    options.plantSizes = sizesRes.data || [];
    options.plantLightRequirements = lightRes.data || [];
    options.plantCareLevels = careRes.data || [];
    options.plantPetSafety = petSafetyRes.data || [];
  }

  return options;
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const productType = (searchParams.type as 'carpets' | 'plants') || null;
  const products = await getProducts(searchParams);
  const filterOptions = await getFilterOptions(productType);

  // Determine page title based on type
  let pageTitle = 'הקולקציה שלנו';
  let pageSubtitle = 'גלה את מגוון המוצרים האיכותיים שלנו';

  if (productType === 'carpets') {
    pageTitle = 'שטיחים';
    pageSubtitle = 'גלה את מגוון השטיחים האיכותיים שלנו';
  } else if (productType === 'plants') {
    pageTitle = 'צמחים';
    pageSubtitle = 'גלה את מגוון הצמחים והעציצים שלנו';
  }

  return (
    <>
      <Header />

      <div className="min-h-screen bg-cream">
        {/* Page Header */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
              {pageTitle}
            </h1>
            <p className="text-xl text-center text-primary-100">
              {pageSubtitle}
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Filters Sidebar */}
            <ProductFilters
              productType={productType}
              spaces={filterOptions.spaces}
              shapes={filterOptions.shapes}
              colors={filterOptions.colors}
              plantTypes={filterOptions.plantTypes}
              plantSizes={filterOptions.plantSizes}
              plantLightRequirements={filterOptions.plantLightRequirements}
              plantCareLevels={filterOptions.plantCareLevels}
              plantPetSafety={filterOptions.plantPetSafety}
            />

            {/* Products Grid */}
            <div className="flex-1">
              {/* Results Count */}
              <div className="mb-6">
                <p className="text-gray-600">
                  מציג <span className="font-semibold">{products.length}</span> מוצרים
                </p>
              </div>

              {products.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-12 text-center">
                  <p className="text-gray-600 text-lg mb-4">
                    אין מוצרים זמינים כרגע
                  </p>
                  <p className="text-gray-500">
                    נסה לשנות את הסינונים או לחזור בקרוב לעדכונים חדשים!
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
                          <div className="text-gray-400 text-6xl">
                            {productType === 'plants' ? '🌱' : '🏠'}
                          </div>
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
