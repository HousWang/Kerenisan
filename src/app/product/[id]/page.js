import ProductClient from './ProductClient';
import { createServerSupabase } from '@/lib/supabase-server';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }) {
  const supabase = createServerSupabase();
  const { data: product } = await supabase
    .from('products')
    .select('name_en, product_id')
    .eq('product_id', params.id)
    .eq('is_published', true)
    .single();

  return {
    title: product ? `${product.name_en} (${product.product_id}) — Kerenisan` : 'Product — Kerenisan',
    description: product ? `Wholesale ${product.name_en} from Kerenisan. Contact us for bulk pricing.` : '',
  };
}

export default async function ProductPage({ params }) {
  const supabase = createServerSupabase();

  const { data: product, error } = await supabase
    .from('products')
    .select('*, product_images(*), categories(name_en, name_ar, slug)')
    .eq('product_id', params.id)
    .eq('is_published', true)
    .single();

  if (error || !product) return notFound();

  // Sort images by sort_order
  if (product.product_images) {
    product.product_images.sort((a, b) => a.sort_order - b.sort_order);
  }

  // Get related products from same category
  const { data: related } = await supabase
    .from('products')
    .select('*, product_images(*)')
    .eq('category_id', product.category_id)
    .eq('is_published', true)
    .neq('id', product.id)
    .order('sort_order')
    .limit(4);

  // Get all categories for footer
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order');

  return (
    <ProductClient
      product={product}
      related={related || []}
      categories={categories || []}
    />
  );
}
