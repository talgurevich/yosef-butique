'use client';

import { FaStar } from 'react-icons/fa';

const reviews = [
  {
    id: 1,
    name: 'דניאל כהן',
    location: 'תל אביב',
    rating: 5,
    date: '2025-01-15',
    review: 'שירות מעולה! השטיח הגיע במהירות ובאיכות פנטסטית. בדיוק מה שחיפשתי לסלון. האיכות מדהימה והמחיר הוגן. בהחלט אמליץ!',
    product: 'שטיח גיאומטרי מודרני',
  },
  {
    id: 2,
    name: 'שרה לוי',
    location: 'ירושלים',
    rating: 5,
    date: '2025-01-10',
    review: 'קניתי שטיח פרסי מדהים לחדר השינה. האיכות מצוינת והצוות מאוד מקצועי ועוזר. התקשורת הייתה מעולה לאורך כל התהליך. תודה רבה!',
    product: 'שטיח פרסי מסורתי',
  },
  {
    id: 3,
    name: 'יוסי מזרחי',
    location: 'חיפה',
    rating: 5,
    date: '2025-01-08',
    review: 'השטיח עבר את כל הציפיות שלי! איכות פרימיום, מרקם נעים ונראה מושלם בבית. המשלוח היה מהיר והאריזה מעולה. ממליץ בחום!',
    product: 'שטיח שאגי יוקרתי',
  },
  {
    id: 4,
    name: 'מיכל אברהם',
    location: 'ראשון לציון',
    rating: 5,
    date: '2025-01-05',
    review: 'קניתי שטיח לחדר הילדים ובני פשוט אוהב אותו! צבעוני, רך ואיכותי. השירות היה מצוין והמחיר הוגן מאוד. בהחלט נחזור לקנות.',
    product: 'שטיח צבעוני לחדר ילדים',
  },
  {
    id: 5,
    name: 'אבי גולדשטיין',
    location: 'פתח תקווה',
    rating: 5,
    date: '2025-01-03',
    review: 'חוויית קנייה מעולה! יוסף היה מאוד מקצועי ועזר לי לבחור את השטיח המושלם לסלון. האיכות יוצאת מן הכלל והמחיר תחרותי.',
    product: 'שטיח צמר טבעי',
  },
  {
    id: 6,
    name: 'רונית פרידמן',
    location: 'נתניה',
    rating: 5,
    date: '2024-12-28',
    review: 'מאוד מרוצה! השטיח הגיע במצב מושלם, האיכות מעולה והשירות היה אדיב ומקצועי. בהחלט שווה את המחיר. תודה רבה על הקשב והסבלנות.',
    product: 'שטיח מודרני',
  },
];

export default function Reviews() {
  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary-600 via-terracotta to-primary-800 mb-6">
            מה הלקוחות שלנו אומרים
          </h2>
          <p className="text-gray-600 text-xl max-w-2xl mx-auto">
            אלפי לקוחות מרוצים בחרו בשטיחי בוטיק יוסף
          </p>
          <div className="mt-6 h-1 w-24 bg-gradient-to-r from-terracotta to-primary-600 mx-auto rounded-full"></div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="flex items-center justify-center gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} className="text-yellow-400 text-2xl" />
              ))}
            </div>
            <div className="text-4xl font-bold text-gray-800 mb-1">5.0</div>
            <div className="text-gray-600">דירוג ממוצע</div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-4xl font-bold text-primary-600 mb-1">1,000+</div>
            <div className="text-gray-600">לקוחות מרוצים</div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-4xl font-bold text-terracotta mb-1">15+</div>
            <div className="text-gray-600">שנות ניסיון</div>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((review, index) => (
            <div
              key={review.id}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-shadow duration-300"
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            >
              {/* Rating */}
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={`${
                      i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                    } text-lg`}
                  />
                ))}
              </div>

              {/* Review Text */}
              <p className="text-gray-700 mb-6 leading-relaxed">
                "{review.review}"
              </p>

              {/* Product */}
              <p className="text-sm text-primary-600 font-semibold mb-4">
                {review.product}
              </p>

              {/* Reviewer Info */}
              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-gray-800">{review.name}</div>
                    <div className="text-sm text-gray-500">{review.location}</div>
                  </div>
                  <div className="text-sm text-gray-400">
                    {new Date(review.date).toLocaleDateString('he-IL', {
                      year: 'numeric',
                      month: 'long',
                    })}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="mt-16 text-center">
          <div className="inline-flex flex-wrap items-center justify-center gap-8 bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-2">
              <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-gray-700 font-semibold">איכות מובטחת</span>
            </div>

            <div className="flex items-center gap-2">
              <svg className="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
              </svg>
              <span className="text-gray-700 font-semibold">משלוח מהיר</span>
            </div>

            <div className="flex items-center gap-2">
              <svg className="w-6 h-6 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              <span className="text-gray-700 font-semibold">החזרה חינם</span>
            </div>

            <div className="flex items-center gap-2">
              <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
              <span className="text-gray-700 font-semibold">שירות אישי</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
