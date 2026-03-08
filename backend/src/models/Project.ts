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
}, { timestamps: true });

export default mongoose.model<IProject>('Project', ProjectSchema);
