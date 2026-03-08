'use client';

import React from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { motion } from 'framer-motion';

export default function SkillsSection() {
    const revealRef = useScrollReveal({ yOffset: 30 });

    const categories = ['Frontend', 'Backend', 'DevOps', 'Tools'];

    return (
        <section id="skills" className="py-24 min-h-screen flex flex-col justify-center border-t border-border-card">
            <div className="container mx-auto px-6 md:px-12 relative z-10 flex flex-col items-center">

                <div ref={revealRef} className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-display font-bold text-text-primary mb-4">
                        Technical Arsenal
                    </h2>
                    <p className="text-text-secondary text-lg max-w-2xl mx-auto">
                        Tools and technologies I use to build scalable digital products.
                    </p>
                </div>

                {/* 2D Fallback / Tab Filter UI */}
                <div className="flex flex-wrap justify-center gap-4 mb-16 relative z-10">
                    {categories.map((category, index) => (
                        <button
                            key={category}
                            className={`px-6 py-2 rounded-full font-medium transition-all ${index === 0
                                    ? 'bg-accent-blue text-white shadow-[0_0_15px_rgba(59,130,246,0.4)]'
                                    : 'bg-base-tertiary text-text-secondary hover:text-text-primary border border-border-card'
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* Placeholder for 3D R3F Constellation / Fallback grid */}
                <div className="w-full max-w-4xl h-[50vh] min-h-[400px] border border-border-card bg-base-secondary/50 rounded-3xl flex items-center justify-center relative overflow-hidden backdrop-blur-sm">
                    <div className="absolute inset-0 bg-gradient-to-t from-base-primary to-transparent pointer-events-none" />
                    <p className="text-text-muted font-mono animate-pulse">[ 3D Skill Constellation Interactive Scene ]</p>
                </div>
            </div>
        </section>
    );
}
