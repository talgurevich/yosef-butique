'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaBox, FaShoppingCart, FaUsers, FaDollarSign } from 'react-icons/fa';

export default function AdminDashboard() {
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (window.innerWidth < 768) {
      router.replace('/admin/inventory');
    } else {
      setIsMobile(false);
    }
  }, [router]);

  // Show nothing while redirecting on mobile
  if (typeof window !== 'undefined' && window.innerWidth < 768) {
    return null;
  }

  // TODO: Fetch real stats from Supabase
  const stats = [
    {
      title: 'סך מוצרים',
      value: '0',
      icon: <FaBox className="text-3xl" />,
      color: 'bg-blue-500',
    },
    {
      title: 'הזמנות פעילות',
      value: '0',
      icon: <FaShoppingCart className="text-3xl" />,
      color: 'bg-green-500',
    },
    {
      title: 'מנויי ניוזלטר',
      value: '0',
      icon: <FaUsers className="text-3xl" />,
      color: 'bg-purple-500',
    },
    {
      title: 'הכנסות החודש',
      value: '₪0',
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
        <h2 className="text-xl font-bold text-gray-800 mb-4">פעילות אחרונה</h2>
        <div className="text-center py-8 text-gray-500">
          <p>אין פעילות אחרונה להצגה</p>
          <p className="text-sm mt-2">התחל להוסיף מוצרים כדי לראות פעילות כאן</p>
        </div>
      </div>
    </div>
  );
}
