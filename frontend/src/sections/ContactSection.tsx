'use client';

import React, { useState, useRef } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import MagneticButton from '../components/animations/MagneticButton';
import { ContactMessageSchema } from '../../../shared/schemas';
import { z } from 'zod';

export default function ContactSection() {
    const revealRef = useScrollReveal({ yOffset: 40 });
    const [status, setStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');
    const [errors, setErrors] = useState<Record<string, string>>({});
    const formRef = useRef<HTMLFormElement>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrors({});

        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());

        // Client-side validation using the shared Zod schema
        const parsed = ContactMessageSchema.safeParse(data);
        if (!parsed.success) {
            const formattedErrors: Record<string, string> = {};
            parsed.error.issues.forEach((issue) => {
                if (issue.path[0]) formattedErrors[String(issue.path[0])] = issue.message;
            });
            setErrors(formattedErrors);
            return; // Don't set status to 'error' for validation — keep as idle
        }

        setStatus('pending');

        try {
            // Use env var — never hardcode localhost in production code
            const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
            const res = await fetch(`${apiBase}/api/contact`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(parsed.data),
            });

            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                throw new Error(errData.message || 'Failed to send message');
            }

            setStatus('success');
            formRef.current?.reset();
        } catch (err) {
            setStatus('error');
            // Reset error state after 3 seconds
            setTimeout(() => setStatus('idle'), 3000);
        }
    };

    return (
        <section id="contact" className="py-24 relative overflow-hidden border-t border-border-card">
            <div className="container mx-auto px-6 md:px-12 relative z-10 flex border-border-card bg-base-secondary/50 rounded-3xl p-8 md:p-16 backdrop-blur-md">

                <div ref={revealRef} className="w-full max-w-2xl mx-auto">
                    <h2 className="text-4xl md:text-5xl font-display font-bold text-text-primary mb-4 text-center">
                        Let's Collaborate
                    </h2>
                    <p className="text-text-secondary text-lg text-center mb-12">
                        Currently open to opportunities. Send me a message and I'll get back to you.
                    </p>

                    {status === 'success' ? (
                        <div className="text-center py-12 flex flex-col items-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-success/10 border border-success flex items-center justify-center text-2xl">✓</div>
                            <h3 className="text-xl font-bold text-text-primary">Message Sent!</h3>
                            <p className="text-text-secondary">I'll get back to you as soon as possible.</p>
                            <button onClick={() => setStatus('idle')} className="text-accent-blue text-sm hover:underline mt-2">Send another</button>
                        </div>
                    ) : (
                        <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-medium text-text-secondary">Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        className={`w-full bg-base-primary border ${errors.name ? 'border-error' : 'border-border-card'} rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-accent-blue transition-colors`}
                                        placeholder="John Doe"
                                    />
                                    {errors.name && <span className="text-error text-xs">{errors.name}</span>}
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-medium text-text-secondary">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        className={`w-full bg-base-primary border ${errors.email ? 'border-error' : 'border-border-card'} rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-accent-blue transition-colors`}
                                        placeholder="john@example.com"
                                    />
                                    {errors.email && <span className="text-error text-xs">{errors.email}</span>}
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-text-secondary">Subject</label>
                                <input
                                    type="text"
                                    name="subject"
                                    className={`w-full bg-base-primary border ${errors.subject ? 'border-error' : 'border-border-card'} rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-accent-blue transition-colors`}
                                    placeholder="Hello!"
                                />
                                {errors.subject && <span className="text-error text-xs">{errors.subject}</span>}
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-text-secondary">Message</label>
                                <textarea
                                    name="message"
                                    rows={5}
                                    className={`w-full bg-base-primary border ${errors.message ? 'border-error' : 'border-border-card'} rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-accent-blue transition-colors resize-none`}
                                    placeholder="What's on your mind?"
                                />
                                {errors.message && <span className="text-error text-xs">{errors.message}</span>}
                            </div>

                            <MagneticButton
                                type="submit"
                                disabled={status === 'pending'}
                                className={`mt-4 px-8 py-4 w-full md:w-auto md:ml-auto font-bold rounded-xl transition-all ${
                                    status === 'error'
                                        ? 'bg-error text-white'
                                        : 'bg-accent-blue text-white hover:bg-accent-blue/90 shadow-[0_0_15px_rgba(59,130,246,0.3)] disabled:opacity-50'
                                }`}
                            >
                                {status === 'pending' ? 'Sending...' : status === 'error' ? 'Failed — Try Again' : 'Send Message'}
                            </MagneticButton>
                        </form>
                    )}
                </div>
            </div>
        </section>
    );
}

