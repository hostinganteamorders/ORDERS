import { createClient } from '@/lib/supabase/server';
import TransactionsClient from './TransactionsClient';

export default async function AdminTransactionsPage() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    const { data: profile } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user?.id)
        .single();

    const { data: transactions } = await supabase
        .from('transactions')
        .select('*')
        .order('date', { ascending: true })
        .order('created_at', { ascending: true });

    const { data: projects } = await supabase
        .from('projects')
        .select('id, name, status')
        .order('name');

    return (
        <TransactionsClient
            transactions={(transactions ?? []).map((t) => ({
                id: t.id,
                date: t.date,
                type: t.type,
                amount: Number(t.amount),
                source: t.source,
                description: t.description,
                reference: t.reference,
                project_id: t.project_id,
                created_at: t.created_at,
            }))}
            projects={(projects ?? []).map((p) => ({ id: p.id, name: p.name, status: p.status }))}
            isAdmin={profile?.is_admin ?? false}
        />
    );
}
