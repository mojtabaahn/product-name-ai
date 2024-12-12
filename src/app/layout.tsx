import './globals.css'
import type { Metadata } from 'next'
import Script from 'next/script'

export const metadata: Metadata = {
  title: 'نام‌گذاری هوشمند محصول',
  description: 'با کمک هوش مصنوعی، نام‌های خلاقانه برای محصولات خود بسازید',
  icons: {
    icon: [
      { url: './logo.svg', type: 'image/svg+xml' },
    ],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fa" dir="rtl">
      <head>
        <Script id="microsoft-clarity">
          {`
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "pcrq10id4v");
          `}
        </Script>
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-Q5BLZ8PESR" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-Q5BLZ8PESR');
          `}
        </Script>
      </head>
      <body className="bg-gray-50">{children}</body>
    </html>
  )
}
