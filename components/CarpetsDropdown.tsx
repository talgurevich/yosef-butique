'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function CarpetsDropdown({ onClose }: { onClose?: () => void }) {
  const [categories, setCategories] = useState<any[]>([]);
  const [colors, setColors] = useState<any[]>([]);
  const [shapes, setShapes] = useState<any[]>([]);
  const [spaces, setSpaces] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    if (!supabase) return;

    const { data: categoriesData } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order');
    setCategories(categoriesData || []);

    const { data: colorsData } = await supabase
      .from('colors')
      .select('*')
      .eq('is_active', true)
      .order('sort_order');
    setColors(colorsData || []);

    const { data: shapesData } = await supabase
      .from('shapes')
      .select('*')
      .eq('is_active', true)
      .order('sort_order');
    setShapes(shapesData || []);

    const { data: spacesData } = await supabase
      .from('spaces')
      .select('*')
      .eq('is_active', true)
      .order('sort_order');
    setSpaces(spacesData || []);
  };

  return (
    <div className="absolute top-full right-0 mt-2 w-[500px] bg-white rounded-lg shadow-xl border border-gray-200 max-h-[70vh] overflow-y-auto z-50">
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4 pb-3 border-b border-gray-200">שטיחים</h3>

        <div className="grid grid-cols-2 gap-4">
          {/* Categories */}
          {categories.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-3">סגנונות</h4>
              <div className="space-y-2">
                {categories
                  .filter(cat => !cat.parent_id)
                  .map((category) => (
                    <div key={category.id}>
                      <Link
                        href={`/products?category=${category.slug}&type=carpets`}
                        onClick={onClose}
                        className="block px-3 py-2 rounded-lg text-sm hover:bg-primary-50 text-gray-700 transition-colors"
                      >
                        {category.name}
                      </Link>
                      {/* Subcategories */}
                      {categories
                        .filter(subcat => subcat.parent_id === category.id)
                        .length > 0 && (
                        <div className="mr-3 mt-1 space-y-1">
                          {categories
                            .filter(subcat => subcat.parent_id === category.id)
                            .map((subcategory) => (
                              <Link
                                key={subcategory.id}
                                href={`/products?category=${subcategory.slug}&type=carpets`}
                                onClick={onClose}
                                className="block px-3 py-1 rounded text-xs hover:bg-primary-50 text-gray-600 transition-colors"
                              >
                                ↳ {subcategory.name}
                              </Link>
                            ))}
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Colors */}
          {colors.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-3">צבעים</h4>
              <div className="space-y-2">
                {colors.map((color) => (
                  <Link
                    key={color.id}
                    href={`/products?color=${color.slug}&type=carpets`}
                    onClick={onClose}
                    className="block px-3 py-2 rounded-lg text-sm hover:bg-primary-50 text-gray-700 transition-colors"
                  >
                    {color.name}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Shapes */}
          {shapes.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-3">צורות</h4>
              <div className="space-y-2">
                {shapes.map((shape) => (
                  <Link
                    key={shape.id}
                    href={`/products?shape=${shape.slug}&type=carpets`}
                    onClick={onClose}
                    className="block px-3 py-2 rounded-lg text-sm hover:bg-primary-50 text-gray-700 transition-colors"
                  >
                    {shape.name}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Spaces */}
          {spaces.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-3">חללים</h4>
              <div className="space-y-2">
                {spaces.map((space) => (
                  <Link
                    key={space.id}
                    href={`/products?space=${space.slug}&type=carpets`}
                    onClick={onClose}
                    className="block px-3 py-2 rounded-lg text-sm hover:bg-primary-50 text-gray-700 transition-colors"
                  >
                    {space.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        <Link
          href="/products?type=carpets"
          onClick={onClose}
          className="block px-4 py-3 mt-6 rounded-lg text-center bg-primary-600 hover:bg-primary-700 text-white font-semibold transition-colors"
        >
          כל השטיחים ←
        </Link>
      </div>
    </div>
  );
}
