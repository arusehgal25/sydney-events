import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    googleId: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    displayName: { type: String },
    role: { type: String, enum: ['admin'], default: 'admin' },
    avatarUrl: { type: String }
}, { timestamps: true });

export default mongoose.model('User', UserSchema);
