'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import ProductForm from '@/components/admin/ProductForm';

export default function EditProduct() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    Promise.all([
      supabase.from('products').select('*, product_images(*)').eq('id', id).single(),
      supabase.from('categories').select('*').order('sort_order'),
    ]).then(([{ data: prod }, { data: cats }]) => {
      if (prod?.product_images) {
        prod.product_images.sort((a, b) => a.sort_order - b.sort_order);
      }
      setProduct(prod);
      setCategories(cats || []);
      setLoading(false);
    });
  }, [id]);

  if (loading) return <div className="flex justify-center py-20"><div className="w-6 h-6 border-2 border-brand-gold border-t-transparent rounded-full animate-spin" /></div>;
  if (!product) return <div className="text-center py-20 text-brand-muted">Product not found</div>;

  return (
    <div>
      <h1 className="font-display text-3xl mb-8">Edit: {product.product_id}</h1>
      <ProductForm product={product} categories={categories} />
    </div>
  );
}
