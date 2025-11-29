import mongoose from 'mongoose';

const { Schema, model, Types } = mongoose;

const AcccatSchema = new Schema({
    cat_name: { type: String, required: true, unique: true, trim: true },
    cat_dtl: { type: String, trim: true },
    cat_lvl: { type: Number, required: true, trim: true },
    status: { type: String, required: true, enum: ['Active', 'Inactive'], default: 'Active' },
    createdby: { type: Types.ObjectId, ref: 'Account', required: true },
    updatedby: { type: Types.ObjectId, ref: 'Account' }
}, {
    timestamps: true
});

export default model('Accountcategory', AcccatSchema);