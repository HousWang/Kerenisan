'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import ProductForm from '@/components/admin/ProductForm';

export default function NewProduct() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const supabase = createClient();
    supabase.from('categories').select('*').order('sort_order').then(({ data }) => setCategories(data || []));
  }, []);

  return (
    <div>
      <h1 className="font-display text-3xl mb-8">Add New Product</h1>
      <ProductForm categories={categories} />
    </div>
  );
}
