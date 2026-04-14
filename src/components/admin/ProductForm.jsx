'use client';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';

export default function ProductForm({ product = null, categories = [] }) {
  const router = useRouter();
  const supabase = createClient();
  const fileInputRef = useRef(null);
  const isEditing = !!product;

  const [form, setForm] = useState({
    product_id: product?.product_id || '',
    name_en: product?.name_en || '',
    name_ar: product?.name_ar || '',
    description_en: product?.description_en || '',
    description_ar: product?.description_ar || '',
    category_id: product?.category_id || '',
    material_en: product?.material_en || '',
    material_ar: product?.material_ar || '',
    sizes: product?.sizes || '36-41',
    moq: product?.moq || '36',
    colors: product?.colors || [],
    is_new: product?.is_new || false,
    is_hot: product?.is_hot || false,
    is_published: product?.is_published ?? true,
    sort_order: product?.sort_order || 0,
  });

  const [existingImages, setExistingImages] = useState(product?.product_images || []);
  const [newFiles, setNewFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Color management
  const [colorName, setColorName] = useState('');
  const [colorHex, setColorHex] = useState('#000000');

  function addColor() {
    if (colorName.trim()) {
      setForm(f => ({ ...f, colors: [...f.colors, { name: colorName.trim(), hex: colorHex }] }));
      setColorName('');
      setColorHex('#000000');
    }
  }

  function removeColor(index) {
    setForm(f => ({ ...f, colors: f.colors.filter((_, i) => i !== index) }));
  }

  function handleFiles(e) {
    const files = Array.from(e.target.files);
    setNewFiles(prev => [...prev, ...files]);
  }

  function removeNewFile(index) {
    setNewFiles(prev => prev.filter((_, i) => i !== index));
  }

  async function removeExistingImage(img) {
    // Delete from storage
    const path = img.image_url.split('/storage/v1/object/public/products/')[1];
    if (path) {
      await supabase.storage.from('products').remove([path]);
    }
    // Delete from DB
    await supabase.from('product_images').delete().eq('id', img.id);
    setExistingImages(prev => prev.filter(i => i.id !== img.id));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      let productDbId;

      if (isEditing) {
        // Update product
        const { error: updateErr } = await supabase
          .from('products')
          .update({
            product_id: form.product_id,
            name_en: form.name_en,
            name_ar: form.name_ar,
            description_en: form.description_en,
            description_ar: form.description_ar,
            category_id: form.category_id || null,
            material_en: form.material_en,
            material_ar: form.material_ar,
            sizes: form.sizes,
            moq: form.moq,
            colors: form.colors,
            is_new: form.is_new,
            is_hot: form.is_hot,
            is_published: form.is_published,
            sort_order: form.sort_order,
          })
          .eq('id', product.id);

        if (updateErr) throw updateErr;
        productDbId = product.id;
      } else {
        // Insert product
        const { data: newProduct, error: insertErr } = await supabase
          .from('products')
          .insert({
            product_id: form.product_id,
            name_en: form.name_en,
            name_ar: form.name_ar,
            description_en: form.description_en,
            description_ar: form.description_ar,
            category_id: form.category_id || null,
            material_en: form.material_en,
            material_ar: form.material_ar,
            sizes: form.sizes,
            moq: form.moq,
            colors: form.colors,
            is_new: form.is_new,
            is_hot: form.is_hot,
            is_published: form.is_published,
            sort_order: form.sort_order,
          })
          .select()
          .single();

        if (insertErr) throw insertErr;
        productDbId = newProduct.id;
      }

      // Upload new images
      if (newFiles.length > 0) {
        setUploading(true);
        const startOrder = existingImages.length;

        for (let i = 0; i < newFiles.length; i++) {
          const file = newFiles[i];
          const ext = file.name.split('.').pop();
          const fileName = `${productDbId}/${Date.now()}-${i}.${ext}`;

          const { error: uploadErr } = await supabase.storage
            .from('products')
            .upload(fileName, file, { cacheControl: '3600', upsert: false });

          if (uploadErr) throw uploadErr;

          const { data: urlData } = supabase.storage
            .from('products')
            .getPublicUrl(fileName);

          const publicUrl = urlData?.publicUrl;
          if (!publicUrl) throw new Error('Failed to get public URL for uploaded image');

          await supabase.from('product_images').insert({
            product_id: productDbId,
            image_url: publicUrl,
            sort_order: startOrder + i,
          });
        }
        setUploading(false);
      }

      router.push('/admin/products');
      router.refresh();
    } catch (err) {
      setError(err.message || 'Something went wrong');
      setSaving(false);
      setUploading(false);
    }
  }

  const inputCls = 'w-full px-4 py-3 border border-brand-border rounded-xl text-sm focus:outline-none focus:border-brand-gold transition-colors';
  const labelCls = 'block text-xs text-brand-light mb-2 uppercase tracking-wide font-medium';

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl">
      {error && <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl">{error}</div>}

      {/* Basic Info */}
      <div className="bg-white rounded-2xl p-6 shadow-sm space-y-5">
        <h3 className="font-medium text-lg mb-2">Basic Info</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className={labelCls}>Product ID *</label>
            <input type="text" required value={form.product_id} onChange={e => setForm(f => ({ ...f, product_id: e.target.value }))} className={inputCls} placeholder="e.g. KR1075" />
          </div>
          <div>
            <label className={labelCls}>Category</label>
            <select value={form.category_id} onChange={e => setForm(f => ({ ...f, category_id: e.target.value }))} className={inputCls}>
              <option value="">— Select —</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name_en}</option>)}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className={labelCls}>Name (English) *</label>
            <input type="text" required value={form.name_en} onChange={e => setForm(f => ({ ...f, name_en: e.target.value }))} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Name (Arabic)</label>
            <input type="text" value={form.name_ar} onChange={e => setForm(f => ({ ...f, name_ar: e.target.value }))} className={inputCls} dir="rtl" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className={labelCls}>Description (English)</label>
            <textarea value={form.description_en} onChange={e => setForm(f => ({ ...f, description_en: e.target.value }))} className={inputCls} rows={3} />
          </div>
          <div>
            <label className={labelCls}>Description (Arabic)</label>
            <textarea value={form.description_ar} onChange={e => setForm(f => ({ ...f, description_ar: e.target.value }))} className={inputCls} rows={3} dir="rtl" />
          </div>
        </div>
      </div>

      {/* Specs */}
      <div className="bg-white rounded-2xl p-6 shadow-sm space-y-5">
        <h3 className="font-medium text-lg mb-2">Specifications</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className={labelCls}>Material (English)</label>
            <input type="text" value={form.material_en} onChange={e => setForm(f => ({ ...f, material_en: e.target.value }))} className={inputCls} placeholder="e.g. Faux Suede / PU" />
          </div>
          <div>
            <label className={labelCls}>Material (Arabic)</label>
            <input type="text" value={form.material_ar} onChange={e => setForm(f => ({ ...f, material_ar: e.target.value }))} className={inputCls} dir="rtl" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div>
            <label className={labelCls}>Sizes</label>
            <input type="text" value={form.sizes} onChange={e => setForm(f => ({ ...f, sizes: e.target.value }))} className={inputCls} placeholder="36-41" />
          </div>
          <div>
            <label className={labelCls}>MOQ (pairs)</label>
            <input type="text" value={form.moq} onChange={e => setForm(f => ({ ...f, moq: e.target.value }))} className={inputCls} placeholder="36" />
          </div>
          <div>
            <label className={labelCls}>Sort Order</label>
            <input type="number" value={form.sort_order} onChange={e => setForm(f => ({ ...f, sort_order: parseInt(e.target.value) || 0 }))} className={inputCls} />
          </div>
        </div>
      </div>

      {/* Colors */}
      <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
        <h3 className="font-medium text-lg mb-2">Colors</h3>
        <div className="flex gap-3 flex-wrap">
          {form.colors.map((c, i) => (
            <div key={i} className="flex items-center gap-2 bg-brand-bg-alt px-3 py-1.5 rounded-full">
              <span className="w-4 h-4 rounded-full border" style={{ backgroundColor: c.hex }} />
              <span className="text-sm">{c.name}</span>
              <button type="button" onClick={() => removeColor(i)} className="text-brand-light hover:text-red-500 text-xs ml-1 bg-transparent border-none cursor-pointer">×</button>
            </div>
          ))}
        </div>
        <div className="flex gap-3 items-end">
          <div className="flex-1">
            <label className={labelCls}>Color Name</label>
            <input type="text" value={colorName} onChange={e => setColorName(e.target.value)} className={inputCls} placeholder="e.g. Black" />
          </div>
          <div>
            <label className={labelCls}>Hex</label>
            <input type="color" value={colorHex} onChange={e => setColorHex(e.target.value)} className="w-12 h-[46px] border border-brand-border rounded-xl cursor-pointer" />
          </div>
          <button type="button" onClick={addColor} className="px-5 py-3 bg-brand-bg-alt text-sm rounded-xl hover:bg-brand-border transition-colors border-none cursor-pointer">
            Add
          </button>
        </div>
      </div>

      {/* Images */}
      <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
        <h3 className="font-medium text-lg mb-2">Images</h3>

        {/* Existing images */}
        {existingImages.length > 0 && (
          <div className="flex gap-3 flex-wrap">
            {existingImages.map(img => (
              <div key={img.id} className="relative w-24 h-24 rounded-xl overflow-hidden group">
                <img src={img.image_url} alt="" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeExistingImage(img)}
                  className="absolute inset-0 bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs cursor-pointer border-none"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}

        {/* New file previews */}
        {newFiles.length > 0 && (
          <div className="flex gap-3 flex-wrap">
            {newFiles.map((file, i) => (
              <div key={i} className="relative w-24 h-24 rounded-xl overflow-hidden group border-2 border-dashed border-brand-gold">
                <img src={URL.createObjectURL(file)} alt="" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeNewFile(i)}
                  className="absolute inset-0 bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs cursor-pointer border-none"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Upload button */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-brand-border rounded-xl p-8 text-center cursor-pointer hover:border-brand-gold transition-colors"
        >
          <p className="text-sm text-brand-muted">Click to upload images</p>
          <p className="text-xs text-brand-light mt-1">JPG, PNG, WEBP — Multiple files supported</p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFiles}
          className="hidden"
        />
      </div>

      {/* Flags */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h3 className="font-medium text-lg mb-4">Display Settings</h3>
        <div className="flex flex-wrap gap-6">
          {[
            { key: 'is_published', label: 'Published' },
            { key: 'is_new', label: 'Show in New Arrivals' },
            { key: 'is_hot', label: 'Show in Hot Sale' },
          ].map(({ key, label }) => (
            <label key={key} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form[key]}
                onChange={e => setForm(f => ({ ...f, [key]: e.target.checked }))}
                className="w-4 h-4 accent-brand-gold"
              />
              <span className="text-sm">{label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Submit */}
      <div className="flex gap-4">
        <button
          type="submit"
          disabled={saving || uploading}
          className="px-8 py-3 bg-brand-dark text-white rounded-xl text-sm font-medium hover:bg-brand-gold transition-colors disabled:opacity-50"
        >
          {uploading ? 'Uploading images...' : saving ? 'Saving...' : isEditing ? 'Update Product' : 'Create Product'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/products')}
          className="px-8 py-3 border border-brand-border rounded-xl text-sm hover:border-brand-dark transition-colors bg-transparent cursor-pointer"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
