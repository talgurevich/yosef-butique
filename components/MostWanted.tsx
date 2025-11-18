'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/lib/supabase';

interface MostWantedProps {
  products: any[];
}

export default function MostWanted({ products }: MostWantedProps) {
  return (
    <section className="section-spacing bg-white pattern-chevron-subtle">
      <div className="container mx-auto px-4">
        <div className="text-center mb-20 animate-fade-in">
          {/* Decorative header */}
          <div className="inline-flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-0.5 bg-gradient-to-r from-transparent to-yellow-600"></div>
            <Image
              src="/logo-icon.png"
              alt=""
              width={40}
              height={40}
              className="w-10 h-10"
            />
            <div className="w-12 h-0.5 bg-gradient-to-l from-transparent to-yellow-600"></div>
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-gray-900 mb-5 font-display tracking-tight">
            המוצרים המבוקשים ביותר
          </h2>
          <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto font-light">
            הקולקציה הפופולרית ביותר שלנו - מוצרים נבחרים
            <span className="font-serif italic"> באיכות פרימיום</span>
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
            href="/products"
            className="btn-primary inline-flex items-center gap-3 shadow-luxury text-lg"
          >
            <span>צפה בכל המוצרים</span>
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

  // Gather product attributes for tags
  const attributes = [];
  if (product.product_categories && product.product_categories.length > 0) {
    attributes.push(...product.product_categories.slice(0, 2).map((pc: any) => ({
      label: pc.categories.name,
      color: 'primary'
    })));
  }
  if (product.product_colors && product.product_colors.length > 0) {
    attributes.push(...product.product_colors.slice(0, 2).map((pc: any) => ({
      label: pc.colors.name,
      color: 'gray'
    })));
  }
  if (product.product_shapes && product.product_shapes.length > 0) {
    attributes.push({
      label: product.product_shapes[0].shapes.name,
      color: 'blue'
    });
  }
  if (product.product_spaces && product.product_spaces.length > 0) {
    attributes.push({
      label: product.product_spaces[0].spaces.name,
      color: 'purple'
    });
  }

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group relative rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 h-[450px]"
      style={{
        animationDelay: `${index * 100}ms`,
      }}
    >
      {/* Full Image Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200">
        {firstImage ? (
          <img
            src={firstImage}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400">
            <svg className="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </div>

      {/* Top Badges */}
      {product.is_featured && (
        <div className="absolute top-4 right-4 bg-gradient-to-r from-terracotta to-red-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg backdrop-blur-sm">
          מומלץ
        </div>
      )}
      {product.compare_at_price && product.compare_at_price > product.price && (
        <div className="absolute top-4 left-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg backdrop-blur-sm">
          מבצע!
        </div>
      )}

      {/* Glassmorphism Info Overlay */}
      <div className="absolute inset-x-0 bottom-0 bg-white/10 backdrop-blur-xl border-t border-white/20 p-6 transform translate-y-0 transition-all duration-300">
        {/* Product Name */}
        <h3 className="font-bold text-xl text-white mb-3 line-clamp-2 drop-shadow-lg">
          {product.name}
        </h3>

        {/* Attribute Tags */}
        {attributes.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {attributes.slice(0, 3).map((attr, i) => (
              <span
                key={i}
                className={`inline-block px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md shadow-md
                  ${attr.color === 'primary' ? 'bg-primary-500/80 text-white' : ''}
                  ${attr.color === 'gray' ? 'bg-gray-600/80 text-white' : ''}
                  ${attr.color === 'blue' ? 'bg-blue-500/80 text-white' : ''}
                  ${attr.color === 'purple' ? 'bg-purple-500/80 text-white' : ''}
                `}
              >
                {attr.label}
              </span>
            ))}
          </div>
        )}

        {/* Price and Stock */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {product.compare_at_price && product.compare_at_price > product.price ? (
              <>
                <span className="text-2xl font-bold text-white drop-shadow-lg">
                  ₪{product.price.toLocaleString()}
                </span>
                <span className="text-sm text-white/70 line-through">
                  ₪{product.compare_at_price.toLocaleString()}
                </span>
              </>
            ) : (
              <span className="text-2xl font-bold text-white drop-shadow-lg">
                ₪{product.price.toLocaleString()}
              </span>
            )}
          </div>
          {product.stock_quantity > 0 ? (
            <span className="flex items-center gap-1 text-sm text-green-300 font-semibold bg-green-500/30 backdrop-blur-sm px-3 py-1 rounded-full">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              במלאי
            </span>
          ) : (
            <span className="text-sm text-red-300 font-semibold bg-red-500/30 backdrop-blur-sm px-3 py-1 rounded-full">אזל</span>
          )}
        </div>

        {/* View Product Button */}
        <button className="w-full bg-white/20 backdrop-blur-md text-white py-3 rounded-xl font-bold hover:bg-white/30 transition-all border border-white/30 shadow-lg">
          צפה במוצר
        </button>
      </div>
    </Link>
  );
}
