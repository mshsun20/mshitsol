import mongoose from "mongoose";

const { Schema, model, Types } = mongoose

const FuncSchema = new Schema({
    func_code: { type: String, required: true, unique: true, trim: true },
    func_name: { type: String, required: true, trim: true },
    func_path: { type: String, trim: true },
    func_icon: { type: String, trim: true },
    func_query: { type: String, trim: true },
    status: { type: String, required: true, enum: ['Active', 'Inactive'], default: 'Active' },
    createdby: { type: Types.ObjectId, ref: 'Account', required: true },
    updatedby: { type: Types.ObjectId, ref: 'Account' }
}, { timestamps: true })

export default model('Function', FuncSchema)