'use client';

import Link from 'next/link';
import Image from 'next/image';

interface Attribute {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parent_id?: string | null;
}

interface AttributesPreviewProps {
  categories: Attribute[];
  spaces: Attribute[];
}

export default function AttributesPreview({ categories, spaces }: AttributesPreviewProps) {
  // Attribute-specific images
  const attributeImages: { [key: string]: string } = {
    // Categories (סגנונות)
    'modern-rugs': 'https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=800&q=80', // Modern minimalist rug
    'ethnic-rugs': 'https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?w=800&q=80', // Ethnic/bohemian rug
    '-1762999289423': 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80', // Classic traditional carpet
    'loop-rugs': 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80', // Textured loop carpet
    'designer-carpets': 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&q=80', // Designer artistic rug

    // Spaces (חללים)
    'living-room': 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80', // Living room with carpet
    'bedroom': 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800&q=80', // Bedroom with rug
    'kids-room': 'https://images.unsplash.com/photo-1628744448840-55bdb2497bd4?w=800&q=80', // Kids room colorful
    'dining-room': 'https://images.unsplash.com/photo-1600210491369-e753d80a41f3?w=800&q=80', // Dining room with rug
    'hallway': 'https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=800&q=80', // Hallway runner
    'office': 'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800&q=80', // Office with carpet
    'bathroom': 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800&q=80', // Bathroom rug
    'balcony': 'https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?w=800&q=80', // Balcony outdoor rug

    // Fallback
    'default': 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&q=80',
  };

  // Filter out parent categories for display
  const displayCategories = categories.filter(cat => !cat.parent_id).slice(0, 4);
  const displaySpaces = spaces.slice(0, 4);

  return (
    <section className="section-spacing bg-gradient-to-br from-gray-50 via-white to-gray-50 relative overflow-hidden pattern-chevron-subtle">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-yellow-500/5 to-transparent rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-yellow-500/5 to-transparent rounded-full blur-3xl animate-pulse-slow"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-20">
          <div className="inline-flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-0.5 bg-gradient-to-r from-transparent to-yellow-600"></div>
            <Image
              src="/logo-icon.png"
              alt=""
              width={40}
              height={40}
              className="w-10 h-10"
            />
            <div className="w-12 h-0.5 bg-gradient-to-l from-transparent to-yellow-600"></div>
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-gray-900 mb-5 font-display tracking-tight">
            קטגוריות מוצרים
          </h2>
          <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto font-light">
            גלה את המגוון הרחב שלנו - שטיחים
            <span className="font-serif italic"> בכל הסגנונות והצבעים</span>
          </p>
        </div>

        {/* First Row - Categories (סגנונות) */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 text-right">סגנונות</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {displayCategories.map((category, index) => (
              <Link
                key={category.id}
                href={`/products?category=${category.slug}`}
                className="group relative h-80 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3"
                style={{
                  animationDelay: `${index * 150}ms`,
                }}
              >
                {/* Background Image */}
                <div className="absolute inset-0">
                  <img
                    src={attributeImages[category.slug] || 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&q=80'}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-primary-800/80 via-black/40 to-transparent group-hover:from-black/90 transition-all duration-500"></div>
                </div>

                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                  <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold rounded-full border border-white/30">
                    סגנון
                  </span>
                </div>

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-6">
                  <div className="transform translate-y-0 group-hover:-translate-y-2 transition-transform duration-500">
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                      {category.name}
                    </h3>
                    {category.description && (
                      <p className="text-white/90 text-sm mb-4 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        {category.description}
                      </p>
                    )}
                    <div className="flex items-center gap-2 text-white font-semibold">
                      <span className="text-lg">צפו</span>
                      <svg className="w-5 h-5 transform group-hover:translate-x-2 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </div>
                  </div>

                  {/* Decorative corner accent */}
                  <div className="absolute top-4 right-4 w-12 h-12 border-t-4 border-r-4 border-white/50 rounded-tr-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>

                {/* Animated border on hover */}
                <div className="absolute inset-0 border-4 border-transparent group-hover:border-primary-500/50 rounded-2xl transition-all duration-500 pointer-events-none"></div>
              </Link>
            ))}
          </div>
        </div>

        {/* Second Row - Spaces (חללים) */}
        <div>
          <h3 className="text-2xl font-bold text-gray-800 mb-6 text-right">חללים</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {displaySpaces.map((space, index) => (
              <Link
                key={space.id}
                href={`/products?space=${space.slug}`}
                className="group relative h-80 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3"
                style={{
                  animationDelay: `${index * 150}ms`,
                }}
              >
                {/* Background Image */}
                <div className="absolute inset-0">
                  <img
                    src={attributeImages[space.slug] || 'https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=800&q=80'}
                    alt={space.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-terracotta/80 via-black/40 to-transparent group-hover:from-black/90 transition-all duration-500"></div>
                </div>

                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                  <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold rounded-full border border-white/30">
                    חלל
                  </span>
                </div>

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-6">
                  <div className="transform translate-y-0 group-hover:-translate-y-2 transition-transform duration-500">
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                      {space.name}
                    </h3>
                    {space.description && (
                      <p className="text-white/90 text-sm mb-4 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        {space.description}
                      </p>
                    )}
                    <div className="flex items-center gap-2 text-white font-semibold">
                      <span className="text-lg">צפו</span>
                      <svg className="w-5 h-5 transform group-hover:translate-x-2 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </div>
                  </div>

                  {/* Decorative corner accent */}
                  <div className="absolute top-4 right-4 w-12 h-12 border-t-4 border-r-4 border-white/50 rounded-tr-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>

                {/* Animated border on hover */}
                <div className="absolute inset-0 border-4 border-transparent group-hover:border-terracotta/50 rounded-2xl transition-all duration-500 pointer-events-none"></div>
              </Link>
            ))}
          </div>
        </div>

        <div className="text-center mt-16">
          <Link
            href="/products"
            className="btn-primary inline-flex items-center gap-3 shadow-luxury text-lg"
          >
            <span>צפה בכל המוצרים</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
