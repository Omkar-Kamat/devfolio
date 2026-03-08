'use client';

import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { useScrollReveal } from '../hooks/useScrollReveal';

export default function ExperienceSection() {
    const lineRef = useRef<SVGPathElement>(null);
    const sectionRef = useRef<HTMLElement>(null);
    const revealRef = useScrollReveal({ yOffset: 40 });

    const experiences = [
        { title: 'Full Stack Intern', company: 'Tech Corp', date: '2025 - Present', desc: 'Working on core microservices using Node.js and React.' },
        { title: 'Freelance Developer', company: 'Self Employed', date: '2024 - 2025', desc: 'Built landing pages and dashboards for local businesses.' },
        { title: 'BTech CSE', company: 'University Name', date: '2022 - 2026', desc: 'Core subjects: Data Structures, Algorithms, OS, DBMS.' }
    ];

    useEffect(() => {
        if (!lineRef.current || !sectionRef.current) return;

        const length = lineRef.current.getTotalLength();
        gsap.set(lineRef.current, { strokeDasharray: length, strokeDashoffset: length });

        const ctx = gsap.context(() => {
            gsap.to(lineRef.current, {
                strokeDashoffset: 0,
                ease: 'none',
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top center',
                    end: 'bottom center',
                    scrub: true,
                }
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section id="experience" ref={sectionRef} className="py-24 relative overflow-hidden">
            <div className="container mx-auto px-6 md:px-12 relative z-10">

                <div ref={revealRef} className="text-center mb-20">
                    <h2 className="text-4xl md:text-5xl font-display font-bold text-text-primary mb-4">
                        The Journey So Far
                    </h2>
                </div>

                <div className="relative max-w-4xl mx-auto">
                    {/* SVG Spine */}
                    <div className="absolute left-[20px] md:left-1/2 top-0 bottom-0 w-[2px] -translate-x-1/2 overflow-hidden flex justify-center">
                        <div className="w-[1px] h-full bg-border-card absolute" />
                        <svg className="absolute top-0 w-4 h-full" preserveAspectRatio="none">
                            <path
                                ref={lineRef}
                                d="M 2 0 L 2 5000"
                                stroke="url(#spine-gradient)"
                                strokeWidth="2"
                                fill="none"
                            />
                            <defs>
                                <linearGradient id="spine-gradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#3B82F6" />
                                    <stop offset="100%" stopColor="#8B5CF6" />
                                </linearGradient>
                            </defs>
                        </svg>
                    </div>

                    {/* Cards */}
                    <div className="flex flex-col gap-12">
                        {experiences.map((exp, i) => {
                            const isEven = i % 2 === 0;
                            return (
                                <div key={i} className={`flex flex-col md:flex-row items-start ${isEven ? 'md:flex-row-reverse' : ''}`}>
                                    {/* Empty space for alternating layout */}
                                    <div className="hidden md:block w-1/2" />

                                    {/* Timeline Dot */}
                                    <div className="absolute left-[20px] md:left-1/2 w-4 h-4 rounded-full bg-base-primary border-2 border-accent-blue shadow-[0_0_10px_rgba(59,130,246,0.5)] -translate-x-1/2 mt-6 z-20" />

                                    {/* Card Content */}
                                    <div className="w-full md:w-1/2 pl-12 md:pl-0">
                                        <div className={`bg-base-secondary/80 border border-border-card rounded-2xl p-6 md:p-8 backdrop-blur-sm ${isEven ? 'md:ml-auto md:mr-10' : 'md:mr-auto md:ml-10'}`}>
                                            <span className="text-accent-blue font-mono text-sm">{exp.date}</span>
                                            <h3 className="text-2xl font-bold text-text-primary mt-2">{exp.title}</h3>
                                            <h4 className="text-lg text-text-secondary mb-4">{exp.company}</h4>
                                            <p className="text-text-muted leading-relaxed">{exp.desc}</p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                </div>
            </div>
        </section>
    );
}
