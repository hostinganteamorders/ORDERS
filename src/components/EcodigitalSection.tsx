'use client';

import Image from 'next/image';
import Link from 'next/link';
import { InfiniteSlider } from '@/components/motion-primitives/infinite-slider';
import { ProgressiveBlur } from '@/components/motion-primitives/progressive-blur';
import {
    ArrowRight,
    CheckCircle2,
    Droplets,
    Globe,
    Leaf,
    Recycle,
    Sprout,
    TrendingUp,
    Trees,
    Wind,
    Zap,
} from 'lucide-react';
import AnimatedHeading from './ecodigital/AnimatedHeading';
import FadeIn from './ecodigital/FadeIn';

const heroKeywords = [
    { label: 'Eco-Friendly', icon: Leaf },
    { label: 'Circular Loop', icon: Recycle },
    { label: 'Green Cloud', icon: Zap },
    { label: 'IoT Tracking', icon: TrendingUp },
    { label: 'Low Carbon', icon: Wind },
    { label: 'Talenta Hijau', icon: Sprout },
    { label: 'Resource Mgt', icon: Droplets },
    { label: 'Sustainable', icon: Trees },
    { label: 'Local Impact', icon: Globe },
];

const partners = [
    { name: 'Baciraro', logo: '/images/sponsor/Baciraro.png' },
    { name: 'Tana Nyiur Lestari', logo: '/images/sponsor/TanaNyiurLestari.png' },
    { name: 'Trash Recycle Center', logo: '/images/sponsor/TrashRecycleCenter.png' },
    { name: 'ELMast', logo: '/images/sponsor/ELMAST.png' },
];

const pillars = [
    {
        number: '01',
        title: 'Circular Economy',
        description: 'Platform digital untuk pemetaan aliran limbah dan peningkatan keterlacakan material.',
        icon: Leaf,
    },
    {
        number: '02',
        title: 'Baciraro Recycle',
        description: 'Ekosistem mitra mendorong circular economy melalui data akurat dan kolaborasi lokal.',
        icon: Recycle,
    },
    {
        number: '03',
        title: 'Green Infrastructure',
        description: 'Arsitektur digital efisiensi tinggi: server hemat energi, desain ringan, jejak karbon minimal.',
        icon: Zap,
    },
    {
        number: '04',
        title: 'Talenta Hijau',
        description: 'Program mentoring untuk mempersiapkan generasi karir di ekonomi rendah karbon.',
        icon: TrendingUp,
    },
];

const ecosystemPoints = [
    'Pemetaan aliran limbah secara real-time',
    'Dashboard dampak lingkungan terukur',
    'Integrasi IoT ringan & API pelaporan',
    'Notifikasi otomatis seluruh rantai daur ulang',
];

const philosophyParagraphs = [
    'Ecodigital adalah kerangka strategis kami untuk memastikan setiap solusi teknologi yang kami bangun selaras dengan prinsip keberlanjutan. Bukan hanya soal memilih server hemat energi, tetapi bagaimana desain, arsitektur, infrastruktur, alur data, dan siklus hidup produk digital meminimalkan jejak lingkungan sekaligus memaksimalkan dampak sosial positif.',
    'Kami melihat teknologi sebagai katalis ekonomi sirkular — mendukung penelusuran material, optimasi rantai pasok, edukasi perilaku, hingga orkestrasi ekosistem daur ulang melalui data yang akurat dan dapat ditindaklanjuti.',
    'Pendekatan ini memadukan efisiensi energi, desain ringan, pengukuran emisi, serta integrasi ekosistem mitra untuk menghasilkan nilai yang terukur. Inilah jalan kami membangun masa depan digital yang regeneratif, bukan sekadar berkelanjutan.',
];

const philosophyFrames = [
    {
        src: '/images/ecosistem/p1.jpg',
        alt: 'Tim EcoDigital di lapangan',
        title: 'Desain ringan untuk operasi nyata',
    },
    {
        src: '/images/ecosistem/Menteri_1.jpg',
        alt: 'Kolaborasi keberlanjutan',
        title: 'Kolaborasi lokal dengan dampak terukur',
    },
    {
        src: '/images/ecosistem/AI_1.png',
        alt: 'Visual sistem EcoDigital',
        title: 'Data, otomasi, dan orkestrasi ekosistem',
    },
];

export default function EcodigitalSection() {
    return (
        <div className="bg-black font-sans text-white">
            <section className="relative isolate min-h-[100svh] overflow-hidden bg-black text-white">
                <video
                    className="absolute inset-0 h-full w-full object-cover"
                    src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260403_050628_c4e32401-fab4-4a27-b7a8-6e9291cd5959.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    aria-hidden="true"
                />

                <div className="relative z-10 flex min-h-[100svh] flex-col">
                    <div className="px-6 pt-24 md:px-12 md:pt-32 lg:px-16 lg:pt-36">
                        <div className="mx-auto -mr-6 flex max-w-7xl flex-nowrap gap-3 overflow-x-auto pb-2 pr-6 [scrollbar-width:none] md:mr-0 md:flex-wrap md:overflow-visible md:pb-0 md:pr-0 [&::-webkit-scrollbar]:hidden">
                            {heroKeywords.map((item, index) => {
                                const Icon = item.icon;

                                return (
                                    <FadeIn
                                        key={item.label}
                                        delay={140 + (index * 80)}
                                        duration={700}
                                    >
                                        <div className="liquid-glass inline-flex shrink-0 items-center gap-2 rounded-full border border-white/15 px-3.5 py-2 text-xs text-white/95 shadow-[0_12px_40px_rgba(0,0,0,0.28)] sm:px-4 sm:text-sm">
                                            <Icon className="h-4 w-4 text-emerald-300" />
                                            <span>{item.label}</span>
                                        </div>
                                    </FadeIn>
                                );
                            })}
                        </div>
                    </div>

                    <div className="flex-1 px-6 md:px-12 lg:px-16">
                        <div className="mx-auto flex h-full max-w-7xl flex-col justify-end pb-12 lg:pb-16">
                            <div className="lg:grid lg:grid-cols-[minmax(0,1.15fr)_minmax(280px,0.85fr)] lg:items-end lg:gap-12">
                                <div className="max-w-3xl drop-shadow-[0_10px_28px_rgba(0,0,0,0.4)]">
                                    <FadeIn delay={500} duration={1000} className="mb-5">
                                        <p className="text-xs font-medium uppercase tracking-[0.26em] text-emerald-200">
                                            EcoDigital • Inisiatif Hijau
                                        </p>
                                    </FadeIn>

                                    <AnimatedHeading
                                        text={'Teknologi Bersih.\nMasa Depan Hijau.'}
                                        className="mb-4 font-sans text-4xl font-normal leading-[0.94] text-white md:text-5xl lg:text-6xl xl:text-7xl"
                                    />

                                    <FadeIn delay={800} duration={1000} className="mb-5 max-w-2xl">
                                        <p className="text-base text-gray-300 md:text-lg">
                                            EcoDigital adalah ekosistem strategi untuk memastikan setiap solusi digital selaras dengan prinsip keberlanjutan dan jejak karbon minimal.
                                        </p>
                                    </FadeIn>

                                    <FadeIn delay={1200} duration={1000}>
                                        <div className="flex flex-wrap gap-4">
                                            <Link
                                                href="/contact"
                                                className="inline-flex w-full items-center justify-center rounded-lg bg-white px-8 py-3 font-medium text-black transition-colors hover:bg-gray-100 sm:w-auto"
                                            >
                                                Mulai Kolaborasi
                                            </Link>
                                            <Link
                                                href="#fondasi"
                                                className="liquid-glass inline-flex w-full items-center justify-center rounded-lg border border-white/20 px-8 py-3 font-medium text-white transition-colors hover:bg-white hover:text-black sm:w-auto"
                                            >
                                                Pelajari Konsep
                                            </Link>
                                        </div>
                                    </FadeIn>

                                    <FadeIn delay={1520} duration={1000} className="mt-8 max-w-2xl">
                                        <p className="text-xs uppercase tracking-[0.26em] text-white/60">
                                            Mitra Ekosistem Kami
                                        </p>
                                        <div className="mt-3 flex flex-wrap gap-2">
                                            {partners.map((partner) => (
                                                <span
                                                    key={partner.name}
                                                    className="liquid-glass rounded-full border border-white/10 px-4 py-2 text-sm text-white/88"
                                                >
                                                    {partner.name}
                                                </span>
                                            ))}
                                        </div>
                                    </FadeIn>
                                </div>

                                <div className="mt-8 flex items-end justify-start lg:mt-0 lg:justify-end">
                                    <FadeIn delay={1400} duration={1000} className="w-full max-w-md">
                                        <div className="liquid-glass rounded-2xl border border-white/20 px-6 py-5 shadow-[0_18px_50px_rgba(0,0,0,0.34)]">
                                            <p className="text-lg font-light text-white md:text-xl lg:text-2xl">
                                                Circular Economy. Green Infrastructure. Talenta Hijau.
                                            </p>
                                            <p className="mt-3 text-sm leading-6 text-gray-300">
                                                Platform ini dibangun untuk membuat dampak lingkungan menjadi transparan, kolaboratif, dan bisa ditindaklanjuti.
                                            </p>
                                        </div>
                                    </FadeIn>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="border-t border-white/10 bg-[#020302] py-8 lg:py-14">
                <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-16">
                    <div className="flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <p className="text-xs uppercase tracking-[0.26em] text-emerald-300/80">Mitra Ekosistem Kami</p>
                            <h2 className="mt-2 font-sans text-2xl font-medium tracking-[-0.04em] text-white md:text-3xl lg:text-4xl">
                                Jaringan kolaborasi yang menjaga loop keberlanjutan tetap hidup.
                            </h2>
                        </div>
                        <p className="max-w-xl text-sm leading-5 text-gray-400 lg:leading-6">
                            Baciraro, Tana Nyiur Lestari, Trash Recycle Center, dan ELMast menjadi simpul utama untuk pengumpulan data lapangan, edukasi, serta orkestrasi daur ulang bernilai.
                        </p>
                    </div>

                    <div className="relative mt-6 lg:mt-10">
                        <InfiniteSlider speedOnHover={20} speed={40} gap={112}>
                            {partners.map((partner) => (
                                <div key={partner.name} className="flex flex-col items-center gap-2">
                                    <div className="relative h-8 w-28">
                                        <Image
                                            src={partner.logo}
                                            alt={partner.name}
                                            fill
                                            className="object-contain"
                                            sizes="112px"
                                        />
                                    </div>
                                    <span className="text-xs text-gray-400">{partner.name}</span>
                                </div>
                            ))}
                        </InfiniteSlider>
                        <ProgressiveBlur
                            className="pointer-events-none absolute left-0 top-0 h-full w-20"
                            direction="left"
                            blurIntensity={1}
                        />
                        <ProgressiveBlur
                            className="pointer-events-none absolute right-0 top-0 h-full w-20"
                            direction="right"
                            blurIntensity={1}
                        />
                    </div>
                </div>
            </section>

            <section id="fondasi" className="bg-black py-10 lg:py-24">
                <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-16">
                    <div className="flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between lg:gap-4">
                        <div>
                            <p className="text-xs uppercase tracking-[0.26em] text-emerald-300/80">Fondasi EcoDigital</p>
                            <h2 className="mt-2 font-sans text-2xl font-medium tracking-[-0.04em] text-white md:text-3xl lg:mt-3 lg:text-5xl">
                                Empat Pilar Keberlanjutan
                            </h2>
                        </div>
                        <p className="max-w-xl text-sm leading-5 text-gray-400 lg:leading-6">
                            Setiap aspek platform kami dirancang untuk menghasilkan dampak lingkungan positif yang terukur.
                        </p>
                    </div>

                    <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:mt-10 lg:grid-cols-4 lg:gap-4">
                        {pillars.map((pillar) => {
                            const Icon = pillar.icon;

                            return (
                                <article
                                    key={pillar.number}
                                    className="liquid-glass rounded-[22px] border border-white/12 p-5 lg:rounded-[28px] lg:p-6"
                                >
                                    <div className="flex items-center justify-between text-white/50">
                                        <span className="text-sm tracking-[0.18em]">{pillar.number}</span>
                                        <Icon className="h-5 w-5 text-emerald-300" />
                                    </div>
                                    <h3 className="mt-6 font-sans text-xl font-medium tracking-[-0.03em] text-white lg:mt-10 lg:text-2xl">
                                        {pillar.title}
                                    </h3>
                                    <p className="mt-3 text-sm leading-6 text-gray-300 lg:mt-4">
                                        {pillar.description}
                                    </p>
                                </article>
                            );
                        })}
                    </div>
                </div>
            </section>

            <section className="bg-[#030504] py-10 lg:py-24">
                <div className="mx-auto grid max-w-7xl gap-8 px-6 md:px-12 lg:gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)] lg:items-center lg:px-16">
                    <div className="relative overflow-hidden rounded-[32px] border border-white/12">
                        <div className="relative aspect-[4/3] sm:aspect-[16/11] lg:aspect-[4/5]">
                            <Image
                                src="/images/ecosistem/Baciraro_ecosistem.jpg"
                                alt="Ekosistem Baciraro"
                                fill
                                className="object-cover"
                                sizes="(max-width: 1024px) 100vw, 50vw"
                            />
                        </div>

                        <div className="absolute inset-x-4 bottom-4 md:inset-x-6 md:bottom-6">
                            <div className="liquid-glass rounded-2xl border border-white/20 p-4 md:p-5">
                                <p className="text-xs uppercase tracking-[0.22em] text-emerald-300/80">Baciraro</p>
                                <div className="mt-3 flex items-center gap-4">
                                    <div className="relative h-14 w-14 overflow-hidden rounded-2xl bg-white/10">
                                        <Image
                                            src="/images/sponsor/Baciraro.png"
                                            alt="Baciraro"
                                            fill
                                            className="object-contain p-2"
                                            sizes="56px"
                                        />
                                    </div>
                                    <div>
                                        <p className="text-xs uppercase tracking-[0.22em] text-white/55">Powered by</p>
                                        <p className="mt-1 text-lg text-white">Baciraro Recycle</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <p className="text-xs uppercase tracking-[0.26em] text-emerald-300/80">Ekosistem Baciraro</p>
                        <h2 className="mt-3 font-sans text-3xl font-medium tracking-[-0.04em] text-white md:text-4xl lg:text-5xl">
                            Menghubungkan Semua
                            <br />
                            Pemangku Kepentingan
                        </h2>
                        <p className="mt-6 max-w-2xl text-base leading-7 text-gray-300 md:text-lg">
                            Melalui platform digital, kami menghubungkan komunitas, operator lapangan, pengolah material, regulator, dan pelaku usaha dalam satu alur data terpadu — meningkatkan transparansi dan membuka peluang ekonomi baru berbasis limbah bernilai.
                        </p>

                        <ul className="mt-8 space-y-3">
                            {ecosystemPoints.map((point) => (
                                <li key={point} className="flex items-start gap-3 text-gray-200">
                                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-300" />
                                    <span className="text-sm leading-6 md:text-base">{point}</span>
                                </li>
                            ))}
                        </ul>

                        <div className="mt-8 flex flex-wrap gap-4">
                            <Link
                                href="/contact"
                                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-white px-7 py-3 font-medium text-black transition-colors hover:bg-gray-100 sm:w-auto"
                            >
                                Bergabung Sekarang
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                            <Link
                                href="#filosofi"
                                className="liquid-glass inline-flex w-full items-center justify-center gap-2 rounded-lg border border-white/18 px-7 py-3 font-medium text-white transition-colors hover:bg-white hover:text-black sm:w-auto"
                            >
                                Filosofi Kami
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <section id="filosofi" className="bg-black py-10 lg:py-24">
                <div className="mx-auto grid max-w-7xl gap-8 px-6 md:px-12 lg:gap-12 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-start lg:px-16">
                    <div>
                        <p className="text-xs uppercase tracking-[0.26em] text-emerald-300/80">Filosofi Kami</p>
                        <h2 className="mt-2 font-sans text-2xl font-medium tracking-[-0.04em] text-white md:text-3xl lg:mt-3 lg:text-5xl">
                            Apa itu
                            <br />
                            EcoDigital?
                        </h2>
                        <p className="mt-3 text-sm text-gray-300 lg:mt-5 lg:text-lg">
                            Filosofi di balik setiap baris kode kami
                        </p>

                        <div className="mt-5 space-y-4 text-sm leading-6 text-gray-300 lg:mt-8 lg:space-y-6 lg:text-base lg:leading-7">
                            {philosophyParagraphs.map((paragraph) => (
                                <p key={paragraph}>{paragraph}</p>
                            ))}
                        </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2 lg:gap-4">
                        <div className="relative overflow-hidden rounded-[24px] border border-white/12 sm:row-span-2 lg:rounded-[30px]">
                            <div className="relative min-h-[260px] sm:min-h-[460px]">
                                <Image
                                    src={philosophyFrames[0].src}
                                    alt={philosophyFrames[0].alt}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 1024px) 100vw, 40vw"
                                />
                            </div>
                            <div className="absolute inset-x-0 bottom-0 p-5">
                                <div className="liquid-glass rounded-2xl border border-white/20 p-4">
                                    <p className="text-sm text-white">{philosophyFrames[0].title}</p>
                                </div>
                            </div>
                        </div>

                        {philosophyFrames.slice(1).map((frame) => (
                            <div key={frame.title} className="relative overflow-hidden rounded-[22px] border border-white/12 lg:rounded-[28px]">
                                <div className="relative min-h-[160px] bg-white/[0.02] sm:min-h-[220px]">
                                    <Image
                                        src={frame.src}
                                        alt={frame.alt}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 1024px) 100vw, 30vw"
                                    />
                                </div>
                                <div className="absolute inset-x-0 bottom-0 p-4">
                                    <div className="liquid-glass rounded-2xl border border-white/20 p-4">
                                        <p className="text-sm text-white">{frame.title}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="bg-[#020302] pb-12 lg:pb-24">
                <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-16">
                    <div className="relative overflow-hidden rounded-[28px] border border-white/12 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.18),transparent_34%),linear-gradient(135deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] p-6 md:p-10 lg:p-12 lg:rounded-[36px]">
                        <div className="grid gap-6 lg:gap-10 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-end">
                            <div>
                                <p className="text-xs uppercase tracking-[0.26em] text-emerald-300/80">Bergabung Bersama Kami</p>
                                <h2 className="mt-3 font-sans text-3xl font-medium tracking-[-0.04em] text-white md:text-4xl lg:text-5xl">
                                    Bergabunglah dengan
                                    <br />
                                    Gerakan EcoDigital
                                </h2>
                                <p className="mt-6 max-w-2xl text-base leading-7 text-gray-300 md:text-lg">
                                    Mari bersama mendorong transformasi digital yang menghasilkan nilai bisnis sekaligus menumbuhkan regenerasi lingkungan.
                                </p>

                                <div className="mt-8 flex flex-wrap gap-4">
                                    <Link
                                        href="/contact"
                                        className="inline-flex w-full items-center justify-center rounded-lg bg-white px-8 py-3 font-medium text-black transition-colors hover:bg-gray-100 sm:w-auto"
                                    >
                                        Mulai Proyek Berkelanjutan
                                    </Link>
                                    <Link
                                        href="/portfolio"
                                        className="liquid-glass inline-flex w-full items-center justify-center rounded-lg border border-white/20 px-8 py-3 font-medium text-white transition-colors hover:bg-white hover:text-black sm:w-auto"
                                    >
                                        Lihat Portfolio
                                    </Link>
                                </div>
                            </div>

                            <div className="relative overflow-hidden rounded-[28px] border border-white/12 bg-black/20">
                                <div className="relative min-h-[260px]">
                                    <Image
                                        src="/images/ecosistem/AI_2.png"
                                        alt="Visual gerakan EcoDigital"
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 1024px) 100vw, 340px"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
