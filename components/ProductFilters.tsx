'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FaFilter, FaTimes } from 'react-icons/fa';

type FilterOption = {
  id: string;
  name: string;
  slug: string;
  count?: number;
};

type ProductFiltersProps = {
  productType: 'carpets' | 'plants' | null;
  // Rug filters
  spaces?: FilterOption[];
  shapes?: FilterOption[];
  colors?: FilterOption[];

  // Plant filters
  plantTypes?: FilterOption[];
  plantSizes?: FilterOption[];
  plantLightRequirements?: FilterOption[];
  plantCareLevels?: FilterOption[];
  plantPetSafety?: FilterOption[];
};

export default function ProductFilters({
  productType,
  spaces,
  shapes,
  colors,
  plantTypes,
  plantSizes,
  plantLightRequirements,
  plantCareLevels,
  plantPetSafety,
}: ProductFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Get current filter values from URL
  const selectedSpace = searchParams.get('space');
  const selectedShape = searchParams.get('shape');
  const selectedColor = searchParams.get('color');
  const selectedPlantType = searchParams.get('plant_type');
  const selectedPlantSize = searchParams.get('plant_size');
  const selectedLight = searchParams.get('light');
  const selectedCare = searchParams.get('care');
  const selectedPetSafety = searchParams.get('pet_safe');

  const updateFilters = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    router.push(`/products?${params.toString()}`);
  };

  const clearAllFilters = () => {
    const params = new URLSearchParams();
    if (productType) {
      params.set('type', productType);
    }
    router.push(`/products?${params.toString()}`);
  };

  const hasActiveFilters = selectedSpace || selectedShape || selectedColor ||
    selectedPlantType || selectedPlantSize || selectedLight || selectedCare || selectedPetSafety;

  const FilterSection = ({ title, options, selectedValue, paramKey }: {
    title: string;
    options?: FilterOption[];
    selectedValue: string | null;
    paramKey: string;
  }) => {
    if (!options || options.length === 0) return null;

    return (
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-800 mb-3">{title}</h3>
        <div className="space-y-2">
          {options.map((option) => (
            <label
              key={option.id}
              className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
            >
              <input
                type="checkbox"
                checked={selectedValue === option.slug}
                onChange={(e) => {
                  if (e.target.checked) {
                    updateFilters(paramKey, option.slug);
                  } else {
                    updateFilters(paramKey, null);
                  }
                }}
                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <span className="mr-3 text-sm text-gray-700">
                {option.name}
                {option.count !== undefined && (
                  <span className="text-gray-400 mr-1">({option.count})</span>
                )}
              </span>
            </label>
          ))}
        </div>
      </div>
    );
  };

  const FiltersContent = () => (
    <>
      {/* Clear Filters Button */}
      {hasActiveFilters && (
        <div className="mb-6">
          <button
            onClick={clearAllFilters}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-sm font-medium"
          >
            <FaTimes className="text-xs" />
            נקה סינונים
          </button>
        </div>
      )}

      {/* Rug Filters */}
      {productType === 'carpets' && (
        <>
          <FilterSection
            title="חדר"
            options={spaces}
            selectedValue={selectedSpace}
            paramKey="space"
          />
          <FilterSection
            title="צורה"
            options={shapes}
            selectedValue={selectedShape}
            paramKey="shape"
          />
          <FilterSection
            title="צבע"
            options={colors}
            selectedValue={selectedColor}
            paramKey="color"
          />
        </>
      )}

      {/* Plant Filters */}
      {productType === 'plants' && (
        <>
          <FilterSection
            title="סוג צמח"
            options={plantTypes}
            selectedValue={selectedPlantType}
            paramKey="plant_type"
          />
          <FilterSection
            title="גודל"
            options={plantSizes}
            selectedValue={selectedPlantSize}
            paramKey="plant_size"
          />
          <FilterSection
            title="דרישות אור"
            options={plantLightRequirements}
            selectedValue={selectedLight}
            paramKey="light"
          />
          <FilterSection
            title="רמת טיפול"
            options={plantCareLevels}
            selectedValue={selectedCare}
            paramKey="care"
          />
          <FilterSection
            title="בטיחות לחיות מחמד"
            options={plantPetSafety}
            selectedValue={selectedPetSafety}
            paramKey="pet_safe"
          />
        </>
      )}
    </>
  );

  return (
    <>
      {/* Mobile Filter Button */}
      <div className="md:hidden mb-4">
        <button
          onClick={() => setShowMobileFilters(true)}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
        >
          <FaFilter />
          סינון מוצרים
          {hasActiveFilters && (
            <span className="bg-white text-primary-600 px-2 py-0.5 rounded-full text-xs font-bold">
              !
            </span>
          )}
        </button>
      </div>

      {/* Desktop Sidebar Filters */}
      <aside className="hidden md:block w-64 flex-shrink-0">
        <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <FaFilter className="text-primary-600" />
              סינון
            </h2>
          </div>
          <FiltersContent />
        </div>
      </aside>

      {/* Mobile Filter Drawer */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setShowMobileFilters(false)}
          />

          {/* Drawer */}
          <div className="absolute right-0 top-0 bottom-0 w-80 max-w-full bg-white shadow-xl overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <FaFilter className="text-primary-600" />
                  סינון
                </h2>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <FaTimes className="text-gray-600" />
                </button>
              </div>

              <FiltersContent />

              <div className="mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="w-full bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors font-medium"
                >
                  הצג תוצאות
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
