import Link from 'next/link';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { CASE_STUDIES, getCaseStudy } from '@/lib/case-studies';

interface Props {
    params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
    return CASE_STUDIES.map((c) => ({ slug: c.slug }));
}

export function generateMetadata({ params }: Props) {
    return { title: 'Case Study - ORDERS' };
}

function SectionTitle({ children }: { children: React.ReactNode }) {
    return <h2 className="text-2xl font-bold text-[#061E44] mb-4">{children}</h2>;
}

export default async function CaseStudyPage({ params }: Props) {
    const { slug } = await params;
    const study = getCaseStudy(slug);
    if (!study) notFound();

    return (
        <>
            <Header />
            <main className="pt-20">
                {/* Hero */}
                <section className="py-12 md:py-16 bg-gradient-to-br from-gray-50 via-white to-gray-100">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
                        <Link
                            href="/portfolio"
                            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#FF7A00] transition mb-6"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Kembali ke Portfolio
                        </Link>

                        <span className="inline-flex items-center px-4 py-2 bg-[#FF7A00]/10 text-[#FF7A00] rounded-full text-sm font-medium mb-4">
                            Case Study
                        </span>
                        <h1 className="text-3xl md:text-5xl font-bold text-[#061E44] leading-tight">
                            {study.title}
                        </h1>
                        <p className="mt-3 text-lg text-gray-600">{study.tagline}</p>
                        <p className="mt-6 text-gray-700 leading-relaxed max-w-3xl">{study.summary}</p>

                        <div className="mt-6 flex flex-wrap gap-4 text-sm">
                            <div>
                                <span className="text-gray-400 block text-xs">Klien</span>
                                <span className="font-medium text-[#061E44]">{study.client}</span>
                            </div>
                            <div>
                                <span className="text-gray-400 block text-xs">Tahun</span>
                                <span className="font-medium text-[#061E44]">{study.year}</span>
                            </div>
                            <div>
                                <span className="text-gray-400 block text-xs">Tim</span>
                                <span className="font-medium text-[#061E44]">{study.team.join(', ')}</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Body */}
                <section className="py-12 md:py-16">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                            <div className="lg:col-span-2 space-y-12">
                                <div>
                                    <SectionTitle>Tantangan</SectionTitle>
                                    <p className="text-gray-700 leading-relaxed">{study.challenge}</p>
                                </div>

                                <div>
                                    <SectionTitle>Solusi Kami</SectionTitle>
                                    <ul className="space-y-3">
                                        {study.solution.map((s, i) => (
                                            <li key={i} className="flex items-start gap-3">
                                                <svg className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                <span className="text-gray-700">{s}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div>
                                    <SectionTitle>Hasil</SectionTitle>
                                    <ul className="space-y-3">
                                        {study.results.map((r, i) => (
                                            <li key={i} className="flex items-start gap-3">
                                                <svg className="w-5 h-5 text-[#FF7A00] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                                </svg>
                                                <span className="text-gray-700">{r}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            {/* Sidebar */}
                            <div className="space-y-6">
                                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                                    <h3 className="font-semibold text-[#061E44] mb-3">Teknologi</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {study.technologies.map((t) => (
                                            <span key={t} className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md text-xs font-medium">
                                                {t}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {study.links.length > 0 && (
                                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                                        <h3 className="font-semibold text-[#061E44] mb-3">Pranala</h3>
                                        <div className="flex flex-col gap-2">
                                            {study.links.map((l) => (
                                                <a
                                                    key={l.url}
                                                    href={l.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="px-4 py-2.5 rounded-lg bg-[#061E44] hover:bg-[#FF7A00] text-white text-sm font-medium transition text-center"
                                                >
                                                    {l.label}
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="bg-gradient-to-br from-[#FF7A00]/10 to-orange-100/40 rounded-xl p-6">
                                    <h3 className="font-semibold text-[#061E44] mb-2">Punya proyek serupa?</h3>
                                    <p className="text-sm text-gray-600 mb-4">Mari diskusikan kebutuhan Anda bersama tim kami.</p>
                                    <a
                                        href="https://wa.me/6282195965483?text=Halo!%20Saya%20ingin%20konsultasi%20proyek%20seperti%20case%20study%20ini."
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block w-full py-3 px-6 bg-[#FF7A00] hover:bg-orange-600 text-white font-semibold rounded-lg transition text-center"
                                    >
                                        Konsultasi Gratis
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
