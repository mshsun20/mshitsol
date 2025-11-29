import mongoose from "mongoose";

const { Schema, model, Types } = mongoose;

const LeadSchema = new Schema({
    leadNo: { type: String, required: true, trim: true },
    firmName: { type: String, required: true, trim: true },
    contactPersonName: { type: String, trim: true },
    email: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    subCategory: { type: Types.ObjectId, ref: 'Subcategory', required: true },
    state: { type: Types.ObjectId, ref: "State" },
    city: { type: String, trim: true },
    pinCode: { type: String, trim: true },
    address: { type: String, trim: true },
    product: { type: Types.ObjectId, ref: "Product" },
    requirementDetails: { type: String, trim: true },
    notes: { type: String, trim: true },
    status: { type: String, required: true, enum: ['Open', 'Prospective', 'Verification Request', 'Rejected', 'KYC Approved', 'Active', 'Inactive', 'Closed'], default: 'Open' },
    createdby: { type: Types.ObjectId, ref: "Account", required: true },
    updatedby: { type: Types.ObjectId, ref: "Account" },
}, { timestamps: true });

export default model("Lead", LeadSchema);