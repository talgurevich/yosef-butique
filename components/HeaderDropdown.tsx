'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { FaChevronDown } from 'react-icons/fa';

export type DropdownItem = {
  label: string;
  href: string;
  items?: DropdownItem[];
};

type HeaderDropdownProps = {
  label: string;
  items: DropdownItem[];
};

export default function HeaderDropdown({ label, items }: HeaderDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 200);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      ref={dropdownRef}
    >
      <button
        className="flex items-center gap-1 text-gray-700 hover:text-primary-600 transition-colors font-medium"
        onClick={() => setIsOpen(!isOpen)}
      >
        {label}
        <FaChevronDown
          className={`text-xs transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-50">
          {items.map((item, index) => (
            <div key={index}>
              {item.items && item.items.length > 0 ? (
                <>
                  {/* Category Header */}
                  <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {item.label}
                  </div>
                  {/* Subcategory Items */}
                  {item.items.map((subItem, subIndex) => (
                    <Link
                      key={subIndex}
                      href={subItem.href}
                      className="block px-6 py-2 text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      {subItem.label}
                    </Link>
                  ))}
                  {/* Divider after group */}
                  {index < items.length - 1 && (
                    <div className="border-t border-gray-100 my-2"></div>
                  )}
                </>
              ) : (
                /* Direct Link Item */
                <>
                  <Link
                    href={item.href}
                    className="block px-4 py-2 text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </Link>
                  {index < items.length - 1 && item.label !== items[index + 1]?.label && (
                    <div className="border-t border-gray-100 my-2"></div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
