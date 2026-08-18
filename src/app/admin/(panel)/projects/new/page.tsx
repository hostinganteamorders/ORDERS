import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import ProjectForm from './ProjectForm';

export default async function NewProjectPage() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    const { data: profile } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user?.id)
        .single();

    if (!profile?.is_admin) {
        redirect('/admin/projects');
    }

    const { data: members } = await supabase
        .from('profiles')
        .select('id, name, role')
        .order('name');

    return (
        <div className="max-w-3xl mx-auto">
            <ProjectForm members={members ?? []} />
        </div>
    );
}