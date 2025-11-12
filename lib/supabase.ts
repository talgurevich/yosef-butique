import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null as any;

// Database types
export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  compare_at_price?: number;
  sku: string;
  category_id?: string;
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
