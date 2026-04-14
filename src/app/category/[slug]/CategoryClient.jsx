'use client';
import Link from 'next/link';
import { LanguageProvider, useLanguage } from '@/hooks/useLanguage';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import FadeIn from '@/components/FadeIn';
import { WhatsAppFloat } from '@/components/WhatsAppButton';

export default function CategoryClient({ category, categories, products, totalCount, currentPage, totalPages }) {
  return (
    <LanguageProvider>
      <Navbar />
      <CategoryContent
        category={category}
        categories={categories}
        products={products}
        totalCount={totalCount}
        currentPage={currentPage}
        totalPages={totalPages}
      />
      <Footer categories={categories} />
      <WhatsAppFloat />
    </LanguageProvider>
  );
}

function CategoryContent({ category, categories, products, totalCount, currentPage, totalPages }) {
  const { lang, t } = useLanguage();
  const catName = lang === 'ar' && category.name_ar ? category.name_ar : category.name_en;

  return (
    <main className="pt-24 pb-20">
      {/* Header */}
      <div className="text-center py-12 px-6">
        <FadeIn>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-light">{catName}</h1>
          <p className="text-brand-muted mt-3 font-light">
            {totalCount} {t('cat_styles')}
          </p>
        </FadeIn>
      </div>

      <div className="max-w-[1200px] mx-auto px-6">
        {/* Category Filters */}
        <FadeIn className="flex justify-center gap-3 flex-wrap mb-12">
          <Link
            href="/#categories"
            className={`px-6 py-2.5 border rounded-full text-[13px] no-underline transition-all border-brand-border text-brand-muted hover:bg-brand-dark hover:text-white hover:border-brand-dark`}
          >
            {t('cat_all')}
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/category/${cat.slug}`}
              className={`px-6 py-2.5 border rounded-full text-[13px] no-underline transition-all ${
                cat.id === category.id
                  ? 'bg-brand-dark text-white border-brand-dark'
                  : 'border-brand-border text-brand-muted hover:bg-brand-dark hover:text-white hover:border-brand-dark'
              }`}
            >
              {lang === 'ar' && cat.name_ar ? cat.name_ar : cat.name_en}
            </Link>
          ))}
        </FadeIn>

        {/* Product Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {products.map((p, i) => (
              <FadeIn key={p.id} delay={i * 60}>
                <ProductCard product={p} />
              </FadeIn>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-brand-muted">{t('no_products')}</div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-16">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Link
                key={p}
                href={`/category/${category.slug}?page=${p}`}
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm no-underline transition-all ${
                  p === currentPage
                    ? 'bg-brand-dark text-white'
                    : 'border border-brand-border text-brand-muted hover:bg-brand-dark hover:text-white hover:border-brand-dark'
                }`}
              >
                {p}
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
