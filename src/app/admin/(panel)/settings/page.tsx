import { createClient } from '@/lib/supabase/server';
import { isGoogleConfigured, getStoredToken } from '@/lib/google';
import GoogleSettings from './GoogleSettings';

export default async function AdminSettingsPage() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    const configured = isGoogleConfigured();
    const token = user ? await getStoredToken(user.id) : null;
    const connected = Boolean(token?.refresh_token);

    const icsConfigured = Boolean(process.env.GOOGLE_CALENDAR_ICS_URL);
    const embedUrl = process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_EMBED_URL ?? null;

    let googleEmail: string | null = null;
    if (connected && user) {
        const { data } = await supabase
            .from('calendar_tokens')
            .select('google_email')
            .eq('user_id', user.id)
            .single();
        googleEmail = data?.google_email ?? null;
    }

    return (
        <div className="max-w-3xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-[#061E44]">Google Calendar</h1>
                <p className="text-gray-500 mt-1">
                    Tampilkan kalender live dan sinkronkan jadwal tugas dengan Google Calendar.
                </p>
            </div>

            <GoogleSettings
                configured={configured}
                connected={connected}
                googleEmail={googleEmail}
                icsConfigured={icsConfigured}
                embedConfigured={Boolean(embedUrl)}
            />

            <div className="bg-white rounded-xl border border-gray-200 p-6 mt-6">
                <h2 className="font-semibold text-[#061E44] mb-3">Mode Koneksi</h2>
                <div className="space-y-4 text-sm text-gray-600">
                    <div className="border-l-4 border-emerald-500 pl-4 py-1">
                        <p className="font-medium text-[#061E44]">1. Kalender Live (embed) — tanpa setup</p>
                        <p className="text-gray-500">
                            Tampilkan kalender publik sebagai iframe di halaman Jadwal. Isi{' '}
                            <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">NEXT_PUBLIC_GOOGLE_CALENDAR_EMBED_URL</code> dengan URL embed dari Google Calendar (Settings → Integrate calendar → Embed code → salin URL dari <span className="font-mono text-xs">src=&quot;...&quot;</span>).
                        </p>
                    </div>
                    <div className="border-l-4 border-blue-500 pl-4 py-1">
                        <p className="font-medium text-[#061E44]">2. Impor Event (ICS) — baca tanpa OAuth</p>
                        <p className="text-gray-500">
                            Tarik event dari kalender ke daftar tugas. Isi{' '}
                            <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">GOOGLE_CALENDAR_ICS_URL</code> dengan URL ICS publik/private (Settings → Integrate calendar → Secret address in iCal format untuk data lengkap). Tombol &quot;Ambil dari Kalender&quot; di halaman Jadwal akan mengimpornya.
                        </p>
                    </div>
                    <div className="border-l-4 border-[#FF7A00] pl-4 py-1">
                        <p className="font-medium text-[#061E44]">3. Sinkron 2 Arah (OAuth) — tulis event otomatis</p>
                        <p className="text-gray-500">
                            Agar tugas yang dibuat di web otomatis masuk ke Google Calendar, ikuti langkah OAuth di bawah.
                        </p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6 mt-6">
                <h2 className="font-semibold text-[#061E44] mb-3">Cara Setup Sinkron 2 Arah (OAuth)</h2>
                <ol className="space-y-3 text-sm text-gray-600 list-decimal list-inside">
                    <li>
                        Buka <a href="https://console.cloud.google.com" target="_blank" rel="noopener noreferrer" className="text-[#FF7A00] hover:underline">Google Cloud Console</a> dan buat project baru.
                    </li>
                    <li>
                        Aktifkan <span className="font-medium">Google Calendar API</span> di menu Library.
                    </li>
                    <li>
                        Buat <span className="font-medium">OAuth Client ID</span> tipe <span className="font-medium">Web application</span> di menu Credentials.
                    </li>
                    <li>
                        Tambahkan URI redirect: <code className="bg-gray-100 px-2 py-0.5 rounded text-xs">https://ordersapp.tech/api/google/callback</code> (atau <code className="bg-gray-100 px-2 py-0.5 rounded text-xs">http://localhost:3000/api/google/callback</code> untuk lokal).
                    </li>
                    <li>
                        Isi <code className="bg-gray-100 px-2 py-0.5 rounded text-xs">GOOGLE_CLIENT_ID</code>, <code className="bg-gray-100 px-2 py-0.5 rounded text-xs">GOOGLE_CLIENT_SECRET</code>, dan <code className="bg-gray-100 px-2 py-0.5 rounded text-xs">GOOGLE_REDIRECT_URI</code> di <span className="font-medium">.env.local</span> (dan di Vercel untuk produksi).
                    </li>
                    <li>
                        Klik <span className="font-medium">Hubungkan Google Calendar</span> dan izinkan akses.
                    </li>
                </ol>
            </div>
        </div>
    );
}