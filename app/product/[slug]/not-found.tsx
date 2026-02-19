import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { FaArrowRight } from 'react-icons/fa';

export default function ProductNotFound() {
  return (
    <>
      <Header />
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">המוצר לא נמצא</h1>
          <p className="text-gray-600 mb-6">המוצר שחיפשת אינו קיים או אינו זמין</p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
          >
            <FaArrowRight />
            חזרה לכל המוצרים
          </Link>
        </div>
      </div>
      <Footer />
    </>
  );
}
