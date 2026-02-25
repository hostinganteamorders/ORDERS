import type { Metadata } from 'next';
import './globals.css';
import FloatingActionButtons from '@/components/FloatingActionButtons';

export const metadata: Metadata = {
  title: 'ORDERS | Digital Solutions Company',
  description: 'Solusi digital terdepan untuk bisnis masa depan. Partner digital terpercaya yang menghadirkan inovasi teknologi.',
  keywords: ['digital agency', 'web development', 'app development', 'digital solutions', 'indonesia'],
  icons: {
    icon: '/logo_header.svg',
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
