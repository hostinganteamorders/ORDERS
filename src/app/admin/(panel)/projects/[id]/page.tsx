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
                isAdmin={isAdmin}
                statusLabel={statusLabel}
                statusColor={statusColor}
            />

            <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-[#061E44] mb-4">Ringkasan Bagi Hasil</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            </div>
        </div>
    );
}