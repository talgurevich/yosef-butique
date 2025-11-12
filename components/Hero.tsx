'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Hero() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="relative h-[700px] md:h-[800px] text-white overflow-hidden">
      {/* Background Image with Parallax */}
      <div
        className="absolute inset-0 will-change-transform"
        style={{
          transform: `translateY(${scrollY * 0.5}px)`,
        }}
      >
        <Image
          src="https://images.unsplash.com/photo-1554995207-c18c203602cb?w=1920&q=80"
          alt="Beautiful living room with modern carpet"
          fill
          className="object-cover scale-110"
          priority
          sizes="100vw"
        />
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal/85 via-charcoal/60 to-transparent animate-pulse-slow"></div>
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-4 h-full flex items-center">
        <div className="max-w-4xl animate-fade-in">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 leading-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-cream to-white drop-shadow-2xl">
              שטיחים איכותיים
            </span>
            <br />
            <span className="text-terracotta drop-shadow-2xl">לכל בית</span>
          </h1>

          <p className="text-xl md:text-3xl mb-10 text-cream/95 drop-shadow-lg font-light leading-relaxed max-w-2xl">
            מבחר רחב של שטיחים מעוצבים, מודרניים וקלאסיים באיכות פרימיום
          </p>

          <div className="flex flex-col sm:flex-row gap-5">
            <Link
              href="/products"
              className="group relative inline-flex items-center justify-center gap-3 bg-gradient-to-r from-terracotta via-terracotta-dark to-terracotta text-white px-10 py-5 rounded-2xl font-bold text-xl hover:shadow-2xl transition-all transform hover:scale-105 overflow-hidden"
            >
              <span className="relative z-10">צפה בקולקציה</span>
              <svg className="relative z-10 w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <div className="absolute inset-0 bg-gradient-to-r from-terracotta-dark to-red-700 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-3 bg-white/15 backdrop-blur-md text-white px-10 py-5 rounded-2xl font-bold text-xl hover:bg-white/25 transition-all border-2 border-white/50 hover:border-white transform hover:scale-105 shadow-xl"
            >
              <span>צור קשר</span>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </Link>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-8 mt-12 pt-8 border-t border-white/20">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                </svg>
              </div>
              <div>
                <div className="text-2xl font-bold">1000+</div>
                <div className="text-sm text-cream/80">לקוחות מרוצים</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <div>
                <div className="text-2xl font-bold">4.9/5</div>
                <div className="text-sm text-cream/80">דירוג ממוצע</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <div className="text-2xl font-bold">15+</div>
                <div className="text-sm text-cream/80">שנות ניסיון</div>
              </div>
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
