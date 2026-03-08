import { z } from 'zod';

export const LoginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});

export const ContactMessageSchema = z.object({
    name: z.string().min(2, "Name is too short"),
    email: z.string().email("Invalid email address"),
    subject: z.string().min(2, "Subject is too short"),
    message: z.string().min(10, "Message is too short"),
});

export const ProjectSchema = z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    tech: z.array(z.string()),
    links: z.object({
        github: z.string().url().optional(),
        live: z.string().url().optional(),
    }),
    featured: z.boolean().default(false),
    order: z.number().default(0),
});

export type LoginInput = z.infer<typeof LoginSchema>;
export type ContactMessageInput = z.infer<typeof ContactMessageSchema>;
export type ProjectInput = z.infer<typeof ProjectSchema>;
