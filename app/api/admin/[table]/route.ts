import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { supabaseAdmin } from '@/lib/supabase-admin';

// Allowlisted tables for the generic CRUD API
const ALLOWED_TABLES = new Set([
  'categories',
  'colors',
  'shapes',
  'spaces',
  'product_types',
  'plant_types',
  'plant_sizes',
  'plant_care_levels',
  'plant_light_requirements',
  'plant_pet_safety',
  'promo_codes',
  'banner',
  'customer_gallery',
  'email_campaigns',
  'csv_import_logs',
  'products',
  'product_variants',
  'product_images',
  'product_categories',
  'product_colors',
  'product_shapes',
  'product_spaces',
  'product_plant_types',
  'product_plant_sizes',
  'product_plant_light_requirements',
  'product_plant_care_levels',
  'product_plant_pet_safety',
  'orders',
  'order_items',
  'users',
  'newsletter_subscribers',
  'cart_promotion',
  'hero_slides',
]);

function getTable(params: { table: string }) {
  const table = params.table;
  if (!ALLOWED_TABLES.has(table)) {
    return { error: true, response: NextResponse.json({ error: `Table "${table}" is not allowed` }, { status: 400 }) };
  }
  return { error: false, table };
}

// GET — select rows
export async function GET(request: NextRequest, { params }: { params: { table: string } }) {
  const auth = await requireAdmin();
  if (!auth.authorized) return auth.response;

  const result = getTable(params);
  if (result.error) return result.response;

  const searchParams = request.nextUrl.searchParams;
  const orderBy = searchParams.get('order_by') || 'created_at';
  const orderDir = searchParams.get('order_dir') === 'desc' ? false : true; // ascending by default
  const filterColumn = searchParams.get('filter_column');
  const filterValue = searchParams.get('filter_value');
  const selectColumns = searchParams.get('select') || '*';
  const limit = searchParams.get('limit');

  let query = supabaseAdmin.from(result.table).select(selectColumns);

  if (filterColumn && filterValue) {
    query = query.eq(filterColumn, filterValue);
  }

  query = query.order(orderBy, { ascending: orderDir });

  if (limit) {
    query = query.limit(parseInt(limit));
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}

// POST — insert row(s)
export async function POST(request: NextRequest, { params }: { params: { table: string } }) {
  const auth = await requireAdmin();
  if (!auth.authorized) return auth.response;

  const result = getTable(params);
  if (result.error) return result.response;

  const body = await request.json();
  const rows = Array.isArray(body) ? body : [body];

  const { data, error } = await supabaseAdmin
    .from(result.table)
    .insert(rows)
    .select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}

// PUT — update row by id
export async function PUT(request: NextRequest, { params }: { params: { table: string } }) {
  const auth = await requireAdmin();
  if (!auth.authorized) return auth.response;

  const result = getTable(params);
  if (result.error) return result.response;

  const body = await request.json();
  const { id, ...updateData } = body;

  if (!id) {
    return NextResponse.json({ error: 'Missing "id" in request body' }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from(result.table)
    .update(updateData)
    .eq('id', id)
    .select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}

// DELETE — delete row by id
export async function DELETE(request: NextRequest, { params }: { params: { table: string } }) {
  const auth = await requireAdmin();
  if (!auth.authorized) return auth.response;

  const result = getTable(params);
  if (result.error) return result.response;

  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get('id');
  const filterColumn = searchParams.get('filter_column');
  const filterValue = searchParams.get('filter_value');

  if (!id && !filterColumn) {
    return NextResponse.json({ error: 'Missing "id" query param or filter' }, { status: 400 });
  }

  let query = supabaseAdmin.from(result.table).delete();

  if (id) {
    query = query.eq('id', id);
  } else if (filterColumn && filterValue) {
    query = query.eq(filterColumn, filterValue);
  }

  const { error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
