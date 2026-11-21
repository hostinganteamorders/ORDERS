import type { Metadata } from 'next';
import './globals.css';
import { Plus_Jakarta_Sans } from 'next/font/google';
import FloatingActionButtons from '@/components/FloatingActionButtons';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-jakarta',
});

export const metadata: Metadata = {
  title: 'ORDERS Manado | Digital Solutions Company',
  description: 'ORDERS Manado - Solusi digital terdepan untuk bisnis masa depan di Manado dan sekitarnya. Partner digital terpercaya yang menghadirkan inovasi teknologi, web development, dan digital marketing.',
  keywords: [
    'Orders Manado',
    'Orders Manado digital agency',
    'digital agency Manado',
    'web development Manado',
    'app development Manado',
    'jasa pembuatan website Manado',
    'solusi digital Manado',
    'tech company Manado',
    'Orders digital solutions'
  ],
  authors: [{ name: 'Orders Manado' }],
  creator: 'Orders Manado',
  publisher: 'Orders Manado',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: '/logo_header.svg',
    apple: '/logo_header.svg',
  },
  openGraph: {
    title: 'ORDERS Manado | Digital Solutions Company',
    description: 'Solusi digital terdepan untuk bisnis masa depan di Manado dan sekitarnya. Partner teknologi terpercaya Anda.',
    url: 'https://ordersmanado.com',
    siteName: 'ORDERS Manado',
    locale: 'id_ID',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ORDERS Manado | Digital Solutions',
    description: 'Partner digital terpercaya yang menghadirkan inovasi teknologi di Manado.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`scroll-smooth ${jakarta.variable}`}>
      <body className="font-sans antialiased bg-background text-foreground">
        {children}
        <FloatingActionButtons />
      </body>
    </html>
  );
}
