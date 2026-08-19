import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { ensureExpenseFromPayout } from '@/lib/transactions';

export async function PATCH(req: Request) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data: profile } = await supabase.from('profiles').select('is_admin').eq('id', user.id).single();
    if (!profile?.is_admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { id, status } = await req.json();
    if (!id || !['pending', 'processing', 'paid'].includes(status)) {
        return NextResponse.json({ error: 'Parameter status tidak valid.' }, { status: 400 });
    }

    const admin = createAdminClient();
    const { data: payout, error: updErr } = await admin
        .from('payouts')
        .update({ status })
        .eq('id', id)
        .select('id, project_id, project_name, net_amount')
        .single();

    if (updErr || !payout) {
        return NextResponse.json({ error: updErr?.message ?? 'Gagal update status.' }, { status: 400 });
    }

    let expenseRecorded = false;
    if (status === 'paid') {
        expenseRecorded = await ensureExpenseFromPayout(admin, payout);
    }

    return NextResponse.json({
        ok: true,
        expenseRecorded,
        message:
            status === 'paid'
                ? expenseRecorded
                    ? 'Status payout diperbarui & dicatat sebagai pengeluaran di buku kas.'
                    : 'Status payout diperbarui (transaksi expense sudah tercatat sebelumnya).'
                : `Status payout diperbarui menjadi ${status}.`,
    });
}