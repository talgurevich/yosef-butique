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

async function getFeaturedProducts(): Promise<any[]> {
  // Return empty array during build if Supabase is not configured
  if (!supabase) {
    console.log('Supabase not configured, returning empty products');
    return [];
  }

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
            name
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
        )
      `)
      .eq('is_featured', true)
      .eq('is_active', true)
      .limit(8);

    if (error) {
      console.error('Error fetching products:', error);
      return [];
    }

    // Sort images by sort_order
    const productsWithSortedImages = data?.map(product => ({
      ...product,
      product_images: product.product_images?.sort((a: any, b: any) => a.sort_order - b.sort_order) || []
    }));

    return productsWithSortedImages || [];
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
  const [featuredProducts, categories, spaces, categoryImages, spaceImages] = await Promise.all([
    getFeaturedProducts(),
    getCategories(),
    getSpaces(),
    getCategoryImages(),
    getSpaceImages(),
  ]);

  return (
    <main className="min-h-screen">
      <Banner />
      <Header />
      <Hero />
      <TrustBar />
      <MostWanted products={featuredProducts} />
      <AttributesPreview
        categories={categories}
        spaces={spaces}
        categoryImages={categoryImages}
        spaceImages={spaceImages}
      />
      <AboutSection />
      <Reviews />
      <CustomerGallery />
      <Footer />
    </main>
  );
}
