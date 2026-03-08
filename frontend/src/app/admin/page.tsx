'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        projects: 0,
        skills: 0,
        messages: 0,
    });

    useEffect(() => {
        // In a real scenario, this would fetch from a stats endpoint
        // For now, we mock the stats load.
        setStats({
            projects: 12,
            skills: 24,
            messages: 5,
        });
    }, []);

    const statCards = [
        { label: 'Total Projects', value: stats.projects, color: 'text-accent-blue' },
        { label: 'Technologies', value: stats.skills, color: 'text-accent-purple' },
        { label: 'Unread Messages', value: stats.messages, color: 'text-accent-cyan' },
    ];

    return (
        <div className="flex flex-col gap-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {statCards.map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-base-secondary border border-border-card rounded-2xl p-6 flex flex-col gap-4"
                    >
                        <span className="text-text-secondary font-medium">{stat.label}</span>
                        <span className={`text-4xl font-display font-bold ${stat.color}`}>
                            {stat.value}
                        </span>
                    </motion.div>
                ))}
            </div>

            <div className="bg-base-secondary border border-border-card rounded-2xl p-6">
                <h3 className="text-xl font-bold mb-4 text-text-primary">System Health</h3>
                <div className="flex items-center gap-4 text-sm">
                    <span className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-success"></span> API Status: Online
                    </span>
                    <span className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-success"></span> Database: Connected
                    </span>
                </div>
            </div>
        </div>
    );
}
