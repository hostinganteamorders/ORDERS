import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';

const PROJECTS = [
  {
    category: 'Platform wisata',
    title: 'Maleosan Tours',
    description:
      'Portal tour dan travel multibahasa untuk Sulawesi Utara, dengan CMS untuk paket tour, hotel, dan transportasi.',
    domain: 'maleosantoursmanado.com',
    url: 'https://www.maleosantoursmanado.com/',
    image: '/images/live/maleosan.jpg',
    alt: 'Beranda Maleosan Tours Manado dengan foto penyelam di terumbu karang',
  },
  {
    category: 'Platform keberlanjutan',
    title: 'Baciraro',
    description:
      'Platform circular economy dan CSR lingkungan, dengan analitik berbasis AI dan keamanan data berlapis.',
    domain: 'baciraro.net',
    url: 'https://www.baciraro.net/',
    image: '/images/live/baciraro.jpg',
    alt: 'Beranda Baciraro dengan logo rumah hijau di latar gelap',
  },
  {
    category: 'Website desa wisata',
    title: 'Desa Wisata Tumaluntung',
    description:
      'Website resmi desa wisata: profil desa, destinasi, paket wisata, reservasi, dan etalase UMKM.',
    domain: 'dewitumaluntung.com',
    url: 'https://www.dewitumaluntung.com/',
    image: '/images/live/tumaluntung.jpg',
    alt: 'Beranda Desa Wisata Tumaluntung dengan foto jalan di kaki gunung saat senja',
  },
  {
    category: 'Portal organisasi kampus',
    title: 'Nyong Noni UNIMA',
    description:
      'Portal resmi Nyong & Noni Universitas Negeri Manado: pengumuman, finalis, titleholders, berita, dan acara.',
    domain: 'ikatannyongnoniunima.com',
    url: 'https://www.ikatannyongnoniunima.com/',
    image: '/images/live/nyongnoni.jpg',
    alt: 'Beranda portal Nyong Noni UNIMA dengan siluet sepasang duta mahasiswa',
  },
];

export default function LiveProjectsSection() {
  return (
    <section className="bg-slate-50">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-12 px-5 py-24">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex max-w-[680px] flex-col gap-3">
            <span className="text-sm font-bold uppercase tracking-[0.08em] text-[#B35200]">
              Proyek live
            </span>
            <h2 className="text-3xl font-extrabold leading-[1.15] tracking-[-0.025em] text-[#061E44] md:text-[2.6rem]">
              Situs yang sudah online dengan domain sendiri
            </h2>
            <p className="text-[17px] leading-relaxed text-slate-600">
              Lima situs untuk klien dan komunitas di Sulawesi Utara. Klik kartu untuk membuka situs
              aslinya.
            </p>
          </div>
          <Link
            href="/portfolio"
            className="inline-flex min-h-[44px] items-center gap-2 text-base font-bold text-[#061E44] hover:text-[#B35200]"
          >
            Lihat semua proyek
            <ArrowRight className="h-[18px] w-[18px]" aria-hidden="true" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {PROJECTS.map((project) => (
            <a
              key={project.domain}
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition-shadow hover:shadow-lg"
            >
              <div className="relative aspect-[16/10] w-full border-b border-slate-200 bg-slate-100">
                <Image
                  src={project.image}
                  alt={project.alt}
                  fill
                  sizes="(min-width: 768px) 560px, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col gap-2.5 p-6">
                <span className="text-[13px] font-bold text-[#B35200]">{project.category}</span>
                <h3 className="text-[22px] font-bold text-[#061E44]">{project.title}</h3>
                <p className="text-[15px] leading-relaxed text-slate-600">{project.description}</p>
                <span className="mt-1 inline-flex items-center gap-1.5 text-[15px] font-bold text-[#061E44] group-hover:text-[#B35200]">
                  {project.domain}
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  <span className="sr-only"> (membuka tab baru)</span>
                </span>
              </div>
            </a>
          ))}
        </div>

        <a
          href="https://www.rindotama.id/"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex flex-wrap items-center justify-between gap-x-6 gap-y-3 rounded-2xl border border-slate-200 bg-white p-6 transition-shadow hover:shadow-lg"
        >
          <span className="flex min-w-0 flex-1 basis-80 flex-col gap-1.5">
            <span className="text-[13px] font-bold text-[#B35200]">Company profile</span>
            <span className="text-xl font-bold text-[#061E44]">CV Rindotama Perkasa</span>
            <span className="text-[15px] leading-relaxed text-slate-600">
              Website company profile perusahaan dengan halaman profil, layanan, dan kontak.
            </span>
          </span>
          <span className="inline-flex min-h-[44px] items-center gap-1.5 text-[15px] font-bold text-[#061E44] group-hover:text-[#B35200]">
            rindotama.id
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            <span className="sr-only"> (membuka tab baru)</span>
          </span>
        </a>
      </div>
    </section>
  );
}
