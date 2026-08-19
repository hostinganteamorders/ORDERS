import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WasteTechSection from './WasteTechSection';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Waste-Tech - Sistem Bank Sampah Digital | ORDERS',
    description: 'Demo sistem pengelolaan bank sampah digital dari ORDERS: manajemen nasabah, timbangan setoran, reward/poin, dan dashboard laporan.',
    keywords: 'waste tech, bank sampah, sistem bank sampah, pengelolaan sampah, digital waste, ORDERS',
    alternates: {
        canonical: '/waste-tech',
    },
    openGraph: {
        title: 'Waste-Tech - Sistem Bank Sampah Digital',
        description: 'Demo dashboard sistem pengelolaan bank sampah digital',
        url: 'https://ordersapp.tech/waste-tech',
        type: 'website',
    },
};

export default function WasteTechPage() {
    return (
        <>
            <Header />
            <main>
                <WasteTechSection />
            </main>
            <Footer />
        </>
    );
}
