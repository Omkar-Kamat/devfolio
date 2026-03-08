'use client';

import React, { useState } from 'react';
import MagneticButton from '@/components/animations/MagneticButton';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const res = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Login failed');
            }

            // In a real app we might store token in a global store if needed,
            // but HTTP-only cookies handle the active session automatically for our requests.
            // We just redirect to the dashboard.
            router.push('/admin');

        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="min-h-screen flex items-center justify-center bg-base-primary">
            <div className="w-full max-w-md p-8 bg-base-secondary border border-border-card rounded-2xl shadow-2xl">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-display font-bold text-text-primary">Admin Access</h1>
                    <p className="text-text-secondary mt-2">DevFolio Management Portal</p>
                </div>

                {error && (
                    <div className="bg-error/10 border border-error text-error px-4 py-3 rounded-lg mb-6 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="flex flex-col gap-5">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-text-secondary">Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-base-tertiary border border-border-card rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-accent-blue transition-colors"
                            placeholder="admin@devfolio.com"
                            required
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-text-secondary">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-base-tertiary border border-border-card rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-accent-blue transition-colors"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <MagneticButton
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-accent-blue text-white py-3 rounded-lg font-bold hover:bg-accent-blue/90 mt-4 disabled:opacity-50"
                    >
                        {isLoading ? 'Authenticating...' : 'Sign In'}
                    </MagneticButton>
                </form>
            </div>
        </main>
    );
}
