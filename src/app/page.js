import HomeClient from './HomeClient';
import { createServerSupabase } from '@/lib/supabase-server';

export default async function HomePage() {
  const supabase = createServerSupabase();

  // Fetch data in parallel
  const [
    { data: newProducts },
    { data: hotProducts },
    { data: categories },
    { data: bestProducts },
  ] = await Promise.all([
    supabase
      .from('products')
      .select('*, product_images(*)')
      .eq('is_published', true)
      .eq('is_new', true)
      .order('sort_order')
      .limit(4),
    supabase
      .from('products')
      .select('*, product_images(*)')
      .eq('is_published', true)
      .eq('is_hot', true)
      .order('sort_order')
      .limit(4),
    supabase
      .from('categories')
      .select('*')
      .order('sort_order'),
    supabase
      .from('products')
      .select('*, product_images(*)')
      .eq('is_published', true)
      .order('created_at', { ascending: false })
      .limit(8),
  ]);

  // Count products per category
  const catCounts = {};
  if (categories) {
    for (const cat of categories) {
      const { count } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('category_id', cat.id)
        .eq('is_published', true);
      catCounts[cat.id] = count || 0;
    }
  }

  return (
    <HomeClient
      newProducts={newProducts || []}
      hotProducts={hotProducts || []}
      categories={(categories || []).map(c => ({ ...c, count: catCounts[c.id] || 0 }))}
      bestProducts={bestProducts || []}
    />
  );
}
