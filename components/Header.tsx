'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { FaShoppingCart, FaWhatsapp, FaUser, FaTimes, FaChevronDown } from 'react-icons/fa';
import CarpetsDropdown from './CarpetsDropdown';
import PlantsDropdown from './PlantsDropdown';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [carpetsDropdownOpen, setCarpetsDropdownOpen] = useState(false);
  const [plantsDropdownOpen, setPlantsDropdownOpen] = useState(false);
  const carpetsDropdownRef = useRef<HTMLDivElement>(null);
  const plantsDropdownRef = useRef<HTMLDivElement>(null);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    setCarpetsDropdownOpen(false);
    setPlantsDropdownOpen(false);
  };

  const toggleCarpetsDropdown = () => {
    setCarpetsDropdownOpen(!carpetsDropdownOpen);
    setPlantsDropdownOpen(false);
  };

  const togglePlantsDropdown = () => {
    setPlantsDropdownOpen(!plantsDropdownOpen);
    setCarpetsDropdownOpen(false);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        carpetsDropdownRef.current &&
        !carpetsDropdownRef.current.contains(event.target as Node)
      ) {
        setCarpetsDropdownOpen(false);
      }
      if (
        plantsDropdownRef.current &&
        !plantsDropdownRef.current.contains(event.target as Node)
      ) {
        setPlantsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-gray-800">
            שטיחי בוטיק יוסף
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-6 space-x-reverse">
            <Link
              href="/"
              className="text-gray-700 hover:text-primary-600 transition-colors"
            >
              בית
            </Link>

            <Link
              href="/products"
              className="text-gray-700 hover:text-primary-600 transition-colors"
            >
              כל המוצרים
            </Link>

            {/* Carpets Dropdown */}
            <div
              ref={carpetsDropdownRef}
              className="relative"
              onMouseEnter={() => setCarpetsDropdownOpen(true)}
              onMouseLeave={() => setCarpetsDropdownOpen(false)}
            >
              <button
                onClick={toggleCarpetsDropdown}
                className="flex items-center space-x-1 space-x-reverse text-gray-700 hover:text-primary-600 transition-colors"
              >
                <span>שטיחים</span>
                <FaChevronDown className={`text-xs transition-transform ${carpetsDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {carpetsDropdownOpen && (
                <CarpetsDropdown onClose={() => setCarpetsDropdownOpen(false)} />
              )}
            </div>

            {/* Plants Dropdown */}
            <div
              ref={plantsDropdownRef}
              className="relative"
              onMouseEnter={() => setPlantsDropdownOpen(true)}
              onMouseLeave={() => setPlantsDropdownOpen(false)}
            >
              <button
                onClick={togglePlantsDropdown}
                className="flex items-center space-x-1 space-x-reverse text-gray-700 hover:text-primary-600 transition-colors"
              >
                <span>עציצים</span>
                <FaChevronDown className={`text-xs transition-transform ${plantsDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {plantsDropdownOpen && (
                <PlantsDropdown onClose={() => setPlantsDropdownOpen(false)} />
              )}
            </div>

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
            <nav className="flex flex-col space-y-4">
              <Link
                href="/"
                onClick={closeMobileMenu}
                className="text-gray-700 hover:text-primary-600 transition-colors py-2 px-4 hover:bg-gray-50 rounded-lg"
              >
                בית
              </Link>
              <Link
                href="/products"
                onClick={closeMobileMenu}
                className="text-gray-700 hover:text-primary-600 transition-colors py-2 px-4 hover:bg-gray-50 rounded-lg"
              >
                כל המוצרים
              </Link>
              <Link
                href="/products?type=carpets"
                onClick={closeMobileMenu}
                className="text-gray-700 hover:text-primary-600 transition-colors py-2 px-4 hover:bg-gray-50 rounded-lg"
              >
                שטיחים
              </Link>
              <Link
                href="/products?type=plants"
                onClick={closeMobileMenu}
                className="text-gray-700 hover:text-primary-600 transition-colors py-2 px-4 hover:bg-gray-50 rounded-lg"
              >
                עציצים
              </Link>
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
