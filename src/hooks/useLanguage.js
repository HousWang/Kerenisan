'use client';
import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { t as translate } from '@/lib/translations';

const LanguageContext = createContext({ lang: 'en', setLang: () => {}, t: () => '' });

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState('en');

  const setLang = useCallback((newLang) => {
    setLangState(newLang);
    document.documentElement.lang = newLang;
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
    if (typeof window !== 'undefined') {
      localStorage.setItem('kerenisan-lang', newLang);
    }
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem('kerenisan-lang');
    if (saved && (saved === 'en' || saved === 'ar')) {
      setLang(saved);
    }
  }, [setLang]);

  const t = useCallback((key) => translate(lang, key), [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
