'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadProducts(); }, []);

  async function loadProducts() {
    const supabase = createClient();
    const { data } = await supabase
      .from('products')
      .select('*, product_images(*), categories(name_en)')
      .order('created_at', { ascending: false });
    setProducts(data || []);
    setLoading(false);
  }

  async function deleteProduct(product) {
    if (!confirm(`Delete "${product.name_en}"? This cannot be undone.`)) return;
    const supabase = createClient();

    // Delete images from storage
    if (product.product_images) {
      const paths = product.product_images
        .map(img => img.image_url.split('/storage/v1/object/public/products/')[1])
        .filter(Boolean);
      if (paths.length > 0) {
        await supabase.storage.from('products').remove(paths);
      }
    }

    await supabase.from('products').delete().eq('id', product.id);
    setProducts(prev => prev.filter(p => p.id !== product.id));
  }

  if (loading) return <div className="flex justify-center py-20"><div className="w-6 h-6 border-2 border-brand-gold border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-display text-3xl">Products ({products.length})</h1>
        <Link href="/admin/products/new" className="px-6 py-2.5 bg-brand-dark text-white rounded-xl text-sm font-medium hover:bg-brand-gold transition-colors no-underline">
          + Add Product
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-[#FAFAFA]">
              <th className="text-start p-4 text-xs text-brand-light uppercase tracking-wider font-medium">Image</th>
              <th className="text-start p-4 text-xs text-brand-light uppercase tracking-wider font-medium">ID</th>
              <th className="text-start p-4 text-xs text-brand-light uppercase tracking-wider font-medium hidden sm:table-cell">Name</th>
              <th className="text-start p-4 text-xs text-brand-light uppercase tracking-wider font-medium hidden md:table-cell">Category</th>
              <th className="text-start p-4 text-xs text-brand-light uppercase tracking-wider font-medium">Status</th>
              <th className="text-start p-4 text-xs text-brand-light uppercase tracking-wider font-medium">Tags</th>
              <th className="text-start p-4 text-xs text-brand-light uppercase tracking-wider font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
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
                  <span className={`text-xs font-medium px-3 py-1 rounded-full ${p.is_published ? 'bg-green-50 text-green-700' : 'bg-orange-50 text-orange-700'}`}>
                    {p.is_published ? 'Active' : 'Draft'}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex gap-1">
                    {p.is_new && <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">New</span>}
                    {p.is_hot && <span className="text-[10px] bg-red-50 text-red-600 px-2 py-0.5 rounded-full">Hot</span>}
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <Link href={`/admin/products/${p.id}/edit`} className="text-xs px-3 py-1.5 border border-brand-border rounded-lg hover:border-brand-gold hover:text-brand-gold transition-all no-underline text-brand-muted">
                      Edit
                    </Link>
                    <button onClick={() => deleteProduct(p)} className="text-xs px-3 py-1.5 border border-brand-border rounded-lg hover:border-red-400 hover:text-red-500 transition-all bg-transparent cursor-pointer text-brand-muted">
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && (
          <div className="text-center py-16 text-brand-muted">
            No products yet. <Link href="/admin/products/new" className="text-brand-gold">Add your first product</Link>
          </div>
        )}
      </div>
    </div>
  );
}
