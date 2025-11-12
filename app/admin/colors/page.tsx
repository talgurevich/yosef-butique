'use client';

import { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimes } from 'react-icons/fa';
import { supabase, Color } from '@/lib/supabase';

export default function ColorsPage() {
  const [colors, setColors] = useState<Color[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    hex_code: '',
    sort_order: 0,
    is_active: true,
  });

  useEffect(() => {
    fetchColors();
  }, []);

  const fetchColors = async () => {
    try {
      const { data, error } = await supabase
        .from('colors')
        .select('*')
        .order('sort_order');

      if (error) throw error;
      setColors(data || []);
    } catch (error: any) {
      console.error('Error fetching colors:', error);
      alert(`שגיאה בטעינת צבעים: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (name: string, existingSlug?: string) => {
    const baseSlug = name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

    // If the slug hasn't changed, keep using it
    if (existingSlug && existingSlug.startsWith(baseSlug)) {
      return existingSlug;
    }

    // Add timestamp to ensure uniqueness
    return `${baseSlug}-${Date.now()}`;
  };

  const handleAdd = async () => {
    try {
      if (!formData.name.trim()) {
        alert('נא למלא את שם הצבע');
        return;
      }

      const slug = generateSlug(formData.name);

      const { error } = await supabase.from('colors').insert([
        {
          name: formData.name,
          hex_code: formData.hex_code || null,
          slug,
          sort_order: formData.sort_order,
          is_active: formData.is_active,
        },
      ]);

      if (error) throw error;

      alert('הצבע נוסף בהצלחה!');
      setFormData({ name: '', hex_code: '', sort_order: 0, is_active: true });
      setIsAdding(false);
      fetchColors();
    } catch (error: any) {
      console.error('Error adding color:', error);
      alert(`שגיאה בהוספת צבע: ${error.message}`);
    }
  };

  const handleUpdate = async (id: string) => {
    try {
      const color = colors.find((c) => c.id === id);
      if (!color) return;

      const slug = generateSlug(color.name, color.slug);

      const { error } = await supabase
        .from('colors')
        .update({
          name: color.name,
          hex_code: color.hex_code || null,
          slug,
          sort_order: color.sort_order,
          is_active: color.is_active,
        })
        .eq('id', id);

      if (error) throw error;

      alert('הצבע עודכן בהצלחה!');
      setEditingId(null);
      fetchColors();
    } catch (error: any) {
      console.error('Error updating color:', error);
      alert(`שגיאה בעדכון צבע: ${error.message}`);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('האם אתה בטוח שברצונך למחוק צבע זה?')) return;

    try {
      const { error } = await supabase.from('colors').delete().eq('id', id);

      if (error) throw error;

      alert('הצבע נמחק בהצלחה!');
      fetchColors();
    } catch (error: any) {
      console.error('Error deleting color:', error);
      alert(`שגיאה במחיקת צבע: ${error.message}`);
    }
  };

  const updateColor = (id: string, field: string, value: any) => {
    setColors(
      colors.map((color) =>
        color.id === id ? { ...color, [field]: value } : color
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
          <h1 className="text-3xl font-bold text-gray-800">ניהול צבעים</h1>
          <p className="text-gray-600 mt-2">נהל את הצבעים הזמינים למוצרים</p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="bg-terracotta text-white px-6 py-3 rounded-lg hover:bg-terracotta-dark transition-colors flex items-center gap-2 font-semibold"
        >
          <FaPlus />
          הוסף צבע חדש
        </button>
      </div>

      {/* Add New Color Form */}
      {isAdding && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            צבע חדש
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                שם הצבע <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="לדוגמה: אפור"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                קוד צבע (Hex)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.hex_code}
                  onChange={(e) =>
                    setFormData({ ...formData, hex_code: e.target.value })
                  }
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="#808080"
                />
                {formData.hex_code && (
                  <div
                    className="w-12 h-10 rounded border border-gray-300"
                    style={{ backgroundColor: formData.hex_code }}
                  ></div>
                )}
              </div>
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

            <div>
              <label className="flex items-center mt-8">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) =>
                    setFormData({ ...formData, is_active: e.target.checked })
                  }
                  className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <span className="mr-3 text-gray-700">צבע פעיל</span>
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
                setFormData({ name: '', hex_code: '', sort_order: 0, is_active: true });
              }}
              className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors flex items-center gap-2"
            >
              <FaTimes />
              ביטול
            </button>
          </div>
        </div>
      )}

      {/* Colors List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                שם
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                צבע
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                קוד Hex
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
            {colors.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  אין צבעים עדיין. לחץ על "הוסף צבע חדש" כדי להתחיל.
                </td>
              </tr>
            ) : (
              colors.map((color) => (
                <tr key={color.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingId === color.id ? (
                      <input
                        type="text"
                        value={color.name}
                        onChange={(e) =>
                          updateColor(color.id, 'name', e.target.value)
                        }
                        className="w-full px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    ) : (
                      <div className="text-sm font-medium text-gray-900">
                        {color.name}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {color.hex_code && (
                      <div
                        className="w-12 h-8 rounded border border-gray-300"
                        style={{ backgroundColor: color.hex_code }}
                      ></div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingId === color.id ? (
                      <input
                        type="text"
                        value={color.hex_code || ''}
                        onChange={(e) =>
                          updateColor(color.id, 'hex_code', e.target.value)
                        }
                        className="w-full px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="#808080"
                      />
                    ) : (
                      <div className="text-sm text-gray-500">
                        {color.hex_code || '-'}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingId === color.id ? (
                      <input
                        type="number"
                        value={color.sort_order}
                        onChange={(e) =>
                          updateColor(
                            color.id,
                            'sort_order',
                            parseInt(e.target.value) || 0
                          )
                        }
                        className="w-20 px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    ) : (
                      <div className="text-sm text-gray-900">
                        {color.sort_order}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingId === color.id ? (
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={color.is_active}
                          onChange={(e) =>
                            updateColor(color.id, 'is_active', e.target.checked)
                          }
                          className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                        />
                        <span className="mr-2 text-sm text-gray-700">פעיל</span>
                      </label>
                    ) : (
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          color.is_active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {color.is_active ? 'פעיל' : 'לא פעיל'}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {editingId === color.id ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleUpdate(color.id)}
                          className="text-green-600 hover:text-green-900"
                          title="שמור"
                        >
                          <FaSave />
                        </button>
                        <button
                          onClick={() => {
                            setEditingId(null);
                            fetchColors();
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
                          onClick={() => setEditingId(color.id)}
                          className="text-primary-600 hover:text-primary-900"
                          title="ערוך"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(color.id)}
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
