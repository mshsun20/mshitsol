import mongoose from "mongoose";

const { Schema, model, Types } = mongoose;

const SttSchema = new Schema({
    stateCode: { type: String, required: true, unique: true, trim: true },
    stateName: { type: String, required: true, trim: true },
    stateDesc: { type: String, trim: true },
    stateCapital: { type: String, trim: true },
    stateCountry: { type: String, trim: true },
    status: { type: String, required: true, enum: ['Active', 'Inactive'], default: 'Active' },
    createdby: { type: Types.ObjectId, ref: 'Account', required: true },
    updatedby: { type: Types.ObjectId, ref: 'Account' }
}, { timestamps: true });

export default model("State", SttSchema);