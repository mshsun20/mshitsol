import mongoose from "mongoose";

const { Schema, model, Types } = mongoose;

const SubcatSchema = new Schema({
    subcategoryCode: { type: String, required: true },
    subcategoryName: { type: String, required: true },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
    createdby: { type: Types.ObjectId, ref: 'Account', required: true },
    updatedby: { type: Types.ObjectId, ref: 'Account' }
}, { timestamps: true });

export default model('Subcategory', SubcatSchema);