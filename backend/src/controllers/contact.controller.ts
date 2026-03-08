import { Request, Response } from 'express';
import ContactMessage from '../models/ContactMessage';
import { ContactMessageSchema } from '../utils/schemas';
import { sendContactConfirmation, sendAdminNotification } from '../services/brevo';

export const submitContact = async (req: Request, res: Response) => {
    const parsed = ContactMessageSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ success: false, errors: parsed.error.errors });
    }

    const { name, email, subject, message } = parsed.data;

    const newMsg = await ContactMessage.create({ name, email, subject, message });

    // Send emails asynchronously
    try {
        await Promise.all([
            sendContactConfirmation(email, name, message),
            sendAdminNotification(email, name, subject, message)
        ]);
    } catch (err) {
        console.error('Email sending failed:', err);
        // We don't fail the request if emails fail, but we log the error
    }

    res.status(201).json({ success: true, message: 'Message sent successfully', data: newMsg });
};

export const getMessages = async (req: Request, res: Response) => {
    const messages = await ContactMessage.find().sort({ timestamp: -1 });
    res.json({ success: true, data: messages });
};

export const markRead = async (req: Request, res: Response) => {
    const msg = await ContactMessage.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
    res.json({ success: true, data: msg });
};

export const deleteMessage = async (req: Request, res: Response) => {
    await ContactMessage.findByIdAndDelete(req.params.id);
    res.json({ success: true });
};
