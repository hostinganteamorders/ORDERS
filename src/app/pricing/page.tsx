'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import PricingSection, { HostingSection } from '@/components/PricingSection';
import Footer from '@/components/Footer';


export default function PricingPage() {
    const [openFAQ, setOpenFAQ] = useState<number | null>(null);

    const faqData = [
        {
            question: "Apakah biaya maintenance wajib?",
            answer: "Biaya maintenance bersifat opsional. Namun, kami merekomendasikan untuk menjaga performa dan keamanan website Anda."
        },
        {
            question: "Apa saja yang termasuk dalam biaya maintenance?",
            answer: "Biaya maintenance mencakup update konten, backup rutin, monitoring keamanan, dan dukungan teknis. Tidak termasuk penambahan fitur baru."
        },
        {
            question: "Berapa lama proses pengembangan aplikasi mobile?",
            answer: "Bronze: 2-4 minggu, Silver: 4-6 minggu, Gold: 6-10 minggu, tergantung kompleksitas dan revisi yang diminta."
        },
        {
            question: "Apakah hosting sudah termasuk dalam paket website?",
            answer: "Paket Starter dan Company sudah termasuk domain dan hosting untuk tahun pertama. Untuk paket lain, hosting dihitung terpisah; lihat section \"Paket Hosting\" dengan harga mulai dari Rp 150.000 untuk 3 bulan."
        },
        {
            question: "Bagaimana proses revisi dilakukan?",
            answer: "Revisi dilakukan melalui konsultasi langsung dengan tim kami. Setiap paket memiliki batas revisi yang berbeda sesuai dengan ketentuan."
        },
        {
            question: "Apakah tersedia layanan konsultasi gratis?",
            answer: "Ya! Kami menyediakan konsultasi gratis untuk membantu Anda memilih paket yang sesuai dengan kebutuhan bisnis Anda."
        }
    ];

    const toggleFAQ = (index: number) => {
        setOpenFAQ(openFAQ === index ? null : index);
    }; return (
        <>
            <Header />            {/* Main Content */}            <main className="pt-20">                {/* Use existing PricingSection component */}
                <PricingSection />

                {/* Hosting Section */}
                <HostingSection />

                {/* FAQ Section */}
                <section className="py-20 bg-white">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-[#061E44] mb-4">
                                Frequently Asked Questions
                            </h2>
                            <p className="text-gray-600 max-w-2xl mx-auto">
                                Pertanyaan yang sering diajukan tentang paket dan layanan kami
                            </p>
                        </div>                        <div className="max-w-3xl mx-auto space-y-4">
                            {faqData.map((faq, index) => (
                                <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                                    <button
                                        onClick={() => toggleFAQ(index)}
                                        className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
                                    >
                                        <h3 className="font-semibold text-[#061E44] pr-4">
                                            {faq.question}
                                        </h3>
                                        <svg
                                            className={`w-5 h-5 text-gray-500 transition-transform duration-200 flex-shrink-0 ${openFAQ === index ? 'rotate-180' : ''
                                                }`}
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openFAQ === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                                        }`}>
                                        <div className="px-6 pb-4">
                                            <p className="text-gray-600 leading-relaxed">
                                                {faq.answer}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}                        </div>
                    </div>
                </section>
            </main>

            <Footer />

        </>
    );
}
