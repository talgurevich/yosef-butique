'use client';

import { useState } from 'react';

export default function ApprovalDemoPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTestPayment = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/payment/generate-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: 1,
          currency_code: 'ILS',
          customer: {
            customer_name: 'בדיקת מערכת',
            email: 'test@boutique-yossef.co.il',
            phone: '0500000000',
          },
          items: [
            {
              name: 'בדיקת תשלום',
              quantity: 1,
              price: 1,
            },
          ],
          cartItems: [
            {
              productId: 'test-approval',
              variantId: 'test-approval',
              productName: 'בדיקת תשלום',
              variantSize: 'N/A',
              price: 1,
              quantity: 1,
              slug: 'test-approval',
            },
          ],
          more_info: 'בדיקת חברת אשראי - אישור חשבון',
        }),
      });

      const data = await response.json();

      if (data.success && data.payment_link) {
        window.location.href = data.payment_link;
      } else {
        setError(data.error || 'שגיאה ביצירת קישור תשלום');
      }
    } catch (err: any) {
      setError(err.message || 'שגיאה בהתחברות לשרת');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 flex items-center justify-center p-4" dir="rtl">
      <div className="w-full max-w-md">
        <div className="bg-gradient-to-r from-blue-700 to-blue-900 text-white rounded-t-2xl px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <div>
              <h1 className="text-lg font-bold">בדיקת תשלום - בוטיק יוסף</h1>
              <p className="text-blue-200 text-xs">דף בדיקה לאישור חברת אשראי</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-b-2xl shadow-xl px-6 py-8 space-y-6">
          <div className="text-center space-y-3">
            <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-4">
              <p className="text-gray-700 font-medium mb-1">סכום בדיקה</p>
              <p className="text-3xl font-bold text-gray-900">₪1</p>
            </div>
            <p className="text-sm text-gray-500">
              לחיצה על הכפתור תפתח את דף התשלום המאובטח של PayPlus
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
              {error}
            </div>
          )}

          <button
            onClick={handleTestPayment}
            disabled={loading}
            className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-4 rounded-lg font-bold text-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
          >
            {loading ? (
              <>
                <span className="inline-block animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></span>
                מעבד...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                בצע תשלום בדיקה - ₪1
              </>
            )}
          </button>

          <div className="flex items-center justify-center gap-2 text-xs text-gray-400 pt-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            <span>העסקה מוצפנת ומאובטחת | SSL 256-bit</span>
          </div>
        </div>
      </div>
    </div>
  );
}
