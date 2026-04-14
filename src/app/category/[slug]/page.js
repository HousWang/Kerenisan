import CategoryClient from './CategoryClient';
import { createServerSupabase } from '@/lib/supabase-server';
import { notFound } from 'next/navigation';

const PAGE_SIZE = 12;

export async function generateMetadata({ params }) {
  const supabase = createServerSupabase();
  const { data: category } = await supabase
    .from('categories')
    .select('name_en')
    .eq('slug', params.slug)
    .single();

  return {
    title: category ? `${category.name_en} — Kerenisan` : 'Category — Kerenisan',
    description: `Browse wholesale ${category?.name_en || 'footwear'} from Kerenisan.`,
  };
}

export default async function CategoryPage({ params, searchParams }) {
  const supabase = createServerSupabase();
  const page = parseInt(searchParams?.page || '1', 10);

  // Get category
  const { data: category, error: catErr } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', params.slug)
    .single();

  if (catErr || !category) return notFound();

  // Get all categories for filter
  const { data: allCategories } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order');

  // Count total products in this category
  const { count: totalCount } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('category_id', category.id)
    .eq('is_published', true);

  // Get paginated products
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const { data: products } = await supabase
    .from('products')
    .select('*, product_images(*)')
    .eq('category_id', category.id)
    .eq('is_published', true)
    .order('sort_order')
    .range(from, to);

  const totalPages = Math.ceil((totalCount || 0) / PAGE_SIZE);

  return (
    <CategoryClient
      category={category}
      categories={allCategories || []}
      products={products || []}
      totalCount={totalCount || 0}
      currentPage={page}
      totalPages={totalPages}
    />
  );
}
