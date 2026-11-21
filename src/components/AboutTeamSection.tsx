import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';

const POINTS = [
  'Satu tim untuk desain, pengembangan, dan konten',
  'Berpengalaman di proyek bank sampah dan lingkungan',
  'Bisa ketemu langsung di Manado dan sekitarnya',
];

export default function AboutTeamSection() {
  return (
    <section className="bg-slate-50">
      <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-14 px-5 py-24 lg:flex-row">
        <div className="relative h-[320px] w-full min-w-0 flex-1 overflow-hidden rounded-[20px] sm:h-[400px]">
          <Image
            src="/images/ecosistem/p1.jpg"
            alt="Tim ORDERS berfoto bersama di sebuah pameran"
            fill
            sizes="(min-width: 1024px) 560px, 100vw"
            className="object-cover"
          />
        </div>

        <div className="flex w-full min-w-0 flex-1 flex-col gap-5">
          <span className="text-sm font-bold uppercase tracking-[0.08em] text-[#B35200]">
            Tentang kami
          </span>
          <h2 className="text-3xl font-extrabold leading-[1.15] tracking-[-0.025em] text-[#061E44] md:text-[2.6rem]">
            Tim muda dari Manado, terbiasa kerja untuk desa sampai perusahaan
          </h2>
          <p className="text-[17px] leading-[1.7] text-slate-600">
            ORDERS adalah tim developer, desainer, dan analis data yang membangun solusi digital
            untuk UMKM, yayasan, pemerintah desa, dan program keberlanjutan di Sulawesi Utara.
          </p>
          <ul className="flex list-none flex-col gap-3 p-0">
            {POINTS.map((point) => (
              <li key={point} className="flex items-start gap-3 text-base text-slate-800">
                <Check className="mt-0.5 h-[22px] w-[22px] shrink-0 text-[#B35200]" aria-hidden="true" />
                {point}
              </li>
            ))}
          </ul>
          <Link
            href="/team"
            className="inline-flex min-h-[44px] items-center gap-2 self-start text-base font-bold text-[#061E44] hover:text-[#B35200]"
          >
            Kenalan dengan tim
            <ArrowRight className="h-[18px] w-[18px]" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
