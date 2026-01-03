'use client';

import Link from 'next/link';
import Image from 'next/image';
import { HugeiconsIcon } from '@hugeicons/react';
import { InstagramIcon, Facebook01Icon, WhatsappIcon } from '@hugeicons/core-free-icons';

const footerSections = [
  {
    title: 'Layanan',
    links: [
      { label: 'Pembuatan Aplikasi', href: '/dashboard' },
      { label: 'Pembuatan Website', href: '/dashboard' },
      { label: 'Desain Digital', href: '/dashboard' },
      { label: 'Portfolio', href: '/portfolio' },
    ],
  },
  {
    title: 'Perusahaan',
    links: [
      { label: 'Tentang Kami', href: '/dashboard' },
      { label: 'Tim Kami', href: '/team' },
      { label: 'Karir', href: '/contact' },
      { label: 'Kontak', href: '/contact' },
    ],
  },
  {
    title: 'Dukungan',
    links: [
      { label: 'Dokumentasi', href: '/pricing' },
      { label: 'FAQ', href: '/pricing' },
      { label: 'Kebijakan Privasi', href: '/contact' },
    ],
  },
];

const socialLinks = [
  {
    href: 'https://www.instagram.com/teamorders25',
    label: 'Instagram',
    icon: InstagramIcon,
  },
  {
    href: 'https://www.facebook.com/share/1CLDWp53W7/',
    label: 'Facebook',
    icon: Facebook01Icon,
  },
  {
    href: 'https://wa.me/6282195965483?text=Halo!%20Saya%20tertarik%20dengan%20layanan%20ORDERS.',
    label: 'WhatsApp',
    icon: WhatsappIcon,
  },
];

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="container-content py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-6">
              <div className="relative w-10 h-10">
                <Image
                  src="/images/logo.png"
                  alt="ORDERS Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <span className="text-orange-500 font-heading font-bold text-xl">
                  ORDERS
                </span>
                <p className="text-xs text-sky-400">Organize. Develop. Thrive.</p>
              </div>
            </Link>
            <p className="text-slate-400 mb-6 max-w-sm">
              Solusi digital modern untuk membantu bisnis Anda bertumbuh dan 
              beradaptasi di era digital dengan teknologi terdepan.
            </p>
            
            {/* Social Links */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-white/5 hover:bg-orange-500 flex items-center justify-center text-slate-400 hover:text-white transition-all duration-300 cursor-pointer"
                  aria-label={social.label}
                >
                  <HugeiconsIcon icon={social.icon} size={20} />
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="text-white font-semibold mb-5">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-slate-400 hover:text-orange-500 transition-colors duration-200 text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} ORDERS. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-slate-500">
            <Link href="/contact" className="hover:text-orange-500 transition-colors">
              Kebijakan Privasi
            </Link>
            <Link href="/contact" className="hover:text-orange-500 transition-colors">
              Syarat & Ketentuan
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
