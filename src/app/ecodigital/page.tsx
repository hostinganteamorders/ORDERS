import Header from '@/components/Header';
import Footer from '@/components/Footer';
import EcodigitalSection from '@/components/EcodigitalSection';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'EcoDigital Initiative - Sustainable Technology Solutions | ORDERS',
    description: 'Join ORDERS EcoDigital initiative - sustainable technology solutions, circular economy platform, AI-powered environmental analytics, and green career opportunities in digital transformation.',
    keywords: 'ecodigital, sustainable technology, circular economy, environmental analytics, green technology, digital transformation, ORDERS',
    alternates: {
        canonical: '/ecodigital',
    },
    openGraph: {
        title: 'EcoDigital Initiative - Sustainable Technology Solutions',
        description: 'Sustainable technology solutions for environmental impact and circular economy platform',
        url: 'https://ordersapp.tech/ecodigital',
        type: 'website',
        images: [
            {
                url: 'https://ordersapp.tech/images/ecosistem/Baciraro_ecosistem.jpg',
                width: 1200,
                height: 630,
                alt: 'ORDERS EcoDigital Initiative',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'EcoDigital Initiative - Sustainable Technology Solutions',
        description: 'Sustainable technology solutions for environmental impact',
        images: ['https://ordersapp.tech/images/ecosistem/Baciraro_ecosistem.jpg'],
    },
};

export default function EcodigitalPage() {
    return (
        <>
            <Header />
            <main>
                <EcodigitalSection />
            </main>
            <Footer />
        </>
    );
}
