'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/lib/supabase';

interface MostWantedProps {
  products: any[];
  title?: string;
  subtitle?: string;
  ctaLabel?: string;
  ctaHref?: string;
}

export default function MostWanted({
  products,
  title = 'המוצרים המבוקשים ביותר',
  subtitle,
  ctaLabel = 'צפה בכל המוצרים',
  ctaHref = '/products',
}: MostWantedProps) {
  const defaultSubtitle = (
    <>
      הקולקציה הפופולרית ביותר שלנו - מוצרים נבחרים
      <span className="font-bold"> באיכות פרימיום</span>
    </>
  );
  return (
    <section className="section-spacing bg-white pattern-chevron-subtle">
      <div className="container mx-auto px-4">
        <div className="text-center mb-20 animate-fade-in">
          {/* Decorative header */}
          <div className="inline-flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-0.5 bg-gradient-to-r from-transparent to-primary-600"></div>
            <Image
              src="/logo-icon.svg"
              alt=""
              width={40}
              height={40}
              className="w-10 h-10"
            />
            <div className="w-12 h-0.5 bg-gradient-to-l from-transparent to-primary-600"></div>
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-gray-900 mb-5 font-display tracking-tight">
            {title}
          </h2>
          <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto font-light">
            {subtitle || defaultSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.length > 0 ? (
            products.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 text-lg">טוען מוצרים...</p>
            </div>
          )}
        </div>

        <div className="text-center mt-20">
          <Link
            href={ctaHref}
            className="btn-primary inline-flex items-center gap-3 shadow-luxury text-lg"
          >
            <span>{ctaLabel}</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}

function ProductCard({ product, index }: { product: any; index: number }) {
  const firstImage = product.product_images && product.product_images.length > 0
    ? product.product_images[0].image_url
    : null;

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
      style={{
        animationDelay: `${index * 100}ms`,
      }}
    >
      {/* Clean square image */}
      <div className="relative aspect-square bg-gray-50 overflow-hidden">
        {firstImage ? (
          <img
            src={firstImage}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400">
            <svg className="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}

        <div className="absolute top-3 right-3 flex flex-col items-end gap-2">
          {maxDiscountPctRounded > 0 && (
            <div className="bg-black text-white px-3 py-1 rounded-full text-xs font-bold shadow-md">
              עד {maxDiscountPctRounded}% הנחה
            </div>
          )}
          {product.is_featured && (
            <div className="bg-black text-white px-3 py-1 rounded-full text-xs font-bold shadow-md">
              מומלץ
            </div>
          )}
        </div>
        {!inStock && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
            <span className="bg-gray-900/80 text-white px-4 py-1 rounded-full text-sm font-bold">אזל</span>
          </div>
        )}

        {/* Floating "צפה במוצר" pill - slides up from the bottom on hover */}
        <div className="absolute inset-x-0 bottom-3 flex justify-center pointer-events-none opacity-0 translate-y-6 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-out">
          <div className="bg-white/95 backdrop-blur-sm text-charcoal px-5 py-2 rounded-full shadow-lg text-sm font-bold whitespace-nowrap">
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
