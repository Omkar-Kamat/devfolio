import mongoose, { Document, Schema } from 'mongoose';

export interface IContactMessage extends Document {
    name: string;
    email: string;
    subject: string;
    message: string;
    read: boolean;
}

const ContactMessageSchema: Schema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model<IContactMessage>('ContactMessage', ContactMessageSchema);
