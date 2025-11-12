'use client';

import Link from 'next/link';
import { Product } from '@/lib/supabase';

interface MostWantedProps {
  products: Product[];
}

export default function MostWanted({ products }: MostWantedProps) {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            המוצרים המבוקשים ביותר
          </h2>
          <p className="text-gray-600 text-lg">
            הקולקציה הפופולרית ביותר שלנו
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.length > 0 ? (
            products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 text-lg">טוען מוצרים...</p>
            </div>
          )}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/products"
            className="inline-block bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
          >
            צפה בכל המוצרים
          </Link>
        </div>
      </div>
    </section>
  );
}

function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/product/${product.slug}`}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
    >
      <div className="aspect-square bg-gray-200 relative">
        {/* Placeholder for product image */}
        <div className="absolute inset-0 flex items-center justify-center text-gray-400">
          <svg
            className="w-20 h-20"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-800 mb-2 line-clamp-2">
          {product.name}
        </h3>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xl font-bold text-primary-600">
              ₪{product.price.toLocaleString()}
            </span>
            {product.compare_at_price && (
              <span className="text-sm text-gray-500 line-through mr-2">
                ₪{product.compare_at_price.toLocaleString()}
              </span>
            )}
          </div>
          {product.stock_quantity > 0 ? (
            <span className="text-sm text-green-600 font-medium">במלאי</span>
          ) : (
            <span className="text-sm text-red-600 font-medium">אזל מהמלאי</span>
          )}
        </div>
        <button className="mt-4 w-full bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 transition-colors">
          הוסף לסל
        </button>
      </div>
    </Link>
  );
}
