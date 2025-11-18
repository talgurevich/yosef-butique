'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { supabase, GalleryImage } from '@/lib/supabase';

export default function CustomerGallery() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGalleryImages();
  }, []);

  const fetchGalleryImages = async () => {
    try {
      const { data, error } = await supabase
        .from('customer_gallery')
        .select('*')
        .eq('is_active', true)
        .order('is_featured', { ascending: false })
        .order('sort_order', { ascending: true })
        .limit(12);

      if (error) throw error;
      setImages(data || []);
    } catch (error) {
      console.error('Error fetching gallery images:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
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
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 font-display">
              הלקוחות שלנו
            </h2>
            <p className="text-gray-600 text-lg font-light">
              תמונות אמיתיות
              <span className="font-serif italic"> מלקוחות מרוצים</span>
            </p>
          </div>
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        </div>
      </section>
    );
  }

  if (images.length === 0) {
    return null; // Don't show the section if there are no images
  }

  return (
    <section className="section-spacing bg-gradient-to-b from-white to-gray-50 pattern-chevron-subtle">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
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
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 font-display">
            הלקוחות שלנו
          </h2>
          <p className="text-gray-600 text-lg font-light">
            תמונות אמיתיות
            <span className="font-serif italic"> מלקוחות מרוצים</span>
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
          {images.map((image) => (
            <div
              key={image.id}
              className="aspect-square bg-gray-200 rounded-xl overflow-hidden hover:scale-105 transition-transform cursor-pointer group relative shadow-lg hover:shadow-2xl"
            >
              <img
                src={image.image_url}
                alt={image.customer_name || 'Customer photo'}
                className="w-full h-full object-cover"
              />

              {/* Overlay with customer info on hover */}
              {(image.customer_name || image.testimonial) && (
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-70 transition-all flex items-center justify-center p-4 opacity-0 group-hover:opacity-100">
                  <div className="text-white text-center">
                    {image.customer_name && (
                      <p className="font-semibold text-sm mb-1">{image.customer_name}</p>
                    )}
                    {image.testimonial && (
                      <p className="text-xs line-clamp-3">{image.testimonial}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center">
          <div className="inline-flex flex-wrap items-center justify-center gap-8 card-luxury-minimal p-6">
            <div className="flex items-center gap-2">
              <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
              <span className="text-gray-700 font-semibold">מעל 1,000 לקוחות מרוצים</span>
            </div>
            <div className="w-px h-6 bg-gray-300 hidden sm:block"></div>
            <div className="flex items-center gap-2">
              <svg className="w-6 h-6 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-gray-700 font-semibold">דירוג ממוצע: 4.9/5</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
