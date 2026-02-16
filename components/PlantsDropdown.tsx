'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function PlantsDropdown({ onClose }: { onClose?: () => void }) {
  const [plantTypes, setPlantTypes] = useState<any[]>([]);
  const [plantSizes, setPlantSizes] = useState<any[]>([]);
  const [plantPetSafety, setPlantPetSafety] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    if (!supabase) return;

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

    const { data: plantPetData } = await supabase
      .from('plant_pet_safety')
      .select('*')
      .eq('is_active', true)
      .order('sort_order');
    setPlantPetSafety(plantPetData || []);
  };

  return (
    <div className="absolute top-full left-0 right-0 z-50 bg-white shadow-xl border-t border-gray-200">
      <div className="container mx-auto px-4 py-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 pb-3 border-b border-gray-200">עציצים</h3>

          <div className="grid grid-cols-5 gap-8">
          {/* Plant Types */}
          {plantTypes.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-3">סוג צמח</h4>
              <div className="space-y-2">
                {plantTypes.map((plantType) => (
                  <Link
                    key={plantType.id}
                    href={`/products?type=plants&plantType=${plantType.slug}`}
                    onClick={onClose}
                    className="block px-3 py-2 rounded-lg text-sm hover:bg-green-50 text-gray-700 transition-colors"
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
              <h4 className="text-sm font-semibold text-gray-700 mb-3">גודל</h4>
              <div className="space-y-2">
                {plantSizes.map((size) => (
                  <Link
                    key={size.id}
                    href={`/products?type=plants&plantSize=${size.slug}`}
                    onClick={onClose}
                    className="block px-3 py-2 rounded-lg text-sm hover:bg-green-50 text-gray-700 transition-colors"
                  >
                    {size.name}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Plant Pet Safety */}
          {plantPetSafety.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-3">בטיחות לחיות</h4>
              <div className="space-y-2">
                {plantPetSafety.map((safety) => (
                  <Link
                    key={safety.id}
                    href={`/products?type=plants&plantPetSafety=${safety.slug}`}
                    onClick={onClose}
                    className="block px-3 py-2 rounded-lg text-sm hover:bg-green-50 text-gray-700 transition-colors"
                  >
                    {safety.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        <Link
          href="/products?type=plants"
          onClick={onClose}
          className="mt-6 inline-flex items-center justify-center px-6 py-3 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold transition-colors"
        >
          כל העציצים ←
        </Link>
      </div>
    </div>
  );
}
