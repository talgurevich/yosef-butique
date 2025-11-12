import Link from 'next/link';
import { FaHome, FaBox, FaTags, FaShoppingCart, FaImages, FaTicketAlt, FaEnvelope, FaSignOutAlt } from 'react-icons/fa';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-100 flex" dir="rtl">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex-shrink-0">
        <div className="p-6">
          <h1 className="text-2xl font-bold">לוח בקרה</h1>
          <p className="text-gray-400 text-sm mt-1">שטיחי בוטיק יוסף</p>
        </div>

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

          <Link
            href="/admin/categories"
            className="flex items-center px-6 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
          >
            <FaTags className="ml-3" />
            קטגוריות
          </Link>

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

          <div className="border-t border-gray-800 mt-6 pt-6">
            <Link
              href="/"
              className="flex items-center px-6 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
            >
              <FaHome className="ml-3" />
              חזרה לאתר
            </Link>
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
