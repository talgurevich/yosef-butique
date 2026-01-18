'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FaPlus, FaEdit, FaTrash, FaUpload, FaCheckSquare, FaSquare } from 'react-icons/fa';
import { supabase, Product } from '@/lib/supabase';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          product_images (
            id,
            image_url,
            alt_text,
            sort_order
          ),
          product_colors (
            colors (
              id,
              name
            )
          ),
          product_categories (
            categories (
              id,
              name
            )
          ),
          product_spaces (
            spaces (
              id,
              name
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Sort images by sort_order
      const productsWithSortedImages = data?.map(product => ({
        ...product,
        product_images: (product as any).product_images?.sort((a: any, b: any) => a.sort_order - b.sort_order) || []
      }));

      setProducts(productsWithSortedImages as any || []);
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
      const { error } = await supabase.from('products').delete().eq('id', id);

      if (error) throw error;

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
      const { error } = await supabase
        .from('products')
        .delete()
        .in('id', idsArray);

      if (error) throw error;

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
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredProducts.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredProducts.map(p => p.id)));
    }
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">ניהול מוצרים</h1>
          <p className="text-gray-600 mt-2">
            סך הכל {products.length} מוצרים במערכת
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
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
            <p className="mt-4 text-gray-600">טוען מוצרים...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-gray-600 text-lg mb-4">לא נמצאו מוצרים</p>
            <Link
              href="/admin/products/new"
              className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
            >
              הוסף מוצר ראשון
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-4 text-center w-12">
                    <button
                      onClick={toggleSelectAll}
                      className="text-gray-600 hover:text-primary-600 transition-colors"
                      title={selectedIds.size === filteredProducts.length ? 'בטל בחירה' : 'בחר הכל'}
                    >
                      {selectedIds.size === filteredProducts.length && filteredProducts.length > 0 ? (
                        <FaCheckSquare className="text-xl text-primary-600" />
                      ) : (
                        <FaSquare className="text-xl" />
                      )}
                    </button>
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                    שם המוצר
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                    צבעים
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                    סגנון
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                    חלל
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                    מחיר
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                    מלאי
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                    סטטוס
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                    פעולות
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredProducts.map((product) => {
                  const colors = (product as any).product_colors?.map((pc: any) => pc.colors?.name).filter(Boolean) || [];
                  const categories = (product as any).product_categories?.map((pc: any) => pc.categories?.name).filter(Boolean) || [];
                  const spaces = (product as any).product_spaces?.map((ps: any) => ps.spaces?.name).filter(Boolean) || [];

                  return (
                  <tr key={product.id} className={`hover:bg-gray-50 ${selectedIds.has(product.id) ? 'bg-blue-50' : ''}`}>
                    <td className="px-4 py-4 text-center">
                      <button
                        onClick={() => toggleSelect(product.id)}
                        className="text-gray-600 hover:text-primary-600 transition-colors"
                      >
                        {selectedIds.has(product.id) ? (
                          <FaCheckSquare className="text-xl text-primary-600" />
                        ) : (
                          <FaSquare className="text-xl" />
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-12 w-12 bg-gray-200 rounded flex-shrink-0 ml-4 overflow-hidden">
                          {(product as any).product_images && (product as any).product_images.length > 0 ? (
                            <img
                              src={(product as any).product_images[0].image_url}
                              alt={(product as any).product_images[0].alt_text || product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                              אין תמונה
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {product.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-700">
                        {colors.length > 0 ? colors.join(', ') : '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-700">
                        {categories.length > 0 ? categories.join(', ') : '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-700">
                        {spaces.length > 0 ? spaces.join(', ') : '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-700 font-semibold">
                      ₪{product.price.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          product.stock_quantity > 10
                            ? 'bg-green-100 text-green-800'
                            : product.stock_quantity > 0
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {product.stock_quantity} יחידות
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          product.is_active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
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
                          title="ערוך וניהול מידות"
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
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
