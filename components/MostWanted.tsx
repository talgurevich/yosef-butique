'use client';

import Link from 'next/link';
import { Product } from '@/lib/supabase';

interface MostWantedProps {
  products: any[];
}

export default function MostWanted({ products }: MostWantedProps) {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary-600 via-terracotta to-primary-800 mb-6">
            המוצרים המבוקשים ביותר
          </h2>
          <p className="text-gray-600 text-xl max-w-2xl mx-auto">
            הקולקציה הפופולרית ביותר שלנו - מוצרים נבחרים באיכות פרימיום
          </p>
          <div className="mt-6 h-1 w-24 bg-gradient-to-r from-terracotta to-primary-600 mx-auto rounded-full"></div>
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

        <div className="text-center mt-16">
          <Link
            href="/products"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white px-10 py-4 rounded-xl font-bold text-lg hover:from-primary-700 hover:to-primary-800 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
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

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
      style={{
        animationDelay: `${index * 100}ms`,
      }}
    >
      <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
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
        {product.is_featured && (
          <div className="absolute top-4 right-4 bg-gradient-to-r from-terracotta to-red-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
            מומלץ
          </div>
        )}
        {product.compare_at_price && product.compare_at_price > product.price && (
          <div className="absolute top-4 left-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
            מבצע!
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      </div>
      <div className="p-6">
        <h3 className="font-bold text-xl text-gray-800 mb-3 line-clamp-2 group-hover:text-primary-600 transition-colors">
          {product.name}
        </h3>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {product.compare_at_price && product.compare_at_price > product.price ? (
              <>
                <span className="text-2xl font-bold text-terracotta">
                  ₪{product.price.toLocaleString()}
                </span>
                <span className="text-sm text-gray-500 line-through">
                  ₪{product.compare_at_price.toLocaleString()}
                </span>
              </>
            ) : (
              <span className="text-2xl font-bold text-gray-800">
                ₪{product.price.toLocaleString()}
              </span>
            )}
          </div>
          {product.stock_quantity > 0 ? (
            <span className="flex items-center gap-1 text-sm text-green-600 font-semibold">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              במלאי
            </span>
          ) : (
            <span className="text-sm text-red-600 font-semibold">אזל</span>
          )}
        </div>
        <button className="w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white py-3 rounded-xl font-bold hover:from-primary-700 hover:to-primary-800 transition-all transform group-hover:scale-105 shadow-md">
          צפה במוצר
        </button>
      </div>
    </Link>
  );
}
