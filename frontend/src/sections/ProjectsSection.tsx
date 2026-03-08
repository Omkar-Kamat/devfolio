'use client';

import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { useScrollReveal } from '../hooks/useScrollReveal';

export default function ProjectsSection() {
    const revealRef = useScrollReveal({ yOffset: 40 });
    const cardsRef = useRef<HTMLDivElement>(null);

    // Apply simple 3D CSS tilt based on mouse position
    useEffect(() => {
        if (!cardsRef.current) return;
        const cards = cardsRef.current.querySelectorAll('.project-card');

        cards.forEach((card) => {
            const el = card as HTMLElement;
            const xTo = gsap.quickTo(el, "rotationY", { ease: "power3.out", duration: 0.5 });
            const yTo = gsap.quickTo(el, "rotationX", { ease: "power3.out", duration: 0.5 });

            const handleMouseMove = (e: MouseEvent) => {
                const rect = el.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;
                // max 15 degree tilt
                xTo(x * 15);
                yTo(-y * 15);
            };

            const handleMouseLeave = () => {
                xTo(0);
                yTo(0);
            };

            el.addEventListener('mousemove', handleMouseMove);
            el.addEventListener('mouseleave', handleMouseLeave);
            return () => {
                el.removeEventListener('mousemove', handleMouseMove);
                el.removeEventListener('mouseleave', handleMouseLeave);
            };
        });
    }, []);

    return (
        <section id="projects" className="py-24 bg-base-tertiary/20 border-t border-border-card">
            <div className="container mx-auto px-6 md:px-12">
                <div ref={revealRef} className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                    <div>
                        <h2 className="text-4xl md:text-5xl font-display font-bold text-text-primary mb-4">
                            Selected Work
                        </h2>
                        <p className="text-text-secondary text-lg max-w-xl">
                            A collection of full-stack products, technical experiments, and open source contributions.
                        </p>
                    </div>
                    <button className="text-accent-blue font-medium hover:underline underline-offset-4 decoration-accent-blue/50 self-start md:self-auto">
                        View GitHub Archive →
                    </button>
                </div>

                {/* Project Grid */}
                <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 perspective-1000">
                    {[1, 2, 3].map((item) => (
                        <div
                            key={item}
                            className="project-card group relative aspect-[4/3] bg-base-secondary border border-border-card rounded-2xl overflow-hidden cursor-pointer transform-style-3d"
                            style={{ transformStyle: 'preserve-3d' }}
                        >
                            <div className="absolute inset-0 transition-opacity duration-300 group-hover:opacity-20 bg-gradient-to-t from-base-primary to-transparent z-10" />

                            <div className="absolute inset-0 flex items-center justify-center text-text-muted bg-base-primary/50 text-sm font-mono z-0">
                                [Image / R3F Canvas]
                            </div>

                            <div className="absolute inset-x-0 bottom-0 p-6 z-20 translate-z-20" style={{ transform: 'translateZ(30px)' }}>
                                <div className="flex gap-2 mb-3">
                                    <span className="px-2 py-1 text-xs font-medium text-accent-blue bg-accent-blue/10 rounded">React</span>
                                    <span className="px-2 py-1 text-xs font-medium text-text-secondary bg-base-tertiary rounded">Node.js</span>
                                </div>
                                <h3 className="text-xl font-display font-bold text-text-primary mb-2 group-hover:text-accent-blue transition-colors">
                                    Project Title 0{item}
                                </h3>
                                <p className="text-text-secondary text-sm line-clamp-2">
                                    A high-performance full-stack web application demonstrating complex data architecture.
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
