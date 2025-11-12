'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { FaSave, FaArrowRight, FaPlus, FaTrash } from 'react-icons/fa';
import { supabase, Product, ProductVariant } from '@/lib/supabase';

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [variants, setVariants] = useState<ProductVariant[]>([]);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    sku: '',
    material: '',
    is_featured: false,
    is_active: true,
    has_variants: false,
  });

  useEffect(() => {
    fetchProduct();
    fetchVariants();
  }, [productId]);

  const fetchProduct = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();

      if (error) throw error;

      setProduct(data);
      setFormData({
        name: data.name,
        description: data.description || '',
        sku: data.sku,
        material: data.material || '',
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
      const { error } = await supabase
        .from('products')
        .update({
          name: formData.name,
          description: formData.description,
          sku: formData.sku,
          material: formData.material,
          is_featured: formData.is_featured,
          is_active: formData.is_active,
          has_variants: formData.has_variants,
        })
        .eq('id', productId);

      if (error) throw error;

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
      sku: `${formData.sku}-`,
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

    if (!variant.size || !variant.sku || variant.price <= 0) {
      alert('נא למלא את כל השדות הנדרשים');
      return;
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
      await supabase
        .from('products')
        .update({ has_variants: true })
        .eq('id', productId);

      alert('הגודל נשמר בהצלחה!');
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

            {/* SKU */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                מק״ט (SKU) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                required
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
      </form>

      {/* Product Variants / Dimensions */}
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
                <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
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

                  {/* SKU */}
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">
                      מק״ט <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={variant.sku}
                      onChange={(e) =>
                        updateVariant(index, 'sku', e.target.value)
                      }
                      placeholder="RUG-001-M"
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
    </div>
  );
}
