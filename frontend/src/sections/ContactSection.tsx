'use client';

import React, { useState } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import MagneticButton from '../components/animations/MagneticButton';
import { z } from 'zod';

const ContactMessageSchema = z.object({
    name: z.string().min(2, "Name is too short"),
    email: z.string().email("Invalid email address"),
    subject: z.string().min(2, "Subject is too short"),
    message: z.string().min(10, "Message is too short"),
});

export default function ContactSection() {
    const revealRef = useScrollReveal({ yOffset: 40 });
    const [status, setStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');
    const [errors, setErrors] = useState<any>({});

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatus('pending');
        setErrors({});

        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());

        try {
            ContactMessageSchema.parse(data);

            const res = await fetch('http://localhost:5000/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (!res.ok) throw new Error('API Error');

            setStatus('success');
            (e.target as HTMLFormElement).reset();

        } catch (err: any) {
            if (err instanceof z.ZodError) {
                const zodErr = err as z.ZodError;
                const formattedErrors: any = {};
                zodErr.issues.forEach((er: any) => {
                    if (er.path[0]) formattedErrors[er.path[0]] = er.message;
                });
                setErrors(formattedErrors);
            } else {
                setStatus('error');
            }
        } finally {
            if (status !== 'success') {
                setTimeout(() => setStatus('idle'), 3000);
            }
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

                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
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
                            className={`mt-4 px-8 py-4 w-full md:w-auto md:ml-auto font-bold rounded-xl transition-all ${status === 'success'
                                ? 'bg-success text-base-primary pointer-events-none'
                                : status === 'error'
                                    ? 'bg-error text-white'
                                    : 'bg-accent-blue text-white hover:bg-accent-blue/90 shadow-[0_0_15px_rgba(59,130,246,0.3)]'
                                }`}
                        >
                            {status === 'pending' ? 'Sending...' : status === 'success' ? 'Message Sent!' : status === 'error' ? 'Failed - Try Again' : 'Send Message'}
                        </MagneticButton>
                    </form>

                </div>
            </div>
        </section>
    );
}
