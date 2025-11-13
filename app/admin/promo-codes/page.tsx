'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { FaPlus, FaEdit, FaTrash, FaTicketAlt, FaCheck, FaTimes } from 'react-icons/fa';
import Link from 'next/link';

type PromoCode = {
  id: string;
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_purchase_amount: number;
  max_uses: number;
  current_uses: number;
  uses_per_customer: number;
  is_active: boolean;
  expires_at?: string;
  created_at: string;
  updated_at: string;
};

export default function PromoCodesPage() {
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCode, setEditingCode] = useState<PromoCode | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    code: '',
    discount_type: 'percentage' as 'percentage' | 'fixed',
    discount_value: 10,
    min_purchase_amount: 0,
    max_uses: 100,
    uses_per_customer: 1,
    is_active: true,
    expires_at: '',
  });

  useEffect(() => {
    fetchPromoCodes();
  }, []);

  const fetchPromoCodes = async () => {
    try {
      const { data, error } = await supabase
        .from('promo_codes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPromoCodes(data || []);
    } catch (error) {
      console.error('Error fetching promo codes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const dataToSubmit = {
        ...formData,
        code: formData.code.toUpperCase(),
        expires_at: formData.expires_at || null,
      };

      if (editingCode) {
        // Update existing code
        const { error } = await supabase
          .from('promo_codes')
          .update(dataToSubmit)
          .eq('id', editingCode.id);

        if (error) throw error;
        alert('קוד ההנחה עודכן בהצלחה!');
      } else {
        // Create new code (current_uses will default to 0 in the database)
        const { error } = await supabase
          .from('promo_codes')
          .insert([dataToSubmit]);

        if (error) throw error;
        alert('קוד ההנחה נוסף בהצלחה!');
      }

      setShowForm(false);
      setEditingCode(null);
      resetForm();
      fetchPromoCodes();
    } catch (error: any) {
      console.error('Error saving promo code:', error);
      alert('שגיאה בשמירת קוד ההנחה: ' + error.message);
    }
  };

  const handleEdit = (code: PromoCode) => {
    setEditingCode(code);
    setFormData({
      code: code.code,
      discount_type: code.discount_type,
      discount_value: code.discount_value,
      min_purchase_amount: code.min_purchase_amount,
      max_uses: code.max_uses,
      uses_per_customer: code.uses_per_customer,
      is_active: code.is_active,
      expires_at: code.expires_at ? code.expires_at.split('T')[0] : '',
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('האם אתה בטוח שברצונך למחוק את קוד ההנחה?')) return;

    try {
      const { error } = await supabase
        .from('promo_codes')
        .delete()
        .eq('id', id);

      if (error) throw error;
      alert('קוד ההנחה נמחק בהצלחה!');
      fetchPromoCodes();
    } catch (error: any) {
      console.error('Error deleting promo code:', error);
      alert('שגיאה במחיקת קוד ההנחה: ' + error.message);
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('promo_codes')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (error) throw error;
      fetchPromoCodes();
    } catch (error: any) {
      console.error('Error updating promo code:', error);
      alert('שגיאה בעדכון קוד ההנחה: ' + error.message);
    }
  };

  const resetForm = () => {
    setFormData({
      code: '',
      discount_type: 'percentage',
      discount_value: 10,
      min_purchase_amount: 0,
      max_uses: 100,
      uses_per_customer: 1,
      is_active: true,
      expires_at: '',
    });
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingCode(null);
    resetForm();
  };

  const isExpired = (expiresAt?: string) => {
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">קודי הנחה</h1>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2"
          >
            <FaPlus />
            קוד הנחה חדש
          </button>
        )}
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            {editingCode ? 'ערוך קוד הנחה' : 'קוד הנחה חדש'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Code */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  קוד הנחה *
                </label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="SUMMER2024"
                  required
                />
              </div>

              {/* Discount Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  סוג הנחה *
                </label>
                <select
                  value={formData.discount_type}
                  onChange={(e) => setFormData({ ...formData, discount_type: e.target.value as 'percentage' | 'fixed' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  <option value="percentage">אחוזים (%)</option>
                  <option value="fixed">סכום קבוע (₪)</option>
                </select>
              </div>

              {/* Discount Value */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ערך הנחה *
                </label>
                <input
                  type="number"
                  value={formData.discount_value}
                  onChange={(e) => setFormData({ ...formData, discount_value: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  min="0"
                  step="0.01"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.discount_type === 'percentage' ? 'אחוזים (לדוגמה: 10 = 10%)' : 'שקלים (לדוגמה: 50 = ₪50)'}
                </p>
              </div>

              {/* Min Purchase */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  סכום רכישה מינימלי (₪)
                </label>
                <input
                  type="number"
                  value={formData.min_purchase_amount}
                  onChange={(e) => setFormData({ ...formData, min_purchase_amount: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  min="0"
                  step="0.01"
                />
              </div>

              {/* Max Uses */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  מקסימום שימושים
                </label>
                <input
                  type="number"
                  value={formData.max_uses}
                  onChange={(e) => setFormData({ ...formData, max_uses: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  min="1"
                />
              </div>

              {/* Uses Per Customer */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  שימושים ללקוח
                </label>
                <input
                  type="number"
                  value={formData.uses_per_customer}
                  onChange={(e) => setFormData({ ...formData, uses_per_customer: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  min="1"
                />
              </div>

              {/* Expires At */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  תאריך תפוגה (אופציונלי)
                </label>
                <input
                  type="date"
                  value={formData.expires_at}
                  onChange={(e) => setFormData({ ...formData, expires_at: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>

              {/* Is Active */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <label htmlFor="is_active" className="mr-2 text-sm font-medium text-gray-700">
                  פעיל
                </label>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
              >
                {editingCode ? 'עדכן' : 'צור'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors"
              >
                ביטול
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Promo Codes List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">קוד</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">הנחה</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">מינימום</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">שימושים</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">תפוגה</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">סטטוס</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">פעולות</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {promoCodes.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    <FaTicketAlt className="mx-auto text-4xl mb-2 text-gray-300" />
                    <p>אין קודי הנחה</p>
                  </td>
                </tr>
              ) : (
                promoCodes.map((code) => (
                  <tr key={code.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-mono font-bold text-primary-600">{code.code}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {code.discount_type === 'percentage'
                          ? `${code.discount_value}%`
                          : `₪${code.discount_value}`}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {code.min_purchase_amount > 0 ? `₪${code.min_purchase_amount}` : '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {code.current_uses ?? 0} / {code.max_uses}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {code.expires_at ? (
                          <span className={isExpired(code.expires_at) ? 'text-red-600' : ''}>
                            {new Date(code.expires_at).toLocaleDateString('he-IL')}
                          </span>
                        ) : (
                          'אין תפוגה'
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => toggleActive(code.id, code.is_active)}
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                          code.is_active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {code.is_active ? <FaCheck /> : <FaTimes />}
                        {code.is_active ? 'פעיל' : 'לא פעיל'}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(code)}
                          className="text-blue-600 hover:text-blue-900"
                          title="ערוך"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(code.id)}
                          className="text-red-600 hover:text-red-900"
                          title="מחק"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
