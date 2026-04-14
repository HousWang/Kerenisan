'use client';
import Link from 'next/link';
import { useLanguage } from '@/hooks/useLanguage';

export default function Footer({ categories = [] }) {
  const { lang, t } = useLanguage();

  return (
    <footer className="bg-brand-dark text-white/60 pt-20 pb-10" id="contact">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-16">
          {/* Brand */}
          <div>
            <div className="font-display text-[28px] text-white mb-4">
              <span className="font-semibold">K</span>erenisan
            </div>
            <p className="text-sm leading-relaxed max-w-[300px]">{t('footer_desc')}</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white text-xs tracking-[2px] uppercase mb-5 font-medium">{t('footer_links')}</h4>
            <ul className="list-none space-y-3">
              <li><Link href="/#new-arrivals" className="text-white/50 hover:text-brand-gold-light text-sm no-underline transition-colors">{t('nav_new')}</Link></li>
              <li><Link href="/#categories" className="text-white/50 hover:text-brand-gold-light text-sm no-underline transition-colors">{t('nav_cat')}</Link></li>
              <li><Link href="/#hot-sale" className="text-white/50 hover:text-brand-gold-light text-sm no-underline transition-colors">{t('nav_hot')}</Link></li>
              <li><Link href="/#about" className="text-white/50 hover:text-brand-gold-light text-sm no-underline transition-colors">{t('nav_about')}</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-white text-xs tracking-[2px] uppercase mb-5 font-medium">{t('footer_cat')}</h4>
            <ul className="list-none space-y-3">
              {categories.map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/category/${cat.slug}`}
                    className="text-white/50 hover:text-brand-gold-light text-sm no-underline transition-colors"
                  >
                    {lang === 'ar' && cat.name_ar ? cat.name_ar : cat.name_en}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white text-xs tracking-[2px] uppercase mb-5 font-medium">{t('footer_contact')}</h4>
            <ul className="list-none space-y-3">
              <li>
                <a
                  href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '1234567890'}`}
                  className="text-white/50 hover:text-brand-gold-light text-sm no-underline transition-colors"
                  target="_blank" rel="noopener noreferrer"
                >
                  WhatsApp
                </a>
              </li>
              <li>
                <a href="mailto:info@kerenisan.com" className="text-white/50 hover:text-brand-gold-light text-sm no-underline transition-colors">
                  info@kerenisan.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/[0.08] pt-8 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs">
          <span>© 2025 Kerenisan. {t('footer_rights')}</span>
          <span>{t('footer_wholesale')}</span>
        </div>
      </div>
    </footer>
  );
}
