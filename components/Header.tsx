'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaShoppingCart, FaWhatsapp, FaUser, FaTimes, FaChevronDown, FaFacebook, FaInstagram, FaTiktok } from 'react-icons/fa';
import CarpetsDropdown from './CarpetsDropdown';
import PlantsDropdown from './PlantsDropdown';
import { useCart } from '@/contexts/CartContext';

export default function Header() {
  const { getCartItemsCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [carpetsDropdownOpen, setCarpetsDropdownOpen] = useState(false);
  const [plantsDropdownOpen, setPlantsDropdownOpen] = useState(false);
  const carpetsDropdownRef = useRef<HTMLDivElement>(null);
  const plantsDropdownRef = useRef<HTMLDivElement>(null);
  const carpetsCloseTimeout = useRef<NodeJS.Timeout | null>(null);
  const plantsCloseTimeout = useRef<NodeJS.Timeout | null>(null);

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

  const handleCarpetsMouseEnter = () => {
    if (carpetsCloseTimeout.current) {
      clearTimeout(carpetsCloseTimeout.current);
      carpetsCloseTimeout.current = null;
    }
    setCarpetsDropdownOpen(true);
    setPlantsDropdownOpen(false);
  };

  const handleCarpetsMouseLeave = () => {
    carpetsCloseTimeout.current = setTimeout(() => {
      setCarpetsDropdownOpen(false);
    }, 150);
  };

  const handlePlantsMouseEnter = () => {
    if (plantsCloseTimeout.current) {
      clearTimeout(plantsCloseTimeout.current);
      plantsCloseTimeout.current = null;
    }
    setPlantsDropdownOpen(true);
    setCarpetsDropdownOpen(false);
  };

  const handlePlantsMouseLeave = () => {
    plantsCloseTimeout.current = setTimeout(() => {
      setPlantsDropdownOpen(false);
    }, 150);
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
    <header className="bg-white shadow-md sticky top-0 z-50 relative">
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between relative">
          {/* Logo - centered on mobile */}
          <Link href="/" className="flex items-center md:static absolute left-1/2 -translate-x-1/2 md:translate-x-0 md:relative md:left-auto">
            <Image
              src="/logo-cropped.png"
              alt="Yossef Boutique"
              width={650}
              height={250}
              className="h-16 sm:h-20 md:h-24 w-auto object-contain max-w-[200px] sm:max-w-none"
              priority
            />
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
            <button
              onMouseEnter={handleCarpetsMouseEnter}
              onMouseLeave={handleCarpetsMouseLeave}
              onClick={toggleCarpetsDropdown}
              className="flex items-center space-x-1 space-x-reverse text-gray-700 hover:text-primary-600 transition-colors"
            >
              <span>שטיחים</span>
              <FaChevronDown className={`text-xs transition-transform ${carpetsDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Plants Dropdown */}
            <button
              onMouseEnter={handlePlantsMouseEnter}
              onMouseLeave={handlePlantsMouseLeave}
              onClick={togglePlantsDropdown}
              className="flex items-center space-x-1 space-x-reverse text-gray-700 hover:text-primary-600 transition-colors"
            >
              <span>עציצים</span>
              <FaChevronDown className={`text-xs transition-transform ${plantsDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

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
            {/* Social Media Icons */}
            <div className="flex items-center space-x-3 space-x-reverse border-l border-gray-300 pl-4">
              <a
                href="https://www.facebook.com/share/1FGwU1cT56/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-blue-600 transition-colors"
                aria-label="Facebook"
              >
                <FaFacebook className="text-xl" />
              </a>
              <a
                href="https://www.instagram.com/yossef_carpets?igsh=MWEydXA5ZDFkemE3Ng=="
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-pink-600 transition-colors"
                aria-label="Instagram"
              >
                <FaInstagram className="text-xl" />
              </a>
              <a
                href="https://www.tiktok.com/@butiqyossef1?_r=1&_t=ZS-91MDi891VVF"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900 transition-colors"
                aria-label="TikTok"
              >
                <FaTiktok className="text-xl" />
              </a>
            </div>

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
              {getCartItemsCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {getCartItemsCount()}
                </span>
              )}
            </Link>

            {/* Admin Link */}
            <Link
              href="/admin"
              className="p-2 text-gray-700 hover:text-primary-600 transition-colors"
            >
              <FaUser className="text-xl" />
            </Link>
          </div>

          {/* Mobile Menu Button - Animated Hamburger */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 text-gray-700 hover:text-primary-600 transition-colors relative w-10 h-10 flex items-center justify-center"
            aria-label="Toggle menu"
          >
            <div className="w-6 h-5 relative flex flex-col justify-between">
              {/* Top Line */}
              <span
                className={`block h-0.5 w-full bg-current transform transition-all duration-300 ease-in-out ${
                  mobileMenuOpen ? 'rotate-45 translate-y-2' : ''
                }`}
              />
              {/* Middle Line */}
              <span
                className={`block h-0.5 w-full bg-current transition-all duration-300 ease-in-out ${
                  mobileMenuOpen ? 'opacity-0' : 'opacity-100'
                }`}
              />
              {/* Bottom Line */}
              <span
                className={`block h-0.5 w-full bg-current transform transition-all duration-300 ease-in-out ${
                  mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''
                }`}
              />
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-200 pt-4 animate-fade-in">
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
                {/* Social Media Icons */}
                <div className="flex items-center justify-center space-x-6 space-x-reverse py-2">
                  <a
                    href="https://www.facebook.com/share/1FGwU1cT56/?mibextid=wwXIfr"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-blue-600 transition-colors"
                    aria-label="Facebook"
                  >
                    <FaFacebook className="text-2xl" />
                  </a>
                  <a
                    href="https://www.instagram.com/yossef_carpets?igsh=MWEydXA5ZDFkemE3Ng=="
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-pink-600 transition-colors"
                    aria-label="Instagram"
                  >
                    <FaInstagram className="text-2xl" />
                  </a>
                  <a
                    href="https://www.tiktok.com/@butiqyossef1?_r=1&_t=ZS-91MDi891VVF"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                    aria-label="TikTok"
                  >
                    <FaTiktok className="text-2xl" />
                  </a>
                </div>

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
                  <span>עגלת קניות ({getCartItemsCount()})</span>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>

      {/* Full-width Dropdown Menus */}
      {carpetsDropdownOpen && (
        <div
          ref={carpetsDropdownRef}
          onMouseEnter={handleCarpetsMouseEnter}
          onMouseLeave={handleCarpetsMouseLeave}
        >
          <CarpetsDropdown onClose={() => setCarpetsDropdownOpen(false)} />
        </div>
      )}
      {plantsDropdownOpen && (
        <div
          ref={plantsDropdownRef}
          onMouseEnter={handlePlantsMouseEnter}
          onMouseLeave={handlePlantsMouseLeave}
        >
          <PlantsDropdown onClose={() => setPlantsDropdownOpen(false)} />
        </div>
      )}
    </header>
  );
}
