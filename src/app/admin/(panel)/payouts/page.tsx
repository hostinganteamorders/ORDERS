import { createClient } from '@/lib/supabase/server';
import PayoutsClient from './PayoutsClient';

export default async function AdminPayoutsPage() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    const { data: profile } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user?.id)
        .single();

    const { data: payouts } = await supabase
        .from('payouts')
        .select('*')
        .order('date', { ascending: false })
        .order('created_at', { ascending: false });

    const { data: payoutMembers } = await supabase
        .from('payout_members')
        .select('*')
        .order('created_at', { ascending: true });

    const { data: projects } = await supabase
        .from('projects')
        .select('id, name, status, total_value, client_name')
        .order('name');

    const { data: projectMembers } = await supabase
        .from('project_members')
        .select('project_id, profile_id, contribution_percent, profiles!inner(name)');

    return (
        <PayoutsClient
            payouts={(payouts ?? []).map((p) => ({
                id: p.id,
                project_id: p.project_id,
                project_name: p.project_name,
                date: p.date,
                total_amount: Number(p.total_amount),
                orders_fee: Number(p.orders_fee),
                net_amount: Number(p.net_amount),
                status: p.status,
                created_at: p.created_at,
            }))}
            payoutMembers={(payoutMembers ?? []).map((pm) => ({
                id: pm.id,
                payout_id: pm.payout_id,
                member_id: pm.member_id,
                name: pm.name,
                contribution_percent: Number(pm.contribution_percent),
                amount: Number(pm.amount),
            }))}
            projects={(projects ?? []).map((p) => ({
                id: p.id,
                name: p.name,
                status: p.status,
                total_value: Number(p.total_value),
                client_name: p.client_name,
            }))}
            projectMembers={(projectMembers ?? []).map((pm: any) => ({
                project_id: pm.project_id,
                profile_id: pm.profile_id,
                contribution_percent: Number(pm.contribution_percent),
                member_name: pm.profiles?.name ?? 'Anggota',
            }))}
            isAdmin={profile?.is_admin ?? false}
        />
    );
}
