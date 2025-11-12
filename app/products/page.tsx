import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { FaShoppingCart, FaEye } from 'react-icons/fa';

async function getProducts() {
  if (!supabase) {
    return [];
  }

  const { data, error} = await supabase
    .from('products')
    .select(`
      *,
      product_images (
        id,
        image_url,
        alt_text,
        sort_order
      )
    `)
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }

  // Sort images by sort_order
  const productsWithSortedImages = data?.map(product => ({
    ...product,
    product_images: product.product_images?.sort((a: any, b: any) => a.sort_order - b.sort_order) || []
  }));

  return productsWithSortedImages || [];
}

async function getCategories() {
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('sort_order');

  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }

  return data || [];
}

export default async function ProductsPage() {
  const products = await getProducts();
  const categories = await getCategories();

  return (
    <>
      <Header />

      <div className="min-h-screen bg-cream">
        {/* Page Header */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
              הקולקציה שלנו
            </h1>
            <p className="text-xl text-center text-primary-100">
              גלה את מגוון השטיחים האיכותיים שלנו
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar - Categories */}
            <aside className="md:w-64 flex-shrink-0">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                <h2 className="text-xl font-bold text-gray-800 mb-4">קטגוריות</h2>
                <ul className="space-y-2">
                  <li>
                    <Link
                      href="/products"
                      className="block px-4 py-2 rounded-lg hover:bg-primary-50 transition-colors text-gray-700 hover:text-primary-600"
                    >
                      כל המוצרים ({products.length})
                    </Link>
                  </li>
                  {categories.map((category) => (
                    <li key={category.id}>
                      <Link
                        href={`/products?category=${category.slug}`}
                        className="block px-4 py-2 rounded-lg hover:bg-primary-50 transition-colors text-gray-700 hover:text-primary-600"
                      >
                        {category.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>

            {/* Products Grid */}
            <div className="flex-1">
              {products.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-12 text-center">
                  <p className="text-gray-600 text-lg mb-4">
                    אין מוצרים זמינים כרגע
                  </p>
                  <p className="text-gray-500">
                    נא לחזור בקרוב לעדכונים חדשים!
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product: any) => (
                    <div
                      key={product.id}
                      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow group"
                    >
                      {/* Product Image */}
                      <div className="relative h-64 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center overflow-hidden">
                        {product.product_images && product.product_images.length > 0 ? (
                          <img
                            src={product.product_images[0].image_url}
                            alt={product.product_images[0].alt_text || product.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        ) : (
                          <div className="text-gray-400 text-6xl">🏠</div>
                        )}
                        {product.is_featured && (
                          <span className="absolute top-4 left-4 bg-terracotta text-white px-3 py-1 rounded-full text-sm font-semibold">
                            מומלץ
                          </span>
                        )}
                        {product.compare_at_price && product.compare_at_price > product.price && (
                          <span className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                            מבצע!
                          </span>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-primary-600 transition-colors">
                          {product.name}
                        </h3>

                        {product.description && (
                          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                            {product.description}
                          </p>
                        )}

                        {/* Material */}
                        {product.material && (
                          <p className="text-gray-500 text-sm mb-2">
                            <strong>חומר:</strong> {product.material}
                          </p>
                        )}

                        {/* Size */}
                        {product.size && (
                          <p className="text-gray-500 text-sm mb-2">
                            <strong>מידה:</strong> {product.size}
                          </p>
                        )}

                        {/* Price */}
                        <div className="flex items-center gap-3 mb-4">
                          {product.compare_at_price && product.compare_at_price > product.price ? (
                            <>
                              <span className="text-2xl font-bold text-terracotta">
                                ₪{product.price.toFixed(2)}
                              </span>
                              <span className="text-lg text-gray-400 line-through">
                                ₪{product.compare_at_price.toFixed(2)}
                              </span>
                            </>
                          ) : (
                            <span className="text-2xl font-bold text-gray-800">
                              ₪{product.price.toFixed(2)}
                            </span>
                          )}
                        </div>

                        {/* Has Variants Indicator */}
                        {product.has_variants && (
                          <p className="text-sm text-primary-600 mb-4">
                            ✓ זמין במספר מידות
                          </p>
                        )}

                        {/* Actions */}
                        <div className="flex gap-2">
                          <Link
                            href={`/product/${product.slug}`}
                            className="flex-1 bg-primary-600 text-white px-4 py-3 rounded-lg hover:bg-primary-700 transition-colors text-center font-semibold flex items-center justify-center gap-2"
                          >
                            <FaEye />
                            צפה במוצר
                          </Link>
                          <button
                            className="bg-terracotta text-white p-3 rounded-lg hover:bg-terracotta-dark transition-colors"
                            title="הוסף לסל"
                          >
                            <FaShoppingCart />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
