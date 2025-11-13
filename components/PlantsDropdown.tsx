'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function PlantsDropdown({ onClose }: { onClose?: () => void }) {
  const [plantTypes, setPlantTypes] = useState<any[]>([]);
  const [plantSizes, setPlantSizes] = useState<any[]>([]);
  const [plantLightRequirements, setPlantLightRequirements] = useState<any[]>([]);
  const [plantCareLevels, setPlantCareLevels] = useState<any[]>([]);
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

  return (
    <div className="absolute top-full right-0 pt-2 w-[500px] z-50">
      <div className="bg-white rounded-lg shadow-xl border border-gray-200 max-h-[70vh] overflow-y-auto p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4 pb-3 border-b border-gray-200">עציצים</h3>

        <div className="grid grid-cols-2 gap-4">
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

          {/* Plant Light Requirements */}
          {plantLightRequirements.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-3">דרישות אור</h4>
              <div className="space-y-2">
                {plantLightRequirements.map((light) => (
                  <Link
                    key={light.id}
                    href={`/products?type=plants&plantLight=${light.slug}`}
                    onClick={onClose}
                    className="block px-3 py-2 rounded-lg text-sm hover:bg-green-50 text-gray-700 transition-colors"
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
              <h4 className="text-sm font-semibold text-gray-700 mb-3">רמת טיפול</h4>
              <div className="space-y-2">
                {plantCareLevels.map((care) => (
                  <Link
                    key={care.id}
                    href={`/products?type=plants&plantCare=${care.slug}`}
                    onClick={onClose}
                    className="block px-3 py-2 rounded-lg text-sm hover:bg-green-50 text-gray-700 transition-colors"
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
          className="block px-4 py-3 mt-6 rounded-lg text-center bg-green-600 hover:bg-green-700 text-white font-semibold transition-colors"
        >
          כל העציצים ←
        </Link>
        </div>
      </div>
  );
}
