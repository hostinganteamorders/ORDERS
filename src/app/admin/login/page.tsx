'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { createClient } from '@/lib/supabase/client';

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setLoading(true);

        const supabase = createClient();
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setError('Email atau password salah. Coba lagi.');
            setLoading(false);
            return;
        }

        const redirectedFrom = searchParams.get('redirectedFrom') || '/admin';
        router.push(redirectedFrom);
        router.refresh();
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#061E44] via-[#0a2a5e] to-[#FF7A00]/30 px-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF7A00]/20 rounded-full blur-3xl -translate-y-32 translate-x-32" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#061E44]/60 rounded-full blur-3xl translate-y-32 -translate-x-32" />

            <div className="w-full max-w-md relative z-10">
                <div className="bg-white rounded-2xl shadow-2xl p-8">
                    <div className="flex flex-col items-center mb-8">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FF7A00] to-[#FF9A40] flex items-center justify-center mb-4 shadow-lg shadow-orange-500/30">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-bold text-[#061E44]">Admin ORDERS</h1>
                        <p className="text-sm text-gray-500 mt-1">Masuk untuk mengelola panel admin</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="nama@ordersapp.tech"
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-[#FF7A00] focus:ring-2 focus:ring-[#FF7A00]/20 outline-none transition"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-[#FF7A00] focus:ring-2 focus:ring-[#FF7A00]/20 outline-none transition"
                            />
                        </div>

                        {error && (
                            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-2.5 rounded-lg bg-gradient-to-r from-[#FF7A00] to-[#FF9A40] text-white font-semibold shadow-lg shadow-orange-500/30 hover:opacity-90 transition disabled:opacity-50"
                        >
                            {loading ? 'Memproses...' : 'Masuk'}
                        </button>
                    </form>

                    <div className="mt-6 pt-6 border-t border-gray-100">
                        <a href="/" className="text-sm text-gray-500 hover:text-[#FF7A00] transition flex items-center justify-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Kembali ke website
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function AdminLoginPage() {
    return (
        <Suspense fallback={null}>
            <LoginForm />
        </Suspense>
    );
}