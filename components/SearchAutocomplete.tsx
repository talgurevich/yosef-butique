'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { FaSearch } from 'react-icons/fa';
import { supabase } from '@/lib/supabase';

type SearchProduct = {
  id: string;
  slug: string;
  name: string;
  price: number;
  product_images?: { image_url: string; sort_order: number }[];
  product_shapes?: { shapes: { name: string; image_url?: string } }[];
  product_colors?: { colors: { name: string } }[];
  product_categories?: { categories: { name: string } }[];
  product_variants?: { price: number; is_active: boolean }[];
};

type Props = {
  placeholder?: string;
  inputClassName?: string;
  wrapperClassName?: string;
  iconClassName?: string;
  onNavigate?: () => void;
};

export default function SearchAutocomplete({
  placeholder = 'חיפוש מוצרים...',
  inputClassName = '',
  wrapperClassName = '',
  iconClassName = '',
  onNavigate,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('search') || '');
  const [catalog, setCatalog] = useState<SearchProduct[] | null>(null);
  const [results, setResults] = useState<SearchProduct[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [highlighted, setHighlighted] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Fetch catalog once (first non-trivial keystroke triggers the fetch)
  useEffect(() => {
    if (catalog !== null) return;
    if (query.trim().length < 2) return;
    if (!supabase) return;

    let cancelled = false;
    setLoading(true);
    supabase
      .from('products')
      .select(`
        id,
        slug,
        name,
        price,
        product_images ( image_url, sort_order ),
        product_shapes ( shapes ( name, image_url ) ),
        product_colors ( colors ( name ) ),
        product_categories ( categories ( name ) ),
        product_variants ( price, is_active )
      `)
      .eq('is_active', true)
      .then(({ data }) => {
        if (cancelled) return;
        setCatalog((data as SearchProduct[]) || []);
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [query, catalog]);

  // Filter locally as query changes
  useEffect(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2 || !catalog) {
      setResults([]);
      setHighlighted(-1);
      return;
    }

    const matched = catalog
      .filter((p) => {
        if (p.name?.toLowerCase().includes(q)) return true;
        if (p.product_shapes?.some((ps) => ps.shapes?.name?.toLowerCase().includes(q))) return true;
        if (p.product_colors?.some((pc) => pc.colors?.name?.toLowerCase().includes(q))) return true;
        if (p.product_categories?.some((pc) => pc.categories?.name?.toLowerCase().includes(q))) return true;
        return false;
      })
      .slice(0, 6);

    setResults(matched);
    setHighlighted(-1);
  }, [query, catalog]);

  // Close on outside click
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!wrapperRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  const submitSearch = (term: string) => {
    const trimmed = term.trim();
    router.push(trimmed ? `/products?search=${encodeURIComponent(trimmed)}` : '/products');
    setOpen(false);
    onNavigate?.();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) setOpen(true);

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlighted((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlighted((i) => Math.max(i - 1, -1));
    } else if (e.key === 'Enter') {
      if (highlighted >= 0 && results[highlighted]) {
        router.push(`/product/${results[highlighted].slug}`);
        setOpen(false);
        onNavigate?.();
      } else {
        submitSearch(query);
      }
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  const showDropdown = open && query.trim().length >= 2;

  return (
    <div ref={wrapperRef} className={`relative ${wrapperClassName}`}>
      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        aria-label="חיפוש מוצרים"
        className={inputClassName}
      />
      <FaSearch className={iconClassName} />

      {showDropdown && (
        <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50 max-h-[70vh] overflow-y-auto">
          {loading && !catalog ? (
            <div className="p-6 text-center text-gray-500 text-sm">מחפש...</div>
          ) : results.length === 0 ? (
            <div className="p-6 text-center text-gray-500 text-sm">לא נמצאו תוצאות לחיפוש ״{query}״</div>
          ) : (
            <>
              <ul>
                {results.map((p, i) => {
                  const firstImage = p.product_images?.sort((a, b) => a.sort_order - b.sort_order)?.[0]?.image_url;
                  const q = query.trim().toLowerCase();
                  const matchedShape = p.product_shapes?.find((ps) =>
                    ps.shapes?.name?.toLowerCase().includes(q)
                  )?.shapes;
                  const subtitle =
                    matchedShape?.name
                      || p.product_categories?.[0]?.categories?.name
                      || p.product_colors?.[0]?.colors?.name
                      || '';

                  const activeVariants = (p.product_variants || []).filter((v) => v.is_active && v.price > 0);
                  const lowestVariantPrice = activeVariants.length > 0
                    ? Math.min(...activeVariants.map((v) => v.price))
                    : null;
                  const displayPrice = lowestVariantPrice || p.price;
                  const hasMultiplePrices = activeVariants.length > 1 &&
                    new Set(activeVariants.map((v) => v.price)).size > 1;

                  return (
                    <li key={p.id}>
                      <Link
                        href={`/product/${p.slug}`}
                        onClick={() => {
                          setOpen(false);
                          onNavigate?.();
                        }}
                        onMouseEnter={() => setHighlighted(i)}
                        className={`flex items-center gap-3 p-3 transition-colors ${
                          i === highlighted ? 'bg-gray-50' : 'hover:bg-gray-50'
                        }`}
                      >
                        {firstImage ? (
                          <img
                            src={firstImage}
                            alt={p.name}
                            className="w-12 h-12 rounded-lg object-cover flex-shrink-0 border border-gray-100"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-gray-100 flex-shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-sm text-charcoal truncate">{p.name}</div>
                          {subtitle && (
                            <div className="flex items-center gap-1.5 text-xs text-gray-500 truncate">
                              {matchedShape?.image_url && (
                                <img
                                  src={matchedShape.image_url}
                                  alt=""
                                  className="w-4 h-4 rounded-full object-cover"
                                />
                              )}
                              <span>{subtitle}</span>
                            </div>
                          )}
                        </div>
                        <div className="font-bold text-sm text-charcoal whitespace-nowrap">
                          {hasMultiplePrices ? 'החל מ-' : ''}₪{(displayPrice || 0).toLocaleString()}
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
              <button
                type="button"
                onClick={() => submitSearch(query)}
                className="w-full p-3 text-center text-sm font-bold text-primary-700 border-t border-gray-100 hover:bg-gray-50 transition-colors"
              >
                צפה בכל התוצאות לחיפוש ״{query}״ ←
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
