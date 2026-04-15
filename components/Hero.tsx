'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';

type HeroSlide = {
  id: string;
  image_url: string;
  badge?: string;
  title: string;
  subtitle?: string;
  description?: string;
  highlight?: string;
  link: string;
  link_text: string;
  gradient_from: string;
  gradient_via: string;
  gradient_to: string;
  accent_color: string;
  promo_enabled?: boolean;
  promo_text?: string;
  promo_subtitle?: string;
  promo_description?: string;
  promo_disclaimer?: string;
  promo_code?: string;
};

const fallbackSlides: HeroSlide[] = [
  {
    id: 'carpets',
    image_url: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=1920&q=80',
    badge: 'איכות פרימיום מאז 2010',
    title: 'שטיחים איכותיים',
    subtitle: 'לכל בית',
    description: 'מבחר רחב של שטיחים מעוצבים, מודרניים וקלאסיים',
    highlight: 'באיכות פרימיום',
    link: '/products?type=carpets',
    link_text: 'צפה בשטיחים',
    gradient_from: 'from-yellow-400',
    gradient_via: 'via-yellow-300',
    gradient_to: 'to-yellow-500',
    accent_color: 'text-yellow-400',
  },
  {
    id: 'plants',
    image_url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1920&q=80',
    badge: 'ירוק בריא לבית',
    title: 'עציצים מרהיבים',
    subtitle: 'לכל חלל',
    description: 'מגוון עציצים מדהים שיהפכו את הבית שלך',
    highlight: 'לירוק',
    link: '/products?type=plants',
    link_text: 'צפה בעציצים',
    gradient_from: 'from-green-400',
    gradient_via: 'via-green-300',
    gradient_to: 'to-green-500',
    accent_color: 'text-green-400',
  },
];

export default function Hero() {
  const [scrollY, setScrollY] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [slides, setSlides] = useState<HeroSlide[]>(fallbackSlides);

  // Fetch slides from DB
  useEffect(() => {
    async function fetchSlides() {
      if (!supabase) return;
      try {
        const { data } = await supabase
          .from('hero_slides')
          .select('*')
          .eq('is_active', true)
          .order('sort_order');
        if (data && data.length > 0) {
          setSlides(data);
        }
      } catch {
        // Keep fallback slides
      }
    }
    fetchSlides();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-rotate slides every 6 seconds
  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
        setIsTransitioning(false);
      }, 500);
    }, 6000);

    return () => clearInterval(interval);
  }, [slides.length]);

  const goToSlide = (index: number) => {
    if (index !== currentSlide && !isTransitioning) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentSlide(index);
        setIsTransitioning(false);
      }, 500);
    }
  };

  const slide = slides[currentSlide];
  if (!slide) return null;

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
          src={slide.image_url}
          alt={slide.title}
          fill
          className="object-cover scale-110"
          priority
          sizes="100vw"
          unoptimized
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
            {slide.subtitle && (
              <span className={`text-transparent bg-clip-text bg-gradient-to-r ${slide.gradient_from} ${slide.gradient_via} ${slide.gradient_to} drop-shadow-2xl inline-block mt-2`}>
                {slide.subtitle}
              </span>
            )}
          </h1>

          <div className={`w-20 h-1 bg-gradient-to-r ${slide.gradient_from} to-transparent mb-8`}></div>

          {slide.description && (
            <p className="text-xl md:text-2xl mb-12 text-gray-100 font-light leading-relaxed max-w-2xl">
              {slide.description}
              {slide.highlight && (
                <span className={`font-bold ${slide.accent_color.replace('text-', 'text-').replace('400', '200')}`}> {slide.highlight}</span>
              )}
            </p>
          )}

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href={slide.link}
              className="btn-primary inline-flex items-center justify-center gap-3 bg-white text-gray-900 hover:bg-gray-100 shadow-luxury"
            >
              <span>{slide.link_text}</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <a
              href="https://wa.me/972515092208"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary inline-flex items-center justify-center gap-3 border-white text-white hover:bg-white hover:text-gray-900"
            >
              <span>צור קשר</span>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            </a>
          </div>

          {/* Navigation Dots */}
          {slides.length > 1 && (
            <div className="flex gap-3 mt-8">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`transition-all duration-300 ${
                    index === currentSlide
                      ? `w-12 h-3 ${slide.accent_color.replace('text-', 'bg-')}`
                      : 'w-3 h-3 bg-white/40 hover:bg-white/60'
                  } rounded-full`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}

          {/* Stats - Refined */}
          <div className="flex flex-wrap gap-12 mt-8 pt-10 border-t border-white/10">
            <div className="group">
              <div className={`text-4xl md:text-5xl font-black font-display mb-1 ${slide.accent_color}`}>1000+</div>
              <div className="text-sm uppercase tracking-wider text-gray-300 font-light">לקוחות מרוצים</div>
            </div>
            <div className="group">
              <div className={`text-4xl md:text-5xl font-black font-display mb-1 ${slide.accent_color}`}>4.9/5</div>
              <div className="text-sm uppercase tracking-wider text-gray-300 font-light">דירוג ממוצע</div>
            </div>
            <div className="group">
              <div className={`text-4xl md:text-5xl font-black font-display mb-1 ${slide.accent_color}`}>15+</div>
              <div className="text-sm uppercase tracking-wider text-gray-300 font-light">שנות ניסיון</div>
            </div>
          </div>
        </div>
      </div>

      {/* Promo Box - Desktop: left side, Mobile: bottom strip */}
      {slide.promo_enabled && slide.promo_text && (
        <>
          {/* Desktop promo box */}
          <div
            className={`hidden md:flex absolute left-0 top-0 bottom-0 w-[280px] lg:w-[320px] z-20 transition-opacity duration-500 ${
              isTransitioning ? 'opacity-0' : 'opacity-100'
            }`}
          >
            <div className="relative w-full h-full flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm px-8 text-center">
              <div className={`text-7xl lg:text-8xl font-black font-display mb-2 ${slide.accent_color}`}>
                {slide.promo_text}
              </div>
              {slide.promo_subtitle && (
                <div className={`text-3xl lg:text-4xl font-black mb-4 ${slide.accent_color}`}>
                  {slide.promo_subtitle}
                </div>
              )}
              {slide.promo_description && (
                <div className="text-white/90 text-lg font-medium mb-4 leading-relaxed">
                  {slide.promo_description}
                </div>
              )}
              {slide.promo_code && (
                <div className="bg-white/10 border border-white/30 rounded-lg px-4 py-2 mb-4">
                  <div className="text-white/70 text-xs mb-1">קוד הנחה:</div>
                  <div className="text-white font-black text-xl tracking-widest">{slide.promo_code}</div>
                </div>
              )}
              {slide.promo_disclaimer && (
                <div className="text-white/50 text-xs leading-relaxed mt-2">
                  {slide.promo_disclaimer}
                </div>
              )}
            </div>
          </div>

          {/* Mobile promo strip */}
          <div
            className={`md:hidden absolute left-4 right-4 bottom-[140px] z-20 transition-opacity duration-500 ${
              isTransitioning ? 'opacity-0' : 'opacity-100'
            }`}
          >
            <div className="bg-black/60 backdrop-blur-sm rounded-xl px-4 py-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className={`text-3xl font-black font-display ${slide.accent_color}`}>{slide.promo_text}</span>
                {slide.promo_subtitle && (
                  <span className={`text-lg font-bold ${slide.accent_color}`}>{slide.promo_subtitle}</span>
                )}
              </div>
              {slide.promo_code && (
                <div className="bg-white/10 border border-white/30 rounded-lg px-3 py-1 text-center">
                  <div className="text-white/70 text-[10px]">קוד:</div>
                  <div className="text-white font-black text-sm tracking-wider">{slide.promo_code}</div>
                </div>
              )}
            </div>
          </div>
        </>
      )}

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
