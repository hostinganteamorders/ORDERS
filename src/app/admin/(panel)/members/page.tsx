import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { formatRupiah, KAS_ORDERS_PERCENT } from '@/lib/format';

export default async function AdminMembersPage() {
    const supabase = await createClient();

    const { data: members } = await supabase
        .from('profiles')
        .select('id, name, role, avatar_url, is_admin')
        .order('name');

    const { data: projectMembers } = await supabase
        .from('project_members')
        .select(
            'profile_id, contribution_percent, project_id, projects!inner(name, status, total_value, created_at)'
        )
        .order('created_at', { ascending: false });

    const allProjects = new Map<string, { name: string; status: string; total_value: number }>();
    (projectMembers ?? []).forEach((pm: any) => {
        if (pm.projects) {
            allProjects.set(pm.project_id, {
                name: pm.projects.name,
                status: pm.projects.status,
                total_value: Number(pm.projects.total_value),
            });
        }
    });

    const statusLabel: Record<string, string> = { active: 'Aktif', completed: 'Selesai', paid: 'Dibayar' };
    const statusColor: Record<string, string> = {
        active: 'bg-blue-100 text-blue-700',
        completed: 'bg-emerald-100 text-emerald-700',
        paid: 'bg-green-600 text-white',
    };

    const stats = (members ?? []).map((member) => {
        const rows = (projectMembers ?? []).filter((pm: any) => pm.profile_id === member.id);
        const projectCount = rows.length;
        const activeProjects = rows.filter((pm: any) => pm.projects?.status === 'active').length;
        const paidProjects = rows.filter((pm: any) => pm.projects?.status === 'paid').length;

        const totalIncome = rows.reduce((sum: number, pm: any) => {
            if (pm.projects?.status !== 'paid') return sum;
            const value = Number(pm.projects?.total_value) || 0;
            const percent = Number(pm.contribution_percent) || 0;
            return sum + ((value * (100 - KAS_ORDERS_PERCENT)) / 100) * (percent / 100);
        }, 0);

        const pendingIncome = rows.reduce((sum: number, pm: any) => {
            if (pm.projects?.status !== 'completed') return sum;
            const value = Number(pm.projects?.total_value) || 0;
            const percent = Number(pm.contribution_percent) || 0;
            return sum + ((value * (100 - KAS_ORDERS_PERCENT)) / 100) * (percent / 100);
        }, 0);

        return { ...member, projectCount, activeProjects, paidProjects, totalIncome, pendingIncome, rows };
    });

    const totalIncomeAll = stats.reduce((s, m) => s + m.totalIncome, 0);

    return (
        <div className="max-w-6xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-[#061E44]">Statistik Anggota</h1>
                <p className="text-gray-500 mt-1">
                    Jumlah project yang ditangani dan pendapatan setiap anggota (Kas ORDERS {KAS_ORDERS_PERCENT}% dipotong otomatis).
                </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                    <p className="text-sm text-gray-500">Total Anggota</p>
                    <p className="text-xl font-bold text-[#061E44] mt-1">{stats.length} orang</p>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                    <p className="text-sm text-gray-500">Project Ditangani</p>
                    <p className="text-xl font-bold text-[#061E44] mt-1">{stats.reduce((s, m) => s + m.projectCount, 0)}</p>
                    <p className="text-xs text-gray-400 mt-1">total keterlibatan</p>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                    <p className="text-sm text-gray-500">Total Pendapatan (Dibayar)</p>
                    <p className="text-xl font-bold text-emerald-600 mt-1">{formatRupiah(totalIncomeAll)}</p>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                    <p className="text-sm text-gray-500">Kas ORDERS</p>
                    <p className="text-xl font-bold text-[#FF7A00] mt-1">{formatRupiah(totalIncomeAll / (100 - KAS_ORDERS_PERCENT) * KAS_ORDERS_PERCENT)}</p>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                {stats.map((m) => (
                    <div key={m.id} className="bg-white rounded-xl border border-gray-200 p-6">
                        <div className="flex items-center gap-4 mb-4">
                            {m.avatar_url ? (
                                <img src={m.avatar_url} alt={m.name} className="w-12 h-12 rounded-full object-cover shrink-0" />
                            ) : (
                                <div className="w-12 h-12 rounded-full bg-orange-100 text-[#FF7A00] flex items-center justify-center text-sm font-semibold shrink-0">
                                    {m.name.slice(0, 2).toUpperCase()}
                                </div>
                            )}
                            <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                    <p className="font-semibold text-[#061E44]">{m.name}</p>
                                    {m.is_admin && (
                                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#061E44] text-white font-medium">ADMIN</span>
                                    )}
                                </div>
                                <p className="text-sm text-gray-500">{m.role}</p>
                            </div>
                            <div className="text-right shrink-0">
                                <p className="text-lg font-bold text-emerald-600">{formatRupiah(m.totalIncome)}</p>
                                <p className="text-xs text-gray-400">pendapatan dibayar</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-3 mb-4">
                            <div className="bg-gray-50 rounded-lg p-3 text-center">
                                <p className="text-lg font-bold text-[#061E44]">{m.projectCount}</p>
                                <p className="text-xs text-gray-500">Project</p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-3 text-center">
                                <p className="text-lg font-bold text-blue-600">{m.activeProjects}</p>
                                <p className="text-xs text-gray-500">Aktif</p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-3 text-center">
                                <p className="text-lg font-bold text-emerald-600">{m.paidProjects}</p>
                                <p className="text-xs text-gray-500">Dibayar</p>
                            </div>
                        </div>

                        {m.pendingIncome > 0 && (
                            <p className="text-xs text-orange-600 mb-3 bg-orange-50 rounded-lg px-3 py-2">
                                Belum dibayar: {formatRupiah(m.pendingIncome)} (project selesai, menunggu pembayaran)
                            </p>
                        )}

                        {m.rows.length > 0 ? (
                            <div className="space-y-2">
                                {m.rows.map((pm: any) => (
                                    <div key={pm.project_id} className="flex items-center justify-between text-sm py-1.5 border-t border-gray-50">
                                        <div className="min-w-0 flex-1 pr-3">
                                            <Link href={`/admin/projects/${pm.project_id}`} className="font-medium text-[#061E44] hover:text-[#FF7A00] transition truncate block">
                                                {pm.projects?.name}
                                            </Link>
                                        </div>
                                        <span className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-medium mr-3 ${statusColor[pm.projects?.status]}`}>
                                            {statusLabel[pm.projects?.status] ?? pm.projects?.status}
                                        </span>
                                        <span className="text-xs text-gray-500 mr-3">{pm.contribution_percent}%</span>
                                        {pm.projects?.status === 'paid' && (
                                            <span className="font-semibold text-emerald-600 w-24 text-right">
                                                {formatRupiah(((Number(pm.projects?.total_value) * (100 - KAS_ORDERS_PERCENT)) / 100) * (Number(pm.contribution_percent) / 100))}
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-xs text-gray-400 text-center py-3">Belum terlibat di project mana pun.</p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}