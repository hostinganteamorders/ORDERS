'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type Member = {
    id: string;
    name: string;
    role: string;
    avatar_url: string | null;
    is_admin: boolean;
    status: string;
};

type Props = {
    members: Member[];
    isAdmin: boolean;
};

const emptyForm = {
    id: '',
    name: '',
    email: '',
    password: '',
    role: 'Member',
    avatar_url: '',
    status: 'active',
    is_admin: false,
};

export default function MembersManager({ members, isAdmin }: Props) {
    const router = useRouter();
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState<Member | null>(null);
    const [form, setForm] = useState(emptyForm);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);

    function showError(msg: string) { setError(msg); setSuccess(null); }
    function showSuccess(msg: string) { setSuccess(msg); setError(null); }

    if (!isAdmin) return null;

    function openCreate() {
        setEditing(null);
        setForm(emptyForm);
        setShowForm(true);
        setError(null);
        setSuccess(null);
    }

    function openEdit(m: Member) {
        setEditing(m);
        setForm({
            id: m.id,
            name: m.name,
            email: '',
            password: '',
            role: m.role,
            avatar_url: m.avatar_url ?? '',
            status: m.status || 'active',
            is_admin: m.is_admin,
        });
        setShowForm(true);
        setError(null);
        setSuccess(null);
    }

    async function save(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        if (!form.name.trim()) { showError('Nama wajib diisi.'); return; }
        if (!editing && (!form.email.trim() || !form.password)) {
            showError('Email dan password wajib diisi untuk anggota baru.');
            return;
        }

        setSaving(true);
        const payload = {
            name: form.name.trim(),
            role: form.role.trim() || 'Member',
            avatar_url: form.avatar_url.trim() || null,
            status: form.status,
            is_admin: form.is_admin,
        };

        const res = editing
            ? await fetch('/api/members/update', {
                  method: 'PATCH',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ id: editing.id, ...payload }),
              })
            : await fetch('/api/members/create', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ ...payload, email: form.email.trim(), password: form.password }),
              });

        const data = await res.json();
        setSaving(false);
        if (!res.ok) { showError(data.error ?? 'Gagal menyimpan anggota.'); return; }

        setShowForm(false);
        showSuccess(editing ? 'Anggota diperbarui.' : 'Anggota ditambahkan.');
        router.refresh();
    }

    async function remove(m: Member) {
        if (!confirm(`Hapus anggota "${m.name}"? Data terkait (project, tugas) akan terhapus.`)) return;
        const res = await fetch('/api/members/delete', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: m.id }),
        });
        const data = await res.json();
        if (!res.ok) { showError(data.error ?? 'Gagal menghapus anggota.'); return; }
        showSuccess('Anggota dihapus.');
        router.refresh();
    }

    return (
        <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h2 className="text-lg font-semibold text-[#061E44]">Kelola Anggota</h2>
                    <p className="text-sm text-gray-500 mt-0.5">
                        Tambah, ubah, atau nonaktifkan akun anggota dari panel ini.
                    </p>
                </div>
                <button
                    onClick={() => (showForm ? setShowForm(false) : openCreate())}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-[#FF7A00] to-[#FF9A40] text-white text-sm font-semibold shadow-lg shadow-orange-500/30 hover:opacity-90 transition"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    {showForm ? 'Tutup' : 'Tambah Anggota'}
                </button>
            </div>

            {error && (
                <div className="mt-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">{error}</div>
            )}
            {success && (
                <div className="mt-4 text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-3">{success}</div>
            )}

            {showForm && (
                <form onSubmit={save} className="mt-4 bg-white rounded-xl border border-gray-200 p-6 space-y-4">
                    <h3 className="font-semibold text-[#061E44]">{editing ? `Ubah: ${editing.name}` : 'Tambah Anggota Baru'}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nama *</label>
                            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                                placeholder="mis. Budi Santoso" className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-[#FF7A00] outline-none transition" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                            <input type="text" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}
                                placeholder="mis. Desainer" className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-[#FF7A00] outline-none transition" />
                        </div>
                        {!editing && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                                    <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                                        placeholder="mis. budi@ordersapp.tech" className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-[#FF7A00] outline-none transition" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
                                    <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                                        placeholder="Kata sandi awal anggota" className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-[#FF7A00] outline-none transition" />
                                </div>
                            </>
                        )}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Foto (URL)</label>
                            <input type="url" value={form.avatar_url} onChange={(e) => setForm({ ...form, avatar_url: e.target.value })}
                                placeholder="https://.../foto.png" className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-[#FF7A00] outline-none transition" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-[#FF7A00] outline-none transition bg-white">
                                <option value="active">Aktif</option>
                                <option value="inactive">Nonaktif</option>
                            </select>
                        </div>
                    </div>
                    <label className="flex items-center gap-2 text-sm text-gray-700">
                        <input type="checkbox" checked={form.is_admin} onChange={(e) => setForm({ ...form, is_admin: e.target.checked })}
                            className="w-4 h-4 accent-[#FF7A00]" />
                        Beri akses admin
                    </label>
                    <div className="flex gap-3">
                        <button type="submit" disabled={saving}
                            className="px-5 py-2.5 rounded-lg bg-[#FF7A00] text-white font-semibold hover:opacity-90 transition disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center gap-2">
                            {saving && (
                                <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 12a8 8 0 018-8v0a8 8 0 018 8" />
                                </svg>
                            )}
                            {saving ? 'Menyimpan...' : editing ? 'Simpan Perubahan' : 'Tambah Anggota'}
                        </button>
                        <button type="button" onClick={() => setShowForm(false)}
                            className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-600 font-medium hover:bg-gray-50 transition">
                            Batal
                        </button>
                    </div>
                </form>
            )}

            <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-3">
                {members.map((m) => (
                    <div key={m.id} className="bg-white rounded-xl border border-gray-200 px-4 py-3 flex items-center gap-3">
                        {m.avatar_url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={m.avatar_url} alt={m.name} className="w-9 h-9 rounded-full object-cover shrink-0" />
                        ) : (
                            <div className="w-9 h-9 rounded-full bg-orange-100 text-[#FF7A00] flex items-center justify-center text-xs font-semibold shrink-0">
                                {m.name.slice(0, 2).toUpperCase()}
                            </div>
                        )}
                        <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-[#061E44] truncate">
                                {m.name}
                                {m.status === 'inactive' && (
                                    <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-500 font-medium">NONAKTIF</span>
                                )}
                            </p>
                            <p className="text-xs text-gray-500 truncate">{m.role}{m.is_admin ? ' · Admin' : ''}</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                            <button onClick={() => openEdit(m)} className="p-1.5 text-gray-300 hover:text-[#FF7A00] transition" aria-label="Ubah">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                            </button>
                            <button onClick={() => remove(m)} className="p-1.5 text-gray-300 hover:text-red-500 transition" aria-label="Hapus">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
