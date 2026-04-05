import { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'הצהרת נגישות | שטיחי בוטיק יוסף',
  description: 'הצהרת הנגישות של אתר שטיחי בוטיק יוסף. מידע על התאמות הנגישות באתר בהתאם לתקן הישראלי 5568.',
  alternates: { canonical: '/accessibility' },
};

export default function AccessibilityPage() {
  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <Header />

      {/* Hero */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">הצהרת נגישות</h1>
          <p className="text-xl text-primary-100">
            הצהרת הנגישות של אתר שטיחי בוטיק יוסף
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="bg-white rounded-lg shadow-md p-8 md:p-12">
          <div className="prose prose-lg max-w-none text-right">

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">מחויבות לנגישות</h2>
              <p className="text-gray-600 mb-4">
                בוטיק יוסף מחויב להנגשת האתר והשירותים הדיגיטליים שלו לכלל האוכלוסייה, לרבות אנשים עם מוגבלויות. אנו משקיעים משאבים רבים על מנת להבטיח שכל אדם יוכל לגלוש באתר, להשתמש בשירותיו וליהנות מחוויית קנייה נוחה ושוויונית של שטיחים וצמחים.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">תקן הנגישות</h2>
              <p className="text-gray-600 mb-4">
                האתר עומד בדרישות תקן ישראלי 5568 להנגשת תכנים באינטרנט, ברמת התאמה AA של הנחיות WCAG 2.0 (Web Content Accessibility Guidelines). תקן זה מגדיר כיצד להפוך תכנים באינטרנט לנגישים יותר עבור אנשים עם מוגבלויות שונות.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">פעולות שנעשו</h2>
              <p className="text-gray-600 mb-4">
                להלן הפעולות שבוצעו במסגרת הנגשת האתר:
              </p>
              <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
                <li>מבנה האתר תומך בקוראי מסך (Screen Readers) ובטכנולוגיות מסייעות</li>
                <li>ניווט מלא באמצעות מקלדת לכל האלמנטים האינטראקטיביים באתר</li>
                <li>היררכיית כותרות תקינה ומסודרת לניווט נוח</li>
                <li>טקסט חלופי (Alt Text) לכל התמונות באתר</li>
                <li>ניגודיות צבעים העומדת בדרישות WCAG AA</li>
                <li>תוסף נגישות המאפשר התאמת הגדרות תצוגה אישיות</li>
                <li>טפסים עם תוויות (Labels) מתאימות לכל שדה</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">דרכי פנייה בנושא נגישות</h2>
              <p className="text-gray-600 mb-4">
                אם נתקלתם בבעיית נגישות באתר או שיש לכם הצעות לשיפור, אנא פנו אלינו ונשמח לטפל בכך בהקדם:
              </p>
              <div className="bg-gray-50 p-6 rounded-lg">
                <ul className="list-none text-gray-600 space-y-3">
                  <li>
                    <span className="font-semibold text-gray-800">טלפון:</span>{' '}
                    <a href="tel:0515092208" className="text-primary-600 hover:text-primary-700 underline">051-509-2208</a>
                  </li>
                  <li>
                    <span className="font-semibold text-gray-800">אימייל:</span>{' '}
                    <a href="mailto:boutiqueyossef@gmail.com" className="text-primary-600 hover:text-primary-700 underline">boutiqueyossef@gmail.com</a>
                  </li>
                  <li>
                    <span className="font-semibold text-gray-800">כתובת:</span>{' '}
                    מושב בית עזרא
                  </li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">תאריך עדכון</h2>
              <p className="text-gray-600 mb-4">
                הצהרה זו עודכנה לאחרונה בתאריך אפריל 2026.
              </p>
            </section>

            <div className="border-t border-gray-200 pt-8 mt-8">
              <p className="text-sm text-gray-500 text-center">
                יוסף בוטיק בע״מ | &copy; {new Date().getFullYear()} כל הזכויות שמורות
              </p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/"
              className="inline-block bg-primary-600 text-white px-8 py-3 rounded-lg hover:bg-primary-700 transition-colors font-semibold"
            >
              חזרה לדף הבית
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
