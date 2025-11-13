'use client';

import { useCart } from '@/contexts/CartContext';
import Image from 'next/image';
import Link from 'next/link';
import { FaTrash, FaShoppingCart, FaArrowRight } from 'react-icons/fa';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, clearCart, getCartTotal, getCartItemsCount } = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('he-IL', {
      style: 'currency',
      currency: 'ILS',
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (cartItems.length === 0) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-cream py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <div className="bg-white rounded-lg shadow-md p-12">
                <FaShoppingCart className="text-6xl text-gray-300 mx-auto mb-6" />
                <h1 className="text-3xl font-bold text-gray-800 mb-4">
                  העגלה שלך ריקה
                </h1>
                <p className="text-gray-600 mb-8">
                  נראה שעדיין לא הוספת מוצרים לעגלה. התחל לקנות עכשיו!
                </p>
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 bg-primary-600 text-white px-8 py-3 rounded-lg hover:bg-primary-700 transition-colors font-semibold"
                >
                  המשך קניות
                  <FaArrowRight />
                </Link>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-cream py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">
            עגלת הקניות שלי ({getCartItemsCount()} פריטים)
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.variantId}
                  className="bg-white rounded-lg shadow-md p-6 flex flex-col md:flex-row gap-6"
                >
                  {/* Product Image */}
                  <Link
                    href={`/products/${item.slug}`}
                    className="flex-shrink-0"
                  >
                    <div className="relative w-full md:w-32 h-32 bg-gray-100 rounded-lg overflow-hidden">
                      {item.imageUrl ? (
                        <Image
                          src={item.imageUrl}
                          alt={item.productName}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <FaShoppingCart className="text-3xl" />
                        </div>
                      )}
                    </div>
                  </Link>

                  {/* Product Details */}
                  <div className="flex-1 flex flex-col md:flex-row justify-between gap-4">
                    <div className="flex-1">
                      <Link
                        href={`/products/${item.slug}`}
                        className="text-xl font-semibold text-gray-800 hover:text-primary-600 transition-colors mb-2 block"
                      >
                        {item.productName}
                      </Link>
                      <p className="text-gray-600 mb-4">
                        מידה: <span className="font-medium">{item.variantSize}</span>
                      </p>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3">
                        <span className="text-gray-600 text-sm">כמות:</span>
                        <div className="flex items-center border border-gray-300 rounded-lg">
                          <button
                            onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                            className="px-3 py-1 hover:bg-gray-100 transition-colors"
                          >
                            -
                          </button>
                          <span className="px-4 py-1 border-x border-gray-300 min-w-[3rem] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                            className="px-3 py-1 hover:bg-gray-100 transition-colors"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Price and Remove */}
                    <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-start gap-4">
                      <div className="text-left md:text-right">
                        <p className="text-2xl font-bold text-primary-600">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                        {item.quantity > 1 && (
                          <p className="text-sm text-gray-500">
                            {formatPrice(item.price)} לפריט
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => removeFromCart(item.variantId)}
                        className="text-red-500 hover:text-red-700 transition-colors p-2"
                        title="הסר מהעגלה"
                      >
                        <FaTrash className="text-xl" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Clear Cart Button */}
              <div className="flex justify-end">
                <button
                  onClick={clearCart}
                  className="text-red-500 hover:text-red-700 transition-colors flex items-center gap-2 text-sm"
                >
                  <FaTrash />
                  רוקן עגלה
                </button>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                <h2 className="text-xl font-bold text-gray-800 mb-6">
                  סיכום הזמנה
                </h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>סכום ביניים</span>
                    <span>{formatPrice(getCartTotal())}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>משלוח</span>
                    <span>חישוב בקופה</span>
                  </div>
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between text-xl font-bold text-gray-800">
                      <span>סה"כ</span>
                      <span className="text-primary-600">{formatPrice(getCartTotal())}</span>
                    </div>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  className="block w-full bg-primary-600 text-white text-center px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors font-semibold mb-3"
                >
                  המשך לתשלום
                </Link>

                <Link
                  href="/products"
                  className="block w-full bg-gray-100 text-gray-700 text-center px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  המשך קניות
                </Link>

                {/* Trust Badges */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="space-y-3 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      תשלום מאובטח
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      משלוח מהיר
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      החזרות בחינם
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
