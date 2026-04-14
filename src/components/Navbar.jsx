'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/hooks/useLanguage';

export default function Navbar() {
  const { lang, setLang, t } = useLanguage();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-brand-bg/85 backdrop-blur-xl border-b border-black/5 transition-all">
      <div className="max-w-[1200px] mx-auto px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="font-display text-[26px] text-brand-dark no-underline">
          <span className="font-semibold text-[30px]">K</span>erenisan
        </Link>

        {/* Desktop Nav */}
        <ul className="hidden md:flex gap-9 list-none">
          {[
            { href: '/#new-arrivals', key: 'nav_new' },
            { href: '/#categories', key: 'nav_cat' },
            { href: '/#hot-sale', key: 'nav_hot' },
            { href: '/#about', key: 'nav_about' },
            { href: '/#contact', key: 'nav_contact' },
          ].map((item) => (
            <li key={item.key}>
              <Link
                href={item.href}
                className="text-[13px] text-brand-muted hover:text-brand-dark tracking-wide uppercase no-underline transition-colors relative group"
              >
                {t(item.key)}
                <span className="absolute bottom-[-4px] left-0 w-0 h-px bg-brand-gold group-hover:w-full transition-all duration-300" />
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          {/* Language Toggle */}
          <button
            onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
            className="text-[13px] text-brand-light px-4 py-1.5 border border-brand-border rounded-full hover:border-brand-gold hover:text-brand-gold transition-all bg-transparent cursor-pointer"
          >
            {lang === 'en' ? 'عربي' : 'English'}
          </button>

          {/* Mobile Toggle */}
          <button
            className="md:hidden flex flex-col gap-[5px] bg-transparent border-none cursor-pointer p-1"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <span className={`block w-6 h-[1.5px] bg-brand-dark transition-all ${mobileOpen ? 'rotate-45 translate-y-[6.5px]' : ''}`} />
            <span className={`block w-6 h-[1.5px] bg-brand-dark transition-all ${mobileOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-6 h-[1.5px] bg-brand-dark transition-all ${mobileOpen ? '-rotate-45 -translate-y-[6.5px]' : ''}`} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-brand-bg border-t border-brand-border px-6 py-6">
          {[
            { href: '/#new-arrivals', key: 'nav_new' },
            { href: '/#categories', key: 'nav_cat' },
            { href: '/#hot-sale', key: 'nav_hot' },
            { href: '/#about', key: 'nav_about' },
            { href: '/#contact', key: 'nav_contact' },
          ].map((item) => (
            <Link
              key={item.key}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className="block py-3 text-brand-muted hover:text-brand-dark text-[15px] no-underline border-b border-brand-border/50 last:border-b-0"
            >
              {t(item.key)}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
