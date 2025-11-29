import mongoose from "mongoose";

const { Schema, model, Types } = mongoose

const DynprivlgSchema = new Schema({
    privlg_code: { type: String, required: true, unique: true, trim: true },
    privlg_name: { type: String, required: true, trim: true },
    status: { type: String, required: true, enum: ['Active', 'Inactive'], default: 'Active' },
    createdby: { type: Types.ObjectId, ref: 'Account', required: true },
    updatedby: { type: Types.ObjectId, ref: 'Account' }
}, {
    timestamps: true
})

export default model('Dynamicprivilege', DynprivlgSchema)