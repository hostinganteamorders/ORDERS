import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, MessageCircle } from 'lucide-react';

const WHATSAPP_URL =
  'https://wa.me/6282195965483?text=Halo!%20Saya%20ingin%20konsultasi%20gratis%20mengenai%20layanan%20ORDERS.';

const partners = [
  { src: '/images/sponsor/Baciraro.png', alt: 'Baciraro' },
  { src: '/images/sponsor/TanaNyiurLestari.png', alt: 'Tana Nyiur Lestari' },
  { src: '/images/sponsor/TrashRecycleCenter.png', alt: 'Trash Recycle Center' },
  { src: '/images/sponsor/ELMAST.png', alt: 'ELMAST' },
];

export default function HeroSection() {
  return (
    <section className="overflow-hidden bg-[#061E44] text-white">
      <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-10 px-5 pt-32 lg:flex-row lg:items-end lg:gap-12 lg:pt-36">
        <div className="flex w-full min-w-0 flex-1 flex-col gap-6 pb-4 lg:pb-20">
          <span className="inline-flex items-center gap-2 self-start rounded-full border border-white/25 px-3.5 py-1.5 text-[13px] font-semibold text-white/85">
            <span className="h-2 w-2 rounded-full bg-[#FF7A00]" aria-hidden="true" />
            Software house · Manado, Sulawesi Utara
          </span>

          <h1 className="text-4xl font-extrabold leading-[1.08] tracking-[-0.03em] text-white sm:text-5xl lg:text-[3.75rem]">
            Website, aplikasi, dan <span className="text-[#FF7A00]">otomasi AI</span> untuk bisnis
            Anda.
          </h1>

          <p className="max-w-[540px] text-lg leading-relaxed text-white/80">
            Tim developer dan desainer muda dari Manado. Konsultasi gratis, harga transparan, dan
            progres proyek bisa Anda pantau setiap minggu.
          </p>

          <div className="mt-2 flex flex-wrap gap-3">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[52px] items-center gap-2.5 rounded-xl bg-[#FF7A00] px-6 text-base font-bold text-[#061E44] transition-colors hover:bg-[#ff8d26]"
            >
              <MessageCircle className="h-5 w-5" aria-hidden="true" />
              Konsultasi gratis via WhatsApp
            </a>
            <Link
              href="/portfolio"
              className="inline-flex min-h-[52px] items-center gap-2.5 whitespace-nowrap rounded-xl border-[1.5px] border-white/40 px-6 text-base font-bold text-white transition-colors hover:bg-white/10"
            >
              Lihat portofolio
              <ArrowRight className="h-[18px] w-[18px]" aria-hidden="true" />
            </Link>
          </div>

          <p className="text-sm text-white/70">
            Website mulai <strong className="text-white">Rp 750.000</strong> · Aplikasi mobile mulai{' '}
            <strong className="text-white">Rp 2.000.000</strong>
          </p>
        </div>

        <div className="relative h-[380px] w-full max-w-[460px] shrink-0 sm:h-[460px] lg:h-[520px] lg:w-[460px]">
          <div
            className="absolute bottom-[-120px] left-1/2 h-[380px] w-[380px] -translate-x-1/2 rounded-full bg-[#FF7A00] sm:h-[460px] sm:w-[460px]"
            aria-hidden="true"
          />
          <Image
            src="/images/people/people.png"
            alt="Tim ORDERS mengenakan rompi lapangan dan membawa kamera"
            fill
            priority
            sizes="(min-width: 1024px) 460px, 100vw"
            className="object-contain object-bottom"
          />
        </div>
      </div>

      <div className="bg-[#0A2A5C]">
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center gap-x-7 gap-y-4 px-5 py-5">
          <span className="text-[13px] font-semibold uppercase tracking-[0.08em] text-white/70">
            Dipercaya oleh
          </span>
          <div className="flex flex-wrap gap-3">
            {partners.map((partner) => (
              <span
                key={partner.alt}
                className="relative block h-[52px] w-28 rounded-[10px] bg-white"
              >
                <Image
                  src={partner.src}
                  alt={partner.alt}
                  fill
                  sizes="112px"
                  className="object-contain p-2"
                />
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
