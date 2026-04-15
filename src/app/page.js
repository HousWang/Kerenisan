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

  // Count products per category and get first product image
  const catCounts = {};
  const catImages = {};
  if (categories) {
    for (const cat of categories) {
      const { count } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('category_id', cat.id)
        .eq('is_published', true);
      catCounts[cat.id] = count || 0;

      // Get first product image for this category
      const { data: firstProduct } = await supabase
        .from('products')
        .select('product_images(*)')
        .eq('category_id', cat.id)
        .eq('is_published', true)
        .order('sort_order')
        .limit(1)
        .single();
      const imgs = firstProduct?.product_images;
      if (imgs && imgs.length > 0) {
        catImages[cat.id] = imgs[0].image_url;
      }
    }
  }

  return (
    <HomeClient
      newProducts={newProducts || []}
      hotProducts={hotProducts || []}
      categories={(categories || []).map(c => ({
        ...c,
        count: catCounts[c.id] || 0,
        first_image: c.image_url || catImages[c.id] || null,
      }))}
      bestProducts={bestProducts || []}
    />
  );
}
