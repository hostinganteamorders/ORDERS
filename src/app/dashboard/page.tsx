'use client';

import Header from '@/components/Header';
import AboutSection from '@/components/AboutSection';
import ServicesSection from '@/components/ServicesSection';
import Footer from '@/components/Footer';

export default function DashboardPage() {
    return (
        <>
            <Header />            {/* Main Content */}
            <main>
                {/* About Section */}


                {/* Services Section */}
                <ServicesSection showCTA={true} />
            </main>            <Footer />
        </>
    );
}
