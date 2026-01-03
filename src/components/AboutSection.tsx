'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { HugeiconsIcon } from '@hugeicons/react';
import { UserGroup02Icon, BulbIcon, Globe02Icon, ZapIcon, ViewIcon, ShieldCheck } from '@hugeicons/core-free-icons';

const features = [
  {
    icon: UserGroup02Icon,
    title: 'Tim Muda Berbakat',
    description: 'Digerakkan oleh talenta muda dengan jiwa inovatif dan semangat kolaborasi tinggi.',
  },
  {
    icon: BulbIcon,
    title: 'Solusi Inovatif',
    description: 'Menghadirkan teknologi terkini untuk solusi digital yang efektif dan berkelanjutan.',
  },
  {
    icon: Globe02Icon,
    title: 'Ramah Lingkungan',
    description: 'Komitmen terhadap praktik digital yang mendukung keberlanjutan lingkungan.',
  },
  {
    icon: ZapIcon,
    title: 'Eksekusi Cepat',
    description: 'Proses pengerjaan yang efisien dengan hasil berkualitas tinggi tepat waktu.',
  },
];

export default function AboutSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} id="tentang-kami" className="section bg-white">
      <div className="container-content">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span
            className={`badge-secondary mb-4 transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            Tentang Kami
          </span>
          <h2
            className={`mb-6 transition-all duration-700 delay-100 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            Inovasi dari Anak Muda{' '}
            <span className="gradient-text">Berbakat</span>
          </h2>
          <p
            className={`text-lg transition-all duration-700 delay-200 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            Orders adalah startup yang didirikan oleh sekelompok anak muda kreatif 
            dengan satu visi: menghadirkan solusi digital yang memukau dan efektif.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left - Image */}
          <div
            className={`relative transition-all duration-1000 delay-200 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
            }`}
          >
            <div className="relative aspect-square max-w-md mx-auto">
              {/* Background Elements */}
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-sky-500/10 rounded-3xl -rotate-6 scale-95" />
              <div className="absolute inset-0 bg-gradient-to-tr from-sky-500/10 to-orange-500/10 rounded-3xl rotate-3 scale-95" />
              
              {/* Main Image */}
              <div className="relative bg-white rounded-3xl shadow-large overflow-hidden">
                <Image
                  src="/images/logo_about.png"
                  alt="ORDERS Team"
                  width={500}
                  height={500}
                  className="w-full h-full object-contain p-8"
                />
              </div>
            </div>
          </div>

          {/* Right - Content */}
          <div
            className={`transition-all duration-1000 delay-300 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
            }`}
          >
            {/* Features Grid */}
            <div className="grid sm:grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="card-hover p-5"
                  style={{ transitionDelay: `${400 + index * 100}ms` }}
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500/10 to-sky-500/10 flex items-center justify-center text-orange-500 mb-4">
                    <HugeiconsIcon icon={feature.icon} size={24} />
                  </div>
                  <h4 className="text-lg font-semibold text-foreground mb-2">
                    {feature.title}
                  </h4>
                  <p className="text-sm text-muted">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Quote */}
            <div className="mt-8 p-6 bg-gradient-to-r from-orange-500/5 to-sky-500/5 rounded-2xl border-l-4 border-orange-500">
              <p className="text-foreground italic">
                &ldquo;Kami percaya bahwa kemajuan digital harus dapat diakses oleh semua 
                bisnis, besar maupun kecil. Inilah yang mendorong kami untuk terus berinovasi.&rdquo;
              </p>
              <p className="text-sm text-muted mt-3 font-medium">
                — Tim ORDERS
              </p>
            </div>
          </div>
        </div>

        {/* Vision & Mission */}
        <div className="mt-24">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span
              className={`badge-primary mb-4 transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              Visi & Misi
            </span>
            <h3
              className={`text-3xl md:text-4xl font-bold transition-all duration-700 delay-100 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              Komitmen Kami untuk{' '}
              <span className="gradient-text">Indonesia</span>
            </h3>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Vision Card */}
            <div
              className={`card-hover p-8 transition-all duration-700 delay-200 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white">
                  <HugeiconsIcon icon={ViewIcon} size={28} />
                </div>
                <h4 className="text-2xl font-bold">Visi</h4>
              </div>
              <p className="text-muted leading-relaxed">
                Menjadi mitra digital terdepan yang mendorong inovasi dan pertumbuhan 
                berkelanjutan bagi setiap bisnis di Indonesia.
              </p>
            </div>

            {/* Mission Card */}
            <div
              className={`card-hover p-8 transition-all duration-700 delay-300 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-500 to-sky-600 flex items-center justify-center text-white">
                  <HugeiconsIcon icon={ShieldCheck} size={28} />
                </div>
                <h4 className="text-2xl font-bold">Misi</h4>
              </div>
              <p className="text-muted leading-relaxed">
                Memberikan solusi digital berkualitas tinggi yang fleksibel dan terjangkau, 
                serta mengedepankan praktik ramah lingkungan dalam setiap proyek.
              </p>
            </div>
          </div>

          {/* Bottom CTA */}
          <div
            className={`mt-12 text-center transition-all duration-700 delay-400 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <div className="inline-flex items-center gap-4 p-4 bg-gradient-to-r from-orange-500/5 to-sky-500/5 rounded-2xl">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-sky-500 flex items-center justify-center text-white">
                <HugeiconsIcon icon={Globe02Icon} size={24} />
              </div>
              <div className="text-left">
                <p className="font-semibold text-foreground">
                  Bersama Membangun Masa Depan Digital Indonesia
                </p>
                <p className="text-sm text-muted">
                  Teknologi terdepan dengan komitmen keberlanjutan
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
