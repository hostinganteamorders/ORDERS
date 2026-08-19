'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { formatDateTime, buildGoogleCalendarTemplateUrl } from '@/lib/format';
import { buildIcs } from '@/lib/ics';

type Task = {
    id: string;
    title: string;
    description: string | null;
    project_id: string | null;
    assigned_to: string | null;
    start_at: string | null;
    end_at: string | null;
    status: string;
    color: string;
    google_event_id: string | null;
    source: string;
};

type Member = { id: string; name: string; role: string };
type Project = { id: string; name: string; status: string };

type Props = {
    tasks: Task[];
    members: Member[];
    projects: Project[];
    isAdmin: boolean;
    googleConnected: boolean;
    icsConfigured: boolean;
    embedUrl: string | null;
    calendarEmail: string | null;
};

const statusLabel: Record<string, string> = { pending: 'Menunggu', in_progress: 'Berjalan', done: 'Selesai' };
const statusColor: Record<string, string> = {
    pending: 'bg-gray-100 text-gray-600',
    in_progress: 'bg-blue-100 text-blue-700',
    done: 'bg-emerald-100 text-emerald-700',
};

export default function ScheduleClient({ tasks, members, projects, isAdmin, googleConnected, icsConfigured, embedUrl, calendarEmail }: Props) {
    const router = useRouter();
    const [filter, setFilter] = useState<'all' | 'pending' | 'in_progress' | 'done'>('all');
    const [showForm, setShowForm] = useState(false);
    const [showEmbed, setShowEmbed] = useState(true);
    const [form, setForm] = useState({
        title: '',
        description: '',
        project_id: '',
        assigned_to: '',
        start_at: '',
        end_at: '',
        color: '#FF7A00',
    });
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [syncing, setSyncing] = useState<string | null>(null);
    const [pulling, setPulling] = useState(false);
    const [saving, setSaving] = useState(false);

    const canPull = googleConnected || icsConfigured;

    const memberMap = useMemo(() => new Map(members.map((m) => [m.id, m])), [members]);
    const projectMap = useMemo(() => new Map(projects.map((p) => [p.id, p])), [projects]);

    function showError(msg: string) { setError(msg); setSuccess(null); }
    function showSuccess(msg: string) { setSuccess(msg); setError(null); }

    const filteredTasks = tasks.filter((t) => filter === 'all' || t.status === filter);

    async function createTask(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        if (!form.title.trim()) {
            showError('Judul tugas wajib diisi.');
            return;
        }
        if (!form.assigned_to) {
            showError('Pilih anggota yang mengerjakan tugas.');
            return;
        }
        if (!form.start_at) {
            showError('Tanggal mulai wajib diisi.');
            return;
        }

        setSaving(true);
        const supabase = createClient();
        const { data: task, error: err } = await supabase
            .from('tasks')
            .insert({
                title: form.title.trim(),
                description: form.description.trim() || null,
                project_id: form.project_id || null,
                assigned_to: form.assigned_to,
                start_at: form.start_at,
                end_at: form.end_at || null,
                color: form.color,
                status: 'pending',
            })
            .select('id')
            .single();

        if (err || !task) {
            setSaving(false);
            showError('Gagal membuat tugas: ' + (err?.message ?? 'unknown'));
            return;
        }

        let synced = false;
        if (googleConnected && form.start_at) {
            synced = await syncToGoogle(task.id, { quiet: true });
        }

        setSaving(false);
        setForm({ title: '', description: '', project_id: '', assigned_to: '', start_at: '', end_at: '', color: '#FF7A00' });
        setShowForm(false);

        if (googleConnected && form.start_at) {
            showSuccess(
                synced
                    ? 'Tugas dibuat & ditambahkan ke Google Calendar.'
                    : 'Tugas dibuat, tapi gagal ditambahkan ke Google Calendar. Coba tombol Sync pada tugas.'
            );
        } else {
            showSuccess('Tugas berhasil dibuat.');
            if (!googleConnected) {
                setSuccess((s) => `${s} Hubungkan Google Calendar di menu Settings agar tugas otomatis masuk kalender.`);
            }
        }
        router.refresh();
    }

    async function updateStatus(taskId: string, status: string) {
        const supabase = createClient();
        const { error: err } = await supabase.from('tasks').update({ status }).eq('id', taskId);
        if (err) showError('Gagal update status: ' + err.message);
        router.refresh();
    }

    async function deleteTask(taskId: string) {
        if (!confirm('Hapus tugas ini?')) return;
        const supabase = createClient();
        await supabase.from('tasks').delete().eq('id', taskId);
        showSuccess('Tugas dihapus.');
        router.refresh();
    }

    async function syncToGoogle(taskId: string, opts?: { quiet?: boolean }): Promise<boolean> {
        setSyncing(taskId);
        if (!opts?.quiet) setError(null);
        const res = await fetch('/api/google/sync', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ taskId }),
        });
        const data = await res.json();
        setSyncing(null);
        if (!res.ok) {
            if (!opts?.quiet) showError(data.error ?? 'Gagal sinkronisasi ke Google Calendar.');
            return false;
        }
        if (!opts?.quiet) {
            showSuccess('Tugas disinkronkan ke Google Calendar.');
            router.refresh();
        }
        return true;
    }

    async function pullFromGoogle() {
        setPulling(true);
        setError(null);
        const res = await fetch('/api/google/sync');
        const data = await res.json();
        setPulling(false);
        if (!res.ok) {
            showError(data.error ?? 'Gagal menarik event dari Google Calendar.');
            return;
        }
        showSuccess(`${data.total} event diambil dari Google Calendar (${data.inserted} baru, ${data.updated} diperbarui).`);
        router.refresh();
    }

    function downloadIcs(task: Task) {
        const ics = buildIcs({
            title: task.title,
            description: task.description,
            startAt: task.start_at,
            endAt: task.end_at,
            organizerEmail: calendarEmail,
        });
        const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${task.title.replace(/[^\w\-]+/g, '_')}.ics`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
    }

    // Group tasks by month
    const groups = useMemo(() => {
        const sorted = [...filteredTasks].sort((a, b) => {
            const ta = a.start_at ? new Date(a.start_at).getTime() : 0;
            const tb = b.start_at ? new Date(b.start_at).getTime() : 0;
            return ta - tb;
        });
        const map = new Map<string, Task[]>();
        for (const t of sorted) {
            const d = t.start_at ? new Date(t.start_at) : new Date();
            const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
            const arr = map.get(key) ?? [];
            arr.push(t);
            map.set(key, arr);
        }
        return Array.from(map.entries());
    }, [filteredTasks]);

    return (
        <>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-[#061E44]">Jadwal & Tugas</h1>
                    <p className="text-gray-500 mt-1">
                        Atur jadwal dan pembagian tugas, sinkron otomatis dengan Google Calendar.
                    </p>
                </div>
                <div className="flex gap-2">
                    {canPull && (
                        <button
                            onClick={pullFromGoogle}
                            disabled={pulling}
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-gray-300 text-gray-600 text-sm font-medium hover:bg-gray-50 transition disabled:opacity-50"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            {pulling ? 'Mengambil...' : 'Ambil dari Kalender'}
                        </button>
                    )}
                    {isAdmin && (
                        <button
                            onClick={() => setShowForm(!showForm)}
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-[#FF7A00] to-[#FF9A40] text-white text-sm font-semibold shadow-lg shadow-orange-500/30 hover:opacity-90 transition"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            {showForm ? 'Tutup' : 'Buat Tugas'}
                        </button>
                    )}
                </div>
            </div>

            {!googleConnected && !icsConfigured && (
                <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-700">
                    Kalender belum terhubung. Gunakan <span className="font-medium">+ Tambahkan</span> (buka Google Calendar) atau <span className="font-medium">.ics</span> (unduh file untuk diimpor) pada tugas. Untuk tampilan live & impor otomatis, isi <span className="font-mono text-xs">NEXT_PUBLIC_GOOGLE_CALENDAR_EMBED_URL</span> dan <span className="font-mono text-xs">GOOGLE_CALENDAR_ICS_URL</span> di .env.local / Vercel.
                </div>
            )}

            {embedUrl && (
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-6">
                    <button
                        onClick={() => setShowEmbed(!showEmbed)}
                        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition"
                    >
                        <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-[#FF7A00]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="font-semibold text-[#061E44]">Kalender Google (Live)</span>
                        </div>
                        <svg className={`w-5 h-5 text-gray-400 transition-transform ${showEmbed ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                    {showEmbed && (
                        <div>
                            <iframe
                                src={embedUrl}
                                style={{ border: 0 }}
                                width="100%"
                                height="600"
                                frameBorder="0"
                                scrolling="no"
                                title="Google Calendar ORDERS"
                            />
                            <div className="px-4 py-3 flex items-center justify-between gap-4 border-t border-gray-100">
                                <p className="text-xs text-gray-500">
                                    Agar frame tampil tanpa login, kalender perlu dijadikan publik (Settings → kalender ORDERS → Access permissions → Make available to public). Kalau tidak tampil, buka langsung di tab baru.
                                </p>
                                <a
                                    href={
                                        calendarEmail
                                            ? `https://calendar.google.com/calendar/u/0?cid=${btoa(calendarEmail)}`
                                            : embedUrl
                                    }
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="shrink-0 px-4 py-2 rounded-lg bg-[#FF7A00] text-white text-xs font-medium hover:bg-[#E56E00] transition"
                                >
                                    Buka di Google Calendar
                                </a>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {error && (
                <div className="mb-6 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">{error}</div>
            )}
            {success && (
                <div className="mb-6 text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-3">{success}</div>
            )}

            {showForm && isAdmin && (
                <form onSubmit={createTask} className="bg-white rounded-xl border border-gray-200 p-6 mb-6 space-y-4">
                    <h2 className="font-semibold text-[#061E44]">Buat Tugas Baru</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Judul Tugas *</label>
                            <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                                placeholder="mis. Desain landing page" className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-[#FF7A00] outline-none transition" />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                            <textarea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                                placeholder="Detail tugas..." className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-[#FF7A00] outline-none transition" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Penanggung Jawab *</label>
                            <select value={form.assigned_to} onChange={(e) => setForm({ ...form, assigned_to: e.target.value })}
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-[#FF7A00] outline-none transition bg-white">
                                <option value="">Pilih anggota...</option>
                                {members.map((m) => (
                                    <option key={m.id} value={m.id}>{m.name} · {m.role}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Project Terkait</label>
                            <select value={form.project_id} onChange={(e) => setForm({ ...form, project_id: e.target.value })}
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-[#FF7A00] outline-none transition bg-white">
                                <option value="">Tidak ada</option>
                                {projects.map((p) => (
                                    <option key={p.id} value={p.id}>{p.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Mulai *</label>
                            <input type="datetime-local" value={form.start_at} onChange={(e) => setForm({ ...form, start_at: e.target.value })}
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-[#FF7A00] outline-none transition" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Selesai</label>
                            <input type="datetime-local" value={form.end_at} onChange={(e) => setForm({ ...form, end_at: e.target.value })}
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-[#FF7A00] outline-none transition" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Warna</label>
                            <div className="flex items-center gap-3">
                                {['#FF7A00', '#2563EB', '#059669', '#DC2626', '#7C3AED', '#0891B2'].map((c) => (
                                    <button key={c} type="button" onClick={() => setForm({ ...form, color: c })}
                                        className={`w-8 h-8 rounded-full border-2 ${form.color === c ? 'border-gray-800' : 'border-transparent'}`}
                                        style={{ backgroundColor: c }} />
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button type="submit" disabled={saving}
                            className="px-5 py-2.5 rounded-lg bg-[#FF7A00] text-white font-semibold hover:opacity-90 transition disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center gap-2">
                            {saving && (
                                <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 12a8 8 0 018-8v0a8 8 0 018 8" />
                                </svg>
                            )}
                            {saving ? (googleConnected ? 'Menyimpan & menambah ke kalender...' : 'Menyimpan...') : 'Simpan Tugas'}
                        </button>
                        <button type="button" onClick={() => setShowForm(false)}
                            className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-600 font-medium hover:bg-gray-50 transition">
                            Batal
                        </button>
                    </div>
                </form>
            )}

            <div className="flex gap-2 mb-6">
                {(['all', 'pending', 'in_progress', 'done'] as const).map((f) => (
                    <button key={f} onClick={() => setFilter(f)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition ${filter === f ? 'bg-[#061E44] text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                        {f === 'all' ? 'Semua' : statusLabel[f]}
                    </button>
                ))}
            </div>

            {groups.length === 0 ? (
                <div className="bg-white rounded-xl border border-dashed border-gray-300 p-16 text-center text-gray-400">
                    <p className="text-lg font-medium mb-1">Belum ada tugas</p>
                    <p className="text-sm">Buat tugas atau ambil event dari Google Calendar.</p>
                </div>
            ) : (
                <div className="space-y-8">
                    {groups.map(([monthKey, monthTasks]) => {
                        const [year, month] = monthKey.split('-').map(Number);
                        const monthName = new Intl.DateTimeFormat('id-ID', { month: 'long', year: 'numeric' }).format(new Date(year, month - 1, 1));
                        return (
                            <div key={monthKey}>
                                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">{monthName}</h2>
                                <div className="space-y-3">
                                    {monthTasks.map((t) => {
                                        const member = t.assigned_to ? memberMap.get(t.assigned_to) : null;
                                        const project = t.project_id ? projectMap.get(t.project_id) : null;
                                        return (
                                            <div key={t.id} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4">
                                                <div className="w-1 self-stretch rounded-full" style={{ backgroundColor: t.color }} />
                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <p className="font-medium text-[#061E44]">{t.title}</p>
                                                        {t.source === 'google' && (
                                                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 text-blue-600 font-medium">GCal</span>
                                                        )}
                                                        {t.google_event_id && (
                                                            <svg className="w-3.5 h-3.5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                                            </svg>
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-gray-500 mt-0.5">
                                                        {member ? `${member.name} · ` : 'Tanpa penanggung jawab · '}
                                                        {t.start_at ? formatDateTime(t.start_at) : 'Tanpa jadwal'}
                                                        {project ? ` · ${project.name}` : ''}
                                                    </p>
                                                    {t.description && <p className="text-sm text-gray-500 mt-1 line-clamp-1">{t.description}</p>}
                                                </div>
                                                <div className="flex items-center gap-2 shrink-0">
                                                    <select
                                                        value={t.status}
                                                        onChange={(e) => updateStatus(t.id, e.target.value)}
                                                        disabled={!isAdmin}
                                                        className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border-0 ${statusColor[t.status]} focus:outline-none`}
                                                    >
                                                        <option value="pending">Menunggu</option>
                                                        <option value="in_progress">Berjalan</option>
                                                        <option value="done">Selesai</option>
                                                    </select>
                                                    {isAdmin && googleConnected && !t.google_event_id && (
                                                        <button
                                                            onClick={() => syncToGoogle(t.id)}
                                                            disabled={syncing === t.id}
                                                            className="px-3 py-1.5 rounded-lg border border-blue-200 text-blue-600 text-xs font-medium hover:bg-blue-50 transition disabled:opacity-50"
                                                            title="Sinkronkan ke Google Calendar"
                                                        >
                                                            {syncing === t.id ? '...' : 'Sync'}
                                                        </button>
                                                    )}
                                                    {isAdmin && !t.google_event_id && !googleConnected && (
                                                        <a
                                                            href={buildGoogleCalendarTemplateUrl({
                                                                title: t.title,
                                                                description: t.description,
                                                                startAt: t.start_at,
                                                                endAt: t.end_at,
                                                                calendarEmail,
                                                            })}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="px-3 py-1.5 rounded-lg border border-green-200 text-green-600 text-xs font-medium hover:bg-green-50 transition"
                                                            title="Buka Google Calendar untuk menambahkan event ini"
                                                        >
                                                            + Tambahkan
                                                        </a>
                                                    )}
                                                    {isAdmin && !t.google_event_id && (
                                                        <button
                                                            onClick={() => downloadIcs(t)}
                                                            className="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 text-xs font-medium hover:bg-gray-50 transition"
                                                            title="Unduh file kalender (.ics) untuk diimpor ke Google Calendar"
                                                        >
                                                            <svg className="w-3.5 h-3.5 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                            </svg>
                                                            .ics
                                                        </button>
                                                    )}
                                                    {isAdmin && (
                                                        <button onClick={() => deleteTask(t.id)}
                                                            className="p-1.5 text-gray-300 hover:text-red-500 transition" aria-label="Hapus">
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </>
    );
}