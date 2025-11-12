'use client';

import Link from 'next/link';
import { FaFacebook, FaInstagram, FaWhatsapp, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import { useState } from 'react';

export default function Footer() {
  const [email, setEmail] = useState('');

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement newsletter subscription
    alert('תודה על ההרשמה לניוזלטר!');
    setEmail('');
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
                className="bg-white text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors whitespace-nowrap"
              >
                הרשמה
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
                href="https://wa.me/972500000000"
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
                    href="tel:+972500000000"
                    className="hover:text-white transition-colors"
                  >
                    050-000-0000
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
                  <p className="text-sm">רחוב דוגמה 123, תל אביב</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400">
              © {new Date().getFullYear()} שטיחי בוטיק יוסף. כל הזכויות שמורות.
            </p>
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
