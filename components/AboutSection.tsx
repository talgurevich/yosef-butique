'use client';

import Link from 'next/link';

// Custom SVG Icons
const DeliveryIcon = () => (
  <svg className="w-16 h-16" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="20" width="36" height="24" rx="2" fill="currentColor" opacity="0.2"/>
    <path d="M8 28h28v12H8V28z" fill="currentColor" opacity="0.3"/>
    <rect x="40" y="28" width="16" height="16" rx="2" fill="currentColor" opacity="0.2"/>
    <circle cx="16" cy="48" r="4" fill="currentColor"/>
    <circle cx="48" cy="48" r="4" fill="currentColor"/>
    <path d="M40 36h12l4-8h-16v8z" fill="currentColor" opacity="0.4"/>
    <rect x="12" y="16" width="20" height="4" rx="1" fill="currentColor"/>
    <path d="M24 8L28 16H20L24 8z" fill="currentColor"/>
  </svg>
);

const ReturnIcon = () => (
  <svg className="w-16 h-16" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M32 8C18.745 8 8 18.745 8 32s10.745 24 24 24 24-10.745 24-24" stroke="currentColor" strokeWidth="4" strokeLinecap="round" opacity="0.3"/>
    <path d="M52 18l4 14-14-4" fill="currentColor"/>
    <path d="M28 20v8h-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M28 28c0-4 3-8 8-8s8 4 8 8v8c0 4-3 8-8 8s-8-4-8-8" fill="currentColor" opacity="0.2"/>
    <circle cx="36" cy="32" r="3" fill="currentColor"/>
  </svg>
);

const WarrantyIcon = () => (
  <svg className="w-16 h-16" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M32 8l-20 8v12c0 12 8 24 20 28 12-4 20-16 20-28V16L32 8z" fill="currentColor" opacity="0.2"/>
    <path d="M32 12l-16 6v10c0 10 6 20 16 24 10-4 16-14 16-24V18l-16-6z" fill="currentColor" opacity="0.3"/>
    <path d="M28 32l4 4 8-10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="32" cy="32" r="12" stroke="currentColor" strokeWidth="2" opacity="0.2"/>
  </svg>
);

const SupportIcon = () => (
  <svg className="w-16 h-16" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="32" cy="24" r="8" fill="currentColor" opacity="0.3"/>
    <path d="M20 36c0-4 4-8 12-8s12 4 12 8v4H20v-4z" fill="currentColor" opacity="0.2"/>
    <path d="M16 40c-4 0-8 2-8 8v4h12v-8c0-2-2-4-4-4z" fill="currentColor" opacity="0.15"/>
    <path d="M48 40c4 0 8 2 8 8v4H44v-8c0-2 2-4 4-4z" fill="currentColor" opacity="0.15"/>
    <rect x="28" y="44" width="8" height="12" rx="1" fill="currentColor" opacity="0.3"/>
    <circle cx="32" cy="50" r="2" fill="currentColor"/>
    <path d="M24 22h-4c-2 0-4 2-4 4v8c0 2 2 4 4 4h4" stroke="currentColor" strokeWidth="2" opacity="0.4"/>
    <path d="M40 22h4c2 0 4 2 4 4v8c0 2-2 4-4 4h-4" stroke="currentColor" strokeWidth="2" opacity="0.4"/>
  </svg>
);

export default function AboutSection() {
  const features = [
    {
      icon: <DeliveryIcon />,
      title: 'משלוח חינם',
      description: 'משלוח חינם בקנייה מעל ₪500',
      gradient: 'from-blue-500 to-cyan-500',
      color: 'text-blue-500',
    },
    {
      icon: <ReturnIcon />,
      title: 'החזרות בחינם',
      description: 'החזרה חינם תוך 14 יום',
      gradient: 'from-green-500 to-emerald-500',
      color: 'text-green-500',
    },
    {
      icon: <WarrantyIcon />,
      title: 'אחריות מלאה',
      description: 'אחריות יצרן על כל המוצרים',
      gradient: 'from-terracotta to-red-500',
      color: 'text-terracotta',
    },
    {
      icon: <SupportIcon />,
      title: 'שירות לקוחות',
      description: 'זמינים עבורכם בכל שאלה',
      gradient: 'from-purple-500 to-pink-500',
      color: 'text-purple-500',
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

                <div className={`relative flex justify-center mb-5 group-hover:scale-110 transition-transform duration-500 ${feature.color}`}>
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
