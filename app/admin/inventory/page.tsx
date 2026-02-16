'use client';

import { useEffect, useState, useCallback } from 'react';
import { FaChevronDown, FaChevronUp, FaMinus, FaPlus, FaSearch } from 'react-icons/fa';
import { supabase, Color, ProductType } from '@/lib/supabase';

type InventoryVariant = {
  id: string;
  size: string;
  color_id: string | null;
  stock_quantity: number;
  is_active: boolean;
  sku: string;
};

type InventoryProduct = {
  id: string;
  name: string;
  stock_quantity: number;
  has_variants: boolean;
  is_active: boolean;
  product_type_id: string;
  image_url: string | null;
  variants: InventoryVariant[];
  totalStock: number;
};

type Toast = {
  id: number;
  message: string;
  type: 'success' | 'error';
};

export default function InventoryPage() {
  const [products, setProducts] = useState<InventoryProduct[]>([]);
  const [colors, setColors] = useState<Color[]>([]);
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'carpets' | 'plants'>('carpets');
  const [stockFilter, setStockFilter] = useState<string>('all');
  const [expandedProducts, setExpandedProducts] = useState<Set<string>>(new Set());
  const [expandedSizes, setExpandedSizes] = useState<Set<string>>(new Set());
  const [editingVariants, setEditingVariants] = useState<Map<string, number>>(new Map());
  const [editingProducts, setEditingProducts] = useState<Map<string, number>>(new Map());
  const [savingIds, setSavingIds] = useState<Set<string>>(new Set());
  const [toasts, setToasts] = useState<Toast[]>([]);
  let toastCounter = 0;

  const showToast = useCallback((message: string, type: 'success' | 'error') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [productsRes, colorsRes, typesRes] = await Promise.all([
        supabase
          .from('products')
          .select(`
            id,
            name,
            stock_quantity,
            has_variants,
            is_active,
            product_type_id,
            product_images (
              image_url,
              sort_order
            ),
            product_variants (
              id,
              size,
              color_id,
              stock_quantity,
              is_active,
              sku
            )
          `)
          .order('name'),
        supabase.from('colors').select('*'),
        supabase.from('product_types').select('*').eq('is_active', true),
      ]);

      if (productsRes.error) throw productsRes.error;
      if (colorsRes.error) throw colorsRes.error;
      if (typesRes.error) throw typesRes.error;

      setColors(colorsRes.data || []);
      setProductTypes(typesRes.data || []);

      const mapped: InventoryProduct[] = (productsRes.data || []).map((p: any) => {
        const variants: InventoryVariant[] = (p.product_variants || []).map((v: any) => ({
          id: v.id,
          size: v.size,
          color_id: v.color_id,
          stock_quantity: v.stock_quantity,
          is_active: v.is_active,
          sku: v.sku,
        }));

        const images = (p.product_images || []).sort((a: any, b: any) => a.sort_order - b.sort_order);

        const totalStock = variants.length > 0
          ? variants.reduce((sum, v) => sum + (v.stock_quantity || 0), 0)
          : p.stock_quantity || 0;

        return {
          id: p.id,
          name: p.name,
          stock_quantity: p.stock_quantity || 0,
          has_variants: p.has_variants,
          is_active: p.is_active,
          product_type_id: p.product_type_id,
          image_url: images.length > 0 ? images[0].image_url : null,
          variants,
          totalStock,
        };
      });

      setProducts(mapped);
    } catch (error) {
      console.error('Error fetching inventory data:', error);
      showToast('שגיאה בטעינת הנתונים', 'error');
    } finally {
      setLoading(false);
    }
  };

  const getColorName = (colorId: string | null) => {
    if (!colorId) return null;
    return colors.find(c => c.id === colorId)?.name || null;
  };

  const getTypeName = (typeId: string) => {
    return productTypes.find(t => t.id === typeId)?.name || '';
  };

  const getTypeSlug = (typeId: string) => {
    return productTypes.find(t => t.id === typeId)?.slug || '';
  };

  const toggleExpand = (productId: string) => {
    setExpandedProducts(prev => {
      const next = new Set(prev);
      if (next.has(productId)) {
        next.delete(productId);
      } else {
        next.add(productId);
      }
      return next;
    });
  };

  const toggleSize = (key: string) => {
    setExpandedSizes(prev => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const groupVariantsBySize = (variants: InventoryVariant[]) => {
    const sizeOrder: string[] = [];
    const sizeMap: Record<string, InventoryVariant[]> = {};
    variants.forEach(v => {
      if (!sizeMap[v.size]) {
        sizeMap[v.size] = [];
        sizeOrder.push(v.size);
      }
      sizeMap[v.size].push(v);
    });
    return sizeOrder.map(size => ({
      size,
      variants: sizeMap[size],
      totalStock: sizeMap[size].reduce((sum, v) => sum + (v.stock_quantity || 0), 0),
    }));
  };

  // Variant stock editing
  const getVariantEditValue = (variantId: string, currentStock: number) => {
    return editingVariants.has(variantId) ? editingVariants.get(variantId)! : currentStock;
  };

  const setVariantEditValue = (variantId: string, value: number) => {
    setEditingVariants(prev => {
      const next = new Map(prev);
      next.set(variantId, Math.max(0, value));
      return next;
    });
  };

  const isVariantChanged = (variantId: string, currentStock: number) => {
    return editingVariants.has(variantId) && editingVariants.get(variantId) !== currentStock;
  };

  // Product stock editing (non-variant products)
  const getProductEditValue = (productId: string, currentStock: number) => {
    return editingProducts.has(productId) ? editingProducts.get(productId)! : currentStock;
  };

  const setProductEditValue = (productId: string, value: number) => {
    setEditingProducts(prev => {
      const next = new Map(prev);
      next.set(productId, Math.max(0, value));
      return next;
    });
  };

  const isProductChanged = (productId: string, currentStock: number) => {
    return editingProducts.has(productId) && editingProducts.get(productId) !== currentStock;
  };

  // Save variant stock
  const saveVariantStock = async (variantId: string, productId: string) => {
    const newValue = editingVariants.get(variantId);
    if (newValue === undefined) return;

    setSavingIds(prev => new Set(prev).add(variantId));

    try {
      const { error } = await supabase
        .from('product_variants')
        .update({ stock_quantity: newValue })
        .eq('id', variantId);

      if (error) throw error;

      // Update local state
      setProducts(prev => prev.map(p => {
        if (p.id !== productId) return p;
        const updatedVariants = p.variants.map(v =>
          v.id === variantId ? { ...v, stock_quantity: newValue } : v
        );
        const totalStock = updatedVariants.reduce((sum, v) => sum + (v.stock_quantity || 0), 0);
        return { ...p, variants: updatedVariants, totalStock };
      }));

      setEditingVariants(prev => {
        const next = new Map(prev);
        next.delete(variantId);
        return next;
      });

      showToast('המלאי עודכן בהצלחה', 'success');
    } catch (error) {
      console.error('Error updating variant stock:', error);
      setEditingVariants(prev => {
        const next = new Map(prev);
        next.delete(variantId);
        return next;
      });
      showToast('שגיאה בעדכון המלאי', 'error');
    } finally {
      setSavingIds(prev => {
        const next = new Set(prev);
        next.delete(variantId);
        return next;
      });
    }
  };

  // Save product stock (non-variant)
  const saveProductStock = async (productId: string) => {
    const newValue = editingProducts.get(productId);
    if (newValue === undefined) return;

    setSavingIds(prev => new Set(prev).add(productId));

    try {
      const { error } = await supabase
        .from('products')
        .update({ stock_quantity: newValue })
        .eq('id', productId);

      if (error) throw error;

      setProducts(prev => prev.map(p =>
        p.id === productId ? { ...p, stock_quantity: newValue, totalStock: newValue } : p
      ));

      setEditingProducts(prev => {
        const next = new Map(prev);
        next.delete(productId);
        return next;
      });

      showToast('המלאי עודכן בהצלחה', 'success');
    } catch (error) {
      console.error('Error updating product stock:', error);
      setEditingProducts(prev => {
        const next = new Map(prev);
        next.delete(productId);
        return next;
      });
      showToast('שגיאה בעדכון המלאי', 'error');
    } finally {
      setSavingIds(prev => {
        const next = new Set(prev);
        next.delete(productId);
        return next;
      });
    }
  };

  // Filtering
  const filteredProducts = products.filter(p => {
    // Search
    if (searchTerm && !p.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    // Tab filter
    const slug = getTypeSlug(p.product_type_id);
    if (slug !== activeTab) return false;
    // Stock filter
    if (stockFilter === 'out') {
      if (p.totalStock > 0) return false;
    } else if (stockFilter === 'low') {
      if (p.totalStock > 5 || p.totalStock === 0) return false;
    }
    return true;
  });

  const stockBadgeColor = (stock: number) => {
    if (stock === 0) return 'bg-red-100 text-red-800';
    if (stock <= 10) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  // Count products per tab
  const carpetCount = products.filter(p => getTypeSlug(p.product_type_id) === 'carpets').length;
  const plantCount = products.filter(p => getTypeSlug(p.product_type_id) === 'plants').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">טוען מלאי...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-20">
      {/* Tab Bar */}
      <div className="sticky top-[52px] z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex">
          <button
            onClick={() => { setActiveTab('carpets'); setSearchTerm(''); setStockFilter('all'); }}
            className={`flex-1 py-3 text-center text-sm font-bold transition-colors relative ${
              activeTab === 'carpets'
                ? 'text-primary-600'
                : 'text-gray-500'
            }`}
          >
            שטיחים ({carpetCount})
            {activeTab === 'carpets' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600" />}
          </button>
          <button
            onClick={() => { setActiveTab('plants'); setSearchTerm(''); setStockFilter('all'); }}
            className={`flex-1 py-3 text-center text-sm font-bold transition-colors relative ${
              activeTab === 'plants'
                ? 'text-green-600'
                : 'text-gray-500'
            }`}
          >
            עציצים ({plantCount})
            {activeTab === 'plants' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-600" />}
          </button>
        </div>
      </div>

      {/* Sticky Filter Bar */}
      <div className="sticky top-[96px] z-30 bg-gray-100 px-4 pt-3 pb-2 space-y-3 border-b border-gray-200 shadow-sm">
        {/* Search */}
        <div className="relative">
          <FaSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="חפש מוצר..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full h-12 pr-10 pl-4 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 text-base"
          />
        </div>

        {/* Stock filter pills */}
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
          <button
            onClick={() => setStockFilter('all')}
            className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              stockFilter === 'all'
                ? 'bg-gray-800 text-white'
                : 'bg-white text-gray-700 border border-gray-300'
            }`}
          >
            הכל
          </button>
          <button
            onClick={() => setStockFilter('out')}
            className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              stockFilter === 'out'
                ? 'bg-red-600 text-white'
                : 'bg-white text-red-700 border border-red-300'
            }`}
          >
            אזל מהמלאי
          </button>
          <button
            onClick={() => setStockFilter('low')}
            className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              stockFilter === 'low'
                ? 'bg-yellow-600 text-white'
                : 'bg-white text-yellow-700 border border-yellow-300'
            }`}
          >
            מלאי נמוך
          </button>
        </div>

        {/* Results count */}
        <p className="text-xs text-gray-500">
          {filteredProducts.length} מתוך {products.length} מוצרים
        </p>
      </div>

      {/* Product Cards */}
      <div className="px-4 mt-3 space-y-3">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg">לא נמצאו מוצרים</p>
            <p className="text-sm mt-1">נסה לשנות את מסנני החיפוש</p>
          </div>
        ) : (
          filteredProducts.map(product => (
            <div key={product.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Card Header */}
              <button
                onClick={() => toggleExpand(product.id)}
                className="w-full flex items-center gap-3 p-3 text-right"
              >
                {/* Thumbnail */}
                <div className="w-10 h-10 rounded-lg bg-gray-100 flex-shrink-0 overflow-hidden">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                      —
                    </div>
                  )}
                </div>

                {/* Name */}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate text-sm">{product.name}</p>
                  <p className="text-xs text-gray-500">
                    {product.has_variants && product.variants.length > 0
                      ? `${product.variants.length} וריאנטים`
                      : 'ללא וריאנטים'}
                  </p>
                </div>

                {/* Stock badge */}
                <span className={`flex-shrink-0 px-2.5 py-1 rounded-full text-xs font-bold ${stockBadgeColor(product.totalStock)}`}>
                  {product.totalStock}
                </span>

                {/* Expand chevron */}
                <span className="text-gray-400 flex-shrink-0">
                  {expandedProducts.has(product.id) ? (
                    <FaChevronUp className="text-sm" />
                  ) : (
                    <FaChevronDown className="text-sm" />
                  )}
                </span>
              </button>

              {/* Expanded Content */}
              {expandedProducts.has(product.id) && (
                <div className="border-t border-gray-100 bg-gray-50">
                  {product.has_variants && product.variants.length > 0 ? (
                    // Grouped by size
                    <div className="divide-y divide-gray-200">
                      {groupVariantsBySize(product.variants).map(group => {
                        const sizeKey = `${product.id}:${group.size}`;
                        const isSizeExpanded = expandedSizes.has(sizeKey);
                        const hasColors = group.variants.some(v => v.color_id);

                        // Single variant per size (no colors) — show stepper directly
                        if (group.variants.length === 1 && !hasColors) {
                          const variant = group.variants[0];
                          const editValue = getVariantEditValue(variant.id, variant.stock_quantity);
                          const changed = isVariantChanged(variant.id, variant.stock_quantity);
                          const saving = savingIds.has(variant.id);
                          return (
                            <div key={sizeKey} className="px-4 py-3">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-gray-700 font-medium">{group.size}</span>
                                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${stockBadgeColor(variant.stock_quantity)}`}>
                                  {variant.stock_quantity}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white">
                                  <button onClick={() => setVariantEditValue(variant.id, editValue - 1)} className="w-11 h-11 flex items-center justify-center text-gray-600 hover:bg-gray-100 active:bg-gray-200 transition-colors" aria-label="הפחת"><FaMinus className="text-xs" /></button>
                                  <input type="number" value={editValue} onChange={e => { const val = parseInt(e.target.value); if (!isNaN(val)) setVariantEditValue(variant.id, val); }} className="w-14 h-11 text-center border-x border-gray-300 text-base font-medium focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" min={0} />
                                  <button onClick={() => setVariantEditValue(variant.id, editValue + 1)} className="w-11 h-11 flex items-center justify-center text-gray-600 hover:bg-gray-100 active:bg-gray-200 transition-colors" aria-label="הוסף"><FaPlus className="text-xs" /></button>
                                </div>
                                {changed && (
                                  <button onClick={() => saveVariantStock(variant.id, product.id)} disabled={saving} className="px-4 h-11 bg-green-600 text-white rounded-lg font-medium text-sm hover:bg-green-700 active:bg-green-800 transition-colors disabled:opacity-50">{saving ? '...' : 'שמור'}</button>
                                )}
                              </div>
                            </div>
                          );
                        }

                        // Multiple variants per size (colors) — collapsible size group
                        return (
                          <div key={sizeKey}>
                            <button
                              onClick={() => toggleSize(sizeKey)}
                              className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-100 active:bg-gray-200 transition-colors"
                            >
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold text-gray-800">{group.size}</span>
                                <span className="text-xs text-gray-500">({group.variants.length} צבעים)</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${stockBadgeColor(group.totalStock)}`}>
                                  {group.totalStock}
                                </span>
                                {isSizeExpanded ? <FaChevronUp className="text-xs text-gray-400" /> : <FaChevronDown className="text-xs text-gray-400" />}
                              </div>
                            </button>
                            {isSizeExpanded && (
                              <div className="bg-white divide-y divide-gray-50 border-t border-gray-100">
                                {group.variants.map(variant => {
                                  const colorName = getColorName(variant.color_id) || '—';
                                  const editValue = getVariantEditValue(variant.id, variant.stock_quantity);
                                  const changed = isVariantChanged(variant.id, variant.stock_quantity);
                                  const saving = savingIds.has(variant.id);
                                  return (
                                    <div key={variant.id} className="px-4 py-3 pr-8">
                                      <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm text-gray-700">{colorName}</span>
                                        {!variant.is_active && (
                                          <span className="text-xs text-gray-400 bg-gray-200 px-2 py-0.5 rounded">לא פעיל</span>
                                        )}
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white">
                                          <button onClick={() => setVariantEditValue(variant.id, editValue - 1)} className="w-11 h-11 flex items-center justify-center text-gray-600 hover:bg-gray-100 active:bg-gray-200 transition-colors" aria-label="הפחת"><FaMinus className="text-xs" /></button>
                                          <input type="number" value={editValue} onChange={e => { const val = parseInt(e.target.value); if (!isNaN(val)) setVariantEditValue(variant.id, val); }} className="w-14 h-11 text-center border-x border-gray-300 text-base font-medium focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" min={0} />
                                          <button onClick={() => setVariantEditValue(variant.id, editValue + 1)} className="w-11 h-11 flex items-center justify-center text-gray-600 hover:bg-gray-100 active:bg-gray-200 transition-colors" aria-label="הוסף"><FaPlus className="text-xs" /></button>
                                        </div>
                                        {changed && (
                                          <button onClick={() => saveVariantStock(variant.id, product.id)} disabled={saving} className="px-4 h-11 bg-green-600 text-white rounded-lg font-medium text-sm hover:bg-green-700 active:bg-green-800 transition-colors disabled:opacity-50">{saving ? '...' : 'שמור'}</button>
                                        )}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    // Non-variant product: single stock editor
                    <div className="px-4 py-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-700 font-medium">מלאי המוצר</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white">
                          <button
                            onClick={() => setProductEditValue(product.id, getProductEditValue(product.id, product.stock_quantity) - 1)}
                            className="w-11 h-11 flex items-center justify-center text-gray-600 hover:bg-gray-100 active:bg-gray-200 transition-colors"
                            aria-label="הפחת"
                          >
                            <FaMinus className="text-xs" />
                          </button>
                          <input
                            type="number"
                            value={getProductEditValue(product.id, product.stock_quantity)}
                            onChange={e => {
                              const val = parseInt(e.target.value);
                              if (!isNaN(val)) {
                                setProductEditValue(product.id, val);
                              }
                            }}
                            className="w-14 h-11 text-center border-x border-gray-300 text-base font-medium focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            min={0}
                          />
                          <button
                            onClick={() => setProductEditValue(product.id, getProductEditValue(product.id, product.stock_quantity) + 1)}
                            className="w-11 h-11 flex items-center justify-center text-gray-600 hover:bg-gray-100 active:bg-gray-200 transition-colors"
                            aria-label="הוסף"
                          >
                            <FaPlus className="text-xs" />
                          </button>
                        </div>

                        {isProductChanged(product.id, product.stock_quantity) && (
                          <button
                            onClick={() => saveProductStock(product.id)}
                            disabled={savingIds.has(product.id)}
                            className="px-4 h-11 bg-green-600 text-white rounded-lg font-medium text-sm hover:bg-green-700 active:bg-green-800 transition-colors disabled:opacity-50"
                          >
                            {savingIds.has(product.id) ? '...' : 'שמור'}
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Toast notifications */}
      {toasts.length > 0 && (
        <div className="fixed bottom-4 left-4 right-4 z-50 flex flex-col gap-2 items-center">
          {toasts.map(toast => (
            <div
              key={toast.id}
              className={`px-6 py-3 rounded-lg shadow-lg text-white text-sm font-medium animate-fade-in ${
                toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'
              }`}
            >
              {toast.message}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
