'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

function UnsubscribeContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email');

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [confirmed, setConfirmed] = useState(false);

  const handleUnsubscribe = async () => {
    if (!email) {
      setError('לא נמצאה כתובת מייל');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/newsletter/unsubscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'שגיאה בביטול ההרשמה');
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'שגיאה בביטול ההרשמה. אנא נסה שוב');
    } finally {
      setLoading(false);
    }
  };

  if (!email) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow bg-gray-50 py-12">
          <div className="container mx-auto px-4 max-w-2xl">
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center">
              <div className="mb-6">
                <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                  <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                קישור לא תקין
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                לא נמצאה כתובת מייל בקישור
              </p>
              <Link
                href="/"
                className="inline-block bg-primary-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-primary-700 transition-colors"
              >
                חזרה לדף הבית
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow bg-gray-50 py-12">
          <div className="container mx-auto px-4 max-w-2xl">
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center">
              <div className="mb-6">
                <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                ביטול ההרשמה בוצע בהצלחה
              </h1>
              <p className="text-xl text-gray-600 mb-4">
                כתובת המייל <strong>{email}</strong> הוסרה מרשימת התפוצה שלנו
              </p>
              <p className="text-gray-600 mb-8">
                לא תקבל יותר מיילים מאיתנו. נשמח לראותך שוב בעתיד!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/"
                  className="bg-primary-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-primary-700 transition-colors"
                >
                  חזרה לדף הבית
                </Link>
                <Link
                  href="/products"
                  className="bg-gray-200 text-gray-800 px-8 py-3 rounded-lg font-bold hover:bg-gray-300 transition-colors"
                >
                  המשך קניות
                </Link>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <div className="text-center mb-8">
              <div className="mb-6">
                <div className="mx-auto w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center">
                  <svg className="w-12 h-12 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                ביטול הרשמה לניוזלטר
              </h1>
              <p className="text-xl text-gray-600">
                האם אתה בטוח שברצונך לבטל את ההרשמה?
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
              <p className="text-gray-700 mb-2">
                <strong>כתובת מייל:</strong> {email}
              </p>
              <p className="text-gray-600 text-sm">
                לא תקבל יותר עדכונים, מבצעים מיוחדים וקודי הנחה
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">
                {error}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleUnsubscribe}
                disabled={loading}
                className="flex-1 bg-red-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'מבטל...' : 'כן, בטל את ההרשמה'}
              </button>
              <Link
                href="/"
                className="flex-1 bg-gray-200 text-gray-800 px-8 py-3 rounded-lg font-bold hover:bg-gray-300 transition-colors text-center"
              >
                לא, השאר אותי רשום
              </Link>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-200 text-center">
              <p className="text-gray-600 text-sm mb-4">
                חשבת על זה שוב? אנחנו שולחים רק תוכן איכותי ומבצעים מיוחדים
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-500">
                <span>✨ מוצרים חדשים</span>
                <span>•</span>
                <span>🎯 הנחות בלעדיות</span>
                <span>•</span>
                <span>💡 טיפים לעיצוב</span>
                <span>•</span>
                <span>🎁 קודי הנחה</span>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function UnsubscribePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    }>
      <UnsubscribeContent />
    </Suspense>
  );
}
