'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ products: 0, categories: 0, published: 0, drafts: 0 });
  const [recentProducts, setRecentProducts] = useState([]);

  useEffect(() => {
    const supabase = createClient();

    async function loadDashboard() {
      const [
        { count: products },
        { count: categories },
        { count: published },
        { data: recent },
      ] = await Promise.all([
        supabase.from('products').select('*', { count: 'exact', head: true }),
        supabase.from('categories').select('*', { count: 'exact', head: true }),
        supabase.from('products').select('*', { count: 'exact', head: true }).eq('is_published', true),
        supabase
          .from('products')
          .select('*, product_images(*), categories(name_en)')
          .order('created_at', { ascending: false })
          .limit(5),
      ]);

      setStats({
        products: products || 0,
        categories: categories || 0,
        published: published || 0,
        drafts: (products || 0) - (published || 0),
      });
      setRecentProducts(recent || []);
    }

    loadDashboard();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-display text-3xl">Dashboard</h1>
        <Link
          href="/admin/products/new"
          className="px-6 py-2.5 bg-brand-dark text-white rounded-xl text-sm font-medium hover:bg-brand-gold transition-colors no-underline"
        >
          + Add Product
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {[
          { label: 'Total Products', value: stats.products },
          { label: 'Categories', value: stats.categories },
          { label: 'Published', value: stats.published },
          { label: 'Drafts', value: stats.drafts },
        ].map((s) => (
          <div key={s.label} className="bg-white p-6 rounded-2xl shadow-sm">
            <div className="text-xs text-brand-light uppercase tracking-wide">{s.label}</div>
            <div className="font-display text-4xl mt-2">{s.value}</div>
          </div>
        ))}
      </div>

      {/* Recent Products */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-[#FAFAFA]">
              <th className="text-start p-4 text-xs text-brand-light uppercase tracking-wider font-medium">Image</th>
              <th className="text-start p-4 text-xs text-brand-light uppercase tracking-wider font-medium">Product ID</th>
              <th className="text-start p-4 text-xs text-brand-light uppercase tracking-wider font-medium hidden sm:table-cell">Name</th>
              <th className="text-start p-4 text-xs text-brand-light uppercase tracking-wider font-medium hidden md:table-cell">Category</th>
              <th className="text-start p-4 text-xs text-brand-light uppercase tracking-wider font-medium">Status</th>
              <th className="text-start p-4 text-xs text-brand-light uppercase tracking-wider font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {recentProducts.map((p) => (
              <tr key={p.id} className="border-t border-[#F5F5F5] hover:bg-[#FAFAFA]">
                <td className="p-4">
                  {p.product_images?.[0]?.image_url ? (
                    <img src={p.product_images[0].image_url} alt="" className="w-12 h-12 rounded-xl object-cover" />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-brand-bg-alt" />
                  )}
                </td>
                <td className="p-4 font-medium text-sm">{p.product_id}</td>
                <td className="p-4 text-sm hidden sm:table-cell">{p.name_en}</td>
                <td className="p-4 text-sm text-brand-muted hidden md:table-cell">{p.categories?.name_en || '—'}</td>
                <td className="p-4">
                  <span className={`text-xs font-medium px-3 py-1 rounded-full ${
                    p.is_published ? 'bg-green-50 text-green-700' : 'bg-orange-50 text-orange-700'
                  }`}>
                    {p.is_published ? 'Active' : 'Draft'}
                  </span>
                </td>
                <td className="p-4">
                  <Link
                    href={`/admin/products/${p.id}/edit`}
                    className="text-xs px-3 py-1.5 border border-brand-border rounded-lg hover:border-brand-gold hover:text-brand-gold transition-all no-underline text-brand-muted"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
