import { Metadata } from 'next';
import Link from 'next/link';
import { FaHeart, FaLeaf, FaStar, FaUsers, FaHome, FaTruck, FaAward, FaHandshake } from 'react-icons/fa';
import Breadcrumbs from '@/components/Breadcrumbs';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'אודות | הסיפור שלנו',
  description: 'שטיחי בוטיק יוסף - עסק משפחתי מאז 1987. למעלה מ-35 שנה של מסירות, איכות ואהבה לעיצוב הבית. מושב בית עזרא.',
  alternates: {
    canonical: '/about',
  },
  openGraph: {
    title: 'אודות | שטיחי בוטיק יוסף',
    description: 'עסק משפחתי מאז 1987. למעלה מ-35 שנה של מסירות, איכות ואהבה לעיצוב הבית.',
    type: 'website',
    locale: 'he_IL',
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-cream">
      <Header />
      {/* Hero Section */}
      <div className="relative text-white py-20 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1920&q=80"
            alt="Family carpet business"
            className="w-full h-full object-cover"
          />
          {/* Dark gradient overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary-900/90 via-primary-800/85 to-sage/90"></div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-terracotta/20 rounded-full blur-3xl"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold mb-6">
              עסק משפחתי מאז 1987
            </span>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6">
              הסיפור שלנו
            </h1>
            <p className="text-xl md:text-2xl text-white/90 leading-relaxed">
              למעלה מ-35 שנה של מסירות, איכות ואהבה למה שאנחנו עושים
            </p>
          </div>
        </div>

        {/* Wavy Bottom Border */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none rotate-180">
          <svg className="relative block w-full h-[60px]" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="fill-cream"></path>
          </svg>
        </div>
      </div>

      {/* Breadcrumbs */}
      <Breadcrumbs items={[{ label: 'אודות' }]} />

      {/* Main Story Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          {/* Story Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-primary-100 p-3 rounded-full">
                <FaHome className="text-2xl text-primary-600" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800">המסע שלנו</h2>
            </div>

            <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
              <p className="text-xl leading-relaxed">
                שטיחי בוטיק יוסף החל את דרכו ב-1987 במושב בית עזרא כעסק משפחתי קטן,
                כשיוסף מייסד העסק החליט להביא את אהבתו לעיצוב הבית ולטקסטיל איכותי לקהל רחב יותר.
              </p>

              <p className="leading-relaxed">
                מה שהתחיל כחנות שטיחים קטנה, התפתח לאורך השנים למיזם משפחתי מלא הכולל מגוון רחב
                של שטיחים איכותיים, עציצים מעוצבים ופתרונות עיצוב ייחודיים לבית. למעלה מ-35 שנה
                של ניסיון לימדו אותנו שהמפתח להצלחה הוא שילוב של איכות ללא פשרות, שירות אישי וחם,
                ומחירים הוגנים.
              </p>

              <p className="leading-relaxed">
                היום, הדור השני והשלישי של משפחת יוסף ממשיכים את המסורת המשפחתית, תוך שהם משלבים
                טכנולוגיות מודרניות ומגמות עיצוב עכשוויות עם הערכים המסורתיים שעליהם נבנה העסק.
                אנחנו גאים בזכות שסייענו לאלפי משפחות בישראל להפוך את הבית שלהן למקום יפה, נעים ומזמין.
              </p>

              <div className="bg-sage-light/30 border-r-4 border-sage p-6 rounded-lg my-8">
                <p className="text-lg font-semibold text-gray-800 mb-2">
                  "כל שטיח שאנחנו מוכרים, כל עציץ שאנחנו מספקים - זה לא רק מוצר. זה חלק מהבית של המשפחה שלכם."
                </p>
                <p className="text-gray-600 font-medium">
                  - יוסף, מייסד העסק
                </p>
              </div>

              <p className="leading-relaxed">
                ממוקמים במושב בית עזרא השקט, אנחנו משרתים לקוחות מכל רחבי הארץ עם משלוחים מהירים
                ושירות לקוחות מעולה. כל מוצר שאנחנו מציעים נבחר בקפידה רבה, נבדק איכותו, ומגיע אליכם
                עם האחריות המלאה שלנו לשביעות רצונכם.
              </p>
            </div>
          </div>

          {/* Values Grid */}
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-12">
              הערכים שלנו
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Value 1 */}
              <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow border-t-4 border-primary-600">
                <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <FaAward className="text-3xl text-primary-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 text-center mb-3">איכות מעולה</h3>
                <p className="text-gray-600 text-center leading-relaxed">
                  אנחנו מאמינים באיכות ללא פשרות. כל מוצר נבחר בקפידה ועומד בסטנדרטים הגבוהים ביותר.
                </p>
              </div>

              {/* Value 2 */}
              <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow border-t-4 border-green-600">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <FaHandshake className="text-3xl text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 text-center mb-3">שירות אישי</h3>
                <p className="text-gray-600 text-center leading-relaxed">
                  עסק משפחתי אומר טיפול אישי. אנחנו כאן בשבילכם, תמיד זמינים ומוכנים לעזור.
                </p>
              </div>

              {/* Value 3 */}
              <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow border-t-4 border-terracotta">
                <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <FaHeart className="text-3xl text-terracotta" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 text-center mb-3">אהבה למה שאנחנו עושים</h3>
                <p className="text-gray-600 text-center leading-relaxed">
                  זו לא עבודה - זו תשוקה. אנחנו אוהבים לעזור לכם להפוך את הבית שלכם למיוחד.
                </p>
              </div>

              {/* Value 4 */}
              <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow border-t-4 border-sage">
                <div className="bg-sage-light w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <FaLeaf className="text-3xl text-sage" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 text-center mb-3">אחריות סביבתית</h3>
                <p className="text-gray-600 text-center leading-relaxed">
                  אנחנו דואגים לסביבה, עובדים עם ספקים בעלי אחריות חברתית ומציעים מוצרים ידידותיים לסביבה.
                </p>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl shadow-xl p-8 md:p-12 text-white mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              המספרים שלנו
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-5xl md:text-6xl font-extrabold mb-2">35+</div>
                <div className="text-lg text-primary-100">שנות ניסיון</div>
              </div>
              <div className="text-center">
                <div className="text-5xl md:text-6xl font-extrabold mb-2">15K+</div>
                <div className="text-lg text-primary-100">לקוחות מרוצים</div>
              </div>
              <div className="text-center">
                <div className="text-5xl md:text-6xl font-extrabold mb-2">500+</div>
                <div className="text-lg text-primary-100">מוצרים במלאי</div>
              </div>
              <div className="text-center">
                <div className="text-5xl md:text-6xl font-extrabold mb-2">100%</div>
                <div className="text-lg text-primary-100">שביעות רצון</div>
              </div>
            </div>
          </div>

          {/* Why Choose Us */}
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-12">
              למה לבחור בנו?
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6 flex items-start gap-4 hover:shadow-xl transition-shadow">
                <div className="bg-blue-100 p-3 rounded-full flex-shrink-0">
                  <FaTruck className="text-2xl text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">משלוח חינם ומהיר</h3>
                  <p className="text-gray-600 leading-relaxed">
                    משלוח חינם לכל הארץ על הזמנות מעל ₪990. נגיע אליכם תוך 3-5 ימי עסקים, ארוזים ומוגנים בקפידה.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 flex items-start gap-4 hover:shadow-xl transition-shadow">
                <div className="bg-green-100 p-3 rounded-full flex-shrink-0">
                  <FaAward className="text-2xl text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">אחריות מלאה</h3>
                  <p className="text-gray-600 leading-relaxed">
                    כל המוצרים שלנו מגיעים עם אחריות מלאה. אנחנו עומדים מאחורי האיכות ומתחייבים לשביעות הרצון שלכם.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 flex items-start gap-4 hover:shadow-xl transition-shadow">
                <div className="bg-purple-100 p-3 rounded-full flex-shrink-0">
                  <FaUsers className="text-2xl text-purple-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">ייעוץ מקצועי</h3>
                  <p className="text-gray-600 leading-relaxed">
                    הצוות המקצועי שלנו זמין לייעוץ ועזרה בבחירת המוצרים המתאימים ביותר לביתכם ולצרכים שלכם.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 flex items-start gap-4 hover:shadow-xl transition-shadow">
                <div className="bg-red-100 p-3 rounded-full flex-shrink-0">
                  <FaStar className="text-2xl text-terracotta" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">מחירים הוגנים</h3>
                  <p className="text-gray-600 leading-relaxed">
                    אנחנו מאמינים באיכות במחיר הוגן. קבלו את המוצרים הטובים ביותר ללא מחירים מופקעים.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-br from-sage-light to-cream rounded-2xl shadow-lg p-8 md:p-12 text-center border border-sage/20">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              מוכנים להתחיל?
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              בואו לגלות את המגוון המלא של המוצרים שלנו או צרו קשר לייעוץ אישי
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-2 bg-primary-600 text-white px-8 py-4 rounded-lg hover:bg-primary-700 transition-colors font-semibold text-lg shadow-lg hover:shadow-xl"
              >
                <FaStar />
                גלו את המוצרים שלנו
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 bg-white text-primary-600 px-8 py-4 rounded-lg hover:bg-gray-50 transition-colors font-semibold text-lg shadow-lg hover:shadow-xl border-2 border-primary-600"
              >
                <FaHandshake />
                צרו קשר
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
