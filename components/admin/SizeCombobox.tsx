'use client';

import { useState, useRef, useEffect } from 'react';

interface SizeComboboxProps {
  value: string;
  onChange: (value: string) => void;
  sizes: string[];
  placeholder?: string;
  required?: boolean;
  className?: string;
}

export default function SizeCombobox({
  value,
  onChange,
  sizes,
  placeholder = '160×230',
  required,
  className = 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500',
}: SizeComboboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const filtered = sizes.filter(
    (s) => s.toLowerCase().includes(value.toLowerCase()) && s !== value
  );

  useEffect(() => {
    setHighlightedIndex(-1);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Scroll highlighted item into view
  useEffect(() => {
    if (highlightedIndex >= 0 && listRef.current) {
      const item = listRef.current.children[highlightedIndex] as HTMLElement;
      item?.scrollIntoView({ block: 'nearest' });
    }
  }, [highlightedIndex]);

  const select = (size: string) => {
    onChange(size);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || filtered.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev + 1) % filtered.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev <= 0 ? filtered.length - 1 : prev - 1));
    } else if (e.key === 'Enter' && highlightedIndex >= 0) {
      e.preventDefault();
      select(filtered[highlightedIndex]);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        required={required}
        className={className}
        autoComplete="off"
      />
      {isOpen && filtered.length > 0 && (
        <ul
          ref={listRef}
          className="absolute z-50 mt-1 w-full max-h-48 overflow-y-auto bg-white border border-gray-300 rounded-lg shadow-lg"
        >
          {filtered.map((size, i) => (
            <li
              key={size}
              onMouseDown={(e) => {
                e.preventDefault();
                select(size);
              }}
              onMouseEnter={() => setHighlightedIndex(i)}
              className={`px-3 py-2 cursor-pointer text-sm ${
                i === highlightedIndex
                  ? 'bg-primary-100 text-primary-800'
                  : 'hover:bg-gray-100'
              }`}
            >
              {size}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
