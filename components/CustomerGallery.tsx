'use client';

import { useEffect, useState } from 'react';
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
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              הלקוחות שלנו
            </h2>
            <p className="text-gray-600 text-lg">
              תמונות אמיתיות מלקוחות מרוצים
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
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            הלקוחות שלנו
          </h2>
          <p className="text-gray-600 text-lg">
            תמונות אמיתיות מלקוחות מרוצים
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {images.map((image) => (
            <div
              key={image.id}
              className="aspect-square bg-gray-200 rounded-lg overflow-hidden hover:scale-105 transition-transform cursor-pointer group relative"
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

        <div className="mt-8 text-center">
          <p className="text-gray-600">
            💚 מעל 1,000 לקוחות מרוצים | ⭐ דירוג ממוצע: 4.9/5
          </p>
        </div>
      </div>
    </section>
  );
}
