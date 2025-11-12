'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FaPlus, FaEdit, FaTrash, FaUpload } from 'react-icons/fa';
import { supabase, Product } from '@/lib/supabase';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
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
      alert('המוצר נמחק בהצלחה');
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('שגיאה במחיקת המוצר');
    }
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase())
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

      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <input
          type="text"
          placeholder="חפש מוצר לפי שם או מק״ט..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
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
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                    שם המוצר
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                    מק״ט
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
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-12 w-12 bg-gray-200 rounded flex-shrink-0 ml-4"></div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {product.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {product.size} | {product.material}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-700">{product.sku}</td>
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
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
