'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

type Props = {
    projectId: string;
    currentStatus: string;
    completedAt: string | null;
    isAdmin: boolean;
};

export default function ProjectStatusActions({ projectId, currentStatus, completedAt, isAdmin }: Props) {
    const router = useRouter();
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!isAdmin) return null;

    async function changeStatus(nextStatus: string) {
        setUpdating(true);
        setError(null);
        const supabase = createClient();
        const { error: err } = await supabase
            .from('projects')
            .update({
                status: nextStatus,
                completed_at: nextStatus === 'active' ? null : (completedAt ?? new Date().toISOString()),
            })
            .eq('id', projectId);

        if (err) {
            setError('Gagal ubah status: ' + err.message);
            setUpdating(false);
            return;
        }
        setUpdating(false);
        router.refresh();
    }

    const btnBase =
        'px-2.5 py-1 rounded-lg text-xs font-medium border transition disabled:opacity-50 disabled:cursor-not-allowed';

    return (
        <div className="inline-flex flex-col items-end gap-1.5">
            <div className="inline-flex gap-1.5">
                {currentStatus === 'active' && (
                    <>
                        <button
                            onClick={() => changeStatus('completed')}
                            disabled={updating}
                            className={`${btnBase} border-emerald-200 text-emerald-600 hover:bg-emerald-50`}
                        >
                            Tandai Selesai
                        </button>
                        <button
                            onClick={() => changeStatus('paid')}
                            disabled={updating}
                            className={`${btnBase} border-green-600 text-green-700 hover:bg-green-50`}
                        >
                            Tandai Dibayar
                        </button>
                    </>
                )}
                {currentStatus === 'completed' && (
                    <>
                        <button
                            onClick={() => changeStatus('paid')}
                            disabled={updating}
                            className={`${btnBase} border-green-600 text-green-700 hover:bg-green-50`}
                        >
                            Tandai Dibayar
                        </button>
                        <button
                            onClick={() => changeStatus('active')}
                            disabled={updating}
                            className={`${btnBase} border-gray-200 text-gray-500 hover:bg-gray-50`}
                        >
                            Aktifkan
                        </button>
                    </>
                )}
                {currentStatus === 'paid' && (
                    <button
                        onClick={() => changeStatus('active')}
                        disabled={updating}
                        className={`${btnBase} border-gray-200 text-gray-500 hover:bg-gray-50`}
                    >
                        Aktifkan
                    </button>
                )}
            </div>
            {updating && <span className="text-xs text-gray-400">Menyimpan...</span>}
            {error && <span className="text-xs text-red-500">{error}</span>}
        </div>
    );
}
