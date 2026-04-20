'use client';

import { useState, useEffect } from 'react';
import { adminFetch } from '@/lib/admin-api';
import { FaPlus, FaEdit, FaTrash, FaTicketAlt, FaCheck, FaTimes } from 'react-icons/fa';
import Link from 'next/link';

type PromoCode = {
  id: string;
  code: string;
  discount_type: 'percentage' | 'fixed' | 'free_shipping';
  discount_value: number;
  min_purchase_amount: number;
  max_uses: number;
  current_uses: number;
  uses_per_customer: number;
  is_active: boolean;
  expires_at?: string;
  applies_to_all: boolean;
  created_at: string;
  updated_at: string;
};

type ProductOption = {
  id: string;
  name: string;
  price: number;
  product_images?: { image_url: string; sort_order: number }[];
};

export default function PromoCodesPage() {
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCode, setEditingCode] = useState<PromoCode | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    code: '',
    discount_type: 'percentage' as 'percentage' | 'fixed' | 'free_shipping',
    discount_value: 10,
    min_purchase_amount: 0,
    max_uses: 100,
    uses_per_customer: 1,
    is_active: true,
    expires_at: '',
    applies_to_all: true,
  });

  // Per-product targeting
  const [products, setProducts] = useState<ProductOption[]>([]);
  const [selectedProductIds, setSelectedProductIds] = useState<Set<string>>(new Set());
  const [productSearch, setProductSearch] = useState('');

  useEffect(() => {
    fetchPromoCodes();
    fetchProductsForPicker();
  }, []);

  const fetchProductsForPicker = async () => {
    try {
      const { data } = await adminFetch<{ data: ProductOption[] }>('products', {
        params: { filter_column: 'is_active', filter_value: 'true', select: 'id,name,price,product_images(image_url,sort_order)', order_by: 'name' },
      });
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products for picker:', error);
    }
  };

  const fetchProductIdsForCode = async (codeId: string) => {
    try {
      const { data } = await adminFetch<{ data: { product_id: string }[] }>('promo_code_products', {
        params: { filter_column: 'promo_code_id', filter_value: codeId, select: 'product_id' },
      });
      return new Set((data || []).map((r) => r.product_id));
    } catch (error) {
      console.error('Error fetching product targeting:', error);
      return new Set<string>();
    }
  };

  const fetchPromoCodes = async () => {
    try {
      const { data } = await adminFetch('promo_codes', { params: { order_by: 'created_at', order_dir: 'desc' } });
      setPromoCodes(data || []);
    } catch (error) {
      console.error('Error fetching promo codes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Free shipping is always sitewide
    const isFreeShipping = formData.discount_type === 'free_shipping';
    const appliesToAll = isFreeShipping ? true : formData.applies_to_all;

    if (!appliesToAll && selectedProductIds.size === 0) {
      alert('יש לבחור לפחות מוצר אחד או לשנות את הקוד לחל על כל המוצרים');
      return;
    }

    try {
      const dataToSubmit = {
        ...formData,
        applies_to_all: appliesToAll,
        code: formData.code.toUpperCase(),
        expires_at: formData.expires_at || null,
      };

      let codeId: string;
      if (editingCode) {
        await adminFetch('promo_codes', { method: 'PUT', data: { id: editingCode.id, ...dataToSubmit } });
        codeId = editingCode.id;
      } else {
        const result = await adminFetch<{ data: { id: string }[] }>('promo_codes', { method: 'POST', data: dataToSubmit });
        codeId = result.data?.[0]?.id;
        if (!codeId) throw new Error('לא ניתן לקבל את מזהה הקוד החדש');
      }

      // Sync product targeting: clear existing then re-insert if scoped
      await adminFetch('promo_code_products', {
        method: 'DELETE',
        params: { filter_column: 'promo_code_id', filter_value: codeId },
      });

      if (!appliesToAll && selectedProductIds.size > 0) {
        const rows = Array.from(selectedProductIds).map((product_id) => ({
          promo_code_id: codeId,
          product_id,
        }));
        await adminFetch('promo_code_products', { method: 'POST', data: rows });
      }

      alert(editingCode ? 'קוד ההנחה עודכן בהצלחה!' : 'קוד ההנחה נוסף בהצלחה!');

      setShowForm(false);
      setEditingCode(null);
      resetForm();
      fetchPromoCodes();
    } catch (error: any) {
      console.error('Error saving promo code:', error);
      alert('שגיאה בשמירת קוד ההנחה: ' + error.message);
    }
  };

  const handleEdit = async (code: PromoCode) => {
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
      applies_to_all: code.applies_to_all !== false,
    });
    setProductSearch('');
    setSelectedProductIds(code.applies_to_all === false ? await fetchProductIdsForCode(code.id) : new Set());
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('האם אתה בטוח שברצונך למחוק את קוד ההנחה?')) return;

    try {
      await adminFetch('promo_codes', { method: 'DELETE', params: { id } });
      alert('קוד ההנחה נמחק בהצלחה!');
      fetchPromoCodes();
    } catch (error: any) {
      console.error('Error deleting promo code:', error);
      alert('שגיאה במחיקת קוד ההנחה: ' + error.message);
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      await adminFetch('promo_codes', { method: 'PUT', data: { id, is_active: !currentStatus } });
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
      applies_to_all: true,
    });
    setSelectedProductIds(new Set());
    setProductSearch('');
  };

  const toggleProduct = (id: string) => {
    setSelectedProductIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
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
                  onChange={(e) => setFormData({ ...formData, discount_type: e.target.value as 'percentage' | 'fixed' | 'free_shipping' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  <option value="percentage">אחוזים (%)</option>
                  <option value="fixed">סכום קבוע (₪)</option>
                  <option value="free_shipping">משלוח חינם</option>
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
                  {formData.discount_type === 'percentage' ? 'אחוזים (לדוגמה: 10 = 10%)' : formData.discount_type === 'free_shipping' ? 'לא נדרש ערך' : 'שקלים (לדוגמה: 50 = ₪50)'}
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

            {/* Scope: all products vs selected products */}
            {formData.discount_type !== 'free_shipping' && (
              <div className="border-t border-gray-200 pt-4">
                <label className="block text-sm font-medium text-gray-700 mb-3">חלות הקוד</label>
                <div className="flex flex-col gap-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="scope"
                      checked={formData.applies_to_all}
                      onChange={() => setFormData({ ...formData, applies_to_all: true })}
                      className="w-4 h-4 text-primary-600"
                    />
                    <span className="text-gray-700">חל על כל המוצרים</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="scope"
                      checked={!formData.applies_to_all}
                      onChange={() => setFormData({ ...formData, applies_to_all: false })}
                      className="w-4 h-4 text-primary-600"
                    />
                    <span className="text-gray-700">חל על מוצרים נבחרים בלבד</span>
                  </label>
                </div>

                {!formData.applies_to_all && (
                  <div className="mt-4 border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <div className="flex items-center justify-between mb-3 gap-4">
                      <input
                        type="text"
                        value={productSearch}
                        onChange={(e) => setProductSearch(e.target.value)}
                        placeholder="חיפוש מוצרים..."
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      />
                      <span className="text-sm text-gray-600 whitespace-nowrap">
                        נבחרו {selectedProductIds.size}
                      </span>
                    </div>
                    <div className="max-h-80 overflow-y-auto bg-white rounded-lg border border-gray-200 divide-y divide-gray-100">
                      {products
                        .filter((p) => p.name.toLowerCase().includes(productSearch.trim().toLowerCase()))
                        .map((p) => {
                          const checked = selectedProductIds.has(p.id);
                          const img = p.product_images?.sort((a, b) => a.sort_order - b.sort_order)?.[0]?.image_url;
                          return (
                            <label
                              key={p.id}
                              className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-50 ${checked ? 'bg-primary-50' : ''}`}
                            >
                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={() => toggleProduct(p.id)}
                                className="w-4 h-4 text-primary-600 border-gray-300 rounded"
                              />
                              {img ? (
                                <img src={img} alt={p.name} className="w-10 h-10 rounded object-cover border border-gray-100" />
                              ) : (
                                <div className="w-10 h-10 rounded bg-gray-100" />
                              )}
                              <span className="flex-1 text-sm text-gray-800 font-medium">{p.name}</span>
                              <span className="text-xs text-gray-500 whitespace-nowrap">₪{(p.price || 0).toLocaleString()}</span>
                            </label>
                          );
                        })}
                      {products.length === 0 && (
                        <div className="p-4 text-center text-gray-400 text-sm">אין מוצרים זמינים</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

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
                          : code.discount_type === 'free_shipping'
                          ? 'משלוח חינם'
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
