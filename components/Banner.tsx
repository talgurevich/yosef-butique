'use client';

import { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import { supabase } from '@/lib/supabase';

interface BannerData {
  id: string;
  message: string;
  is_active: boolean;
  gradient_from: string;
  gradient_to: string;
  text_color: string;
}

export default function Banner() {
  const [banner, setBanner] = useState<BannerData | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBanner();
  }, []);

  const fetchBanner = async () => {
    try {
      if (!supabase) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('banner')
        .select('*')
        .eq('is_active', true)
        .limit(1)
        .single();

      if (error) {
        console.log('No active banner found');
        setLoading(false);
        return;
      }

      if (data) {
        // Check if user has dismissed this banner
        const dismissedBannerId = localStorage.getItem('dismissedBannerId');
        if (dismissedBannerId !== data.id) {
          setBanner(data);
          setIsVisible(true);
        }
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching banner:', error);
      setLoading(false);
    }
  };

  const handleDismiss = () => {
    if (banner) {
      localStorage.setItem('dismissedBannerId', banner.id);
      setIsVisible(false);
    }
  };

  if (loading || !isVisible || !banner) {
    return null;
  }

  return (
    <div
      className="relative w-full py-3 px-4"
      style={{
        background: `linear-gradient(to right, ${banner.gradient_from}, ${banner.gradient_to})`,
        color: banner.text_color,
      }}
    >
      <div className="container mx-auto flex items-center justify-between gap-4">
        <div className="flex-1 text-center">
          <p className="text-sm md:text-base font-medium">
            {banner.message}
          </p>
        </div>
        <button
          onClick={handleDismiss}
          className="flex-shrink-0 p-1 hover:opacity-80 transition-opacity"
          aria-label="סגור באנר"
        >
          <FaTimes className="text-lg" />
        </button>
      </div>
    </div>
  );
}
