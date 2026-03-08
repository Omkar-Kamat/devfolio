'use client';

import React from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';

export default function AboutSection() {
    const revealRef = useScrollReveal({ yOffset: 30, duration: 1 });

    return (
        <section id="about" className="py-24 bg-base-secondary/50">
            <div className="container mx-auto px-6 md:px-12 max-w-6xl">
                <div ref={revealRef} className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">

                    {/* Left: Profile Card with Tilt */}
                    <div className="relative aspect-[4/5] w-full max-w-md mx-auto rounded-3xl overflow-hidden border border-border-card bg-base-tertiary">
                        <div className="absolute inset-0 bg-gradient-to-br from-accent-blue/10 to-accent-purple/10 pointer-events-none" />
                        <div className="absolute inset-0 flex items-center justify-center text-text-muted">
                            [Profile Image Placeholder]
                        </div>
                    </div>

                    {/* Right: Bio */}
                    <div className="flex flex-col gap-6">
                        <h2 className="text-4xl md:text-5xl font-display font-bold text-text-primary">
                            Beyond the Code
                        </h2>
                        <p className="text-text-secondary text-lg leading-relaxed">
                            I am a Bachelor of Technology student in Computer Science Engineering. While I spend my days learning algorithms and data structures, my nights are dedicated to building real-world products.
                        </p>
                        <p className="text-text-secondary text-lg leading-relaxed">
                            My philosophy is simple: write clean code, design intuitive interfaces, and don't stop until the performance score hits 100.
                        </p>

                        <div className="grid grid-cols-2 gap-8 mt-8">
                            <div className="flex flex-col gap-2">
                                <span className="text-4xl font-bold font-display text-text-primary">15+</span>
                                <span className="text-sm text-text-muted uppercase tracking-widest">Projects Built</span>
                            </div>
                            <div className="flex flex-col gap-2">
                                <span className="text-4xl font-bold font-display text-text-primary">500+</span>
                                <span className="text-sm text-text-muted uppercase tracking-widest">Commits</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
