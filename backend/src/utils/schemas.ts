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

export const ProjectSchema = z.object({
    title: z.string().min(1),
    // add other fields as needed
});
