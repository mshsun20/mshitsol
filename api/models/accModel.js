import mongoose from 'mongoose';
import moment from 'moment'

const { Schema, model, Types } = mongoose;

const AccSchema = new Schema({
    acc_uname: { type: String, required: true, trim: true },
    acc_pass: { type: String, required: true, trim: true },
    acc_pass_bckup: { type: String, required: true, trim: true },
    acc_eml: { type: String, trim: true, default: '' },
    acc_phn: { type: String, trim: true, default: '' },
    acc_fname: { type: String, required: true, trim: true },
    acc_secphn: { type: String, trim: true },
    acc_typ: { type: Types.ObjectId, ref: 'Accounttype', required: true },
    acc_comp: { type: String, trim: true },
    acc_emp_code: { type: String, trim: true, default: '' },
    acc_addrss: { type: String, trim: true },
    acc_pan: { type: String, trim: true },
    acc_gst: { type: String, trim: true },
    acc_img: { type: String },
    acc_img_publicid: { type: String },
    acc_dob: { type: Date },
    acc_anniversary: { type: Date },
    acc_is_creator: { type: Boolean, required: true, enum: [true, false], default: true },
    acc_is_approver: { type: Boolean, required: true, enum: [true, false], default: false },
    acc_status: { type: String, required: true, enum: ['Active', 'Inactive'], default: 'Active' },
    createdby: { type: Types.ObjectId, ref: 'Account', required: true },
    creation_dt: { type: String, required: true, trim: true, default: () => moment().format("DD-MM-YYYY") },
    creation_tm: { type: String, required: true, trim: true, default: () => moment().format("HH:mm:ss") },
    updatedby: { type: Types.ObjectId, ref: 'Account' }
}, { timestamps: true });

export default model('Account', AccSchema);




// acc_uname: '',
// acc_pass: '',
// acc_eml: '',
// acc_phn: '',
// acc_fname: '',
// acc_secphn: '',
// acc_typ: '',
// acc_comp: '',
// acc_emp_code: '',
// acc_reporting: '',
// acc_addrss: '',
// acc_pan: '',
// acc_gst: '',
// acc_img: '',
// acc_img_publicid: '',
// acc_dob: '',
// acc_anniversary: '',
// acc_is_creator: '',
// acc_is_approver: '',
// acc_status: '',
// createdby: '',
// creation_dt: '',
// creation_tm: '',
// updatedby: ''
