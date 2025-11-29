import mongoose from 'mongoose';

const { Schema, model, Types } = mongoose;

const RndSchema = new Schema({
    account: { type: Types.ObjectId, ref: 'Account', required: true },
    rndcode: { type: Number, required: true }
}, {
    timestamps: true
});

export default model('Randomcode', RndSchema);