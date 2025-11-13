'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { supabase } from '@/lib/supabase';

export default function ProductsDropdown({ onClose }: { onClose?: () => void }) {
  const [expandedSections, setExpandedSections] = useState<{
    carpets: boolean;
    plants: boolean;
  }>({
    carpets: true,
    plants: false,
  });

  const [categories, setCategories] = useState<any[]>([]);
  const [colors, setColors] = useState<any[]>([]);
  const [shapes, setShapes] = useState<any[]>([]);
  const [spaces, setSpaces] = useState<any[]>([]);
  const [plantTypes, setPlantTypes] = useState<any[]>([]);
  const [plantSizes, setPlantSizes] = useState<any[]>([]);
  const [plantLightRequirements, setPlantLightRequirements] = useState<any[]>([]);
  const [plantCareLevels, setPlantCareLevels] = useState<any[]>([]);
  const [plantPetSafety, setPlantPetSafety] = useState<any[]>([]);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    if (!supabase) return;

    // Fetch categories
    const { data: categoriesData } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order');
    setCategories(categoriesData || []);

    // Fetch carpet dimensions
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

    // Fetch plant dimensions
    const { data: plantTypesData } = await supabase
      .from('plant_types')
      .select('*')
      .eq('is_active', true)
      .order('sort_order');
    setPlantTypes(plantTypesData || []);

    const { data: plantSizesData } = await supabase
      .from('plant_sizes')
      .select('*')
      .eq('is_active', true)
      .order('sort_order');
    setPlantSizes(plantSizesData || []);

    const { data: plantLightData } = await supabase
      .from('plant_light_requirements')
      .select('*')
      .eq('is_active', true)
      .order('sort_order');
    setPlantLightRequirements(plantLightData || []);

    const { data: plantCareData } = await supabase
      .from('plant_care_levels')
      .select('*')
      .eq('is_active', true)
      .order('sort_order');
    setPlantCareLevels(plantCareData || []);

    const { data: plantPetData } = await supabase
      .from('plant_pet_safety')
      .select('*')
      .eq('is_active', true)
      .order('sort_order');
    setPlantPetSafety(plantPetData || []);
  };

  const toggleSection = (section: 'carpets' | 'plants') => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <div className="absolute top-full right-0 mt-2 w-[600px] bg-white rounded-lg shadow-xl border border-gray-200 max-h-[80vh] overflow-y-auto z-50">
      <div className="p-6">
        {/* All Products Link */}
        <Link
          href="/products"
          onClick={onClose}
          className="block px-4 py-3 mb-4 rounded-lg bg-primary-600 text-white text-center hover:bg-primary-700 transition-colors font-semibold"
        >
          כל המוצרים
        </Link>

        <div className="grid grid-cols-2 gap-4">
          {/* Carpets Section */}
          <div className="border border-gray-200 rounded-lg p-4">
            <button
              onClick={() => toggleSection('carpets')}
              className="w-full flex items-center justify-between px-3 py-2 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors mb-3"
            >
              <span className="text-lg font-bold text-gray-800">שטיחים</span>
              {expandedSections.carpets ? (
                <FaChevronUp className="text-primary-600" />
              ) : (
                <FaChevronDown className="text-primary-600" />
              )}
            </button>

            {expandedSections.carpets && (
              <div className="space-y-3">
                {/* Categories */}
                {categories.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold text-gray-600 mb-2 px-2">סגנונות</h4>
                    <div className="space-y-1 max-h-32 overflow-y-auto">
                      {categories
                        .filter(cat => !cat.parent_id)
                        .slice(0, 5)
                        .map((category) => (
                          <Link
                            key={category.id}
                            href={`/products?category=${category.slug}&type=carpets`}
                            onClick={onClose}
                            className="block px-2 py-1.5 rounded text-sm hover:bg-primary-50 text-gray-700 transition-colors"
                          >
                            {category.name}
                          </Link>
                        ))}
                    </div>
                  </div>
                )}

                {/* Colors */}
                {colors.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold text-gray-600 mb-2 px-2">צבעים</h4>
                    <div className="space-y-1 max-h-32 overflow-y-auto">
                      {colors.slice(0, 5).map((color) => (
                        <Link
                          key={color.id}
                          href={`/products?color=${color.slug}&type=carpets`}
                          onClick={onClose}
                          className="block px-2 py-1.5 rounded text-sm hover:bg-primary-50 text-gray-700 transition-colors"
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
                    <h4 className="text-xs font-semibold text-gray-600 mb-2 px-2">צורות</h4>
                    <div className="space-y-1">
                      {shapes.slice(0, 3).map((shape) => (
                        <Link
                          key={shape.id}
                          href={`/products?shape=${shape.slug}&type=carpets`}
                          onClick={onClose}
                          className="block px-2 py-1.5 rounded text-sm hover:bg-primary-50 text-gray-700 transition-colors"
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
                    <h4 className="text-xs font-semibold text-gray-600 mb-2 px-2">חללים</h4>
                    <div className="space-y-1">
                      {spaces.slice(0, 3).map((space) => (
                        <Link
                          key={space.id}
                          href={`/products?space=${space.slug}&type=carpets`}
                          onClick={onClose}
                          className="block px-2 py-1.5 rounded text-sm hover:bg-primary-50 text-gray-700 transition-colors"
                        >
                          {space.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                <Link
                  href="/products?type=carpets"
                  onClick={onClose}
                  className="block px-2 py-2 mt-3 rounded text-sm text-center bg-gray-100 hover:bg-gray-200 text-primary-600 font-semibold transition-colors"
                >
                  כל השטיחים ←
                </Link>
              </div>
            )}
          </div>

          {/* Plants Section */}
          <div className="border border-gray-200 rounded-lg p-4">
            <button
              onClick={() => toggleSection('plants')}
              className="w-full flex items-center justify-between px-3 py-2 bg-green-50 hover:bg-green-100 rounded-lg transition-colors mb-3"
            >
              <span className="text-lg font-bold text-gray-800">עציצים</span>
              {expandedSections.plants ? (
                <FaChevronUp className="text-green-600" />
              ) : (
                <FaChevronDown className="text-green-600" />
              )}
            </button>

            {expandedSections.plants && (
              <div className="space-y-3">
                {/* Plant Types */}
                {plantTypes.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold text-gray-600 mb-2 px-2">סוג צמח</h4>
                    <div className="space-y-1 max-h-32 overflow-y-auto">
                      {plantTypes.slice(0, 5).map((plantType) => (
                        <Link
                          key={plantType.id}
                          href={`/products?type=plants&plantType=${plantType.slug}`}
                          onClick={onClose}
                          className="block px-2 py-1.5 rounded text-sm hover:bg-green-50 text-gray-700 transition-colors"
                        >
                          {plantType.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Plant Sizes */}
                {plantSizes.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold text-gray-600 mb-2 px-2">גודל</h4>
                    <div className="space-y-1">
                      {plantSizes.slice(0, 3).map((size) => (
                        <Link
                          key={size.id}
                          href={`/products?type=plants&plantSize=${size.slug}`}
                          onClick={onClose}
                          className="block px-2 py-1.5 rounded text-sm hover:bg-green-50 text-gray-700 transition-colors"
                        >
                          {size.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Plant Light Requirements */}
                {plantLightRequirements.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold text-gray-600 mb-2 px-2">דרישות אור</h4>
                    <div className="space-y-1">
                      {plantLightRequirements.slice(0, 3).map((light) => (
                        <Link
                          key={light.id}
                          href={`/products?type=plants&plantLight=${light.slug}`}
                          onClick={onClose}
                          className="block px-2 py-1.5 rounded text-sm hover:bg-green-50 text-gray-700 transition-colors"
                        >
                          {light.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Plant Care Levels */}
                {plantCareLevels.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold text-gray-600 mb-2 px-2">רמת טיפול</h4>
                    <div className="space-y-1">
                      {plantCareLevels.slice(0, 3).map((care) => (
                        <Link
                          key={care.id}
                          href={`/products?type=plants&plantCare=${care.slug}`}
                          onClick={onClose}
                          className="block px-2 py-1.5 rounded text-sm hover:bg-green-50 text-gray-700 transition-colors"
                        >
                          {care.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                <Link
                  href="/products?type=plants"
                  onClick={onClose}
                  className="block px-2 py-2 mt-3 rounded text-sm text-center bg-gray-100 hover:bg-gray-200 text-green-600 font-semibold transition-colors"
                >
                  כל העציצים ←
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
