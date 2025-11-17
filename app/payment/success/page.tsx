'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { clearCart } = useCart();
  const [transactionData, setTransactionData] = useState<any>(null);

  useEffect(() => {
    // Clear cart on successful payment
    clearCart();

    // Get transaction data from URL parameters
    const data = {
      transaction_uid: searchParams.get('transaction_uid'),
      amount: searchParams.get('amount'),
      approval_number: searchParams.get('approval_number'),
      voucher_number: searchParams.get('voucher_number'),
      four_digits: searchParams.get('four_digits'),
      customer_name: searchParams.get('customer_name'),
    };

    setTransactionData(data);

    // Clear checkout session storage
    sessionStorage.removeItem('checkout_cart');
    sessionStorage.removeItem('checkout_customer');
  }, [clearCart, searchParams]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow bg-gradient-to-br from-green-50 to-white py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center">
            {/* Success Icon */}
            <div className="mb-6">
              <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>

            {/* Success Message */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              התשלום בוצע בהצלחה!
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              תודה רבה על הרכישה שלך
            </p>

            {/* Transaction Details */}
            {transactionData && (
              <div className="bg-gray-50 rounded-lg p-6 mb-8 text-right">
                <h2 className="text-lg font-bold text-gray-800 mb-4">פרטי העסקה</h2>
                <div className="space-y-2 text-gray-700">
                  {transactionData.approval_number && (
                    <div className="flex justify-between">
                      <span className="font-semibold">מספר אישור:</span>
                      <span>{transactionData.approval_number}</span>
                    </div>
                  )}
                  {transactionData.voucher_number && (
                    <div className="flex justify-between">
                      <span className="font-semibold">מספר שובר:</span>
                      <span>{transactionData.voucher_number}</span>
                    </div>
                  )}
                  {transactionData.amount && (
                    <div className="flex justify-between">
                      <span className="font-semibold">סכום:</span>
                      <span className="font-bold">₪{parseFloat(transactionData.amount).toLocaleString()}</span>
                    </div>
                  )}
                  {transactionData.four_digits && (
                    <div className="flex justify-between">
                      <span className="font-semibold">כרטיס אשראי:</span>
                      <span>**** **** **** {transactionData.four_digits}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Email Confirmation Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
              <p className="text-blue-800">
                <span className="font-semibold">אישור התשלום נשלח למייל שלך</span>
                <br />
                נציג יצור איתך קשר בהקדם לתיאום משלוח
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/products"
                className="bg-primary-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-primary-700 transition-colors"
              >
                המשך קניות
              </Link>
              <Link
                href="/"
                className="bg-gray-200 text-gray-800 px-8 py-3 rounded-lg font-bold hover:bg-gray-300 transition-colors"
              >
                חזרה לדף הבית
              </Link>
            </div>

            {/* Contact Info */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <p className="text-gray-600 mb-2">יש לך שאלות?</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm">
                <a
                  href="tel:+972515092208"
                  className="text-primary-600 hover:text-primary-700 font-semibold"
                >
                  📞 051-509-2208
                </a>
                <a
                  href="mailto:info@boutique-yossef.co.il"
                  className="text-primary-600 hover:text-primary-700 font-semibold"
                >
                  ✉️ info@boutique-yossef.co.il
                </a>
                <a
                  href="https://wa.me/972515092208"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-600 hover:text-green-700 font-semibold"
                >
                  💬 WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
