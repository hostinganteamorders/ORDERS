import { createClient } from '@/lib/supabase/server';
import { getStoredToken } from '@/lib/google';
import ScheduleClient from './ScheduleClient';

export default async function AdminSchedulePage() {
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

    const { data: tasks } = await supabase
        .from('tasks')
        .select('*')
        .order('start_at', { ascending: true });

    const { data: members } = await supabase
        .from('profiles')
        .select('id, name, role')
        .order('name');

    const { data: projects } = await supabase
        .from('projects')
        .select('id, name, status')
        .order('created_at', { ascending: false });

    const googleConnected = user ? Boolean((await getStoredToken(user.id))?.refresh_token) : false;

    const icsConfigured = Boolean(process.env.GOOGLE_CALENDAR_ICS_URL);
    const embedUrl = process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_EMBED_URL ?? null;
    const calendarEmail = process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_EMAIL ?? null;

    return (
        <div className="max-w-6xl mx-auto">
            <ScheduleClient
                tasks={(tasks ?? []).map((t) => ({
                    id: t.id,
                    title: t.title,
                    description: t.description,
                    project_id: t.project_id,
                    assigned_to: t.assigned_to,
                    start_at: t.start_at,
                    end_at: t.end_at,
                    status: t.status,
                    color: t.color,
                    google_event_id: t.google_event_id,
                    source: t.source,
                }))}
                members={(members ?? []).map((m) => ({ id: m.id, name: m.name, role: m.role }))}
                projects={(projects ?? []).map((p) => ({ id: p.id, name: p.name, status: p.status }))}
                isAdmin={isAdmin}
                googleConnected={googleConnected}
                icsConfigured={icsConfigured}
                embedUrl={embedUrl}
                calendarEmail={calendarEmail}
            />
        </div>
    );
}