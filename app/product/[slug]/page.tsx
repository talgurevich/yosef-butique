import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import ProductPageClient from '@/components/ProductPageClient';

export const revalidate = 60;

async function getProduct(slug: string) {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      product_types (
        id,
        name,
        slug
      )
    `)
    .eq('slug', slug)
    .eq('is_active', true)
    .single();

  if (error || !data) return null;
  return data;
}

async function getProductImages(productId: string) {
  if (!supabase) return [];
  const { data } = await supabase
    .from('product_images')
    .select('*')
    .eq('product_id', productId)
    .order('sort_order');
  return data || [];
}

async function getProductVariants(productId: string) {
  if (!supabase) return [];
  const { data } = await supabase
    .from('product_variants')
    .select(`*, colors (id, name, slug)`)
    .eq('product_id', productId)
    .eq('is_active', true)
    .order('sort_order');
  return data || [];
}

async function getProductCategories(productId: string) {
  if (!supabase) return [];
  const { data } = await supabase
    .from('product_categories')
    .select('categories (*)')
    .eq('product_id', productId);
  return data?.map((pc: any) => pc.categories) || [];
}

async function getProductColors(productId: string) {
  if (!supabase) return [];
  const { data } = await supabase
    .from('product_colors')
    .select('colors (*)')
    .eq('product_id', productId);
  return data?.map((pc: any) => pc.colors) || [];
}

async function getProductShapes(productId: string) {
  if (!supabase) return [];
  const { data } = await supabase
    .from('product_shapes')
    .select('shapes (*)')
    .eq('product_id', productId);
  return data?.map((ps: any) => ps.shapes) || [];
}

async function getProductSpaces(productId: string) {
  if (!supabase) return [];
  const { data } = await supabase
    .from('product_spaces')
    .select('spaces (*)')
    .eq('product_id', productId);
  return data?.map((ps: any) => ps.spaces) || [];
}

async function getProductPlantTypes(productId: string) {
  if (!supabase) return [];
  const { data } = await supabase
    .from('product_plant_types')
    .select('plant_types (*)')
    .eq('product_id', productId);
  return data?.map((pt: any) => pt.plant_types) || [];
}

async function getProductPlantSizes(productId: string) {
  if (!supabase) return [];
  const { data } = await supabase
    .from('product_plant_sizes')
    .select('plant_sizes (*)')
    .eq('product_id', productId);
  return data?.map((ps: any) => ps.plant_sizes) || [];
}

async function getProductPlantPetSafety(productId: string) {
  if (!supabase) return [];
  const { data } = await supabase
    .from('product_plant_pet_safety')
    .select('plant_pet_safety (*)')
    .eq('product_id', productId);
  return data?.map((ps: any) => ps.plant_pet_safety) || [];
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const product = await getProduct(params.slug);

  if (!product) {
    return {
      title: 'מוצר לא נמצא',
    };
  }

  const images = await getProductImages(product.id);
  const imageUrl = images.length > 0 ? images[0].image_url : '/og-image.jpg';
  const title = product.meta_title || `${product.name} | שטיחי בוטיק יוסף`;
  const description = product.meta_description || product.description || `${product.name} - שטיחי בוטיק יוסף. משלוח מהיר לכל הארץ.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: imageUrl, width: 800, height: 800, alt: product.name }],
      type: 'website',
      locale: 'he_IL',
      url: `https://boutique-yossef.co.il/product/${product.slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
    alternates: {
      canonical: `https://boutique-yossef.co.il/product/${product.slug}`,
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = await getProduct(params.slug);

  if (!product) {
    notFound();
  }

  const [
    productImages,
    variants,
    categories,
    colors,
    shapes,
    spaces,
    plantTypes,
    plantSizes,
    plantPetSafety,
  ] = await Promise.all([
    getProductImages(product.id),
    product.has_variants ? getProductVariants(product.id) : Promise.resolve([]),
    getProductCategories(product.id),
    getProductColors(product.id),
    getProductShapes(product.id),
    getProductSpaces(product.id),
    getProductPlantTypes(product.id),
    getProductPlantSizes(product.id),
    getProductPlantPetSafety(product.id),
  ]);

  const productType = product.product_types || null;

  // Calculate price for structured data
  const activeVariants = variants.filter((v: any) => v.is_active && v.price > 0);
  const lowestPrice = activeVariants.length > 0
    ? Math.min(...activeVariants.map((v: any) => v.price))
    : product.price;
  const imageUrl = productImages.length > 0 ? productImages[0].image_url : undefined;

  // Check stock across variants
  const totalVariantStock = variants.reduce((sum: number, v: any) => sum + (v.stock_quantity || 0), 0);
  const inStock = variants.length > 0 ? totalVariantStock > 0 : product.stock_quantity > 0;

  // Product JSON-LD structured data
  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description || `${product.name} - שטיחי בוטיק יוסף`,
    ...(imageUrl && { image: imageUrl }),
    sku: product.sku || product.slug,
    brand: {
      '@type': 'Brand',
      name: 'שטיחי בוטיק יוסף',
    },
    offers: {
      '@type': 'Offer',
      url: `https://boutique-yossef.co.il/product/${product.slug}`,
      priceCurrency: 'ILS',
      price: lowestPrice,
      availability: inStock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: 'שטיחי בוטיק יוסף',
      },
    },
  };

  // BreadcrumbList JSON-LD
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'בית',
        item: 'https://boutique-yossef.co.il',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'מוצרים',
        item: 'https://boutique-yossef.co.il/products',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: product.name,
        item: `https://boutique-yossef.co.il/product/${product.slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <ProductPageClient
        product={product}
        productImages={productImages}
        variants={variants}
        categories={categories}
        colors={colors}
        shapes={shapes}
        spaces={spaces}
        plantTypes={plantTypes}
        plantSizes={plantSizes}
        plantPetSafety={plantPetSafety}
        productType={productType}
      />
    </>
  );
}
