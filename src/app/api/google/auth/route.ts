import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/server';
import { getAuthUrl, isGoogleConfigured } from '@/lib/google';

export async function GET() {
    if (!isSupabaseConfigured()) {
        return NextResponse.json({ error: 'Service not configured' }, { status: 503 });
    }

    const cookieStore = await cookies();
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!isGoogleConfigured()) {
        return NextResponse.json(
            { error: 'Google Calendar belum dikonfigurasi. Isi GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, dan GOOGLE_REDIRECT_URI di .env.local' },
            { status: 500 }
        );
    }

    const state = crypto.randomUUID();
    cookieStore.set('google_oauth_state', state, {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        maxAge: 600,
    });

    const url = getAuthUrl(state);
    return NextResponse.redirect(url);
}