'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';
import ProductFAQ from '@/components/ProductFAQ';
import ImageMagnifier from '@/components/ImageMagnifier';
import { supabase, Product, ProductVariant } from '@/lib/supabase';
import { FaShoppingCart, FaArrowRight, FaCheck, FaTruck, FaShieldAlt } from 'react-icons/fa';
import { useCart } from '@/contexts/CartContext';

type ProductPageClientProps = {
  product: any;
  productImages: any[];
  variants: any[];
  categories: any[];
  colors: any[];
  shapes: any[];
  spaces: any[];
  plantTypes: any[];
  plantSizes: any[];
  plantPetSafety: any[];
  productType: any;
};

export default function ProductPageClient({
  product: initialProduct,
  productImages: initialImages,
  variants: initialVariants,
  categories: initialCategories,
  colors: initialColors,
  shapes: initialShapes,
  spaces: initialSpaces,
  plantTypes: initialPlantTypes,
  plantSizes: initialPlantSizes,
  plantPetSafety: initialPlantPetSafety,
  productType: initialProductType,
}: ProductPageClientProps) {
  const { addToCart } = useCart();

  const [product] = useState<any>(initialProduct);
  const [variants, setVariants] = useState<ProductVariant[]>(initialVariants);

  // Auto-select first in-stock variant (or first variant if none in stock)
  const getInitialVariant = (): ProductVariant | null => {
    if (!initialProduct.has_variants || initialVariants.length === 0) return null;
    const inStockVariant = initialVariants.find((v: any) => v.stock_quantity > 0);
    return inStockVariant || initialVariants[0];
  };

  // Auto-select color: prefer the initial variant's color, then first product color
  const getInitialColor = () => {
    const initVariant = getInitialVariant() as any;
    if (initVariant?.colors) return initVariant.colors;
    if (initialColors.length > 0) return initialColors[0];
    return null;
  };

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(getInitialVariant());
  const [selectedColor, setSelectedColor] = useState<any>(getInitialColor());
  const [productImages] = useState<any[]>(initialImages);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [categories] = useState<any[]>(initialCategories);
  const [colors] = useState<any[]>(initialColors);
  const [shapes] = useState<any[]>(initialShapes);
  const [spaces] = useState<any[]>(initialSpaces);
  const [plantTypes] = useState<any[]>(initialPlantTypes);
  const [plantSizes] = useState<any[]>(initialPlantSizes);
  const [plantPetSafety] = useState<any[]>(initialPlantPetSafety);
  const [productType] = useState<any>(initialProductType);

  // Filter images by selected color
  const filteredImages = useMemo(() => {
    if (!selectedColor) return productImages;
    return productImages.filter(
      (img: any) => img.color_id === null || img.color_id === selectedColor.id
    );
  }, [productImages, selectedColor]);

  // Reset selected image index when color changes
  useEffect(() => {
    setSelectedImageIndex(0);
  }, [selectedColor]);

  // Refetch variant stock when page becomes visible (handles tab switching)
  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (!document.hidden && product?.id && product.has_variants) {
        try {
          const result = await supabase
            .from('product_variants')
            .select(`*, colors (id, name, slug)`)
            .eq('product_id', product.id)
            .eq('is_active', true)
            .order('sort_order');
          if (result.data) {
            setVariants(result.data);
          }
        } catch (e) {
          // Silent fail - just use existing data
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [product?.id, product?.has_variants]);

  const handleAddToCart = () => {
    if (!product) return;

    if (product.has_variants && !selectedVariant) {
      alert('אנא בחר מידה');
      return;
    }

    const variantColors = getVariantColors();
    const isPlant = productType?.slug === 'plants';
    if (!isPlant && product.has_variants && variantColors.length > 0 && !selectedColor) {
      alert('אנא בחר צבע');
      return;
    }

    if (!isPlant && (!product.has_variants || variantColors.length === 0) && colors.length > 0 && !selectedColor) {
      alert('אנא בחר צבע');
      return;
    }

    const variantToAdd = selectedVariant || {
      id: `default-${product.id}`,
      size: product.size || 'רגיל',
      price: product.price,
    };

    const colorName = (selectedVariant as any)?.colors?.name || selectedColor?.name;
    const imageUrl = productImages.length > 0 ? productImages[0].image_url : undefined;

    addToCart({
      productId: product.id,
      variantId: variantToAdd.id,
      productName: product.name,
      variantSize: variantToAdd.size,
      variantColor: colorName,
      price: variantToAdd.price,
      imageUrl,
      slug: product.slug,
      quantity,
    });

    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 3000);
  };

  const getCurrentPrice = () => {
    if (selectedVariant) return selectedVariant.price;
    return product?.price || 0;
  };

  const getComparePrice = () => {
    if (selectedVariant) return selectedVariant.compare_at_price;
    return product?.compare_at_price;
  };

  const getStockQuantity = () => {
    if (selectedVariant) return selectedVariant.stock_quantity;
    return product?.stock_quantity || 0;
  };

  const isInStock = () => getStockQuantity() > 0;

  const getUniqueSizes = () => Array.from(new Set(variants.map(v => v.size)));

  const getVariantColors = () => {
    const colorMap = new Map();
    variants.forEach((v: any) => {
      if (v.color_id && v.colors) {
        colorMap.set(v.color_id, v.colors);
      }
    });
    return Array.from(colorMap.values());
  };

  const isCombinationAvailable = (size: string, colorId: string | null) => {
    const variant = variants.find(v => v.size === size && (colorId ? v.color_id === colorId : !v.color_id));
    return variant && variant.stock_quantity > 0;
  };

  const isSizeAvailable = (size: string) => variants.some(v => v.size === size && v.stock_quantity > 0);

  const isColorAvailable = (colorId: string) => variants.some(v => v.color_id === colorId && v.stock_quantity > 0);

  const getCombinationStock = (size: string, colorId: string | null) => {
    const variant = variants.find(v => v.size === size && (colorId ? v.color_id === colorId : !v.color_id));
    return variant?.stock_quantity || 0;
  };

  const findMatchingVariant = (size: string | null, colorId: string | null) => {
    if (!size) return null;
    return variants.find(v => v.size === size && (colorId ? v.color_id === colorId : !v.color_id)) || null;
  };

  const handleSizeSelect = (size: string) => {
    const variantColors = getVariantColors();
    const hasVariantColors = variantColors.length > 0;

    if (hasVariantColors) {
      const matchingVariant = findMatchingVariant(size, selectedColor?.id);
      if (matchingVariant) {
        setSelectedVariant(matchingVariant);
      } else {
        const anyVariantWithSize = variants.find(v => v.size === size) as any;
        if (anyVariantWithSize) {
          setSelectedVariant(anyVariantWithSize);
          if (anyVariantWithSize.colors) {
            setSelectedColor(anyVariantWithSize.colors);
          }
        }
      }
    } else {
      const variant = variants.find(v => v.size === size);
      if (variant) setSelectedVariant(variant);
    }
  };

  const handleVariantColorSelect = (color: any) => {
    setSelectedColor(color);
    if (selectedVariant?.size) {
      const matchingVariant = findMatchingVariant(selectedVariant.size, color.id);
      if (matchingVariant) {
        setSelectedVariant(matchingVariant);
      } else {
        const firstVariantWithColor = variants.find(v => v.color_id === color.id);
        if (firstVariantWithColor) setSelectedVariant(firstVariantWithColor);
      }
    } else {
      const firstVariantWithColor = variants.find(v => v.color_id === color.id);
      if (firstVariantWithColor) setSelectedVariant(firstVariantWithColor);
    }
  };

  const currentPrice = getCurrentPrice();
  const comparePrice = getComparePrice();
  const hasDiscount = comparePrice && comparePrice > currentPrice;

  return (
    <>
      <Header />

      <Breadcrumbs items={[
        { label: 'מוצרים', href: '/products' },
        { label: product.name }
      ]} />

      <div className="min-h-screen bg-cream">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Image */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="aspect-square bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center overflow-hidden relative">
                {filteredImages.length > 0 ? (
                  <ImageMagnifier
                    src={filteredImages[selectedImageIndex]?.image_url}
                    alt={filteredImages[selectedImageIndex]?.alt_text || product.name}
                    magnifierHeight={200}
                    magnifierWidth={200}
                    zoomLevel={2.5}
                  />
                ) : (
                  <div className="text-gray-400 text-9xl">🏠</div>
                )}
              </div>

              {filteredImages.length > 1 && (
                <div className="grid grid-cols-4 gap-4 mt-4">
                  {filteredImages.map((image: any, index: number) => (
                    <div
                      key={image.id}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`aspect-square rounded-lg flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-primary-600 transition-all overflow-hidden ${
                        selectedImageIndex === index
                          ? 'ring-2 ring-primary-600'
                          : 'ring-1 ring-gray-200'
                      }`}
                    >
                      <img
                        src={image.image_url}
                        alt={image.alt_text || `${product.name} - ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Product Details */}
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-4">
                {product.name}
              </h1>

              <div className="mb-2">
                <div className="flex items-center gap-4">
                  {hasDiscount ? (
                    <>
                      <span className="text-4xl font-bold text-terracotta">
                        ₪{currentPrice.toFixed(2)}
                      </span>
                      <span className="text-2xl text-gray-400 line-through">
                        ₪{comparePrice.toFixed(2)}
                      </span>
                      <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        חסכון {((comparePrice - currentPrice) / comparePrice * 100).toFixed(0)}%
                      </span>
                    </>
                  ) : (
                    <span className="text-4xl font-bold text-gray-800">
                      ₪{currentPrice.toFixed(2)}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-1">כולל מע״מ</p>
              </div>

              <div className="mb-6">
                {isInStock() ? (
                  <span className="inline-flex items-center gap-2 text-green-600 font-semibold">
                    <FaCheck />
                    במלאי
                  </span>
                ) : (
                  <span className="text-red-600 font-semibold">
                    אזל מהמלאי
                  </span>
                )}
              </div>

              {product.description && (
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-3">תיאור</h2>
                  <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                    {product.description}
                  </p>
                </div>
              )}

              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">פרטי מוצר</h3>
                <div className="space-y-3">
                  {productType && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">סוג מוצר:</span>
                      <span className="font-semibold text-gray-800">{productType.name}</span>
                    </div>
                  )}
                  {product.material && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">חומר:</span>
                      <span className="font-semibold text-gray-800">{product.material}</span>
                    </div>
                  )}
                  {!product.has_variants && product.size && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">מידה:</span>
                      <span className="font-semibold text-gray-800">{product.size}</span>
                    </div>
                  )}
                  {categories.length > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">סגנון:</span>
                      <span className="font-semibold text-gray-800">{categories.map((c: any) => c.name).join(', ')}</span>
                    </div>
                  )}
                  {shapes.length > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">צורה:</span>
                      <span className="font-semibold text-gray-800">{shapes.map((s: any) => s.name).join(', ')}</span>
                    </div>
                  )}
                  {spaces.length > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">מתאים ל:</span>
                      <span className="font-semibold text-gray-800">{spaces.map((s: any) => s.name).join(', ')}</span>
                    </div>
                  )}
                  {plantTypes.length > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">סוג צמח:</span>
                      <span className="font-semibold text-gray-800">{plantTypes.map((pt: any) => pt.name).join(', ')}</span>
                    </div>
                  )}
                  {plantSizes.length > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">גודל:</span>
                      <span className="font-semibold text-gray-800">{plantSizes.map((ps: any) => ps.name).join(', ')}</span>
                    </div>
                  )}
                  {plantPetSafety.length > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">בטיחות לחיות:</span>
                      <span className="font-semibold text-gray-800">{plantPetSafety.map((ps: any) => ps.name).join(', ')}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Variant Color Selection (colors specific to variants) - hide for plants */}
              {product.has_variants && getVariantColors().length > 0 && productType?.slug !== 'plants' && (
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-3">בחר צבע</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {getVariantColors().map((color: any) => (
                      <button
                        key={color.id}
                        onClick={() => handleVariantColorSelect(color)}
                        className={`p-4 border-2 rounded-lg transition-all ${
                          selectedColor?.id === color.id
                            ? 'border-primary-600 bg-primary-50'
                            : 'border-gray-300 hover:border-primary-400'
                        }`}
                      >
                        <div className="text-center">
                          <div className="font-bold text-gray-800">{color.name}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Product-level Color Selection (for products without variant colors) - hide for plants */}
              {(!product.has_variants || getVariantColors().length === 0) && colors.length > 0 && productType?.slug !== 'plants' && (
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-3">בחר צבע</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {colors.map((color: any) => (
                      <button
                        key={color.id}
                        onClick={() => setSelectedColor(color)}
                        className={`p-4 border-2 rounded-lg transition-all ${
                          selectedColor?.id === color.id
                            ? 'border-primary-600 bg-primary-50'
                            : 'border-gray-300 hover:border-primary-400'
                        }`}
                      >
                        <div className="text-center">
                          <div className="font-bold text-gray-800">{color.name}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Variant Selection (Size) */}
              {product.has_variants && variants.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-3">בחר מידה</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {getUniqueSizes().map((size) => {
                      const variantColors = getVariantColors();
                      const hasVariantColors = variantColors.length > 0;

                      let available: boolean;
                      let stockCount: number;

                      if (hasVariantColors && selectedColor) {
                        available = isCombinationAvailable(size, selectedColor.id);
                        stockCount = getCombinationStock(size, selectedColor.id);
                      } else if (hasVariantColors) {
                        available = isSizeAvailable(size);
                        stockCount = variants
                          .filter(v => v.size === size)
                          .reduce((sum, v) => sum + (v.stock_quantity || 0), 0);
                      } else {
                        const variant = variants.find(v => v.size === size);
                        available = (variant?.stock_quantity || 0) > 0;
                        stockCount = variant?.stock_quantity || 0;
                      }

                      const isSelected = selectedVariant?.size === size;
                      const variant = variants.find(v => v.size === size);

                      return (
                        <button
                          key={size}
                          onClick={() => handleSizeSelect(size)}
                          disabled={!available}
                          className={`p-4 border-2 rounded-lg transition-all ${
                            isSelected
                              ? 'border-primary-600 bg-primary-50'
                              : 'border-gray-300 hover:border-primary-400'
                          } ${
                            !available
                              ? 'opacity-50 cursor-not-allowed bg-gray-100'
                              : ''
                          }`}
                        >
                          <div className="text-center">
                            <div className="font-bold text-gray-800">{size}</div>
                            <div className="text-sm text-gray-600 mt-1">
                              ₪{variant?.price?.toFixed(2) || '0.00'}
                            </div>
                            {!available && (
                              <div className="text-xs text-red-600 mt-1">אזל</div>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Quantity Selector */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-3">כמות</h3>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 border-2 border-gray-300 rounded-lg hover:border-primary-600 transition-colors font-bold text-xl"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-20 h-12 text-center border-2 border-gray-300 rounded-lg font-bold text-xl"
                    min="1"
                    max={getStockQuantity()}
                  />
                  <button
                    onClick={() => setQuantity(Math.min(getStockQuantity(), quantity + 1))}
                    className="w-12 h-12 border-2 border-gray-300 rounded-lg hover:border-primary-600 transition-colors font-bold text-xl"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={!isInStock()}
                className={`w-full py-4 rounded-lg font-bold text-lg transition-colors flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed mb-6 ${
                  addedToCart
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-terracotta hover:bg-terracotta-dark'
                } text-white`}
              >
                {addedToCart ? (
                  <>
                    <FaCheck />
                    נוסף לעגלה!
                  </>
                ) : (
                  <>
                    <FaShoppingCart />
                    {isInStock() ? 'הוסף לסל הקניות' : 'אזל מהמלאי'}
                  </>
                )}
              </button>

              {/* Features */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 bg-sage-light bg-opacity-20 rounded-lg border border-sage">
                <div className="flex items-center gap-3">
                  <FaTruck className="text-2xl text-primary-600" />
                  <div>
                    <div className="font-semibold text-gray-800">משלוח מהיר</div>
                    <div className="text-sm text-gray-600">3-5 ימי עסקים</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FaShieldAlt className="text-2xl text-primary-600" />
                  <div>
                    <div className="font-semibold text-gray-800">החזרה עד 14 יום</div>
                    <div className="text-sm text-gray-600">החזר כספי מלא</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FaCheck className="text-2xl text-primary-600" />
                  <div>
                    <div className="font-semibold text-gray-800">איכות מובטחת</div>
                    <div className="text-sm text-gray-600">מוצרים פרימיום</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="container mx-auto px-4 py-16">
        <ProductFAQ />
      </div>

      <Footer />
    </>
  );
}
