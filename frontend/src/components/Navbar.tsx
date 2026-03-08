'use client';

import React, { useState, useEffect } from 'react';
import { useUiStore } from '../store/uiStore';
import { useThemeStore } from '../store/themeStore';
import { motion, AnimatePresence } from 'framer-motion';
import MagneticButton from './animations/MagneticButton';

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const { activeSection } = useUiStore();
    const { theme, toggleTheme } = useThemeStore();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = ['Home', 'About', 'Skills', 'Projects', 'Experience', 'Blog', 'Contact'];

    return (
        <motion.header
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-base-primary/80 backdrop-blur-md border-b border-border-card py-4' : 'bg-transparent py-6'
                }`}
        >
            <div className="container mx-auto px-6 md:px-12 flex items-center justify-between">
                {/* Logo */}
                <a href="#home" className="text-2xl font-display font-bold tracking-tighter">
                    DevFolio<span className="text-accent-blue">.</span>
                </a>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center space-x-8 text-sm font-medium">
                    {navLinks.map((link) => (
                        <a
                            key={link}
                            href={`#${link.toLowerCase()}`}
                            className={`transition-colors hover:text-accent-blue ${activeSection === link.toLowerCase() ? 'text-accent-blue' : 'text-text-secondary'
                                }`}
                        >
                            {link}
                        </a>
                    ))}
                </nav>

                {/* Actions */}
                <div className="flex items-center space-x-4">
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-full bg-base-secondary border border-border-card text-text-secondary hover:text-text-primary transition-colors"
                        aria-label="Toggle theme"
                    >
                        {theme === 'dark' ? '☀️' : '🌙'}
                    </button>
                    <MagneticButton className="hidden md:inline-flex px-5 py-2.5 bg-accent-blue text-white hover:bg-accent-blue/90">
                        Resume
                    </MagneticButton>
                </div>
            </div>
        </motion.header>
    );
}
