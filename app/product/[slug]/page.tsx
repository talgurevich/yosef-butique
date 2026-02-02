'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';
import LoadingSpinner from '@/components/LoadingSpinner';
import ProductFAQ from '@/components/ProductFAQ';
import ImageMagnifier from '@/components/ImageMagnifier';
import { supabase, Product, ProductVariant } from '@/lib/supabase';
import { FaShoppingCart, FaArrowRight, FaCheck, FaTruck, FaShieldAlt } from 'react-icons/fa';
import { useCart } from '@/contexts/CartContext';

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [selectedColor, setSelectedColor] = useState<any>(null);
  const [productImages, setProductImages] = useState<any[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [addedToCart, setAddedToCart] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [colors, setColors] = useState<any[]>([]);
  const [shapes, setShapes] = useState<any[]>([]);
  const [spaces, setSpaces] = useState<any[]>([]);
  const [plantTypes, setPlantTypes] = useState<any[]>([]);
  const [plantSizes, setPlantSizes] = useState<any[]>([]);
  const [plantLightRequirements, setPlantLightRequirements] = useState<any[]>([]);
  const [plantCareLevels, setPlantCareLevels] = useState<any[]>([]);
  const [plantPetSafety, setPlantPetSafety] = useState<any[]>([]);
  const [productType, setProductType] = useState<any>(null);

  useEffect(() => {
    fetchProduct();
  }, [slug]);

  // Refetch data when page becomes visible (handles tab switching)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchProduct();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [slug]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      // Fetch product (add cache-busting timestamp)
      const { data: productData, error: productError } = await supabase
        .from('products')
        .select(`
          *,
          product_types (
            id,
            name,
            slug
          )
        `)
        .eq('slug', slug)
        .eq('is_active', true)
        .single();

      if (productError) throw productError;

      console.log('Product data:', productData);
      console.log('has_variants:', productData.has_variants);

      setProduct(productData);
      setProductType(productData.product_types);

      // Fetch product images
      const { data: imagesData, error: imagesError } = await supabase
        .from('product_images')
        .select('*')
        .eq('product_id', productData.id)
        .order('sort_order');

      if (!imagesError && imagesData) {
        setProductImages(imagesData);
      }

      // Fetch variants if product has them
      if (productData.has_variants) {
        console.log('Fetching variants for product:', productData.id);

        // First try to fetch with color join
        let variantsData = null;
        let variantsError = null;

        try {
          const result = await supabase
            .from('product_variants')
            .select(`
              *,
              colors (
                id,
                name,
                slug
              )
            `)
            .eq('product_id', productData.id)
            .eq('is_active', true)
            .order('sort_order');

          variantsData = result.data;
          variantsError = result.error;
        } catch (e) {
          console.error('Error with color join, fetching without:', e);
        }

        // If color join failed, fetch without it
        if (variantsError || !variantsData) {
          console.log('Fetching variants without color join');
          const result = await supabase
            .from('product_variants')
            .select('*')
            .eq('product_id', productData.id)
            .eq('is_active', true)
            .order('sort_order');

          variantsData = result.data;
          if (result.error) {
            console.error('Error fetching variants:', result.error);
          }
        }

        console.log('Variants data:', variantsData);
        setVariants(variantsData || []);

        // Don't auto-select variant - let user choose size and color
      } else {
        console.log('Product does not have variants (has_variants is false)');
      }

      // Fetch product attributes based on type
      await fetchProductAttributes(productData.id);
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProductAttributes = async (productId: string) => {
    try {
      // Fetch categories
      const { data: productCategories } = await supabase
        .from('product_categories')
        .select('categories (*)')
        .eq('product_id', productId);
      if (productCategories) {
        setCategories(productCategories.map((pc: any) => pc.categories));
      }

      // Fetch colors
      const { data: productColors } = await supabase
        .from('product_colors')
        .select('colors (*)')
        .eq('product_id', productId);
      if (productColors) {
        const colorsList = productColors.map((pc: any) => pc.colors);
        setColors(colorsList);
        // Auto-select first color if available
        if (colorsList.length > 0) {
          setSelectedColor(colorsList[0]);
        }
      }

      // Fetch shapes
      const { data: productShapes } = await supabase
        .from('product_shapes')
        .select('shapes (*)')
        .eq('product_id', productId);
      if (productShapes) {
        setShapes(productShapes.map((ps: any) => ps.shapes));
      }

      // Fetch spaces
      const { data: productSpaces } = await supabase
        .from('product_spaces')
        .select('spaces (*)')
        .eq('product_id', productId);
      if (productSpaces) {
        setSpaces(productSpaces.map((ps: any) => ps.spaces));
      }

      // Fetch plant types
      const { data: productPlantTypes } = await supabase
        .from('product_plant_types')
        .select('plant_types (*)')
        .eq('product_id', productId);
      if (productPlantTypes) {
        setPlantTypes(productPlantTypes.map((pt: any) => pt.plant_types));
      }

      // Fetch plant sizes
      const { data: productPlantSizes } = await supabase
        .from('product_plant_sizes')
        .select('plant_sizes (*)')
        .eq('product_id', productId);
      if (productPlantSizes) {
        setPlantSizes(productPlantSizes.map((ps: any) => ps.plant_sizes));
      }

      // Fetch plant light requirements
      const { data: productPlantLights } = await supabase
        .from('product_plant_light_requirements')
        .select('plant_light_requirements (*)')
        .eq('product_id', productId);
      if (productPlantLights) {
        setPlantLightRequirements(productPlantLights.map((pl: any) => pl.plant_light_requirements));
      }

      // Fetch plant care levels
      const { data: productPlantCares } = await supabase
        .from('product_plant_care_levels')
        .select('plant_care_levels (*)')
        .eq('product_id', productId);
      if (productPlantCares) {
        setPlantCareLevels(productPlantCares.map((pc: any) => pc.plant_care_levels));
      }

      // Fetch plant pet safety
      const { data: productPlantPetSafety } = await supabase
        .from('product_plant_pet_safety')
        .select('plant_pet_safety (*)')
        .eq('product_id', productId);
      if (productPlantPetSafety) {
        setPlantPetSafety(productPlantPetSafety.map((ps: any) => ps.plant_pet_safety));
      }
    } catch (error) {
      console.error('Error fetching product attributes:', error);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;

    // For products with variants, require a variant selection
    if (product.has_variants && !selectedVariant) {
      alert('אנא בחר מידה');
      return;
    }

    // For products with variant colors, require a color selection
    const variantColors = getVariantColors();
    if (product.has_variants && variantColors.length > 0 && !selectedColor) {
      alert('אנא בחר צבע');
      return;
    }

    // For products with product-level colors (no variant colors), require a color selection
    if ((!product.has_variants || variantColors.length === 0) && colors.length > 0 && !selectedColor) {
      alert('אנא בחר צבע');
      return;
    }

    // Determine which variant to use
    const variantToAdd = selectedVariant || {
      id: `default-${product.id}`,
      size: product.size || 'רגיל',
      price: product.price,
    };

    // Get color name - prefer variant's color, fall back to selected product color
    const colorName = (selectedVariant as any)?.colors?.name || selectedColor?.name;

    // Get the first product image if available
    const imageUrl = productImages.length > 0 ? productImages[0].image_url : undefined;

    // Add to cart
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

    // Show success feedback
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 3000);
  };

  const getCurrentPrice = () => {
    if (selectedVariant) {
      return selectedVariant.price;
    }
    return product?.price || 0;
  };

  const getComparePrice = () => {
    if (selectedVariant) {
      return selectedVariant.compare_at_price;
    }
    return product?.compare_at_price;
  };

  const getStockQuantity = () => {
    if (selectedVariant) {
      return selectedVariant.stock_quantity;
    }
    return product?.stock_quantity || 0;
  };

  const isInStock = () => {
    return getStockQuantity() > 0;
  };

  // Get unique sizes from variants
  const getUniqueSizes = () => {
    const sizes = Array.from(new Set(variants.map(v => v.size)));
    return sizes;
  };

  // Get unique colors from variants (variant-level colors)
  const getVariantColors = () => {
    const colorMap = new Map();
    variants.forEach((v: any) => {
      if (v.color_id && v.colors) {
        colorMap.set(v.color_id, v.colors);
      }
    });
    return Array.from(colorMap.values());
  };

  // Check if a specific size+color combination is available
  const isCombinationAvailable = (size: string, colorId: string | null) => {
    const variant = variants.find(v =>
      v.size === size &&
      (colorId ? v.color_id === colorId : !v.color_id)
    );
    return variant && variant.stock_quantity > 0;
  };

  // Check if a size has any stock (across all colors)
  const isSizeAvailable = (size: string) => {
    return variants.some(v => v.size === size && v.stock_quantity > 0);
  };

  // Check if a color has any stock (across all sizes)
  const isColorAvailable = (colorId: string) => {
    return variants.some(v => v.color_id === colorId && v.stock_quantity > 0);
  };

  // Get stock for specific size+color combination
  const getCombinationStock = (size: string, colorId: string | null) => {
    const variant = variants.find(v =>
      v.size === size &&
      (colorId ? v.color_id === colorId : !v.color_id)
    );
    return variant?.stock_quantity || 0;
  };

  // Find and select variant based on size and color
  const findMatchingVariant = (size: string | null, colorId: string | null) => {
    if (!size) return null;
    return variants.find(v =>
      v.size === size &&
      (colorId ? v.color_id === colorId : !v.color_id)
    ) || null;
  };

  // Handle size selection
  const handleSizeSelect = (size: string) => {
    const variantColors = getVariantColors();
    const hasVariantColors = variantColors.length > 0;

    if (hasVariantColors) {
      // Find matching variant with current color or first available
      const matchingVariant = findMatchingVariant(size, selectedColor?.id);
      if (matchingVariant) {
        setSelectedVariant(matchingVariant);
      } else {
        // Try to find any variant with this size
        const anyVariantWithSize = variants.find(v => v.size === size) as any;
        if (anyVariantWithSize) {
          setSelectedVariant(anyVariantWithSize);
          // Update selected color to match
          if (anyVariantWithSize.colors) {
            setSelectedColor(anyVariantWithSize.colors);
          }
        }
      }
    } else {
      // No variant colors - just select by size
      const variant = variants.find(v => v.size === size);
      if (variant) {
        setSelectedVariant(variant);
      }
    }
  };

  // Handle color selection for variants
  const handleVariantColorSelect = (color: any) => {
    setSelectedColor(color);

    // If we have a selected size, find the matching variant
    if (selectedVariant?.size) {
      const matchingVariant = findMatchingVariant(selectedVariant.size, color.id);
      if (matchingVariant) {
        setSelectedVariant(matchingVariant);
      } else {
        // Color doesn't have this size - find first variant with this color
        const firstVariantWithColor = variants.find(v => v.color_id === color.id);
        if (firstVariantWithColor) {
          setSelectedVariant(firstVariantWithColor);
        }
      }
    } else {
      // No size selected - select first variant with this color
      const firstVariantWithColor = variants.find(v => v.color_id === color.id);
      if (firstVariantWithColor) {
        setSelectedVariant(firstVariantWithColor);
      }
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!product) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center bg-cream">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">המוצר לא נמצא</h1>
            <p className="text-gray-600 mb-6">המוצר שחיפשת אינו קיים או אינו זמין</p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
            >
              <FaArrowRight />
              חזרה לכל המוצרים
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const currentPrice = getCurrentPrice();
  const comparePrice = getComparePrice();
  const hasDiscount = comparePrice && comparePrice > currentPrice;

  return (
    <>
      <Header />

      {/* Breadcrumbs */}
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
                {productImages.length > 0 ? (
                  <ImageMagnifier
                    src={productImages[selectedImageIndex]?.image_url}
                    alt={productImages[selectedImageIndex]?.alt_text || product.name}
                    magnifierHeight={200}
                    magnifierWidth={200}
                    zoomLevel={2.5}
                  />
                ) : (
                  <div className="text-gray-400 text-9xl">🏠</div>
                )}
              </div>

              {/* Image thumbnails */}
              {productImages.length > 1 && (
                <div className="grid grid-cols-4 gap-4 mt-4">
                  {productImages.map((image, index) => (
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
              {/* Title */}
              <h1 className="text-4xl font-bold text-gray-800 mb-4">
                {product.name}
              </h1>

              {/* Price */}
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

              {/* Stock Status */}
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

              {/* Description */}
              {product.description && (
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-3">תיאור</h2>
                  <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                    {product.description}
                  </p>
                </div>
              )}

              {/* Product Details */}
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

                  {/* Carpet Attributes */}
                  {categories.length > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">סגנון:</span>
                      <span className="font-semibold text-gray-800">{categories.map(c => c.name).join(', ')}</span>
                    </div>
                  )}
                  {shapes.length > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">צורה:</span>
                      <span className="font-semibold text-gray-800">{shapes.map(s => s.name).join(', ')}</span>
                    </div>
                  )}
                  {spaces.length > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">מתאים ל:</span>
                      <span className="font-semibold text-gray-800">{spaces.map(s => s.name).join(', ')}</span>
                    </div>
                  )}

                  {/* Plant Attributes */}
                  {plantTypes.length > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">סוג צמח:</span>
                      <span className="font-semibold text-gray-800">{plantTypes.map(pt => pt.name).join(', ')}</span>
                    </div>
                  )}
                  {plantSizes.length > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">גודל:</span>
                      <span className="font-semibold text-gray-800">{plantSizes.map(ps => ps.name).join(', ')}</span>
                    </div>
                  )}
                  {plantLightRequirements.length > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">דרישות אור:</span>
                      <span className="font-semibold text-gray-800">{plantLightRequirements.map(pl => pl.name).join(', ')}</span>
                    </div>
                  )}
                  {plantCareLevels.length > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">רמת טיפול:</span>
                      <span className="font-semibold text-gray-800">{plantCareLevels.map(pc => pc.name).join(', ')}</span>
                    </div>
                  )}
                  {plantPetSafety.length > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">בטיחות לחיות:</span>
                      <span className="font-semibold text-gray-800">{plantPetSafety.map(ps => ps.name).join(', ')}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Variant Color Selection (colors specific to variants) */}
              {product.has_variants && getVariantColors().length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-3">בחר צבע</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {getVariantColors().map((color: any) => {
                      const available = isColorAvailable(color.id);
                      const isSelected = selectedColor?.id === color.id;
                      const currentSizeStock = selectedVariant?.size
                        ? getCombinationStock(selectedVariant.size, color.id)
                        : 0;

                      return (
                        <button
                          key={color.id}
                          onClick={() => handleVariantColorSelect(color)}
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
                            <div className="font-bold text-gray-800">{color.name}</div>
                            {selectedVariant?.size && (
                              <div className={`text-xs mt-1 ${currentSizeStock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {currentSizeStock > 0 ? 'במלאי' : 'אזל במידה זו'}
                              </div>
                            )}
                            {!available && (
                              <div className="text-xs text-red-600 mt-1">אזל מהמלאי</div>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Product-level Color Selection (for products without variant colors) */}
              {(!product.has_variants || getVariantColors().length === 0) && colors.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-3">בחר צבע</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {colors.map((color) => (
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

                      // Check availability based on whether we have variant colors
                      let available: boolean;
                      let stockCount: number;

                      if (hasVariantColors && selectedColor) {
                        // Check specific size+color combination
                        available = isCombinationAvailable(size, selectedColor.id);
                        stockCount = getCombinationStock(size, selectedColor.id);
                      } else if (hasVariantColors) {
                        // No color selected - show if any color has stock for this size
                        available = isSizeAvailable(size);
                        stockCount = variants
                          .filter(v => v.size === size)
                          .reduce((sum, v) => sum + (v.stock_quantity || 0), 0);
                      } else {
                        // No variant colors - check by size only
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
                    <div className="font-semibold text-gray-800">משלוח חינם</div>
                    <div className="text-sm text-gray-600">על הזמנות מעל ₪500</div>
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
