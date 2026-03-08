import mongoose, { Document, Schema } from 'mongoose';

export interface IProject extends Document {
    title: string;
    description: string;
    tech: string[];
    images: string[];
    links: {
        github?: string;
        live?: string;
    };
    featured: boolean;
    order: number;
    slug?: string;
    active: boolean; // soft-delete flag per design spec Section 8.2
}

const ProjectSchema: Schema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    tech: [{ type: String }],
    images: [{ type: String }],
    links: {
        github: { type: String },
        live: { type: String },
    },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    slug: { type: String, unique: true, sparse: true },
    active: { type: Boolean, default: true }, // soft-delete: false = archived
}, { timestamps: true });

// Auto-generate slug from title if not provided
ProjectSchema.pre('save', function (next) {
    if (!this.slug && this.title) {
        this.slug = (this.title as string)
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    }
    next();
});

export default mongoose.model<IProject>('Project', ProjectSchema);
