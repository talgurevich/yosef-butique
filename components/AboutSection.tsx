'use client';

import Link from 'next/link';
import { FaTruck, FaUndo, FaShieldAlt, FaHeadset } from 'react-icons/fa';

export default function AboutSection() {
  const features = [
    {
      icon: <FaTruck className="text-4xl" />,
      title: 'משלוח חינם',
      description: 'משלוח חינם בקנייה מעל ₪299',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      icon: <FaUndo className="text-4xl" />,
      title: 'החזרות בחינם',
      description: 'החזרה חינם תוך 14 יום',
      gradient: 'from-green-500 to-emerald-500',
    },
    {
      icon: <FaShieldAlt className="text-4xl" />,
      title: 'אחריות מלאה',
      description: 'אחריות יצרן על כל המוצרים',
      gradient: 'from-terracotta to-red-500',
    },
    {
      icon: <FaHeadset className="text-4xl" />,
      title: 'שירות לקוחות',
      description: 'זמינים עבורכם בכל שאלה',
      gradient: 'from-purple-500 to-pink-500',
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-primary-50 via-white to-sage-light/20 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 right-0 w-72 h-72 bg-gradient-to-l from-primary-600/5 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-0 w-96 h-96 bg-gradient-to-r from-terracotta/5 to-transparent rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div className="animate-slide-in-right">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-terracotta/10 to-primary-600/10 px-5 py-2 rounded-full mb-6">
              <svg className="w-5 h-5 text-terracotta" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="font-bold text-gray-700">מותג מוביל בישראל</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary-600 via-terracotta to-primary-800 mb-8 leading-tight">
              אודות שטיחי בוטיק יוסף
            </h2>
            <p className="text-gray-600 text-xl mb-6 leading-relaxed">
              אנחנו מתמחים במכירת שטיחים איכותיים ומעוצבים לבית. עם ניסיון של שנים
              רבות בתחום, אנו מציעים מבחר רחב של שטיחים מודרניים, קלאסיים ומעוצבים
              המתאימים לכל סגנון ובית.
            </p>
            <p className="text-gray-600 text-xl mb-10 leading-relaxed">
              אנו מאמינים באיכות, בשירות מעולה ובמתן חוויית קנייה נעימה ללקוחותינו.
              כל שטיח בחנות שלנו נבחר בקפידה על מנת להבטיח את האיכות הגבוהה ביותר.
            </p>
            <Link
              href="/about"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white px-10 py-4 rounded-xl font-bold text-lg hover:from-primary-700 hover:to-primary-800 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <span>קרא עוד אודותינו</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-2 gap-6 animate-slide-in-left">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group bg-white p-8 rounded-2xl shadow-lg text-center hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 relative overflow-hidden"
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                {/* Gradient background on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>

                <div className={`relative text-transparent bg-clip-text bg-gradient-to-br ${feature.gradient} flex justify-center mb-5 group-hover:scale-110 transition-transform duration-500`}>
                  {feature.icon}
                </div>
                <h3 className="relative font-bold text-xl text-gray-800 mb-3 group-hover:text-primary-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="relative text-gray-600 text-base leading-relaxed">{feature.description}</p>

                {/* Decorative corner */}
                <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-transparent group-hover:border-primary-300 rounded-tr-xl transition-all duration-500"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
