'use client';

import React from 'react';

export default function AdminMessages() {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Contact Messages</h1>
                <span className="px-3 py-1 bg-base-tertiary text-text-secondary rounded-full text-sm">
                    Total: 5
                </span>
            </div>

            <div className="flex flex-col gap-4">
                {/* Placeholder Cards */}
                {[1, 2, 3].map(msg => (
                    <div key={msg} className="bg-base-secondary border border-border-card rounded-xl p-5 flex flex-col gap-2">
                        <div className="flex justify-between items-start">
                            <h3 className="font-bold text-text-primary">Project Inquiry {msg}</h3>
                            <span className="text-xs text-text-muted">2 hours ago</span>
                        </div>
                        <div className="text-sm text-text-secondary">From: john@example.com (John Doe)</div>
                        <p className="mt-2 text-text-primary">
                            Hello, I would like to collaborate with you on a new scalable web application built with Next.js and Three.js...
                        </p>
                        <div className="flex gap-4 mt-4">
                            <button className="text-sm text-accent-blue hover:underline">Reply via Email</button>
                            <button className="text-sm text-error hover:underline">Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
