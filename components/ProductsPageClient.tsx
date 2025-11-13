'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FaShoppingCart, FaEye, FaFilter } from 'react-icons/fa';
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
  plantLightRequirements: any[];
  plantCareLevels: any[];
  plantPetSafety: any[];
  filters: {
    category?: string;
    productType?: string;
    color?: string;
    shape?: string;
    space?: string;
    plantType?: string;
    plantSize?: string;
    plantLight?: string;
    plantCare?: string;
    plantPetSafety?: string;
  };
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
  plantLightRequirements,
  plantCareLevels,
  plantPetSafety,
  filters,
}: ProductsPageClientProps) {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  // Count active filters
  const activeFiltersCount = Object.values(filters).filter(Boolean).length;

  return (
    <>
      {/* Filters Panel */}
      <ProductFilters
        categories={categories}
        colors={colors}
        shapes={shapes}
        spaces={spaces}
        plantTypes={plantTypes}
        plantSizes={plantSizes}
        plantLightRequirements={plantLightRequirements}
        plantCareLevels={plantCareLevels}
        plantPetSafety={plantPetSafety}
        filters={filters}
        productsCount={products.length}
        isOpen={isFiltersOpen}
        onClose={() => setIsFiltersOpen(false)}
      />

      <div className="container mx-auto px-4 py-12">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product: any) => {
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
              if (product.product_plant_types && product.product_plant_types.length > 0) {
                attributes.push(...product.product_plant_types.slice(0, 2).map((pt: any) => ({
                  label: pt.plant_types.name,
                  color: 'green'
                })));
              }

              return (
                <Link
                  key={product.id}
                  href={`/product/${product.slug}`}
                  className="group relative rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 h-[450px]"
                >
                  {/* Full Image Background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200">
                    {product.product_images && product.product_images.length > 0 ? (
                      <img
                        src={product.product_images[0].image_url}
                        alt={product.product_images[0].alt_text || product.name}
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
                        {attributes.slice(0, 4).map((attr, i) => (
                          <span
                            key={i}
                            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md shadow-md
                              ${attr.color === 'primary' ? 'bg-primary-500/80 text-white' : ''}
                              ${attr.color === 'gray' ? 'bg-gray-600/80 text-white' : ''}
                              ${attr.color === 'blue' ? 'bg-blue-500/80 text-white' : ''}
                              ${attr.color === 'purple' ? 'bg-purple-500/80 text-white' : ''}
                              ${attr.color === 'green' ? 'bg-green-500/80 text-white' : ''}
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
                    <button className="w-full bg-white/20 backdrop-blur-md text-white py-3 rounded-xl font-bold hover:bg-white/30 transition-all border border-white/30 shadow-lg flex items-center justify-center gap-2">
                      <FaEye />
                      צפה במוצר
                    </button>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
