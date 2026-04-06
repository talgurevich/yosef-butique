'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaShoppingCart, FaPlus } from 'react-icons/fa';
import { supabase } from '@/lib/supabase';
import { useCart } from '@/contexts/CartContext';

interface PromotedProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  compare_at_price?: number;
  variant_id?: string;
  variant_size?: string;
  variant_price?: number;
  variant_compare_at_price?: number;
  image_url?: string;
}

export default function CartPromotion() {
  const [product, setProduct] = useState<PromotedProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);
  const { addToCart, cartItems } = useCart();

  useEffect(() => {
    fetchPromotion();
  }, []);

  const fetchPromotion = async () => {
    try {
      if (!supabase) return;

      // Fetch active promotion
      const { data: promos } = await supabase
        .from('cart_promotion')
        .select('product_id, variant_id')
        .eq('is_active', true)
        .limit(1);

      if (!promos || promos.length === 0) return;

      const promo = promos[0];

      // Fetch product details
      const { data: productData } = await supabase
        .from('products')
        .select('id, name, slug, price, compare_at_price')
        .eq('id', promo.product_id)
        .eq('is_active', true)
        .single();

      if (!productData) return;

      // Fetch product image
      const { data: imageData } = await supabase
        .from('product_images')
        .select('image_url')
        .eq('product_id', promo.product_id)
        .order('sort_order')
        .limit(1);

      // Fetch variant if specified
      let variantInfo: any = null;
      if (promo.variant_id) {
        const { data: variantData } = await supabase
          .from('product_variants')
          .select('id, size, price, compare_at_price')
          .eq('id', promo.variant_id)
          .eq('is_active', true)
          .single();
        variantInfo = variantData;
      }

      setProduct({
        id: productData.id,
        name: productData.name,
        slug: productData.slug,
        price: productData.price,
        compare_at_price: productData.compare_at_price,
        variant_id: variantInfo?.id,
        variant_size: variantInfo?.size,
        variant_price: variantInfo?.price,
        variant_compare_at_price: variantInfo?.compare_at_price,
        image_url: imageData?.[0]?.image_url,
      });
    } catch (error) {
      console.error('Error fetching cart promotion:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;

    const price = product.variant_price || product.price;

    addToCart({
      productId: product.id,
      variantId: product.variant_id || product.id,
      productName: product.name,
      variantSize: product.variant_size || '',
      price,
      imageUrl: product.image_url,
      slug: product.slug,
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading || !product) return null;

  // Don't show if this product+variant is already in cart
  const alreadyInCart = cartItems.some(
    item => item.productId === product.id &&
    (product.variant_id ? item.variantId === product.variant_id : true)
  );

  if (alreadyInCart) return null;

  const displayPrice = product.variant_price || product.price;
  const comparePrice = product.variant_compare_at_price || product.compare_at_price;
  const hasDiscount = comparePrice && comparePrice > displayPrice;

  return (
    <div className="bg-gradient-to-r from-primary-50 to-orange-50 border-2 border-primary-200 rounded-lg p-4">
      <p className="text-sm font-bold text-primary-700 mb-3 flex items-center gap-2">
        <FaPlus className="text-xs" />
        אולי תרצה להוסיף?
      </p>
      <div className="flex items-center gap-4">
        {/* Product Image */}
        <Link href={`/product/${product.slug}`} className="flex-shrink-0">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="w-20 h-20 object-cover rounded-lg border border-gray-200"
            />
          ) : (
            <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
              <FaShoppingCart className="text-gray-400" />
            </div>
          )}
        </Link>

        {/* Product Info */}
        <div className="flex-1 min-w-0">
          <Link href={`/product/${product.slug}`} className="text-sm font-semibold text-gray-800 hover:text-primary-600 transition-colors line-clamp-2 block">
            {product.name}
          </Link>
          {product.variant_size && (
            <p className="text-xs text-gray-500 mt-0.5">מידה: {product.variant_size}</p>
          )}
          <div className="flex items-center gap-2 mt-1">
            <span className="text-lg font-bold text-primary-600">
              ₪{displayPrice.toLocaleString()}
            </span>
            {hasDiscount && (
              <span className="text-sm text-gray-400 line-through">
                ₪{comparePrice!.toLocaleString()}
              </span>
            )}
          </div>
        </div>

        {/* Add Button */}
        <button
          onClick={handleAddToCart}
          disabled={added}
          className={`flex-shrink-0 px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
            added
              ? 'bg-green-500 text-white'
              : 'bg-primary-600 text-white hover:bg-primary-700 hover:shadow-md'
          }`}
        >
          {added ? 'נוסף!' : 'הוסף לסל'}
        </button>
      </div>
    </div>
  );
}
