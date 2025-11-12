'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { FaHome, FaBox, FaTags, FaShoppingCart, FaImages, FaTicketAlt, FaEnvelope, FaSignOutAlt, FaUser, FaPalette, FaShapes, FaDoorOpen, FaSeedling, FaRulerVertical, FaSun, FaHandHoldingHeart, FaPaw } from 'react-icons/fa';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/admin/login' });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex" dir="rtl">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex-shrink-0">
        <div className="p-6">
          <h1 className="text-2xl font-bold">לוח בקרה</h1>
          <p className="text-gray-400 text-sm mt-1">שטיחי בוטיק יוסף</p>
        </div>

        {/* User Info */}
        {session?.user && (
          <div className="px-6 py-4 bg-gray-800 border-y border-gray-700">
            <div className="flex items-center gap-3">
              {session.user.image ? (
                <img
                  src={session.user.image}
                  alt={session.user.name || 'User'}
                  className="w-10 h-10 rounded-full"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center">
                  <FaUser />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">
                  {session.user.name}
                </p>
                <p className="text-xs text-gray-400 truncate">
                  {session.user.email}
                </p>
              </div>
            </div>
          </div>
        )}

        <nav className="mt-6">
          <Link
            href="/admin"
            className="flex items-center px-6 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
          >
            <FaHome className="ml-3" />
            דף הבית
          </Link>

          <Link
            href="/admin/products"
            className="flex items-center px-6 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
          >
            <FaBox className="ml-3" />
            מוצרים
          </Link>

          <div className="mt-6 pt-6 border-t border-gray-800">
            <p className="px-6 text-xs text-gray-500 uppercase mb-3">שטיחים</p>

            <Link
              href="/admin/categories"
              className="flex items-center px-6 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
            >
              <FaTags className="ml-3" />
              סגנונות
            </Link>

            <Link
              href="/admin/colors"
              className="flex items-center px-6 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
            >
              <FaPalette className="ml-3" />
              צבעים
            </Link>

            <Link
              href="/admin/shapes"
              className="flex items-center px-6 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
            >
              <FaShapes className="ml-3" />
              צורות
            </Link>

            <Link
              href="/admin/spaces"
              className="flex items-center px-6 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
            >
              <FaDoorOpen className="ml-3" />
              חללים
            </Link>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-800">
            <p className="px-6 text-xs text-gray-500 uppercase mb-3">עציצים</p>

            <Link
              href="/admin/plant-types"
              className="flex items-center px-6 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
            >
              <FaSeedling className="ml-3" />
              סוגי צמחים
            </Link>

            <Link
              href="/admin/plant-sizes"
              className="flex items-center px-6 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
            >
              <FaRulerVertical className="ml-3" />
              גדלים
            </Link>

            <Link
              href="/admin/plant-light-requirements"
              className="flex items-center px-6 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
            >
              <FaSun className="ml-3" />
              דרישות אור
            </Link>

            <Link
              href="/admin/plant-care-levels"
              className="flex items-center px-6 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
            >
              <FaHandHoldingHeart className="ml-3" />
              רמות טיפול
            </Link>

            <Link
              href="/admin/plant-pet-safety"
              className="flex items-center px-6 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
            >
              <FaPaw className="ml-3" />
              בטיחות לחיות
            </Link>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-800">
            <Link
              href="/admin/orders"
              className="flex items-center px-6 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
            >
              <FaShoppingCart className="ml-3" />
              הזמנות
            </Link>

            <Link
              href="/admin/gallery"
              className="flex items-center px-6 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
            >
              <FaImages className="ml-3" />
              גלריית לקוחות
            </Link>

            <Link
              href="/admin/promo-codes"
              className="flex items-center px-6 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
            >
              <FaTicketAlt className="ml-3" />
              קודי הנחה
            </Link>

            <Link
              href="/admin/newsletter"
              className="flex items-center px-6 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
            >
              <FaEnvelope className="ml-3" />
              ניוזלטר
            </Link>
          </div>

          <div className="border-t border-gray-800 mt-6 pt-6">
            <Link
              href="/"
              className="flex items-center px-6 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
            >
              <FaHome className="ml-3" />
              חזרה לאתר
            </Link>

            <button
              onClick={handleSignOut}
              className="w-full flex items-center px-6 py-3 text-gray-300 hover:bg-red-600 hover:text-white transition-colors"
            >
              <FaSignOutAlt className="ml-3" />
              התנתק
            </button>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
