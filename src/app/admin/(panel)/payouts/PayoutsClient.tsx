'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { formatRupiah, formatDate, calculateDistribution, KAS_ORDERS_PERCENT } from '@/lib/format';

type Payout = {
    id: string;
    project_id: string | null;
    project_name: string;
    date: string;
    total_amount: number;
    orders_fee: number;
    net_amount: number;
    status: 'pending' | 'processing' | 'paid';
    created_at: string;
};

type PayoutMember = {
    id: string;
    payout_id: string;
    member_id: string | null;
    name: string;
    contribution_percent: number;
    amount: number;
};

type Project = { id: string; name: string; status: string; total_value: number; client_name: string | null };
type ProjectMember = { project_id: string; profile_id: string; contribution_percent: number; member_name: string };

type Props = {
    payouts: Payout[];
    payoutMembers: PayoutMember[];
    projects: Project[];
    projectMembers: ProjectMember[];
    isAdmin: boolean;
};

const statusLabel: Record<string, string> = { pending: 'Menunggu', processing: 'Diproses', paid: 'Dibayar' };
const statusColor: Record<string, string> = {
    pending: 'bg-amber-100 text-amber-700',
    processing: 'bg-blue-100 text-blue-700',
    paid: 'bg-emerald-100 text-emerald-700',
};

export default function PayoutsClient({ payouts, payoutMembers, projects, projectMembers, isAdmin }: Props) {
    const router = useRouter();
    const [rows, setRows] = useState(payouts);
    const [members, setMembers] = useState(payoutMembers);
    const [filter, setFilter] = useState<'all' | 'pending' | 'processing' | 'paid'>('all');
    const [showForm, setShowForm] = useState(false);
    const [expanded, setExpanded] = useState<Record<string, boolean>>({});
    const [form, setForm] = useState({ project_id: '', date: new Date().toISOString().slice(0, 10) });
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);

    function showError(msg: string) { setError(msg); setSuccess(null); }
    function showSuccess(msg: string) { setSuccess(msg); setError(null); }

    const membersByPayout = useMemo(() => {
        const map = new Map<string, PayoutMember[]>();
        for (const m of members) {
            const arr = map.get(m.payout_id) ?? [];
            arr.push(m);
            map.set(m.payout_id, arr);
        }
        return map;
    }, [members]);

    const filtered = rows.filter((p) => filter === 'all' || p.status === filter);

    const totalNet = rows.reduce((s, p) => s + p.net_amount, 0);
    const totalPaid = rows.filter((p) => p.status === 'paid').reduce((s, p) => s + p.net_amount, 0);

    const selectedProject = useMemo(
        () => projects.find((p) => p.id === form.project_id) ?? null,
        [form.project_id, projects]
    );

    const preview = useMemo(() => {
        if (!selectedProject) return null;
        const contribs = projectMembers
            .filter((pm) => pm.project_id === selectedProject.id)
            .map((pm) => ({ percent: pm.contribution_percent }));
        return calculateDistribution(selectedProject.total_value, contribs);
    }, [selectedProject, projectMembers]);

    const eligibleProjects = projects.filter((p) => p.status === 'completed' || p.status === 'paid');

    async function createPayout(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        if (!form.project_id || !form.date) {
            showError('Pilih project dan tanggal payout.');
            return;
        }
        if (!selectedProject || !preview || preview.memberShares.length === 0) {
            showError('Project ini belum memiliki anggota dengan kontribusi.');
            return;
        }

        setSaving(true);
        const supabase = createClient();
        const { data: payout, error: err } = await supabase
            .from('payouts')
            .insert({
                project_id: selectedProject.id,
                project_name: selectedProject.name,
                date: form.date,
                total_amount: preview.total,
                orders_fee: preview.kasAmount,
                net_amount: preview.distributable,
                status: 'pending',
            })
            .select('id')
            .single();

        if (err || !payout) {
            setSaving(false);
            showError('Gagal membuat payout: ' + (err?.message ?? 'unknown'));
            return;
        }

        for (const pm of projectMembers.filter((x) => x.project_id === selectedProject.id)) {
            const amount = preview.totalPercent > 0
                ? (preview.distributable * pm.contribution_percent) / preview.totalPercent
                : 0;
            const { error: merr } = await supabase.from('payout_members').insert({
                payout_id: payout.id,
                member_id: pm.profile_id,
                name: pm.member_name,
                contribution_percent: pm.contribution_percent,
                amount: Number(amount.toFixed(2)),
            });
            if (merr) {
                setSaving(false);
                showError('Payout dibuat, tapi gagal menyimpan sebagian rincian: ' + merr.message);
                router.refresh();
                return;
            }
        }

        setSaving(false);
        setShowForm(false);
        setForm({ project_id: '', date: new Date().toISOString().slice(0, 10) });
        showSuccess(`Payout untuk "${selectedProject.name}" dibuat.`);
        router.refresh();
    }

    async function updateStatus(id: string, status: string) {
        const supabase = createClient();
        const { error: err } = await supabase.from('payouts').update({ status }).eq('id', id);
        if (err) { showError('Gagal update status: ' + err.message); return; }
        setRows((prev) => prev.map((p) => (p.id === id ? { ...p, status: status as Payout['status'] } : p)));
        showSuccess(`Status payout diperbarui menjadi "${statusLabel[status]}".`);
        router.refresh();
    }

    async function removePayout(id: string) {
        if (!confirm('Hapus payout ini? Rincian per member ikut terhapus.')) return;
        const supabase = createClient();
        const { error: err } = await supabase.from('payouts').delete().eq('id', id);
        if (err) { showError('Gagal menghapus: ' + err.message); return; }
        setRows((prev) => prev.filter((p) => p.id !== id));
        setMembers((prev) => prev.filter((m) => m.payout_id !== id));
        showSuccess('Payout dihapus.');
        router.refresh();
    }

    function exportCsv() {
        const header = ['Tanggal', 'Project', 'Total (Rp)', 'Fee ORDERS (Rp)', 'Net (Rp)', 'Status', 'Rincian Member'];
        const lines = filtered.map((p) => {
            const ms = (membersByPayout.get(p.id) ?? [])
                .map((m) => `${m.name} ${formatRupiah(m.amount)}`)
                .join('; ');
            return [
                p.date,
                `"${p.project_name.replace(/"/g, '""')}"`,
                p.total_amount,
                p.orders_fee,
                p.net_amount,
                statusLabel[p.status],
                `"${ms.replace(/"/g, '""')}"`,
            ].join(',');
        });
        const csv = [header.join(','), ...lines].join('\n');
        const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `payouts-ord.csv`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
    }

    const toggleExpand = (id: string) => setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

    return (
        <>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-[#061E44]">Payouts</h1>
                    <p className="text-gray-500 mt-1">
                        Pencairan dana project ke anggota ({KAS_ORDERS_PERCENT}% fee ORDERS otomatis).
                    </p>
                </div>
                <div className="flex gap-2 print:hidden">
                    <button
                        onClick={exportCsv}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-gray-300 text-gray-600 text-sm font-medium hover:bg-gray-50 transition"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        CSV
                    </button>
                    <button
                        onClick={() => window.print()}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-gray-300 text-gray-600 text-sm font-medium hover:bg-gray-50 transition"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                        </svg>
                        Print
                    </button>
                    {isAdmin && (
                        <button
                            onClick={() => (showForm ? setShowForm(false) : setShowForm(true))}
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-[#FF7A00] to-[#FF9A40] text-white text-sm font-semibold shadow-lg shadow-orange-500/30 hover:opacity-90 transition"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            {showForm ? 'Tutup' : 'Buat Payout'}
                        </button>
                    )}
                </div>
            </div>

            <div className="hidden print:block mb-6">
                <h1 className="text-xl font-bold">Laporan Payout ORDERS</h1>
                <p className="text-sm text-gray-500">Dicetak {new Intl.DateTimeFormat('id-ID').format(new Date())}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 print:hidden">
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                    <p className="text-sm text-gray-500">Total Payout</p>
                    <p className="text-xl font-bold text-[#061E44] mt-1">{formatRupiah(totalNet)}</p>
                    <p className="text-xs text-gray-400 mt-1">net setelah fee ORDERS</p>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                    <p className="text-sm text-gray-500">Sudah Dibayar</p>
                    <p className="text-xl font-bold text-emerald-600 mt-1">{formatRupiah(totalPaid)}</p>
                    <p className="text-xs text-gray-400 mt-1">payout berstatus Dibayar</p>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                    <p className="text-sm text-gray-500">Belum Dibayar</p>
                    <p className="text-xl font-bold text-amber-600 mt-1">{formatRupiah(totalNet - totalPaid)}</p>
                    <p className="text-xs text-gray-400 mt-1">pending + diproses</p>
                </div>
            </div>

            {error && (
                <div className="mb-6 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3 print:hidden">{error}</div>
            )}
            {success && (
                <div className="mb-6 text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-3 print:hidden">{success}</div>
            )}

            {showForm && isAdmin && (
                <form onSubmit={createPayout} className="bg-white rounded-xl border border-gray-200 p-6 mb-6 space-y-4 print:hidden">
                    <h2 className="font-semibold text-[#061E44]">Buat Payout dari Project</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Project *</label>
                            <select value={form.project_id} onChange={(e) => setForm({ ...form, project_id: e.target.value })}
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-[#FF7A00] outline-none transition bg-white">
                                <option value="">Pilih project (selesai / dibayar)...</option>
                                {eligibleProjects.map((p) => (
                                    <option key={p.id} value={p.id}>{p.name} · {p.status}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Payout *</label>
                            <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })}
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-[#FF7A00] outline-none transition" />
                        </div>
                    </div>

                    {preview && (
                        <div className="bg-gray-50 rounded-xl p-4">
                            <p className="text-sm font-semibold text-[#061E44] mb-2">Ringkasan</p>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                                <div>
                                    <p className="text-xs text-gray-500">Nilai Project</p>
                                    <p className="font-semibold">{formatRupiah(preview.total)}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Fee ORDERS ({KAS_ORDERS_PERCENT}%)</p>
                                    <p className="font-semibold text-[#FF7A00]">{formatRupiah(preview.kasAmount)}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Net untuk Member</p>
                                    <p className="font-semibold text-emerald-600">{formatRupiah(preview.distributable)}</p>
                                </div>
                            </div>
                            {preview.memberShares.length > 0 ? (
                                <div className="mt-3 space-y-1">
                                    {projectMembers.filter((pm) => pm.project_id === selectedProject!.id).map((pm) => {
                                        const share = preview.memberShares.find((s) => s.percent === pm.contribution_percent);
                                        return (
                                            <div key={pm.profile_id} className="flex items-center justify-between text-sm">
                                                <span className="text-gray-600">{pm.member_name} · {pm.contribution_percent}%</span>
                                                <span className="font-medium">{formatRupiah(preview.memberShares.length === 1 ? preview.distributable : (preview.distributable * pm.contribution_percent) / preview.totalPercent)}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <p className="text-xs text-gray-400 mt-2">Project ini belum memiliki anggota.</p>
                            )}
                        </div>
                    )}

                    <div className="flex gap-3">
                        <button type="submit" disabled={saving}
                            className="px-5 py-2.5 rounded-lg bg-[#FF7A00] text-white font-semibold hover:opacity-90 transition disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center gap-2">
                            {saving && (
                                <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 12a8 8 0 018-8v0a8 8 0 018 8" />
                                </svg>
                            )}
                            {saving ? 'Menyimpan...' : 'Simpan Payout'}
                        </button>
                        <button type="button" onClick={() => setShowForm(false)}
                            className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-600 font-medium hover:bg-gray-50 transition">
                            Batal
                        </button>
                    </div>
                </form>
            )}

            <div className="flex gap-2 mb-6 print:hidden">
                {(['all', 'pending', 'processing', 'paid'] as const).map((f) => (
                    <button key={f} onClick={() => setFilter(f)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition ${filter === f ? 'bg-[#061E44] text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                        {f === 'all' ? 'Semua' : statusLabel[f]}
                    </button>
                ))}
            </div>

            {filtered.length === 0 ? (
                <div className="bg-white rounded-xl border border-dashed border-gray-300 p-16 text-center text-gray-400 print:hidden">
                    <p className="text-lg font-medium mb-1">Belum ada payout</p>
                    <p className="text-sm">Buat payout dari project yang selesai atau dibayar.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {filtered.map((p) => {
                        const ms = membersByPayout.get(p.id) ?? [];
                        const isOpen = !!expanded[p.id];
                        return (
                            <div key={p.id} className="bg-white rounded-xl border border-gray-200">
                                <div className="flex items-center gap-4 p-4">
                                    <button onClick={() => toggleExpand(p.id)} className="p-1.5 text-gray-300 hover:text-[#FF7A00] transition print:hidden" aria-label="Rincian">
                                        <svg className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    <div className="min-w-0 flex-1">
                                        <p className="font-medium text-[#061E44] truncate">{p.project_name}</p>
                                        <p className="text-xs text-gray-500">{formatDate(p.date)} · {ms.length} member</p>
                                    </div>
                                    <div className="hidden md:block text-right">
                                        <p className="text-xs text-gray-400">Total {formatRupiah(p.total_amount)}</p>
                                        <p className="text-xs text-[#FF7A00]">Fee {formatRupiah(p.orders_fee)}</p>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <p className="font-bold text-emerald-600">{formatRupiah(p.net_amount)}</p>
                                        <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[11px] font-medium ${statusColor[p.status]}`}>
                                            {statusLabel[p.status]}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0 print:hidden">
                                        {isAdmin && p.status === 'pending' && (
                                            <button onClick={() => updateStatus(p.id, 'processing')}
                                                className="px-3 py-1.5 rounded-lg border border-blue-200 text-blue-600 text-xs font-medium hover:bg-blue-50 transition">
                                                Diproses
                                            </button>
                                        )}
                                        {isAdmin && p.status === 'processing' && (
                                            <button onClick={() => updateStatus(p.id, 'paid')}
                                                className="px-3 py-1.5 rounded-lg border border-emerald-200 text-emerald-600 text-xs font-medium hover:bg-emerald-50 transition">
                                                Tandai Dibayar
                                            </button>
                                        )}
                                        {isAdmin && (
                                            <button onClick={() => removePayout(p.id)} className="p-1.5 text-gray-300 hover:text-red-500 transition" aria-label="Hapus">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        )}
                                    </div>
                                </div>
                                {isOpen && (
                                    <div className="border-t border-gray-100 px-4 py-3 space-y-2">
                                        {ms.length > 0 ? (
                                            <table className="w-full text-sm">
                                                <thead>
                                                    <tr className="text-left text-xs text-gray-500 border-b border-gray-100">
                                                        <th className="py-2 pr-3 font-medium">Anggota</th>
                                                        <th className="py-2 pr-3 font-medium text-right">Kontribusi</th>
                                                        <th className="py-2 font-medium text-right">Jumlah</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {ms.map((m) => (
                                                        <tr key={m.id} className="border-b border-gray-50">
                                                            <td className="py-2 pr-3 font-medium text-[#061E44]">{m.name}</td>
                                                            <td className="py-2 pr-3 text-right text-gray-500">{m.contribution_percent}%</td>
                                                            <td className="py-2 text-right font-semibold text-emerald-600">{formatRupiah(m.amount)}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        ) : (
                                            <p className="text-xs text-gray-400 text-center py-2">Tidak ada rincian member.</p>
                                        )}
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
