import mongoose, { Document, Schema } from 'mongoose';

export interface IExperience extends Document {
    role: string;
    company: string;
    duration: string;
    description: string;
    techUsed: string[];
    type: 'work' | 'internship' | 'education' | 'other';
    order: number;
}

const ExperienceSchema: Schema = new Schema({
    role: { type: String, required: true },
    company: { type: String, required: true },
    duration: { type: String, required: true },
    description: { type: String, required: true },
    techUsed: [{ type: String }],
    type: { type: String, enum: ['work', 'internship', 'education', 'other'], default: 'work' },
    order: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model<IExperience>('Experience', ExperienceSchema);
