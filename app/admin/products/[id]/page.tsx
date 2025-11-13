'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { FaSave, FaArrowRight, FaPlus, FaTrash } from 'react-icons/fa';
import { supabase, Product, ProductVariant, Category, ProductImage, Color, Shape, Space, ProductType, PlantType, PlantSize, PlantLightRequirement, PlantCareLevel, PlantPetSafety } from '@/lib/supabase';
import ProductImageUpload from '@/components/ProductImageUpload';

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [colors, setColors] = useState<Color[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [selectedShapes, setSelectedShapes] = useState<string[]>([]);
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [selectedSpaces, setSelectedSpaces] = useState<string[]>([]);
  const [productImages, setProductImages] = useState<ProductImage[]>([]);

  const [productTypes, setProductTypes] = useState<ProductType[]>([]);
  const [selectedProductType, setSelectedProductType] = useState<string>('');

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
    has_variants: false,
  });

  useEffect(() => {
    fetchProductTypes();
    fetchProduct();
    fetchVariants();
    fetchCategories();
    fetchProductCategories();
    fetchColors();
    fetchShapes();
    fetchSpaces();
    fetchProductColors();
    fetchProductShapes();
    fetchProductSpaces();
    fetchPlantTypes();
    fetchPlantSizes();
    fetchPlantLightRequirements();
    fetchPlantCareLevels();
    fetchPlantPetSafety();
    fetchProductPlantTypes();
    fetchProductPlantSizes();
    fetchProductPlantLightRequirements();
    fetchProductPlantCareLevels();
    fetchProductPlantPetSafety();
    fetchProductImages();
  }, [productId]);

  const fetchProductTypes = async () => {
    try {
      const { data, error } = await supabase
        .from('product_types')
        .select('*')
        .eq('is_active', true);
      if (error) throw error;
      setProductTypes(data || []);
    } catch (error: any) {
      console.error('Error fetching product types:', error);
    }
  };

  const fetchProduct = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();

      if (error) throw error;

      setProduct(data);
      setSelectedProductType(data.product_type_id || '');
      setFormData({
        name: data.name,
        description: data.description || '',
        material: data.material || '',
        price: data.price?.toString() || '',
        compare_at_price: data.compare_at_price?.toString() || '',
        stock_quantity: data.stock_quantity?.toString() || '',
        is_featured: data.is_featured,
        is_active: data.is_active,
        has_variants: data.has_variants || false,
      });
    } catch (error) {
      console.error('Error fetching product:', error);
      alert('שגיאה בטעינת המוצר');
    } finally {
      setLoading(false);
    }
  };

  const fetchVariants = async () => {
    try {
      const { data, error } = await supabase
        .from('product_variants')
        .select('*')
        .eq('product_id', productId)
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setVariants(data || []);
    } catch (error) {
      console.error('Error fetching variants:', error);
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

  const fetchProductCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('product_categories')
        .select('category_id')
        .eq('product_id', productId);

      if (error) throw error;
      setSelectedCategories(data?.map((pc) => pc.category_id) || []);
    } catch (error: any) {
      console.error('Error fetching product categories:', error);
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

  const fetchProductColors = async () => {
    try {
      const { data, error } = await supabase
        .from('product_colors')
        .select('color_id')
        .eq('product_id', productId);

      if (error) throw error;
      setSelectedColors(data?.map((pc) => pc.color_id) || []);
    } catch (error: any) {
      console.error('Error fetching product colors:', error);
    }
  };

  const fetchProductShapes = async () => {
    try {
      const { data, error } = await supabase
        .from('product_shapes')
        .select('shape_id')
        .eq('product_id', productId);

      if (error) throw error;
      setSelectedShapes(data?.map((ps) => ps.shape_id) || []);
    } catch (error: any) {
      console.error('Error fetching product shapes:', error);
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

  const fetchProductSpaces = async () => {
    try {
      const { data, error } = await supabase
        .from('product_spaces')
        .select('space_id')
        .eq('product_id', productId);

      if (error) throw error;
      setSelectedSpaces(data?.map((ps) => ps.space_id) || []);
    } catch (error: any) {
      console.error('Error fetching product spaces:', error);
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

  const fetchProductPlantTypes = async () => {
    try {
      const { data, error } = await supabase
        .from('product_plant_types')
        .select('plant_type_id')
        .eq('product_id', productId);
      if (error) throw error;
      setSelectedPlantTypes(data?.map((pt) => pt.plant_type_id) || []);
    } catch (error: any) {
      console.error('Error fetching product plant types:', error);
    }
  };

  const fetchProductPlantSizes = async () => {
    try {
      const { data, error } = await supabase
        .from('product_plant_sizes')
        .select('plant_size_id')
        .eq('product_id', productId);
      if (error) throw error;
      setSelectedPlantSizes(data?.map((ps) => ps.plant_size_id) || []);
    } catch (error: any) {
      console.error('Error fetching product plant sizes:', error);
    }
  };

  const fetchProductPlantLightRequirements = async () => {
    try {
      const { data, error } = await supabase
        .from('product_plant_light_requirements')
        .select('plant_light_requirement_id')
        .eq('product_id', productId);
      if (error) throw error;
      setSelectedPlantLightRequirements(data?.map((pl) => pl.plant_light_requirement_id) || []);
    } catch (error: any) {
      console.error('Error fetching product plant light requirements:', error);
    }
  };

  const fetchProductPlantCareLevels = async () => {
    try {
      const { data, error } = await supabase
        .from('product_plant_care_levels')
        .select('plant_care_level_id')
        .eq('product_id', productId);
      if (error) throw error;
      setSelectedPlantCareLevels(data?.map((pc) => pc.plant_care_level_id) || []);
    } catch (error: any) {
      console.error('Error fetching product plant care levels:', error);
    }
  };

  const fetchProductPlantPetSafety = async () => {
    try {
      const { data, error } = await supabase
        .from('product_plant_pet_safety')
        .select('plant_pet_safety_id')
        .eq('product_id', productId);
      if (error) throw error;
      setSelectedPlantPetSafety(data?.map((pp) => pp.plant_pet_safety_id) || []);
    } catch (error: any) {
      console.error('Error fetching product plant pet safety:', error);
    }
  };

  const fetchProductImages = async () => {
    try {
      const { data, error } = await supabase
        .from('product_images')
        .select('*')
        .eq('product_id', productId)
        .order('sort_order');

      if (error) throw error;
      setProductImages(data || []);
    } catch (error: any) {
      console.error('Error fetching product images:', error);
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
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const isPlantProduct = productTypes.find(pt => pt.id === selectedProductType)?.slug === 'plants';

      // 1. Update product details
      const updateData: any = {
        name: formData.name,
        description: formData.description,
        material: formData.material,
        is_featured: formData.is_featured,
        is_active: formData.is_active,
        has_variants: formData.has_variants,
      };

      // For plants, update simple pricing
      if (isPlantProduct) {
        updateData.price = parseFloat(formData.price.toString());
        updateData.compare_at_price = formData.compare_at_price
          ? parseFloat(formData.compare_at_price.toString())
          : null;
        updateData.stock_quantity = parseInt(formData.stock_quantity.toString());
      }

      const { error } = await supabase
        .from('products')
        .update(updateData)
        .eq('id', productId);

      if (error) throw error;

      // 2. Sync category relationships
      // First, delete existing relationships
      const { error: deleteError } = await supabase
        .from('product_categories')
        .delete()
        .eq('product_id', productId);

      if (deleteError) throw deleteError;

      // Then, insert new relationships
      if (selectedCategories.length > 0) {
        const categoryRelations = selectedCategories.map((categoryId) => ({
          product_id: productId,
          category_id: categoryId,
        }));

        const { error: insertError } = await supabase
          .from('product_categories')
          .insert(categoryRelations);

        if (insertError) throw insertError;
      }

      // 3. Sync color relationships
      const { error: deleteColorsError } = await supabase
        .from('product_colors')
        .delete()
        .eq('product_id', productId);

      if (deleteColorsError) throw deleteColorsError;

      if (selectedColors.length > 0) {
        const colorRelations = selectedColors.map((colorId) => ({
          product_id: productId,
          color_id: colorId,
        }));

        const { error: insertColorsError } = await supabase
          .from('product_colors')
          .insert(colorRelations);

        if (insertColorsError) throw insertColorsError;
      }

      // 4. Sync shape relationships
      const { error: deleteShapesError } = await supabase
        .from('product_shapes')
        .delete()
        .eq('product_id', productId);

      if (deleteShapesError) throw deleteShapesError;

      if (selectedShapes.length > 0) {
        const shapeRelations = selectedShapes.map((shapeId) => ({
          product_id: productId,
          shape_id: shapeId,
        }));

        const { error: insertShapesError } = await supabase
          .from('product_shapes')
          .insert(shapeRelations);

        if (insertShapesError) throw insertShapesError;
      }

      // 5. Sync space relationships
      const { error: deleteSpacesError } = await supabase
        .from('product_spaces')
        .delete()
        .eq('product_id', productId);

      if (deleteSpacesError) throw deleteSpacesError;

      if (selectedSpaces.length > 0) {
        const spaceRelations = selectedSpaces.map((spaceId) => ({
          product_id: productId,
          space_id: spaceId,
        }));

        const { error: insertSpacesError } = await supabase
          .from('product_spaces')
          .insert(spaceRelations);

        if (insertSpacesError) throw insertSpacesError;
      }

      // 6. Sync plant dimensions (only if product type is plants)
      if (isPlantProduct) {
        // Sync plant types
        await supabase.from('product_plant_types').delete().eq('product_id', productId);
        if (selectedPlantTypes.length > 0) {
          const relations = selectedPlantTypes.map(id => ({
            product_id: productId,
            plant_type_id: id,
          }));
          await supabase.from('product_plant_types').insert(relations);
        }

        // Sync plant sizes
        await supabase.from('product_plant_sizes').delete().eq('product_id', productId);
        if (selectedPlantSizes.length > 0) {
          const relations = selectedPlantSizes.map(id => ({
            product_id: productId,
            plant_size_id: id,
          }));
          await supabase.from('product_plant_sizes').insert(relations);
        }

        // Sync plant light requirements
        await supabase.from('product_plant_light_requirements').delete().eq('product_id', productId);
        if (selectedPlantLightRequirements.length > 0) {
          const relations = selectedPlantLightRequirements.map(id => ({
            product_id: productId,
            plant_light_requirement_id: id,
          }));
          await supabase.from('product_plant_light_requirements').insert(relations);
        }

        // Sync plant care levels
        await supabase.from('product_plant_care_levels').delete().eq('product_id', productId);
        if (selectedPlantCareLevels.length > 0) {
          const relations = selectedPlantCareLevels.map(id => ({
            product_id: productId,
            plant_care_level_id: id,
          }));
          await supabase.from('product_plant_care_levels').insert(relations);
        }

        // Sync plant pet safety
        await supabase.from('product_plant_pet_safety').delete().eq('product_id', productId);
        if (selectedPlantPetSafety.length > 0) {
          const relations = selectedPlantPetSafety.map(id => ({
            product_id: productId,
            plant_pet_safety_id: id,
          }));
          await supabase.from('product_plant_pet_safety').insert(relations);
        }
      }

      alert('המוצר עודכן בהצלחה!');
      router.push('/admin/products');
    } catch (error: any) {
      console.error('Error updating product:', error);
      alert(`שגיאה בעדכון המוצר: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const addVariant = () => {
    const newVariant = {
      id: `temp-${Date.now()}`,
      product_id: productId,
      size: '',
      sku: `VAR-${Date.now()}`,
      price: 0,
      compare_at_price: 0,
      stock_quantity: 0,
      is_active: true,
      sort_order: variants.length,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setVariants([...variants, newVariant as ProductVariant]);
  };

  const updateVariant = (index: number, field: string, value: any) => {
    const updated = [...variants];
    updated[index] = { ...updated[index], [field]: value };
    setVariants(updated);
  };

  const removeVariant = async (index: number) => {
    const variant = variants[index];

    if (variant.id.startsWith('temp-')) {
      // Just remove from state if not saved yet
      setVariants(variants.filter((_, i) => i !== index));
      return;
    }

    if (!confirm('האם אתה בטוח שברצונך למחוק גודל זה?')) return;

    try {
      const { error } = await supabase
        .from('product_variants')
        .delete()
        .eq('id', variant.id);

      if (error) throw error;

      setVariants(variants.filter((_, i) => i !== index));
      alert('הגודל נמחק בהצלחה');
    } catch (error) {
      console.error('Error deleting variant:', error);
      alert('שגיאה במחיקת הגודל');
    }
  };

  const saveVariant = async (index: number) => {
    const variant = variants[index];

    if (!variant.size || variant.price <= 0) {
      alert('נא למלא את כל השדות הנדרשים');
      return;
    }

    // Auto-generate SKU if not present
    if (!variant.sku || variant.sku.startsWith('VAR-')) {
      variant.sku = `VAR-${Date.now()}-${index}`;
    }

    try {
      if (variant.id.startsWith('temp-')) {
        // Create new variant
        const { data, error } = await supabase
          .from('product_variants')
          .insert([
            {
              product_id: productId,
              size: variant.size,
              sku: variant.sku,
              price: variant.price,
              compare_at_price: variant.compare_at_price || null,
              stock_quantity: variant.stock_quantity,
              is_active: variant.is_active,
              sort_order: variant.sort_order,
            },
          ])
          .select()
          .single();

        if (error) throw error;

        const updated = [...variants];
        updated[index] = data;
        setVariants(updated);
      } else {
        // Update existing variant
        const { error } = await supabase
          .from('product_variants')
          .update({
            size: variant.size,
            sku: variant.sku,
            price: variant.price,
            compare_at_price: variant.compare_at_price || null,
            stock_quantity: variant.stock_quantity,
            is_active: variant.is_active,
          })
          .eq('id', variant.id);

        if (error) throw error;
      }

      // Update has_variants flag on product
      const { error: hasVariantsError } = await supabase
        .from('products')
        .update({ has_variants: true })
        .eq('id', productId);

      if (hasVariantsError) {
        console.error('Error updating has_variants:', hasVariantsError);
      }

      // Update local state to reflect has_variants
      setFormData(prev => ({ ...prev, has_variants: true }));

      alert('הגודל נשמר בהצלחה! רענן את דף המוצר כדי לראות את השינויים.');

      // Refetch to ensure we have the latest data
      await fetchProduct();
      fetchVariants();
    } catch (error: any) {
      console.error('Error saving variant:', error);
      alert(`שגיאה בשמירת הגודל: ${error.message}`);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

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
        <h1 className="text-3xl font-bold text-gray-800">ערוך מוצר</h1>
        <p className="text-gray-600 mt-2">עדכן את פרטי המוצר וניהול מידות</p>
      </div>

      {/* Product Details Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Product Type Display */}
        {selectedProductType && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            סוג מוצר
          </h2>
          <div className="flex items-center p-4 bg-gray-50 rounded-lg">
            <span className="text-lg font-bold text-gray-800">
              {productTypes.find(pt => pt.id === selectedProductType)?.name}
            </span>
          </div>
          <p className="mt-3 text-sm text-gray-600">
            <strong>💡 הערה:</strong> לא ניתן לשנות את סוג המוצר לאחר יצירתו.
          </p>
        </div>
        )}

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
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
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
                  {color.hex_code && (
                    <span
                      className="w-6 h-6 rounded-full mr-2 border border-gray-300"
                      style={{ backgroundColor: color.hex_code }}
                    ></span>
                  )}
                  <span className="mr-2 text-gray-700 font-medium">
                    {color.name}
                  </span>
                </label>
              ))}
            </div>
          )}

          <div className="mt-4 p-4 bg-sage-light bg-opacity-20 rounded-lg border border-sage">
            <p className="text-sm text-gray-700">
              <strong>💡 טיפ:</strong> בחר את כל הצבעים הרלוונטיים למוצר.
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

        {/* Product Images */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">תמונות מוצר</h2>
          <ProductImageUpload
            productId={productId}
            existingImages={productImages}
            onImagesChange={(images) => setProductImages(images)}
          />
        </div>
      </form>

      {/* Carpets: Product Variants / Dimensions */}
      {selectedProductType && productTypes.find(pt => pt.id === selectedProductType)?.slug === 'carpets' && (
      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              מידות וגדלים
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              הוסף מספר מידות למוצר זה (לדוגמה: 160×230, 200×290)
            </p>
          </div>
          <button
            onClick={addVariant}
            className="bg-terracotta text-white px-4 py-2 rounded-lg hover:bg-terracotta-dark transition-colors flex items-center gap-2"
          >
            <FaPlus />
            הוסף מידה
          </button>
        </div>

        {variants.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>טרם הוספו מידות למוצר זה</p>
            <p className="text-sm mt-2">לחץ על "הוסף מידה" כדי להתחיל</p>
          </div>
        ) : (
          <div className="space-y-4">
            {variants.map((variant, index) => (
              <div
                key={variant.id}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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
                        updateVariant(index, 'price', parseFloat(e.target.value))
                      }
                      step="0.01"
                      min="0"
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
                      value={variant.compare_at_price || ''}
                      onChange={(e) =>
                        updateVariant(
                          index,
                          'compare_at_price',
                          e.target.value ? parseFloat(e.target.value) : null
                        )
                      }
                      step="0.01"
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  {/* Stock */}
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">
                      מלאי
                    </label>
                    <input
                      type="number"
                      value={variant.stock_quantity}
                      onChange={(e) =>
                        updateVariant(
                          index,
                          'stock_quantity',
                          parseInt(e.target.value)
                        )
                      }
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex items-end gap-2">
                    <button
                      onClick={() => saveVariant(index)}
                      type="button"
                      className="flex-1 bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
                    >
                      שמור
                    </button>
                    <button
                      onClick={() => removeVariant(index)}
                      type="button"
                      className="bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      )}

      {/* Plants: Simple Pricing */}
      {selectedProductType && productTypes.find(pt => pt.id === selectedProductType)?.slug === 'plants' && (
      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          מחיר ומלאי
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

      {/* Actions - At the Bottom */}
      <div className="mt-8 flex justify-end gap-4">
        <Link
          href="/admin/products"
          className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
        >
          ביטול
        </Link>
        <button
          onClick={(e) => {
            e.preventDefault();
            document.querySelector('form')?.requestSubmit();
          }}
          disabled={saving}
          className="bg-primary-600 text-white px-8 py-3 rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2 font-semibold disabled:opacity-50"
        >
          {saving ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
              שומר...
            </>
          ) : (
            <>
              <FaSave />
              שמור שינויים
            </>
          )}
        </button>
      </div>
    </div>
  );
}
