'use client';

import { Shield, Users, Zap, TrendingUp } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

/* ── Tiny Card primitives ─────────────────────────────── */
function Card({ className = '', children }: { className?: string; children: React.ReactNode }) {
  return (
    <div
      className={`rounded-2xl border border-slate-200 bg-white overflow-hidden transition-all duration-300 hover:border-orange-400/40 hover:shadow-[0_4px_24px_rgba(249,115,22,0.10)] shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}

function CardContent({ className = '', children }: { className?: string; children: React.ReactNode }) {
  return <div className={`p-6 ${className}`}>{children}</div>;
}

/* ── Animation helper ─────────────────────────────────── */
function useReveal() {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => e.isIntersecting && setVisible(true), { threshold: 0.08 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

/* ── Main Section ─────────────────────────────────────── */
export default function WhyOrdersSection() {
  const { ref, visible } = useReveal();

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      id="kenapa-orders"
      className="relative py-24 md:py-32 bg-white overflow-hidden"
    >
      {/* Subtle ambient glow (light) */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-orange-400/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-sky-400/5 rounded-full blur-[100px]" />
      </div>

      <div className="container-content relative z-10">
        {/* ── Header ──────────────────────────────── */}
        <div
          className={`text-center max-w-2xl mx-auto mb-16 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase bg-orange-500/10 text-orange-600 border border-orange-500/20 mb-5">
            Keunggulan Kami
          </span>
          <h2 className="text-slate-900 mb-5">
            Mengapa Memilih{' '}
            <span className="text-orange-500">ORDERS</span>?
          </h2>
          <p className="text-slate-500 text-lg leading-relaxed">
            Kami bukan sekadar vendor — kami adalah partner digital Anda yang berkomitmen penuh pada pertumbuhan bisnis Anda.
          </p>
        </div>

        {/* ── Bento Grid ──────────────────────────── */}
        <div
          className={`grid grid-cols-6 gap-3 transition-all duration-700 delay-200 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
        >
          {/* Card 1 — 100% Kepuasan (col-span 2) */}
          <Card className="col-span-6 lg:col-span-2 flex">
            <CardContent className="m-auto flex flex-col items-center py-10">
              <div className="relative flex h-24 w-56 items-center justify-center">
                <svg
                  className="text-orange-500/10 absolute inset-0 size-full"
                  viewBox="0 0 254 104"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M112.891 97.7022C140.366 97.0802 171.004 94.6715 201.087 87.5116C210.43 85.2881 219.615 82.6412 228.284 78.2473C232.198 76.3179 235.905 73.9942 239.348 71.3124C241.85 69.2557 243.954 66.7571 245.555 63.9408C249.34 57.3235 248.281 50.5341 242.498 45.6109C239.033 42.7237 235.228 40.2703 231.169 38.3054C219.443 32.7209 207.141 28.4382 194.482 25.534C184.013 23.1927 173.358 21.7755 162.64 21.2989C161.376 21.3512 160.113 21.181 158.908 20.796C158.034 20.399 156.857 19.1682 156.962 18.4535C157.115 17.8927 157.381 17.3689 157.743 16.9139C158.104 16.4588 158.555 16.0821 159.067 15.8066C160.14 15.4683 161.274 15.3733 162.389 15.5286C179.805 15.3566 196.626 18.8373 212.998 24.462C220.978 27.2494 228.798 30.4747 236.423 34.1232C240.476 36.1159 244.202 38.7131 247.474 41.8258C254.342 48.2578 255.745 56.9397 251.841 65.4892C249.793 69.8582 246.736 73.6777 242.921 76.6327C236.224 82.0192 228.522 85.4602 220.502 88.2924C205.017 93.7847 188.964 96.9081 172.738 99.2109C153.442 101.949 133.993 103.478 114.506 103.79C91.1468 104.161 67.9334 102.97 45.1169 97.5831C36.0094 95.5616 27.2626 92.1655 19.1771 87.5116C13.839 84.5746 9.1557 80.5802 5.41318 75.7725C-0.54238 67.7259 -1.13794 59.1763 3.25594 50.2827C5.82447 45.3918 9.29572 41.0315 13.4863 37.4319C24.2989 27.5721 37.0438 20.9681 50.5431 15.7272C68.1451 8.8849 86.4883 5.1395 105.175 2.83669C129.045 0.0992292 153.151 0.134761 177.013 2.94256C197.672 5.23215 218.04 9.01724 237.588 16.3889C240.089 17.3418 242.498 18.5197 244.933 19.6446C246.627 20.4387 247.725 21.6695 246.997 23.615C246.455 25.1105 244.814 25.5605 242.63 24.5811C230.322 18.9961 217.233 16.1904 204.117 13.4376C188.761 10.3438 173.2 8.36665 157.558 7.52174C129.914 5.70776 102.154 8.06792 75.2124 14.5228C60.6177 17.8788 46.5758 23.2977 33.5102 30.6161C26.6595 34.3329 20.4123 39.0673 14.9818 44.658C12.9433 46.8071 11.1336 49.1622 9.58207 51.6855C4.87056 59.5336 5.61172 67.2494 11.9246 73.7608C15.2064 77.0494 18.8775 79.925 22.8564 82.3236C31.6176 87.7101 41.3848 90.5291 51.3902 92.5804C70.6068 96.5773 90.0219 97.7419 112.891 97.7022Z"
                    fill="currentColor"
                  />
                </svg>
                <span className="relative mx-auto block w-fit text-5xl font-bold text-slate-900">100%</span>
              </div>
              <h3 className="mt-6 text-center text-2xl font-bold text-slate-900">Kepuasan Klien</h3>
              <p className="mt-2 text-center text-sm text-slate-500 max-w-[200px]">
                Setiap proyek diselesaikan dengan standar tertinggi hingga klien benar-benar puas.
              </p>
            </CardContent>
          </Card>

          {/* Card 2 — Aman & Terpercaya (col-span 2) */}
          <Card className="col-span-6 sm:col-span-3 lg:col-span-2">
            <CardContent className="pt-8">
              <div className="relative mx-auto flex aspect-square size-32 rounded-full border border-slate-200 before:absolute before:-inset-2 before:rounded-full before:border before:border-slate-100 items-center justify-center bg-orange-50">
                <Shield className="size-12 text-orange-500" strokeWidth={1.25} />
              </div>
              <div className="mt-6 space-y-2 text-center">
                <h3 className="text-lg font-bold text-slate-900">Aman &amp; Terpercaya</h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Keamanan data klien adalah prioritas utama kami. Sistem kami dibangun dengan security layer terbaik.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Card 3 — Performa Secepat Kilat (col-span 2) */}
          <Card className="col-span-6 sm:col-span-3 lg:col-span-2">
            <CardContent className="pt-8">
              {/* Mini chart SVG */}
              <div className="px-4">
                <svg className="w-full text-orange-400/40" viewBox="0 0 386 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="wos-chart-grad" x1="3" y1="0" x2="3" y2="80" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#f97316" stopOpacity="0.18" />
                      <stop offset="1" stopColor="#f97316" stopOpacity="0.01" />
                    </linearGradient>
                  </defs>
                  <path
                    fillRule="evenodd" clipRule="evenodd"
                    d="M3 80C3 80 14 60 35 55C56 50 66 49 66 49C66 49 80 49 92 49C104 49 101 38 109 38C117 38 117 58 125 58C133 58 142 48 154 49C165 51 187 58 194 58C201 58 206 38 214 38C222 38 239 60 244 58C250 56 259 35 266 35C272 35 284 55 287 55C295 55 300 44 305 44C312 44 323 39 336 38C348 37 348 51 364 49C368 49 373 50 376 54C379 57 381 61 383 66C384 70 383 80 383 80Z"
                    fill="url(#wos-chart-grad)"
                  />
                  <path
                    d="M3 75C3 75 15 59 36 53C57 48 67 47 67 47C80 47 91 47 92 47C104 47 100 39 109 39C117 39 118 57 125 57C133 57 142 48 154 49C165 51 186 57 194 57C201 57 205 39 213 39C221 39 238 59 244 57C249 55 258 35 265 36C271 36 283 54 286 54C294 54 300 44 304 44C311 44 322 40 334 39C346 38 347 51 362 49C377 48 383 65 383 65"
                    stroke="#f97316"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <div className="mt-8 space-y-2 text-center">
                <h3 className="text-lg font-bold text-slate-900">Performa Secepat Kilat</h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Solusi kami dioptimalkan untuk kecepatan maksimal — website dan aplikasi yang responsif di semua perangkat.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Card 4 — Inovasi Terdepan (col-span 3) */}
          <Card className="col-span-6 lg:col-span-3">
            <CardContent className="grid sm:grid-cols-2 pt-6 gap-6">
              <div className="relative z-10 flex flex-col justify-between space-y-10 lg:space-y-6">
                <div className="relative flex aspect-square size-12 rounded-full border border-slate-200 before:absolute before:-inset-2 before:rounded-full before:border before:border-slate-100 items-center justify-center bg-orange-50">
                  <Zap className="size-5 text-orange-500" strokeWidth={1.5} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-slate-900">Inovasi Terdepan</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    Kami selalu menggunakan teknologi terkini — AI, automation, dan framework modern untuk solusi masa depan.
                  </p>
                </div>
              </div>

              {/* Code snippet decoration */}
              <div className="relative -mb-6 -mr-6 mt-6 h-fit rounded-tl-2xl border-l border-t border-slate-200 bg-slate-50 p-5 sm:ml-0">
                <div className="absolute left-3 top-2 flex gap-1.5">
                  <span className="block size-2 rounded-full bg-slate-300" />
                  <span className="block size-2 rounded-full bg-slate-300" />
                  <span className="block size-2 rounded-full bg-slate-300" />
                </div>
                <div className="mt-4 space-y-1.5 font-mono text-xs">
                  <div><span className="text-orange-600">const</span> <span className="text-sky-600">solution</span> <span className="text-slate-400">= await</span></div>
                  <div className="pl-3"><span className="text-emerald-600">orders</span><span className="text-slate-400">.</span><span className="text-yellow-600">build</span><span className="text-slate-400">({'{'}</span></div>
                  <div className="pl-6"><span className="text-violet-600">quality</span><span className="text-slate-400">: </span><span className="text-orange-500">&apos;premium&apos;</span><span className="text-slate-400">,</span></div>
                  <div className="pl-6"><span className="text-violet-600">speed</span><span className="text-slate-400">: </span><span className="text-orange-500">&apos;maximum&apos;</span><span className="text-slate-400">,</span></div>
                  <div className="pl-6"><span className="text-violet-600">support</span><span className="text-slate-400">: </span><span className="text-emerald-600">24_7</span></div>
                  <div className="pl-3"><span className="text-slate-400">{'}'});</span></div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card 5 — Kolaborasi Transparan (col-span 3) */}
          <Card className="col-span-6 lg:col-span-3">
            <CardContent className="grid sm:grid-cols-2 h-full pt-6 gap-6">
              <div className="relative z-10 flex flex-col justify-between space-y-10 lg:space-y-6">
                <div className="relative flex aspect-square size-12 rounded-full border border-slate-200 before:absolute before:-inset-2 before:rounded-full before:border before:border-slate-100 items-center justify-center bg-orange-50">
                  <Users className="size-5 text-orange-500" strokeWidth={1.5} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-slate-900">Kolaborasi Transparan</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    Update progres real-time, komunikasi terbuka, dan laporan berkala — Anda selalu tahu apa yang sedang kami kerjakan.
                  </p>
                </div>
              </div>

              {/* Team avatars */}
              <div className="relative before:absolute before:inset-0 before:mx-auto before:w-px before:bg-slate-200 sm:-my-6 sm:-mr-6 mt-6">
                <div className="relative flex h-full flex-col justify-center space-y-5 py-6">
                  {/* Avatar row right */}
                  <div className="relative flex w-[calc(50%+0.875rem)] items-center justify-end gap-2.5">
                    <span className="block h-fit rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-600 shadow-sm">
                      Konsultasi
                    </span>
                    <div className="size-8 rounded-full ring-2 ring-white overflow-hidden bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white text-xs font-bold">
                      <img src="https://api.dicebear.com/9.x/lorelei/svg?seed=Felix&backgroundColor=transparent" alt="RA" className="w-full h-full object-cover" />
                    </div>
                  </div>
                  {/* Avatar row left */}
                  <div className="relative ml-[calc(50%-1rem)] flex items-center gap-2.5">
                    <div className="size-9 rounded-full ring-2 ring-white overflow-hidden bg-gradient-to-br from-sky-500 to-cyan-600 flex items-center justify-center text-white text-xs font-bold">
                      <img src="https://api.dicebear.com/9.x/lorelei/svg?seed=Aneka&backgroundColor=transparent" alt="DV" className="w-full h-full object-cover" />
                    </div>
                    <span className="block h-fit rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-600 shadow-sm">
                      Development
                    </span>
                  </div>
                  {/* Avatar row right */}
                  <div className="relative flex w-[calc(50%+0.875rem)] items-center justify-end gap-2.5">
                    <span className="block h-fit rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-600 shadow-sm">
                      Delivery
                    </span>
                    <div className="size-8 rounded-full ring-2 ring-white overflow-hidden bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center text-white text-xs font-bold">
                      <img src="https://api.dicebear.com/9.x/lorelei/svg?seed=Jasper&backgroundColor=transparent" alt="TR" className="w-full h-full object-cover" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ── Bottom Stats ────────────────────────── */}
        <div
          className={`mt-4 grid grid-cols-2 md:grid-cols-4 gap-3 transition-all duration-700 delay-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
        >
          {[
            { value: '50+', label: 'Proyek Selesai', icon: TrendingUp },
            { value: '100%', label: 'Kepuasan Klien', icon: Shield },
            { value: '24/7', label: 'Dukungan Aktif', icon: Zap },
            { value: '5+', label: 'Tahun Pengalaman', icon: Users },
          ].map(({ value, label, icon: Icon }, i) => (
            <div
              key={i}
              className="group flex flex-col items-center gap-3 p-6 rounded-2xl border border-slate-200 bg-white hover:bg-orange-50/50 hover:border-orange-400/30 transition-all duration-300 shadow-sm"
            >
              <Icon className="size-5 text-orange-500 opacity-60 group-hover:opacity-100 transition-opacity" strokeWidth={1.5} />
              <p className="text-3xl font-bold text-orange-500">{value}</p>
              <p className="text-xs text-slate-500 text-center font-medium tracking-wide">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
