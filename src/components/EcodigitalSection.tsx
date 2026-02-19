'use client';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, Leaf, Recycle, Zap, TrendingUp, CheckCircle2 } from 'lucide-react';

/* ─────────────────────────────────────────
   Fonts injected via style tag (Google)
───────────────────────────────────────── */
const FontInjector = () => (
    <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@300;400;500&display=swap');
    .eco-serif  { font-family: 'Playfair Display', Georgia, serif; }
    .eco-sans   { font-family: 'DM Sans', system-ui, sans-serif; }
    .eco-kicker {
      font-family: 'DM Sans', system-ui, sans-serif;
      font-size: 0.6875rem;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      font-weight: 500;
    }
  `}</style>
);

/* ─────────────────────────────────────────
   Data
───────────────────────────────────────── */
const partners = [
    { src: '/images/sponsor/Baciraro.png', alt: 'Baciraro' },
    { src: '/images/sponsor/TanaNyiurLestari.png', alt: 'Tana Nyiur Lestari' },
    { src: '/images/sponsor/TrashRecycleCenter.png', alt: 'Trash Recycle Center' },
    { src: '/images/sponsor/ELMAST.png', alt: 'ELMast' },
];

const pillars = [
    {
        icon: Leaf,
        num: '01',
        title: 'Circular Economy',
        desc: 'Platform digital untuk pemetaan aliran limbah dan peningkatan keterlacakan material.',
    },
    {
        icon: Recycle,
        num: '02',
        title: 'Baciraro Recycle',
        desc: 'Ekosistem mitra mendorong circular economy melalui data akurat dan kolaborasi lokal.',
    },
    {
        icon: Zap,
        num: '03',
        title: 'Green Infrastructure',
        desc: 'Arsitektur digital efisiensi tinggi: server hemat energi, desain ringan, jejak karbon minimal.',
    },
    {
        icon: TrendingUp,
        num: '04',
        title: 'Talenta Hijau',
        desc: 'Program mentoring untuk mempersiapkan generasi karir di ekonomi rendah karbon.',
    },
];

const ecosystemPoints = [
    'Pemetaan aliran limbah secara real-time',
    'Dashboard dampak lingkungan terukur',
    'Integrasi IoT ringan & API pelaporan',
    'Notifikasi otomatis seluruh rantai daur ulang',
];

const ecodigitalText = [
    'Ecodigital adalah kerangka strategis kami untuk memastikan setiap solusi teknologi yang kami bangun selaras dengan prinsip keberlanjutan. Bukan hanya soal memilih server hemat energi, tetapi bagaimana desain, arsitektur, infrastruktur, alur data, dan siklus hidup produk digital meminimalkan jejak lingkungan sekaligus memaksimalkan dampak sosial positif.',
    'Kami melihat teknologi sebagai katalis ekonomi sirkular — mendukung penelusuran material, optimasi rantai pasok, edukasi perilaku, hingga orkestrasi ekosistem daur ulang melalui data yang akurat dan dapat ditindaklanjuti.',
    'Pendekatan ini memadukan efisiensi energi, desain ringan, pengukuran emisi, serta integrasi ekosistem mitra untuk menghasilkan nilai yang terukur. Inilah jalan kami membangun masa depan digital yang regeneratif, bukan sekadar berkelanjutan.',
];

/* ─────────────────────────────────────────
   Animation helpers
───────────────────────────────────────── */
const fadeUp = {
    hidden: { opacity: 0, y: 28 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.75, ease: 'easeOut' as const } },
};

const stagger = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
};

/* ─────────────────────────────────────────
   Component
───────────────────────────────────────── */
export default function EcodigitalSection() {
    return (
        <>
            <FontInjector />

            {/* ══════════════════════════════════════
          HERO  — full-bleed photo background
      ══════════════════════════════════════ */}
            <section className="relative h-screen min-h-[680px] w-full flex items-end overflow-hidden">
                {/* Background photo */}
                <Image
                    src="/images/ecosistem/p1.jpg"
                    alt="Lingkungan hijau dan teknologi berkelanjutan"
                    fill
                    className="object-cover object-center"
                    priority
                    quality={90}
                    sizes="100vw"
                />

                {/* Solid dark overlay — bottom-half scrim only */}
                <div
                    className="absolute inset-0"
                    style={{
                        background:
                            'linear-gradient(to top, rgba(10,22,15,0.92) 0%, rgba(10,22,15,0.55) 45%, rgba(10,22,15,0.15) 100%)',
                    }}
                />

                {/* Thin top edge line */}
                <div className="absolute top-0 left-0 right-0 h-px bg-white/10" />

                {/* Content — pinned bottom */}
                <div className="relative w-full pb-16 lg:pb-24 pt-20 px-6 md:px-12 max-w-6xl mx-auto">
                    <motion.div
                        variants={stagger}
                        initial="hidden"
                        animate="visible"
                        className="max-w-3xl"
                    >
                        {/* Kicker */}
                        <motion.p variants={fadeUp} className="eco-kicker text-emerald-400 mb-5 flex items-center gap-2">
                            <Leaf className="h-3.5 w-3.5" />
                            Green Job Initiative · EcoDigital
                        </motion.p>

                        {/* Headline */}
                        <motion.h1
                            variants={fadeUp}
                            className="eco-serif text-white leading-[1.08] mb-6"
                            style={{ fontSize: 'clamp(2.5rem, 6vw, 4.25rem)' }}
                        >
                            Membangun Masa Depan<br />
                            <em className="not-italic text-emerald-300">Berkelanjutan</em>{' '}
                            Bersama Teknologi
                        </motion.h1>

                        {/* Body */}
                        <motion.p
                            variants={fadeUp}
                            className="eco-sans text-white/70 text-base lg:text-lg leading-relaxed max-w-xl mb-10"
                        >
                            Ecodigital bukan sekadar teknologi hijau — ini adalah kerangka strategis kami untuk memastikan setiap solusi digital selaras dengan prinsip keberlanjutan dan ekonomi sirkular.
                        </motion.p>

                        {/* CTA row */}
                        <motion.div variants={fadeUp} className="flex flex-wrap gap-3">
                            <Link
                                href="/contact"
                                className="eco-sans inline-flex items-center gap-2 rounded-full bg-emerald-500 px-7 py-3 text-sm font-medium text-white hover:bg-emerald-400 transition-colors duration-200 group"
                            >
                                Mulai Proyek Berkelanjutan
                                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </Link>
                            <Link
                                href="#pillars"
                                className="eco-sans inline-flex items-center gap-2 rounded-full border border-white/30 px-7 py-3 text-sm font-medium text-white/80 hover:border-white/60 hover:text-white transition-colors duration-200"
                            >
                                Pelajari Lebih Lanjut
                            </Link>
                        </motion.div>
                    </motion.div>

                    {/* Stats strip */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8, duration: 0.7 }}
                        className="mt-14 pt-8 border-t border-white/15 grid grid-cols-3 max-w-sm gap-8"
                    >
                        {[
                            { v: '3+', l: 'Mitra Ekosistem' },
                            { v: '100%', l: 'Cloud Green' },
                            { v: '2024', l: 'Sejak Tahun' },
                        ].map((s) => (
                            <div key={s.l}>
                                <p className="eco-serif text-emerald-300 text-2xl font-bold">{s.v}</p>
                                <p className="eco-sans text-white/50 text-xs mt-0.5">{s.l}</p>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ══════════════════════════════════════
          PARTNER LOGOS
      ══════════════════════════════════════ */}
            <section className="bg-[#f7f6f2] border-b border-stone-200 py-10">
                <div className="max-w-6xl mx-auto px-6 md:px-12">
                    <p className="eco-kicker text-stone-400 mb-7 text-center">Mitra Ekosistem Kami</p>
                    <div className="flex flex-wrap items-center justify-center gap-10 lg:gap-16">
                        {partners.map((p) => (
                            <div
                                key={p.alt}
                                className="relative h-9 w-24 lg:h-11 lg:w-28 opacity-40 grayscale hover:opacity-80 hover:grayscale-0 transition-all duration-300"
                            >
                                <Image src={p.src} alt={p.alt} fill className="object-contain" sizes="120px" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════
          4 PILLARS
      ══════════════════════════════════════ */}
            <section id="pillars" className="bg-white py-20 lg:py-28">
                <div className="max-w-6xl mx-auto px-6 md:px-12">
                    {/* Header */}
                    <motion.div
                        variants={stagger}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="mb-14"
                    >
                        <motion.p variants={fadeUp} className="eco-kicker text-emerald-600 mb-3">
                            Fondasi EcoDigital
                        </motion.p>
                        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
                            <motion.h2
                                variants={fadeUp}
                                className="eco-serif text-[#0a1610] leading-tight"
                                style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)' }}
                            >
                                Empat Pilar Keberlanjutan
                            </motion.h2>
                            <motion.p variants={fadeUp} className="eco-sans text-stone-500 text-sm max-w-xs leading-relaxed">
                                Setiap aspek platform kami dirancang untuk menghasilkan dampak lingkungan positif yang terukur.
                            </motion.p>
                        </div>
                        <div className="mt-6 h-px bg-stone-200" />
                    </motion.div>

                    {/* Grid */}
                    <motion.div
                        variants={stagger}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: '-60px' }}
                        className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-stone-200 border border-stone-200"
                    >
                        {pillars.map((p) => {
                            const Icon = p.icon;
                            return (
                                <motion.div
                                    key={p.num}
                                    variants={fadeUp}
                                    className="bg-white p-8 flex flex-col gap-5 group hover:bg-[#f0faf4] transition-colors duration-300"
                                >
                                    <div className="flex items-start justify-between">
                                        <span className="eco-sans text-stone-300 text-xs font-medium">{p.num}</span>
                                        <Icon className="h-5 w-5 text-emerald-500" />
                                    </div>
                                    <div>
                                        <h3 className="eco-serif text-[#0a1610] text-lg mb-2">{p.title}</h3>
                                        <p className="eco-sans text-stone-500 text-sm leading-relaxed">{p.desc}</p>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                </div>
            </section>

            {/* ══════════════════════════════════════
          ECOSYSTEM 2-COL
      ══════════════════════════════════════ */}
            <section className="bg-[#f7f6f2] py-20 lg:py-28">
                <div className="max-w-6xl mx-auto px-6 md:px-12 grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    {/* Photo */}
                    <motion.div
                        initial={{ opacity: 0, x: -24 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
                        className="relative"
                    >
                        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                            <Image
                                src="/images/ecosistem/Baciraro_ecosistem.jpg"
                                alt="Ekosistem Baciraro"
                                fill
                                className="object-cover"
                                sizes="(max-width:768px) 100vw, 50vw"
                            />
                        </div>

                        {/* Floating card — BACIRARO logo */}
                        <div className="absolute -bottom-5 -right-4 lg:-right-8 bg-white border border-stone-200 rounded-xl px-4 py-3.5 shadow-sm flex items-center gap-3">
                            <div className="relative h-9 w-9 rounded-lg overflow-hidden bg-stone-50 border border-stone-100 shrink-0">
                                <Image
                                    src="/images/ecosistem/BACIRARO.png"
                                    alt="Baciraro"
                                    fill
                                    className="object-contain p-1"
                                    sizes="40px"
                                />
                            </div>
                            <div>
                                <p className="eco-kicker text-stone-400" style={{ fontSize: '0.6rem' }}>Keterlacakan Material</p>
                                <p className="eco-sans text-[#0a1610] text-sm font-medium">Circular Loop</p>
                            </div>
                        </div>

                        {/* Corner accent */}
                        <div className="absolute -top-3 -left-3 h-10 w-10 border-l-2 border-t-2 border-emerald-400 rounded-tl-lg" />
                    </motion.div>

                    {/* Text */}
                    <motion.div
                        initial={{ opacity: 0, x: 24 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1], delay: 0.1 }}
                        className="space-y-6"
                    >
                        {/* Partner badge */}
                        <div className="flex items-center gap-2.5 mb-1">
                            <div className="relative h-7 w-7 rounded overflow-hidden bg-stone-50 border border-stone-200">
                                <Image
                                    src="/images/ecosistem/BACIRARO.png"
                                    alt="Baciraro"
                                    fill
                                    className="object-contain p-0.5"
                                    sizes="28px"
                                />
                            </div>
                            <p className="eco-kicker text-emerald-600">Ekosistem Baciraro Recycle</p>
                        </div>
                        <h2
                            className="eco-serif text-[#0a1610] leading-tight"
                            style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.5rem)' }}
                        >
                            Menghubungkan Semua<br />Pemangku Kepentingan
                        </h2>
                        <p className="eco-sans text-stone-500 text-base leading-relaxed">
                            Melalui platform digital, kami menghubungkan komunitas, operator lapangan, pengolah material, regulator, dan pelaku usaha dalam satu alur data terpadu — meningkatkan transparansi dan membuka peluang ekonomi baru berbasis limbah bernilai.
                        </p>

                        <ul className="space-y-3">
                            {ecosystemPoints.map((item) => (
                                <li key={item} className="flex items-start gap-3 eco-sans text-sm text-stone-600">
                                    <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                                    {item}
                                </li>
                            ))}
                        </ul>

                        <Link
                            href="/contact"
                            className="eco-sans inline-flex items-center gap-2 rounded-full bg-[#0a1610] px-7 py-3 text-sm font-medium text-white hover:bg-[#1a3320] transition-colors duration-200 group"
                        >
                            Bergabung Sekarang
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* ══════════════════════════════════════
          WHAT IS ECODIGITAL
      ══════════════════════════════════════ */}
            <section className="bg-white py-20 lg:py-28">
                <div className="max-w-6xl mx-auto px-6 md:px-12">
                    <motion.div
                        variants={stagger}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid lg:grid-cols-[1fr_2fr] gap-12 lg:gap-20"
                    >
                        {/* Left sticky label */}
                        <motion.div variants={fadeUp} className="lg:pt-2">
                            <p className="eco-kicker text-emerald-600 mb-4">Filosofi Kami</p>
                            <h2
                                className="eco-serif text-[#0a1610] leading-tight"
                                style={{ fontSize: 'clamp(1.6rem, 3vw, 2.25rem)' }}
                            >
                                Apa itu<br />EcoDigital?
                            </h2>
                            <div className="mt-6 w-8 h-0.5 bg-emerald-400" />
                            <p className="eco-sans text-stone-400 text-xs mt-4 leading-relaxed">
                                Filosofi di balik setiap baris kode kami
                            </p>
                        </motion.div>

                        {/* Right paragraphs */}
                        <div className="space-y-6">
                            {ecodigitalText.map((text, i) => (
                                <motion.p
                                    key={i}
                                    variants={fadeUp}
                                    className="eco-sans text-stone-600 text-base leading-[1.8] border-l-2 border-stone-100 pl-5"
                                >
                                    {text}
                                </motion.p>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ══════════════════════════════════════
          CTA  — dark, photo accent
      ══════════════════════════════════════ */}
            <section className="bg-[#0a1610] py-20 lg:py-28 relative overflow-hidden">
                {/* Faint forest image background */}
                <div className="absolute inset-0 opacity-[0.08]">
                    <Image
                        src="/images/ecosistem/p1.jpg"
                        alt=""
                        fill
                        className="object-cover object-center"
                        sizes="100vw"
                        aria-hidden
                    />
                </div>

                {/* Fine line pattern */}
                <div
                    className="absolute inset-0 opacity-[0.04]"
                    style={{
                        backgroundImage:
                            'repeating-linear-gradient(0deg, #fff 0px, #fff 1px, transparent 1px, transparent 40px), repeating-linear-gradient(90deg, #fff 0px, #fff 1px, transparent 1px, transparent 40px)',
                    }}
                />

                <div className="relative max-w-4xl mx-auto px-6 md:px-12 text-center">
                    <motion.div
                        variants={stagger}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        <motion.p variants={fadeUp} className="eco-kicker text-emerald-400 mb-5">
                            Bergabung Bersama Kami
                        </motion.p>
                        <motion.h2
                            variants={fadeUp}
                            className="eco-serif text-white leading-tight mb-6"
                            style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}
                        >
                            Bergabunglah dengan<br />Gerakan EcoDigital
                        </motion.h2>
                        <motion.p variants={fadeUp} className="eco-sans text-white/60 text-base leading-relaxed max-w-xl mx-auto mb-10">
                            Mari bersama mendorong transformasi digital yang menghasilkan nilai bisnis sekaligus menumbuhkan regenerasi lingkungan.
                        </motion.p>
                        <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3 justify-center">
                            <Link
                                href="/contact"
                                className="eco-sans inline-flex items-center justify-center gap-2 rounded-full bg-emerald-500 px-8 py-3.5 text-sm font-medium text-white hover:bg-emerald-400 transition-colors duration-200 group"
                            >
                                Mulai Proyek Berkelanjutan
                                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </Link>
                            <Link
                                href="/portfolio"
                                className="eco-sans inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-8 py-3.5 text-sm font-medium text-white/80 hover:border-white/40 hover:text-white transition-colors duration-200"
                            >
                                Lihat Portfolio
                            </Link>
                        </motion.div>
                    </motion.div>
                </div>
            </section>
        </>
    );
}
