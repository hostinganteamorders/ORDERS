'use client';

import { useState, useEffect, useRef } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { 
  DollarCircleIcon, 
  ZapIcon, 
  Clock01Icon, 
  ShieldCheck,
  RocketIcon,
  ViewIcon
} from '@hugeicons/core-free-icons';

const features = [
  {
    icon: DollarCircleIcon,
    title: 'Investasi Cerdas',
    description: 'Solusi digital premium yang dirancang untuk memberikan nilai maksimal dengan harga kompetitif.',
    color: 'from-orange-500 to-orange-400',
  },
  {
    icon: ZapIcon,
    title: 'Kualitas & Kecepatan',
    description: 'Proses pengembangan efisien memastikan produk berkualitas tinggi diluncurkan tepat waktu.',
    color: 'from-sky-500 to-cyan-400',
  },
  {
    icon: Clock01Icon,
    title: 'Dukungan Penuh',
    description: 'Tim ahli kami siap menjadi partner digital Anda dengan dukungan dan konsultasi berkelanjutan.',
    color: 'from-emerald-500 to-green-400',
  },
  {
    icon: ShieldCheck,
    title: 'Solusi Tepat Sasaran',
    description: 'Setiap solusi dirancang eksklusif untuk menjawab tantangan dan kebutuhan unik bisnis Anda.',
    color: 'from-violet-500 to-purple-400',
  },
  {
    icon: RocketIcon,
    title: 'Inovasi Terdepan',
    description: 'Teknologi terkini memastikan solusi Anda modern dan relevan di masa depan.',
    color: 'from-rose-500 to-pink-400',
  },
  {
    icon: ViewIcon,
    title: 'Kolaborasi Transparan',
    description: 'Komunikasi terbuka dan update progres real-time di setiap fase pengerjaan.',
    color: 'from-amber-500 to-yellow-400',
  },
];

export default function WhyOrdersSection() {
  const [activeIndex, setActiveIndex] = useState(0);
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
    <section ref={sectionRef} id="kenapa-orders" className="section-dark">
      <div className="container-content">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white/10 text-white mb-4 transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            Keunggulan Kami
          </span>
          <h2
            className={`text-white mb-6 transition-all duration-700 delay-100 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            Mengapa Memilih{' '}
            <span className="text-orange-500">ORDERS</span>?
          </h2>
          <p
            className={`text-lg text-slate-300 transition-all duration-700 delay-200 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            Kami bukan sekadar vendor, kami adalah partner digital Anda. 
            Temukan alasan mengapa banyak klien memercayai kami.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              onMouseEnter={() => setActiveIndex(index)}
              className={`group relative p-6 rounded-2xl border transition-all duration-300 cursor-pointer ${
                activeIndex === index
                  ? 'bg-white/10 border-white/20 scale-[1.02]'
                  : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
              } ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              style={{ transitionDelay: `${300 + index * 100}ms` }}
            >
              {/* Icon */}
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white mb-4 transition-transform duration-300 group-hover:scale-110`}
              >
                <HugeiconsIcon icon={feature.icon} size={24} />
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                {feature.description}
              </p>

              {/* Hover Indicator */}
              <div
                className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${feature.color} rounded-b-2xl transition-all duration-300 ${
                  activeIndex === index ? 'w-full' : 'w-0'
                }`}
              />
            </div>
          ))}
        </div>

        {/* Bottom Stats */}
        <div
          className={`mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 transition-all duration-700 delay-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          {[
            { value: '100%', label: 'Kepuasan Klien' },
            { value: '24/7', label: 'Dukungan Aktif' },
            { value: '50+', label: 'Proyek Selesai' },
            { value: '5+', label: 'Tahun Pengalaman' },
          ].map((stat, index) => (
            <div
              key={index}
              className="text-center p-6 rounded-2xl bg-white/5 border border-white/10"
            >
              <p className="text-3xl md:text-4xl font-heading font-bold text-orange-500 mb-1">
                {stat.value}
              </p>
              <p className="text-sm text-slate-400">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
