'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { HugeiconsIcon } from '@hugeicons/react';
import { ZapIcon, ArrowRight01Icon, AiChat02Icon, SparklesIcon } from '@hugeicons/core-free-icons';

const stats = [
  { value: '50+', label: 'Proyek Selesai' },
  { value: '30+', label: 'Klien Puas' },
  { value: '5+', label: 'Tahun Pengalaman' },
];

const partners = [
  { src: '/images/sponsor/Baciraro.png', alt: 'Baciraro' },
  { src: '/images/sponsor/TanaNyiurLestari.png', alt: 'Tana Nyiur Lestari' },
  { src: '/images/sponsor/TrashRecycleCenter.png', alt: 'Trash Recycle Center' },
  { src: '/images/sponsor/ELMAST.png', alt: 'ELMast' },
];

export default function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const openChatbot = () => {
    const chatbotButton = document.querySelector('[aria-label="Buka chat"]') as HTMLButtonElement;
    if (chatbotButton) {
      chatbotButton.click();
    }
  };

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-slate-50 via-white to-orange-50/30 pt-20"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient Orbs - Static */}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl" />
        
        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(to right, #0F172A 1px, transparent 1px), linear-gradient(to bottom, #0F172A 1px, transparent 1px)`,
            backgroundSize: '64px 64px',
          }}
        />
      </div>

      <div className="container-content relative z-10 py-12 lg:py-0">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-[calc(100vh-200px)]">
          {/* Left Column - Content */}
          <div className="flex flex-col gap-8 text-center lg:text-left">
            {/* Heading */}
            <h1
              className={`text-balance transition-all duration-700 delay-100 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              Solusi Digital{' '}
              <span className="gradient-text">Terdepan</span>{' '}
              untuk Bisnis Masa Depan
            </h1>

            {/* Description */}
            <p
              className={`text-lg lg:text-xl max-w-xl mx-auto lg:mx-0 transition-all duration-700 delay-200 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              ORDERS hadir sebagai partner digital terpercaya yang menghadirkan 
              inovasi teknologi untuk mengakselerasi pertumbuhan bisnis Anda.
            </p>

            {/* CTA Buttons */}
            <div
              className={`flex flex-col sm:flex-row gap-4 justify-center lg:justify-start transition-all duration-700 delay-300 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <Link href="/contact" className="btn-primary text-base">
                <HugeiconsIcon icon={ZapIcon} size={20} />
                Mulai Sekarang
              </Link>
              <Link href="/portfolio" className="btn-outline text-base">
                Lihat Portfolio
                <HugeiconsIcon icon={ArrowRight01Icon} size={20} />
              </Link>
            </div>

            {/* AI Assistant Card */}
            <div
              className={`transition-all duration-700 delay-400 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <button
                onClick={openChatbot}
                className="w-full sm:w-auto card-hover p-4 flex items-center gap-4 text-left group"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-sky-500 flex items-center justify-center text-white shrink-0">
                  <HugeiconsIcon icon={AiChat02Icon} size={24} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-primary">AI Assistant</p>
                  <p className="text-foreground font-semibold">Tanya Orders AI</p>
                  <p className="text-sm text-muted truncate">Siap membantu pertanyaan Anda</p>
                </div>
                <HugeiconsIcon icon={ArrowRight01Icon} size={20} className="text-muted group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </button>
            </div>

            {/* Stats */}
            <div
              className={`grid grid-cols-3 gap-6 pt-8 border-t border-slate-200 transition-all duration-700 delay-500 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              {stats.map((stat, index) => (
                <div key={index} className="text-center lg:text-left">
                  <p className="text-2xl lg:text-3xl font-heading font-bold text-foreground">
                    {stat.value}
                  </p>
                  <p className="text-sm text-muted">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Visual */}
          <div
            className={`relative transition-all duration-1000 delay-300 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
            }`}
          >
            {/* Main Image Container */}
            <div className="relative aspect-square max-w-lg mx-auto">
              {/* Background Glow - Static */}
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-sky-500/20 rounded-3xl blur-2xl scale-90" />
              
              {/* Image Frame */}
              <div className="relative bg-white rounded-3xl shadow-large overflow-hidden border border-slate-200">
                <Image
                  src="/images/ling.png"
                  alt="ORDERS Digital Solutions"
                  width={600}
                  height={600}
                  className="w-full h-full object-cover"
                  priority
                />
                
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
                
                {/* Floating Badge */}
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="glass rounded-2xl p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center">
                        <HugeiconsIcon icon={SparklesIcon} size={20} className="text-orange-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">Eco Digital Initiative</p>
                        <p className="text-xs text-muted">Teknologi Ramah Lingkungan</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Element - Orange (Static, no animation) */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-orange-500 rounded-2xl shadow-glow-primary flex items-center justify-center">
                <HugeiconsIcon icon={ZapIcon} size={40} color="white" />
              </div>
            </div>
          </div>
        </div>

        {/* Partners Section */}
        <div
          className={`mt-16 lg:mt-0 pb-8 transition-all duration-700 delay-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <p className="text-sm text-muted text-center mb-6 font-medium tracking-wider uppercase">
            Didukung oleh
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-12">
            {partners.map((partner, index) => (
              <div
                key={index}
                className="relative h-10 w-24 lg:h-12 lg:w-32 grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-300 cursor-pointer"
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
    </section>
  );
}
