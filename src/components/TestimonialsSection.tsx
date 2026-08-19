'use client';

const TESTIMONIALS = [
    {
        quote:
            'Platform wisata kami dibuat profesional dan mudah dikelola tim sendiri — konten, paket tour, hotel, dan testimoni bisa diperbarui tanpa bantuan teknis.',
        name: 'Maleosan Tours',
        role: 'Platform Wisata Multilingual',
    },
    {
        quote:
            'Tim ORDERS membangun ekosistem digital dengan keamanan data berlapis (RLS) dan kecerdasan buatan untuk menganalisis catatan aktivitas secara terstruktur.',
        name: 'Baciraro',
        role: 'Platform Keberlanjutan Berbasis AI',
    },
    {
        quote:
            'Sistem otomasi yang dibuat menghemat banyak waktu operasional kami — balasan otomatis, follow-up, hingga laporan masuk ke grup tanpa pegawai ekstra.',
        name: 'Johan Garage',
        role: 'Otomasi AI & Sistem Monitoring',
    },
    {
        quote:
            'Brand guidelines dan materi pemasaran baru kami langsung konsisten di semua platform — dari logo, feed media sosial, sampai invoice.',
        name: 'KeyBox',
        role: 'Brand Identity & Desain',
    },
    {
        quote:
            'Alur pengelolaan project, keuangan, dan bagi hasil tim menjadi transparan dan tercatat rapi — semua divisi bisa memantau perkembangannya.',
        name: 'Tim Internal ORDERS',
        role: 'Panel Manajemen Tim',
    },
];

export default function TestimonialsSection() {
    return (
        <section className="py-16 md:py-24 bg-slate-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-2xl mx-auto mb-12">
                    <span className="inline-flex items-center px-4 py-2 bg-[#FF7A00]/10 text-[#FF7A00] rounded-full text-sm font-medium">
                        Testimoni & Kepercayaan
                    </span>
                    <h2 className="mt-4 text-3xl md:text-4xl font-bold text-[#061E44]">
                        Apa Kata Klien & Mitra Kami
                    </h2>
                    <p className="mt-4 text-gray-600">
                        Bukti nyata dari proyek-proyek yang telah kami kerjakan bersama.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {TESTIMONIALS.map((t, i) => (
                        <div
                            key={i}
                            className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                        >
                            <div className="flex gap-1 text-[#FF7A00] mb-4" aria-label="5 bintang">
                                {Array.from({ length: 5 }).map((_, s) => (
                                    <svg key={s} className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.363-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                            </div>
                            <p className="text-gray-600 text-sm leading-relaxed mb-4">“{t.quote}”</p>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF7A00] to-[#FF9A40] flex items-center justify-center text-white font-bold text-sm">
                                    {t.name.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-semibold text-[#061E44] text-sm">{t.name}</p>
                                    <p className="text-xs text-gray-500">{t.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
