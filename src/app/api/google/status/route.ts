import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { isGoogleConfigured, getStoredToken } from '@/lib/google';

export async function GET() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const configured = isGoogleConfigured();
    const token = await getStoredToken(user.id);
    const connected = Boolean(token?.refresh_token);

    let googleEmail: string | null = null;
    if (connected) {
        const { data } = await supabase
            .from('calendar_tokens')
            .select('google_email')
            .eq('user_id', user.id)
            .single();
        googleEmail = data?.google_email ?? null;
    }

    return NextResponse.json({
        configured,
        connected,
        google_email: googleEmail,
    });
}