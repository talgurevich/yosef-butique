'use client';

import Link from 'next/link';

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
}

interface CategoriesPreviewProps {
  categories: Category[];
}

export default function CategoriesPreview({ categories }: CategoriesPreviewProps) {
  // Default category images (you can replace these with actual uploaded images)
  const categoryImages: { [key: string]: string } = {
    'modern-carpets': 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&q=80',
    'classic-carpets': 'https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=800&q=80',
    'designer-carpets': 'https://images.unsplash.com/photo-1634712282287-14ed57b9cc89?w=800&q=80',
    'runners': 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&q=80',
  };

  const displayCategories = categories.slice(0, 4);

  return (
    <section className="py-20 bg-gradient-to-br from-sage-light/20 via-white to-primary-50/30 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-terracotta/10 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-primary-600/10 to-transparent rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary-600 via-terracotta to-primary-800 mb-6">
            קטגוריות מוצרים
          </h2>
          <p className="text-gray-600 text-xl max-w-2xl mx-auto">
            גלה את המגוון הרחב שלנו - מקלאסי ועד מודרני
          </p>
          <div className="mt-6 h-1 w-24 bg-gradient-to-r from-terracotta to-primary-600 mx-auto rounded-full"></div>
        </div>

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
                  src={category.image_url || categoryImages[category.slug] || 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&q=80'}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent group-hover:from-black/90 transition-all duration-500"></div>
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
                    <span className="text-lg">חקור עכשיו</span>
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

        {categories.length > 4 && (
          <div className="text-center mt-16">
            <Link
              href="/products"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-terracotta to-red-600 text-white px-10 py-4 rounded-xl font-bold text-lg hover:from-terracotta-dark hover:to-red-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <span>צפה בכל הקטגוריות</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
