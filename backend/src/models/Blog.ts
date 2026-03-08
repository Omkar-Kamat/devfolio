import mongoose, { Document, Schema } from 'mongoose';

export interface IBlog extends Document {
    title: string;
    slug: string;
    content: string; // MDX content
    tags: string[];
    coverImage?: string;
    status: 'draft' | 'published';
}

const BlogSchema: Schema = new Schema({
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    content: { type: String, required: true },
    tags: [{ type: String }],
    coverImage: { type: String },
    status: { type: String, enum: ['draft', 'published'], default: 'draft' },
}, { timestamps: true });

export default mongoose.model<IBlog>('Blog', BlogSchema);
