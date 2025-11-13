'use client';

import { FaWhatsapp } from 'react-icons/fa';
import { useState, useEffect } from 'react';

export default function FloatingWhatsApp() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show button after a short delay for smooth entrance
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <a
      href="https://wa.me/972515092208"
      target="_blank"
      rel="noopener noreferrer"
      className={`md:hidden fixed bottom-6 left-6 z-50 bg-green-500 text-white p-4 rounded-full shadow-2xl hover:bg-green-600 transition-all duration-300 hover:scale-110 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
      }`}
      aria-label="Contact us on WhatsApp"
    >
      <FaWhatsapp className="text-3xl" />

      {/* Ripple animation */}
      <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-20"></span>

      {/* Notification badge with pulse */}
      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold animate-pulse">
        1
      </span>
    </a>
  );
}
