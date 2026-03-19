'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FaEye, FaFilter } from 'react-icons/fa';
import { supabase, Order } from '@/lib/supabase';

const STATUS_LABELS: Record<string, string> = {
  pending: 'ממתין',
  processing: 'בטיפול',
  shipped: 'נשלח',
  delivered: 'נמסר',
  cancelled: 'בוטל',
};

const PAYMENT_STATUS_LABELS: Record<string, string> = {
  pending: 'ממתין',
  paid: 'שולם',
  failed: 'נכשל',
  refunded: 'הוחזר',
};

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

const PAYMENT_STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  paid: 'bg-green-100 text-green-800',
  failed: 'bg-red-100 text-red-800',
  refunded: 'bg-orange-100 text-orange-800',
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      alert('שגיאה בטעינת ההזמנות');
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      !searchTerm ||
      order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.billing_address as any)?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || order.status === statusFilter;
    const matchesPayment = !paymentFilter || order.payment_status === paymentFilter;
    return matchesSearch && matchesStatus && matchesPayment;
  });

  const paidOrders = orders.filter((o) => o.payment_status === 'paid');
  const pendingOrders = orders.filter((o) => o.status === 'pending');
  const totalRevenue = paidOrders.reduce((sum, o) => sum + o.total, 0);

  const updateStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', orderId);

      if (error) throw error;

      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('שגיאה בעדכון סטטוס');
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

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">ניהול הזמנות</h1>
          <p className="text-gray-600 mt-2">
            סך הכל {orders.length} הזמנות
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-md p-5">
          <div className="text-sm text-gray-500">סך הזמנות</div>
          <div className="text-2xl font-bold text-gray-800">{orders.length}</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-5">
          <div className="text-sm text-gray-500">ממתינות לטיפול</div>
          <div className="text-2xl font-bold text-yellow-600">{pendingOrders.length}</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-5">
          <div className="text-sm text-gray-500">הכנסות (שולם)</div>
          <div className="text-2xl font-bold text-green-600">₪{totalRevenue.toLocaleString()}</div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          <input
            type="text"
            placeholder="חפש לפי מספר הזמנה, אימייל או שם..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 min-w-[200px] px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">כל הסטטוסים</option>
            {Object.entries(STATUS_LABELS).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">כל סטטוסי תשלום</option>
            {Object.entries(PAYMENT_STATUS_LABELS).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">טוען הזמנות...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <p className="text-gray-600 text-lg">לא נמצאו הזמנות</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">מס׳ הזמנה</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">לקוח</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">טלפון</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">סכום</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">סטטוס</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">תשלום</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">תאריך</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">פעולות</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="text-primary-600 hover:text-primary-800 font-medium"
                      >
                        {order.order_number}
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div className="font-medium text-gray-900">
                          {(order.billing_address as any)?.name || '-'}
                        </div>
                        <div className="text-gray-500">{order.customer_email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {order.customer_phone || '-'}
                    </td>
                    <td className="px-6 py-4 font-medium">
                      ₪{order.total.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={order.status}
                        onChange={(e) => updateStatus(order.id, e.target.value)}
                        className={`px-2 py-1 rounded-full text-xs font-medium border-0 cursor-pointer focus:ring-2 focus:ring-primary-500 ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-800'}`}
                      >
                        {Object.entries(STATUS_LABELS).map(([key, label]) => (
                          <option key={key} value={key}>{label}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${PAYMENT_STATUS_COLORS[order.payment_status] || 'bg-gray-100 text-gray-800'}`}>
                        {PAYMENT_STATUS_LABELS[order.payment_status] || order.payment_status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {formatDate(order.created_at)}
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors flex items-center gap-1 text-sm w-fit"
                      >
                        <FaEye />
                        צפה
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
