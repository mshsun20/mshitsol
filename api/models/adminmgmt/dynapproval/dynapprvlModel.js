import mongoose from "mongoose";

const { Schema, model, Types } = mongoose

const DynapprvlSchema = new Schema({
    apprvl_code: { type: String, required: true, trim: true },
    apprvl_func: { type: Types.ObjectId, ref: 'Function', required: true },
    apprvl_creator_base: { type: String, required: true, enum: ['User', 'Designation', 'Department', 'Category'], default: 'User' },
    apprvr_dtl: [{
        apprvl_lvl: { type: Number, required: true },
        apprvr: [{ type: Types.ObjectId, ref: 'Account', required: true }]
    }],
    status: { type: String, required: true, enum: ['Active', 'Inactive'], default: 'Active' },
    createdby: { type: Types.ObjectId, ref: 'Account', required: true },
    updatedby: { type: Types.ObjectId, ref: 'Account' }
}, { timestamps: true })

export default model('Dynamicapproval', DynapprvlSchema)