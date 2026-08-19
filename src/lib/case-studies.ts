export interface CaseStudyLink {
    label: string;
    url: string;
}

export interface CaseStudy {
    slug: string;
    title: string;
    tagline: string;
    summary: string;
    image: string;
    client: string;
    year: string;
    team: string[];
    challenge: string;
    solution: string[];
    results: string[];
    technologies: string[];
    links: CaseStudyLink[];
}

export const CASE_STUDIES: CaseStudy[] = [
    {
        slug: 'baciraro',
        title: 'Baciraro',
        tagline: 'Platform ekosistem keberlanjutan berbasis AI',
        summary:
            'Platform life-intelligence yang mengubah catatan aktivitas harian menjadi insight terstruktur dan analitik multi-timeframe, dengan keamanan data berlapis.',
        image: '/images/portofolio/2.png',
        client: 'PT. Baciraro Kreatif Minahasa',
        year: '2026',
        team: ['Aldy', 'Calvin', 'Rizky', 'Given'],
        challenge:
            'Membangun platform yang memproses data aktivitas pengguna setiap hari, menghasilkan ringkasan & laporan periodik yang akurat, serta menjamin data tetap milik pengguna (data sovereignty).',
        solution: [
            'Arsitektur append-only logging untuk merekam aktivitas secara berkelanjutan',
            'Ringkasan harian otomatis & laporan periodik (mingguan, bulanan, tahunan)',
            'AI percakapan zero-hallucination yang dilatih hanya pada data pengguna',
            'Semantic vector search dengan pgvector untuk pencarian kontekstual',
            'Autentikasi dan Row-Level Security (RLS) Supabase untuk keamanan data',
        ],
        results: [
            'Platform produksi yang aktif digunakan ekosistem Baciraro',
            'Privasi data terjamin dengan RLS & arsitektur server-side',
            'Dasar untuk modul pengelolaan sampah & keberlanjutan',
        ],
        technologies: ['Next.js', 'TypeScript', 'Supabase', 'pgvector', 'AI/LLM', 'RLS'],
        links: [
            { label: 'Lihat Demo Live', url: 'https://www.baciraro.net/' },
            { label: 'Source Code', url: 'https://github.com/OrdersMDC/Baciraro-Kreatif' },
        ],
    },
    {
        slug: 'maleosan-tours',
        title: 'Maleosan Tours',
        tagline: 'Platform wisata multilingual Sulawesi Utara',
        summary:
            'Portal travel modern multibahasa dengan SEO kuat, CMS admin untuk paket tour, hotel, transportasi, dan testimoni.',
        image: '/images/portofolio/1.png',
        client: 'Maleosan Travel',
        year: '2026',
        team: ['Kevin', 'Owen', 'Aldy'],
        challenge:
            'Membangun situs wisata yang terindeks baik di Google, dapat dikelola tim tanpa coding, dan mendukung konten multibahasa untuk pasar domestik & internasional.',
        solution: [
            'Website publik berfokus SEO dengan struktur konten terorganisir',
            'CMS admin untuk kelola paket tour, hotel, transportasi & testimoni',
            'Alur penerjemahan otomatis untuk konten multibahasa',
            'API unggah media dengan integrasi Cloudinary',
            'UI responsif & struktur konten yang mempercepat publikasi',
        ],
        results: [
            'Visibilitas pencarian meningkat (SEO-focused architecture)',
            'Tim klien mengelola konten secara mandiri',
            'Konten multibahasa melayani wisatawan lokal & internasional',
        ],
        technologies: ['Next.js', 'TypeScript', 'Prisma', 'MySQL', 'Tailwind CSS', 'Cloudinary'],
        links: [{ label: 'Lihat Demo Live', url: 'https://www.maleosantoursmanado.com/' }],
    },
    {
        slug: 'sentivize',
        title: 'Sentivize',
        tagline: 'Analisis karyawan & CV berbasis AI',
        summary:
            'Aplikasi AI untuk mengekstrak dan menilai ratusan CV secara otomatis, dengan skoring kesesuaian dan ekspor laporan Excel.',
        image: '/images/portofolio/3.png',
        client: 'HR / Rekrutmen',
        year: '2025',
        team: ['Aldy'],
        challenge:
            'Tim HR menghabiskan waktu berjam-jam membaca CV satu per satu. Dibutuhkan sistem yang membaca, menilai, dan merangking kandidat sesuai kebutuhan posisi.',
        solution: [
            'Ekstraksi informasi otomatis dari CV dengan Transformers',
            'Sentiment & relevance scoring berbasis AI',
            'Semantic keyword matching terhadap deskripsi pekerjaan',
            'Proses batch CV dalam jumlah besar',
            'Ekspor hasil ke Excel & dashboard visualisasi',
        ],
        results: [
            'Waktu penyaringan CV berkurang drastis',
            'Ranking kandidat yang objektif & konsisten',
            'Laporan rekap yang siap dibagikan tim HR',
        ],
        technologies: ['Streamlit', 'Python', 'Hugging Face Transformers', 'Excel Export'],
        links: [{ label: 'Source Code', url: 'https://github.com/AldyLoing/Sentivize' }],
    },
    {
        slug: 'ecometer',
        title: 'EcoMeter',
        tagline: 'Distribusi biogas berbasis IoT + blockchain',
        summary:
            'Sistem IoT untuk memantau dan mendistribusikan biogas dengan transparansi blockchain — solusi energi berkelanjutan tingkat desa.',
        image: '/images/portofolio/4.png',
        client: 'Proyek Energi Terbarukan',
        year: '2025',
        team: ['Owen', 'Aldy'],
        challenge:
            'Distribusi biogas sering tidak transparan dan sulit dipantau. Dibutuhkan sistem yang mencatat produksi, distribusi, dan konsumsi secara otomatis dan dapat diverifikasi.',
        solution: [
            'Sensor IoT untuk memantau produksi & distribusi biogas',
            'Pencatatan transaksi distribusi di blockchain',
            'Dashboard pemantauan real-time',
            'Analisis data untuk efisiensi penggunaan',
        ],
        results: [
            'Transparansi distribusi yang dapat diverifikasi',
            'Pemantauan real-time dari lokasi mana pun',
            'Data dasar untuk optimasi energi desa',
        ],
        technologies: ['IoT', 'Blockchain', 'Python', 'Sensor Monitoring'],
        links: [],
    },
];

export function getCaseStudy(slug: string): CaseStudy | undefined {
    return CASE_STUDIES.find((c) => c.slug === slug);
}
