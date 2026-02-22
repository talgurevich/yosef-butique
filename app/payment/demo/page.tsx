'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';

export default function DemoPaymentPage() {
  const router = useRouter();
  const { clearCart } = useCart();
  const [orderNumber, setOrderNumber] = useState('');
  const [orderId, setOrderId] = useState('');
  const [amount, setAmount] = useState('');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  const [cardData, setCardData] = useState({
    number: '',
    expiry: '',
    cvv: '',
    holder: '',
  });

  useEffect(() => {
    const storedOrderNumber = sessionStorage.getItem('order_number');
    const storedOrderId = sessionStorage.getItem('demo_order_id');
    const storedAmount = sessionStorage.getItem('demo_amount');

    if (!storedOrderNumber || !storedOrderId) {
      router.push('/cart');
      return;
    }

    setOrderNumber(storedOrderNumber);
    setOrderId(storedOrderId);
    setAmount(storedAmount || '0');
  }, [router]);

  const formatCardNumber = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, '$1-');
  };

  const formatExpiry = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 4);
    if (digits.length > 2) {
      return digits.slice(0, 2) + '/' + digits.slice(2);
    }
    return digits;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    setError('');

    const digits = cardData.number.replace(/\D/g, '');
    if (digits.length < 13) {
      setError('מספר כרטיס לא תקין');
      setProcessing(false);
      return;
    }

    try {
      const response = await fetch('/api/payment/demo-complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_id: orderId,
          card_last_digits: digits.slice(-4),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'שגיאה בביצוע התשלום');
      }

      clearCart();

      // Redirect to success page
      const params = new URLSearchParams({
        amount: amount,
        four_digits: digits.slice(-4),
        approval_number: data.approval_number || '',
      });
      window.location.href = `/payment/success?${params.toString()}`;
    } catch (err: any) {
      setError(err.message);
      setProcessing(false);
    }
  };

  if (!orderNumber) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 flex items-center justify-center p-4" dir="rtl">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 to-blue-900 text-white rounded-t-2xl px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <div>
              <h1 className="text-lg font-bold">דף תשלום מאובטח</h1>
              <p className="text-blue-200 text-xs">בוטיק יוסף</p>
            </div>
          </div>
          <div className="flex gap-2">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/120px-Visa_Inc._logo.svg.png" alt="Visa" className="h-6 object-contain bg-white rounded px-1" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/120px-Mastercard-logo.svg.png" alt="Mastercard" className="h-6 object-contain bg-white rounded px-1" />
          </div>
        </div>

        {/* Amount */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <span className="text-gray-600 font-medium">סכום לתשלום</span>
          <span className="text-2xl font-bold text-gray-800">
            ₪{parseFloat(amount).toLocaleString('he-IL', { minimumFractionDigits: 0 })}
          </span>
        </div>

        {/* Card Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-b-2xl shadow-xl px-6 py-6 space-y-5">
          {/* Card Number */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">מספר כרטיס</label>
            <input
              type="text"
              value={cardData.number}
              onChange={(e) => setCardData({ ...cardData, number: formatCardNumber(e.target.value) })}
              placeholder="0000-0000-0000-0000"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-lg tracking-widest"
              dir="ltr"
              required
              inputMode="numeric"
            />
          </div>

          {/* Card Holder */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">שם בעל הכרטיס</label>
            <input
              type="text"
              value={cardData.holder}
              onChange={(e) => setCardData({ ...cardData, holder: e.target.value })}
              placeholder="ישראל ישראלי"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
              required
            />
          </div>

          {/* Expiry + CVV row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">תוקף</label>
              <input
                type="text"
                value={cardData.expiry}
                onChange={(e) => setCardData({ ...cardData, expiry: formatExpiry(e.target.value) })}
                placeholder="MM/YY"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-center tracking-wider"
                dir="ltr"
                required
                inputMode="numeric"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">CVV</label>
              <input
                type="text"
                value={cardData.cvv}
                onChange={(e) => setCardData({ ...cardData, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                placeholder="000"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-center tracking-wider"
                dir="ltr"
                required
                inputMode="numeric"
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={processing}
            className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-4 rounded-lg font-bold text-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
          >
            {processing ? (
              <>
                <span className="inline-block animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></span>
                מעבד תשלום...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                שלם ₪{parseFloat(amount).toLocaleString('he-IL', { minimumFractionDigits: 0 })}
              </>
            )}
          </button>

          {/* Security note */}
          <div className="flex items-center justify-center gap-2 text-xs text-gray-400 pt-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            <span>העסקה מוצפנת ומאובטחת | SSL 256-bit</span>
          </div>
        </form>
      </div>
    </div>
  );
}
