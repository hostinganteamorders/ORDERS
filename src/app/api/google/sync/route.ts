import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { getAuthorizedClient, createCalendarEvent, updateCalendarEvent, deleteCalendarEvent, listCalendarEvents } from '@/lib/google';
import { fetchIcsEvents } from '@/lib/ics';

export async function POST(request: NextRequest) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const auth = await getAuthorizedClient(user.id);
    if (!auth) {
        return NextResponse.json({ error: 'Google Calendar belum terhubung' }, { status: 400 });
    }

    const body = await request.json();
    const { taskId } = body as { taskId?: string };

    if (!taskId) {
        return NextResponse.json({ error: 'taskId wajib' }, { status: 400 });
    }

    const adminClient = createAdminClient();
    const { data: task, error: taskError } = await adminClient
        .from('tasks')
        .select('*')
        .eq('id', taskId)
        .single();

    if (taskError || !task) {
        return NextResponse.json({ error: 'Task tidak ditemukan' }, { status: 404 });
    }

    try {
        if (task.google_event_id) {
            await updateCalendarEvent(auth, task.google_event_id, task);
        } else {
            const eventId = await createCalendarEvent(auth, task);
            await adminClient.from('tasks').update({ google_event_id: eventId }).eq('id', task.id);
        }
        return NextResponse.json({ ok: true });
    } catch (err) {
        console.error('Sync task ke Google Calendar gagal:', err);
        return NextResponse.json({ error: 'Gagal sinkronisasi ke Google Calendar' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const auth = await getAuthorizedClient(user.id);
    if (!auth) {
        return NextResponse.json({ error: 'Google Calendar belum terhubung' }, { status: 400 });
    }

    const url = new URL(request.url);
    const taskId = url.searchParams.get('taskId');
    if (!taskId) {
        return NextResponse.json({ error: 'taskId wajib' }, { status: 400 });
    }

    const adminClient = createAdminClient();
    const { data: task } = await adminClient.from('tasks').select('*').eq('id', taskId).single();
    if (task?.google_event_id) {
        await deleteCalendarEvent(auth, task.google_event_id);
        await adminClient.from('tasks').update({ google_event_id: null }).eq('id', taskId);
    }

    return NextResponse.json({ ok: true });
}

export async function GET() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const auth = await getAuthorizedClient(user.id);
    if (!auth && !process.env.GOOGLE_CALENDAR_ICS_URL) {
        return NextResponse.json(
            { error: 'Google Calendar belum terhubung dan GOOGLE_CALENDAR_ICS_URL belum diisi' },
            { status: 400 }
        );
    }

    try {
        const adminClient = createAdminClient();
        let inserted = 0;
        let updated = 0;
        let events: { id: string; summary: string | null | undefined; description: string | null | undefined; start: string | null; end: string | null }[] = [];

        if (auth) {
            // Mode OAuth: baca langsung dari Google Calendar API
            events = await listCalendarEvents(auth, { maxResults: 250 });
        } else {
            // Mode ICS feed: import tanpa OAuth dari GOOGLE_CALENDAR_ICS_URL
            const icsUrl = process.env.GOOGLE_CALENDAR_ICS_URL;
            if (!icsUrl) {
                return NextResponse.json(
                    { error: 'Google Calendar belum terhubung dan GOOGLE_CALENDAR_ICS_URL belum diisi' },
                    { status: 400 }
                );
            }
            const icsEvents = await fetchIcsEvents(icsUrl);
            events = icsEvents.map((e) => ({
                id: e.uid,
                summary: e.summary,
                description: e.description,
                start: e.start,
                end: e.end,
            }));
        }

        for (const event of events) {
            const { data: existing } = await adminClient
                .from('tasks')
                .select('id')
                .eq('google_event_id', event.id)
                .maybeSingle();

            const payload = {
                title: event.summary ?? 'Event tanpa judul',
                description: event.description ?? null,
                start_at: event.start,
                end_at: event.end,
                source: 'google' as const,
                google_event_id: event.id,
            };

            if (existing) {
                const { error } = await adminClient.from('tasks').update(payload).eq('id', existing.id);
                if (!error) updated++;
            } else {
                const { error } = await adminClient.from('tasks').insert(payload);
                if (!error) inserted++;
            }
        }

        return NextResponse.json({
            ok: true,
            inserted,
            updated,
            total: events.length,
            source: auth ? 'oauth' : 'ics',
        });
    } catch (err) {
        console.error('Pull dari Google Calendar gagal:', err);
        return NextResponse.json({ error: 'Gagal mengambil event dari Google Calendar' }, { status: 500 });
    }
}