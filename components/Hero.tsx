'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const heroSlides = [
  {
    id: 'carpets',
    image: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=1920&q=80',
    badge: 'איכות פרימיום מאז 2010',
    title: 'שטיחים איכותיים',
    subtitle: 'לכל בית',
    description: 'מבחר רחב של שטיחים מעוצבים, מודרניים וקלאסיים',
    highlight: 'באיכות פרימיום',
    link: '/products?type=carpets',
    linkText: 'צפה בשטיחים',
    gradientFrom: 'from-yellow-400',
    gradientVia: 'via-yellow-300',
    gradientTo: 'to-yellow-500',
    accentColor: 'text-yellow-400',
  },
  {
    id: 'plants',
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1920&q=80',
    badge: 'ירוק בריא לבית',
    title: 'עציצים מרהיבים',
    subtitle: 'לכל חלל',
    description: 'מגוון עציצים מדהים שיהפכו את הבית שלך',
    highlight: 'לגן עדן ירוק',
    link: '/products?type=plants',
    linkText: 'צפה בעציצים',
    gradientFrom: 'from-green-400',
    gradientVia: 'via-green-300',
    gradientTo: 'to-green-500',
    accentColor: 'text-green-400',
  },
];

export default function Hero() {
  const [scrollY, setScrollY] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-rotate slides every 6 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
        setIsTransitioning(false);
      }, 500);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  const goToSlide = (index: number) => {
    if (index !== currentSlide && !isTransitioning) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentSlide(index);
        setIsTransitioning(false);
      }, 500);
    }
  };

  const slide = heroSlides[currentSlide];

  return (
    <section className="relative h-[700px] md:h-[800px] text-white overflow-hidden pattern-chevron-subtle">
      {/* Geometric Background Elements */}
      <div className="absolute top-20 right-10 w-96 h-96 bg-gradient-to-br from-yellow-500/10 to-transparent rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-20 left-10 w-80 h-80 bg-gradient-to-tl from-primary-500/10 to-transparent rounded-full blur-3xl animate-pulse-slow"></div>

      {/* Background Image with Parallax and Transition */}
      <div
        className={`absolute inset-0 will-change-transform transition-opacity duration-500 ${
          isTransitioning ? 'opacity-0' : 'opacity-100'
        }`}
        style={{
          transform: `translateY(${scrollY * 0.5}px)`,
        }}
      >
        <Image
          key={slide.id}
          src={slide.image}
          alt={slide.title}
          fill
          className="object-cover scale-110"
          priority
          sizes="100vw"
        />
        {/* Refined gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40"></div>
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-4 h-full flex items-center">
        <div
          className={`max-w-4xl transition-all duration-500 ${
            isTransitioning ? 'opacity-0 translate-y-8' : 'opacity-100 translate-y-0'
          }`}
        >
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 leading-[1.1] font-display">
            <span className="text-white drop-shadow-2xl block">
              {slide.title}
            </span>
            <span className={`text-transparent bg-clip-text bg-gradient-to-r ${slide.gradientFrom} ${slide.gradientVia} ${slide.gradientTo} drop-shadow-2xl inline-block mt-2`}>
              {slide.subtitle}
            </span>
          </h1>

          <div className={`w-20 h-1 bg-gradient-to-r ${slide.gradientFrom} to-transparent mb-8`}></div>

          <p className="text-xl md:text-2xl mb-12 text-gray-100 font-light leading-relaxed max-w-2xl">
            {slide.description}
            <span className={`font-serif italic ${slide.accentColor.replace('text-', 'text-').replace('400', '200')}`}> {slide.highlight}</span>
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href={slide.link}
              className="btn-primary inline-flex items-center justify-center gap-3 bg-white text-gray-900 hover:bg-gray-100 shadow-luxury"
            >
              <span>{slide.linkText}</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <Link
              href="/contact"
              className="btn-secondary inline-flex items-center justify-center gap-3 border-white text-white hover:bg-white hover:text-gray-900"
            >
              <span>צור קשר</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </Link>
          </div>

          {/* Navigation Dots */}
          <div className="flex gap-3 mt-8">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`transition-all duration-300 ${
                  index === currentSlide
                    ? `w-12 h-3 ${slide.accentColor.replace('text-', 'bg-')}`
                    : 'w-3 h-3 bg-white/40 hover:bg-white/60'
                } rounded-full`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Stats - Refined */}
          <div className="flex flex-wrap gap-12 mt-8 pt-10 border-t border-white/10">
            <div className="group">
              <div className={`text-4xl md:text-5xl font-black font-display mb-1 ${slide.accentColor}`}>1000+</div>
              <div className="text-sm uppercase tracking-wider text-gray-300 font-light">לקוחות מרוצים</div>
            </div>
            <div className="group">
              <div className={`text-4xl md:text-5xl font-black font-display mb-1 ${slide.accentColor}`}>4.9/5</div>
              <div className="text-sm uppercase tracking-wider text-gray-300 font-light">דירוג ממוצע</div>
            </div>
            <div className="group">
              <div className={`text-4xl md:text-5xl font-black font-display mb-1 ${slide.accentColor}`}>15+</div>
              <div className="text-sm uppercase tracking-wider text-gray-300 font-light">שנות ניסיון</div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative element */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full"
        >
          <path
            d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="white"
          />
        </svg>
      </div>
    </section>
  );
}
