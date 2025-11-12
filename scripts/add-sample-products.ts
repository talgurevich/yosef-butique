import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const sampleProducts = [
  {
    name: 'שטיח גיאומטרי מודרני - סקנדינבי',
    description: 'שטיח מודרני בעיצוב גיאומטרי מינימליסטי. מושלם לסלון או חדר שינה. עשוי מחומרים איכותיים ועמידים. קל לתחזוקה ומתאים לכל סגנון עיצוב. הדוגמה הגיאומטרית מוסיפה עניין ויזואלי מבלי להכביד על החלל.',
    material: 'פוליפרופילן',
    is_featured: true,
    is_active: true,
    image_url: 'https://images.unsplash.com/photo-1600166898405-da9535204843?w=800&q=80',
    categories: ['סלון', 'חדר שינה'],
    variants: [
      { size: '120×170', price: 899, compare_at_price: 1200, stock_quantity: 15 },
      { size: '160×230', price: 1499, compare_at_price: 1900, stock_quantity: 12 },
      { size: '200×290', price: 2299, compare_at_price: 2900, stock_quantity: 8 },
    ]
  },
  {
    name: 'שטיח פרסי מסורתי - אלגנטי',
    description: 'שטיח בעיצוב פרסי מסורתי עם דוגמאות עשירות ומפוארות. מעניק תחושה של יוקרה וחמימות לבית. עשוי מצמר איכותי וטבעי. מושלם לסלונים מעוצבים ולחללים המעוניינים באווירה קלאסית. כל שטיח הוא יצירת אומנות בפני עצמה.',
    material: 'צמר',
    is_featured: true,
    is_active: true,
    image_url: 'https://images.unsplash.com/photo-1600494603989-9650cf6dad51?w=800&q=80',
    categories: ['סלון', 'מודרני'],
    variants: [
      { size: '160×230', price: 2899, compare_at_price: 3500, stock_quantity: 6 },
      { size: '200×290', price: 3999, compare_at_price: 4800, stock_quantity: 4 },
      { size: '240×340', price: 5499, compare_at_price: 6500, stock_quantity: 3 },
    ]
  },
  {
    name: 'שטיח צמר טבעי - בוהו שיק',
    description: 'שטיח עשוי צמר טבעי 100% בסגנון בוהמייני עכשווי. מרקם עשיר ונעים למגע. צבעים חמים וטבעיים שמתחברים לטבע. מתאים במיוחד לסלון, פינת אוכל או חדר עבודה. קל לתחזוקה ועמיד לאורך שנים.',
    material: 'צמר טבעי',
    is_featured: false,
    is_active: true,
    image_url: 'https://images.unsplash.com/photo-1584646098378-0874589d76b1?w=800&q=80',
    categories: ['סלון', 'חדר אוכל'],
    variants: [
      { size: '140×200', price: 1699, compare_at_price: 2100, stock_quantity: 10 },
      { size: '170×240', price: 2299, compare_at_price: 2800, stock_quantity: 7 },
      { size: '200×300', price: 3299, compare_at_price: 3900, stock_quantity: 5 },
    ]
  },
  {
    name: 'שטיח צבעוני לחדר ילדים - מרקם רך',
    description: 'שטיח צבעוני ועליז במיוחד לחדרי ילדים. עשוי מחומרים היפואלרגניים ובטוחים לשימוש. מרקם רך ונעים במיוחד לזחילה ומשחק. דוגמה מעוררת דמיון בצבעים עזים ומשמחים. קל לניקוי ועמיד לשפשופים ולכתמים.',
    material: 'מיקרופייבר',
    is_featured: false,
    is_active: true,
    image_url: 'https://images.unsplash.com/photo-1541123437800-1bb1317badc2?w=800&q=80',
    categories: ['חדר ילדים'],
    variants: [
      { size: '100×150', price: 599, compare_at_price: 800, stock_quantity: 20 },
      { size: '120×170', price: 799, compare_at_price: 1000, stock_quantity: 15 },
      { size: '140×200', price: 999, compare_at_price: 1300, stock_quantity: 12 },
    ]
  },
  {
    name: 'שטיח שאגי יוקרתי - אפור כהה',
    description: 'שטיח שאגי יוקרתי עם מרקם עמוק ורך במיוחד. צבע אפור כהה אלגנטי שמתאים לכל עיצוב. מעניק תחושת נוחות ופינוק מקסימלית. מושלם לחדר שינה או לאזור הישיבה בסלון. עשוי מסיבים איכותיים ועמידים.',
    material: 'פוליאסטר',
    is_featured: true,
    is_active: true,
    image_url: 'https://images.unsplash.com/photo-1576090396341-245ba540b162?w=800&q=80',
    categories: ['חדר שינה', 'סלון'],
    variants: [
      { size: '120×170', price: 1299, compare_at_price: 1600, stock_quantity: 10 },
      { size: '160×230', price: 1899, compare_at_price: 2400, stock_quantity: 8 },
      { size: '200×290', price: 2799, compare_at_price: 3400, stock_quantity: 5 },
    ]
  },
];

async function addSampleProducts() {
  console.log('🚀 Starting to add sample products...\n');

  // First, get or create categories
  const categoryNames = ['סלון', 'חדר שינה', 'חדר אוכל', 'חדר ילדים', 'מודרני'];
  const categoryMap: { [key: string]: string } = {};

  for (const categoryName of categoryNames) {
    const { data: existing } = await supabase
      .from('categories')
      .select('id, name')
      .eq('name', categoryName)
      .single();

    if (existing) {
      categoryMap[categoryName] = existing.id;
    } else {
      const { data: newCategory, error } = await supabase
        .from('categories')
        .insert([{
          name: categoryName,
          slug: categoryName.toLowerCase().replace(/\s+/g, '-'),
          is_active: true,
        }])
        .select()
        .single();

      if (error) {
        console.error(`❌ Error creating category ${categoryName}:`, error);
      } else {
        categoryMap[categoryName] = newCategory.id;
        console.log(`✅ Created category: ${categoryName}`);
      }
    }
  }

  console.log('\n📦 Adding products...\n');

  // Add each product
  for (let i = 0; i < sampleProducts.length; i++) {
    const product = sampleProducts[i];

    try {
      // Generate slug
      const slug = `${product.name
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '')}-${Date.now()}-${i}`;

      // Insert product
      const { data: productData, error: productError } = await supabase
        .from('products')
        .insert([{
          name: product.name,
          description: product.description,
          price: product.variants[0].price,
          sku: `CARPET-${Date.now()}-${i + 1}`,
          size: product.variants[0].size,
          material: product.material,
          stock_quantity: product.variants[0].stock_quantity,
          is_featured: product.is_featured,
          is_active: product.is_active,
          slug,
          style: [],
          color: [],
          has_variants: product.variants.length > 1,
        }])
        .select()
        .single();

      if (productError) {
        console.error(`❌ Error creating product "${product.name}":`, productError);
        continue;
      }

      console.log(`✅ Created product: ${product.name}`);

      // Add product image
      const { error: imageError } = await supabase
        .from('product_images')
        .insert([{
          product_id: productData.id,
          image_url: product.image_url,
          alt_text: product.name,
          sort_order: 0,
        }]);

      if (imageError) {
        console.error(`   ⚠️  Error adding image:`, imageError);
      } else {
        console.log(`   🖼️  Added product image`);
      }

      // Link categories
      const categoryLinks = product.categories.map(catName => ({
        product_id: productData.id,
        category_id: categoryMap[catName],
      }));

      const { error: categoryError } = await supabase
        .from('product_categories')
        .insert(categoryLinks);

      if (categoryError) {
        console.error(`   ⚠️  Error linking categories:`, categoryError);
      } else {
        console.log(`   📁 Linked ${product.categories.length} categories`);
      }

      // Add variants
      const variants = product.variants.map((variant, idx) => ({
        product_id: productData.id,
        size: variant.size,
        sku: `CARPET-${Date.now()}-${i + 1}-${idx + 1}`,
        price: variant.price,
        compare_at_price: variant.compare_at_price,
        stock_quantity: variant.stock_quantity,
        is_active: true,
        sort_order: idx,
      }));

      const { error: variantsError } = await supabase
        .from('product_variants')
        .insert(variants);

      if (variantsError) {
        console.error(`   ⚠️  Error adding variants:`, variantsError);
      } else {
        console.log(`   📏 Added ${variants.length} variants`);
      }

      console.log('');
    } catch (error) {
      console.error(`❌ Unexpected error with product "${product.name}":`, error);
    }
  }

  console.log('✨ Finished adding sample products!\n');
}

addSampleProducts()
  .then(() => {
    console.log('👍 All done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Fatal error:', error);
    process.exit(1);
  });
