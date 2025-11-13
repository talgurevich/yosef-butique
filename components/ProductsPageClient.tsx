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
            {products.map((product: any) => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow group"
              >
                {/* Product Image */}
                <div className="relative h-64 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center overflow-hidden">
                  {product.product_images && product.product_images.length > 0 ? (
                    <img
                      src={product.product_images[0].image_url}
                      alt={product.product_images[0].alt_text || product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="text-gray-400 text-6xl">🏠</div>
                  )}
                  {product.is_featured && (
                    <span className="absolute top-4 left-4 bg-terracotta text-white px-3 py-1 rounded-full text-sm font-semibold">
                      מומלץ
                    </span>
                  )}
                  {product.compare_at_price && product.compare_at_price > product.price && (
                    <span className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      מבצע!
                    </span>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-primary-600 transition-colors">
                    {product.name}
                  </h3>

                  {product.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {product.description}
                    </p>
                  )}

                  {/* Material */}
                  {product.material && (
                    <p className="text-gray-500 text-sm mb-2">
                      <strong>חומר:</strong> {product.material}
                    </p>
                  )}

                  {/* Size */}
                  {product.size && (
                    <p className="text-gray-500 text-sm mb-2">
                      <strong>מידה:</strong> {product.size}
                    </p>
                  )}

                  {/* Product Attributes */}
                  <div className="mb-3 space-y-1">
                    {/* Categories */}
                    {product.product_categories && product.product_categories.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {product.product_categories.slice(0, 2).map((pc: any) => (
                          <span
                            key={pc.categories.id}
                            className="inline-block px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full"
                          >
                            {pc.categories.name}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Colors */}
                    {product.product_colors && product.product_colors.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {product.product_colors.slice(0, 3).map((pc: any) => (
                          <span
                            key={pc.colors.id}
                            className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                          >
                            {pc.colors.name}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Plant Types */}
                    {product.product_plant_types && product.product_plant_types.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {product.product_plant_types.slice(0, 2).map((pt: any) => (
                          <span
                            key={pt.plant_types.id}
                            className="inline-block px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full"
                          >
                            {pt.plant_types.name}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Plant Sizes */}
                    {product.product_plant_sizes && product.product_plant_sizes.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {product.product_plant_sizes.slice(0, 2).map((ps: any) => (
                          <span
                            key={ps.plant_sizes.id}
                            className="inline-block px-2 py-1 bg-green-50 text-green-600 text-xs rounded-full"
                          >
                            {ps.plant_sizes.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Price */}
                  <div className="mb-4">
                    <div className="flex items-center gap-3">
                      {product.compare_at_price && product.compare_at_price > product.price ? (
                        <>
                          <span className="text-2xl font-bold text-terracotta">
                            ₪{product.price.toFixed(2)}
                          </span>
                          <span className="text-lg text-gray-400 line-through">
                            ₪{product.compare_at_price.toFixed(2)}
                          </span>
                        </>
                      ) : (
                        <span className="text-2xl font-bold text-gray-800">
                          ₪{product.price.toFixed(2)}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">כולל מע״מ</p>
                  </div>

                  {/* Has Variants Indicator */}
                  {product.has_variants && (
                    <p className="text-sm text-primary-600 mb-4">
                      ✓ זמין במספר מידות
                    </p>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Link
                      href={`/product/${product.slug}`}
                      className="flex-1 bg-primary-600 text-white px-4 py-3 rounded-lg hover:bg-primary-700 transition-colors text-center font-semibold flex items-center justify-center gap-2"
                    >
                      <FaEye />
                      צפה במוצר
                    </Link>
                    <button
                      className="bg-terracotta text-white p-3 rounded-lg hover:bg-terracotta-dark transition-colors"
                      title="הוסף לסל"
                    >
                      <FaShoppingCart />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
