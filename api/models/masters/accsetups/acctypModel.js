import mongoose from "mongoose";

const { Schema, model, Types } = mongoose;

const AcctypSchema = new Schema(
    {
        typname: { type: String, required: true, unique: true, trim: true },
        heirarchy: { type: Number, required: true },
        stacklvl: { type: Boolean, required: true },
        status: { type: String, required: true, enum: ["Active", "Inactive"], default: "Active" },
        createdby: { type: Types.ObjectId, ref: 'Account', required: true },
        updatedby: { type: Types.ObjectId, ref: 'Account' }
    }, { timestamps: true }
);

export default model("Accounttype", AcctypSchema);