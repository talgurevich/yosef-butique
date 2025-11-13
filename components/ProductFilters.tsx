'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaChevronDown, FaChevronUp, FaTimes } from 'react-icons/fa';

type FilterData = {
  categories: any[];
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
  productsCount: number;
  isOpen: boolean;
  onClose: () => void;
};

export default function ProductFilters({
  categories,
  colors,
  shapes,
  spaces,
  plantTypes,
  plantSizes,
  plantLightRequirements,
  plantCareLevels,
  plantPetSafety,
  filters,
  productsCount,
  isOpen,
  onClose,
}: FilterData) {
  const router = useRouter();

  // Initialize selected filters from URL params
  const [selectedFilters, setSelectedFilters] = useState({
    categories: filters.category ? filters.category.split(',') : [],
    productType: filters.productType || '',
    colors: filters.color ? filters.color.split(',') : [],
    shapes: filters.shape ? filters.shape.split(',') : [],
    spaces: filters.space ? filters.space.split(',') : [],
    plantTypes: filters.plantType ? filters.plantType.split(',') : [],
    plantSizes: filters.plantSize ? filters.plantSize.split(',') : [],
    plantLights: filters.plantLight ? filters.plantLight.split(',') : [],
    plantCares: filters.plantCare ? filters.plantCare.split(',') : [],
    plantPetSafety: filters.plantPetSafety ? filters.plantPetSafety.split(',') : [],
  });

  const [expandedSections, setExpandedSections] = useState<{
    carpets: boolean;
    plants: boolean;
  }>({
    carpets: !filters.productType || filters.productType === 'carpets',
    plants: !filters.productType || filters.productType === 'plants',
  });

  const toggleSection = (section: 'carpets' | 'plants') => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const toggleFilter = (filterType: string, value: string) => {
    setSelectedFilters(prev => {
      const currentValues = prev[filterType as keyof typeof prev] as string[];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];

      return {
        ...prev,
        [filterType]: newValues,
      };
    });
  };

  const applyFilters = () => {
    const params = new URLSearchParams();

    if (selectedFilters.productType) {
      params.set('type', selectedFilters.productType);
    }
    if (selectedFilters.categories.length > 0) {
      params.set('category', selectedFilters.categories.join(','));
    }
    if (selectedFilters.colors.length > 0) {
      params.set('color', selectedFilters.colors.join(','));
    }
    if (selectedFilters.shapes.length > 0) {
      params.set('shape', selectedFilters.shapes.join(','));
    }
    if (selectedFilters.spaces.length > 0) {
      params.set('space', selectedFilters.spaces.join(','));
    }
    if (selectedFilters.plantTypes.length > 0) {
      params.set('plantType', selectedFilters.plantTypes.join(','));
    }
    if (selectedFilters.plantSizes.length > 0) {
      params.set('plantSize', selectedFilters.plantSizes.join(','));
    }
    if (selectedFilters.plantLights.length > 0) {
      params.set('plantLight', selectedFilters.plantLights.join(','));
    }
    if (selectedFilters.plantCares.length > 0) {
      params.set('plantCare', selectedFilters.plantCares.join(','));
    }
    if (selectedFilters.plantPetSafety.length > 0) {
      params.set('plantPetSafety', selectedFilters.plantPetSafety.join(','));
    }

    const queryString = params.toString();
    router.push(`/products${queryString ? `?${queryString}` : ''}`);
    onClose();
  };

  const clearAllFilters = () => {
    setSelectedFilters({
      categories: [],
      productType: '',
      colors: [],
      shapes: [],
      spaces: [],
      plantTypes: [],
      plantSizes: [],
      plantLights: [],
      plantCares: [],
      plantPetSafety: [],
    });
    router.push('/products');
    onClose();
  };

  const hasActiveFilters =
    selectedFilters.categories.length > 0 ||
    selectedFilters.colors.length > 0 ||
    selectedFilters.shapes.length > 0 ||
    selectedFilters.spaces.length > 0 ||
    selectedFilters.plantTypes.length > 0 ||
    selectedFilters.plantSizes.length > 0 ||
    selectedFilters.plantLights.length > 0 ||
    selectedFilters.plantCares.length > 0 ||
    selectedFilters.plantPetSafety.length > 0;

  // Prevent body scroll when panel is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Slide-in Panel */}
      <aside
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-primary-50">
          <h2 className="text-xl font-bold text-gray-800">סינון מוצרים</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-primary-100 rounded-lg transition-colors"
            aria-label="Close filters"
          >
            <FaTimes className="text-xl text-gray-600" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto h-[calc(100vh-180px)]">

        {/* Carpets Section */}
        <div className="mb-4 border-b border-gray-200 pb-4">
          <button
            onClick={() => toggleSection('carpets')}
            className="w-full flex items-center justify-between px-4 py-3 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors"
          >
            <span className="text-lg font-bold text-gray-800">שטיחים</span>
            {expandedSections.carpets ? (
              <FaChevronUp className="text-primary-600" />
            ) : (
              <FaChevronDown className="text-primary-600" />
            )}
          </button>

          {expandedSections.carpets && (
            <div className="mt-3 space-y-4">
              {/* Categories */}
              {categories.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2 px-2">סגנונות</h4>
                  <div className="space-y-1">
                    {categories
                      .filter(cat => !cat.parent_id)
                      .map((category) => (
                        <div key={category.id}>
                          <label className="flex items-center px-3 py-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
                            <input
                              type="checkbox"
                              checked={selectedFilters.categories.includes(category.slug)}
                              onChange={() => toggleFilter('categories', category.slug)}
                              className="ml-2 w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                            />
                            <span className="text-sm text-gray-700">{category.name}</span>
                          </label>
                          {/* Subcategories */}
                          {categories
                            .filter(subcat => subcat.parent_id === category.id)
                            .length > 0 && (
                            <div className="mr-6 mt-1 space-y-1">
                              {categories
                                .filter(subcat => subcat.parent_id === category.id)
                                .map((subcategory) => (
                                  <label
                                    key={subcategory.id}
                                    className="flex items-center px-3 py-1.5 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                                  >
                                    <input
                                      type="checkbox"
                                      checked={selectedFilters.categories.includes(subcategory.slug)}
                                      onChange={() => toggleFilter('categories', subcategory.slug)}
                                      className="ml-2 w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                                    />
                                    <span className="text-xs text-gray-600">↳ {subcategory.name}</span>
                                  </label>
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
                  <h4 className="text-sm font-semibold text-gray-700 mb-2 px-2">צבעים</h4>
                  <div className="space-y-1">
                    {colors.map((color) => (
                      <label
                        key={color.id}
                        className="flex items-center px-3 py-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={selectedFilters.colors.includes(color.slug)}
                          onChange={() => toggleFilter('colors', color.slug)}
                          className="ml-2 w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                        />
                        <span className="text-sm text-gray-700">{color.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Shapes */}
              {shapes.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2 px-2">צורות</h4>
                  <div className="space-y-1">
                    {shapes.map((shape) => (
                      <label
                        key={shape.id}
                        className="flex items-center px-3 py-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={selectedFilters.shapes.includes(shape.slug)}
                          onChange={() => toggleFilter('shapes', shape.slug)}
                          className="ml-2 w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                        />
                        <span className="text-sm text-gray-700">{shape.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Spaces */}
              {spaces.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2 px-2">חללים</h4>
                  <div className="space-y-1">
                    {spaces.map((space) => (
                      <label
                        key={space.id}
                        className="flex items-center px-3 py-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={selectedFilters.spaces.includes(space.slug)}
                          onChange={() => toggleFilter('spaces', space.slug)}
                          className="ml-2 w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                        />
                        <span className="text-sm text-gray-700">{space.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Plants Section */}
        <div className="mb-4">
          <button
            onClick={() => toggleSection('plants')}
            className="w-full flex items-center justify-between px-4 py-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
          >
            <span className="text-lg font-bold text-gray-800">עציצים</span>
            {expandedSections.plants ? (
              <FaChevronUp className="text-green-600" />
            ) : (
              <FaChevronDown className="text-green-600" />
            )}
          </button>

          {expandedSections.plants && (
            <div className="mt-3 space-y-4">
              {/* Plant Types */}
              {plantTypes.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2 px-2">סוג צמח</h4>
                  <div className="space-y-1">
                    {plantTypes.map((plantType) => (
                      <label
                        key={plantType.id}
                        className="flex items-center px-3 py-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={selectedFilters.plantTypes.includes(plantType.slug)}
                          onChange={() => toggleFilter('plantTypes', plantType.slug)}
                          className="ml-2 w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                        />
                        <span className="text-sm text-gray-700">{plantType.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Plant Sizes */}
              {plantSizes.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2 px-2">גודל</h4>
                  <div className="space-y-1">
                    {plantSizes.map((size) => (
                      <label
                        key={size.id}
                        className="flex items-center px-3 py-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={selectedFilters.plantSizes.includes(size.slug)}
                          onChange={() => toggleFilter('plantSizes', size.slug)}
                          className="ml-2 w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                        />
                        <span className="text-sm text-gray-700">{size.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Plant Light Requirements */}
              {plantLightRequirements.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2 px-2">דרישות אור</h4>
                  <div className="space-y-1">
                    {plantLightRequirements.map((light) => (
                      <label
                        key={light.id}
                        className="flex items-center px-3 py-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={selectedFilters.plantLights.includes(light.slug)}
                          onChange={() => toggleFilter('plantLights', light.slug)}
                          className="ml-2 w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                        />
                        <span className="text-sm text-gray-700">{light.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Plant Care Levels */}
              {plantCareLevels.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2 px-2">רמת טיפול</h4>
                  <div className="space-y-1">
                    {plantCareLevels.map((care) => (
                      <label
                        key={care.id}
                        className="flex items-center px-3 py-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={selectedFilters.plantCares.includes(care.slug)}
                          onChange={() => toggleFilter('plantCares', care.slug)}
                          className="ml-2 w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                        />
                        <span className="text-sm text-gray-700">{care.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Plant Pet Safety */}
              {plantPetSafety.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2 px-2">בטיחות לחיות</h4>
                  <div className="space-y-1">
                    {plantPetSafety.map((safety) => (
                      <label
                        key={safety.id}
                        className="flex items-center px-3 py-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={selectedFilters.plantPetSafety.includes(safety.slug)}
                          onChange={() => toggleFilter('plantPetSafety', safety.slug)}
                          className="ml-2 w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                        />
                        <span className="text-sm text-gray-700">{safety.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        </div>

        {/* Footer - Action Buttons */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t border-gray-200 space-y-3">
          <button
            onClick={applyFilters}
            className="w-full bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors font-semibold shadow-md"
          >
            הצג תוצאות ({productsCount})
          </button>
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="w-full bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              נקה הכל
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
