'use client';

import { motion } from 'framer-motion';
import FlipCard, { type FlipCardData } from '@/components/ui/FlipCard';
import { ArrowRight } from 'lucide-react';

/* ─── DiceBear Dylan API ──────────────────────────────────────── */
// Style: "dylan" — friendly character avatars by Natalia Spivak (CC BY 4.0)
// API: https://api.dicebear.com/9.x/dylan/svg?seed=<name>&backgroundColor=<hex>&radius=20

function diceBearUrl(seed: string, bgColor: string): string {
  return `https://api.dicebear.com/9.x/dylan/svg?seed=${seed}&backgroundColor=${bgColor}&radius=20&size=80`;
}

/* ─── Service Data ────────────────────────────────────────────── */
const SERVICES: FlipCardData[] = [
  {
    iconUrl: diceBearUrl('WebDeveloper', 'ffdfbf'),
    title: 'Pembuatan Website',
    tagline: 'Wajah digital bisnis Anda di internet',
    description:
      'Kami buatkan halaman online untuk bisnis Anda agar bisa ditemukan di Google dan terlihat profesional — seperti brosur digital yang bisa diakses siapa saja, kapan saja.',
    features: [
      'Tampil profesional di Google',
      'Bisa dibuka di HP & laptop',
      'Mudah dikelola sendiri',
      'Dilengkapi form kontak',
    ],
    gradient: 'linear-gradient(135deg, #FF7A00, #FF9F44)',
    accentColor: '#FF7A00',
  },
  {
    iconUrl: diceBearUrl('MobileApp', '80cbc4'),
    title: 'Pembuatan Aplikasi',
    tagline: 'Aplikasi HP untuk Android & iOS',
    description:
      'Kami buatkan aplikasi khusus untuk bisnis Anda yang bisa diunduh di HP pelanggan — seperti Gojek atau Tokopedia, tapi sesuai kebutuhan bisnis Anda.',
    features: [
      'Tersedia di Android & iPhone',
      'Notifikasi ke pelanggan',
      'Mudah dipakai siapa saja',
      'Bisa terima pesanan online',
    ],
    gradient: 'linear-gradient(135deg, #3D8C95, #5BB8C4)',
    accentColor: '#3D8C95',
  },
  {
    iconUrl: diceBearUrl('Designer', 'ffd5dc'),
    title: 'Desain Digital',
    tagline: 'Logo, poster, & desain menarik',
    description:
      'Kami desainkan logo, poster promosi, brosur, kartu nama, dan semua kebutuhan visual bisnis Anda agar terlihat lebih profesional dan menarik.',
    features: [
      'Logo & brand identity',
      'Desain poster / banner',
      'Kartu nama & brosur',
      'Konten sosial media',
    ],
    gradient: 'linear-gradient(135deg, #6C5CE7, #A29BFE)',
    accentColor: '#6C5CE7',
  },
  {
    iconUrl: diceBearUrl('Filmmaker', '81d4fa'),
    title: 'Video & Photo Editing',
    tagline: 'Edit video & foto untuk promosi',
    description:
      'Kami bantu edit video promosi, company profile, konten TikTok/Reels, dan foto produk agar bisnis Anda lebih menarik di mata pelanggan.',
    features: [
      'Video promosi singkat',
      'Edit foto produk',
      'Konten TikTok & Reels',
      'Video company profile',
    ],
    gradient: 'linear-gradient(135deg, #0984E3, #74B9FF)',
    accentColor: '#0984E3',
  },
  {
    iconUrl: diceBearUrl('Student', 'a5d6a7'),
    title: 'Mahasiswa & Bisnis',
    tagline: 'Tugas, skripsi, & kebutuhan bisnis',
    description:
      'Kami bantu mahasiswa dan pelaku bisnis dalam pembuatan slide presentasi, desain infografis, laporan digital, dan kebutuhan lainnya agar hasilnya rapi dan profesional.',
    features: [
      'Slide presentasi menarik',
      'Desain infografis',
      'Laporan & proposal',
      'Poster ilmiah & bisnis',
    ],
    gradient: 'linear-gradient(135deg, #00B894, #55EFC4)',
    accentColor: '#00B894',
  },
];

/* ─── Section Props ───────────────────────────────────────────── */
interface ServicesSectionProps {
  showCTA?: boolean;
}

/* ─── Component ───────────────────────────────────────────────── */
export default function ServicesSection({ showCTA = false }: ServicesSectionProps) {
  return (
    <section id="layanan" className="services-section">
      {/* Decorative blobs */}
      <div className="services-blob services-blob--top" />
      <div className="services-blob services-blob--bottom" />

      <div className="services-container">
        {/* ── Header ── */}
        <div className="services-header">
          <motion.span
            className="services-badge"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Layanan Kami
          </motion.span>

          <motion.h2
            className="services-heading"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Solusi Tepat Untuk{' '}
            <span className="services-heading-accent">Pertumbuhan</span>{' '}
            Bisnis Anda
          </motion.h2>

          <motion.p
            className="services-subheading"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Arahkan kursor atau ketuk kartu untuk melihat detail layanan. Kami siap
            mewujudkan ide digital Anda dengan hasil yang profesional.
          </motion.p>
        </div>

        {/* ── Cards Grid ── */}
        <div className="services-grid">
          {SERVICES.map((service, index) => (
            <FlipCard key={service.title} data={service} index={index} />
          ))}
        </div>
      </div>

      {/* ── CTA Bar ── */}
      {showCTA && (
        <div className="services-cta-wrapper">
          <motion.div
            className="services-cta"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Glow */}
            <div className="services-cta-glow" />

            <div className="services-cta-inner">
              <div className="services-cta-text">
                <h3 className="services-cta-title">
                  Siap Meluncurkan Projek Anda?
                </h3>
                <p className="services-cta-desc">
                  Jadwalkan konsultasi gratis hari ini. Mari diskusikan bagaimana
                  kami bisa membantu mencapai target bisnis Anda.
                </p>
              </div>

              <div className="services-cta-buttons">
                <a href="/pricing" className="services-cta-btn-primary">
                  Lihat Paket Harga
                </a>
                <a href="/contact" className="services-cta-btn-outline">
                  Hubungi Kami <ArrowRight className="size-4" />
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </section>
  );
}
