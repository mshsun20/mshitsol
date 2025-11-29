import mongoose from 'mongoose';

const { Schema, model, Types } = mongoose;

const DeptSchema = new Schema({
    dept_code: { type: String, required: true, unique: true, trim: true },
    dept_name: { type: String, required: true, trim: true },
    dept_desc: { type: String },
    status: { type: String, required: true, enum: ['Active', 'Inactive'], default: 'Active' },
    createdby: { type: Types.ObjectId, ref: 'Account', required: true },
    updatedby: { type: Types.ObjectId, ref: 'Account' }
}, {
    timestamps: true
});

export default model('Department', DeptSchema);