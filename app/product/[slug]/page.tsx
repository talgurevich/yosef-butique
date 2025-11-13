'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';
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

  const fetchProduct = async () => {
    try {
      // Fetch product
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
        const { data: variantsData, error: variantsError } = await supabase
          .from('product_variants')
          .select('*')
          .eq('product_id', productData.id)
          .eq('is_active', true)
          .order('sort_order');

        if (variantsError) throw variantsError;
        setVariants(variantsData || []);

        // Select first variant by default
        if (variantsData && variantsData.length > 0) {
          setSelectedVariant(variantsData[0]);
        }
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
        setColors(productColors.map((pc: any) => pc.colors));
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

    // Determine which variant to use
    const variantToAdd = selectedVariant || {
      id: `default-${product.id}`,
      size: product.size || 'רגיל',
      price: product.price,
    };

    // Get the first product image if available
    const imageUrl = productImages.length > 0 ? productImages[0].image_url : undefined;

    // Add to cart
    addToCart({
      productId: product.id,
      variantId: variantToAdd.id,
      productName: product.name,
      variantSize: variantToAdd.size,
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

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
        <Footer />
      </>
    );
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
              <div className="aspect-square bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center overflow-hidden">
                {productImages.length > 0 ? (
                  <img
                    src={productImages[selectedImageIndex]?.image_url}
                    alt={productImages[selectedImageIndex]?.alt_text || product.name}
                    className="w-full h-full object-cover"
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
                    במלאי ({getStockQuantity()} יחידות)
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
                  {colors.length > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">צבעים:</span>
                      <span className="font-semibold text-gray-800">{colors.map(c => c.name).join(', ')}</span>
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

              {/* Variant Selection */}
              {product.has_variants && variants.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-3">בחר מידה</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {variants.map((variant) => (
                      <button
                        key={variant.id}
                        onClick={() => setSelectedVariant(variant)}
                        disabled={variant.stock_quantity === 0}
                        className={`p-4 border-2 rounded-lg transition-all ${
                          selectedVariant?.id === variant.id
                            ? 'border-primary-600 bg-primary-50'
                            : 'border-gray-300 hover:border-primary-400'
                        } ${
                          variant.stock_quantity === 0
                            ? 'opacity-50 cursor-not-allowed'
                            : ''
                        }`}
                      >
                        <div className="text-center">
                          <div className="font-bold text-gray-800">{variant.size}</div>
                          <div className="text-sm text-gray-600 mt-1">
                            ₪{variant.price.toFixed(2)}
                          </div>
                          {variant.stock_quantity === 0 && (
                            <div className="text-xs text-red-600 mt-1">אזל</div>
                          )}
                        </div>
                      </button>
                    ))}
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
                    <div className="font-semibold text-gray-800">החזרה עד 30 יום</div>
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

      <Footer />
    </>
  );
}
