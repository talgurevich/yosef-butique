'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
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
        <div className="p-6 overflow-y-auto h-[calc(100%-80px)]">
        {/* All Products Link */}
        <Link
          href="/products"
          className="block px-4 py-2 mb-4 rounded-lg bg-primary-600 text-white text-center hover:bg-primary-700 transition-colors font-semibold"
        >
          כל המוצרים ({productsCount})
        </Link>

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
                  <ul className="space-y-1">
                    {categories
                      .filter(cat => !cat.parent_id)
                      .map((category) => (
                        <li key={category.id}>
                          <Link
                            href={`/products?category=${category.slug}&type=carpets`}
                            className={`block px-3 py-1.5 rounded-lg text-sm transition-colors ${
                              filters.category === category.slug
                                ? 'bg-primary-100 text-primary-700 font-semibold'
                                : 'hover:bg-gray-100 text-gray-700'
                            }`}
                          >
                            {category.name}
                          </Link>
                          {/* Subcategories */}
                          {categories
                            .filter(subcat => subcat.parent_id === category.id)
                            .length > 0 && (
                            <ul className="mr-3 mt-1 space-y-1">
                              {categories
                                .filter(subcat => subcat.parent_id === category.id)
                                .map((subcategory) => (
                                  <li key={subcategory.id}>
                                    <Link
                                      href={`/products?category=${subcategory.slug}&type=carpets`}
                                      className={`block px-3 py-1 rounded-lg text-xs transition-colors ${
                                        filters.category === subcategory.slug
                                          ? 'bg-primary-100 text-primary-700 font-semibold'
                                          : 'hover:bg-gray-100 text-gray-600'
                                      }`}
                                    >
                                      ↳ {subcategory.name}
                                    </Link>
                                  </li>
                                ))}
                            </ul>
                          )}
                        </li>
                      ))}
                  </ul>
                </div>
              )}

              {/* Colors */}
              {colors.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2 px-2">צבעים</h4>
                  <div className="space-y-1">
                    {colors.map((color) => (
                      <Link
                        key={color.id}
                        href={`/products?color=${color.slug}&type=carpets${filters.category ? `&category=${filters.category}` : ''}`}
                        className={`block px-3 py-1.5 rounded-lg text-sm transition-colors ${
                          filters.color === color.slug
                            ? 'bg-primary-100 text-primary-700 font-semibold'
                            : 'hover:bg-gray-100 text-gray-700'
                        }`}
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
                  <h4 className="text-sm font-semibold text-gray-700 mb-2 px-2">צורות</h4>
                  <div className="space-y-1">
                    {shapes.map((shape) => (
                      <Link
                        key={shape.id}
                        href={`/products?shape=${shape.slug}&type=carpets${filters.category ? `&category=${filters.category}` : ''}`}
                        className={`block px-3 py-1.5 rounded-lg text-sm transition-colors ${
                          filters.shape === shape.slug
                            ? 'bg-primary-100 text-primary-700 font-semibold'
                            : 'hover:bg-gray-100 text-gray-700'
                        }`}
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
                  <h4 className="text-sm font-semibold text-gray-700 mb-2 px-2">חללים</h4>
                  <div className="space-y-1">
                    {spaces.map((space) => (
                      <Link
                        key={space.id}
                        href={`/products?space=${space.slug}&type=carpets${filters.category ? `&category=${filters.category}` : ''}`}
                        className={`block px-3 py-1.5 rounded-lg text-sm transition-colors ${
                          filters.space === space.slug
                            ? 'bg-primary-100 text-primary-700 font-semibold'
                            : 'hover:bg-gray-100 text-gray-700'
                        }`}
                      >
                        {space.name}
                      </Link>
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
                      <Link
                        key={plantType.id}
                        href={`/products?type=plants&plantType=${plantType.slug}`}
                        className={`block px-3 py-1.5 rounded-lg text-sm transition-colors ${
                          filters.plantType === plantType.slug
                            ? 'bg-green-100 text-green-700 font-semibold'
                            : 'hover:bg-gray-100 text-gray-700'
                        }`}
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
                  <h4 className="text-sm font-semibold text-gray-700 mb-2 px-2">גודל</h4>
                  <div className="space-y-1">
                    {plantSizes.map((size) => (
                      <Link
                        key={size.id}
                        href={`/products?type=plants&plantSize=${size.slug}${filters.plantType ? `&plantType=${filters.plantType}` : ''}`}
                        className={`block px-3 py-1.5 rounded-lg text-sm transition-colors ${
                          filters.plantSize === size.slug
                            ? 'bg-green-100 text-green-700 font-semibold'
                            : 'hover:bg-gray-100 text-gray-700'
                        }`}
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
                  <h4 className="text-sm font-semibold text-gray-700 mb-2 px-2">דרישות אור</h4>
                  <div className="space-y-1">
                    {plantLightRequirements.map((light) => (
                      <Link
                        key={light.id}
                        href={`/products?type=plants&plantLight=${light.slug}${filters.plantType ? `&plantType=${filters.plantType}` : ''}`}
                        className={`block px-3 py-1.5 rounded-lg text-sm transition-colors ${
                          filters.plantLight === light.slug
                            ? 'bg-green-100 text-green-700 font-semibold'
                            : 'hover:bg-gray-100 text-gray-700'
                        }`}
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
                  <h4 className="text-sm font-semibold text-gray-700 mb-2 px-2">רמת טיפול</h4>
                  <div className="space-y-1">
                    {plantCareLevels.map((care) => (
                      <Link
                        key={care.id}
                        href={`/products?type=plants&plantCare=${care.slug}${filters.plantType ? `&plantType=${filters.plantType}` : ''}`}
                        className={`block px-3 py-1.5 rounded-lg text-sm transition-colors ${
                          filters.plantCare === care.slug
                            ? 'bg-green-100 text-green-700 font-semibold'
                            : 'hover:bg-gray-100 text-gray-700'
                        }`}
                      >
                        {care.name}
                      </Link>
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
                      <Link
                        key={safety.id}
                        href={`/products?type=plants&plantPetSafety=${safety.slug}${filters.plantType ? `&plantType=${filters.plantType}` : ''}`}
                        className={`block px-3 py-1.5 rounded-lg text-sm transition-colors ${
                          filters.plantPetSafety === safety.slug
                            ? 'bg-green-100 text-green-700 font-semibold'
                            : 'hover:bg-gray-100 text-gray-700'
                        }`}
                      >
                        {safety.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        </div>
      </aside>
    </>
  );
}
