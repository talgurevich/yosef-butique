import { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';

export const metadata: Metadata = {
  title: 'תנאי שימוש',
  description: 'תנאי השימוש באתר שטיחי בוטיק יוסף. מידע על מדיניות רכישה, תשלום, משלוח, החזרות ואחריות.',
  alternates: { canonical: '/terms' },
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">תנאי שימוש</h1>
          <p className="text-xl text-primary-100">
            תנאי השימוש באתר שטיחי בוטיק יוסף
          </p>
        </div>
      </div>

      {/* Breadcrumbs */}
      <Breadcrumbs items={[{ label: 'תנאי שימוש' }]} />

      {/* Content */}
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-8">
              עדכון אחרון: {new Date().toLocaleDateString('he-IL', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">1. כללי</h2>
              <p className="text-gray-600 mb-4">
                ברוכים הבאים לאתר שטיחי בוטיק יוסף (להלן: "האתר"). השימוש באתר מהווה הסכמה מלאה לתנאי שימוש אלה. אם אינך מסכים לתנאים אלה, אנא הימנע משימוש באתר.
              </p>
              <p className="text-gray-600 mb-4">
                האתר מופעל על ידי יוסף בוטיק בע״מ (להלן: "החברה"), ומספק פלטפורמה לרכישת שטיחים ומוצרי טקסטיל לבית.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">2. רכישת מוצרים</h2>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">2.1 ביצוע הזמנה</h3>
              <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
                <li>כל הזמנה באתר מהווה הצעה לרכישת המוצרים</li>
                <li>ההזמנה תיחשב כמאושרת רק לאחר קבלת אישור מהחברה</li>
                <li>החברה שומרת לעצמה את הזכות לסרב להזמנה מכל סיבה שהיא</li>
                <li>המחירים באתר נכונים למועד הפרסום ועשויים להשתנות ללא הודעה מוקדמת</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">2.2 תשלום</h3>
              <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
                <li>התשלום מתבצע באמצעות כרטיס אשראי או אמצעי תשלום מאושרים אחרים</li>
                <li>כל המחירים באתר כוללים מע״מ אלא אם צוין אחרת</li>
                <li>החיוב יבוצע במועד אישור ההזמנה</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">2.3 משלוח</h3>
              <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
                <li>זמן אספקה משוער: 3-5 ימי עסקים</li>
                <li>המשלוח יתבצע לכתובת שצוינה בהזמנה בלבד</li>
                <li>החברה לא תישא באחריות לעיכובים הנובעים מכוח עליון</li>
              </ul>
            </section>

            <section className="mb-8" id="returns">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">3. החלפה, החזרה וביטול עסקה</h2>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">3.1 תנאי החלפה והחזרה</h3>
              <p className="text-gray-600 mb-4">
                החלפה או החזרה תתאפשר תוך 14 ימים מיום קבלת המוצר, בהצגת חשבונית ובכפוף לתנאים הבאים:
              </p>
              <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
                <li>יש למסור הודעת ביטול בכתב לדואר האלקטרוני של החברה</li>
                <li>המוצר חייב להיות ארוז באריזתו המקורית</li>
                <li>החברה תאשר כי לא נעשה שימוש במוצר והוא ללא פגם או לכלוך</li>
                <li>יש לתאם איסוף מראש עם שירות הלקוחות</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">3.2 החזר כספי</h3>
              <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
                <li>החזר כספי יבוצע תוך 14 ימים מקבלת המוצר בחזרה</li>
                <li>ההחזר יבוצע לאותו אמצעי תשלום בו בוצעה הרכישה</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">3.3 מוצרים שאינם ניתנים להחזרה</h3>
              <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
                <li>מוצרים שהוזמנו במיוחד עבור הלקוח</li>
                <li>מוצרים שנעשה בהם שימוש או שאינם באריזתם המקורית</li>
                <li>מוצרים שניזוקו או התלכלכו כתוצאה משימוש</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">4. אחריות ושירות</h2>
              <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
                <li>כל המוצרים באתר מגיעים עם אחריות יצרן סטנדרטית</li>
                <li>האחריות חלה על פגמי ייצור בלבד</li>
                <li>האחריות אינה חלה על בלאי רגיל או נזקים שנגרמו משימוש לקוי</li>
                <li>לקבלת שירות יש לפנות לשירות הלקוחות עם פרטי ההזמנה</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">5. קניין רוחני</h2>
              <p className="text-gray-600 mb-4">
                כל התכנים באתר, לרבות טקסטים, תמונות, עיצובים, לוגו וסימני מסחר, הם בבעלות החברה ומוגנים בזכויות יוצרים. אסור להעתיק, לשכפל או להפיץ תכנים מהאתר ללא אישור בכתב מהחברה.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">6. הגבלת אחריות</h2>
              <p className="text-gray-600 mb-4">
                החברה עושה כל מאמץ להציג מידע מדויק ועדכני באתר, אך אינה מתחייבת לדיוק מוחלט. החברה לא תישא באחריות לנזקים עקיפים, תוצאתיים או מיוחדים הנובעים משימוש באתר או מרכישת מוצרים.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">7. פרטיות</h2>
              <p className="text-gray-600 mb-4">
                השימוש באתר כפוף גם{' '}
                <Link href="/privacy" className="text-primary-600 hover:text-primary-700 underline">
                  למדיניות הפרטיות
                </Link>
                {' '}שלנו. אנא קרא את מדיניות הפרטיות כדי להבין כיצד אנו אוספים ומשתמשים במידע שלך.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">8. שינויים בתנאי השימוש</h2>
              <p className="text-gray-600 mb-4">
                החברה שומרת לעצמה את הזכות לשנות תנאי שימוש אלה בכל עת. שינויים יכנסו לתוקף מיד עם פרסומם באתר. המשך שימוש באתר לאחר שינוי התנאים מהווה הסכמה לשינויים.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">9. סמכות שיפוט</h2>
              <p className="text-gray-600 mb-4">
                תנאי שימוש אלה יהיו כפופים לדיני מדינת ישראל. סמכות השיפוט הבלעדית בכל סכסוך הנובע מהשימוש באתר תהיה לבתי המשפט המוסמכים בישראל.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">10. יצירת קשר</h2>
              <p className="text-gray-600 mb-4">
                לשאלות או הבהרות בנוגע לתנאי השימוש, ניתן ליצור קשר:
              </p>
              <ul className="list-none text-gray-600 space-y-2">
                <li>📧 אימייל: info@boutique-yossef.co.il</li>
                <li>📞 טלפון: 051-509-2208</li>
                <li>📍 כתובת: השקד משק 47, מושב בית עזרא</li>
              </ul>
            </section>

            <div className="border-t border-gray-200 pt-8 mt-8">
              <p className="text-sm text-gray-500 text-center">
                יוסף בוטיק בע״מ | © {new Date().getFullYear()} כל הזכויות שמורות
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
    </div>
  );
}
