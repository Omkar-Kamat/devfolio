import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
    email: string;
    passwordHash: string;
    refreshTokenHash?: string;
    refreshTokenExpiry?: Date;
    lastLogin?: Date;
    lastLogout?: Date;
}

const UserSchema: Schema = new Schema({
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    refreshTokenHash: { type: String },
    refreshTokenExpiry: { type: Date },
    lastLogin: { type: Date },
    lastLogout: { type: Date },
}, { timestamps: true });

export default mongoose.model<IUser>('User', UserSchema);
