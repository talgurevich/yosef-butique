import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null as any;

// Database types
export type ProductType = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  compare_at_price?: number;
  sku: string;
  category_id?: string;
  product_type_id: string;
  style: string[];
  color: string[];
  size: string;
  material: string;
  stock_quantity: number;
  is_featured: boolean;
  is_active: boolean;
  has_variants: boolean;
  slug: string;
  meta_title?: string;
  meta_description?: string;
  created_at: string;
  updated_at: string;
};

export type ProductVariant = {
  id: string;
  product_id: string;
  size: string;
  color_id?: string | null;
  sku: string;
  price: number;
  compare_at_price?: number;
  stock_quantity: number;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type ProductImage = {
  id: string;
  product_id: string;
  image_url: string;
  alt_text: string;
  sort_order: number;
  color_id: string | null;
  created_at: string;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parent_id?: string;
  image_url?: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type ProductCategory = {
  id: string;
  product_id: string;
  category_id: string;
  created_at: string;
};

export type Color = {
  id: string;
  name: string;
  slug: string;
  hex_code?: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type Shape = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type ProductColor = {
  id: string;
  product_id: string;
  color_id: string;
  created_at: string;
};

export type ProductShape = {
  id: string;
  product_id: string;
  shape_id: string;
  created_at: string;
};

export type Space = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type ProductSpace = {
  id: string;
  product_id: string;
  space_id: string;
  created_at: string;
};

export type PlantType = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type PlantSize = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type PlantLightRequirement = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type PlantCareLevel = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type PlantPetSafety = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type ProductPlantType = {
  id: string;
  product_id: string;
  plant_type_id: string;
  created_at: string;
};

export type ProductPlantSize = {
  id: string;
  product_id: string;
  plant_size_id: string;
  created_at: string;
};

export type ProductPlantLightRequirement = {
  id: string;
  product_id: string;
  plant_light_requirement_id: string;
  created_at: string;
};

export type ProductPlantCareLevel = {
  id: string;
  product_id: string;
  plant_care_level_id: string;
  created_at: string;
};

export type ProductPlantPetSafety = {
  id: string;
  product_id: string;
  plant_pet_safety_id: string;
  created_at: string;
};

export type GalleryImage = {
  id: string;
  image_url: string;
  customer_name?: string;
  testimonial?: string;
  product_id?: string;
  is_featured: boolean;
  sort_order: number;
  is_active: boolean;
  created_at: string;
};

export type NewsletterSubscriber = {
  id: string;
  email: string;
  full_name?: string;
  status: 'active' | 'unsubscribed';
  source?: string;
  promo_code_sent: boolean;
  subscribed_at: string;
  unsubscribed_at?: string;
};

export type PromoCode = {
  id: string;
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_purchase_amount: number;
  max_uses: number;
  current_uses: number;
  uses_per_customer: number;
  is_active: boolean;
  expires_at?: string;
  created_at: string;
  updated_at: string;
};
