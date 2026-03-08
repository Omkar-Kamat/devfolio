'use client';

import React from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import MagneticButton from '../components/animations/MagneticButton';
import ThreeCanvas from '../components/3d/ThreeCanvas';
import Navbar from '../components/Navbar';

export default function HeroSection() {
    const revealRef = useScrollReveal({ yOffset: 40, stagger: 0.1 });

    return (
        <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
            <Navbar />
            <ThreeCanvas />

            <div className="container mx-auto px-6 md:px-12 relative z-10 flex flex-col items-center text-center">
                <div ref={revealRef} className="max-w-4xl mx-auto flex flex-col items-center gap-6">
                    <p className="text-accent-blue font-medium tracking-widest uppercase text-sm">
                        BTech CSE Student
                    </p>
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold tracking-tighter leading-tight text-text-primary">
                        Building Digital <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-blue to-accent-purple">Experiences</span>
                    </h1>
                    <p className="text-lg md:text-xl text-text-secondary max-w-2xl mt-4 leading-relaxed">
                        I'm a Full Stack Developer passionate about crafting highly interactive, performing, and scalable web applications from the ground up.
                    </p>

                    <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
                        <MagneticButton className="px-8 py-4 bg-accent-blue text-white rounded-full hover:bg-accent-blue/90 shadow-[0_0_20px_rgba(59,130,246,0.4)]">
                            View My Work
                        </MagneticButton>
                        <MagneticButton className="px-8 py-4 bg-transparent border border-border-card text-text-primary rounded-full hover:bg-base-secondary">
                            Contact Me
                        </MagneticButton>
                    </div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-text-secondary">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
            </div>
        </section>
    );
}
