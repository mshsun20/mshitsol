import mongoose from 'mongoose';

const { Schema, model, Types } = mongoose;

const CmpnySchema = new Schema({
    companyCode: { type: String, required: true, trim: true },
    companyDesc: { type: String, trim: true },
    status: { type: String, required: true, enum: ['Active', 'Inactive'], default: 'Active' },
    createdby: { type: Types.ObjectId, ref: 'Account', required: true },
    updatedby: { type: Types.ObjectId, ref: 'Account' }
}, {
    timestamps: true,
});

export default model('Company', CmpnySchema);