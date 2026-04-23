import { Metadata } from 'next';
import { supabase } from '@/lib/supabase';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductsPageClient from '@/components/ProductsPageClient';
import Breadcrumbs from '@/components/Breadcrumbs';

// Revalidate every 60 seconds
export const revalidate = 60;

export const metadata: Metadata = {
  title: 'מבצעים | שטיחים ועציצים במחיר מיוחד',
  description: 'כל המוצרים במבצע - שטיחים ועציצים במחירים מיוחדים. קולקציה מיוחדת של מוצרים בהנחה. משלוח מהיר לכל הארץ. שטיחי בוטיק יוסף.',
  alternates: {
    canonical: '/sale',
  },
  openGraph: {
    title: 'מבצעים | שטיחי בוטיק יוסף',
    description: 'כל המוצרים במבצע - שטיחים ועציצים במחירים מיוחדים.',
    type: 'website',
    locale: 'he_IL',
  },
};

type FilterParams = {
  category?: string;
  productType?: string;
  color?: string;
  shape?: string;
  space?: string;
  plantType?: string;
  plantSize?: string;
  search?: string;
};

function isOnSale(product: any): boolean {
  if (product.compare_at_price && product.price && product.compare_at_price > product.price) {
    return true;
  }
  const variants = product.product_variants || [];
  return variants.some(
    (v: any) => v.is_active && v.compare_at_price && v.price && v.compare_at_price > v.price
  );
}

async function getSaleProducts(filters: FilterParams = {}) {
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
          slug,
          image_url
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
      ),
      product_variants (
        id,
        price,
        compare_at_price,
        stock_quantity,
        is_active
      )
    `)
    .eq('is_active', true);

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

  const { data: products, error } = await query.order('sort_order', { ascending: true });

  if (error) {
    console.error('Error fetching sale products:', error);
    return [];
  }

  if (!products) return [];

  let filteredProducts = products.filter(isOnSale);

  if (filters.search) {
    const term = filters.search.toLowerCase();
    filteredProducts = filteredProducts.filter((p: any) => {
      if (p.name?.toLowerCase().includes(term)) return true;
      if (p.description?.toLowerCase().includes(term)) return true;
      if (p.product_types?.name?.toLowerCase().includes(term)) return true;
      if (p.product_categories?.some((pc: any) => pc.categories?.name?.toLowerCase().includes(term))) return true;
      if (p.product_colors?.some((pc: any) => pc.colors?.name?.toLowerCase().includes(term))) return true;
      if (p.product_shapes?.some((ps: any) => ps.shapes?.name?.toLowerCase().includes(term))) return true;
      if (p.product_spaces?.some((ps: any) => ps.spaces?.name?.toLowerCase().includes(term))) return true;
      if (p.product_plant_types?.some((pt: any) => pt.plant_types?.name?.toLowerCase().includes(term))) return true;
      if (p.product_plant_sizes?.some((ps: any) => ps.plant_sizes?.name?.toLowerCase().includes(term))) return true;
      return false;
    });
  }

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

  const productsWithSortedImages = filteredProducts.map(product => ({
    ...product,
    product_images: product.product_images?.sort((a: any, b: any) => a.sort_order - b.sort_order) || []
  }));

  return productsWithSortedImages;
}

async function getCategories() {
  if (!supabase) return [];
  const { data } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('sort_order');
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

export default async function SalePage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const filters: FilterParams = {
    category: searchParams.category as string,
    productType: searchParams.type as string,
    color: searchParams.color as string,
    shape: searchParams.shape as string,
    space: searchParams.space as string,
    plantType: searchParams.plantType as string,
    plantSize: searchParams.plantSize as string,
    search: searchParams.search as string,
  };

  const products = await getSaleProducts(filters);
  const categories = await getCategories();
  const productTypes = await getProductTypes();
  const colors = await getColors();
  const shapes = await getShapes();
  const spaces = await getSpaces();
  const plantTypes = await getPlantTypes();
  const plantSizes = await getPlantSizes();

  return (
    <>
      <Header />

      <div className="min-h-screen bg-cream">
        <div className="relative text-white py-20 overflow-hidden">
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=1920&q=80"
              alt="Sale"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-red-900/90 via-red-800/85 to-terracotta/90"></div>
          </div>

          <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-terracotta/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-block mb-6">
                <span className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold border border-white/30">
                  🔥 מבצעים חמים
                </span>
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight">
                מבצעים
              </h1>
              <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed">
                כל המוצרים במחירי מבצע - במלאי מוגבל
              </p>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none rotate-180">
            <svg className="relative block w-full h-[60px]" viewBox="0 0 1200 120" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="fill-cream"></path>
            </svg>
          </div>
        </div>

        <Breadcrumbs items={[{ label: 'מבצעים' }]} />

        <ProductsPageClient
          products={products}
          categories={categories}
          productTypes={productTypes}
          colors={colors}
          shapes={shapes}
          spaces={spaces}
          plantTypes={plantTypes}
          plantSizes={plantSizes}
          filters={filters}
          search={filters.search}
        />
      </div>

      <Footer />
    </>
  );
}
