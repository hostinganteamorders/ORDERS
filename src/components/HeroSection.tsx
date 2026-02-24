'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Zap } from 'lucide-react';
import { Playfair_Display, Plus_Jakarta_Sans, Outfit } from 'next/font/google';

const playfair = Playfair_Display({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  weight: ['400', '600', '700']
});

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700', '800']
});

const partners = [
  { src: '/images/sponsor/Baciraro.png', alt: 'Baciraro' },
  { src: '/images/sponsor/TanaNyiurLestari.png', alt: 'Tana Nyiur Lestari' },
  { src: '/images/sponsor/TrashRecycleCenter.png', alt: 'Trash Recycle Center' },
  { src: '/images/sponsor/ELMAST.png', alt: 'ELMast' },
];

export default function HeroSection() {
  return (
    <main className={`overflow-hidden ${outfit.className}`}>
      <section className="relative">
        {/* Grid Background */}
        <div
          className="absolute inset-0 -z-10 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(to right, #0F172A 1px, transparent 1px), linear-gradient(to bottom, #0F172A 1px, transparent 1px)`,
            backgroundSize: '35px 35px',
          }}
        />

        {/* Radial Mask Overlay */}
        <div
          className="absolute inset-0 -z-10"
          style={{
            background: 'radial-gradient(ellipse 80% 60% at 50% 0%, transparent 70%, white 100%)',
          }}
        />

        {/* Blue Glow Orb */}
        <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-80 w-2/3 -translate-x-1/2 rounded-full bg-blue-300/20 blur-3xl" />

        <div className="relative py-24 lg:py-32">
          <div className="mx-auto max-w-5xl px-6 md:px-12">
            <div className="text-center sm:mx-auto sm:w-10/12 lg:w-4/5">

              {/* Badge "New" */}
              <Link
                href="/portfolio"
                className="mx-auto mb-8 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-1 pr-3 py-1 text-sm shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <span className="rounded-full bg-orange-500 px-2 py-0.5 text-xs font-semibold text-white">
                  New
                </span>
                <span className="text-slate-600">Lihat project terbaru kami</span>
                <span className="h-4 w-px bg-slate-200" />
                <ArrowRight className="h-4 w-4 text-slate-400" />
              </Link>

              {/* Heading */}
              <h1 className="mt-2 text-4xl font-extrabold leading-tight tracking-tight text-slate-900 md:text-5xl xl:text-6xl xl:leading-[1.1]">
                Solusi Digital{' '}
                <span
                  className={`${playfair.className} italic font-bold pr-1`}
                  style={{
                    background: 'linear-gradient(90deg, #ff7a00, #3d8c95)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Terdepan
                </span>{' '}
                <br className="hidden sm:block" />
                untuk Bisnis Masa Depan
              </h1>

              {/* Description — desktop */}
              <p className="mx-auto mt-8 hidden max-w-2xl text-lg text-slate-500 sm:block">
                ORDERS hadir sebagai partner digital terpercaya yang menghadirkan inovasi
                teknologi untuk mengakselerasi pertumbuhan bisnis Anda dengan solusi modern
                dan terukur.
              </p>

              {/* Description — mobile */}
              <p className="mx-auto mt-6 max-w-md text-base text-slate-500 sm:hidden">
                Partner digital terpercaya untuk akselerasi bisnis Anda dengan inovasi teknologi modern.
              </p>

              {/* CTA */}
              <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-orange-500/30 transition-all duration-200 hover:-translate-y-0.5 hover:bg-orange-600 hover:shadow-orange-500/40"
                >
                  <Zap className="h-4 w-4" />
                  <span>Mulai Sekarang</span>
                </Link>
                <Link
                  href="/portfolio"
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 text-base font-semibold text-slate-700 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
                >
                  <span>Lihat Portfolio</span>
                  <ArrowRight className="h-4 w-4 text-slate-400" />
                </Link>
              </div>
            </div>

            {/* Stats */}
            <div className="mx-auto mt-16 grid max-w-lg grid-cols-3 gap-6 border-t border-slate-200 pt-10">
              {[
                { value: '50+', label: 'Proyek Selesai' },
                { value: '30+', label: 'Klien Puas' },
                { value: '5+', label: 'Tahun Pengalaman' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-2xl font-bold text-slate-900 lg:text-3xl">{stat.value}</p>
                  <p className="mt-1 text-sm text-slate-500">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Partner Logos */}
            <div className="mx-auto mt-14 max-w-3xl">
              <p className="mb-6 text-center text-xs font-semibold uppercase tracking-widest text-slate-400">
                Dipercaya oleh
              </p>
              <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-12">
                {partners.map((partner) => (
                  <div
                    key={partner.alt}
                    className="relative h-10 w-24 opacity-50 grayscale transition-all duration-300 hover:opacity-90 hover:grayscale-0 lg:h-12 lg:w-32"
                  >
                    <Image
                      src={partner.src}
                      alt={partner.alt}
                      fill
                      className="object-contain"
                    />
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}
