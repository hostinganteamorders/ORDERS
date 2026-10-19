import { NextResponse } from 'next/server';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/server';
import { createAdminClient, isAdminConfigured } from '@/lib/supabase/admin';

export async function POST(req: Request) {
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

    const { name, email, password, role, avatar_url, status, is_admin } = await req.json();
    if (!name || !email || !password) {
        return NextResponse.json({ error: 'Nama, email, dan password wajib diisi.' }, { status: 400 });
    }

    const admin = createAdminClient();
    const { data: created, error: authErr } = await admin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { name, role },
    });
    if (authErr || !created.user) {
        return NextResponse.json({ error: authErr?.message ?? 'Gagal membuat akun.' }, { status: 400 });
    }

    const { error: profileErr } = await admin.from('profiles').insert({
        id: created.user.id,
        name,
        role: role || 'Member',
        avatar_url: avatar_url || null,
        status: status || 'active',
        is_admin: !!is_admin,
    });
    if (profileErr) {
        await admin.auth.admin.deleteUser(created.user.id);
        return NextResponse.json({ error: profileErr.message }, { status: 400 });
    }

    return NextResponse.json({ ok: true, id: created.user.id });
}
