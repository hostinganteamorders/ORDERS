'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

type Member = {
    id: string;
    name: string;
    role: string;
};

type ContributionRow = {
    profile_id: string;
    percent: string;
};

export default function ProjectForm({ members }: { members: Member[] }) {
    const router = useRouter();
    const [name, setName] = useState('');
    const [clientName, setClientName] = useState('');
    const [description, setDescription] = useState('');
    const [totalValue, setTotalValue] = useState('');
    const [status, setStatus] = useState('active');
    const [rows, setRows] = useState<ContributionRow[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    function addRow() {
        setRows((prev) => [...prev, { profile_id: '', percent: '' }]);
    }

    function removeRow(index: number) {
        setRows((prev) => prev.filter((_, i) => i !== index));
    }

    function updateRow(index: number, field: keyof ContributionRow, value: string) {
        setRows((prev) => prev.map((r, i) => (i === index ? { ...r, [field]: value } : r)));
    }

    const totalPercent = rows.reduce((sum, r) => sum + (Number(r.percent) || 0), 0);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);

        if (!name.trim()) {
            setError('Nama project wajib diisi.');
            return;
        }
        const value = Number(totalValue);
        if (!totalValue || value <= 0) {
            setError('Nilai project wajib diisi dan lebih dari 0.');
            return;
        }
        if (rows.length === 0) {
            setError('Tambahkan minimal 1 anggota beserta persentase kontribusinya.');
            return;
        }
        if (rows.some((r) => !r.profile_id)) {
            setError('Semua anggota wajib dipilih.');
            return;
        }
        if (Math.round(totalPercent) !== 100) {
            setError(`Total kontribusi harus 100% (sekarang: ${totalPercent}%).`);
            return;
        }

        setLoading(true);
        const supabase = createClient();

        const { data: project, error: projectError } = await supabase
            .from('projects')
            .insert({
                name: name.trim(),
                client_name: clientName.trim() || null,
                description: description.trim() || null,
                total_value: value,
                status,
            })
            .select('id')
            .single();

        if (projectError || !project) {
            setError('Gagal menyimpan project: ' + (projectError?.message ?? 'unknown'));
            setLoading(false);
            return;
        }

        const { error: membersError } = await supabase.from('project_members').insert(
            rows.map((r) => ({
                project_id: project.id,
                profile_id: r.profile_id,
                contribution_percent: Number(r.percent),
            }))
        );

        if (membersError) {
            setError('Project tersimpan tapi gagal menyimpan anggota: ' + membersError.message);
            setLoading(false);
            return;
        }

        router.push(`/admin/projects/${project.id}`);
        router.refresh();
    }

    const availableMembers = (currentRowId?: string) =>
        members.filter((m) => {
            const selectedInOtherRow = rows.some(
                (r) => r.profile_id === m.id && r.profile_id !== currentRowId
            );
            return !selectedInOtherRow;
        });

    return (
        <div>
            <div className="mb-8">
                <button
                    onClick={() => router.push('/admin/projects')}
                    className="text-sm text-gray-500 hover:text-[#FF7A00] transition flex items-center gap-1 mb-3"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Kembali
                </button>
                <h1 className="text-2xl font-bold text-[#061E44]">Tambah Project Baru</h1>
                <p className="text-gray-500 mt-1">Tentukan nilai project dan persentase kontribusi anggota.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
                    <h2 className="font-semibold text-[#061E44]">Informasi Project</h2>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nama Project *</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="mis. Website Toko Online"
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-[#FF7A00] focus:ring-2 focus:ring-[#FF7A00]/20 outline-none transition"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nama Klien</label>
                        <input
                            type="text"
                            value={clientName}
                            onChange={(e) => setClientName(e.target.value)}
                            placeholder="mis. PT Maju Jaya"
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-[#FF7A00] focus:ring-2 focus:ring-[#FF7A00]/20 outline-none transition"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                            placeholder="Deskripsi singkat project..."
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-[#FF7A00] focus:ring-2 focus:ring-[#FF7A00]/20 outline-none transition"
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nilai Total (Rp) *</label>
                            <input
                                type="number"
                                min="0"
                                value={totalValue}
                                onChange={(e) => setTotalValue(e.target.value)}
                                placeholder="10000000"
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-[#FF7A00] focus:ring-2 focus:ring-[#FF7A00]/20 outline-none transition"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-[#FF7A00] focus:ring-2 focus:ring-[#FF7A00]/20 outline-none transition bg-white"
                            >
                                <option value="active">Aktif</option>
                                <option value="completed">Selesai</option>
                                <option value="paid">Dibayar</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h2 className="font-semibold text-[#061E44]">Kontribusi Anggota</h2>
                            <p className="text-xs text-gray-500 mt-0.5">
                                Persentase kontribusi anggota dalam project ini. Total harus <span className="font-semibold text-[#FF7A00]">100%</span>. Kas ORDERS otomatis {10}%.
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={addRow}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-[#FF7A00] text-[#FF7A00] text-sm font-medium hover:bg-orange-50 transition"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Tambah Anggota
                        </button>
                    </div>

                    {rows.length === 0 ? (
                        <div className="text-center py-8 text-gray-400 border border-dashed border-gray-300 rounded-lg text-sm">
                            Belum ada anggota. Klik &quot;Tambah Anggota&quot; untuk memilih kontributor.
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {rows.map((row, index) => (
                                <div key={index} className="flex items-center gap-3">
                                    <div className="flex-1">
                                        <select
                                            value={row.profile_id}
                                            onChange={(e) => updateRow(index, 'profile_id', e.target.value)}
                                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-[#FF7A00] focus:ring-2 focus:ring-[#FF7A00]/20 outline-none transition bg-white"
                                        >
                                            <option value="">Pilih anggota...</option>
                                            {availableMembers(row.profile_id).map((m) => (
                                                <option key={m.id} value={m.id}>
                                                    {m.name} · {m.role}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="w-40">
                                        <div className="flex items-center">
                                            <input
                                                type="number"
                                                min="0"
                                                max="100"
                                                value={row.percent}
                                                onChange={(e) => updateRow(index, 'percent', e.target.value)}
                                                placeholder="%"
                                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-[#FF7A00] focus:ring-2 focus:ring-[#FF7A00]/20 outline-none transition"
                                            />
                                            <span className="ml-2 text-gray-500 text-sm">%</span>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removeRow(index)}
                                        className="p-2 text-gray-400 hover:text-red-500 transition"
                                        aria-label="Hapus"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {rows.length > 0 && (
                        <div className={`mt-4 flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium ${totalPercent === 100 ? 'bg-emerald-50 text-emerald-700' : 'bg-orange-50 text-[#FF7A00]'}`}>
                            <span>Total kontribusi</span>
                            <span>{totalPercent}% {totalPercent === 100 ? '✓' : `(kurang ${(100 - totalPercent).toFixed(1)}%)`}</span>
                        </div>
                    )}
                </div>

                {error && (
                    <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                        {error}
                    </div>
                )}

                <div className="flex gap-3">
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-3 rounded-lg bg-gradient-to-r from-[#FF7A00] to-[#FF9A40] text-white font-semibold shadow-lg shadow-orange-500/30 hover:opacity-90 transition disabled:opacity-50"
                    >
                        {loading ? 'Menyimpan...' : 'Simpan Project'}
                    </button>
                    <button
                        type="button"
                        onClick={() => router.push('/admin/projects')}
                        className="px-6 py-3 rounded-lg border border-gray-300 text-gray-600 font-medium hover:bg-gray-50 transition"
                    >
                        Batal
                    </button>
                </div>
            </form>
        </div>
    );
}