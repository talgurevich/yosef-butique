'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function ApprovalDemoPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    customer_name: '',
    email: '',
    phone: '',
  });

  const testProduct = {
    name: 'מוצר לדוגמה - בדיקת תשלום',
    price: 1,
    quantity: 1,
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const customer = {
        customer_name: formData.customer_name,
        email: formData.email,
        phone: formData.phone,
      };

      const response = await fetch('/api/payment/generate-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: testProduct.price,
          currency_code: 'ILS',
          customer,
          items: [
            {
              name: testProduct.name,
              price: testProduct.price,
              quantity: testProduct.quantity,
              vat_type: 0,
            },
          ],
          cartItems: [
            {
              productId: 'test-approval',
              variantId: 'test-approval',
              productName: testProduct.name,
              variantSize: 'N/A',
              price: testProduct.price,
              quantity: testProduct.quantity,
              slug: 'test-approval',
            },
          ],
          more_info: 'בדיקת חברת אשראי - אישור חשבון',
        }),
      });

      const data = await response.json();

      if (data.success && data.payment_link) {
        sessionStorage.setItem('order_number', data.order_number);
        window.location.href = data.payment_link;
      } else if (data.fallback) {
        sessionStorage.setItem('order_number', data.order_number);
        sessionStorage.setItem('demo_order_id', data.order_id);
        sessionStorage.setItem('demo_amount', '1');
        window.location.href = '/payment/demo';
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
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
            סיום הזמנה
          </h1>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-8">
            {/* Order Summary */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">סיכום הזמנה</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-start border-b border-gray-200 pb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{testProduct.name}</h3>
                    <p className="text-sm text-gray-600">כמות: {testProduct.quantity}</p>
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-gray-800">
                      ₪{testProduct.price.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-300 pt-4 space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>סכום ביניים</span>
                  <span>₪{testProduct.price.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>משלוח</span>
                  <span>₪0</span>
                </div>
                <div className="flex justify-between items-center text-xl font-bold text-gray-800 pt-2 border-t border-gray-200">
                  <span>סה"כ לתשלום:</span>
                  <span>₪{testProduct.price.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Customer Information Form */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">פרטים אישיים</h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="customer_name" className="block text-gray-700 font-semibold mb-2">
                    שם מלא *
                  </label>
                  <input
                    type="text"
                    id="customer_name"
                    name="customer_name"
                    value={formData.customer_name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                    placeholder="הזן שם מלא"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">
                    דואר אלקטרוני *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                    placeholder="email@example.com"
                    dir="ltr"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-gray-700 font-semibold mb-2">
                    טלפון *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                    placeholder="050-1234567"
                    dir="ltr"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white py-4 rounded-lg font-bold text-lg hover:from-primary-700 hover:to-primary-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'מעבד...' : 'המשך לתשלום'}
                </button>
              </form>
            </div>
          </div>

          {/* Security Info */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              <span className="font-bold text-blue-800">תשלום מאובטח</span>
            </div>
            <p className="text-blue-700 text-sm">
              התשלום מבוצע באמצעות מערכת PayPlus המאובטחת. פרטי כרטיס האשראי שלך מוגנים בהצפנה ברמה הגבוהה ביותר.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
