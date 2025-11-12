'use client';

import { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimes } from 'react-icons/fa';
import { supabase, PlantPetSafety } from '@/lib/supabase';

export default function PlantPetSafetysPage() {
  const [plantTypes, setPlantPetSafetys] = useState<PlantPetSafety[]>([]);
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
    fetchPlantPetSafetys();
  }, []);

  const fetchPlantPetSafetys = async () => {
    try {
      const { data, error } = await supabase
        .from('plant_pet_safety')
        .select('*')
        .order('sort_order');

      if (error) throw error;
      setPlantPetSafetys(data || []);
    } catch (error: any) {
      console.error('Error fetching plant types:', error);
      alert(`שגיאה בטעינת בטיחות לחיות מחמד: ${error.message}`);
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

    if (existingSlug && existingSlug.startsWith(baseSlug)) {
      return existingSlug;
    }

    return `${baseSlug}-${Date.now()}`;
  };

  const handleAdd = async () => {
    try {
      if (!formData.name.trim()) {
        alert('נא למלא את שם רמת הבטיחות');
        return;
      }

      const slug = generateSlug(formData.name);

      const { error } = await supabase.from('plant_pet_safety').insert([
        {
          name: formData.name,
          description: formData.description,
          slug,
          sort_order: formData.sort_order,
          is_active: formData.is_active,
        },
      ]);

      if (error) throw error;

      alert('רמת הבטיחות נוסף בהצלחה!');
      setFormData({ name: '', description: '', sort_order: 0, is_active: true });
      setIsAdding(false);
      fetchPlantPetSafetys();
    } catch (error: any) {
      console.error('Error adding plant type:', error);
      alert(`שגיאה בהוספת רמת בטיחות: ${error.message}`);
    }
  };

  const handleUpdate = async (id: string) => {
    try {
      const plantType = plantTypes.find((pt) => pt.id === id);
      if (!plantType) return;

      const slug = generateSlug(plantType.name, plantType.slug);

      const { error } = await supabase
        .from('plant_pet_safety')
        .update({
          name: plantType.name,
          description: plantType.description,
          slug,
          sort_order: plantType.sort_order,
          is_active: plantType.is_active,
        })
        .eq('id', id);

      if (error) throw error;

      alert('רמת הבטיחות עודכן בהצלחה!');
      setEditingId(null);
      fetchPlantPetSafetys();
    } catch (error: any) {
      console.error('Error updating plant type:', error);
      alert(`שגיאה בעדכון רמת בטיחות: ${error.message}`);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('האם אתה בטוח שברצונך למחוק רמת בטיחות זה?')) return;

    try {
      const { error } = await supabase.from('plant_pet_safety').delete().eq('id', id);

      if (error) throw error;

      alert('רמת הבטיחות נמחק בהצלחה!');
      fetchPlantPetSafetys();
    } catch (error: any) {
      console.error('Error deleting plant type:', error);
      alert(`שגיאה במחיקת רמת בטיחות: ${error.message}`);
    }
  };

  const updatePlantPetSafety = (id: string, field: string, value: any) => {
    setPlantPetSafetys(
      plantTypes.map((pt) =>
        pt.id === id ? { ...pt, [field]: value } : pt
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
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">ניהול בטיחות לחיות מחמד</h1>
          <p className="text-gray-600 mt-2">נהל את סוגי הצמחים הזמינים</p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="bg-terracotta text-white px-6 py-3 rounded-lg hover:bg-terracotta-dark transition-colors flex items-center gap-2 font-semibold"
        >
          <FaPlus />
          הוסף רמת בטיחות חדש
        </button>
      </div>

      {isAdding && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">רמת בטיחות חדש</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                שם רמת הבטיחות <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="לדוגמה: צמחי בית"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">סדר תצוגה</label>
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
              <label className="block text-gray-700 font-medium mb-2">תיאור</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="תיאור רמת הבטיחות (אופציונלי)"
              />
            </div>

            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <span className="mr-3 text-gray-700">רמת בטיחות פעיל</span>
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

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">שם</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">תיאור</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">סדר</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">סטטוס</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">פעולות</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {plantTypes.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  אין בטיחות לחיות מחמד עדיין. לחץ על "הוסף רמת בטיחות חדש" כדי להתחיל.
                </td>
              </tr>
            ) : (
              plantTypes.map((plantType) => (
                <tr key={plantType.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingId === plantType.id ? (
                      <input
                        type="text"
                        value={plantType.name}
                        onChange={(e) => updatePlantPetSafety(plantType.id, 'name', e.target.value)}
                        className="w-full px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    ) : (
                      <div className="text-sm font-medium text-gray-900">{plantType.name}</div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {editingId === plantType.id ? (
                      <textarea
                        value={plantType.description || ''}
                        onChange={(e) => updatePlantPetSafety(plantType.id, 'description', e.target.value)}
                        rows={2}
                        className="w-full px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    ) : (
                      <div className="text-sm text-gray-500">{plantType.description || '-'}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingId === plantType.id ? (
                      <input
                        type="number"
                        value={plantType.sort_order}
                        onChange={(e) =>
                          updatePlantPetSafety(plantType.id, 'sort_order', parseInt(e.target.value) || 0)
                        }
                        className="w-20 px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    ) : (
                      <div className="text-sm text-gray-900">{plantType.sort_order}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingId === plantType.id ? (
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={plantType.is_active}
                          onChange={(e) => updatePlantPetSafety(plantType.id, 'is_active', e.target.checked)}
                          className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                        />
                        <span className="mr-2 text-sm text-gray-700">פעיל</span>
                      </label>
                    ) : (
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          plantType.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {plantType.is_active ? 'פעיל' : 'לא פעיל'}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {editingId === plantType.id ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleUpdate(plantType.id)}
                          className="text-green-600 hover:text-green-900"
                          title="שמור"
                        >
                          <FaSave />
                        </button>
                        <button
                          onClick={() => {
                            setEditingId(null);
                            fetchPlantPetSafetys();
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
                          onClick={() => setEditingId(plantType.id)}
                          className="text-primary-600 hover:text-primary-900"
                          title="ערוך"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(plantType.id)}
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
