'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase';

export default function AdminLayout({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setLoading(false);
      if (!user && !isLoginPage) router.push('/admin/login');
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (!session?.user && !isLoginPage) router.push('/admin/login');
    });

    return () => subscription.unsubscribe();
  }, [router, isLoginPage]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (isLoginPage) return children;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#F5F5F7]">
      <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] min-h-screen">
        {/* Sidebar */}
        <aside className="hidden lg:block bg-white border-e border-brand-border">
          <div className="p-6 border-b border-brand-border">
            <Link href="/admin" className="font-display text-xl no-underline text-brand-dark">
              <span className="font-semibold">K</span>erenisan
            </Link>
            <div className="text-[11px] text-brand-light tracking-wider uppercase mt-1">Admin Panel</div>
          </div>
          <nav className="py-4">
            {[
              { href: '/admin', label: 'Dashboard', icon: '□' },
              { href: '/admin/products', label: 'Products', icon: '◇' },
              { href: '/admin/categories', label: 'Categories', icon: '≡' },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-6 py-3 text-sm no-underline transition-colors ${
                  pathname === item.href
                    ? 'bg-brand-bg-alt text-brand-dark border-e-[3px] border-brand-gold'
                    : 'text-brand-muted hover:bg-brand-bg-alt hover:text-brand-dark'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="absolute bottom-0 left-0 w-[240px] p-4 border-t border-brand-border">
            <button
              onClick={async () => {
                const supabase = createClient();
                await supabase.auth.signOut();
                router.push('/admin/login');
              }}
              className="w-full text-start text-sm text-brand-light hover:text-red-500 transition-colors bg-transparent border-none cursor-pointer px-2 py-2"
            >
              Sign Out
            </button>
          </div>
        </aside>

        {/* Main */}
        <main className="p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
