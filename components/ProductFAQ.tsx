'use client';

import { useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: 'כמה זמן לוקח המשלוח?',
    answer: 'המשלוח לוקח בין 5-14 ימי עסקים. המשלוח חינם לכל הארץ על הזמנות מעל ₪299. נעדכן אתכם בהודעת SMS ברגע שהמוצר יצא לדרך.',
  },
  {
    question: 'האם אפשר להחזיר או להחליף את המוצר?',
    answer: 'כן! יש לכם 14 יום מרגע קבלת המוצר להחזרה או החלפה ללא עלות. המוצר צריך להיות במצב חדש ובאריזה המקורית. ההחזרה מתבצעת בחינם - אנחנו נגיע לאסוף את המוצר מהבית שלכם.',
  },
  {
    question: 'איך מודדים את גודל השטיח הנכון לחדר?',
    answer: 'כלל אצבע: השטיח צריך להיות גדול מספיק כך שלפחות הרגליים הקדמיות של הרהיטים יהיו עליו. לסלון, מומלץ שכל הרהיטים יעמדו על השטיח. חשוב להשאיר מרווח של 30-50 ס״מ בין קצוות השטיח לקירות. נשמח לעזור בייעוץ אישי!',
  },
  {
    question: 'איך מנקים ומטפלים בשטיח?',
    answer: 'מומלץ לשאוב את השטיח פעמיים בשבוע. במקרה של כתם - נגבו מיד עם מטלית לחה, מבלי לשפשף. ניקוי יסודי מומלץ אחת לשנה על ידי מומחה. הימנעו מחשיפה ישירה לשמש לתקופות ממושכות.',
  },
  {
    question: 'האם השטיח מתאים לרצפה מחוממת?',
    answer: 'רוב השטיחים שלנו מתאימים לרצפה מחוממת, אבל חשוב לבדוק בפרטי המוצר. שטיחים דקים יותר מתאימים יותר לרצפה מחוממת מכיוון שהם מאפשרים העברת חום טובה יותר.',
  },
  {
    question: 'מה כלול באחריות?',
    answer: 'כל השטיחים שלנו מגיעים עם אחריות מלאה נגד פגמי ייצור. האחריות כוללת תפרים, דהייה לא טבעית, והתפרקות של החומר. האחריות אינה כוללת בלאי טבעי, כתמים, או נזקים כתוצאה משימוש לא נכון.',
  },
  {
    question: 'האם צריך משטח נגד החלקה?',
    answer: 'מאוד מומלץ! משטח נגד החלקה מונע מהשטיח לזוז, מגן על הרצפה מפני שריטות, ומאריך את חיי השטיח. אנחנו ממליצים להשתמש במשטח איכותי בכל סוגי הרצפות.',
  },
  {
    question: 'האם אפשר לראות את המוצר לפני הרכישה?',
    answer: 'כן! אנחנו ממוקמים במושב בית עזרא ונשמח לקבל אתכם בתיאום מראש. בנוסף, המדיניות שלנו מאפשרת החזרה חינם תוך 14 יום, כך שתוכלו לראות את השטיח בבית ולהחליט בנוחות.',
  },
  {
    question: 'איך אני יודע/ת שהצבעים יתאימו לבית שלי?',
    answer: 'אנחנו ממליצים לצלם את החדר ולהשוות לתמונות המוצר. חשוב לזכור שצבעים עשויים להיראות שונה מעט במסכים שונים. אם לא בטוחים - השתמשו במדיניות ההחזרה שלנו כדי לנסות את השטיח בבית ללא סיכון.',
  },
  {
    question: 'האם השטיחים מתאימים לבתים עם ילדים וחיות מחמד?',
    answer: 'בהחלט! יש לנו שטיחים עמידים במיוחד המתאימים לבתים עם ילדים וחיות מחמד. חפשו שטיחים עם תיאור "עמיד לשחיקה" או "קל לניקוי". נשמח לייעץ לכם על השטיח המתאים ביותר לצרכים שלכם.',
  },
];

export default function ProductFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
          שאלות נפוצות
        </h2>
        <p className="text-gray-600">
          מצאו תשובות לשאלות הנפוצות ביותר על המוצרים שלנו
        </p>
      </div>

      <div className="space-y-4 max-w-4xl mx-auto">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-lg overflow-hidden transition-all hover:shadow-md"
          >
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full flex items-center justify-between p-5 text-right bg-white hover:bg-gray-50 transition-colors"
            >
              <span className="font-semibold text-gray-800 text-lg">
                {faq.question}
              </span>
              <FaChevronDown
                className={`text-primary-600 transition-transform duration-300 flex-shrink-0 mr-4 ${
                  openIndex === index ? 'rotate-180' : ''
                }`}
              />
            </button>
            <div
              className={`transition-all duration-300 ease-in-out ${
                openIndex === index
                  ? 'max-h-96 opacity-100'
                  : 'max-h-0 opacity-0'
              } overflow-hidden`}
            >
              <div className="p-5 pt-0 text-gray-600 leading-relaxed bg-gray-50">
                {faq.answer}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 text-center">
        <p className="text-gray-600 mb-4">
          לא מצאתם תשובה לשאלה שלכם?
        </p>
        <a
          href="/contact"
          className="inline-block bg-primary-600 text-white px-8 py-3 rounded-lg hover:bg-primary-700 transition-colors font-semibold"
        >
          צרו קשר
        </a>
      </div>
    </div>
  );
}
