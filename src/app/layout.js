import './globals.css';
import Script from 'next/script';

export const metadata = {
  title: 'Kerenisan — Premium Wholesale Footwear',
  description: 'Kerenisan — Premium wholesale women\'s footwear. Discover elegant sandals, slides, and heels for bulk orders.',
  keywords: 'wholesale shoes, bulk footwear, women sandals wholesale, Kerenisan',
  openGraph: {
    title: 'Kerenisan — Premium Wholesale Footwear',
    description: 'Discover elegant sandals, slides, and heels for bulk orders.',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <html lang="en" dir="ltr">
      <head>
        {gaId && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
            <Script id="ga" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${gaId}');`}
            </Script>
          </>
        )}
      </head>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
