'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaWhatsapp, FaClock, FaPaperPlane } from 'react-icons/fa';
import Breadcrumbs from '@/components/Breadcrumbs';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'שגיאה בשליחת ההודעה');
      }

      setLoading(false);
      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
    } catch (error: any) {
      setLoading(false);
      alert('❌ ' + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">צור קשר</h1>
          <p className="text-xl text-primary-100">
            נשמח לעזור ולענות על כל שאלה
          </p>
        </div>
      </div>

      {/* Breadcrumbs */}
      <Breadcrumbs items={[{ label: 'צור קשר' }]} />

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Phone */}
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4">
                <div className="bg-primary-100 p-4 rounded-full">
                  <FaPhone className="text-2xl text-primary-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 mb-2">טלפון</h3>
                  <a
                    href="tel:0515092208"
                    className="text-gray-600 hover:text-primary-600 transition-colors"
                  >
                    051-509-2208
                  </a>
                  <p className="text-sm text-gray-500 mt-1">
                    ראשון-חמישי 9:00-18:00
                  </p>
                </div>
              </div>
            </div>

            {/* WhatsApp */}
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4">
                <div className="bg-green-100 p-4 rounded-full">
                  <FaWhatsapp className="text-2xl text-green-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 mb-2">WhatsApp</h3>
                  <a
                    href="https://wa.me/972515092208"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-green-600 transition-colors"
                  >
                    שלח הודעה
                  </a>
                  <p className="text-sm text-gray-500 mt-1">
                    מענה מהיר בוואטסאפ
                  </p>
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4">
                <div className="bg-blue-100 p-4 rounded-full">
                  <FaEnvelope className="text-2xl text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 mb-2">אימייל</h3>
                  <a
                    href="mailto:info@yossef-boutique.co.il"
                    className="text-gray-600 hover:text-blue-600 transition-colors break-all"
                  >
                    info@yossef-boutique.co.il
                  </a>
                  <p className="text-sm text-gray-500 mt-1">
                    מענה תוך 24 שעות
                  </p>
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4">
                <div className="bg-red-100 p-4 rounded-full">
                  <FaMapMarkerAlt className="text-2xl text-red-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 mb-2">כתובת</h3>
                  <p className="text-gray-600">השקד משק 47</p>
                  <p className="text-gray-600">מושב בית עזרא</p>
                  <a
                    href="https://waze.com/ul?q=השקד משק 47 מושב בית עזרא&navigate=yes"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-3 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm"
                  >
                    נווט עם Waze
                  </a>
                </div>
              </div>
            </div>

            {/* Hours */}
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4">
                <div className="bg-purple-100 p-4 rounded-full">
                  <FaClock className="text-2xl text-purple-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 mb-3">שעות פעילות</h3>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li className="flex justify-between gap-4">
                      <span>ראשון - חמישי:</span>
                      <span className="font-semibold">9:00 - 18:00</span>
                    </li>
                    <li className="flex justify-between gap-4">
                      <span>שישי:</span>
                      <span className="font-semibold">9:00 - 14:00</span>
                    </li>
                    <li className="flex justify-between gap-4">
                      <span>שבת:</span>
                      <span className="text-red-600 font-semibold">סגור</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">שלח לנו הודעה</h2>

              {submitted ? (
                <div className="bg-green-50 border-2 border-green-200 rounded-lg p-8 text-center">
                  <div className="text-green-600 text-6xl mb-4">✓</div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">ההודעה נשלחה בהצלחה!</h3>
                  <p className="text-gray-600 mb-6">
                    תודה שפנית אלינו. נחזור אליך בהקדם האפשרי.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    שלח הודעה נוספת
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name */}
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      שם מלא <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="הכנס את שמך המלא"
                    />
                  </div>

                  {/* Email & Phone */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">
                        אימייל <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="example@gmail.com"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">
                        טלפון
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="050-1234567"
                      />
                    </div>
                  </div>

                  {/* Subject */}
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      נושא <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="">בחר נושא</option>
                      <option value="product">שאלה על מוצר</option>
                      <option value="order">מעקב הזמנה</option>
                      <option value="return">החזרה או החלפה</option>
                      <option value="shipping">שאלת משלוח</option>
                      <option value="complaint">תלונה</option>
                      <option value="other">אחר</option>
                    </select>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      הודעה <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="כתוב את הודעתך כאן..."
                    />
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary-600 text-white px-8 py-4 rounded-lg hover:bg-primary-700 transition-colors font-semibold text-lg flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"></div>
                        שולח...
                      </>
                    ) : (
                      <>
                        <FaPaperPlane />
                        שלח הודעה
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* Map */}
            <div className="mt-8 bg-white rounded-lg shadow-md overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3383.5!2d34.82!3d31.77!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzHCsDQ2JzEyLjAiTiAzNMKwNDknMTIuMCJF!5e0!3m2!1siw!2sil!4v1234567890!5m2!1siw!2sil&q=השקד+משק+47+מושב+בית+עזרא"
                width="100%"
                height="400"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="מפת מיקום - שטיחי בוטיק יוסף"
              />
            </div>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-12">
          <Link
            href="/"
            className="inline-block bg-gray-200 text-gray-800 px-8 py-3 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
          >
            חזרה לדף הבית
          </Link>
        </div>
      </div>
    </div>
  );
}
