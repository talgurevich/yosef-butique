'use client';

import Link from 'next/link';
import { FaFacebook, FaInstagram, FaWhatsapp, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import { useState } from 'react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, source: 'footer' }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'שגיאה בהרשמה');
      }

      setMessage(data.message);
      setEmail('');

      // Show promo code if available
      if (data.promoCode) {
        alert(`🎉 ${data.message}\n\nקוד ההנחה שלך: ${data.promoCode}\n\nהעתק אותו ושמור לרכישה הבאה!`);
      } else {
        alert(data.message);
      }
    } catch (error: any) {
      setMessage(error.message);
      alert('❌ ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Newsletter Section */}
      <div className="bg-primary-600 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-white text-2xl font-bold mb-2">
                הצטרפו לניוזלטר שלנו
              </h3>
              <p className="text-primary-100">
                קבלו הנחה של 10% על הרכישה הראשונה שלכם
              </p>
            </div>
            <form
              onSubmit={handleNewsletterSubmit}
              className="flex w-full md:w-auto gap-2"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="הכניסו את כתובת המייל שלכם"
                className="px-4 py-3 rounded-lg w-full md:w-80 text-gray-900"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-white text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'נרשם...' : 'הרשמה'}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h4 className="text-white text-lg font-bold mb-4">
              שטיחי בוטיק יוסף
            </h4>
            <p className="text-sm mb-4 leading-relaxed">
              מתמחים במכירת שטיחים איכותיים ומעוצבים לבית. ניסיון של שנים רבות
              בתחום.
            </p>
            <div className="flex space-x-4 space-x-reverse">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <FaFacebook className="text-2xl" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <FaInstagram className="text-2xl" />
              </a>
              <a
                href="https://wa.me/972515092208"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <FaWhatsapp className="text-2xl" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white text-lg font-bold mb-4">קישורים מהירים</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  בית
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="hover:text-white transition-colors"
                >
                  מוצרים
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="hover:text-white transition-colors"
                >
                  אודות
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-white transition-colors"
                >
                  צור קשר
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white text-lg font-bold mb-4">מידע משפטי</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-white transition-colors"
                >
                  מדיניות פרטיות
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  תנאי שימוש
                </Link>
              </li>
              <li>
                <Link
                  href="/shipping"
                  className="hover:text-white transition-colors"
                >
                  משלוחים והחזרות
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white text-lg font-bold mb-4">צור קשר</h4>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3 space-x-reverse">
                <FaPhone className="text-primary-400 mt-1" />
                <div>
                  <p className="text-sm">טלפון</p>
                  <a
                    href="tel:+972515092208"
                    className="hover:text-white transition-colors"
                  >
                    051-509-2208
                  </a>
                </div>
              </li>
              <li className="flex items-start space-x-3 space-x-reverse">
                <FaEnvelope className="text-primary-400 mt-1" />
                <div>
                  <p className="text-sm">אימייל</p>
                  <a
                    href="mailto:info@example.com"
                    className="hover:text-white transition-colors"
                  >
                    info@example.com
                  </a>
                </div>
              </li>
              <li className="flex items-start space-x-3 space-x-reverse">
                <FaMapMarkerAlt className="text-primary-400 mt-1" />
                <div>
                  <p className="text-sm">כתובת</p>
                  <p className="text-sm">השקד משק 47</p>
                  <p className="text-sm">מושב בית עזרא</p>
                </div>
              </li>
            </ul>

            {/* Google Map */}
            <div className="mt-4">
              <div className="rounded-lg overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3383.5!2d34.82!3d31.77!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzHCsDQ2JzEyLjAiTiAzNMKwNDknMTIuMCJF!5e0!3m2!1siw!2sil!4v1234567890!5m2!1siw!2sil&q=השקד+משק+47+מושב+בית+עזרא"
                  width="100%"
                  height="200"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="מפת מיקום - שטיחי בוטיק יוסף"
                />
              </div>
              <a
                href="https://waze.com/ul?q=השקד משק 47 מושב בית עזרא&navigate=yes"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 flex items-center justify-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C7.8 0 4 3.2 4 7.2c0 5.4 8 16.8 8 16.8s8-11.4 8-16.8C20 3.2 16.2 0 12 0zm0 11c-1.7 0-3-1.3-3-3s1.3-3 3-3 3 1.3 3 3-1.3 3-3 3z"/>
                </svg>
                נווט עם Waze
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-right">
              <p className="text-sm text-gray-400">
                © {new Date().getFullYear()} שטיחי בוטיק יוסף. כל הזכויות שמורות.
              </p>
              <p className="text-xs text-gray-500 mt-1">
                פותח על ידי{' '}
                <a
                  href="https://www.errn.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary-400 transition-colors"
                >
                  www.errn.io
                </a>
              </p>
            </div>
            <div className="flex items-center space-x-4 space-x-reverse text-sm text-gray-400">
              <span>תשלום מאובטח</span>
              <div className="flex space-x-2 space-x-reverse">
                <div className="bg-gray-800 px-3 py-1 rounded">💳 Visa</div>
                <div className="bg-gray-800 px-3 py-1 rounded">💳 Mastercard</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
