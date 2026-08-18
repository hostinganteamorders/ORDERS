'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type Props = {
    configured: boolean;
    connected: boolean;
    googleEmail: string | null;
    icsConfigured: boolean;
    embedConfigured: boolean;
};

export default function GoogleSettings({ configured, connected, googleEmail, icsConfigured, embedConfigured }: Props) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function connect() {
        setError(null);
        if (!configured) {
            setError('Google Calendar OAuth belum dikonfigurasi. Ikuti langkah "Cara Setup Sinkron 2 Arah (OAuth)" di bawah.');
            return;
        }
        window.location.href = '/api/google/auth';
    }

    async function disconnect() {
        if (!confirm('Putuskan koneksi Google Calendar?')) return;
        setLoading(true);
        setError(null);
        const res = await fetch('/api/google/disconnect', { method: 'POST' });
        if (!res.ok) {
            const data = await res.json();
            setError(data.error ?? 'Gagal memutuskan koneksi.');
            setLoading(false);
            return;
        }
        setLoading(false);
        router.refresh();
    }

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-2xl bg-white border border-gray-200 flex items-center justify-center shadow-sm">
                    <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none">
                        <path d="M5.5 2h9.2L21 8.3v13.7a.75.75 0 01-.75.75H5.5A1.5 1.5 0 014 21.25V3.5A1.5 1.5 0 015.5 2z" fill="#4285F4" />
                        <path d="M14.5 2v6.5H21" fill="#1A73E8" />
                        <path d="M8.5 10.5h7v1.6h-7zm0 3h7v1.6h-7zm0 3h4.5v1.6H8.5z" fill="#fff" />
                    </svg>
                </div>
                <div className="flex-1">
                    <p className="font-semibold text-[#061E44]">Google Calendar</p>
                    <p className="text-sm text-gray-500">
                        {connected
                            ? `Terhubung (OAuth)${googleEmail ? ` · ${googleEmail}` : ''}`
                            : icsConfigured || embedConfigured
                            ? 'Kalender terhubung (embed/ICS)'
                            : 'Belum terhubung'}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
                <div className={`rounded-lg border px-3 py-2.5 text-sm ${embedConfigured ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-gray-50 border-gray-200 text-gray-400'}`}>
                    <p className="font-medium">Kalender Live</p>
                    <p className="text-xs">{embedConfigured ? 'Aktif (embed)' : 'Embed URL kosong'}</p>
                </div>
                <div className={`rounded-lg border px-3 py-2.5 text-sm ${icsConfigured ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-gray-50 border-gray-200 text-gray-400'}`}>
                    <p className="font-medium">Impor Event</p>
                    <p className="text-xs">{icsConfigured ? 'Aktif (ICS)' : 'ICS URL kosong'}</p>
                </div>
                <div className={`rounded-lg border px-3 py-2.5 text-sm ${connected ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-gray-50 border-gray-200 text-gray-400'}`}>
                    <p className="font-medium">Sinkron 2 Arah</p>
                    <p className="text-xs">{connected ? 'Aktif (OAuth)' : 'OAuth belum terhubung'}</p>
                </div>
            </div>

            {error && (
                <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">{error}</div>
            )}

            {connected ? (
                <div className="flex gap-3">
                    <button
                        onClick={disconnect}
                        disabled={loading}
                        className="px-5 py-2.5 rounded-lg border border-red-200 text-red-600 text-sm font-medium hover:bg-red-50 transition disabled:opacity-50"
                    >
                        {loading ? 'Memproses...' : 'Putuskan Koneksi'}
                    </button>
                </div>
            ) : (
                <button
                    onClick={connect}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-[#FF7A00] to-[#FF9A40] text-white font-semibold shadow-lg shadow-orange-500/30 hover:opacity-90 transition"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.38-5.551a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.657l-1.1 1.1" />
                    </svg>
                    Hubungkan Google Calendar (OAuth)
                </button>
            )}
        </div>
    );
}