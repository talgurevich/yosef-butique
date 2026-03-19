'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaBox, FaShoppingCart, FaUsers, FaDollarSign } from 'react-icons/fa';
import { supabase } from '@/lib/supabase';

type ActivityItem = {
  type: 'order' | 'product_created' | 'product_updated';
  id: string;
  title: string;
  subtitle: string;
  date: string;
  link: string;
};

export default function AdminDashboard() {
  const router = useRouter();
  const [productsCount, setProductsCount] = useState(0);
  const [activeOrdersCount, setActiveOrdersCount] = useState(0);
  const [monthlyRevenue, setMonthlyRevenue] = useState(0);
  const [subscribersCount, setSubscribersCount] = useState(0);
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (window.innerWidth < 768) {
      router.replace('/admin/inventory');
      return;
    }

    fetchDashboardData();
  }, [router]);

  const fetchDashboardData = async () => {
    try {
      // Calculate date ranges
      const now = new Date();
      const sevenDaysAgo = new Date(now);
      sevenDaysAgo.setDate(now.getDate() - 7);
      sevenDaysAgo.setHours(0, 0, 0, 0);
      const weekStart = sevenDaysAgo.toISOString();

      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

      // Fetch all data in parallel — use allSettled so one failure doesn't block others
      const [
        productsRes,
        activeOrdersRes,
        paidOrdersRes,
        subscribersRes,
        weekOrdersRes,
        recentProductsRes,
        updatedProductsRes,
      ] = await Promise.allSettled([
        supabase.from('products').select('id', { count: 'exact', head: true }),
        supabase
          .from('orders')
          .select('id', { count: 'exact', head: true })
          .in('status', ['pending', 'processing']),
        supabase
          .from('orders')
          .select('total')
          .eq('payment_status', 'paid')
          .gte('created_at', startOfMonth),
        supabase.from('newsletter_subscribers').select('id', { count: 'exact', head: true }),
        supabase
          .from('orders')
          .select('id, order_number, customer_email, billing_address, total, payment_status, created_at')
          .gte('created_at', weekStart)
          .order('created_at', { ascending: false })
          .limit(20),
        supabase
          .from('products')
          .select('id, name, created_at')
          .gte('created_at', weekStart)
          .order('created_at', { ascending: false })
          .limit(10),
        supabase
          .from('products')
          .select('id, name, created_at, updated_at')
          .gte('updated_at', weekStart)
          .order('updated_at', { ascending: false })
          .limit(10),
      ]);

      // Helper to safely extract settled values
      const val = (r: PromiseSettledResult<any>) => r.status === 'fulfilled' ? r.value : { data: null, count: 0 };

      // Stats
      setProductsCount(val(productsRes).count || 0);
      setActiveOrdersCount(val(activeOrdersRes).count || 0);
      setSubscribersCount(val(subscribersRes).count || 0);

      const revenue = (val(paidOrdersRes).data || []).reduce((sum: number, o: any) => sum + (o.total || 0), 0);
      setMonthlyRevenue(revenue);

      // Build activity list
      const items: ActivityItem[] = [];

      // Orders
      for (const order of val(weekOrdersRes).data || []) {
        const billing = order.billing_address as any;
        const customerName = billing?.name || order.customer_email;
        const paymentLabel = order.payment_status === 'paid' ? 'שולם' : order.payment_status === 'failed' ? 'נכשל' : 'ממתין';
        items.push({
          type: 'order',
          id: order.id,
          title: `הזמנה ${order.order_number}`,
          subtitle: `${customerName} · ₪${order.total.toLocaleString()} · ${paymentLabel}`,
          date: order.created_at,
          link: `/admin/orders/${order.id}`,
        });
      }

      // Products created
      for (const product of val(recentProductsRes).data || []) {
        items.push({
          type: 'product_created',
          id: `created-${product.id}`,
          title: `מוצר חדש: ${product.name}`,
          subtitle: 'נוסף למערכת',
          date: product.created_at,
          link: `/admin/products/${product.id}`,
        });
      }

      // Products updated (exclude ones just created this week)
      const createdIds = new Set((val(recentProductsRes).data || []).map((p: any) => p.id));
      for (const product of val(updatedProductsRes).data || []) {
        if (createdIds.has(product.id) && product.created_at === product.updated_at) continue;
        if (createdIds.has(product.id)) {
          // Was created this week but also updated — only show update if times differ
          const created = new Date(product.created_at).getTime();
          const updated = new Date(product.updated_at).getTime();
          if (Math.abs(updated - created) < 60000) continue; // less than 1 min apart, skip
        }
        items.push({
          type: 'product_updated',
          id: `updated-${product.id}`,
          title: `עודכן: ${product.name}`,
          subtitle: 'פרטי המוצר עודכנו',
          date: product.updated_at,
          link: `/admin/products/${product.id}`,
        });
      }

      // Sort by date descending
      items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      setActivity(items.slice(0, 25));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('he-IL', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const activityIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'order':
        return <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-sm">🛒</div>;
      case 'product_created':
        return <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm">📦</div>;
      case 'product_updated':
        return <div className="w-8 h-8 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center text-sm">✏️</div>;
    }
  };

  // Show nothing while redirecting on mobile
  if (typeof window !== 'undefined' && window.innerWidth < 768) {
    return null;
  }

  const stats = [
    {
      title: 'סך מוצרים',
      value: productsCount.toLocaleString(),
      icon: <FaBox className="text-3xl" />,
      color: 'bg-blue-500',
    },
    {
      title: 'הזמנות פעילות',
      value: activeOrdersCount.toLocaleString(),
      icon: <FaShoppingCart className="text-3xl" />,
      color: 'bg-green-500',
    },
    {
      title: 'מנויי ניוזלטר',
      value: subscribersCount.toLocaleString(),
      icon: <FaUsers className="text-3xl" />,
      color: 'bg-purple-500',
    },
    {
      title: 'הכנסות החודש',
      value: `₪${monthlyRevenue.toLocaleString()}`,
      icon: <FaDollarSign className="text-3xl" />,
      color: 'bg-yellow-500',
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">לוח בקרה ראשי</h1>
        <p className="text-gray-600 mt-2">ברוכים הבאים למערכת הניהול</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
              </div>
              <div className={`${stat.color} text-white p-4 rounded-lg`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">פעולות מהירות</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/admin/products/new"
            className="bg-primary-600 text-white px-6 py-4 rounded-lg hover:bg-primary-700 transition-colors text-center font-semibold"
          >
            הוסף מוצר חדש
          </Link>
          <Link
            href="/admin/products/bulk-upload"
            className="bg-green-600 text-white px-6 py-4 rounded-lg hover:bg-green-700 transition-colors text-center font-semibold"
          >
            העלאת CSV
          </Link>
          <Link
            href="/admin/orders"
            className="bg-blue-600 text-white px-6 py-4 rounded-lg hover:bg-blue-700 transition-colors text-center font-semibold"
          >
            צפה בהזמנות
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">פעילות 7 ימים אחרונים</h2>
        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
            <p className="mt-2 text-gray-500 text-sm">טוען פעילות...</p>
          </div>
        ) : activity.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>אין פעילות ב-7 ימים אחרונים</p>
          </div>
        ) : (
          <div className="space-y-3">
            {activity.map((item) => (
              <Link
                key={item.id}
                href={item.link}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {activityIcon(item.type)}
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-800 text-sm truncate">{item.title}</div>
                  <div className="text-gray-500 text-xs truncate">{item.subtitle}</div>
                </div>
                <div className="text-gray-400 text-xs whitespace-nowrap">{formatDate(item.date)}</div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
