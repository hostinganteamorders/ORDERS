'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import Link from 'next/link';

const monthlyData = [
    { month: 'Jan', setoran: 420, reward: 310 },
    { month: 'Feb', setoran: 510, reward: 375 },
    { month: 'Mar', setoran: 480, reward: 340 },
    { month: 'Apr', setoran: 590, reward: 425 },
    { month: 'Mei', setoran: 650, reward: 470 },
    { month: 'Jun', setoran: 720, reward: 520 },
];

const stats = [
    { label: 'Nasabah Terdaftar', value: '1.250+' },
    { label: 'Setoran / Bulan', value: '720 kg' },
    { label: 'Poin Terdistribusi', value: '18.400' },
    { label: 'Mitra Bank Sampah', value: '25+' },
];

const features = [
    {
        icon: '👥',
        title: 'Manajemen Nasabah',
        description: 'Pendaftaran, kartu anggota, riwayat setoran, dan saldo poin setiap nasabah dalam satu tampilan.',
    },
    {
        icon: '⚖️',
        title: 'Timbangan & Setoran',
        description: 'Catat setoran per jenis sampah, hitung berat dan poin otomatis langsung dari aplikasi.',
    },
    {
        icon: '🎁',
        title: 'Reward / Poin',
        description: 'Program poin transparan yang bisa ditukar dengan kebutuhan sehari-hari.',
    },
    {
        icon: '📊',
        title: 'Dashboard & Laporan',
        description: 'Laporan bulanan siap saji: total setoran, jenis sampah, dan distribusi poin.',
    },
    {
        icon: '🔗',
        title: 'Opsi Web3',
        description: 'Riwayat reward yang immutable dengan teknologi blockchain untuk akuntabilitas penuh.',
    },
    {
        icon: '📱',
        title: 'Aplikasi Mobile',
        description: 'Pendamping mobile untuk nasabah: jadwal pickup, saldo poin, dan penukaran reward.',
    },
];

export default function WasteTechSection() {
    return (
        <>
            {/* Hero */}
            <section className="pt-36 pb-20 bg-slate-50">
                <div className="container-content text-center">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-sm font-semibold mb-6">
                        ♻️ Sistem Bank Sampah Digital
                    </span>
                    <h1 className="text-4xl md:text-5xl font-heading font-bold text-slate-900 leading-tight">
                        Kelola Bank Sampah,{' '}
                        <span className="text-primary">TPS, dan Desa Digital</span> dalam Satu Sistem
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto mt-5">
                        Dari pencatatan nasabah, timbangan setoran, reward/poin, sampai dashboard laporan —
                        bukti nyata tim kami di bidang keberlanjutan. Lihat demo interaktif di bawah.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4 mt-8">
                        <a
                            href="https://wa.me/6282195965483"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-primary"
                        >
                            Minta Demo Langsung
                        </a>
                        <Link href="/portfolio" className="btn-outline">
                            Lihat Portfolio
                        </Link>
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="py-14">
                <div className="container-content grid grid-cols-2 md:grid-cols-4 gap-6">
                    {stats.map((stat) => (
                        <div key={stat.label} className="card-hover p-6 text-center">
                            <p className="text-3xl font-bold text-primary font-heading">{stat.value}</p>
                            <p className="text-sm text-slate-600 mt-1">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Demo Dashboard */}
            <section className="py-14 bg-slate-50">
                <div className="container-content">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-heading font-bold text-slate-900">
                            Demo Dashboard
                        </h2>
                        <p className="text-slate-600 mt-3 max-w-xl mx-auto">
                            Contoh visualisasi rekapitulasi setoran sampah dan reward poin bulanan (kg).
                        </p>
                    </div>
                    <div className="card-hover p-6 md:p-8">
                        <ResponsiveContainer width="100%" height={320}>
                            <BarChart data={monthlyData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 13 }} />
                                <YAxis tick={{ fill: '#64748b', fontSize: 13 }} />
                                <Tooltip
                                    contentStyle={{
                                        borderRadius: 12,
                                        border: '1px solid #e2e8f0',
                                        boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                                    }}
                                />
                                <Bar dataKey="setoran" name="Setoran (kg)" fill="#10b981" radius={[6, 6, 0, 0]} />
                                <Bar dataKey="reward" name="Reward (poin)" fill="#34d399" radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="py-20">
                <div className="container-content">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-heading font-bold text-slate-900">Fitur Utama</h2>
                        <p className="text-slate-600 mt-3 max-w-xl mx-auto">
                            Sistem end-to-end yang bisa disesuaikan untuk bank sampah, TPS, hingga program desa.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((feature) => (
                            <div key={feature.title} className="card-hover p-6">
                                <div className="text-3xl mb-4">{feature.icon}</div>
                                <h3 className="text-lg font-bold text-slate-900 mb-2">{feature.title}</h3>
                                <p className="text-sm text-slate-600 leading-relaxed">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="pb-20">
                <div className="container-content">
                    <div className="rounded-3xl bg-gradient-to-r from-emerald-600 to-teal-500 px-8 py-14 text-center text-white">
                        <h2 className="text-3xl font-heading font-bold">Siap Digitalisasi Bank Sampah Anda?</h2>
                        <p className="text-emerald-50 mt-3 max-w-xl mx-auto">
                            Konsultasi gratis — tim kami siap membantu merancang sistem sesuai kebutuhan komunitas Anda.
                        </p>
                        <a
                            href="https://wa.me/6282195965483"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 mt-8 px-8 py-3.5 rounded-xl bg-white text-emerald-700 font-semibold hover:bg-emerald-50 transition-colors"
                        >
                            Hubungi Tim Kami
                        </a>
                    </div>
                </div>
            </section>
        </>
    );
}
