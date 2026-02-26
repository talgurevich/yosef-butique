'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, getFinalTotal, getCartTotal, getDiscountAmount, getDeliveryCost, appliedCoupon, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isClient, setIsClient] = useState(false);

  const [formData, setFormData] = useState({
    customer_name: '',
    email: '',
    phone: '',
    notes: '',
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    // Redirect if cart is empty (only after client-side hydration)
    if (isClient && cartItems && cartItems.length === 0) {
      router.push('/cart');
    }
  }, [cartItems, router, isClient]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
      const effectiveDeliveryCost = getDeliveryCost();

      // Prepare items for PayPlus
      const items: { name: string; price: number; quantity: number; vat_type: number }[] = cartItems.map(item => ({
        name: `${item.productName} - ${item.variantSize}`,
        price: item.price,
        quantity: item.quantity,
        vat_type: 0, // 0 = VAT included
      }));

      // Add delivery as a line item if not free
      if (effectiveDeliveryCost > 0) {
        items.push({
          name: 'משלוח',
          price: effectiveDeliveryCost,
          quantity: 1,
          vat_type: 0,
        });
      }

      // Add discount as a negative line item if applicable
      if (getDiscountAmount() > 0) {
        items.push({
          name: `הנחה${appliedCoupon ? ` (${appliedCoupon.code})` : ''}`,
          price: -getDiscountAmount(),
          quantity: 1,
          vat_type: 0,
        });
      }

      // Prepare customer data
      const customer = {
        customer_name: formData.customer_name,
        email: formData.email,
        phone: formData.phone,
      };

      // Compute final total with effective delivery cost
      const finalTotal = Math.max(0, getCartTotal() - getDiscountAmount() + effectiveDeliveryCost);

      // Call our API to generate payment link
      const response = await fetch('/api/payment/generate-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: finalTotal,
          currency_code: 'ILS',
          customer,
          items,
          more_info: formData.notes || undefined,
          cartItems: cartItems.map(item => ({
            productId: item.productId,
            variantId: item.variantId,
            productName: item.productName,
            variantSize: item.variantSize,
            variantColor: item.variantColor,
            price: item.price,
            quantity: item.quantity,
            slug: item.slug,
          })),
          deliveryCost: effectiveDeliveryCost,
          discountAmount: getDiscountAmount(),
          couponCode: appliedCoupon?.code || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate payment link');
      }

      // Store cart info and order number in session storage
      sessionStorage.setItem('checkout_cart', JSON.stringify(cartItems));
      sessionStorage.setItem('checkout_customer', JSON.stringify(customer));
      if (data.order_number) {
        sessionStorage.setItem('order_number', data.order_number);
      }

      // If PayPlus is unavailable, fall back to demo payment page
      if (data.fallback) {
        sessionStorage.setItem('demo_order_id', data.order_id);
        sessionStorage.setItem('demo_amount', String(finalTotal));
        router.push('/payment/demo');
        return;
      }

      // Redirect to PayPlus payment page
      window.location.href = data.payment_link;

    } catch (err: any) {
      console.error('Checkout error:', err);
      setError(err.message || 'Failed to process checkout. Please try again.');
      setLoading(false);
    }
  };

  // Show loading state during SSR or while cart is being fetched
  if (!isClient) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow bg-gray-50 py-12">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mb-4"></div>
              <p className="text-gray-600">טוען...</p>
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
                {cartItems.map((item) => (
                  <div key={`${item.productId}-${item.variantId}`} className="flex justify-between items-start border-b border-gray-200 pb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">{item.productName}</h3>
                      <p className="text-sm text-gray-600">מידה: {item.variantSize}</p>
                      <p className="text-sm text-gray-600">כמות: {item.quantity}</p>
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-gray-800">
                        ₪{(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-300 pt-4 space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>סכום ביניים</span>
                  <span>₪{getCartTotal().toLocaleString()}</span>
                </div>
                {getDiscountAmount() > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>הנחה{appliedCoupon ? ` (${appliedCoupon.code})` : ''}</span>
                    <span>-₪{getDiscountAmount().toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>משלוח</span>
                  <span>
                    {getDeliveryCost() === 0 ? 'לא חושב' : `₪${getDeliveryCost().toLocaleString()}`}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xl font-bold text-gray-800 pt-2 border-t border-gray-200">
                  <span>סה"כ לתשלום:</span>
                  <span>₪{getFinalTotal().toLocaleString()}</span>
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

                <div>
                  <label htmlFor="notes" className="block text-gray-700 font-semibold mb-2">
                    הערות להזמנה (אופציונלי)
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                    placeholder="הערות נוספות..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white py-4 rounded-lg font-bold text-lg hover:from-primary-700 hover:to-primary-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'מעבד...' : 'המשך לתשלום'}
                </button>

                <Link
                  href="/cart"
                  className="block text-center text-primary-600 hover:text-primary-700 font-semibold mt-4"
                >
                  חזרה לעגלת קניות
                </Link>
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
