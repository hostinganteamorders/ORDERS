import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { formatRupiah, formatDate, calculateDistribution, KAS_ORDERS_PERCENT } from '@/lib/format';
import ProjectDetailClient from './ProjectDetailClient';

export default async function ProjectDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    const { data: profile } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user?.id)
        .single();
    const isAdmin = profile?.is_admin ?? false;

    const { data: project } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();

    if (!project) {
        notFound();
    }

    const { data: projectMembers } = await supabase
        .from('project_members')
        .select('id, profile_id, contribution_percent, profiles!inner(id, name, role, avatar_url)')
        .eq('project_id', id)
        .order('contribution_percent', { ascending: false });

    const { data: distributions } = await supabase
        .from('distributions')
        .select('*')
        .eq('project_id', id)
        .order('created_at', { ascending: false });

    const { data: allMembers } = await supabase
        .from('profiles')
        .select('id, name, role')
        .order('name');

    const contributions = (projectMembers ?? []).map((pm: any) => ({
        profileId: pm.profile_id,
        percent: Number(pm.contribution_percent),
    }));

    const dist = calculateDistribution(Number(project.total_value) || 0, contributions);

    const statusLabel: Record<string, string> = { active: 'Aktif', completed: 'Selesai', paid: 'Dibayar' };
    const statusColor: Record<string, string> = {
        active: 'bg-blue-100 text-blue-700',
        completed: 'bg-emerald-100 text-emerald-700',
        paid: 'bg-green-600 text-white',
    };

    return (
        <div className="max-w-5xl mx-auto">
            <ProjectDetailClient
                project={project}
                members={(projectMembers ?? []).map((pm: any) => ({
                    id: pm.profiles.id,
                    name: pm.profiles.name,
                    role: pm.profiles.role,
                    avatar_url: pm.profiles.avatar_url,
                    contribution_percent: Number(pm.contribution_percent),
                    pm_id: pm.id,
                }))}
                allMembers={(allMembers ?? []).map((m) => ({ id: m.id, name: m.name, role: m.role }))}
                distributions={(distributions ?? []).map((d) => ({
                    id: d.id,
                    total_value: Number(d.total_value),
                    kas_orders_amount: Number(d.kas_orders_amount),
                    member_amount: Number(d.member_amount),
                    created_at: d.created_at,
                }))}
                isAdmin={isAdmin}
                statusLabel={statusLabel}
                statusColor={statusColor}
            />

            <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-[#061E44] mb-4">Ringkasan Bagi Hasil</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm text-gray-500">Nilai Total</p>
                        <p className="text-xl font-bold text-[#061E44] mt-1">{formatRupiah(dist.total)}</p>
                    </div>
                    <div className="bg-orange-50 rounded-lg p-4">
                        <p className="text-sm text-[#FF7A00]">Kas ORDERS ({KAS_ORDERS_PERCENT}%)</p>
                        <p className="text-xl font-bold text-[#FF7A00] mt-1">{formatRupiah(dist.kasAmount)}</p>
                    </div>
                    <div className="bg-emerald-50 rounded-lg p-4">
                        <p className="text-sm text-emerald-600">Dibagikan ke Anggota</p>
                        <p className="text-xl font-bold text-emerald-700 mt-1">{formatRupiah(dist.distributable)}</p>
                    </div>
                </div>

                {projectMembers && projectMembers.length > 0 ? (
                    <div className="space-y-3">
                        {projectMembers.map((pm: any) => {
                            const share = dist.memberShares.find(
                                (s) => s.percent === Number(pm.contribution_percent) && s.amount > 0
                            );
                            const amount =
                                (dist.distributable * (Number(pm.contribution_percent) || 0)) /
                                (dist.totalPercent > 0 ? dist.totalPercent : 1);
                            return (
                                <div key={pm.id} className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-orange-100 text-[#FF7A00] flex items-center justify-center text-xs font-semibold shrink-0">
                                        {pm.profiles.name.slice(0, 2).toUpperCase()}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-medium text-[#061E44]">{pm.profiles.name}</p>
                                        <p className="text-xs text-gray-500">{pm.profiles.role}</p>
                                    </div>
                                    <div className="w-32">
                                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-[#FF7A00] to-[#FF9A40] rounded-full"
                                                style={{ width: `${Number(pm.contribution_percent)}%` }}
                                            />
                                        </div>
                                    </div>
                                    <span className="w-14 text-right text-sm font-medium">{Number(pm.contribution_percent)}%</span>
                                    <span className="w-32 text-right text-sm font-semibold text-[#061E44]">{formatRupiah(amount)}</span>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-8 text-gray-400 text-sm border border-dashed border-gray-300 rounded-lg">
                        Belum ada anggota di project ini.
                    </div>
                )}
            </div>
        </div>
    );
}