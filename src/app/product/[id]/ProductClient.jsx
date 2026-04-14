'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { LanguageProvider, useLanguage } from '@/hooks/useLanguage';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import FadeIn from '@/components/FadeIn';
import { WhatsAppFloat } from '@/components/WhatsAppButton';

export default function ProductClient({ product, related, categories }) {
  return (
    <LanguageProvider>
      <Navbar />
      <ProductContent product={product} related={related} />
      <Footer categories={categories} />
      <WhatsAppFloat />
    </LanguageProvider>
  );
}

function ProductContent({ product, related }) {
  const { lang, t } = useLanguage();
  const [activeImg, setActiveImg] = useState(0);
  const waNum = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '1234567890';

  const name = lang === 'ar' && product.name_ar ? product.name_ar : product.name_en;
  const desc = lang === 'ar' && product.description_ar ? product.description_ar : product.description_en;
  const material = lang === 'ar' && product.material_ar ? product.material_ar : product.material_en;
  const images = product.product_images || [];
  const colors = product.colors || [];
  const catName = product.categories
    ? (lang === 'ar' && product.categories.name_ar ? product.categories.name_ar : product.categories.name_en)
    : '';

  const waMessage = encodeURIComponent(`Hi, I'm interested in wholesale pricing for product ${product.product_id} — ${product.name_en}`);

  return (
    <main className="pt-20">
      {/* Breadcrumb */}
      <div className="max-w-[1200px] mx-auto px-6 py-4">
        <div className="flex items-center gap-2 text-sm text-brand-light">
          <Link href="/" className="hover:text-brand-dark no-underline text-brand-light">
            {lang === 'ar' ? 'الرئيسية' : 'Home'}
          </Link>
          <span>/</span>
          {product.categories && (
            <>
              <Link href={`/category/${product.categories.slug}`} className="hover:text-brand-dark no-underline text-brand-light">
                {catName}
              </Link>
              <span>/</span>
            </>
          )}
          <span className="text-brand-dark">{product.product_id}</span>
        </div>
      </div>

      {/* Product Detail */}
      <div className="max-w-[1200px] mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Gallery */}
          <FadeIn>
            <div className="bg-brand-bg-alt rounded-3xl p-4 sm:p-8">
              {/* Main Image */}
              <div className="aspect-square rounded-2xl overflow-hidden bg-white mb-3">
                {images[activeImg] ? (
                  <Image
                    src={images[activeImg].image_url}
                    alt={name}
                    width={800}
                    height={800}
                    className="w-full h-full object-cover"
                    priority
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-brand-bg-alt to-brand-border">
                    <span className="font-display text-6xl text-brand-gold/30">{product.product_id}</span>
                  </div>
                )}
              </div>
              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {images.map((img, i) => (
                    <button
                      key={img.id}
                      onClick={() => setActiveImg(i)}
                      className={`w-16 h-16 shrink-0 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                        i === activeImg ? 'border-brand-gold' : 'border-transparent hover:border-brand-gold/50'
                      }`}
                    >
                      <Image
                        src={img.image_url}
                        alt={`${name} ${i + 1}`}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </FadeIn>

          {/* Info */}
          <FadeIn delay={100}>
            <div className="py-4 lg:py-8">
              <div className="text-xs text-brand-light tracking-[2px] uppercase mb-3">
                Product ID: {product.product_id}
              </div>
              <h1 className="font-display text-3xl sm:text-4xl font-light mb-5 leading-tight">{name}</h1>
              {desc && (
                <p className="text-brand-muted font-light leading-relaxed mb-8">{desc}</p>
              )}

              {/* Specs */}
              <div className="mb-8 border-t border-brand-border">
                {material && (
                  <div className="flex justify-between py-3 border-b border-brand-border text-sm">
                    <span className="text-brand-light">{t('spec_material')}</span>
                    <span className="font-medium">{material}</span>
                  </div>
                )}
                <div className="flex justify-between py-3 border-b border-brand-border text-sm">
                  <span className="text-brand-light">{t('spec_sizes')}</span>
                  <span className="font-medium">{product.sizes || '36 — 41'}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-brand-border text-sm">
                  <span className="text-brand-light">{t('spec_moq')}</span>
                  <span className="font-medium">{product.moq || '36'} {lang === 'ar' ? 'زوج / لون' : 'Pairs / Color'}</span>
                </div>
              </div>

              {/* Colors */}
              {colors.length > 0 && (
                <div className="mb-10">
                  <div className="text-sm text-brand-light mb-3">{t('detail_colors')}</div>
                  <div className="flex gap-3">
                    {colors.map((c, i) => (
                      <span
                        key={i}
                        className="w-8 h-8 rounded-full border-2 border-brand-border"
                        style={{ backgroundColor: c.hex }}
                        title={c.name}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* WhatsApp CTA */}
              <a
                href={`https://wa.me/${waNum}?text=${waMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 w-full py-4.5 bg-[#25D366] hover:bg-[#1FB855] text-white rounded-full text-[15px] font-semibold no-underline hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(37,211,102,0.3)] transition-all"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a1.3 1.3 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                </svg>
                {t('detail_cta')}
              </a>
              <p className="text-center text-xs text-brand-light mt-4">{t('detail_note')}</p>
            </div>
          </FadeIn>
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <section className="py-20 bg-brand-bg-alt/50">
          <div className="max-w-[1200px] mx-auto px-6">
            <h2 className="font-display text-3xl font-light text-center mb-12">
              {lang === 'ar' ? 'منتجات مشابهة' : 'You May Also Like'}
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
