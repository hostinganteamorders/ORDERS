import Link from 'next/link';
import { ArrowRight, Bot, Globe, PenTool, Smartphone } from 'lucide-react';

const SERVICES = [
  {
    icon: Globe,
    title: 'Website',
    text: 'Company profile, toko online, website desa dan yayasan. Cepat, rapi di HP, dan terdaftar di Google.',
    price: 'Mulai Rp 1.500.000',
  },
  {
    icon: Smartphone,
    title: 'Aplikasi Mobile & Web',
    text: 'Aplikasi Android/iOS dan sistem internal: kasir, pemesanan, inventaris, sampai dashboard keuangan.',
    price: 'Mulai Rp 5.000.000',
  },
  {
    icon: Bot,
    title: 'AI Otomasi & Chatbot',
    text: 'Balas WhatsApp/Instagram otomatis, follow-up pelanggan, dan laporan harian tanpa tambah pegawai.',
    price: 'Harga sesuai kebutuhan',
  },
  {
    icon: PenTool,
    title: 'Desain & Branding',
    text: 'Logo, brand guideline, konten media sosial, serta foto dan video profil usaha.',
    price: 'Lihat paket desain',
  },
];

export default function ServicesPreview() {
  return (
    <section className="bg-white">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-12 px-5 py-24">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex max-w-[640px] flex-col gap-3">
            <span className="text-sm font-bold uppercase tracking-[0.08em] text-[#B35200]">
              Layanan
            </span>
            <h2 className="text-3xl font-extrabold leading-[1.15] tracking-[-0.025em] text-[#061E44] md:text-[2.6rem]">
              Apa yang bisa kami kerjakan untuk Anda
            </h2>
          </div>
          <Link
            href="/dashboard"
            className="inline-flex min-h-[44px] items-center gap-2 text-base font-bold text-[#061E44] hover:text-[#B35200]"
          >
            Lihat semua layanan
            <ArrowRight className="h-[18px] w-[18px]" aria-hidden="true" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.title}
                className="flex flex-col gap-4 rounded-2xl border border-slate-200 p-7"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#FFF1E5] text-[#B35200]">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <h3 className="text-xl font-bold text-[#061E44]">{service.title}</h3>
                <p className="flex-1 text-[15px] leading-relaxed text-slate-600">{service.text}</p>
                <span className="text-sm font-semibold text-[#061E44]">{service.price}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
