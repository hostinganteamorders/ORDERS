'use client';

import { useEffect, useRef, useState } from 'react';

function useCountUp(target: number, duration = 1200) {
    const ref = useRef<HTMLSpanElement>(null);
    const [value, setValue] = useState(0);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        let raf = 0;
        const obs = new IntersectionObserver(
            ([e]) => {
                if (!e.isIntersecting) return;
                obs.disconnect();
                const start = performance.now();
                const tick = (now: number) => {
                    const p = Math.min((now - start) / duration, 1);
                    setValue(Math.round(target * (1 - Math.pow(1 - p, 3))));
                    if (p < 1) raf = requestAnimationFrame(tick);
                };
                raf = requestAnimationFrame(tick);
            },
            { threshold: 0.4 }
        );
        obs.observe(el);
        return () => {
            obs.disconnect();
            cancelAnimationFrame(raf);
        };
    }, [target, duration]);

    return { ref, value };
}

const STATS = [
    { value: 10, suffix: '+', label: 'Anggota Tim Profesional' },
    { value: 20, suffix: '+', label: 'Proyek Digital Selesai' },
    { value: 6, suffix: '', label: 'Prestasi & Finalis Nasional' },
    { value: 4, suffix: '+', label: 'Proyek Live di Produksi' },
];

function StatItem({ value, suffix, label }: { value: number; suffix: string; label: string }) {
    const { ref, value: current } = useCountUp(value);
    return (
        <div className="text-center">
            <p className="text-4xl md:text-5xl font-bold text-[#FF7A00]">
                <span ref={ref}>{current}</span>
                {suffix}
            </p>
            <p className="mt-2 text-sm md:text-base text-gray-600">{label}</p>
        </div>
    );
}

export default function StatsSection() {
    return (
        <section className="py-16 md:py-20 bg-gradient-to-br from-[#061E44] to-[#0b2d63]">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <span className="inline-flex items-center px-4 py-2 bg-white/10 text-[#FF7A00] rounded-full text-sm font-medium">
                        Rekam Jejak Kami
                    </span>
                    <h2 className="mt-4 text-3xl md:text-4xl font-bold text-white">
                        Angka yang Berbicara
                    </h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {STATS.map((s) => (
                        <StatItem key={s.label} value={s.value} suffix={s.suffix} label={s.label} />
                    ))}
                </div>
            </div>
        </section>
    );
}
