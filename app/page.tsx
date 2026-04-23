import Banner from '@/components/Banner';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import TrustBar from '@/components/TrustBar';
import MostWanted from '@/components/MostWanted';
import AttributesPreview from '@/components/AttributesPreview';
import CustomerGallery from '@/components/CustomerGallery';
import AboutSection from '@/components/AboutSection';
import Reviews from '@/components/Reviews';
import Footer from '@/components/Footer';
import { supabase, Product } from '@/lib/supabase';

// Revalidate every 60 seconds
export const revalidate = 60;

async function getAllProducts(): Promise<any[]> {
  if (!supabase) return [];

  try {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        product_images (
          id,
          image_url,
          alt_text,
          sort_order
        ),
        product_categories (
          categories (
            id,
            name
          )
        ),
        product_colors (
          colors (
            id,
            name
          )
        ),
        product_shapes (
          shapes (
            id,
            name,
            image_url
          )
        ),
        product_spaces (
          spaces (
            id,
            name
          )
        ),
        product_variants (
          id,
          price,
          compare_at_price,
          stock_quantity,
          is_active
        ),
        product_types (
          slug
        ),
        product_plant_types (
          plant_types (
            id,
            name
          )
        )
      `)
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('Error fetching all products:', error);
      return [];
    }

    return data?.map(product => ({
      ...product,
      product_images: product.product_images?.sort((a: any, b: any) => a.sort_order - b.sort_order) || []
    })) || [];
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
}

async function getCategories(): Promise<any[]> {
  if (!supabase) return [];
  try {
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
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
}

async function getSpaces(): Promise<any[]> {
  if (!supabase) return [];
  try {
    const { data, error } = await supabase
      .from('spaces')
      .select('*')
      .eq('is_active', true)
      .order('sort_order');
    if (error) {
      console.error('Error fetching spaces:', error);
      return [];
    }
    return data || [];
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
}

async function getCategoryImages(): Promise<Record<string, string>> {
  if (!supabase) return {};
  try {
    const { data, error } = await supabase
      .from('product_categories')
      .select(`
        category_id,
        products!inner (
          is_active,
          product_images (
            image_url,
            sort_order
          )
        )
      `)
      .eq('products.is_active', true);
    if (error) {
      console.error('Error fetching category images:', error);
      return {};
    }
    const imageMap: Record<string, string> = {};
    (data || []).forEach((row: any) => {
      if (imageMap[row.category_id]) return;
      const images = row.products?.product_images?.sort((a: any, b: any) => a.sort_order - b.sort_order) || [];
      if (images.length > 0) {
        imageMap[row.category_id] = images[0].image_url;
      }
    });
    return imageMap;
  } catch (error) {
    console.error('Error:', error);
    return {};
  }
}

async function getShapes(): Promise<any[]> {
  if (!supabase) return [];
  try {
    const { data, error } = await supabase
      .from('shapes')
      .select('*')
      .eq('is_active', true)
      .order('sort_order');
    if (error) {
      console.error('Error fetching shapes:', error);
      return [];
    }
    return data || [];
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
}

async function getShapeImages(): Promise<Record<string, string>> {
  if (!supabase) return {};
  try {
    const { data, error } = await supabase
      .from('product_shapes')
      .select(`
        shape_id,
        products!inner (
          is_active,
          product_images (
            image_url,
            sort_order
          )
        )
      `)
      .eq('products.is_active', true);
    if (error) {
      console.error('Error fetching shape images:', error);
      return {};
    }
    const imageMap: Record<string, string> = {};
    (data || []).forEach((row: any) => {
      if (imageMap[row.shape_id]) return;
      const images = row.products?.product_images?.sort((a: any, b: any) => a.sort_order - b.sort_order) || [];
      if (images.length > 0) {
        imageMap[row.shape_id] = images[0].image_url;
      }
    });
    return imageMap;
  } catch (error) {
    console.error('Error:', error);
    return {};
  }
}

async function getSpaceImages(): Promise<Record<string, string>> {
  if (!supabase) return {};
  try {
    const { data, error } = await supabase
      .from('product_spaces')
      .select(`
        space_id,
        products!inner (
          is_active,
          product_images (
            image_url,
            sort_order
          )
        )
      `)
      .eq('products.is_active', true);
    if (error) {
      console.error('Error fetching space images:', error);
      return {};
    }
    const imageMap: Record<string, string> = {};
    (data || []).forEach((row: any) => {
      if (imageMap[row.space_id]) return;
      const images = row.products?.product_images?.sort((a: any, b: any) => a.sort_order - b.sort_order) || [];
      if (images.length > 0) {
        imageMap[row.space_id] = images[0].image_url;
      }
    });
    return imageMap;
  } catch (error) {
    console.error('Error:', error);
    return {};
  }
}

export default async function Home() {
  const [allProducts, categories, spaces, shapes, categoryImages, spaceImages, shapeImages] = await Promise.all([
    getAllProducts(),
    getCategories(),
    getSpaces(),
    getShapes(),
    getCategoryImages(),
    getSpaceImages(),
    getShapeImages(),
  ]);

  const allCarpets = allProducts.filter(
    (p) => p.product_types?.slug !== 'plants'
  );
  const allPlants = allProducts.filter(
    (p) => p.product_types?.slug === 'plants'
  );
  const saleProducts = allProducts.filter((p: any) => {
    if (p.compare_at_price && p.price && p.compare_at_price > p.price) return true;
    const variants = p.product_variants || [];
    return variants.some(
      (v: any) => v.is_active && v.compare_at_price && v.price && v.compare_at_price > v.price
    );
  });

  return (
    <main className="min-h-screen">
      <Banner />
      <Header />
      <Hero />
      <TrustBar />
      {saleProducts.length > 0 && (
        <MostWanted
          products={saleProducts}
          title="מבצעים"
          subtitle="מוצרים נבחרים במחירי מבצע - במלאי מוגבל"
          ctaLabel="צפה בכל המבצעים"
          ctaHref="/sale"
        />
      )}
      <MostWanted
        products={allCarpets}
        title="השטיחים שלנו"
        subtitle="מבחר שטיחים איכותיים לכל חדר בבית"
        ctaLabel="צפה בכל השטיחים"
        ctaHref="/products?type=carpets"
      />
      <AttributesPreview
        categories={categories}
        spaces={spaces}
        shapes={shapes}
        categoryImages={categoryImages}
        spaceImages={spaceImages}
        shapeImages={shapeImages}
      />
      {allPlants.length > 0 && (
        <MostWanted
          products={allPlants}
          title="העציצים שלנו"
          subtitle="עציצים מעוצבים לכל פינה בבית"
          ctaLabel="צפה בכל העציצים"
          ctaHref="/products?type=plants"
        />
      )}
      <AboutSection />
      <Reviews />
      <CustomerGallery />
      <Footer />
    </main>
  );
}
