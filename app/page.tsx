import Header from '@/components/Header';
import Hero from '@/components/Hero';
import MostWanted from '@/components/MostWanted';
import CategoriesPreview from '@/components/CategoriesPreview';
import CustomerGallery from '@/components/CustomerGallery';
import AboutSection from '@/components/AboutSection';
import Footer from '@/components/Footer';
import { supabase, Product } from '@/lib/supabase';

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
  if (!supabase) {
    return [];
  }

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

export default async function Home() {
  const featuredProducts = await getFeaturedProducts();
  const categories = await getCategories();

  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <MostWanted products={featuredProducts} />
      <CategoriesPreview categories={categories} />
      <CustomerGallery />
      <AboutSection />
      <Footer />
    </main>
  );
}
