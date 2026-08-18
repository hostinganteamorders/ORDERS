'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { formatDate } from '@/lib/format';

type Note = {
    id: string;
    title: string;
    date: string;
    agenda: string | null;
    notes: string | null;
    project_id: string | null;
    created_at: string;
};

type Attendee = { id: string; meeting_note_id: string; member_id: string };
type ActionItem = {
    id: string;
    meeting_note_id: string;
    task: string;
    assigned_to: string | null;
    due_date: string | null;
    status: string;
};

type Member = { id: string; name: string; role: string; status: string };
type Project = { id: string; name: string; status: string };

type Props = {
    notes: Note[];
    attendees: Attendee[];
    actionItems: ActionItem[];
    members: Member[];
    projects: Project[];
    isAdmin: boolean;
};

const emptyForm = {
    title: '',
    date: new Date().toISOString().slice(0, 10),
    agenda: '',
    notes: '',
    project_id: '',
    attendees: [] as string[],
};

export default function MeetingsClient({ notes, attendees, actionItems, members, projects, isAdmin }: Props) {
    const router = useRouter();
    const [rows, setRows] = useState(notes);
    const [attendeeRows, setAttendeeRows] = useState(attendees);
    const [itemRows, setItemRows] = useState(actionItems);
    const [expanded, setExpanded] = useState<Record<string, boolean>>({});
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState(emptyForm);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const [itemForm, setItemForm] = useState({ task: '', assigned_to: '', due_date: '' });

    const memberMap = useMemo(() => new Map(members.map((m) => [m.id, m])), [members]);
    const projectMap = useMemo(() => new Map(projects.map((p) => [p.id, p])), [projects]);

    const attendeesByNote = useMemo(() => {
        const map = new Map<string, string[]>();
        for (const a of attendeeRows) {
            const arr = map.get(a.meeting_note_id) ?? [];
            arr.push(a.member_id);
            map.set(a.meeting_note_id, arr);
        }
        return map;
    }, [attendeeRows]);

    const itemsByNote = useMemo(() => {
        const map = new Map<string, ActionItem[]>();
        for (const it of itemRows) {
            const arr = map.get(it.meeting_note_id) ?? [];
            arr.push(it);
            map.set(it.meeting_note_id, arr);
        }
        return map;
    }, [itemRows]);

    function showError(msg: string) { setError(msg); setSuccess(null); }
    function showSuccess(msg: string) { setSuccess(msg); setError(null); }

    function openCreate() {
        setEditingId(null);
        setForm(emptyForm);
        setShowForm(true);
        setError(null);
        setSuccess(null);
    }

    function openEdit(n: Note) {
        setEditingId(n.id);
        setForm({
            title: n.title,
            date: n.date,
            agenda: n.agenda ?? '',
            notes: n.notes ?? '',
            project_id: n.project_id ?? '',
            attendees: attendeesByNote.get(n.id) ?? [],
        });
        setShowForm(true);
        setError(null);
        setSuccess(null);
    }

    async function save(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        if (!form.title.trim() || !form.date) {
            showError('Judul dan tanggal rapat wajib diisi.');
            return;
        }

        setSaving(true);
        const supabase = createClient();

        let noteId = editingId;
        if (editingId) {
            const { error: err } = await supabase
                .from('meeting_notes')
                .update({
                    title: form.title.trim(),
                    date: form.date,
                    agenda: form.agenda.trim() || null,
                    notes: form.notes.trim() || null,
                    project_id: form.project_id || null,
                })
                .eq('id', editingId);
            if (err) { setSaving(false); showError('Gagal memperbarui catatan: ' + err.message); return; }
        } else {
            const { data: created, error: err } = await supabase
                .from('meeting_notes')
                .insert({
                    title: form.title.trim(),
                    date: form.date,
                    agenda: form.agenda.trim() || null,
                    notes: form.notes.trim() || null,
                    project_id: form.project_id || null,
                })
                .select('id')
                .single();
            if (err || !created) { setSaving(false); showError('Gagal membuat catatan: ' + (err?.message ?? 'unknown')); return; }
            noteId = created.id;
        }

        await supabase.from('meeting_note_attendees').delete().eq('meeting_note_id', noteId);
        for (const memberId of form.attendees) {
            await supabase.from('meeting_note_attendees').insert({ meeting_note_id: noteId, member_id: memberId });
        }

        setSaving(false);
        setShowForm(false);
        showSuccess(editingId ? 'Catatan rapat diperbarui.' : 'Catatan rapat dibuat.');
        router.refresh();
    }

    async function removeNote(id: string) {
        if (!confirm('Hapus catatan rapat ini? Peserta dan tindak lanjut ikut terhapus.')) return;
        const supabase = createClient();
        const { error: err } = await supabase.from('meeting_notes').delete().eq('id', id);
        if (err) { showError('Gagal menghapus: ' + err.message); return; }
        setRows((prev) => prev.filter((n) => n.id !== id));
        showSuccess('Catatan rapat dihapus.');
        router.refresh();
    }

    async function addItem(noteId: string) {
        setError(null);
        if (!itemForm.task.trim()) { showError('Teks tindak lanjut wajib diisi.'); return; }
        const supabase = createClient();
        const { data: created, error: err } = await supabase
            .from('action_items')
            .insert({
                meeting_note_id: noteId,
                task: itemForm.task.trim(),
                assigned_to: itemForm.assigned_to || null,
                due_date: itemForm.due_date || null,
                status: 'pending',
            })
            .select('*')
            .single();
        if (err || !created) { showError('Gagal menambah tindak lanjut: ' + (err?.message ?? 'unknown')); return; }
        setItemRows((prev) => [...prev, created as ActionItem]);
        setItemForm({ task: '', assigned_to: '', due_date: '' });
        showSuccess('Tindak lanjut ditambahkan.');
    }

    async function toggleItem(itemId: string, status: string) {
        const supabase = createClient();
        const next = status === 'pending' ? 'completed' : 'pending';
        const { error: err } = await supabase.from('action_items').update({ status: next }).eq('id', itemId);
        if (err) { showError('Gagal update status: ' + err.message); return; }
        setItemRows((prev) => prev.map((it) => (it.id === itemId ? { ...it, status: next } : it)));
    }

    async function removeItem(itemId: string) {
        const supabase = createClient();
        const { error: err } = await supabase.from('action_items').delete().eq('id', itemId);
        if (err) { showError('Gagal menghapus: ' + err.message); return; }
        setItemRows((prev) => prev.filter((it) => it.id !== itemId));
    }

    const toggleExpand = (id: string) => setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

    return (
        <>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-[#061E44]">Rapat & Tindak Lanjut</h1>
                    <p className="text-gray-500 mt-1">
                        Catatan rapat, peserta, dan daftar tindak lanjut beserta penanggung jawab.
                    </p>
                </div>
                {isAdmin && (
                    <button
                        onClick={() => (showForm ? setShowForm(false) : openCreate())}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-[#FF7A00] to-[#FF9A40] text-white text-sm font-semibold shadow-lg shadow-orange-500/30 hover:opacity-90 transition"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        {showForm ? 'Tutup' : 'Buat Catatan Rapat'}
                    </button>
                )}
            </div>

            {error && (
                <div className="mb-6 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">{error}</div>
            )}
            {success && (
                <div className="mb-6 text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-3">{success}</div>
            )}

            {showForm && isAdmin && (
                <form onSubmit={save} className="bg-white rounded-xl border border-gray-200 p-6 mb-6 space-y-4">
                    <h2 className="font-semibold text-[#061E44]">{editingId ? 'Ubah Catatan Rapat' : 'Buat Catatan Rapat'}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Judul *</label>
                            <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                                placeholder="mis. Kickoff Project Website" className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-[#FF7A00] outline-none transition" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal *</label>
                            <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })}
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-[#FF7A00] outline-none transition" />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Agenda</label>
                            <textarea rows={2} value={form.agenda} onChange={(e) => setForm({ ...form, agenda: e.target.value })}
                                placeholder="Topik yang dibahas..." className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-[#FF7A00] outline-none transition" />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Catatan</label>
                            <textarea rows={4} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })}
                                placeholder="Hasil diskusi dan keputusan..." className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-[#FF7A00] outline-none transition" />
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
                            <label className="block text-sm font-medium text-gray-700 mb-1">Peserta</label>
                            <div className="max-h-36 overflow-y-auto border border-gray-200 rounded-lg p-3 space-y-1.5">
                                {members.length === 0 && <p className="text-xs text-gray-400">Belum ada anggota.</p>}
                                {members.map((m) => (
                                    <label key={m.id} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={form.attendees.includes(m.id)}
                                            onChange={(e) =>
                                                setForm({
                                                    ...form,
                                                    attendees: e.target.checked
                                                        ? [...form.attendees, m.id]
                                                        : form.attendees.filter((x) => x !== m.id),
                                                })
                                            }
                                            className="w-4 h-4 accent-[#FF7A00]"
                                        />
                                        {m.name} · {m.role}
                                    </label>
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
                            {saving ? 'Menyimpan...' : editingId ? 'Simpan Perubahan' : 'Simpan Catatan'}
                        </button>
                        <button type="button" onClick={() => setShowForm(false)}
                            className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-600 font-medium hover:bg-gray-50 transition">
                            Batal
                        </button>
                    </div>
                </form>
            )}

            {rows.length === 0 ? (
                <div className="bg-white rounded-xl border border-dashed border-gray-300 p-16 text-center text-gray-400">
                    <p className="text-lg font-medium mb-1">Belum ada catatan rapat</p>
                    <p className="text-sm">Buat catatan rapat dan pantau tindak lanjutnya.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {rows.map((n) => {
                        const atts = attendeesByNote.get(n.id) ?? [];
                        const items = itemsByNote.get(n.id) ?? [];
                        const open = !!expanded[n.id];
                        const project = n.project_id ? projectMap.get(n.project_id) : null;
                        return (
                            <div key={n.id} className="bg-white rounded-xl border border-gray-200">
                                <div className="flex items-center gap-4 p-4">
                                    <button onClick={() => toggleExpand(n.id)} className="p-1.5 text-gray-300 hover:text-[#FF7A00] transition" aria-label="Rincian">
                                        <svg className={`w-5 h-5 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    <div className="min-w-0 flex-1">
                                        <p className="font-medium text-[#061E44]">{n.title}</p>
                                        <p className="text-xs text-gray-500">
                                            {formatDate(n.date)}
                                            {project ? ` · ${project.name}` : ''}
                                            {atts.length > 0 ? ` · ${atts.length} peserta` : ''}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                        {items.filter((it) => it.status === 'pending').length > 0 && (
                                            <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-[11px] font-medium">
                                                {items.filter((it) => it.status === 'pending').length} tindak lanjut
                                            </span>
                                        )}
                                        {isAdmin && (
                                            <>
                                                <button onClick={() => openEdit(n)} className="p-1.5 text-gray-300 hover:text-[#FF7A00] transition" aria-label="Ubah">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                </button>
                                                <button onClick={() => removeNote(n.id)} className="p-1.5 text-gray-300 hover:text-red-500 transition" aria-label="Hapus">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {open && (
                                    <div className="border-t border-gray-100 px-4 py-4 space-y-4">
                                        {n.agenda && (
                                            <div>
                                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Agenda</p>
                                                <p className="text-sm text-gray-600 whitespace-pre-line">{n.agenda}</p>
                                            </div>
                                        )}
                                        {n.notes && (
                                            <div>
                                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Catatan</p>
                                                <p className="text-sm text-gray-600 whitespace-pre-line">{n.notes}</p>
                                            </div>
                                        )}
                                        <div>
                                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Peserta</p>
                                            <div className="flex flex-wrap gap-2">
                                                {atts.length === 0 && <span className="text-xs text-gray-400">Tidak ada peserta.</span>}
                                                {atts.map((memberId) => {
                                                    const m = memberMap.get(memberId);
                                                    if (!m) return null;
                                                    return (
                                                        <span key={memberId} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-50 text-orange-700 text-xs font-medium">
                                                            <span className="w-4 h-4 rounded-full bg-orange-100 text-[#FF7A00] flex items-center justify-center text-[9px] font-bold">
                                                                {m.name.slice(0, 1).toUpperCase()}
                                                            </span>
                                                            {m.name}
                                                        </span>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        <div>
                                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Tindak Lanjut</p>
                                            {items.length === 0 && <p className="text-xs text-gray-400">Belum ada tindak lanjut.</p>}
                                            <div className="space-y-2">
                                                {items.map((it) => {
                                                    const assigned = it.assigned_to ? memberMap.get(it.assigned_to) : null;
                                                    return (
                                                        <div key={it.id} className="flex items-center gap-3 bg-gray-50 rounded-lg px-3 py-2">
                                                            <button
                                                                onClick={() => isAdmin && toggleItem(it.id, it.status)}
                                                                disabled={!isAdmin}
                                                                className="shrink-0"
                                                                aria-label="Toggle status"
                                                            >
                                                                {it.status === 'completed' ? (
                                                                    <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                    </svg>
                                                                ) : (
                                                                    <svg className="w-5 h-5 text-gray-300 hover:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                    </svg>
                                                                )}
                                                            </button>
                                                            <div className="min-w-0 flex-1">
                                                                <p className={`text-sm ${it.status === 'completed' ? 'text-gray-400 line-through' : 'text-[#061E44]'}`}>{it.task}</p>
                                                                <p className="text-xs text-gray-400">
                                                                    {assigned ? `PJ: ${assigned.name}` : 'Tanpa PJ'}
                                                                    {it.due_date ? ` · Jatuh tempo: ${formatDate(it.due_date)}` : ''}
                                                                </p>
                                                            </div>
                                                            {isAdmin && (
                                                                <button onClick={() => removeItem(it.id)} className="p-1.5 text-gray-300 hover:text-red-500 transition" aria-label="Hapus">
                                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                                    </svg>
                                                                </button>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                            {isAdmin && (
                                                <div className="mt-3 grid grid-cols-1 sm:grid-cols-[1fr_auto_auto_auto] gap-2">
                                                    <input type="text" value={itemForm.task} onChange={(e) => setItemForm({ ...itemForm, task: e.target.value })}
                                                        placeholder="Tugas tindak lanjut..." className="px-3 py-2 rounded-lg border border-gray-300 focus:border-[#FF7A00] outline-none transition text-sm" />
                                                    <select value={itemForm.assigned_to} onChange={(e) => setItemForm({ ...itemForm, assigned_to: e.target.value })}
                                                        className="px-3 py-2 rounded-lg border border-gray-300 focus:border-[#FF7A00] outline-none transition text-sm bg-white">
                                                        <option value="">PJ...</option>
                                                        {members.map((m) => (
                                                            <option key={m.id} value={m.id}>{m.name}</option>
                                                        ))}
                                                    </select>
                                                    <input type="date" value={itemForm.due_date} onChange={(e) => setItemForm({ ...itemForm, due_date: e.target.value })}
                                                        className="px-3 py-2 rounded-lg border border-gray-300 focus:border-[#FF7A00] outline-none transition text-sm" />
                                                    <button onClick={() => addItem(n.id)}
                                                        className="px-4 py-2 rounded-lg bg-[#FF7A00] text-white text-sm font-semibold hover:opacity-90 transition">
                                                        Tambah
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </>
    );
}
