import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { formatRupiah, formatDate } from '@/lib/format';
import DashboardCharts, { statusName, statusColor } from '@/components/admin/DashboardCharts';

type Project = {
    id: string;
    name: string;
    client_name: string | null;
    total_value: number;
    status: string;
    created_at: string;
    completed_at: string | null;
};

export default async function AdminDashboardPage() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    const { data: profile } = await supabase
        .from('profiles')
        .select('name, role, is_admin')
        .eq('id', user?.id)
        .single();

    const { data: projects } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

    const { data: members } = await supabase
        .from('profiles')
        .select('id, name, role, avatar_url')
        .order('name');

    const { data: projectMembers } = await supabase
        .from('project_members')
        .select('project_id, profile_id, contribution_percent, projects!inner(status, total_value)');

    const { data: transactions } = await supabase
        .from('transactions')
        .select('date, type, amount');

    const { data: payoutMembers } = await supabase
        .from('payout_members')
        .select('member_id, amount');

    const allProjects: Project[] = (projects ?? []) as Project[];

    const totalRevenue = allProjects.reduce((s, p) => s + (Number(p.total_value) || 0), 0);
    const allTx = transactions ?? [];
    const totalIncome = allTx.filter((t: any) => t.type === 'income').reduce((s: number, t: any) => s + Number(t.amount), 0);
    const totalExpense = allTx.filter((t: any) => t.type === 'expense').reduce((s: number, t: any) => s + Number(t.amount), 0);
    const kasRiil = totalIncome - totalExpense;
    const activeCount = allProjects.filter((p) => p.status === 'active').length;
    const completedCount = allProjects.filter((p) => p.status === 'completed' || p.status === 'paid').length;
    const paidCount = allProjects.filter((p) => p.status === 'paid').length;

    const recentProjects = allProjects.slice(0, 5);

    const statusLabel: Record<string, string> = {
        active: 'Aktif',
        completed: 'Selesai',
        paid: 'Dibayar',
    };
    const statusColor: Record<string, string> = {
        active: 'bg-blue-100 text-blue-700',
        completed: 'bg-emerald-100 text-emerald-700',
        paid: 'bg-green-600 text-white',
    };

    // Per-member stats (pendapatan riil dari payout)
    const memberStats = (members ?? []).map((m) => {
        const rows = (projectMembers ?? []).filter((pm: any) => pm.profile_id === m.id);
        const projectCount = rows.length;
        const totalIncome = (payoutMembers ?? [])
            .filter((pm: any) => pm.member_id === m.id)
            .reduce((sum: number, pm: any) => sum + Number(pm.amount), 0);
        return { ...m, projectCount, totalIncome };
    });
    memberStats.sort((a, b) => b.totalIncome - a.totalIncome);

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    const now = new Date();
    const monthly = Array.from({ length: 6 }, (_, i) => {
        const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        const monthTx = (transactions ?? []).filter((t: any) => (t.date ?? '').slice(0, 7) === key);
        const income = monthTx.filter((t: any) => t.type === 'income').reduce((s: number, t: any) => s + Number(t.amount), 0);
        const expense = monthTx.filter((t: any) => t.type === 'expense').reduce((s: number, t: any) => s + Number(t.amount), 0);
        return { month: monthNames[d.getMonth()], income, expense };
    });

    const statusData = ['active', 'completed', 'paid']
        .map((s) => ({
            name: statusName[s] ?? s,
            value: allProjects.filter((p) => p.status === s).length,
            color: statusColor[s] ?? '#9CA3AF',
        }))
        .filter((s) => s.value > 0);

    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-[#061E44]">
                        Halo, {profile?.name?.split(' ')[0] ?? 'Member'} 👋
                    </h1>
                    <p className="text-gray-500 mt-1">
                        Ringkasan project, pendapatan, dan kas ORDERS.
                    </p>
                </div>
                {profile?.is_admin && (
                    <Link
                        href="/admin/projects/new"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-[#FF7A00] to-[#FF9A40] text-white font-semibold shadow-lg shadow-orange-500/30 hover:opacity-90 transition"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Tambah Project
                    </Link>
                )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                    <p className="text-sm text-gray-500">Total Pendapatan</p>
                    <p className="text-xl font-bold text-[#061E44] mt-1">{formatRupiah(totalRevenue)}</p>
                    <p className="text-xs text-gray-400 mt-1">{allProjects.length} project</p>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                    <p className="text-sm text-gray-500">Kas Riil (Buku Kas)</p>
                    <p className={`text-xl font-bold mt-1 ${kasRiil >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>{formatRupiah(kasRiil)}</p>
                    <p className="text-xs text-gray-400 mt-1">dari pemasukan − pengeluaran</p>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                    <p className="text-sm text-gray-500">Project Aktif</p>
                    <p className="text-xl font-bold text-[#061E44] mt-1">{activeCount}</p>
                    <p className="text-xs text-gray-400 mt-1">sedang berjalan</p>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                    <p className="text-sm text-gray-500">Project Selesai / Dibayar</p>
                    <p className="text-xl font-bold text-emerald-600 mt-1">{completedCount}</p>
                    <p className="text-xs text-gray-400 mt-1">{paidCount} sudah dibayar</p>
                </div>
            </div>

            <DashboardCharts monthly={monthly} statusData={statusData} />

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Recent projects */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-[#061E44]">Project Terbaru</h2>
                        <Link href="/admin/projects" className="text-sm text-[#FF7A00] hover:underline">
                            Lihat semua
                        </Link>
                    </div>
                    {recentProjects.length === 0 ? (
                        <div className="text-center py-10 text-gray-400">
                            <p className="text-sm">Belum ada project. Mulai tambahkan project pertama.</p>
                            {profile?.is_admin && (
                                <Link href="/admin/projects/new" className="text-[#FF7A00] text-sm hover:underline mt-2 inline-block">
                                    + Tambah project
                                </Link>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {recentProjects.map((project) => (
                                <Link
                                    key={project.id}
                                    href={`/admin/projects/${project.id}`}
                                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 border border-transparent hover:border-gray-200 transition"
                                >
                                    <div className="min-w-0">
                                        <p className="font-medium text-sm text-[#061E44] truncate">{project.name}</p>
                                        <p className="text-xs text-gray-500 mt-0.5">
                                            {project.client_name || 'Tanpa klien'} · {formatDate(project.created_at)}
                                        </p>
                                    </div>
                                    <div className="text-right shrink-0 ml-4">
                                        <p className="font-semibold text-sm">{formatRupiah(project.total_value)}</p>
                                        <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[11px] font-medium ${statusColor[project.status]}`}>
                                            {statusLabel[project.status] ?? project.status}
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

                {/* Member ranking */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-[#061E44]">Pendapatan Anggota</h2>
                        <Link href="/admin/members" className="text-sm text-[#FF7A00] hover:underline">
                            Detail
                        </Link>
                    </div>
                    {memberStats.length === 0 ? (
                        <div className="text-center py-10 text-gray-400 text-sm">
                            Belum ada data anggota.
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {memberStats.slice(0, 6).map((m, i) => (
                                <div key={m.id} className="flex items-center gap-3">
                                    <div className="w-6 text-center text-sm font-bold text-gray-300">{i + 1}</div>
                                    <div className="w-9 h-9 rounded-full bg-orange-100 text-[#FF7A00] flex items-center justify-center text-xs font-semibold shrink-0">
                                        {m.name.slice(0, 2).toUpperCase()}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-medium text-[#061E44] truncate">{m.name}</p>
                                        <p className="text-xs text-gray-500">{m.role}</p>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <p className="text-sm font-semibold text-[#061E44]">{formatRupiah(m.totalIncome)}</p>
                                        <p className="text-xs text-gray-400">{m.projectCount} project</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}