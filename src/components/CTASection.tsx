import Link from 'next/link';
import { ArrowRight, MessageCircle } from 'lucide-react';

const WHATSAPP_URL =
  'https://wa.me/6282195965483?text=Halo!%20Saya%20ingin%20konsultasi%20gratis%20mengenai%20layanan%20yang%20sesuai%20untuk%20bisnis%20saya.';

export default function CTASection() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-[1200px] px-5 pb-24">
        <div className="flex flex-wrap items-center justify-between gap-8 rounded-3xl bg-[#061E44] p-8 text-white md:p-14">
          <div className="flex min-w-0 flex-1 basis-[420px] flex-col gap-4">
            <h2 className="text-3xl font-extrabold leading-[1.15] tracking-[-0.025em] text-white md:text-[2.75rem]">
              Punya ide proyek? <span className="text-[#FF7A00]">Ceritakan ke kami.</span>
            </h2>
            <p className="text-[17px] leading-relaxed text-white/80">
              Konsultasi dan estimasi biaya gratis, tanpa komitmen. Biasanya kami balas di hari yang
              sama.
            </p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[52px] items-center justify-center gap-2.5 whitespace-nowrap rounded-xl bg-[#FF7A00] px-6 text-base font-bold text-[#061E44] transition-colors hover:bg-[#ff8d26]"
            >
              <MessageCircle className="h-5 w-5" aria-hidden="true" />
              Chat via WhatsApp
            </a>
            <Link
              href="/pricing"
              className="inline-flex min-h-[52px] items-center justify-center gap-2.5 whitespace-nowrap rounded-xl border-[1.5px] border-white/40 px-6 text-base font-bold text-white transition-colors hover:bg-white/10"
            >
              Lihat paket harga
              <ArrowRight className="h-[18px] w-[18px]" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
