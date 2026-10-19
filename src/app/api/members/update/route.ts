import { NextResponse } from 'next/server';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/server';
import { createAdminClient, isAdminConfigured } from '@/lib/supabase/admin';

export async function PATCH(req: Request) {
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

    const { id, name, role, avatar_url, status, is_admin } = await req.json();
    if (!id || !name) {
        return NextResponse.json({ error: 'ID dan nama wajib diisi.' }, { status: 400 });
    }

    const admin = createAdminClient();
    const { error } = await admin
        .from('profiles')
        .update({
            name,
            role: role || 'Member',
            avatar_url: avatar_url || null,
            status: status || 'active',
            is_admin: !!is_admin,
        })
        .eq('id', id);
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    return NextResponse.json({ ok: true });
}
