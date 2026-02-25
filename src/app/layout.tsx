import type { Metadata } from 'next';
import './globals.css';
import FloatingActionButtons from '@/components/FloatingActionButtons';

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
    <html lang="id" className="scroll-smooth">
      <body className="font-body antialiased bg-background text-foreground">
        {children}
        <FloatingActionButtons />
      </body>
    </html>
  );
}
