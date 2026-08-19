'use client';

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

type PortfolioItem = {
    title: string;
    description: string;
    technologies: string[];
    image?: string;
    gradient?: string;
    emoji?: string;
    link?: string;
    slug?: string;
};

const portfolioItems: PortfolioItem[] = [
    {
        title: "Rumah Sampah Digital",
        description: "Aplikasi mobile untuk manajemen rumah sampah digital dengan sistem tracking dan reward.",
        technologies: ["Flutter", "Firebase", "Dart"],
        image: "/images/portofolio/RSD.png",
    },
    {
        title: "Bank Sampah Pinabetengan",
        description: "Platform digital untuk manajemen bank sampah dengan sistem pencatatan transaksi.",
        technologies: ["React Native", "Django", "Python"],
        image: "/images/portofolio/PInabengan.png",
    },
    {
        title: "Website Tanah Nyiur Lestari",
        description: "Website company profile dengan sistem informasi dan manajemen konten dinamis.",
        technologies: ["Django", "Python", "JavaScript"],
        image: "/images/portofolio/TNL.png",
    },
    {
        title: "TRC Blockchain",
        description: "Sistem manajemen sampah dengan teknologi blockchain untuk reward token.",
        technologies: ["Blockchain", "React", "Node.js"],
        image: "/images/portofolio/TRC.png",
    },
    {
        title: "Solideo Kuliner App",
        description: "Aplikasi pemesanan makanan dengan sistem real-time ordering.",
        technologies: ["Flutter", "Firebase", "Dart"],
        image: "/images/portofolio/ss_solideo.jpg",
    },
    {
        title: "Website Desa Kapoya",
        description: "Website resmi Desa Kapoya dengan sistem informasi desa dan layanan publik.",
        technologies: ["Node.js", "Express", "MongoDB"],
        image: "/images/portofolio/webdes.jpg",
    },
    {
        title: "Pharmacy Website",
        description: "Website sistem manajemen apotek dengan fitur inventory dan penjualan.",
        technologies: ["CodeIgniter", "MySQL", "PHP"],
        image: "/images/portofolio/farmasi.png",
    },
    {
        title: "Orders Management",
        description: "Sistem manajemen pesanan untuk bisnis dengan dashboard analytics.",
        technologies: ["React", "Node.js", "PostgreSQL"],
        image: "/images/portofolio/orders_management.jpg",
    },
    {
        title: "Identifikasi Nilam",
        description: "Aplikasi identifikasi tanaman nilam menggunakan teknologi AI.",
        technologies: ["Python", "TensorFlow", "Flutter"],
        image: "/images/portofolio/Identifikasi_nilam.jpg",
    },
    {
        title: "Rakit - Assembly App",
        description: "Aplikasi untuk membantu proses perakitan dengan panduan visual.",
        technologies: ["React Native", "Node.js", "MongoDB"],
        image: "/images/portofolio/rakit.png",
    },
    {
        slug: "maleosan-tours",
    title: "Maleosan Tours",
        description: "Platform wisata multilingual Sulawesi Utara dengan CMS konten, paket tour, hotel, dan transportasi.",
        technologies: ["Next.js", "TypeScript", "Prisma", "MySQL"],
        link: "https://www.maleosantoursmanado.com/",
        image: "/images/portofolio/1.png",
    },
    {
        slug: "baciraro",
    title: "Baciraro Platform",
        description: "Platform ekosistem keberlanjutan berbasis AI dengan semantic vector search dan RLS.",
        technologies: ["Next.js", "Supabase", "pgvector", "AI"],
        link: "https://www.baciraro.net/",
        image: "/images/portofolio/2.png",
    },
    {
        slug: "sentivize",
    title: "Sentivize - AI CV Analysis",
        description: "Aplikasi analisis CV dan data karyawan berbasis AI dengan scoring dan ekspor Excel.",
        technologies: ["Streamlit", "Python", "Hugging Face"],
        link: "https://github.com/AldyLoing/Sentivize",
        image: "/images/portofolio/3.png",
    },
    {
        slug: "ecometer",
    title: "EcoMeter Biogas IoT",
        description: "Sistem distribusi biogas berbasis IoT dengan blockchain untuk transparansi dan efisiensi.",
        technologies: ["IoT", "Blockchain", "Python"],
        image: "/images/portofolio/4.png",
    },
    {
        title: "TouLeos",
        description: "Aplikasi asisten belanja pasar tradisional untuk memudahkan pembeli, terutama lansia.",
        technologies: ["Mobile App", "UI/UX", "Marketplace"],
        image: "/images/portofolio/5.png",
    },
    {
        title: "Eco Vending Machine",
        description: "Mesin penukaran sampah otomatis dengan integrasi blockchain — Finalis BRIN AIDeaNation 2025.",
        technologies: ["Blockchain", "IoT", "Sustainability"],
        image: "/images/portofolio/6.png",
    },
    {
        title: "Jakarta Bersih",
        description: "Platform pilot pengelolaan dan monitoring sistem persampahan DKI Jakarta (zero waste).",
        technologies: ["Web Platform", "Data Monitoring", "AI"],
        image: "/images/portofolio/image.png",
    },
    {
        title: "Orderly Hire - AI CV Screening",
        description: "Sistem rekrutmen dengan AI screening CV: pemeringkatan kandidat, analisis data lokasi, dan alur rekrutmen otomatis.",
        technologies: ["Next.js", "Supabase", "AI"],
        gradient: 'linear-gradient(135deg, #1E88E5, #4FC3F7)',
        emoji: "🤖",
    },
    {
        title: "ClimaSense AI",
        description: "Platform prediksi cuaca berbasis AI dengan perbandingan data historis untuk pengambilan keputusan akurat.",
        technologies: ["Next.js", "AI", "Weather API"],
        gradient: 'linear-gradient(135deg, #00897B, #4DB6AC)',
        emoji: "🌦️",
    },
    {
        title: "MEDAI - Verifikasi Klaim",
        description: "Verifikasi klaim asuransi/BPJS otomatis dengan AI: ekstraksi dokumen, validasi data, dan laporan ringkas.",
        technologies: ["LLM", "Speech-to-Text", "Python"],
        gradient: 'linear-gradient(135deg, #E53935, #EF9A9A)',
        emoji: "🏥",
    },
    {
        title: "Karwanua - Monitoring Iklim",
        description: "Platform monitoring iklim dan kalkulator emisi karbon untuk kesadaran lingkungan dan pelaporan jejak karbon.",
        technologies: ["Next.js", "Carbon Analytics", "Dashboard"],
        gradient: 'linear-gradient(135deg, #2E7D32, #81C784)',
        emoji: "🌍",
    },
    {
        title: "GoldMind AI",
        description: "Dashboard sinyal trading mata uang G10 berbasis AI dengan visualisasi tren dan indikator otomatis.",
        technologies: ["Next.js", "Trading", "AI"],
        gradient: 'linear-gradient(135deg, #F9A825, #FFD54F)',
        emoji: "📈",
    },
    {
        title: "Balesin Desk",
        description: "CRM omnichannel dengan AI: kelola chat WhatsApp/Instagram, balas otomatis, dan pantau kepuasan pelanggan.",
        technologies: ["Django", "n8n", "WhatsApp API"],
        gradient: 'linear-gradient(135deg, #7B1FA2, #BA68C8)',
        emoji: "💬",
    },
    {
        title: "GUDANGKU - Inventory Medis",
        description: "Manajemen inventaris alat kesehatan dengan prediksi permintaan berbasis AI dan peringatan stok otomatis.",
        technologies: ["Web App", "AI", "Inventory"],
        gradient: 'linear-gradient(135deg, #303F9F, #7986CB)',
        emoji: "📦",
    },
    {
        title: "Pemesanan Lapangan Futsal",
        description: "Sistem pemesanan lapangan futsal online dengan penjadwalan, konfirmasi, dan manajemen pengguna.",
        technologies: ["Web", "Booking", "MySQL"],
        gradient: 'linear-gradient(135deg, #558B2F, #AED581)',
        emoji: "⚽",
    },
    {
        title: "Website Desa Toundanouw",
        description: "Sistem informasi desa untuk pelayanan publik dan transparansi informasi — program KKT Universitas Sam Ratulangi.",
        technologies: ["Web", "Sistem Informasi Desa", "PHP"],
        gradient: 'linear-gradient(135deg, #F4511E, #FFAB91)',
        emoji: "🏘️",
    },
    {
        title: "CV Rindotama Perkasa",
        description: "Website company profile perusahaan dengan halaman profil, layanan, dan kontak.",
        technologies: ["Company Profile", "Web"],
        gradient: 'linear-gradient(135deg, #455A64, #90A4AE)',
        emoji: "🏢",
    },
    {
        title: "Sentiment Analysis News",
        description: "Analisis sentimen berita Indonesia dengan visualisasi data dan dashboard interaktif.",
        technologies: ["Python", "NLP", "Visualisasi"],
        gradient: 'linear-gradient(135deg, #00838F, #4DD0E1)',
        emoji: "📰",
    },
    {
        title: "RUSDI - Bank Sampah Digital",
        description: "Aplikasi bank sampah digital dengan jadwal pickup, penukaran poin, dan login aman.",
        technologies: ["Flutter", "Firebase", "Dart"],
        gradient: 'linear-gradient(135deg, #00695C, #26A69A)',
        emoji: "♻️",
    },
    {
        title: "MatchaTime - POS Kafe",
        description: "Aplikasi kasir kafe dengan pembayaran QR dan manajemen menu.",
        technologies: ["Mobile", "POS", "QR"],
        gradient: 'linear-gradient(135deg, #AD1457, #F06292)',
        emoji: "🧋",
    },
    {
        title: "Waste-Tech - Sistem Bank Sampah",
        description: "Demo sistem pengelolaan bank sampah digital: nasabah, timbangan setoran, reward/poin, dan dashboard laporan.",
        technologies: ["Sistem Bank Sampah", "Dashboard", "Live Demo"],
        gradient: 'linear-gradient(135deg, #00695C, #26A69A)',
        emoji: "♻️",
        link: "/waste-tech",
    },
    {
        title: "EcoDigital - Inisiatif Hijau",
        description: "Ekosistem strategi teknologi digital yang selaras dengan prinsip keberlanjutan dan jejak karbon minimal.",
        technologies: ["Keberlanjutan", "Green Tech", "Live Demo"],
        gradient: 'linear-gradient(135deg, #1B5E20, #66BB6A)',
        emoji: "🌱",
        link: "/ecodigital",
    },
    {
        title: "Panel - Manajemen Tim",
        description: "Demo panel manajemen tim: dashboard, project & bagi hasil, kas, payouts, jadwal, dan rapat dalam satu sistem.",
        technologies: ["Next.js", "Supabase", "Live Demo"],
        gradient: 'linear-gradient(135deg, #303F9F, #7986CB)',
        emoji: "🛡️",
        link: "/panel",
    },
];

export default function PortfolioSection() {
    const sliderRef = useRef<HTMLDivElement>(null);
    const [activeIdx, setActiveIdx] = useState(0);

    useEffect(() => {
        const slider = sliderRef.current;
        if (!slider) return;

        const handleScroll = () => {
            const slideWidth = slider.clientWidth;
            if (slideWidth > 0) {
                // Calculate based on scroll percentage for better accuracy
                const maxScroll = slider.scrollWidth - slider.clientWidth;
                if (maxScroll > 0) {
                    const scrollFraction = slider.scrollLeft / maxScroll;
                    const newActiveIdx = Math.round(scrollFraction * (portfolioItems.length - 1));
                    setActiveIdx(Math.min(Math.max(0, newActiveIdx), portfolioItems.length - 1));
                } else {
                    setActiveIdx(0);
                }
            }
        };

        slider.addEventListener("scroll", handleScroll, { passive: true });
        // Initial call to set active index if already scrolled
        handleScroll();

        return () => slider.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToSlide = (idx: number) => {
        const slider = sliderRef.current;
        if (!slider) return;
        const slideWidth = slider.clientWidth;
        if (slideWidth > 0) {
            slider.scrollTo({
                left: idx * slideWidth,
                behavior: 'smooth'
            });
        }
    };

    return (
        <section id="portofolio" className="section bg-slate-50">
            <div className="container-content">

                {/* Mobile Slider */}
                <div className="md:hidden">
                    {/* Scroll container IS the flex container — each child = exactly 1 slide width */}
                    <div
                        ref={sliderRef}
                        className="flex overflow-x-scroll portfolio-slider-wrap"
                        style={{
                            scrollSnapType: 'x mandatory',
                            msOverflowStyle: 'none',
                            scrollbarWidth: 'none',
                        } as React.CSSProperties}
                    >
                        <style dangerouslySetInnerHTML={{ __html: `.portfolio-slider-wrap::-webkit-scrollbar { display: none; }` }} />
                        {portfolioItems.map((item, index) => (
                            <div
                                key={index}
                                className="flex-none w-full px-3"
                                style={{ scrollSnapAlign: 'start' }}
                            >
                                <PortfolioCard item={item} />
                            </div>
                        ))}
                    </div>

                    {/* Pagination Dots */}
                    <div className="flex justify-center items-center gap-2.5 mt-5 pb-10">
                        {portfolioItems.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => scrollToSlide(idx)}
                                aria-label={`Go to slide ${idx + 1}`}
                                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${activeIdx === idx
                                    ? 'bg-orange-500 scale-125 ring-4 ring-orange-500/20'
                                    : 'bg-slate-300 hover:bg-slate-400'
                                    }`}
                            />
                        ))}
                    </div>
                </div>

                {/* Desktop Grid */}
                <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {portfolioItems.map((item, index) => (
                        <PortfolioCard key={index} item={item} />
                    ))}
                </div>
            </div>
        </section>
    );
}

function PortfolioCard({ item }: { item: PortfolioItem }) {
    return (
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-slate-100 group cursor-pointer">
            {/* Image */}
            {item.image ? (
                <div className="relative h-48 bg-slate-100 overflow-hidden">
                    <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
            ) : (
                <div
                    className="relative h-48 overflow-hidden"
                    style={{ background: item.gradient }}
                >
                    <span className="absolute inset-0 flex items-center justify-center text-6xl group-hover:scale-110 transition-transform duration-500">
                        {item.emoji}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
            )}

            {/* Content */}
            <div className="p-5">
                <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-orange-500 transition-colors">
                    {item.title}
                </h3>
                <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                    {item.description}
                </p>

                {/* Technologies */}
                <div className="flex flex-wrap gap-1.5">
                    {item.technologies.map((tech, techIndex) => (
                        <span
                            key={techIndex}
                            className="bg-slate-100 text-slate-600 px-2 py-1 rounded-md text-xs font-medium"
                        >
                            {tech}
                        </span>
                    ))}
                </div>

                {/* Link */}
                {item.link && (item.link.startsWith('/') ? (
                    <Link
                        href={item.link}
                        className="inline-flex items-center gap-1 mt-4 text-xs font-semibold text-orange-500 hover:text-orange-600 transition-colors"
                    >
                        Live Demo
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                    </Link>
                ) : (
                    <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 mt-4 text-xs font-semibold text-orange-500 hover:text-orange-600 transition-colors"
                    >
                        Lihat Live
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                    </a>
                ))}

                {/* Case Study */}
                {item.slug && (
                    <Link
                        href={`/portfolio/${item.slug}`}
                        className="inline-flex items-center gap-1 mt-3 text-xs font-semibold text-slate-700 hover:text-orange-500 transition-colors"
                    >
                        Lihat Case Study
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                    </Link>
                )}
            </div>
        </div>
    );
}
