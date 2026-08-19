import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PanelSection from './PanelSection';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Panel Manajemen Tim | ORDERS',
    description: 'Demo panel manajemen tim ORDERS: dashboard, project & bagi hasil, kas & transaksi, payouts, jadwal, dan rapat dalam satu sistem.',
    keywords: 'panel manajemen tim, manajemen project, payout, bagi hasil, keuangan tim, SaaS, ORDERS',
    alternates: {
        canonical: '/panel',
    },
    openGraph: {
        title: 'Panel Manajemen Tim ORDERS',
        description: 'Kelola project, keuangan, dan tim dalam satu sistem',
        url: 'https://ordersapp.tech/panel',
        type: 'website',
    },
};

export default function PanelPage() {
    return (
        <>
            <Header />
            <main>
                <PanelSection />
            </main>
            <Footer />
        </>
    );
}
