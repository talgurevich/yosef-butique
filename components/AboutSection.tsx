'use client';

import Link from 'next/link';
import { FaTruck, FaUndo, FaShieldAlt, FaHeadset } from 'react-icons/fa';

export default function AboutSection() {
  const features = [
    {
      icon: <FaTruck className="text-3xl" />,
      title: 'משלוח חינם',
      description: 'משלוח חינם בקנייה מעל ₪299',
    },
    {
      icon: <FaUndo className="text-3xl" />,
      title: 'החזרות בחינם',
      description: 'החזרה חינם תוך 14 יום',
    },
    {
      icon: <FaShieldAlt className="text-3xl" />,
      title: 'אחריות מלאה',
      description: 'אחריות יצרן על כל המוצרים',
    },
    {
      icon: <FaHeadset className="text-3xl" />,
      title: 'שירות לקוחות',
      description: 'זמינים עבורכם בכל שאלה',
    },
  ];

  return (
    <section className="py-16 bg-primary-50">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
              אודות שטיחי בוטיק יוסף
            </h2>
            <p className="text-gray-600 text-lg mb-6 leading-relaxed">
              אנחנו מתמחים במכירת שטיחים איכותיים ומעוצבים לבית. עם ניסיון של שנים
              רבות בתחום, אנו מציעים מבחר רחב של שטיחים מודרניים, קלאסיים ומעוצבים
              המתאימים לכל סגנון ובית.
            </p>
            <p className="text-gray-600 text-lg mb-8 leading-relaxed">
              אנו מאמינים באיכות, בשירות מעולה ובמתן חוויית קנייה נעימה ללקוחותינו.
              כל שטיח בחנות שלנו נבחר בקפידה על מנת להבטיח את האיכות הגבוהה ביותר.
            </p>
            <Link
              href="/about"
              className="inline-block bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
            >
              קרא עוד אודותינו
            </Link>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow"
              >
                <div className="text-primary-600 flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-lg text-gray-800 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
