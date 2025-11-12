'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FaShoppingCart, FaWhatsapp, FaUser, FaTimes, FaChevronDown } from 'react-icons/fa';
import HeaderDropdown, { DropdownItem } from './HeaderDropdown';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileRugsOpen, setMobileRugsOpen] = useState(false);
  const [mobilePlantsOpen, setMobilePlantsOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    setMobileRugsOpen(false);
    setMobilePlantsOpen(false);
  };

  // Rugs dropdown items
  const rugsDropdownItems: DropdownItem[] = [
    {
      label: 'כל השטיחים',
      href: '/products?type=carpets',
    },
    {
      label: 'לפי חדר',
      href: '#',
      items: [
        { label: 'סלון', href: '/products?type=carpets&space=living-room' },
        { label: 'חדר שינה', href: '/products?type=carpets&space=bedroom' },
        { label: 'חדר אוכל', href: '/products?type=carpets&space=dining-room' },
        { label: 'חדר ילדים', href: '/products?type=carpets&space=kids-room' },
      ],
    },
    {
      label: 'לפי צורה',
      href: '#',
      items: [
        { label: 'עגול', href: '/products?type=carpets&shape=round' },
        { label: 'מלבן', href: '/products?type=carpets&shape=rectangular' },
        { label: 'ריבוע', href: '/products?type=carpets&shape=square' },
        { label: 'רץ', href: '/products?type=carpets&shape=runner' },
      ],
    },
  ];

  // Plants dropdown items
  const plantsDropdownItems: DropdownItem[] = [
    {
      label: 'כל הצמחים',
      href: '/products?type=plants',
    },
    {
      label: 'לפי סוג',
      href: '#',
      items: [
        { label: 'צמחי בית', href: '/products?type=plants&plant_type=indoor' },
        { label: 'צמחי חוץ', href: '/products?type=plants&plant_type=outdoor' },
        { label: 'סוקולנטים', href: '/products?type=plants&plant_type=succulents' },
        { label: 'צמחי תבלין', href: '/products?type=plants&plant_type=herbs' },
        { label: 'צמחים פורחים', href: '/products?type=plants&plant_type=flowering' },
      ],
    },
    {
      label: 'לפי רמת טיפול',
      href: '#',
      items: [
        { label: 'קל', href: '/products?type=plants&care=easy' },
        { label: 'בינוני', href: '/products?type=plants&care=medium' },
        { label: 'מתקדם', href: '/products?type=plants&care=advanced' },
      ],
    },
  ];

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-gray-800">
            שטיחי בוטיק יוסף
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8 space-x-reverse items-center">
            <Link
              href="/"
              className="text-gray-700 hover:text-primary-600 transition-colors"
            >
              בית
            </Link>

            {/* Rugs Dropdown */}
            <HeaderDropdown label="שטיחים" items={rugsDropdownItems} />

            {/* Plants Dropdown */}
            <HeaderDropdown label="צמחים" items={plantsDropdownItems} />

            <Link
              href="/about"
              className="text-gray-700 hover:text-primary-600 transition-colors"
            >
              אודות
            </Link>
            <Link
              href="/contact"
              className="text-gray-700 hover:text-primary-600 transition-colors"
            >
              צור קשר
            </Link>
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center space-x-4 space-x-reverse">
            {/* WhatsApp Button */}
            <a
              href="https://wa.me/972515092208"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 space-x-reverse bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
            >
              <FaWhatsapp className="text-xl" />
              <span className="hidden md:inline">WhatsApp</span>
            </a>

            {/* Cart Button */}
            <Link
              href="/cart"
              className="relative p-2 text-gray-700 hover:text-primary-600 transition-colors"
            >
              <FaShoppingCart className="text-2xl" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                0
              </span>
            </Link>

            {/* Admin Link */}
            <Link
              href="/admin"
              className="p-2 text-gray-700 hover:text-primary-600 transition-colors"
            >
              <FaUser className="text-xl" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 text-gray-700 hover:text-primary-600 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <FaTimes className="w-6 h-6" />
            ) : (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-200 pt-4">
            <nav className="flex flex-col space-y-2">
              <Link
                href="/"
                onClick={closeMobileMenu}
                className="text-gray-700 hover:text-primary-600 transition-colors py-2 px-4 hover:bg-gray-50 rounded-lg"
              >
                בית
              </Link>

              {/* Rugs Accordion */}
              <div>
                <button
                  onClick={() => setMobileRugsOpen(!mobileRugsOpen)}
                  className="w-full flex items-center justify-between text-gray-700 hover:text-primary-600 transition-colors py-2 px-4 hover:bg-gray-50 rounded-lg"
                >
                  <span>שטיחים</span>
                  <FaChevronDown
                    className={`text-xs transition-transform ${
                      mobileRugsOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {mobileRugsOpen && (
                  <div className="mr-4 mt-1 space-y-1">
                    <Link
                      href="/products?type=carpets"
                      onClick={closeMobileMenu}
                      className="block text-gray-700 hover:text-primary-600 transition-colors py-2 px-4 hover:bg-gray-50 rounded-lg font-medium"
                    >
                      כל השטיחים
                    </Link>

                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-1">
                      לפי חדר
                    </div>
                    <Link href="/products?type=carpets&space=living-room" onClick={closeMobileMenu} className="block text-gray-600 hover:text-primary-600 transition-colors py-1.5 px-6 hover:bg-gray-50 rounded-lg">
                      סלון
                    </Link>
                    <Link href="/products?type=carpets&space=bedroom" onClick={closeMobileMenu} className="block text-gray-600 hover:text-primary-600 transition-colors py-1.5 px-6 hover:bg-gray-50 rounded-lg">
                      חדר שינה
                    </Link>
                    <Link href="/products?type=carpets&space=dining-room" onClick={closeMobileMenu} className="block text-gray-600 hover:text-primary-600 transition-colors py-1.5 px-6 hover:bg-gray-50 rounded-lg">
                      חדר אוכל
                    </Link>
                    <Link href="/products?type=carpets&space=kids-room" onClick={closeMobileMenu} className="block text-gray-600 hover:text-primary-600 transition-colors py-1.5 px-6 hover:bg-gray-50 rounded-lg">
                      חדר ילדים
                    </Link>

                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-1 mt-2">
                      לפי צורה
                    </div>
                    <Link href="/products?type=carpets&shape=round" onClick={closeMobileMenu} className="block text-gray-600 hover:text-primary-600 transition-colors py-1.5 px-6 hover:bg-gray-50 rounded-lg">
                      עגול
                    </Link>
                    <Link href="/products?type=carpets&shape=rectangular" onClick={closeMobileMenu} className="block text-gray-600 hover:text-primary-600 transition-colors py-1.5 px-6 hover:bg-gray-50 rounded-lg">
                      מלבן
                    </Link>
                    <Link href="/products?type=carpets&shape=square" onClick={closeMobileMenu} className="block text-gray-600 hover:text-primary-600 transition-colors py-1.5 px-6 hover:bg-gray-50 rounded-lg">
                      ריבוע
                    </Link>
                    <Link href="/products?type=carpets&shape=runner" onClick={closeMobileMenu} className="block text-gray-600 hover:text-primary-600 transition-colors py-1.5 px-6 hover:bg-gray-50 rounded-lg">
                      רץ
                    </Link>
                  </div>
                )}
              </div>

              {/* Plants Accordion */}
              <div>
                <button
                  onClick={() => setMobilePlantsOpen(!mobilePlantsOpen)}
                  className="w-full flex items-center justify-between text-gray-700 hover:text-primary-600 transition-colors py-2 px-4 hover:bg-gray-50 rounded-lg"
                >
                  <span>צמחים</span>
                  <FaChevronDown
                    className={`text-xs transition-transform ${
                      mobilePlantsOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {mobilePlantsOpen && (
                  <div className="mr-4 mt-1 space-y-1">
                    <Link
                      href="/products?type=plants"
                      onClick={closeMobileMenu}
                      className="block text-gray-700 hover:text-primary-600 transition-colors py-2 px-4 hover:bg-gray-50 rounded-lg font-medium"
                    >
                      כל הצמחים
                    </Link>

                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-1">
                      לפי סוג
                    </div>
                    <Link href="/products?type=plants&plant_type=indoor" onClick={closeMobileMenu} className="block text-gray-600 hover:text-primary-600 transition-colors py-1.5 px-6 hover:bg-gray-50 rounded-lg">
                      צמחי בית
                    </Link>
                    <Link href="/products?type=plants&plant_type=outdoor" onClick={closeMobileMenu} className="block text-gray-600 hover:text-primary-600 transition-colors py-1.5 px-6 hover:bg-gray-50 rounded-lg">
                      צמחי חוץ
                    </Link>
                    <Link href="/products?type=plants&plant_type=succulents" onClick={closeMobileMenu} className="block text-gray-600 hover:text-primary-600 transition-colors py-1.5 px-6 hover:bg-gray-50 rounded-lg">
                      סוקולנטים
                    </Link>
                    <Link href="/products?type=plants&plant_type=herbs" onClick={closeMobileMenu} className="block text-gray-600 hover:text-primary-600 transition-colors py-1.5 px-6 hover:bg-gray-50 rounded-lg">
                      צמחי תבלין
                    </Link>
                    <Link href="/products?type=plants&plant_type=flowering" onClick={closeMobileMenu} className="block text-gray-600 hover:text-primary-600 transition-colors py-1.5 px-6 hover:bg-gray-50 rounded-lg">
                      צמחים פורחים
                    </Link>

                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-1 mt-2">
                      לפי רמת טיפול
                    </div>
                    <Link href="/products?type=plants&care=easy" onClick={closeMobileMenu} className="block text-gray-600 hover:text-primary-600 transition-colors py-1.5 px-6 hover:bg-gray-50 rounded-lg">
                      קל
                    </Link>
                    <Link href="/products?type=plants&care=medium" onClick={closeMobileMenu} className="block text-gray-600 hover:text-primary-600 transition-colors py-1.5 px-6 hover:bg-gray-50 rounded-lg">
                      בינוני
                    </Link>
                    <Link href="/products?type=plants&care=advanced" onClick={closeMobileMenu} className="block text-gray-600 hover:text-primary-600 transition-colors py-1.5 px-6 hover:bg-gray-50 rounded-lg">
                      מתקדם
                    </Link>
                  </div>
                )}
              </div>

              <Link
                href="/about"
                onClick={closeMobileMenu}
                className="text-gray-700 hover:text-primary-600 transition-colors py-2 px-4 hover:bg-gray-50 rounded-lg"
              >
                אודות
              </Link>
              <Link
                href="/contact"
                onClick={closeMobileMenu}
                className="text-gray-700 hover:text-primary-600 transition-colors py-2 px-4 hover:bg-gray-50 rounded-lg"
              >
                צור קשר
              </Link>

              {/* Mobile Actions */}
              <div className="flex flex-col space-y-3 pt-4 border-t border-gray-200">
                <a
                  href="https://wa.me/972515092208"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center space-x-2 space-x-reverse bg-green-500 text-white px-4 py-3 rounded-lg hover:bg-green-600 transition-colors"
                >
                  <FaWhatsapp className="text-xl" />
                  <span>WhatsApp</span>
                </a>

                <Link
                  href="/cart"
                  onClick={closeMobileMenu}
                  className="flex items-center justify-center space-x-2 space-x-reverse bg-primary-600 text-white px-4 py-3 rounded-lg hover:bg-primary-700 transition-colors"
                >
                  <FaShoppingCart className="text-xl" />
                  <span>עגלת קניות (0)</span>
                </Link>

                <Link
                  href="/admin"
                  onClick={closeMobileMenu}
                  className="flex items-center justify-center space-x-2 space-x-reverse bg-gray-600 text-white px-4 py-3 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <FaUser className="text-xl" />
                  <span>ניהול</span>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
