import mongoose from 'mongoose';

const { Schema, model, Types } = mongoose;

const DesigSchema = new Schema({
    desig_code: { type: String, required: true, unique: true, trim: true },
    desig_name: { type: String, required: true, trim: true },
    desig_desc: { type: String },
    status: { type: String, required: true, enum: ['Active', 'Inactive'], default: 'Active' },
    createdby: { type: Types.ObjectId, ref: 'Account', required: true },
    updatedby: { type: Types.ObjectId, ref: 'Account' }
}, {
    timestamps: true
});

export default model('Designation', DesigSchema);