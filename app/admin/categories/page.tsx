'use client';

import { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimes } from 'react-icons/fa';
import { supabase, Category } from '@/lib/supabase';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    sort_order: 0,
    is_active: true,
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('sort_order');

      if (error) throw error;
      setCategories(data || []);
    } catch (error: any) {
      console.error('Error fetching categories:', error);
      alert(`שגיאה בטעינת קטגוריות: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleAdd = async () => {
    try {
      if (!formData.name.trim()) {
        alert('נא למלא את שם הקטגוריה');
        return;
      }

      const slug = generateSlug(formData.name);

      const { error } = await supabase.from('categories').insert([
        {
          name: formData.name,
          description: formData.description,
          slug,
          sort_order: formData.sort_order,
          is_active: formData.is_active,
        },
      ]);

      if (error) throw error;

      alert('הקטגוריה נוספה בהצלחה!');
      setFormData({ name: '', description: '', sort_order: 0, is_active: true });
      setIsAdding(false);
      fetchCategories();
    } catch (error: any) {
      console.error('Error adding category:', error);
      alert(`שגיאה בהוספת קטגוריה: ${error.message}`);
    }
  };

  const handleUpdate = async (id: string) => {
    try {
      const category = categories.find((c) => c.id === id);
      if (!category) return;

      const slug = generateSlug(category.name);

      const { error } = await supabase
        .from('categories')
        .update({
          name: category.name,
          description: category.description,
          slug,
          sort_order: category.sort_order,
          is_active: category.is_active,
        })
        .eq('id', id);

      if (error) throw error;

      alert('הקטגוריה עודכנה בהצלחה!');
      setEditingId(null);
      fetchCategories();
    } catch (error: any) {
      console.error('Error updating category:', error);
      alert(`שגיאה בעדכון קטגוריה: ${error.message}`);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('האם אתה בטוח שברצונך למחוק קטגוריה זו?')) return;

    try {
      const { error } = await supabase.from('categories').delete().eq('id', id);

      if (error) throw error;

      alert('הקטגוריה נמחקה בהצלחה!');
      fetchCategories();
    } catch (error: any) {
      console.error('Error deleting category:', error);
      alert(`שגיאה במחיקת קטגוריה: ${error.message}`);
    }
  };

  const updateCategory = (id: string, field: string, value: any) => {
    setCategories(
      categories.map((cat) =>
        cat.id === id ? { ...cat, [field]: value } : cat
      )
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">ניהול קטגוריות</h1>
          <p className="text-gray-600 mt-2">נהל את הקטגוריות של המוצרים</p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="bg-terracotta text-white px-6 py-3 rounded-lg hover:bg-terracotta-dark transition-colors flex items-center gap-2 font-semibold"
        >
          <FaPlus />
          הוסף קטגוריה חדשה
        </button>
      </div>

      {/* Add New Category Form */}
      {isAdding && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            קטגוריה חדשה
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                שם הקטגוריה <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="לדוגמה: שטיחים מודרניים"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                סדר תצוגה
              </label>
              <input
                type="number"
                value={formData.sort_order}
                onChange={(e) =>
                  setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-gray-700 font-medium mb-2">
                תיאור
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="תיאור הקטגוריה (אופציונלי)"
              />
            </div>

            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) =>
                    setFormData({ ...formData, is_active: e.target.checked })
                  }
                  className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <span className="mr-3 text-gray-700">קטגוריה פעילה</span>
              </label>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleAdd}
              className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2"
            >
              <FaSave />
              שמור
            </button>
            <button
              onClick={() => {
                setIsAdding(false);
                setFormData({ name: '', description: '', sort_order: 0, is_active: true });
              }}
              className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors flex items-center gap-2"
            >
              <FaTimes />
              ביטול
            </button>
          </div>
        </div>
      )}

      {/* Categories List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                שם
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                תיאור
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                סדר
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                סטטוס
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                פעולות
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {categories.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  אין קטגוריות עדיין. לחץ על "הוסף קטגוריה חדשה" כדי להתחיל.
                </td>
              </tr>
            ) : (
              categories.map((category) => (
                <tr key={category.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingId === category.id ? (
                      <input
                        type="text"
                        value={category.name}
                        onChange={(e) =>
                          updateCategory(category.id, 'name', e.target.value)
                        }
                        className="w-full px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    ) : (
                      <div className="text-sm font-medium text-gray-900">
                        {category.name}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {editingId === category.id ? (
                      <textarea
                        value={category.description || ''}
                        onChange={(e) =>
                          updateCategory(category.id, 'description', e.target.value)
                        }
                        rows={2}
                        className="w-full px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    ) : (
                      <div className="text-sm text-gray-500">
                        {category.description || '-'}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingId === category.id ? (
                      <input
                        type="number"
                        value={category.sort_order}
                        onChange={(e) =>
                          updateCategory(
                            category.id,
                            'sort_order',
                            parseInt(e.target.value) || 0
                          )
                        }
                        className="w-20 px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    ) : (
                      <div className="text-sm text-gray-900">
                        {category.sort_order}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingId === category.id ? (
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={category.is_active}
                          onChange={(e) =>
                            updateCategory(category.id, 'is_active', e.target.checked)
                          }
                          className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                        />
                        <span className="mr-2 text-sm text-gray-700">פעיל</span>
                      </label>
                    ) : (
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          category.is_active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {category.is_active ? 'פעיל' : 'לא פעיל'}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {editingId === category.id ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleUpdate(category.id)}
                          className="text-green-600 hover:text-green-900"
                          title="שמור"
                        >
                          <FaSave />
                        </button>
                        <button
                          onClick={() => {
                            setEditingId(null);
                            fetchCategories();
                          }}
                          className="text-gray-600 hover:text-gray-900"
                          title="ביטול"
                        >
                          <FaTimes />
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          onClick={() => setEditingId(category.id)}
                          className="text-primary-600 hover:text-primary-900"
                          title="ערוך"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(category.id)}
                          className="text-red-600 hover:text-red-900"
                          title="מחק"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
