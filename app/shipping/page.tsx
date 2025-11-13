import Link from 'next/link';
import { FaTruck, FaUndo, FaBoxOpen, FaPhone } from 'react-icons/fa';
import Breadcrumbs from '@/components/Breadcrumbs';

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">משלוחים והחזרות</h1>
          <p className="text-xl text-primary-100">
            מדיניות המשלוחים וההחזרות של שטיחי בוטיק יוסף
          </p>
        </div>
      </div>

      {/* Breadcrumbs */}
      <Breadcrumbs items={[{ label: 'משלוחים והחזרות' }]} />

      {/* Content */}
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-8">
              עדכון אחרון: {new Date().toLocaleDateString('he-IL', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>

            {/* Quick Info Cards */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                <FaTruck className="text-4xl text-blue-600 mx-auto mb-3" />
                <h3 className="font-bold text-gray-800 mb-2">משלוח חינם</h3>
                <p className="text-gray-600 text-sm">להזמנות מעל ₪299</p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                <FaUndo className="text-4xl text-green-600 mx-auto mb-3" />
                <h3 className="font-bold text-gray-800 mb-2">החזרות בחינם</h3>
                <p className="text-gray-600 text-sm">תוך 14 יום</p>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 text-center">
                <FaBoxOpen className="text-4xl text-purple-600 mx-auto mb-3" />
                <h3 className="font-bold text-gray-800 mb-2">אריזה מאובטחת</h3>
                <p className="text-gray-600 text-sm">הגנה מלאה על המוצר</p>
              </div>
            </div>

            {/* Shipping Section */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <FaTruck className="text-primary-600" />
                מדיניות משלוחים
              </h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">עלויות משלוח</h3>
                  <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                    <ul className="space-y-3 text-gray-600">
                      <li className="flex items-start gap-3">
                        <span className="text-green-600 font-bold text-xl">✓</span>
                        <div>
                          <strong>משלוח חינם</strong> - להזמנות מעל ₪299 לכל רחבי הארץ
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-blue-600 font-bold text-xl">•</span>
                        <div>
                          <strong>משלוח סטנדרטי</strong> - ₪49 להזמנות מתחת ל-₪299
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-purple-600 font-bold text-xl">•</span>
                        <div>
                          <strong>משלוח מהיר</strong> - ₪89 (2-3 ימי עסקים)
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">זמני אספקה</h3>
                  <ul className="list-disc list-inside text-gray-600 space-y-2">
                    <li><strong>משלוח סטנדרטי:</strong> 5-14 ימי עסקים</li>
                    <li><strong>משלוח מהיר:</strong> 2-3 ימי עסקים</li>
                    <li><strong>אזורי פריפריה:</strong> עד 21 ימי עסקים</li>
                    <li><strong>מוצרים מיוחדים:</strong> זמן האספקה יצוין בעמוד המוצר</li>
                  </ul>
                  <p className="text-sm text-gray-500 mt-3">
                    * זמני האספקה הם משוערים ועשויים להשתנות בתקופות עומס
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">אזורי משלוח</h3>
                  <p className="text-gray-600 mb-3">
                    אנו משלחים לכל רחבי ישראל, כולל:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 space-y-2">
                    <li>כל הערים והישובים במרכז הארץ</li>
                    <li>אזור הצפון - עד הגליל העליון</li>
                    <li>אזור הדרום - עד אילת</li>
                    <li>יהודה ושומרון (בכפוף לבדיקת זמינות)</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">תהליך המשלוח</h3>
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-10 h-10 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
                        1
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-1">אישור הזמנה</h4>
                        <p className="text-gray-600 text-sm">
                          תקבל אישור הזמנה במייל עם מספר מעקב
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-10 h-10 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
                        2
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-1">הכנת המשלוח</h4>
                        <p className="text-gray-600 text-sm">
                          נארוז את המוצרים בקפידה ונשלח תוך 1-2 ימי עסקים
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-10 h-10 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
                        3
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-1">יצא לדרך</h4>
                        <p className="text-gray-600 text-sm">
                          תקבל הודעה כשהחבילה יצאה למשלוח + קישור למעקב
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-10 h-10 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
                        4
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-1">קבלת המשלוח</h4>
                        <p className="text-gray-600 text-sm">
                          השליח יצור קשר לתיאום מועד מסירה נוח
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">⚠️ חשוב לדעת</h3>
                  <ul className="list-disc list-inside text-gray-600 space-y-2 text-sm">
                    <li>יש לוודא נוכחות במועד האספקה המתואם</li>
                    <li>מומלץ לבדוק את החבילה בנוכחות השליח</li>
                    <li>במקרה של נזק במשלוח - יש לצלם ולהודיע מיד</li>
                    <li>שמור על תעודת המשלוח עד לבדיקת המוצר</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Returns Section */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <FaUndo className="text-green-600" />
                מדיניות החזרות
              </h2>

              <div className="space-y-6">
                <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-green-900 mb-3">זכות ביטול עסקה</h3>
                  <p className="text-gray-700 mb-3">
                    בהתאם לחוק הגנת הצרכן, יש לך זכות לבטל עסקה תוך <strong>14 יום</strong> ממועד קבלת המוצר, ללא צורך בנימוק.
                  </p>
                  <p className="text-gray-700">
                    ההחזרה והאיסוף מהבית - <strong className="text-green-700">בחינם!</strong>
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">תנאים להחזרה</h3>
                  <p className="text-gray-600 mb-3">
                    כדי שהמוצר יהיה כשיר להחזרה, עליו לעמוד בתנאים הבאים:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 space-y-2">
                    <li>המוצר לא נפתח ולא נעשה בו שימוש</li>
                    <li>המוצר באריזתו המקורית, במצב תקין</li>
                    <li>כל התגים והתוויות מחוברות למוצר</li>
                    <li>המוצר לא ניזוק כתוצאה משימוש לקוי או רשלנות</li>
                    <li>צורפו כל האביזרים והמסמכים שהגיעו עם המוצר</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">תהליך ההחזרה</h3>
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">
                        1
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-1">הודעה על החזרה</h4>
                        <p className="text-gray-600 text-sm mb-2">
                          צור קשר עם שירות הלקוחות תוך 14 יום:
                        </p>
                        <ul className="text-sm text-gray-600 space-y-1">
                          <li>📞 טלפון: 051-509-2208</li>
                          <li>📧 אימייל: returns@yossef-boutique.co.il</li>
                        </ul>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">
                        2
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-1">תיאום איסוף</h4>
                        <p className="text-gray-600 text-sm">
                          נתאם שליח לאיסוף המוצר מהבית (ללא עלות)
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">
                        3
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-1">בדיקת המוצר</h4>
                        <p className="text-gray-600 text-sm">
                          נבדוק את המוצר תוך 3-5 ימי עסקים
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">
                        4
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-1">החזר כספי</h4>
                        <p className="text-gray-600 text-sm">
                          החזר מלא תוך 14 ימים לאמצעי התשלום המקורי
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">מוצרים שלא ניתן להחזיר</h3>
                  <ul className="list-disc list-inside text-gray-600 space-y-2">
                    <li>מוצרים שהוזמנו במיוחד לפי מפרט הלקוח</li>
                    <li>מוצרים שנפתחו והאריזה נפגמה</li>
                    <li>מוצרים שנוצלו או נלכלכו</li>
                    <li>מוצרי מבצע מיוחדים (בכפוף לציון בעמוד המוצר)</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">החלפת מוצר</h3>
                  <p className="text-gray-600 mb-3">
                    מעדיפים להחליף את המוצר? אין בעיה!
                  </p>
                  <ul className="list-disc list-inside text-gray-600 space-y-2">
                    <li>החלפה ללא עלות תוך 14 יום</li>
                    <li>אפשר להחליף למוצר אחר או למידה שונה</li>
                    <li>אם יש הפרש מחיר - נחייב או נזכה בהתאם</li>
                    <li>משלוח החלפה - בחינם!</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Contact Section */}
            <section className="mb-8">
              <div className="bg-gradient-to-r from-primary-50 to-blue-50 border-2 border-primary-200 rounded-lg p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-3">
                  <FaPhone className="text-primary-600" />
                  שירות לקוחות
                </h2>
                <p className="text-gray-700 mb-6">
                  יש שאלות לגבי משלוח או החזרה? אנחנו כאן בשבילך!
                </p>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-3">פרטי התקשרות</h3>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-center gap-2">
                        <span>📞</span>
                        <a href="tel:0515092208" className="hover:text-primary-600">
                          051-509-2208
                        </a>
                      </li>
                      <li className="flex items-center gap-2">
                        <span>📧</span>
                        <a href="mailto:info@yossef-boutique.co.il" className="hover:text-primary-600">
                          info@yossef-boutique.co.il
                        </a>
                      </li>
                      <li className="flex items-center gap-2">
                        <span>💬</span>
                        <a href="https://wa.me/972515092208" target="_blank" rel="noopener noreferrer" className="hover:text-primary-600">
                          WhatsApp
                        </a>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-3">שעות פעילות</h3>
                    <ul className="space-y-1 text-gray-600 text-sm">
                      <li>ראשון - חמישי: 9:00 - 18:00</li>
                      <li>שישי: 9:00 - 14:00</li>
                      <li>שבת: סגור</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            <div className="border-t border-gray-200 pt-8 mt-8">
              <p className="text-sm text-gray-500 text-center">
                יוסף בוטיק בע״מ | © {new Date().getFullYear()} כל הזכויות שמורות
              </p>
            </div>
          </div>

          <div className="mt-8 flex justify-center gap-4">
            <Link
              href="/"
              className="inline-block bg-primary-600 text-white px-8 py-3 rounded-lg hover:bg-primary-700 transition-colors font-semibold"
            >
              חזרה לדף הבית
            </Link>
            <Link
              href="/terms"
              className="inline-block bg-gray-200 text-gray-800 px-8 py-3 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
            >
              תנאי שימוש
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
