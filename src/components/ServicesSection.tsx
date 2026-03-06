'use client';

import { cn } from '@/lib/utils';
import {
  HoverSlider,
  HoverSliderImage,
  HoverSliderImageWrap,
  TextStaggerHover,
} from '@/components/ui/animated-slideshow';
import { ArrowRight } from 'lucide-react';

const SLIDES = [
  {
    id: 'slide-web',
    title: 'Pembuatan Website',
    imageUrl: '/images/services/web.png',
  },
  {
    id: 'slide-app',
    title: 'Pembuatan Aplikasi',
    imageUrl: '/images/services/android.png',
  },
  {
    id: 'slide-design',
    title: 'Desain Digital',
    imageUrl: '/images/services/desaingrafis.png',
  },
  {
    id: 'slide-video',
    title: 'Video & Photo Editing',
    imageUrl: '/images/services/video_foto.png',
  },
  {
    id: 'slide-seo',
    title: 'Mahasiswa & Bisnis',
    imageUrl: '/images/services/mood_board.png',
  },
];

interface ServicesSectionProps {
  /** Show the dark CTA bar at the bottom. Default: false (home page).
   *  Pass true on the dedicated services page. */
  showCTA?: boolean;
}

export default function ServicesSection({ showCTA = false }: ServicesSectionProps) {
  return (
    <section id="layanan" className="bg-slate-50 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute top-0 right-0 -translate-y-12 translate-x-1/3">
        <div className="w-[700px] h-[700px] rounded-full bg-gradient-to-tr from-orange-400/8 to-transparent blur-3xl" />
      </div>
      <div className="pointer-events-none absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/4">
        <div className="w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-teal-400/8 to-transparent blur-3xl" />
      </div>

      {/* ── Hover Slider ── */}
      <HoverSlider className="relative z-10 min-h-[85vh] flex flex-col justify-center px-6 md:px-12 lg:px-24 py-24">

        {/* Section label */}
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase bg-orange-500/10 text-orange-600 border border-orange-500/20 mb-6 self-start">
          Layanan Digital
        </span>

        {/* Heading */}
        <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-3 tracking-tight max-w-2xl leading-tight">
          Solusi Tepat Untuk{' '}
          <span className="text-orange-500">Pertumbuhan</span> Bisnis Anda
        </h2>
        <p className="text-slate-500 text-lg mb-14 max-w-xl">
          Hover atau ketuk pada layanan untuk melihat pratinjau visual. Kami siap mewujudkan ide digital Anda.
        </p>

        {/* Split layout */}
        <div className="flex flex-col lg:flex-row items-center lg:items-center justify-between gap-10 md:gap-16 w-full mb-10">

          {/* Left — service list */}
          <div className="flex flex-col space-y-4 md:space-y-6 w-full lg:w-1/2 order-2 lg:order-1 items-center lg:items-start text-center lg:text-left">
            {SLIDES.map((slide, index) => (
              <TextStaggerHover
                key={slide.id}
                index={index}
                text={slide.title}
                className="cursor-pointer text-2xl sm:text-3xl md:text-5xl font-extrabold uppercase tracking-tighter text-slate-900"
              />
            ))}
          </div>

          {/* Right — image stack */}
          <HoverSliderImageWrap className="w-full lg:w-1/2 max-w-sm md:max-w-md lg:max-w-lg rounded-3xl overflow-hidden shadow-2xl shadow-slate-900/10 ring-1 ring-slate-200 order-1 lg:order-2 aspect-[4/3] sm:aspect-auto">
            {SLIDES.map((slide, index) => (
              <div key={slide.id}>
                <HoverSliderImage
                  index={index}
                  imageUrl={slide.imageUrl}
                  src={slide.imageUrl}
                  alt={slide.title}
                  className={cn(
                    "size-full max-h-[420px] object-contain drop-shadow-2xl transition-transform duration-500",
                    (slide.title === "Desain Digital" || slide.title === "Pembuatan Aplikasi") && "scale-110"
                  )}
                  loading="eager"
                  decoding="async"
                />
              </div>
            ))}
          </HoverSliderImageWrap>
        </div>
      </HoverSlider>

      {/* ── CTA Bar — only on the services page ── */}
      {showCTA && (
        <div className="relative z-10 container-content pb-24">
          <div className="bg-slate-900 rounded-3xl p-8 md:p-12 relative overflow-hidden shadow-2xl">
            {/* Glowing bg */}
            <div className="absolute top-0 right-0 w-full h-full opacity-30 pointer-events-none">
              <div className="absolute right-[-10%] top-[-50%] w-[60%] h-[200%] bg-orange-500/30 blur-[100px] rounded-full transform rotate-12" />
            </div>

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="text-center md:text-left text-white max-w-xl">
                <h3 className="text-2xl md:text-3xl font-bold mb-3 text-orange-500">
                  Siap Meluncurkan Projek Anda?
                </h3>
                <p className="text-slate-300 text-lg">
                  Jadwalkan konsultasi gratis hari ini. Mari diskusikan bagaimana kami bisa membantu
                  mencapai target bisnis Anda.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 shrink-0 w-full sm:w-auto">
                <a
                  href="/pricing"
                  className="px-8 py-4 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-400 transition-all duration-300 shadow-[0_0_40px_rgba(249,115,22,0.4)] hover:shadow-[0_0_60px_rgba(249,115,22,0.6)] flex items-center justify-center gap-2"
                >
                  Lihat Paket Harga
                </a>
                <a
                  href="/contact"
                  className="px-8 py-4 bg-white/10 text-white font-bold rounded-xl border border-white/20 hover:bg-white/20 hover:border-white/40 transition-all duration-300 backdrop-blur-sm flex items-center justify-center gap-2"
                >
                  Hubungi Kami <ArrowRight className="size-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
