import mongoose, { Document, Schema } from 'mongoose';

export interface ISkill extends Document {
    name: string;
    category: string;
    proficiency: number;
    icon?: string;
    relatedProjects: mongoose.Types.ObjectId[];
}

const SkillSchema: Schema = new Schema({
    name: { type: String, required: true },
    category: { type: String, required: true },
    proficiency: { type: Number, required: true, min: 1, max: 5 },
    icon: { type: String },
    relatedProjects: [{ type: Schema.Types.ObjectId, ref: 'Project' }],
}, { timestamps: true });

export default mongoose.model<ISkill>('Skill', SkillSchema);
