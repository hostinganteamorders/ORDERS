import Link from 'next/link';

const features = [
    {
        icon: '📊',
        title: 'Dashboard',
        description: 'Grafik kas, status project, dan ranking anggota dalam satu pandangan ringkas.',
    },
    {
        icon: '🚀',
        title: 'Project & Bagi Hasil',
        description: 'Kelola project dan buat payout langsung dari project yang selesai.',
    },
    {
        icon: '💰',
        title: 'Kas & Transaksi',
        description: 'Buku kas dengan nomor referensi otomatis dan riwayat transaksi lengkap.',
    },
    {
        icon: '💸',
        title: 'Payouts',
        description: 'Pencairan dana ke anggota dengan ekspor CSV dan status otomatis.',
    },
    {
        icon: '📅',
        title: 'Jadwal & Tugas',
        description: 'Terhubung dengan Google Calendar untuk koordinasi kerja tim.',
    },
    {
        icon: '📝',
        title: 'Rapat & Tindak Lanjut',
        description: 'Notula, daftar hadir, dan action items yang terlacak.',
    },
];

const stats = [
    { label: 'Member Aktif', value: '10+' },
    { label: 'Project Terkelola', value: '20+' },
    { label: 'Transaksi / Bulan', value: '300+' },
    { label: 'Payout Otomatis', value: '100%' },
];

export default function PanelSection() {
    return (
        <>
            {/* Hero */}
            <section className="pt-36 pb-20 bg-slate-50">
                <div className="container-content text-center">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-indigo-100 text-indigo-700 text-sm font-semibold mb-6">
                        🛡️ Panel Manajemen Tim
                    </span>
                    <h1 className="text-4xl md:text-5xl font-heading font-bold text-slate-900 leading-tight">
                        Kelola <span className="text-primary">Project, Keuangan, dan Tim</span> dalam Satu Sistem
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto mt-5">
                        Sistem yang kami pakai sendiri untuk ORDERS — kini bisa menjadi milik tim, komunitas, atau bisnis Anda.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4 mt-8">
                        <a
                            href="https://wa.me/6282195965483"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-primary"
                        >
                            Minta Demo
                        </a>
                        <Link href="/contact" className="btn-outline">
                            Hubungi Kami
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

            {/* Features */}
            <section className="py-20 bg-slate-50">
                <div className="container-content">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-heading font-bold text-slate-900">Fitur Unggulan</h2>
                        <p className="text-slate-600 mt-3 max-w-xl mx-auto">
                            Semua yang dibutuhkan untuk mengelola startup, komunitas, atau organisasi Anda.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((feature) => (
                            <div key={feature.title} className="card-hover p-6 bg-white">
                                <div className="text-3xl mb-4">{feature.icon}</div>
                                <h3 className="text-lg font-bold text-slate-900 mb-2">{feature.title}</h3>
                                <p className="text-sm text-slate-600 leading-relaxed">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20">
                <div className="container-content">
                    <div className="rounded-3xl bg-gradient-to-r from-indigo-600 to-violet-500 px-8 py-14 text-center text-white">
                        <h2 className="text-3xl font-heading font-bold">Rapikan Manajemen Tim Anda</h2>
                        <p className="text-indigo-50 mt-3 max-w-xl mx-auto">
                            Dashboard, bagi hasil, dan laporan otomatis — fokus pada pertumbuhan, bukan administrasi.
                        </p>
                        <a
                            href="https://wa.me/6282195965483"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 mt-8 px-8 py-3.5 rounded-xl bg-white text-indigo-700 font-semibold hover:bg-indigo-50 transition-colors"
                        >
                            Konsultasi Gratis
                        </a>
                    </div>
                </div>
            </section>
        </>
    );
}
