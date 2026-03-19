'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { FaSave, FaArrowRight } from 'react-icons/fa';
import { supabase, Order, OrderItem } from '@/lib/supabase';

const STATUS_OPTIONS = [
  { value: 'pending', label: 'ממתין' },
  { value: 'processing', label: 'בטיפול' },
  { value: 'shipped', label: 'נשלח' },
  { value: 'delivered', label: 'נמסר' },
  { value: 'cancelled', label: 'בוטל' },
];

const PAYMENT_STATUS_LABELS: Record<string, string> = {
  pending: 'ממתין',
  paid: 'שולם',
  failed: 'נכשל',
  refunded: 'הוחזר',
};

const PAYMENT_STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  paid: 'bg-green-100 text-green-800',
  failed: 'bg-red-100 text-red-800',
  refunded: 'bg-orange-100 text-orange-800',
};

export default function OrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();

      if (orderError) throw orderError;

      setOrder(orderData);
      setStatus(orderData.status);
      setNotes(orderData.notes || '');

      const { data: itemsData, error: itemsError } = await supabase
        .from('order_items')
        .select('*')
        .eq('order_id', orderId);

      if (itemsError) throw itemsError;
      setItems(itemsData || []);
    } catch (error) {
      console.error('Error fetching order:', error);
      alert('שגיאה בטעינת ההזמנה');
      router.push('/admin/orders');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!order) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from('orders')
        .update({
          status,
          notes,
          updated_at: new Date().toISOString(),
        })
        .eq('id', order.id);

      if (error) throw error;
      alert('ההזמנה עודכנה בהצלחה');
    } catch (error) {
      console.error('Error updating order:', error);
      alert('שגיאה בעדכון ההזמנה');
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('he-IL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!order) return null;

  const billing = (order.billing_address as any) || {};
  const discountAmount = billing.discount_amount || 0;
  const couponCode = billing.coupon_code || null;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/orders"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <FaArrowRight />
            חזרה להזמנות
          </Link>
          <h1 className="text-3xl font-bold text-gray-800">
            הזמנה {order.order_number}
          </h1>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2 font-semibold disabled:opacity-50"
        >
          <FaSave />
          {saving ? 'שומר...' : 'שמור שינויים'}
        </button>
      </div>

      {/* Two column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Order Info */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">פרטי הזמנה</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">תאריך הזמנה</label>
              <div className="text-gray-800">{formatDate(order.created_at)}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">סטטוס הזמנה</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">סטטוס תשלום</label>
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${PAYMENT_STATUS_COLORS[order.payment_status] || 'bg-gray-100 text-gray-800'}`}>
                {PAYMENT_STATUS_LABELS[order.payment_status] || order.payment_status}
              </span>
            </div>
            {order.payment_method && (
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">אמצעי תשלום</label>
                <div className="text-gray-800">{order.payment_method}</div>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">הערות</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="הוסף הערות להזמנה..."
              />
            </div>
          </div>
        </div>

        {/* Customer Info */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">פרטי לקוח</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">שם</label>
              <div className="text-gray-800">{billing.name || '-'}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">אימייל</label>
              <div className="text-gray-800">
                <a href={`mailto:${order.customer_email}`} className="text-primary-600 hover:underline">
                  {order.customer_email}
                </a>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">טלפון</label>
              <div className="text-gray-800">
                {order.customer_phone ? (
                  <a href={`tel:${order.customer_phone}`} className="text-primary-600 hover:underline">
                    {order.customer_phone}
                  </a>
                ) : '-'}
              </div>
            </div>
            {couponCode && (
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">קוד קופון</label>
                <div className="text-gray-800">
                  <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-sm font-medium">
                    {couponCode}
                  </span>
                  {discountAmount > 0 && (
                    <span className="mr-2 text-sm text-gray-500">(-₪{discountAmount.toLocaleString()})</span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">פריטי הזמנה</h2>
        {items.length === 0 ? (
          <p className="text-gray-500">לא נמצאו פריטים</p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">מוצר</th>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">כמות</th>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">מחיר ליחידה</th>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">סה״כ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {items.map((item) => (
                    <tr key={item.id}>
                      <td className="px-6 py-4 font-medium text-gray-900">{item.product_name}</td>
                      <td className="px-6 py-4 text-gray-700">{item.quantity}</td>
                      <td className="px-6 py-4 text-gray-700">₪{item.unit_price.toLocaleString()}</td>
                      <td className="px-6 py-4 font-medium">₪{item.total_price.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="mt-6 border-t pt-4 max-w-sm mr-auto">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">סכום ביניים</span>
                  <span>₪{order.subtotal.toLocaleString()}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>הנחה</span>
                    <span>-₪{discountAmount.toLocaleString()}</span>
                  </div>
                )}
                {order.shipping_cost > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">משלוח</span>
                    <span>₪{order.shipping_cost.toLocaleString()}</span>
                  </div>
                )}
                {order.tax > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">מע״מ</span>
                    <span>₪{order.tax.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold border-t pt-2">
                  <span>סה״כ</span>
                  <span>₪{order.total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
