const STEPS = [
  {
    title: 'Konsultasi gratis',
    text: 'Ceritakan kebutuhan Anda lewat WhatsApp atau meeting singkat.',
  },
  {
    title: 'Penawaran tertulis',
    text: 'Anda menerima rincian fitur, harga, dan jadwal sebelum pekerjaan dimulai.',
  },
  {
    title: 'Pengembangan',
    text: 'Progres dilaporkan rutin, dan Anda bisa memberi masukan di setiap tahap.',
  },
  {
    title: 'Rilis & maintenance',
    text: 'Website atau aplikasi online, dengan paket maintenance bulanan bila dibutuhkan.',
  },
];

export default function ProcessSection() {
  return (
    <section className="bg-white">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-12 px-5 py-24">
        <div className="flex max-w-[640px] flex-col gap-3">
          <span className="text-sm font-bold uppercase tracking-[0.08em] text-[#B35200]">
            Cara kerja
          </span>
          <h2 className="text-3xl font-extrabold leading-[1.15] tracking-[-0.025em] text-[#061E44] md:text-[2.6rem]">
            Dari ide sampai online, tanpa kejutan biaya
          </h2>
        </div>

        <ol className="grid list-none grid-cols-1 gap-6 p-0 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, index) => (
            <li
              key={step.title}
              className={`flex flex-col gap-3 border-t-[3px] pt-5 ${
                index === 0 ? 'border-[#FF7A00]' : 'border-slate-300'
              }`}
            >
              <span
                className={`text-sm font-extrabold ${
                  index === 0 ? 'text-[#B35200]' : 'text-slate-600'
                }`}
              >
                {String(index + 1).padStart(2, '0')}
              </span>
              <h3 className="text-[19px] font-bold text-[#061E44]">{step.title}</h3>
              <p className="text-[15px] leading-relaxed text-slate-600">{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
