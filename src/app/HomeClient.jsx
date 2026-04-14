'use client';
import Link from 'next/link';
import Image from 'next/image';
import { LanguageProvider, useLanguage } from '@/hooks/useLanguage';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import FadeIn from '@/components/FadeIn';
import { WhatsAppFloat, SoftPopup } from '@/components/WhatsAppButton';

export default function HomeClient({ newProducts, hotProducts, categories, bestProducts }) {
  return (
    <LanguageProvider>
      <Navbar />
      <HomeContent
        newProducts={newProducts}
        hotProducts={hotProducts}
        categories={categories}
        bestProducts={bestProducts}
      />
      <Footer categories={categories} />
      <WhatsAppFloat />
      <SoftPopup />
    </LanguageProvider>
  );
}

function HomeContent({ newProducts, hotProducts, categories, bestProducts }) {
  const { lang, t } = useLanguage();
  const waNum = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '1234567890';

  // Category gradient colors
  const catColors = [
    'from-[#E8DFD3] to-[#C8B8A4]',
    'from-[#D4C4B0] to-[#B8A08A]',
    'from-[#C0B0A0] to-[#A09080]',
    'from-[#B0A090] to-[#8A7A6A]',
    'from-[#C8B8A8] to-[#9A8A7A]',
    'from-[#D0C0B0] to-[#A89888]',
  ];

  return (
    <main>
      {/* ===== HERO ===== */}
      <section className="min-h-screen flex items-center justify-center text-center px-6 pt-24 pb-20 bg-gradient-to-b from-brand-bg to-brand-bg-alt relative overflow-hidden">
        <div className="absolute -top-[200px] -end-[200px] w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(184,149,106,0.08)_0%,transparent_70%)]" />
        <FadeIn className="max-w-[800px] relative z-10">
          <div className="text-[11px] tracking-[3px] uppercase text-brand-gold mb-8 font-medium">
            {t('hero_badge')}
          </div>
          <h1 className="font-display text-5xl sm:text-6xl lg:text-[80px] font-light leading-[1.1] text-brand-dark mb-6 tracking-tight">
            {t('hero_title_1')}<br />
            <em className="text-brand-gold">{t('hero_title_2')}</em>
          </h1>
          <p className="text-lg text-brand-muted max-w-[520px] mx-auto mb-12 font-light leading-relaxed">
            {t('hero_desc')}
          </p>
          <a
            href={`https://wa.me/${waNum}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-brand-dark text-white px-10 py-4 rounded-full text-sm font-medium tracking-wide hover:bg-brand-gold hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(184,149,106,0.3)] transition-all no-underline"
          >
            {t('hero_cta')}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="rtl:rotate-180">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </FadeIn>
      </section>

      {/* ===== NEW ARRIVALS ===== */}
      <section className="py-24 lg:py-32" id="new-arrivals">
        <div className="max-w-[1200px] mx-auto px-6">
          <FadeIn className="text-center mb-16">
            <span className="text-[11px] tracking-[3px] uppercase text-brand-gold font-medium block mb-4">
              {t('new_label')}
            </span>
            <h2 className="font-display text-4xl lg:text-5xl font-light">{t('new_title')}</h2>
            <p className="text-brand-muted mt-4">{t('new_subtitle')}</p>
          </FadeIn>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {newProducts.map((p, i) => (
              <FadeIn key={p.id} delay={i * 100}>
                <ProductCard product={p} badge={lang === 'ar' ? 'جديد' : 'New'} />
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ===== HOT SALE ===== */}
      <section id="hot-sale" className="pb-24 lg:pb-32">
        <div className="max-w-[1440px] mx-auto px-6">
          <FadeIn>
            <div className="bg-gradient-to-br from-[#F5EDE3] to-[#E8DFD3] rounded-3xl p-8 sm:p-12 lg:p-20 flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
              <div className="flex-1">
                <span className="text-[11px] tracking-[3px] uppercase text-brand-gold font-medium block mb-4">
                  {t('hot_label')}
                </span>
                <h2 className="font-display text-3xl lg:text-[42px] font-light mb-4">{t('hot_title')}</h2>
                <p className="text-brand-muted font-light leading-relaxed mb-8">{t('hot_desc')}</p>
                <a
                  href={`https://wa.me/${waNum}?text=${encodeURIComponent('Hi, I would like to request the wholesale catalog.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 px-8 py-3.5 bg-brand-dark text-white rounded-full text-[13px] font-medium hover:bg-brand-gold hover:-translate-y-0.5 transition-all no-underline"
                >
                  {t('hot_cta')}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="rtl:rotate-180">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
              <div className="flex-1 grid grid-cols-2 gap-4">
                {hotProducts.slice(0, 4).map((p) => {
                  const img = p.product_images?.[0]?.image_url;
                  return (
                    <Link
                      key={p.id}
                      href={`/product/${p.product_id}`}
                      className="aspect-square rounded-2xl overflow-hidden bg-white hover:shadow-lg transition-shadow"
                    >
                      {img ? (
                        <Image src={img} alt={p.name_en} width={300} height={300} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-brand-bg-alt to-brand-border">
                          <span className="font-display text-2xl text-brand-gold/40">{p.product_id}</span>
                        </div>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ===== CATEGORIES ===== */}
      <section className="py-24 lg:py-32" id="categories">
        <div className="max-w-[1200px] mx-auto px-6">
          <FadeIn className="text-center mb-16">
            <span className="text-[11px] tracking-[3px] uppercase text-brand-gold font-medium block mb-4">
              {t('cat_label')}
            </span>
            <h2 className="font-display text-4xl lg:text-5xl font-light">{t('cat_title')}</h2>
          </FadeIn>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
            {categories.slice(0, 8).map((cat, i) => (
              <FadeIn key={cat.id} delay={i * 100}>
                <Link
                  href={`/category/${cat.slug}`}
                  className="relative rounded-2xl overflow-hidden aspect-[3/4] group block no-underline"
                >
                  {cat.image_url ? (
                    <Image src={cat.image_url} alt={cat.name_en} fill className="object-cover transition-transform duration-600 group-hover:scale-105" />
                  ) : (
                    <div className={`absolute inset-0 bg-gradient-to-br ${catColors[i % catColors.length]} transition-transform duration-600 group-hover:scale-105`} />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/70 via-transparent to-transparent z-10" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 z-20 text-white">
                    <div className="font-display text-xl sm:text-[28px]">
                      {lang === 'ar' && cat.name_ar ? cat.name_ar : cat.name_en}
                    </div>
                    <div className="text-xs opacity-70 mt-1">{cat.count} {lang === 'ar' ? 'موديل' : 'Styles'}</div>
                  </div>
                </Link>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ===== BRAND STORY ===== */}
      <section className="bg-brand-dark text-white py-28 lg:py-36 text-center" id="about">
        <div className="max-w-[1200px] mx-auto px-6">
          <FadeIn>
            <span className="text-[11px] tracking-[3px] uppercase text-brand-gold-light font-medium block mb-4">
              {t('story_label')}
            </span>
            <h2 className="font-display text-4xl lg:text-5xl font-light max-w-[700px] mx-auto">
              {t('story_title_1')}<br />{t('story_title_2')}
            </h2>
            <p className="text-white/50 max-w-[560px] mx-auto mt-6 font-light leading-relaxed">
              {t('story_desc')}
            </p>
          </FadeIn>
          <FadeIn className="flex flex-wrap justify-center gap-12 sm:gap-20 mt-16">
            {[
              { num: '500+', key: 'stat_styles' },
              { num: '30+', key: 'stat_countries' },
              { num: '2000+', key: 'stat_retailers' },
              { num: '10+', key: 'stat_years' },
            ].map((s) => (
              <div key={s.key} className="text-center">
                <div className="font-display text-5xl font-light text-brand-gold-light">{s.num}</div>
                <div className="text-xs text-white/40 tracking-wider uppercase mt-2">{t(s.key)}</div>
              </div>
            ))}
          </FadeIn>
        </div>
      </section>

      {/* ===== BESTSELLERS ===== */}
      <section className="py-24 lg:py-32">
        <div className="max-w-[1200px] mx-auto px-6">
          <FadeIn className="text-center mb-16">
            <span className="text-[11px] tracking-[3px] uppercase text-brand-gold font-medium block mb-4">
              {t('best_label')}
            </span>
            <h2 className="font-display text-4xl lg:text-5xl font-light">{t('best_title')}</h2>
          </FadeIn>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {bestProducts.slice(0, 8).map((p, i) => (
              <FadeIn key={p.id} delay={i * 80}>
                <ProductCard product={p} />
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
