'use client';

import React from 'react';

export default function AdminExperience() {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Manage Experience</h1>
                <button className="px-4 py-2 bg-accent-cyan text-white rounded-lg font-medium hover:bg-accent-cyan/90 transition-colors">
                    + Add Experience
                </button>
            </div>

            <div className="bg-base-secondary border border-border-card rounded-2xl p-6">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-border-card text-text-secondary text-sm">
                            <th className="pb-3 font-medium">Role</th>
                            <th className="pb-3 font-medium">Company</th>
                            <th className="pb-3 font-medium">Duration</th>
                            <th className="pb-3 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* Placeholder Rows */}
                        {[1, 2].map(row => (
                            <tr key={row} className="border-b border-border-card/50">
                                <td className="py-4 font-medium">Software Engineer</td>
                                <td className="py-4 text-text-secondary">Tech Corp</td>
                                <td className="py-4 text-text-secondary">2023 - Present</td>
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
