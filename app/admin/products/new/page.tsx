'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaSave, FaArrowRight, FaPlus, FaTrash } from 'react-icons/fa';
import { supabase, ProductVariant, Category } from '@/lib/supabase';

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
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    material: '',
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
    fetchCategories();
  }, []);

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

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
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
      // Validate variants
      const hasEmptyVariant = variants.some(
        (v) => !v.size || !v.price || v.price === '' || !v.stock_quantity
      );

      if (hasEmptyVariant) {
        alert('נא למלא את כל השדות החובה בכל המידות (מידה, מחיר, מלאי)');
        setLoading(false);
        return;
      }

      const slug = generateSlug(formData.name);

      // Calculate base price from first variant
      const basePrice = parseFloat(variants[0].price.toString());

      // Auto-generate base SKU from product name
      const baseSku = `PROD-${Date.now()}`;

      // 1. Create the product
      const { data: productData, error: productError } = await supabase
        .from('products')
        .insert([
          {
            name: formData.name,
            description: formData.description,
            price: basePrice,
            compare_at_price: null,
            sku: baseSku,
            size: variants[0].size, // Use first variant size as default
            material: formData.material,
            stock_quantity: 0, // Will be calculated from variants
            is_featured: formData.is_featured,
            is_active: formData.is_active,
            slug,
            style: [],
            color: [],
            has_variants: variants.length > 1,
          },
        ])
        .select()
        .single();

      if (productError) throw productError;

      // 2. Create all variants with auto-generated SKUs
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

        {/* Categories Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            קטגוריות
          </h2>

          {categories.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-gray-600 mb-2">אין קטגוריות זמינות</p>
              <Link
                href="/admin/categories"
                className="text-primary-600 hover:text-primary-700 underline"
              >
                צור קטגוריה חדשה
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {categories.map((category) => (
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
              <strong>💡 טיפ:</strong> ניתן לבחור מספר קטגוריות למוצר אחד.
              המוצר יופיע בכל הקטגוריות שנבחרו.
            </p>
          </div>
        </div>

        {/* Product Variants / Dimensions */}
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
