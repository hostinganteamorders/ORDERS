const STATS = [
  { value: '10+', label: 'Anggota tim' },
  { value: '20+', label: 'Proyek digital selesai' },
  { value: '4+', label: 'Proyek live di produksi' },
  { value: '6', label: 'Prestasi & finalis nasional' },
];

export default function StatsStrip() {
  return (
    <section aria-label="Angka ORDERS" className="border-b border-slate-200 bg-white">
      <div className="mx-auto grid max-w-[1200px] grid-cols-2 gap-6 px-5 py-10 md:grid-cols-4">
        {STATS.map((stat) => (
          <div key={stat.label} className="flex flex-col gap-1">
            <span className="text-4xl font-extrabold tracking-[-0.03em] text-[#061E44]">
              {stat.value}
            </span>
            <span className="text-[15px] text-slate-600">{stat.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
