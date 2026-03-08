import { z } from 'zod';

export const LoginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
});

export const ContactMessageSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    subject: z.string().min(2),
    message: z.string().min(10),
});

// Full ProjectSchema aligned with Project model and design spec Section 7
export const ProjectSchema = z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    tech: z.array(z.string()).default([]),
    images: z.array(z.string()).default([]),
    links: z.object({
        github: z.string().url().optional().or(z.literal('')),
        live: z.string().url().optional().or(z.literal('')),
    }).default({}),
    featured: z.boolean().default(false),
    order: z.number().int().default(0),
    slug: z.string().optional(),
    active: z.boolean().default(true),
});
