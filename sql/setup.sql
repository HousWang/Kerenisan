-- ============================================
-- KERENISAN — Supabase Database Setup
-- Run this in the Supabase SQL Editor
-- ============================================

-- 1. Categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name_en TEXT NOT NULL,
  name_ar TEXT NOT NULL DEFAULT '',
  slug TEXT NOT NULL UNIQUE,
  description_en TEXT DEFAULT '',
  description_ar TEXT DEFAULT '',
  image_url TEXT DEFAULT '',
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Products table
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id TEXT NOT NULL UNIQUE,          -- e.g. KR1075, JX21
  name_en TEXT NOT NULL,
  name_ar TEXT NOT NULL DEFAULT '',
  description_en TEXT DEFAULT '',
  description_ar TEXT DEFAULT '',
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  material_en TEXT DEFAULT '',
  material_ar TEXT DEFAULT '',
  sizes TEXT DEFAULT '36-41',
  moq TEXT DEFAULT '36',
  colors JSONB DEFAULT '[]',                -- [{name:"Black", hex:"#1D1D1F"}, ...]
  is_new BOOLEAN DEFAULT FALSE,
  is_hot BOOLEAN DEFAULT FALSE,
  is_published BOOLEAN DEFAULT TRUE,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Product images table
CREATE TABLE IF NOT EXISTS product_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Auto-update updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- 5. Indexes for performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_is_new ON products(is_new) WHERE is_new = TRUE;
CREATE INDEX IF NOT EXISTS idx_products_is_hot ON products(is_hot) WHERE is_hot = TRUE;
CREATE INDEX IF NOT EXISTS idx_products_published ON products(is_published) WHERE is_published = TRUE;
CREATE INDEX IF NOT EXISTS idx_product_images_product ON product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);

-- 6. Row Level Security (RLS)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public can read categories"
  ON categories FOR SELECT USING (true);

CREATE POLICY "Public can read published products"
  ON products FOR SELECT USING (is_published = true);

CREATE POLICY "Public can read product images"
  ON product_images FOR SELECT USING (true);

-- Authenticated (admin) write access
CREATE POLICY "Admin insert categories"
  ON categories FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admin update categories"
  ON categories FOR UPDATE USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admin delete categories"
  ON categories FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Admin insert products"
  ON products FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admin update products"
  ON products FOR UPDATE USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admin delete products"
  ON products FOR DELETE USING (auth.role() = 'authenticated');
CREATE POLICY "Admin read all products"
  ON products FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admin insert product_images"
  ON product_images FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admin update product_images"
  ON product_images FOR UPDATE USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admin delete product_images"
  ON product_images FOR DELETE USING (auth.role() = 'authenticated');

-- 7. Storage bucket for product images
-- Run this separately or create via Supabase dashboard:
-- Go to Storage > New Bucket > Name: "products" > Public: ON

-- 8. Seed some initial categories
INSERT INTO categories (name_en, name_ar, slug, sort_order) VALUES
  ('Flat Slides', 'شباشب مسطحة', 'flat-slides', 1),
  ('Wedge Platforms', 'منصات ويدج', 'wedge-platforms', 2),
  ('Low Heel Mules', 'ميول بكعب منخفض', 'low-heel-mules', 3),
  ('Espadrilles', 'إسبادريل', 'espadrilles', 4),
  ('High Heels', 'كعب عالي', 'high-heels', 5),
  ('Loafers', 'لوفرز', 'loafers', 6)
ON CONFLICT (slug) DO NOTHING;
