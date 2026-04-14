'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name_en: '', name_ar: '', slug: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadCategories(); }, []);

  async function loadCategories() {
    const supabase = createClient();
    const { data } = await supabase.from('categories').select('*').order('sort_order');
    setCategories(data || []);
    setLoading(false);
  }

  function startEdit(cat) {
    setEditing(cat.id);
    setForm({ name_en: cat.name_en, name_ar: cat.name_ar, slug: cat.slug });
  }

  function startNew() {
    setEditing('new');
    setForm({ name_en: '', name_ar: '', slug: '' });
  }

  function autoSlug(name) {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }

  async function saveCategory(e) {
    e.preventDefault();
    const supabase = createClient();

    if (editing === 'new') {
      const { error } = await supabase.from('categories').insert({
        name_en: form.name_en,
        name_ar: form.name_ar,
        slug: form.slug || autoSlug(form.name_en),
        sort_order: categories.length,
      });
      if (error) return alert(error.message);
    } else {
      const { error } = await supabase.from('categories').update({
        name_en: form.name_en,
        name_ar: form.name_ar,
        slug: form.slug,
      }).eq('id', editing);
      if (error) return alert(error.message);
    }

    setEditing(null);
    loadCategories();
  }

  async function deleteCategory(cat) {
    if (!confirm(`Delete "${cat.name_en}"? Products in this category will be uncategorized.`)) return;
    const supabase = createClient();
    await supabase.from('categories').delete().eq('id', cat.id);
    loadCategories();
  }

  const inputCls = 'w-full px-4 py-3 border border-brand-border rounded-xl text-sm focus:outline-none focus:border-brand-gold transition-colors';

  if (loading) return <div className="flex justify-center py-20"><div className="w-6 h-6 border-2 border-brand-gold border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-display text-3xl">Categories</h1>
        <button onClick={startNew} className="px-6 py-2.5 bg-brand-dark text-white rounded-xl text-sm font-medium hover:bg-brand-gold transition-colors border-none cursor-pointer">
          + Add Category
        </button>
      </div>

      {/* Edit/New Form */}
      {editing && (
        <form onSubmit={saveCategory} className="bg-white rounded-2xl p-6 shadow-sm mb-8 space-y-4">
          <h3 className="font-medium">{editing === 'new' ? 'New Category' : 'Edit Category'}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-brand-light mb-1">Name (EN) *</label>
              <input
                type="text"
                required
                value={form.name_en}
                onChange={e => setForm(f => ({ ...f, name_en: e.target.value, slug: editing === 'new' ? autoSlug(e.target.value) : f.slug }))}
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-xs text-brand-light mb-1">Name (AR)</label>
              <input type="text" value={form.name_ar} onChange={e => setForm(f => ({ ...f, name_ar: e.target.value }))} className={inputCls} dir="rtl" />
            </div>
            <div>
              <label className="block text-xs text-brand-light mb-1">Slug</label>
              <input type="text" value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} className={inputCls} placeholder="auto-generated" />
            </div>
          </div>
          <div className="flex gap-3">
            <button type="submit" className="px-6 py-2.5 bg-brand-dark text-white rounded-xl text-sm hover:bg-brand-gold transition-colors border-none cursor-pointer">
              Save
            </button>
            <button type="button" onClick={() => setEditing(null)} className="px-6 py-2.5 border border-brand-border rounded-xl text-sm hover:border-brand-dark transition-colors bg-transparent cursor-pointer">
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-[#FAFAFA]">
              <th className="text-start p-4 text-xs text-brand-light uppercase tracking-wider font-medium">Name (EN)</th>
              <th className="text-start p-4 text-xs text-brand-light uppercase tracking-wider font-medium">Name (AR)</th>
              <th className="text-start p-4 text-xs text-brand-light uppercase tracking-wider font-medium hidden sm:table-cell">Slug</th>
              <th className="text-start p-4 text-xs text-brand-light uppercase tracking-wider font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(cat => (
              <tr key={cat.id} className="border-t border-[#F5F5F5] hover:bg-[#FAFAFA]">
                <td className="p-4 text-sm font-medium">{cat.name_en}</td>
                <td className="p-4 text-sm" dir="rtl">{cat.name_ar || '—'}</td>
                <td className="p-4 text-sm text-brand-muted hidden sm:table-cell">{cat.slug}</td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <button onClick={() => startEdit(cat)} className="text-xs px-3 py-1.5 border border-brand-border rounded-lg hover:border-brand-gold hover:text-brand-gold transition-all bg-transparent cursor-pointer text-brand-muted">
                      Edit
                    </button>
                    <button onClick={() => deleteCategory(cat)} className="text-xs px-3 py-1.5 border border-brand-border rounded-lg hover:border-red-400 hover:text-red-500 transition-all bg-transparent cursor-pointer text-brand-muted">
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
