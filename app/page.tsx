import Header from '@/components/Header';
import Hero from '@/components/Hero';
import MostWanted from '@/components/MostWanted';
import CustomerGallery from '@/components/CustomerGallery';
import AboutSection from '@/components/AboutSection';
import Footer from '@/components/Footer';
import { supabase, Product } from '@/lib/supabase';

async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_featured', true)
      .eq('is_active', true)
      .limit(8);

    if (error) {
      console.error('Error fetching products:', error);
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

  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <MostWanted products={featuredProducts} />
      <CustomerGallery />
      <AboutSection />
      <Footer />
    </main>
  );
}
