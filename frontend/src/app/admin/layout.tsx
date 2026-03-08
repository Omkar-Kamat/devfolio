'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    // If we are on the login page, don't show the dashboard sidebar
    if (pathname === '/admin/login') {
        return <>{children}</>;
    }

    const navItems = [
        { label: 'Dashboard', path: '/admin' },
        { label: 'Projects', path: '/admin/projects' },
        { label: 'Skills', path: '/admin/skills' },
        { label: 'Experience', path: '/admin/experience' },
        { label: 'Messages', path: '/admin/messages' },
    ];

    return (
        <div className="min-h-screen bg-base-primary flex text-text-primary">
            {/* Sidebar */}
            <aside className="w-64 border-r border-border-card bg-base-secondary/50 flex flex-col">
                <div className="p-6 border-b border-border-card">
                    <Link href="/" className="text-xl font-display font-bold">
                        DevFolio<span className="text-accent-blue">.Admin</span>
                    </Link>
                </div>
                <nav className="flex-1 p-4 flex flex-col gap-2">
                    {navItems.map((item) => {
                        const isActive = pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                href={item.path}
                                className={`px-4 py-3 rounded-lg transition-colors ${isActive
                                        ? 'bg-accent-blue/10 text-accent-blue font-medium'
                                        : 'text-text-secondary hover:bg-base-tertiary hover:text-text-primary'
                                    }`}
                            >
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>
                <div className="p-4 border-t border-border-card">
                    <button className="w-full px-4 py-2 text-left text-error hover:bg-error/10 rounded-lg transition-colors">
                        Log out
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col relative overflow-hidden">
                {/* Topbar */}
                <header className="h-16 border-b border-border-card flex items-center justify-between px-8 bg-base-secondary/30 backdrop-blur-md">
                    <h2 className="font-display font-bold capitalize">
                        {pathname.split('/').pop() || 'Dashboard'}
                    </h2>
                    <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-accent-blue flex items-center justify-center text-xs font-bold text-white">
                            AD
                        </div>
                    </div>
                </header>

                {/* Content */}
                <div className="flex-1 overflow-auto p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
