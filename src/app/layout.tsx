import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'نام‌گذاری هوشمند محصول | Basalam',
  description: 'با کمک هوش مصنوعی، نام‌های خلاقانه برای محصولات خود در باسلام بسازید',
  icons: {
    icon: [
      { url: '/logo.svg', type: 'image/svg+xml' },
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
      <body className="bg-gray-50">{children}</body>
    </html>
  )
}
