'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/hooks/useLanguage';

export default function ProductCard({ product, badge }) {
  const { lang } = useLanguage();
  const name = lang === 'ar' && product.name_ar ? product.name_ar : product.name_en;
  const firstImage = product.product_images?.[0]?.image_url;
  const colors = product.colors || [];

  return (
    <Link
      href={`/product/${product.product_id}`}
      className="group block bg-white rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)] no-underline text-inherit"
    >
      {/* Image */}
      <div className="relative pt-[110%] overflow-hidden bg-brand-bg-alt">
        {firstImage ? (
          <Image
            src={firstImage}
            alt={name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover transition-transform duration-600 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-brand-bg-alt to-brand-border">
            <span className="font-display text-4xl text-brand-gold/30">{product.product_id}</span>
          </div>
        )}
        {badge && (
          <span className="absolute top-4 start-4 bg-brand-gold text-white text-[10px] tracking-wider uppercase px-3.5 py-1.5 rounded-full font-medium">
            {badge}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-5">
        <div className="text-[11px] text-brand-light tracking-wider uppercase mb-1">
          {product.product_id}
        </div>
        <div className="font-display text-xl mb-2">{name}</div>
        {colors.length > 0 && (
          <div className="flex gap-1.5 mt-3">
            {colors.map((c, i) => (
              <span
                key={i}
                className="w-3.5 h-3.5 rounded-full border border-brand-border"
                style={{ backgroundColor: c.hex }}
                title={c.name}
              />
            ))}
          </div>
        )}
        <div className="flex items-center gap-2 mt-4 text-[12px] text-brand-gold font-medium opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          <WhatsAppMini />
          {lang === 'ar' ? 'استفسر عبر واتساب' : 'Inquire on WhatsApp'}
        </div>
      </div>
    </Link>
  );
}

function WhatsAppMini() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a1.3 1.3 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
    </svg>
  );
}
