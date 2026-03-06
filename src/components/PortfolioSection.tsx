'use client';

import { useRef, useState, useEffect } from "react";
import Image from "next/image";

const portfolioItems = [
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
        title: "Project 1",
        description: "Solusi digital custom untuk kebutuhan bisnis.",
        technologies: ["React", "Tailwind", "Node.js"],
        image: "/images/portofolio/1.png",
    },
    {
        title: "Project 2",
        description: "Platform digital dengan fitur lengkap dan modern.",
        technologies: ["Next.js", "TypeScript", "Prisma"],
        image: "/images/portofolio/2.png",
    },
    {
        title: "Project 3",
        description: "Aplikasi web responsif dengan UI/UX terbaik.",
        technologies: ["Vue.js", "Vuetify", "Firebase"],
        image: "/images/portofolio/3.png",
    },
    {
        title: "Project 4",
        description: "Sistem informasi terintegrasi untuk enterprise.",
        technologies: ["Angular", "Spring Boot", "MySQL"],
        image: "/images/portofolio/4.png",
    },
    {
        title: "Project 5",
        description: "Mobile app cross-platform dengan performa tinggi.",
        technologies: ["Flutter", "Dart", "Firebase"],
        image: "/images/portofolio/5.png",
    },
    {
        title: "Project 6",
        description: "Website e-commerce dengan fitur pembayaran lengkap.",
        technologies: ["Laravel", "Vue.js", "Stripe"],
        image: "/images/portofolio/6.png",
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

function PortfolioCard({ item }: { item: typeof portfolioItems[0] }) {
    return (
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-slate-100 group cursor-pointer">
            {/* Image */}
            <div className="relative h-48 bg-slate-100 overflow-hidden">
                <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

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
            </div>
        </div>
    );
}
