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
    <section className="relative h-[700px] md:h-[800px] text-white overflow-hidden pattern-chevron-subtle">
      {/* Geometric Background Elements */}
      <div className="absolute top-20 right-10 w-96 h-96 bg-gradient-to-br from-yellow-500/10 to-transparent rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-20 left-10 w-80 h-80 bg-gradient-to-tl from-primary-500/10 to-transparent rounded-full blur-3xl animate-pulse-slow"></div>

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
        {/* Refined gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40"></div>
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-4 h-full flex items-center">
        <div className="max-w-4xl animate-fade-in">
          {/* Small badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full mb-6 border border-white/20">
            <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></span>
            <span className="text-sm font-semibold">איכות פרימיום מאז 2010</span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 leading-[1.1] font-display">
            <span className="text-white drop-shadow-2xl block">
              שטיחים איכותיים
            </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 drop-shadow-2xl inline-block mt-2">
              לכל בית
            </span>
          </h1>

          <div className="w-20 h-1 bg-gradient-to-r from-yellow-400 to-transparent mb-8"></div>

          <p className="text-xl md:text-2xl mb-12 text-gray-100 font-light leading-relaxed max-w-2xl">
            מבחר רחב של שטיחים מעוצבים, מודרניים וקלאסיים
            <span className="font-serif italic text-yellow-200"> באיכות פרימיום</span>
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/products"
              className="btn-primary inline-flex items-center justify-center gap-3 bg-white text-gray-900 hover:bg-gray-100 shadow-luxury"
            >
              <span>צפה בקולקציה</span>
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

          {/* Stats - Refined */}
          <div className="flex flex-wrap gap-12 mt-16 pt-10 border-t border-white/10">
            <div className="group">
              <div className="text-4xl md:text-5xl font-black font-display mb-1 text-yellow-400">1000+</div>
              <div className="text-sm uppercase tracking-wider text-gray-300 font-light">לקוחות מרוצים</div>
            </div>
            <div className="group">
              <div className="text-4xl md:text-5xl font-black font-display mb-1 text-yellow-400">4.9/5</div>
              <div className="text-sm uppercase tracking-wider text-gray-300 font-light">דירוג ממוצע</div>
            </div>
            <div className="group">
              <div className="text-4xl md:text-5xl font-black font-display mb-1 text-yellow-400">15+</div>
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
