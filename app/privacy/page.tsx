import { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';

export const metadata: Metadata = {
  title: 'מדיניות פרטיות',
  description: 'מדיניות הפרטיות של שטיחי בוטיק יוסף. כיצד אנו אוספים, משתמשים ומגנים על המידע האישי שלכם.',
  alternates: { canonical: '/privacy' },
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">מדיניות פרטיות</h1>
          <p className="text-xl text-primary-100">
            מדיניות הפרטיות של שטיחי בוטיק יוסף
          </p>
        </div>
      </div>

      {/* Breadcrumbs */}
      <Breadcrumbs items={[{ label: 'מדיניות פרטיות' }]} />

      {/* Content */}
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-8">
              עדכון אחרון: {new Date().toLocaleDateString('he-IL', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">1. מבוא</h2>
              <p className="text-gray-600 mb-4">
                יוסף בוטיק בע״מ (להלן: "החברה", "אנו" או "שלנו") מחויבת להגנה על פרטיותך. מדיניות פרטיות זו מסבירה כיצד אנו אוספים, משתמשים ומגנים על המידע האישי שלך כאשר אתה משתמש באתר שלנו.
              </p>
              <p className="text-gray-600 mb-4">
                השימוש באתר מהווה הסכמה מלאה למדיניות פרטיות זו. אם אינך מסכים למדיניות זו, אנא הימנע משימוש באתר.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">2. המידע שאנו אוספים</h2>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">2.1 מידע שאתה מספק לנו</h3>
              <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
                <li><strong>פרטי הזמנה:</strong> שם מלא, כתובת למשלוח, מספר טלפון, כתובת אימייל</li>
                <li><strong>פרטי תשלום:</strong> פרטי כרטיס אשראי (מאובטחים דרך ספק תשלומים חיצוני)</li>
                <li><strong>חשבון משתמש:</strong> אם תבחר ליצור חשבון - שם משתמש, סיסמה והיסטוריית הזמנות</li>
                <li><strong>תקשורת:</strong> הודעות ופניות ששלחת אלינו</li>
                <li><strong>ניוזלטר:</strong> כתובת אימייל אם נרשמת לקבלת עדכונים</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">2.2 מידע שנאסף אוטומטית</h3>
              <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
                <li><strong>מידע טכני:</strong> כתובת IP, סוג דפדפן, מערכת הפעלה</li>
                <li><strong>עוגיות (Cookies):</strong> מידע על השימוש באתר והעדפות</li>
                <li><strong>נתוני שימוש:</strong> דפים שביקרת, זמן שהייה, קישורים שלחצת</li>
                <li><strong>מיקום:</strong> מיקום כללי על בסיס כתובת IP (לא מדויק)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">3. כיצד אנו משתמשים במידע</h2>
              <p className="text-gray-600 mb-4">
                אנו משתמשים במידע שאספנו למטרות הבאות:
              </p>
              <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
                <li><strong>עיבוד הזמנות:</strong> לעבד ולספק את ההזמנות שלך</li>
                <li><strong>תקשורת:</strong> לשלוח אישורי הזמנה, עדכוני משלוח ומידע רלוונטי</li>
                <li><strong>שירות לקוחות:</strong> לספק תמיכה ולטפל בפניות</li>
                <li><strong>שיפור השירות:</strong> לשפר את חווית המשתמש באתר</li>
                <li><strong>שיווק:</strong> לשלוח הצעות מיוחדות ועדכונים (רק אם נתת הסכמה)</li>
                <li><strong>אבטחה:</strong> למנוע הונאות ולהגן על האתר</li>
                <li><strong>חובות חוקיות:</strong> לעמוד בדרישות משפטיות ורגולטוריות</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">4. שיתוף מידע עם צדדים שלישיים</h2>
              <p className="text-gray-600 mb-4">
                אנו לא מוכרים את המידע האישי שלך. אנו עשויים לשתף מידע עם:
              </p>
              <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
                <li><strong>ספקי שירות:</strong> חברות משלוחים, ספקי תשלומים, שירותי אחסון ענן</li>
                <li><strong>שותפים עסקיים:</strong> רק במידת הצורך לביצוע השירות</li>
                <li><strong>רשויות חוק:</strong> כאשר נדרש על פי חוק</li>
                <li><strong>בעסקאות עסקיות:</strong> במקרה של מיזוג, רכישה או מכירת נכסים</li>
              </ul>
              <p className="text-gray-600 mb-4">
                כל צד שלישי שאיתו אנו משתפים מידע מחויב להגן על המידע שלך.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">5. עוגיות (Cookies)</h2>
              <p className="text-gray-600 mb-4">
                האתר משתמש בעוגיות לשיפור חווית המשתמש. עוגיות הן קבצי טקסט קטנים המאוחסנים במכשיר שלך.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">סוגי עוגיות בשימוש:</h3>
              <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
                <li><strong>עוגיות חיוניות:</strong> נדרשות לתפקוד בסיסי של האתר</li>
                <li><strong>עוגיות תפקודיות:</strong> זוכרות העדפות והגדרות</li>
                <li><strong>עוגיות אנליטיות:</strong> עוזרות לנו להבין כיצד משתמשים משתמשים באתר</li>
                <li><strong>עוגיות שיווקיות:</strong> משמשות להצגת פרסומות רלוונטיות</li>
              </ul>
              <p className="text-gray-600 mb-4">
                ניתן לחסום עוגיות דרך הגדרות הדפדפן, אך פעולה זו עלולה להשפיע על תפקוד האתר.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">6. אבטחת מידע</h2>
              <p className="text-gray-600 mb-4">
                אנו נוקטים באמצעי אבטחה מתקדמים להגנה על המידע שלך:
              </p>
              <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
                <li>הצפנת SSL/TLS לכל התקשורת באתר</li>
                <li>שמירת מידע בשרתים מאובטחים</li>
                <li>הגבלת גישה למידע רגיש לעובדים מורשים בלבד</li>
                <li>ביקורות אבטחה תקופתיות</li>
                <li>גיבויים סדירים של מידע</li>
              </ul>
              <p className="text-gray-600 mb-4">
                למרות מאמצינו, אף שיטת אבטחה אינה חסינה לחלוטין. אנו ממליצים לשמור על סיסמאות חזקות ולא לשתף מידע רגיש.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">7. זכויותיך</h2>
              <p className="text-gray-600 mb-4">
                בהתאם לחוק הגנת הפרטיות, התשמ״א-1981, יש לך את הזכויות הבאות:
              </p>
              <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
                <li><strong>זכות עיון:</strong> לבקש עותק של המידע האישי שלך</li>
                <li><strong>זכות תיקון:</strong> לתקן מידע שגוי או לא מדויק</li>
                <li><strong>זכות מחיקה:</strong> לבקש מחיקת המידע שלך (בכפוף למגבלות חוקיות)</li>
                <li><strong>זכות התנגדות:</strong> להתנגד לשימושים מסוימים במידע</li>
                <li><strong>זכות להגבלה:</strong> להגביל את העיבוד של המידע שלך</li>
                <li><strong>זכות לניידות:</strong> לקבל את המידע שלך בפורמט נייד</li>
                <li><strong>זכות לביטול הסכמה:</strong> לבטל הסכמה למשלוח ניוזלטר או שיווק</li>
              </ul>
              <p className="text-gray-600 mb-4">
                לממש זכויות אלה, ניתן ליצור קשר עם רכז הפרטיות שלנו בפרטים המופיעים בסוף מדיניות זו.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">8. שמירת מידע</h2>
              <p className="text-gray-600 mb-4">
                אנו שומרים את המידע האישי שלך כל עוד הוא נדרש למטרות שלשמן נאסף:
              </p>
              <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
                <li>פרטי הזמנות - 7 שנים (לצורכי חוק מס ערך מוסף)</li>
                <li>חשבון משתמש - עד לבקשת מחיקה</li>
                <li>ניוזלטר - עד לביטול הרשמה</li>
                <li>לוגים ונתוני אבטחה - עד שנה</li>
              </ul>
              <p className="text-gray-600 mb-4">
                לאחר תקופה זו, המידע יימחק או יוסווה באופן שלא ניתן יהיה לזהות אותך.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">9. קטינים</h2>
              <p className="text-gray-600 mb-4">
                האתר אינו מיועד לשימוש קטינים מתחת לגיל 18. אנו לא אוספים במודע מידע אישי מקטינים. אם הגעת למידע שנאסף מקטין, אנא צור קשר ונמחק אותו מיד.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">10. קישורים לאתרים חיצוניים</h2>
              <p className="text-gray-600 mb-4">
                האתר עשוי להכיל קישורים לאתרים חיצוניים. אנו לא אחראים למדיניות הפרטיות או לתוכן של אתרים אלה. אנו ממליצים לקרוא את מדיניות הפרטיות של כל אתר שאתה מבקר בו.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">11. שינויים במדיניות הפרטיות</h2>
              <p className="text-gray-600 mb-4">
                אנו עשויים לעדכן מדיניות פרטיות זו מעת לעת. שינויים מהותיים יפורסמו באתר עם תאריך העדכון. המשך שימוש באתר לאחר שינויים אלה מהווה הסכמה למדיניות המעודכנת.
              </p>
              <p className="text-gray-600 mb-4">
                אנו ממליצים לבדוק דף זה מעת לעת כדי להישאר מעודכן בשינויים.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">12. יצירת קשר</h2>
              <p className="text-gray-600 mb-4">
                לשאלות, הבהרות או בקשות בנוגע למדיניות הפרטיות או זכויותיך, ניתן ליצור קשר עם רכז הפרטיות שלנו:
              </p>
              <div className="bg-gray-50 p-6 rounded-lg mb-4">
                <p className="text-gray-800 font-semibold mb-3">רכז הפרטיות - יוסף בוטיק בע״מ</p>
                <ul className="list-none text-gray-600 space-y-2">
                  <li>📧 אימייל: privacy@boutique-yossef.co.il</li>
                  <li>📞 טלפון: 051-509-2208</li>
                  <li>📍 כתובת: השקד משק 47, מושב בית עזרא, ישראל</li>
                  <li>⏰ שעות פעילות: ראשון-חמישי 9:00-17:00</li>
                </ul>
              </div>
              <p className="text-gray-600 mb-4">
                נעשה כל מאמץ להשיב לפניות בתוך 30 יום.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">13. תלונות</h2>
              <p className="text-gray-600 mb-4">
                אם אינך מרוצה מאופן הטיפול בפנייתך, יש לך זכות להגיש תלונה לרשות להגנת הפרטיות:
              </p>
              <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                <p className="text-gray-800 font-semibold mb-3">רשות להגנת הפרטיות</p>
                <ul className="list-none text-gray-600 space-y-2">
                  <li>🌐 אתר: www.gov.il/he/Departments/the_privacy_protection_authority</li>
                  <li>📧 אימייל: info@justice.gov.il</li>
                  <li>📞 טלפון: *3852 או 02-6467777</li>
                </ul>
              </div>
            </section>

            <div className="border-t border-gray-200 pt-8 mt-8">
              <p className="text-sm text-gray-500 text-center mb-4">
                מדיניות פרטיות זו הינה בהתאם לחוק הגנת הפרטיות, התשמ״א-1981 ותקנות הגנת הפרטיות (אבטחת מידע), התשע״ז-2017
              </p>
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
