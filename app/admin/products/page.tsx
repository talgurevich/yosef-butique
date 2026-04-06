'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FaPlus, FaEdit, FaTrash, FaUpload, FaCheckSquare, FaSquare, FaGripVertical } from 'react-icons/fa';
import { Product } from '@/lib/supabase';
import { adminFetch } from '@/lib/admin-api';
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [deleting, setDeleting] = useState(false);
  const [savingOrder, setSavingOrder] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await adminFetch<{ data: any[] }>('products', {
        params: {
          select: '*, product_images(id, image_url, alt_text, sort_order), product_colors(colors(id, name)), product_categories(categories(id, name)), product_spaces(spaces(id, name)), product_variants(id, stock_quantity), product_types(slug)',
          order_by: 'sort_order',
        },
      });

      const productsWithSortedImages = data?.map(product => {
        const variants = product.product_variants || [];
        const totalVariantStock = variants.reduce((sum: number, v: any) => sum + (v.stock_quantity || 0), 0);

        return {
          ...product,
          product_images: product.product_images?.sort((a: any, b: any) => a.sort_order - b.sort_order) || [],
          total_stock: totalVariantStock > 0 ? totalVariantStock : product.stock_quantity,
        };
      });

      setProducts(productsWithSortedImages || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      alert('שגיאה בטעינת המוצרים');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('האם אתה בטוח שברצונך למחוק מוצר זה?')) return;

    try {
      await adminFetch('products', { method: 'DELETE', params: { id } });
      setProducts(products.filter((p) => p.id !== id));
      setSelectedIds(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      alert('המוצר נמחק בהצלחה');
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('שגיאה במחיקת המוצר');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    if (!confirm(`האם אתה בטוח שברצונך למחוק ${selectedIds.size} מוצרים?`)) return;

    setDeleting(true);
    try {
      const idsArray = Array.from(selectedIds);
      await Promise.all(
        idsArray.map(id => adminFetch('products', { method: 'DELETE', params: { id } }))
      );
      setProducts(products.filter((p) => !selectedIds.has(p.id)));
      setSelectedIds(new Set());
      alert(`${idsArray.length} מוצרים נמחקו בהצלחה`);
    } catch (error) {
      console.error('Error deleting products:', error);
      alert('שגיאה במחיקת המוצרים');
    } finally {
      setDeleting(false);
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const carpetProducts = filteredProducts.filter(
    (p) => p.product_types?.slug !== 'plants'
  );
  const plantProducts = filteredProducts.filter(
    (p) => p.product_types?.slug === 'plants'
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = async (event: DragEndEvent, type: 'carpets' | 'plants') => {
    setActiveId(null);
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const list = type === 'carpets' ? carpetProducts : plantProducts;
    const oldIndex = list.findIndex(p => p.id === active.id);
    const newIndex = list.findIndex(p => p.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = arrayMove(list, oldIndex, newIndex);

    // Update local state immediately
    const otherProducts = type === 'carpets'
      ? products.filter(p => p.product_types?.slug === 'plants')
      : products.filter(p => p.product_types?.slug !== 'plants');

    // Assign new sort_order values
    const updatedReordered = reordered.map((p, i) => ({ ...p, sort_order: i + 1 }));
    const updatedOther = otherProducts.map((p, i) => ({ ...p, sort_order: updatedReordered.length + i + 1 }));

    setProducts([...updatedReordered, ...updatedOther]);

    // Persist to DB
    setSavingOrder(true);
    try {
      await Promise.all(
        updatedReordered.map((p, i) =>
          adminFetch('products', {
            method: 'PUT',
            data: { id: p.id, sort_order: i + 1 },
          })
        )
      );
    } catch (error) {
      console.error('Error saving order:', error);
      alert('שגיאה בשמירת הסדר');
    } finally {
      setSavingOrder(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">ניהול מוצרים</h1>
          <p className="text-gray-600 mt-2">
            סך הכל {products.length} מוצרים ({carpetProducts.length} שטיחים, {plantProducts.length} עציצים)
            {savingOrder && <span className="text-primary-600 mr-2">שומר סדר...</span>}
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/admin/products/bulk-upload"
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 font-semibold"
          >
            <FaUpload />
            העלאת CSV
          </Link>
          <Link
            href="/admin/products/new"
            className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2 font-semibold"
          >
            <FaPlus />
            הוסף מוצר
          </Link>
        </div>
      </div>

      {/* Search Bar and Bulk Actions */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex gap-4 items-center">
          <input
            type="text"
            placeholder="חפש מוצר לפי שם..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          {selectedIds.size > 0 && (
            <button
              onClick={handleBulkDelete}
              disabled={deleting}
              className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 font-semibold disabled:opacity-50"
            >
              <FaTrash />
              {deleting ? 'מוחק...' : `מחק ${selectedIds.size} מוצרים`}
            </button>
          )}
        </div>
        {selectedIds.size > 0 && (
          <div className="mt-3 text-sm text-gray-600">
            נבחרו {selectedIds.size} מוצרים מתוך {filteredProducts.length}
          </div>
        )}
        {!searchTerm && (
          <p className="mt-3 text-sm text-gray-500">
            <FaGripVertical className="inline ml-1" />
            גרור שורות כדי לשנות את סדר התצוגה באתר
          </p>
        )}
      </div>

      {loading ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">טוען מוצרים...</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <p className="text-gray-600 text-lg mb-4">לא נמצאו מוצרים</p>
          <Link
            href="/admin/products/new"
            className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
          >
            הוסף מוצר ראשון
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Carpets Section */}
          {carpetProducts.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">שטיחים ({carpetProducts.length})</h2>
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={(e) => handleDragEnd(e, 'carpets')}
              >
                <SortableContext items={carpetProducts.map(p => p.id)} strategy={verticalListSortingStrategy}>
                  <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50 border-b">
                          <tr>
                            <th className="px-2 py-4 w-10"></th>
                            <th className="px-4 py-4 text-center w-12">
                              <button
                                onClick={() => {
                                  const allSelected = carpetProducts.every(p => selectedIds.has(p.id));
                                  setSelectedIds(prev => {
                                    const next = new Set(prev);
                                    carpetProducts.forEach(p => allSelected ? next.delete(p.id) : next.add(p.id));
                                    return next;
                                  });
                                }}
                                className="text-gray-600 hover:text-primary-600 transition-colors"
                              >
                                {carpetProducts.every(p => selectedIds.has(p.id)) ? (
                                  <FaCheckSquare className="text-xl text-primary-600" />
                                ) : (
                                  <FaSquare className="text-xl" />
                                )}
                              </button>
                            </th>
                            <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">שם המוצר</th>
                            <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">צבעים</th>
                            <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">סגנון</th>
                            <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">מלאי</th>
                            <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">סטטוס</th>
                            <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">פעולות</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {carpetProducts.map((product) => (
                            <SortableProductRow
                              key={product.id}
                              product={product}
                              isSelected={selectedIds.has(product.id)}
                              toggleSelect={toggleSelect}
                              handleDelete={handleDelete}
                            />
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </SortableContext>
              </DndContext>
            </div>
          )}

          {/* Plants Section */}
          {plantProducts.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">עציצים ({plantProducts.length})</h2>
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={(e) => handleDragEnd(e, 'plants')}
              >
                <SortableContext items={plantProducts.map(p => p.id)} strategy={verticalListSortingStrategy}>
                  <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50 border-b">
                          <tr>
                            <th className="px-2 py-4 w-10"></th>
                            <th className="px-4 py-4 text-center w-12">
                              <button
                                onClick={() => {
                                  const allSelected = plantProducts.every(p => selectedIds.has(p.id));
                                  setSelectedIds(prev => {
                                    const next = new Set(prev);
                                    plantProducts.forEach(p => allSelected ? next.delete(p.id) : next.add(p.id));
                                    return next;
                                  });
                                }}
                                className="text-gray-600 hover:text-primary-600 transition-colors"
                              >
                                {plantProducts.every(p => selectedIds.has(p.id)) ? (
                                  <FaCheckSquare className="text-xl text-primary-600" />
                                ) : (
                                  <FaSquare className="text-xl" />
                                )}
                              </button>
                            </th>
                            <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">שם המוצר</th>
                            <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">צבעים</th>
                            <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">סגנון</th>
                            <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">מלאי</th>
                            <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">סטטוס</th>
                            <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">פעולות</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {plantProducts.map((product) => (
                            <SortableProductRow
                              key={product.id}
                              product={product}
                              isSelected={selectedIds.has(product.id)}
                              toggleSelect={toggleSelect}
                              handleDelete={handleDelete}
                            />
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </SortableContext>
              </DndContext>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function SortableProductRow({
  product,
  isSelected,
  toggleSelect,
  handleDelete,
}: {
  product: any;
  isSelected: boolean;
  toggleSelect: (id: string) => void;
  handleDelete: (id: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: product.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const colors = product.product_colors?.map((pc: any) => pc.colors?.name).filter(Boolean) || [];
  const categories = product.product_categories?.map((pc: any) => pc.categories?.name).filter(Boolean) || [];

  return (
    <tr
      ref={setNodeRef}
      style={style}
      className={`hover:bg-gray-50 ${isSelected ? 'bg-blue-50' : ''} ${isDragging ? 'bg-primary-50' : ''}`}
    >
      <td className="px-2 py-4 text-center">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 p-1"
          title="גרור לשינוי סדר"
        >
          <FaGripVertical />
        </button>
      </td>
      <td className="px-4 py-4 text-center">
        <button
          onClick={() => toggleSelect(product.id)}
          className="text-gray-600 hover:text-primary-600 transition-colors"
        >
          {isSelected ? (
            <FaCheckSquare className="text-xl text-primary-600" />
          ) : (
            <FaSquare className="text-xl" />
          )}
        </button>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center">
          <div className="h-12 w-12 bg-gray-200 rounded flex-shrink-0 ml-4 overflow-hidden">
            {product.product_images?.length > 0 ? (
              <img
                src={product.product_images[0].image_url}
                alt={product.product_images[0].alt_text || product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                אין תמונה
              </div>
            )}
          </div>
          <div className="font-medium text-gray-900">{product.name}</div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="text-sm text-gray-700">{colors.length > 0 ? colors.join(', ') : '-'}</div>
      </td>
      <td className="px-6 py-4">
        <div className="text-sm text-gray-700">{categories.length > 0 ? categories.join(', ') : '-'}</div>
      </td>
      <td className="px-6 py-4">
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            product.total_stock > 10
              ? 'bg-green-100 text-green-800'
              : product.total_stock > 0
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {product.total_stock} יחידות
        </span>
      </td>
      <td className="px-6 py-4">
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            product.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
          }`}
        >
          {product.is_active ? 'פעיל' : 'לא פעיל'}
        </span>
      </td>
      <td className="px-6 py-4">
        <div className="flex gap-2">
          <Link
            href={`/admin/products/${product.id}`}
            className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors flex items-center gap-1 text-sm"
          >
            <FaEdit />
            ערוך
          </Link>
          <button
            onClick={() => handleDelete(product.id)}
            className="text-red-600 hover:text-red-800 p-2"
            title="מחק"
          >
            <FaTrash />
          </button>
        </div>
      </td>
    </tr>
  );
}
