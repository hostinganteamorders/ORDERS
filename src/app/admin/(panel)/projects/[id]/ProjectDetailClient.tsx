'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { formatRupiah, formatDate, calculateDistribution, KAS_ORDERS_PERCENT } from '@/lib/format';

type Project = {
    id: string;
    name: string;
    client_name: string | null;
    description: string | null;
    total_value: number;
    status: string;
    created_at: string;
    completed_at: string | null;
};

type Member = {
    id: string;
    name: string;
    role: string;
    avatar_url?: string | null;
    contribution_percent: number;
    pm_id: string;
};

type AllMember = { id: string; name: string; role: string };
type Distribution = {
    id: string;
    total_value: number;
    kas_orders_amount: number;
    member_amount: number;
    created_at: string;
};

type Props = {
    project: Project;
    members: Member[];
    allMembers: AllMember[];
    distributions: Distribution[];
    isAdmin: boolean;
    statusLabel: Record<string, string>;
    statusColor: Record<string, string>;
};

export default function ProjectDetailClient({
    project: initialProject,
    members: initialMembers,
    allMembers,
    distributions: initialDistributions,
    isAdmin,
    statusLabel,
    statusColor,
}: Props) {
    const router = useRouter();
    const [project, setProject] = useState(initialProject);
    const [members, setMembers] = useState(initialMembers);
    const [distributions, setDistributions] = useState(initialDistributions);
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({
        name: initialProject.name,
        client_name: initialProject.client_name ?? '',
        description: initialProject.description ?? '',
        total_value: String(initialProject.total_value),
        status: initialProject.status,
    });
    const [addingMember, setAddingMember] = useState(false);
    const [newMemberId, setNewMemberId] = useState('');
    const [newPercent, setNewPercent] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const supabase = createClient();

    function showError(msg: string) {
        setError(msg);
        setSuccess(null);
    }
    function showSuccess(msg: string) {
        setSuccess(msg);
        setError(null);
    }

    async function saveProject() {
        setLoading(true);
        setError(null);
        const value = Number(form.total_value);
        if (!form.name.trim()) {
            showError('Nama project wajib diisi.');
            setLoading(false);
            return;
        }
        if (!form.total_value || value <= 0) {
            showError('Nilai project harus lebih dari 0.');
            setLoading(false);
            return;
        }

        const { error: err } = await supabase
            .from('projects')
            .update({
                name: form.name.trim(),
                client_name: form.client_name.trim() || null,
                description: form.description.trim() || null,
                total_value: value,
                status: form.status,
                completed_at: form.status === 'active' ? null : (initialProject.completed_at ?? new Date().toISOString()),
            })
            .eq('id', project.id);

        if (err) {
            showError('Gagal menyimpan: ' + err.message);
            setLoading(false);
            return;
        }

        setProject((p) => ({ ...p, ...form, total_value: value, completed_at: form.status === 'active' ? null : (p.completed_at ?? new Date().toISOString()) }));
        setEditing(false);
        showSuccess('Project berhasil diperbarui.');
        setLoading(false);
        router.refresh();
    }

    async function addMemberRow() {
        setError(null);
        if (!newMemberId) {
            showError('Pilih anggota terlebih dahulu.');
            return;
        }
        if (!newPercent || Number(newPercent) <= 0) {
            showError('Persentase kontribusi harus lebih dari 0.');
            return;
        }

        const currentTotal = members.reduce((s, m) => s + m.contribution_percent, 0);
        if (currentTotal + Number(newPercent) > 100) {
            showError(`Total kontribusi melebihi 100% (sekarang ${currentTotal}% + ${newPercent}%).`);
            return;
        }

        const { error: err } = await supabase.from('project_members').insert({
            project_id: project.id,
            profile_id: newMemberId,
            contribution_percent: Number(newPercent),
        });

        if (err) {
            showError('Gagal menambahkan anggota: ' + err.message);
            return;
        }

        const chosen = allMembers.find((m) => m.id === newMemberId);
        setMembers((prev) => [...prev, { ...chosen!, contribution_percent: Number(newPercent), pm_id: crypto.randomUUID() }]);
        setNewMemberId('');
        setNewPercent('');
        setAddingMember(false);
        showSuccess('Anggota ditambahkan.');
        router.refresh();
    }

    async function removeMember(pmId: string, memberName: string) {
        if (!confirm(`Hapus ${memberName} dari project ini?`)) return;
        const { error: err } = await supabase.from('project_members').delete().eq('id', pmId);
        if (err) {
            showError('Gagal menghapus: ' + err.message);
            return;
        }
        setMembers((prev) => prev.filter((m) => m.pm_id !== pmId));
        showSuccess(`${memberName} dihapus dari project.`);
        router.refresh();
    }

    async function distribute() {
        setLoading(true);
        setError(null);
        const totalPercent = members.reduce((s, m) => s + m.contribution_percent, 0);
        if (totalPercent !== 100) {
            showError(`Total kontribusi harus tepat 100% (sekarang ${totalPercent}%).`);
            setLoading(false);
            return;
        }
        const dist = calculateDistribution(Number(project.total_value), members.map((m) => ({ percent: m.contribution_percent })));

        const { error: err } = await supabase.from('distributions').insert({
            project_id: project.id,
            total_value: dist.total,
            kas_orders_percent: KAS_ORDERS_PERCENT,
            kas_orders_amount: dist.kasAmount,
            member_amount: dist.distributable,
        });

        if (err) {
            showError('Gagal menyimpan bagi hasil: ' + err.message);
            setLoading(false);
            return;
        }

        setDistributions((prev) => [
            {
                id: crypto.randomUUID(),
                total_value: dist.total,
                kas_orders_amount: dist.kasAmount,
                member_amount: dist.distributable,
                created_at: new Date().toISOString(),
            },
            ...prev,
        ]);
        showSuccess('Bagi hasil berhasil disimpan ke riwayat.');
        setLoading(false);
        router.refresh();
    }

    async function deleteProject() {
        if (!confirm('Hapus project ini beserta seluruh datanya? Tindakan ini tidak bisa dibatalkan.')) return;
        const { error: err } = await supabase.from('projects').delete().eq('id', project.id);
        if (err) {
            showError('Gagal menghapus: ' + err.message);
            return;
        }
        router.push('/admin/projects');
        router.refresh();
    }

    const dist = calculateDistribution(Number(project.total_value), members.map((m) => ({ percent: m.contribution_percent })));

    const availableNewMembers = allMembers.filter((m) => !members.some((mm) => mm.id === m.id));

    return (
        <>
            <div className="mb-8">
                <button
                    onClick={() => router.push('/admin/projects')}
                    className="text-sm text-gray-500 hover:text-[#FF7A00] transition flex items-center gap-1 mb-3"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Semua Project
                </button>

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl md:text-3xl font-bold text-[#061E44]">{project.name}</h1>
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${statusColor[project.status]}`}>
                                {statusLabel[project.status] ?? project.status}
                            </span>
                        </div>
                        <p className="text-gray-500 mt-1">
                            {project.client_name ? `Klien: ${project.client_name} · ` : ''}Dibuat {formatDate(project.created_at)}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        {isAdmin && (
                            <>
                                <button
                                    onClick={distribute}
                                    disabled={loading}
                                    className="px-4 py-2.5 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition disabled:opacity-50"
                                >
                                    {loading ? 'Menyimpan...' : 'Simpan Bagi Hasil'}
                                </button>
                                <button
                                    onClick={() => { setEditing(!editing); setError(null); }}
                                    className="px-4 py-2.5 rounded-lg border border-gray-300 text-gray-600 text-sm font-medium hover:bg-gray-50 transition"
                                >
                                    {editing ? 'Tutup Edit' : 'Edit'}
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {error && (
                <div className="mb-6 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">{error}</div>
            )}
            {success && (
                <div className="mb-6 text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-3">{success}</div>
            )}

            {editing && isAdmin && (
                <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6 space-y-4">
                    <h2 className="font-semibold text-[#061E44]">Edit Project</h2>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nama Project</label>
                        <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-[#FF7A00] outline-none transition" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Klien</label>
                        <input type="text" value={form.client_name} onChange={(e) => setForm({ ...form, client_name: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-[#FF7A00] outline-none transition" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                        <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-[#FF7A00] outline-none transition" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nilai Total (Rp)</label>
                            <input type="number" min="0" value={form.total_value} onChange={(e) => setForm({ ...form, total_value: e.target.value })}
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-[#FF7A00] outline-none transition" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-[#FF7A00] outline-none transition bg-white">
                                <option value="active">Aktif</option>
                                <option value="completed">Selesai</option>
                                <option value="paid">Dibayar</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={saveProject} disabled={loading}
                            className="px-5 py-2.5 rounded-lg bg-[#FF7A00] text-white font-semibold hover:opacity-90 transition disabled:opacity-50">
                            {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </button>
                        <button onClick={deleteProject}
                            className="px-5 py-2.5 rounded-lg border border-red-200 text-red-600 font-medium hover:bg-red-50 transition ml-auto">
                            Hapus Project
                        </button>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-[#061E44]">Anggota & Kontribusi</h2>
                    {isAdmin && (
                        <button onClick={() => setAddingMember(!addingMember)}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-[#FF7A00] text-[#FF7A00] text-sm font-medium hover:bg-orange-50 transition">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            {addingMember ? 'Tutup' : 'Tambah Anggota'}
                        </button>
                    )}
                </div>

                {addingMember && isAdmin && (
                    <div className="flex flex-col md:flex-row gap-3 mb-4 p-4 bg-orange-50/50 rounded-lg">
                        <select value={newMemberId} onChange={(e) => setNewMemberId(e.target.value)}
                            className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 focus:border-[#FF7A00] outline-none transition bg-white">
                            <option value="">Pilih anggota...</option>
                            {availableNewMembers.map((m) => (
                                <option key={m.id} value={m.id}>{m.name} · {m.role}</option>
                            ))}
                        </select>
                        <div className="flex items-center gap-2">
                            <input type="number" min="0" max="100" value={newPercent} onChange={(e) => setNewPercent(e.target.value)}
                                placeholder="%" className="w-28 px-4 py-2.5 rounded-lg border border-gray-300 focus:border-[#FF7A00] outline-none transition" />
                            <span className="text-gray-500">%</span>
                        </div>
                        <button onClick={addMemberRow} className="px-4 py-2.5 rounded-lg bg-[#FF7A00] text-white text-sm font-semibold hover:opacity-90 transition">
                            Tambah
                        </button>
                    </div>
                )}

                {members.length === 0 ? (
                    <div className="text-center py-8 text-gray-400 text-sm border border-dashed border-gray-300 rounded-lg">
                        Belum ada anggota di project ini.
                    </div>
                ) : (
                    <div className="space-y-3">
                        {members.map((m) => {
                            const amount = dist.totalPercent > 0 ? (dist.distributable * m.contribution_percent) / dist.totalPercent : 0;
                            return (
                                <div key={m.pm_id} className="flex items-center gap-3">
                                    {m.avatar_url ? (
                                        <img src={m.avatar_url} alt={m.name} className="w-10 h-10 rounded-full object-cover shrink-0" />
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-orange-100 text-[#FF7A00] flex items-center justify-center text-xs font-semibold shrink-0">
                                            {m.name.slice(0, 2).toUpperCase()}
                                        </div>
                                    )}
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-medium text-[#061E44]">{m.name}</p>
                                        <p className="text-xs text-gray-500">{m.role}</p>
                                    </div>
                                    <div className="w-32 hidden md:block">
                                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-gradient-to-r from-[#FF7A00] to-[#FF9A40] rounded-full"
                                                style={{ width: `${m.contribution_percent}%` }} />
                                        </div>
                                    </div>
                                    <span className="w-14 text-right text-sm font-medium">{m.contribution_percent}%</span>
                                    <span className="w-32 text-right text-sm font-semibold text-[#061E44] hidden sm:block">
                                        {formatRupiah(amount)}
                                    </span>
                                    {isAdmin && (
                                        <button onClick={() => removeMember(m.pm_id, m.name)}
                                            className="p-1.5 text-gray-300 hover:text-red-500 transition" aria-label="Hapus">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}

                {members.length > 0 && (
                    <div className={`mt-4 flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium ${dist.totalPercent === 100 ? 'bg-emerald-50 text-emerald-700' : 'bg-orange-50 text-[#FF7A00]'}`}>
                        <span>Total kontribusi</span>
                        <span>{dist.totalPercent}% {dist.totalPercent === 100 ? '✓' : `(kurang ${(100 - dist.totalPercent).toFixed(1)}%)`}</span>
                    </div>
                )}
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-[#061E44] mb-4">Riwayat Bagi Hasil</h2>
                {distributions.length === 0 ? (
                    <div className="text-center py-8 text-gray-400 text-sm border border-dashed border-gray-300 rounded-lg">
                        Belum ada riwayat bagi hasil. Klik &quot;Simpan Bagi Hasil&quot; untuk mendistribusikan dana.
                    </div>
                ) : (
                    <div className="space-y-3">
                        {distributions.map((d) => (
                            <div key={d.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                <div>
                                    <p className="text-sm font-medium text-[#061E44]">{formatDate(d.created_at)}</p>
                                    <p className="text-xs text-gray-500">
                                        Kas ORDERS {formatRupiah(d.kas_orders_amount)} · Dibagikan {formatRupiah(d.member_amount)}
                                    </p>
                                </div>
                                <span className="text-sm font-semibold text-emerald-600">{formatRupiah(d.total_value)}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}