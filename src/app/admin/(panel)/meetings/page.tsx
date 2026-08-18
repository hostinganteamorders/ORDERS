import { createClient } from '@/lib/supabase/server';
import MeetingsClient from './MeetingsClient';

export default async function AdminMeetingsPage() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    const { data: profile } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user?.id)
        .single();

    const { data: notes } = await supabase
        .from('meeting_notes')
        .select('*')
        .order('date', { ascending: false })
        .order('created_at', { ascending: false });

    const { data: attendees } = await supabase
        .from('meeting_note_attendees')
        .select('*');

    const { data: actionItems } = await supabase
        .from('action_items')
        .select('*')
        .order('created_at', { ascending: true });

    const { data: members } = await supabase
        .from('profiles')
        .select('id, name, role, status')
        .order('name');

    const { data: projects } = await supabase
        .from('projects')
        .select('id, name, status')
        .order('name');

    return (
        <MeetingsClient
            notes={(notes ?? []).map((n) => ({
                id: n.id,
                title: n.title,
                date: n.date,
                agenda: n.agenda,
                notes: n.notes,
                project_id: n.project_id,
                created_at: n.created_at,
            }))}
            attendees={(attendees ?? []).map((a) => ({
                id: a.id,
                meeting_note_id: a.meeting_note_id,
                member_id: a.member_id,
            }))}
            actionItems={(actionItems ?? []).map((a) => ({
                id: a.id,
                meeting_note_id: a.meeting_note_id,
                task: a.task,
                assigned_to: a.assigned_to,
                due_date: a.due_date,
                status: a.status,
            }))}
            members={(members ?? []).map((m) => ({
                id: m.id,
                name: m.name,
                role: m.role,
                status: m.status || 'active',
            }))}
            projects={(projects ?? []).map((p) => ({ id: p.id, name: p.name, status: p.status }))}
            isAdmin={profile?.is_admin ?? false}
        />
    );
}
