import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import Sidebar from '@/components/admin/Sidebar';

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect('/admin/login');
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('name, role, is_admin, avatar_url')
        .eq('id', user.id)
        .single();

    const name = profile?.name || user.email?.split('@')[0] || 'Member';
    const role = profile?.role || 'Member';
    const isAdmin = profile?.is_admin ?? false;
    const avatarUrl = profile?.avatar_url ?? null;

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <Sidebar name={name} role={role} isAdmin={isAdmin} avatarUrl={avatarUrl} />
            <main className="flex-1 min-w-0">
                <div className="p-6 md:p-8 lg:p-10">{children}</div>
            </main>
        </div>
    );
}