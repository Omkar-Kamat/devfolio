'use client';

import React from 'react';

export default function AdminProjects() {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Manage Projects</h1>
                <button className="px-4 py-2 bg-accent-blue text-white rounded-lg font-medium hover:bg-accent-blue/90 transition-colors">
                    + New Project
                </button>
            </div>

            <div className="bg-base-secondary border border-border-card rounded-2xl p-6">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-border-card text-text-secondary text-sm">
                            <th className="pb-3 font-medium">Title</th>
                            <th className="pb-3 font-medium">Tech Stack</th>
                            <th className="pb-3 font-medium">Visibility</th>
                            <th className="pb-3 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* Placeholder Rows */}
                        {[1, 2, 3].map(row => (
                            <tr key={row} className="border-b border-border-card/50">
                                <td className="py-4">Project {row}</td>
                                <td className="py-4 text-text-secondary text-sm">React, Node.js</td>
                                <td className="py-4">
                                    <span className="px-2 py-1 text-xs bg-success/10 text-success rounded-full">Public</span>
                                </td>
                                <td className="py-4 text-right flex justify-end gap-3">
                                    <button className="text-accent-blue hover:underline text-sm">Edit</button>
                                    <button className="text-error hover:underline text-sm">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
