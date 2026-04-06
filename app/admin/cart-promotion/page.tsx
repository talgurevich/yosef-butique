'use client';

import { useState, useEffect } from 'react';
import { adminFetch } from '@/lib/admin-api';
import Link from 'next/link';
import { FaArrowRight, FaSave, FaTrash, FaShoppingCart } from 'react-icons/fa';

type Product = {
  id: string;
  name: string;
  slug: string;
  price: number;
  has_variants: boolean;
};

type Variant = {
  id: string;
  product_id: string;
  size: string;
  price: number;
  sort_order: number;
};

type ProductImage = {
  id: string;
  product_id: string;
  url: string;
  sort_order: number;
};

type CartPromotion = {
  id: string;
  product_id: string;
  variant_id: string | null;
  is_active: boolean;
};

export default function CartPromotionPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [variants, setVariants] = useState<Variant[]>([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [selectedVariantId, setSelectedVariantId] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productImage, setProductImage] = useState<string | null>(null);
  const [activePromotion, setActivePromotion] = useState<CartPromotion | null>(null);
  const [loadingVariants, setLoadingVariants] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [productsRes, promotionRes] = await Promise.all([
        adminFetch<{ data: Product[] }>('products', {
          params: {
            select: 'id, name, slug, price, has_variants',
            filter_column: 'is_active',
            filter_value: 'true',
            order_by: 'name',
          },
        }),
        adminFetch<{ data: CartPromotion[] }>('cart_promotion', {
          params: {
            filter_column: 'is_active',
            filter_value: 'true',
          },
        }),
      ]);

      setProducts(productsRes.data || []);

      const activePromo = promotionRes.data?.[0] || null;
      setActivePromotion(activePromo);

      if (activePromo) {
        setSelectedProductId(activePromo.product_id);
        const product = (productsRes.data || []).find((p) => p.id === activePromo.product_id);
        if (product) {
          setSelectedProduct(product);
          await fetchProductDetails(activePromo.product_id, product.has_variants);
          if (activePromo.variant_id) {
            setSelectedVariantId(activePromo.variant_id);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching initial data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProductDetails = async (productId: string, hasVariants: boolean) => {
    setLoadingVariants(true);
    try {
      const imageRes = await adminFetch<{ data: ProductImage[] }>('product_images', {
        params: {
          filter_column: 'product_id',
          filter_value: productId,
          order_by: 'sort_order',
          limit: '1',
        },
      });
      setProductImage(imageRes.data?.[0]?.url || null);

      if (hasVariants) {
        const variantsRes = await adminFetch<{ data: Variant[] }>('product_variants', {
          params: {
            filter_column: 'product_id',
            filter_value: productId,
            order_by: 'sort_order',
          },
        });
        setVariants(variantsRes.data || []);
      } else {
        setVariants([]);
      }
    } catch (error) {
      console.error('Error fetching product details:', error);
    } finally {
      setLoadingVariants(false);
    }
  };

  const handleProductChange = async (productId: string) => {
    setSelectedProductId(productId);
    setSelectedVariantId('');
    setVariants([]);
    setProductImage(null);

    if (!productId) {
      setSelectedProduct(null);
      return;
    }

    const product = products.find((p) => p.id === productId);
    if (product) {
      setSelectedProduct(product);
      await fetchProductDetails(productId, product.has_variants);
    }
  };

  const handleSave = async () => {
    if (!selectedProductId) {
      alert('יש לבחור מוצר');
      return;
    }

    if (selectedProduct?.has_variants && !selectedVariantId) {
      alert('יש לבחור גרסה למוצר');
      return;
    }

    setSaving(true);
    try {
      // Deactivate all existing promotions
      const { data: allPromos } = await adminFetch<{ data: CartPromotion[] }>('cart_promotion');
      if (allPromos && allPromos.length > 0) {
        for (const promo of allPromos) {
          await adminFetch('cart_promotion', {
            method: 'PUT',
            data: { id: promo.id, is_active: false },
          });
        }
      }

      // Insert new promotion
      const { data: newPromo } = await adminFetch<{ data: CartPromotion }>('cart_promotion', {
        method: 'POST',
        data: {
          product_id: selectedProductId,
          variant_id: selectedVariantId || null,
          is_active: true,
        },
      });

      setActivePromotion(newPromo || { id: '', product_id: selectedProductId, variant_id: selectedVariantId || null, is_active: true });
      alert('המוצר המקודם נשמר בהצלחה!');
    } catch (error: any) {
      console.error('Error saving promotion:', error);
      alert('שגיאה בשמירה: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeactivate = async () => {
    if (!confirm('האם להסיר את המוצר המקודם?')) return;

    setSaving(true);
    try {
      const { data: allPromos } = await adminFetch<{ data: CartPromotion[] }>('cart_promotion');
      if (allPromos && allPromos.length > 0) {
        for (const promo of allPromos) {
          await adminFetch('cart_promotion', {
            method: 'PUT',
            data: { id: promo.id, is_active: false },
          });
        }
      }

      setActivePromotion(null);
      setSelectedProductId('');
      setSelectedVariantId('');
      setSelectedProduct(null);
      setProductImage(null);
      setVariants([]);
      alert('המוצר המקודם הוסר בהצלחה!');
    } catch (error: any) {
      console.error('Error deactivating promotion:', error);
      alert('שגיאה בהסרה: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const getDisplayPrice = (): number | null => {
    if (selectedVariantId && variants.length > 0) {
      const variant = variants.find((v) => v.id === selectedVariantId);
      return variant?.price ?? null;
    }
    return selectedProduct?.price ?? null;
  };

  const getDisplayVariantLabel = (): string | null => {
    if (selectedVariantId && variants.length > 0) {
      const variant = variants.find((v) => v.id === selectedVariantId);
      return variant?.size ?? null;
    }
    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link
              href="/admin"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <FaArrowRight />
              חזרה
            </Link>
            <h1 className="text-3xl font-bold text-gray-800">מוצר מקודם בעגלה</h1>
          </div>
        </div>

        <p className="text-gray-600 mb-8">בחר מוצר שיוצג בעגלת הקניות כהצעה ללקוח</p>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Configuration Panel */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">בחירת מוצר</h2>

            {/* Active status indicator */}
            {activePromotion && (
              <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
                <FaShoppingCart className="text-green-600 flex-shrink-0" />
                <span className="text-green-800 font-semibold">מוצר מקודם כרגע</span>
              </div>
            )}

            {/* Product dropdown */}
            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2">מוצר</label>
              <select
                value={selectedProductId}
                onChange={(e) => handleProductChange(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
              >
                <option value="">-- בחר מוצר --</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Variant dropdown */}
            {selectedProduct?.has_variants && (
              <div className="mb-6">
                <label className="block text-gray-700 font-semibold mb-2">גרסה</label>
                {loadingVariants ? (
                  <div className="flex items-center gap-2 text-gray-500 py-3">
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-primary-600"></div>
                    טוען גרסאות...
                  </div>
                ) : (
                  <select
                    value={selectedVariantId}
                    onChange={(e) => setSelectedVariantId(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
                  >
                    <option value="">-- בחר גרסה --</option>
                    {variants.map((variant) => (
                      <option key={variant.id} value={variant.id}>
                        {variant.size} - {variant.price} ש&quot;ח
                      </option>
                    ))}
                  </select>
                )}
              </div>
            )}

            {/* Action buttons */}
            <div className="flex gap-4">
              <button
                onClick={handleSave}
                disabled={saving || !selectedProductId}
                className="flex-1 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaSave />
                {saving ? 'שומר...' : 'שמור'}
              </button>

              {activePromotion && (
                <button
                  onClick={handleDeactivate}
                  disabled={saving}
                  className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaTrash />
                  הסר מוצר מקודם
                </button>
              )}
            </div>
          </div>

          {/* Preview Panel */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">תצוגה מקדימה</h2>

            {selectedProduct ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                <p className="text-sm text-gray-500 mb-4 text-center">
                  כך המוצר ייראה בעגלה:
                </p>

                <div className="flex items-center gap-4 bg-gray-50 rounded-lg p-4">
                  {/* Product image */}
                  <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-200">
                    {productImage ? (
                      <img
                        src={productImage}
                        alt={selectedProduct.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <FaShoppingCart size={24} />
                      </div>
                    )}
                  </div>

                  {/* Product info */}
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800">{selectedProduct.name}</h3>
                    {getDisplayVariantLabel() && (
                      <p className="text-sm text-gray-500">{getDisplayVariantLabel()}</p>
                    )}
                    {getDisplayPrice() !== null && (
                      <p className="text-primary-600 font-bold mt-1">
                        {getDisplayPrice()} ש&quot;ח
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                <div className="text-center py-12 text-gray-400">
                  <FaShoppingCart size={48} className="mx-auto mb-4 opacity-30" />
                  <p>בחר מוצר כדי לראות תצוגה מקדימה</p>
                </div>
              </div>
            )}

            {/* Tips */}
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">טיפים</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>- המוצר המקודם יוצג בעגלת הקניות כהמלצה</li>
                <li>- ניתן לבחור גרסה ספציפית למוצרים עם גרסאות</li>
                <li>- רק מוצר אחד יכול להיות מקודם בכל זמן נתון</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
