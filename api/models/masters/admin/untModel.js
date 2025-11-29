import mongoose from 'mongoose';

const { Schema, model, Types } = mongoose;

const UntSchema = new Schema({
    unitCode: { type: String, required: true, trim: true },
    unitName: { type: String, required: true, trim: true },
    status: { type: String, required: true, enum: ['Active', 'Inactive'], default: 'Active' },
    createdby: { type: Types.ObjectId, ref: 'Account', required: true },
    updatedby: { type: Types.ObjectId, ref: 'Account' }
}, {
    timestamps: true,
});

export default model('Unit', UntSchema);