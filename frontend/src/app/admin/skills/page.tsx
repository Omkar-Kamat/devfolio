'use client';

import React from 'react';

export default function AdminSkills() {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Manage Skills</h1>
                <button className="px-4 py-2 bg-accent-purple text-white rounded-lg font-medium hover:bg-accent-purple/90 transition-colors">
                    + Add Skill
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Placeholder Cards */}
                {['React', 'TypeScript', 'Node.js', 'Three.js'].map(skill => (
                    <div key={skill} className="bg-base-secondary border border-border-card rounded-xl p-4 flex items-center justify-between group">
                        <span className="font-medium">{skill}</span>
                        <button className="text-error opacity-0 group-hover:opacity-100 transition-opacity">Delete</button>
                    </div>
                ))}
            </div>
        </div>
    );
}
