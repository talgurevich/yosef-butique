'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaSave, FaArrowRight, FaPlus, FaTrash } from 'react-icons/fa';
import { supabase, ProductVariant, Category, Color, Shape, Space, ProductType, PlantType, PlantSize, PlantLightRequirement, PlantCareLevel, PlantPetSafety } from '@/lib/supabase';

type TempVariant = {
  id: string;
  size: string;
  price: number | string;
  compare_at_price: number | string;
  stock_quantity: number | string;
  sort_order: number;
};

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);
  const [selectedProductType, setSelectedProductType] = useState<string>('');

  // Carpet dimensions
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [colors, setColors] = useState<Color[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [selectedShapes, setSelectedShapes] = useState<string[]>([]);
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [selectedSpaces, setSelectedSpaces] = useState<string[]>([]);

  // Plant dimensions
  const [plantTypes, setPlantTypes] = useState<PlantType[]>([]);
  const [selectedPlantTypes, setSelectedPlantTypes] = useState<string[]>([]);
  const [plantSizes, setPlantSizes] = useState<PlantSize[]>([]);
  const [selectedPlantSizes, setSelectedPlantSizes] = useState<string[]>([]);
  const [plantLightRequirements, setPlantLightRequirements] = useState<PlantLightRequirement[]>([]);
  const [selectedPlantLightRequirements, setSelectedPlantLightRequirements] = useState<string[]>([]);
  const [plantCareLevels, setPlantCareLevels] = useState<PlantCareLevel[]>([]);
  const [selectedPlantCareLevels, setSelectedPlantCareLevels] = useState<string[]>([]);
  const [plantPetSafety, setPlantPetSafety] = useState<PlantPetSafety[]>([]);
  const [selectedPlantPetSafety, setSelectedPlantPetSafety] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    material: '',
    price: '',
    compare_at_price: '',
    stock_quantity: '',
    is_featured: false,
    is_active: true,
  });

  const [variants, setVariants] = useState<TempVariant[]>([
    {
      id: 'temp-1',
      size: '',
      price: '',
      compare_at_price: '',
      stock_quantity: '',
      sort_order: 0,
    },
  ]);

  useEffect(() => {
    fetchProductTypes();
    fetchCategories();
    fetchColors();
    fetchShapes();
    fetchSpaces();
    fetchPlantTypes();
    fetchPlantSizes();
    fetchPlantLightRequirements();
    fetchPlantCareLevels();
    fetchPlantPetSafety();
  }, []);

  const fetchProductTypes = async () => {
    try {
      const { data, error } = await supabase
        .from('product_types')
        .select('*')
        .eq('is_active', true);
      if (error) throw error;
      setProductTypes(data || []);

      // Auto-select carpets by default
      if (data && data.length > 0) {
        const carpetsType = data.find(pt => pt.slug === 'carpets');
        if (carpetsType) setSelectedProductType(carpetsType.id);
      }
    } catch (error: any) {
      console.error('Error fetching product types:', error);
    }
  };

  const fetchPlantTypes = async () => {
    try {
      const { data, error } = await supabase
        .from('plant_types')
        .select('*')
        .eq('is_active', true)
        .order('sort_order');
      if (error) throw error;
      setPlantTypes(data || []);
    } catch (error: any) {
      console.error('Error fetching plant types:', error);
    }
  };

  const fetchPlantSizes = async () => {
    try {
      const { data, error } = await supabase
        .from('plant_sizes')
        .select('*')
        .eq('is_active', true)
        .order('sort_order');
      if (error) throw error;
      setPlantSizes(data || []);
    } catch (error: any) {
      console.error('Error fetching plant sizes:', error);
    }
  };

  const fetchPlantLightRequirements = async () => {
    try {
      const { data, error } = await supabase
        .from('plant_light_requirements')
        .select('*')
        .eq('is_active', true)
        .order('sort_order');
      if (error) throw error;
      setPlantLightRequirements(data || []);
    } catch (error: any) {
      console.error('Error fetching plant light requirements:', error);
    }
  };

  const fetchPlantCareLevels = async () => {
    try {
      const { data, error } = await supabase
        .from('plant_care_levels')
        .select('*')
        .eq('is_active', true)
        .order('sort_order');
      if (error) throw error;
      setPlantCareLevels(data || []);
    } catch (error: any) {
      console.error('Error fetching plant care levels:', error);
    }
  };

  const fetchPlantPetSafety = async () => {
    try {
      const { data, error } = await supabase
        .from('plant_pet_safety')
        .select('*')
        .eq('is_active', true)
        .order('sort_order');
      if (error) throw error;
      setPlantPetSafety(data || []);
    } catch (error: any) {
      console.error('Error fetching plant pet safety:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('sort_order');

      if (error) throw error;
      setCategories(data || []);
    } catch (error: any) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchColors = async () => {
    try {
      const { data, error } = await supabase
        .from('colors')
        .select('*')
        .eq('is_active', true)
        .order('sort_order');

      if (error) throw error;
      setColors(data || []);
    } catch (error: any) {
      console.error('Error fetching colors:', error);
    }
  };

  const fetchShapes = async () => {
    try {
      const { data, error } = await supabase
        .from('shapes')
        .select('*')
        .eq('is_active', true)
        .order('sort_order');

      if (error) throw error;
      setShapes(data || []);
    } catch (error: any) {
      console.error('Error fetching shapes:', error);
    }
  };

  const fetchSpaces = async () => {
    try {
      const { data, error } = await supabase
        .from('spaces')
        .select('*')
        .eq('is_active', true)
        .order('sort_order');

      if (error) throw error;
      setSpaces(data || []);
    } catch (error: any) {
      console.error('Error fetching spaces:', error);
    }
  };

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const toggleColor = (colorId: string) => {
    setSelectedColors((prev) =>
      prev.includes(colorId)
        ? prev.filter((id) => id !== colorId)
        : [...prev, colorId]
    );
  };

  const toggleShape = (shapeId: string) => {
    setSelectedShapes((prev) =>
      prev.includes(shapeId)
        ? prev.filter((id) => id !== shapeId)
        : [...prev, shapeId]
    );
  };

  const toggleSpace = (spaceId: string) => {
    setSelectedSpaces((prev) =>
      prev.includes(spaceId)
        ? prev.filter((id) => id !== spaceId)
        : [...prev, spaceId]
    );
  };

  const togglePlantType = (id: string) => {
    setSelectedPlantTypes(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const togglePlantSize = (id: string) => {
    setSelectedPlantSizes(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const togglePlantLightRequirement = (id: string) => {
    setSelectedPlantLightRequirements(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const togglePlantCareLevel = (id: string) => {
    setSelectedPlantCareLevels(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const togglePlantPetSafety = (id: string) => {
    setSelectedPlantPetSafety(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const addVariant = () => {
    setVariants([
      ...variants,
      {
        id: `temp-${Date.now()}`,
        size: '',
        price: '',
        compare_at_price: '',
        stock_quantity: '',
        sort_order: variants.length,
      },
    ]);
  };

  const updateVariant = (index: number, field: string, value: any) => {
    const updated = [...variants];
    updated[index] = { ...updated[index], [field]: value };
    setVariants(updated);
  };

  const removeVariant = (index: number) => {
    if (variants.length === 1) {
      alert('חייב להיות לפחות מידה אחת');
      return;
    }
    setVariants(variants.filter((_, i) => i !== index));
  };

  const generateSlug = (name: string) => {
    const baseSlug = name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

    // Add timestamp to ensure uniqueness
    const timestamp = Date.now();
    return `${baseSlug}-${timestamp}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const isPlantProduct = productTypes.find(pt => pt.id === selectedProductType)?.slug === 'plants';
      const slug = generateSlug(formData.name);
      const baseSku = `PROD-${Date.now()}`;

      // Validate based on product type
      if (isPlantProduct) {
        // Plants: validate simple price fields
        if (!formData.price || !formData.stock_quantity) {
          alert('נא למלא את המחיר והמלאי');
          setLoading(false);
          return;
        }
      } else {
        // Carpets: validate variants
        const hasEmptyVariant = variants.some(
          (v) => !v.size || !v.price || v.price === '' || !v.stock_quantity
        );

        if (hasEmptyVariant) {
          alert('נא למלא את כל השדות החובה בכל המידות (מידה, מחיר, מלאי)');
          setLoading(false);
          return;
        }
      }

      // 1. Create the product
      const productToInsert = {
        name: formData.name,
        description: formData.description,
        price: isPlantProduct
          ? parseFloat(formData.price.toString())
          : parseFloat(variants[0].price.toString()),
        compare_at_price: isPlantProduct
          ? (formData.compare_at_price ? parseFloat(formData.compare_at_price.toString()) : null)
          : null,
        sku: baseSku,
        size: isPlantProduct ? null : variants[0].size,
        material: formData.material,
        stock_quantity: isPlantProduct
          ? parseInt(formData.stock_quantity.toString())
          : 0,
        is_featured: formData.is_featured,
        is_active: formData.is_active,
        slug,
        style: [],
        color: [],
        has_variants: isPlantProduct ? false : variants.length > 1,
        product_type_id: selectedProductType,
      };

      const { data: productData, error: productError } = await supabase
        .from('products')
        .insert([productToInsert])
        .select()
        .single();

      if (productError) throw productError;

      // 2. Create variants only for carpets
      if (!isPlantProduct) {
        const variantsToInsert = variants.map((variant, index) => ({
          product_id: productData.id,
          size: variant.size,
          sku: `${baseSku}-${index + 1}`,
          price: parseFloat(variant.price.toString()),
          compare_at_price: variant.compare_at_price
            ? parseFloat(variant.compare_at_price.toString())
            : null,
          stock_quantity: parseInt(variant.stock_quantity.toString()),
          is_active: true,
          sort_order: variant.sort_order,
        }));

        const { error: variantsError } = await supabase
          .from('product_variants')
          .insert(variantsToInsert);

        if (variantsError) throw variantsError;
      }

      // 3. Create product-category relationships
      if (selectedCategories.length > 0) {
        const categoryRelations = selectedCategories.map((categoryId) => ({
          product_id: productData.id,
          category_id: categoryId,
        }));

        const { error: categoriesError } = await supabase
          .from('product_categories')
          .insert(categoryRelations);

        if (categoriesError) throw categoriesError;
      }

      // 4. Create product-color relationships
      if (selectedColors.length > 0) {
        const colorRelations = selectedColors.map((colorId) => ({
          product_id: productData.id,
          color_id: colorId,
        }));

        const { error: colorsError } = await supabase
          .from('product_colors')
          .insert(colorRelations);

        if (colorsError) throw colorsError;
      }

      // 5. Create product-shape relationships
      if (selectedShapes.length > 0) {
        const shapeRelations = selectedShapes.map((shapeId) => ({
          product_id: productData.id,
          shape_id: shapeId,
        }));

        const { error: shapesError } = await supabase
          .from('product_shapes')
          .insert(shapeRelations);

        if (shapesError) throw shapesError;
      }

      // 6. Create product-space relationships
      if (selectedSpaces.length > 0) {
        const spaceRelations = selectedSpaces.map((spaceId) => ({
          product_id: productData.id,
          space_id: spaceId,
        }));

        const { error: spacesError } = await supabase
          .from('product_spaces')
          .insert(spaceRelations);

        if (spacesError) throw spacesError;
      }

      // 7. Save plant dimensions (only if product type is plants)
      if (isPlantProduct) {
        // Plant types
        if (selectedPlantTypes.length > 0) {
          const relations = selectedPlantTypes.map(id => ({
            product_id: productData.id,
            plant_type_id: id,
          }));
          const { error } = await supabase.from('product_plant_types').insert(relations);
          if (error) throw error;
        }

        // Plant sizes
        if (selectedPlantSizes.length > 0) {
          const relations = selectedPlantSizes.map(id => ({
            product_id: productData.id,
            plant_size_id: id,
          }));
          const { error } = await supabase.from('product_plant_sizes').insert(relations);
          if (error) throw error;
        }

        // Plant light requirements
        if (selectedPlantLightRequirements.length > 0) {
          const relations = selectedPlantLightRequirements.map(id => ({
            product_id: productData.id,
            plant_light_requirement_id: id,
          }));
          const { error } = await supabase.from('product_plant_light_requirements').insert(relations);
          if (error) throw error;
        }

        // Plant care levels
        if (selectedPlantCareLevels.length > 0) {
          const relations = selectedPlantCareLevels.map(id => ({
            product_id: productData.id,
            plant_care_level_id: id,
          }));
          const { error } = await supabase.from('product_plant_care_levels').insert(relations);
          if (error) throw error;
        }

        // Plant pet safety
        if (selectedPlantPetSafety.length > 0) {
          const relations = selectedPlantPetSafety.map(id => ({
            product_id: productData.id,
            plant_pet_safety_id: id,
          }));
          const { error } = await supabase.from('product_plant_pet_safety').insert(relations);
          if (error) throw error;
        }
      }

      alert('המוצר והמידות נוספו בהצלחה! כעת תוכל להעלות תמונות.');
      router.push(`/admin/products/${productData.id}`);
    } catch (error: any) {
      console.error('Error creating product:', error);
      alert(`שגיאה ביצירת המוצר: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/admin/products"
          className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-4"
        >
          <FaArrowRight className="ml-2" />
          חזרה לרשימת מוצרים
        </Link>
        <h1 className="text-3xl font-bold text-gray-800">הוסף מוצר חדש</h1>
        <p className="text-gray-600 mt-2">מלא את הפרטים להוספת מוצר חדש</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Product Type Selector */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            סוג מוצר <span className="text-red-500">*</span>
          </h2>

          <div className="grid grid-cols-2 gap-4">
            {productTypes.map((type) => (
              <label
                key={type.id}
                className={`flex items-center justify-center p-6 border-2 rounded-lg cursor-pointer transition-colors ${
                  selectedProductType === type.id
                    ? 'border-primary-600 bg-primary-50'
                    : 'border-gray-200 hover:border-primary-300'
                }`}
              >
                <input
                  type="radio"
                  name="product_type"
                  value={type.id}
                  checked={selectedProductType === type.id}
                  onChange={() => setSelectedProductType(type.id)}
                  className="sr-only"
                />
                <span className="text-xl font-bold text-gray-800">{type.name}</span>
              </label>
            ))}
          </div>

          {!selectedProductType && (
            <p className="mt-4 text-red-600 text-sm">נא לבחור סוג מוצר</p>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            פרטי מוצר בסיסיים
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Product Name */}
            <div className="md:col-span-2">
              <label className="block text-gray-700 font-medium mb-2">
                שם המוצר <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="לדוגמה: שטיח מודרני אפור"
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-gray-700 font-medium mb-2">
                תיאור
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="תיאור מפורט של המוצר..."
              />
            </div>

            {/* Material */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                חומר
              </label>
              <input
                type="text"
                name="material"
                value={formData.material}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="לדוגמה: צמר"
              />
            </div>
          </div>
        </div>

        {/* Carpet Dimensions - Only show if carpets product type is selected */}
        {selectedProductType && productTypes.find(pt => pt.id === selectedProductType)?.slug === 'carpets' && (
        <>
        {/* Categories Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            סגנון
          </h2>

          {categories.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-gray-600 mb-2">אין סגנונות זמינים</p>
              <Link
                href="/admin/categories"
                className="text-primary-600 hover:text-primary-700 underline"
              >
                צור סגנון חדש
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {categories.filter(cat => cat.parent_id !== null).map((category) => (
                <label
                  key={category.id}
                  className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                    selectedCategories.includes(category.id)
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-gray-200 hover:border-primary-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category.id)}
                    onChange={() => toggleCategory(category.id)}
                    className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <span className="mr-3 text-gray-700 font-medium">
                    {category.name}
                  </span>
                </label>
              ))}
            </div>
          )}

          <div className="mt-4 p-4 bg-sage-light bg-opacity-20 rounded-lg border border-sage">
            <p className="text-sm text-gray-700">
              <strong>💡 טיפ:</strong> ניתן לבחור מספר סגנונות למוצר אחד.
            </p>
          </div>
        </div>

        {/* Shapes Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            צורה
          </h2>

          {shapes.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-gray-600">אין צורות זמינות</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {shapes.map((shape) => (
                <label
                  key={shape.id}
                  className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                    selectedShapes.includes(shape.id)
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-gray-200 hover:border-primary-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedShapes.includes(shape.id)}
                    onChange={() => toggleShape(shape.id)}
                    className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <span className="mr-3 text-gray-700 font-medium">
                    {shape.name}
                  </span>
                </label>
              ))}
            </div>
          )}

          <div className="mt-4 p-4 bg-sage-light bg-opacity-20 rounded-lg border border-sage">
            <p className="text-sm text-gray-700">
              <strong>💡 טיפ:</strong> ניתן לבחור מספר צורות אם המוצר זמין במספר צורות.
            </p>
          </div>
        </div>

        {/* Colors Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            צבעים
          </h2>

          {colors.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-gray-600">אין צבעים זמינים</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {colors.map((color) => (
                <label
                  key={color.id}
                  className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                    selectedColors.includes(color.id)
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-gray-200 hover:border-primary-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedColors.includes(color.id)}
                    onChange={() => toggleColor(color.id)}
                    className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <span className="mr-3 text-gray-700 font-medium">
                    {color.name}
                  </span>
                </label>
              ))}
            </div>
          )}

          <div className="mt-4 p-4 bg-sage-light bg-opacity-20 rounded-lg border border-sage">
            <p className="text-sm text-gray-700">
              <strong>💡 טיפ:</strong> בחר את כל הצבעים שהמוצר זמין בהם.
            </p>
          </div>
        </div>

        {/* Spaces Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            חלל
          </h2>

          {spaces.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-gray-600">אין חללים זמינים</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {spaces.map((space) => (
                <label
                  key={space.id}
                  className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                    selectedSpaces.includes(space.id)
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-gray-200 hover:border-primary-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedSpaces.includes(space.id)}
                    onChange={() => toggleSpace(space.id)}
                    className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <span className="mr-3 text-gray-700 font-medium">
                    {space.name}
                  </span>
                </label>
              ))}
            </div>
          )}

          <div className="mt-4 p-4 bg-sage-light bg-opacity-20 rounded-lg border border-sage">
            <p className="text-sm text-gray-700">
              <strong>💡 טיפ:</strong> בחר את החללים המתאימים למוצר זה.
            </p>
          </div>
        </div>
        </>
        )}

        {/* Plant Dimensions - Only show if plants product type is selected */}
        {selectedProductType && productTypes.find(pt => pt.id === selectedProductType)?.slug === 'plants' && (
        <>
        {/* Plant Types Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">סוג צמח</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {plantTypes.map((plantType) => (
              <label
                key={plantType.id}
                className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                  selectedPlantTypes.includes(plantType.id)
                    ? 'border-primary-600 bg-primary-50'
                    : 'border-gray-200 hover:border-primary-300'
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedPlantTypes.includes(plantType.id)}
                  onChange={() => togglePlantType(plantType.id)}
                  className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <span className="mr-3 text-gray-700 font-medium">{plantType.name}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Plant Sizes Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">גודל</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {plantSizes.map((plantSize) => (
              <label
                key={plantSize.id}
                className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                  selectedPlantSizes.includes(plantSize.id)
                    ? 'border-primary-600 bg-primary-50'
                    : 'border-gray-200 hover:border-primary-300'
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedPlantSizes.includes(plantSize.id)}
                  onChange={() => togglePlantSize(plantSize.id)}
                  className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <span className="mr-3 text-gray-700 font-medium">{plantSize.name}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Plant Light Requirements Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">דרישות אור</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {plantLightRequirements.map((plantLight) => (
              <label
                key={plantLight.id}
                className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                  selectedPlantLightRequirements.includes(plantLight.id)
                    ? 'border-primary-600 bg-primary-50'
                    : 'border-gray-200 hover:border-primary-300'
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedPlantLightRequirements.includes(plantLight.id)}
                  onChange={() => togglePlantLightRequirement(plantLight.id)}
                  className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <span className="mr-3 text-gray-700 font-medium">{plantLight.name}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Plant Care Levels Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">רמת טיפול</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {plantCareLevels.map((plantCare) => (
              <label
                key={plantCare.id}
                className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                  selectedPlantCareLevels.includes(plantCare.id)
                    ? 'border-primary-600 bg-primary-50'
                    : 'border-gray-200 hover:border-primary-300'
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedPlantCareLevels.includes(plantCare.id)}
                  onChange={() => togglePlantCareLevel(plantCare.id)}
                  className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <span className="mr-3 text-gray-700 font-medium">{plantCare.name}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Plant Pet Safety Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">בטיחות לחיות מחמד</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {plantPetSafety.map((plantPet) => (
              <label
                key={plantPet.id}
                className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                  selectedPlantPetSafety.includes(plantPet.id)
                    ? 'border-primary-600 bg-primary-50'
                    : 'border-gray-200 hover:border-primary-300'
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedPlantPetSafety.includes(plantPet.id)}
                  onChange={() => togglePlantPetSafety(plantPet.id)}
                  className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <span className="mr-3 text-gray-700 font-medium">{plantPet.name}</span>
              </label>
            ))}
          </div>
        </div>
        </>
        )}

        {/* Carpets: Product Variants / Dimensions */}
        {selectedProductType && productTypes.find(pt => pt.id === selectedProductType)?.slug === 'carpets' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                מידות וגדלים <span className="text-red-500">*</span>
              </h2>
              <p className="text-gray-600 text-sm mt-1">
                הוסף את כל המידות הזמינות למוצר זה
              </p>
            </div>
            <button
              type="button"
              onClick={addVariant}
              className="bg-terracotta text-white px-4 py-2 rounded-lg hover:bg-terracotta-dark transition-colors flex items-center gap-2"
            >
              <FaPlus />
              הוסף מידה
            </button>
          </div>

          <div className="space-y-4">
            {variants.map((variant, index) => (
              <div
                key={variant.id}
                className="border border-gray-200 rounded-lg p-4 bg-gray-50"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-700">
                    מידה #{index + 1}
                  </h3>
                  {variants.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeVariant(index)}
                      className="text-red-600 hover:text-red-800 p-1"
                      title="מחק מידה"
                    >
                      <FaTrash />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {/* Size */}
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">
                      מידה <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={variant.size}
                      onChange={(e) =>
                        updateVariant(index, 'size', e.target.value)
                      }
                      placeholder="160×230"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  {/* Price */}
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">
                      מחיר (₪) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={variant.price}
                      onChange={(e) =>
                        updateVariant(index, 'price', e.target.value)
                      }
                      step="0.01"
                      min="0"
                      placeholder="299"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  {/* Compare Price */}
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">
                      מחיר לפני הנחה (₪)
                    </label>
                    <input
                      type="number"
                      value={variant.compare_at_price}
                      onChange={(e) =>
                        updateVariant(index, 'compare_at_price', e.target.value)
                      }
                      step="0.01"
                      min="0"
                      placeholder="399"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  {/* Stock */}
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">
                      מלאי <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={variant.stock_quantity}
                      onChange={(e) =>
                        updateVariant(index, 'stock_quantity', e.target.value)
                      }
                      min="0"
                      placeholder="10"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 p-4 bg-sage-light bg-opacity-20 rounded-lg border border-sage">
            <p className="text-sm text-gray-700">
              <strong>💡 טיפ:</strong> הוסף את כל המידות הזמינות עבור מוצר זה.
              למשל: 160×230, 200×290, 240×340
            </p>
          </div>
        </div>
        )}

        {/* Plants: Simple Pricing */}
        {selectedProductType && productTypes.find(pt => pt.id === selectedProductType)?.slug === 'plants' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            מחיר ומלאי <span className="text-red-500">*</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Price */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                מחיר (₪) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                step="0.01"
                min="0"
                placeholder="299"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            {/* Compare Price */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                מחיר לפני הנחה (₪)
              </label>
              <input
                type="number"
                name="compare_at_price"
                value={formData.compare_at_price}
                onChange={handleChange}
                step="0.01"
                min="0"
                placeholder="399"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            {/* Stock */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                מלאי <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="stock_quantity"
                value={formData.stock_quantity}
                onChange={handleChange}
                min="0"
                placeholder="10"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <div className="mt-4 p-4 bg-sage-light bg-opacity-20 rounded-lg border border-sage">
            <p className="text-sm text-gray-700">
              <strong>💡 טיפ:</strong> הגדלים נקבעים דרך המימד "גודל" שנבחר לעיל.
            </p>
          </div>
        </div>
        )}

        {/* Product Images Note */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-blue-800 mb-3 flex items-center gap-2">
            📷 תמונות מוצר
          </h2>
          <p className="text-blue-700">
            ניתן להעלות תמונות למוצר לאחר יצירתו הראשונית. לאחר שמירת המוצר, תועבר לעמוד העריכה שבו תוכל להעלות מספר תמונות.
          </p>
        </div>

        {/* Settings */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">הגדרות</h2>

          <div className="space-y-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="is_featured"
                checked={formData.is_featured}
                onChange={handleChange}
                className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <span className="mr-3 text-gray-700">
                מוצר מומלץ (יוצג בעמוד הבית)
              </span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                onChange={handleChange}
                className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <span className="mr-3 text-gray-700">
                מוצר פעיל (גלוי באתר)
              </span>
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <Link
            href="/admin/products"
            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            ביטול
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="bg-primary-600 text-white px-8 py-3 rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2 font-semibold disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                שומר...
              </>
            ) : (
              <>
                <FaSave />
                שמור מוצר
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
