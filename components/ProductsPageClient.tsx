'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaEye, FaFilter, FaTimes } from 'react-icons/fa';
import ProductFilters from './ProductFilters';

type Product = any; // Type from parent

type ProductsPageClientProps = {
  products: Product[];
  categories: any[];
  productTypes: any[];
  colors: any[];
  shapes: any[];
  spaces: any[];
  plantTypes: any[];
  plantSizes: any[];
  filters: {
    category?: string;
    productType?: string;
    color?: string;
    shape?: string;
    space?: string;
    plantType?: string;
    plantSize?: string;
    search?: string;
  };
  search?: string;
};

export default function ProductsPageClient({
  products,
  categories,
  productTypes,
  colors,
  shapes,
  spaces,
  plantTypes,
  plantSizes,
  filters,
  search,
}: ProductsPageClientProps) {
  const router = useRouter();
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  // Count active filters
  const activeFiltersCount = Object.values(filters).filter(Boolean).length;

  return (
    <>
      {/* Filters Panel - productTypes not used directly here but passed for filters */}
      <ProductFilters
        categories={categories}
        colors={colors}
        shapes={shapes}
        spaces={spaces}
        plantTypes={plantTypes}
        plantSizes={plantSizes}
        filters={filters}
        productsCount={products.length}
        isOpen={isFiltersOpen}
        onClose={() => setIsFiltersOpen(false)}
      />

      <div className="container mx-auto px-4 py-12">
        {/* Search Banner */}
        {search && (
          <div className="flex items-center justify-between bg-primary-50 border border-primary-200 rounded-lg px-4 py-3 mb-6">
            <span className="text-gray-700">
              תוצאות חיפוש עבור <strong>&quot;{search}&quot;</strong>
            </span>
            <button
              onClick={() => router.push('/products')}
              className="flex items-center gap-1 text-gray-500 hover:text-gray-700 transition-colors"
              aria-label="נקה חיפוש"
            >
              <FaTimes />
            </button>
          </div>
        )}

        {/* Filter Button & Results Count */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            {/* Filters Button */}
            <button
              onClick={() => setIsFiltersOpen(true)}
              className="flex items-center gap-2 px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold shadow-md hover:shadow-lg"
            >
              <FaFilter className="text-lg" />
              <span>סינון</span>
              {activeFiltersCount > 0 && (
                <span className="bg-white text-primary-600 px-2 py-0.5 rounded-full text-xs font-bold">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {/* Clear Filters */}
            {activeFiltersCount > 0 && (
              <Link
                href="/products"
                className="text-sm text-gray-600 hover:text-primary-600 underline transition-colors"
              >
                נקה סינון
              </Link>
            )}
          </div>

          {/* Results Count */}
          <p className="text-gray-600">
            <span className="font-semibold text-gray-800">{products.length}</span> מוצרים נמצאו
          </p>
        </div>

        {/* Products Grid */}
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
          <ProductSections products={products} />
        )}
      </div>
    </>
  );
}

function ProductSections({ products }: { products: any[] }) {
  const carpetProducts = products.filter(
    (p) => p.product_types?.slug !== 'plants'
  );
  const plantProducts = products.filter(
    (p) => p.product_types?.slug === 'plants'
  );

  return (
    <div className="space-y-12">
      {carpetProducts.length > 0 && (
        <section>
          <h2 className="text-3xl font-bold text-gray-900 mb-6">שטיחים</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {carpetProducts.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {plantProducts.length > 0 && (
        <section>
          <h2 className="text-3xl font-bold text-gray-900 mb-6">עציצים</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {plantProducts.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function ProductCard({ product }: { product: any }) {
  const subtitle =
    product.product_categories?.[0]?.categories?.name
      || product.product_colors?.[0]?.colors?.name
      || product.product_shapes?.[0]?.shapes?.name
      || product.product_spaces?.[0]?.spaces?.name
      || product.product_plant_types?.[0]?.plant_types?.name
      || '';

  const allVariants = product.product_variants || [];
  const totalVariantStock = allVariants.reduce((sum: number, v: any) => sum + (v.stock_quantity || 0), 0);
  const inStock = allVariants.length > 0 ? totalVariantStock > 0 : product.stock_quantity > 0;

  const activeVariants = allVariants.filter((v: any) => v.is_active && v.price > 0);
  const lowestVariantPrice = activeVariants.length > 0
    ? Math.min(...activeVariants.map((v: any) => v.price))
    : null;
  const displayPrice = lowestVariantPrice || product.price;
  const hasMultiplePrices = activeVariants.length > 1 &&
    new Set(activeVariants.map((v: any) => v.price)).size > 1;

  let maxDiscountPct = 0;
  if (product.compare_at_price && product.price && product.compare_at_price > product.price) {
    maxDiscountPct = Math.max(maxDiscountPct, ((product.compare_at_price - product.price) / product.compare_at_price) * 100);
  }
  for (const v of activeVariants) {
    if (v.compare_at_price && v.price && v.compare_at_price > v.price) {
      maxDiscountPct = Math.max(maxDiscountPct, ((v.compare_at_price - v.price) / v.compare_at_price) * 100);
    }
  }
  const maxDiscountPctRounded = Math.round(maxDiscountPct);

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group block bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
    >
      {/* Clean square image */}
      <div className="relative aspect-square bg-gray-50 overflow-hidden">
        {product.product_images && product.product_images.length > 0 ? (
          <img
            src={product.product_images[0].image_url}
            alt={product.product_images[0].alt_text || product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400">
            <svg className="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}

        {product.is_featured && (
          <div className="absolute top-3 left-3 bg-gradient-to-r from-terracotta to-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md">
            מומלץ
          </div>
        )}
        {maxDiscountPctRounded > 0 && (
          <div className="absolute top-3 right-3 bg-black text-white px-3 py-1 rounded-full text-xs font-bold shadow-md">
            עד {maxDiscountPctRounded}% הנחה
          </div>
        )}
        {!inStock && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
            <span className="bg-gray-900/80 text-white px-4 py-1 rounded-full text-sm font-bold">אזל</span>
          </div>
        )}

        {/* Floating "צפה במוצר" pill - slides up from the bottom of the image on hover */}
        <div className="absolute inset-x-0 bottom-3 flex justify-center pointer-events-none opacity-0 translate-y-6 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-out">
          <div className="bg-white/95 backdrop-blur-sm text-charcoal px-5 py-2 rounded-full shadow-lg text-sm font-bold flex items-center gap-2 whitespace-nowrap">
            <FaEye className="text-xs" />
            צפה במוצר
          </div>
        </div>
      </div>

      {/* Text below image */}
      <div className="p-4 text-center">
        <h3 className="font-bold text-base md:text-lg text-charcoal mb-1 line-clamp-1">
          {product.name}
        </h3>
        {subtitle && (
          <p className="text-xs text-gray-500 font-light tracking-wider mb-2 line-clamp-1">
            {subtitle}
          </p>
        )}
        <div className="flex items-baseline justify-center gap-2">
          <span className="font-bold text-base md:text-lg text-charcoal">
            {hasMultiplePrices ? 'החל מ-' : ''}₪{displayPrice.toLocaleString()}
          </span>
          {product.compare_at_price && product.compare_at_price > displayPrice && (
            <span className="text-sm text-gray-400 line-through">
              ₪{product.compare_at_price.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
