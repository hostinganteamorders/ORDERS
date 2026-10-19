import { NextResponse } from 'next/server';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/server';
import { createAdminClient, isAdminConfigured } from '@/lib/supabase/admin';

export async function DELETE(req: Request) {
    if (!isSupabaseConfigured() || !isAdminConfigured()) {
        return NextResponse.json({ error: 'Service not configured' }, { status: 503 });
    }

    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data: profile } = await supabase.from('profiles').select('is_admin').eq('id', user.id).single();
    if (!profile?.is_admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: 'ID wajib diisi.' }, { status: 400 });
    if (id === user.id) return NextResponse.json({ error: 'Tidak bisa menghapus akun sendiri.' }, { status: 400 });

    const admin = createAdminClient();
    const { error: profileErr } = await admin.from('profiles').delete().eq('id', id);
    if (profileErr) return NextResponse.json({ error: profileErr.message }, { status: 400 });

    const { error: authErr } = await admin.auth.admin.deleteUser(id);
    if (authErr) return NextResponse.json({ error: authErr.message }, { status: 400 });

    return NextResponse.json({ ok: true });
}
