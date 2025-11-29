import mongoose from 'mongoose';

const { Schema, model, Types } = mongoose;

const SessSchema = new Schema({
    sessacc: { type: Types.ObjectId, required: true, ref: 'Account' },
    userAgent: { type: String, required: true },
    ipAddress: { type: String, required: true },
    device: { type: String },
    location: { type: String },
    refreshToken: { type: String, required: true },
    expiresAt: { type: Date, required: true }
}, {
    timestamps: true
});

SessSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default model('Session', SessSchema);