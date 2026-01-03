'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { HugeiconsIcon } from '@hugeicons/react';
import { ZapIcon, ArrowRight01Icon, CheckmarkCircle02Icon, BulbIcon } from '@hugeicons/core-free-icons';

export default function CTASection() {
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
    <section ref={sectionRef} className="section bg-white overflow-hidden">
      <div className="container-content">
        <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0">
            <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-sky-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
                backgroundSize: '32px 32px',
              }}
            />
          </div>

          <div className="relative z-10 grid lg:grid-cols-2 gap-12 p-8 md:p-12 lg:p-16 items-center">
            {/* Left Content */}
            <div
              className={`text-center lg:text-left transition-all duration-1000 ${
                isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
              }`}
            >
              <h2 className="text-white text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                Siap Wujudkan Proyek{' '}
                <span className="relative inline-block">
                  <span className="text-orange-500">Impian Anda?</span>
                  <svg
                    className="absolute -bottom-2 left-0 w-full h-3"
                    viewBox="0 0 120 8"
                    fill="none"
                  >
                    <path
                      d="M2 6C20 2 40 2 58 4C76 6 96 6 118 4"
                      stroke="#FF7A00"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </h2>
              <p className="text-slate-300 text-lg mb-8 max-w-lg mx-auto lg:mx-0">
                Dapatkan konsultasi gratis dengan tim ahli kami untuk memilih 
                solusi terbaik sesuai kebutuhan bisnis Anda.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <a
                  href="https://wa.me/6282195965483?text=Halo!%20Saya%20ingin%20konsultasi%20gratis%20mengenai%20layanan%20yang%20sesuai%20untuk%20bisnis%20saya."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary text-base"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.106" />
                  </svg>
                  Konsultasi Gratis
                </a>
                <Link
                  href="/pricing"
                  className="btn border-2 border-white/20 text-white hover:bg-white/10 focus:ring-white/20"
                >
                  Lihat Paket Harga
                  <HugeiconsIcon icon={ArrowRight01Icon} size={20} />
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-6">
                <div className="flex items-center gap-2 text-slate-400 text-sm">
                  <HugeiconsIcon icon={CheckmarkCircle02Icon} size={20} className="text-emerald-400" />
                  Tanpa Komitmen
                </div>
                <div className="flex items-center gap-2 text-slate-400 text-sm">
                  <HugeiconsIcon icon={CheckmarkCircle02Icon} size={20} className="text-emerald-400" />
                  Respon Cepat
                </div>
                <div className="flex items-center gap-2 text-slate-400 text-sm">
                  <HugeiconsIcon icon={CheckmarkCircle02Icon} size={20} className="text-emerald-400" />
                  Gratis Estimasi
                </div>
              </div>
            </div>

            {/* Right Visual */}
            <div
              className={`relative transition-all duration-1000 delay-200 ${
                isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
              }`}
            >
              <div className="relative max-w-md mx-auto">
                {/* Main Image */}
                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                  <Image
                    src="/images/people/people.png"
                    alt="Professional Team"
                    width={500}
                    height={400}
                    className="w-full h-auto object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
                </div>

                {/* Floating Card 1 */}
                <div className="absolute -top-4 -right-4 bg-white rounded-xl shadow-large p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                      <HugeiconsIcon icon={ZapIcon} size={20} className="text-orange-500" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">Let&apos;s Start!</p>
                      <p className="text-xs text-muted">Mulai Sekarang</p>
                    </div>
                  </div>
                </div>

                {/* Floating Card 2 */}
                <div className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-large p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center">
                      <HugeiconsIcon icon={BulbIcon} size={20} className="text-sky-500" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">Free Consultation</p>
                      <p className="text-xs text-muted">Konsultasi Gratis</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
