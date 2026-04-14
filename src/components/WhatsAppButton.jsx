'use client';
import { useState, useEffect } from 'react';
import { useLanguage } from '@/hooks/useLanguage';

const WA_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '1234567890';

export function WhatsAppFloat() {
  const { t } = useLanguage();

  return (
    <a
      href={`https://wa.me/${WA_NUMBER}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-8 end-8 z-50 w-[60px] h-[60px] bg-[#25D366] rounded-full flex items-center justify-center shadow-[0_6px_24px_rgba(37,211,102,0.4)] hover:scale-110 hover:shadow-[0_8px_32px_rgba(37,211,102,0.5)] transition-all group"
      aria-label="WhatsApp"
    >
      <WhatsAppIcon />
      <span className="absolute end-[72px] top-1/2 -translate-y-1/2 bg-white text-brand-dark px-4 py-2.5 rounded-xl text-[13px] whitespace-nowrap shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity">
        {t('wa_tooltip')}
      </span>
    </a>
  );
}

export function SoftPopup() {
  const { t } = useLanguage();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), 20000);
    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  return (
    <div className={`fixed bottom-[104px] end-8 z-40 bg-white rounded-2xl p-7 w-80 shadow-[0_20px_60px_rgba(0,0,0,0.12)] transition-all duration-500 ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5 pointer-events-none'}`}>
      <button
        onClick={() => setShow(false)}
        className="absolute top-3 end-3 w-7 h-7 rounded-full bg-brand-bg-alt flex items-center justify-center text-brand-light text-sm border-none cursor-pointer hover:bg-brand-border"
      >
        ×
      </button>
      <h3 className="font-display text-[22px] mb-2">{t('wa_popup_title')}</h3>
      <p className="text-sm text-brand-muted leading-relaxed mb-5">{t('wa_popup_desc')}</p>
      <a
        href={`https://wa.me/${WA_NUMBER}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2.5 w-full py-3.5 bg-[#25D366] hover:bg-[#1FB855] text-white rounded-full text-sm font-semibold no-underline transition-all"
      >
        <WhatsAppIcon size={18} />
        {t('wa_popup_cta')}
      </a>
    </div>
  );
}

function WhatsAppIcon({ size = 30 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="white">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a1.3 1.3 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.612.638l4.687-1.228A11.953 11.953 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.319 0-4.476-.663-6.316-1.81l-.44-.27-3.266.856.87-3.18-.296-.47A9.935 9.935 0 012 12C2 6.486 6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z" />
    </svg>
  );
}
