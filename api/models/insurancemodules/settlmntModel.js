import mongoose from "mongoose";
import moment from 'moment'

const { Schema, model, Types } = mongoose

const SettlmntSchema = new Schema({
    settlementId: { type: String, required: true, trim: true },
    claimInfo: { type: Types.ObjectId, required: true, ref: 'Claim' },
    settledPaymentAmount: { type: String, trim: true },
    utrDetailsWithDate: { type: String, trim: true },
    remarks: { type: String, trim: true },
    customFields: [{
      fieldName: { type: String, trim: true, required: true },
      fieldValue: { type: String, trim: true }
    }],
    otherDocs: [{
        filId: { type: String, trim: true, required: true },
        filName: { type: String, trim: true, required: true },
        filContentType: { type: String, trim: true, required: true },
        filContentSize: { type: String, trim: true, required: true },
        filUploadStatus: { type: String, required: true, enum: ['Pending', 'Done'], default: 'Done' },
        fileUploadDate: { type: String, required: true, trim: true, default: () => moment().format("DD-MM-YYYY") },
        fileUploadTime: { type: String, required: true, trim: true, default: () => moment().format("HH:mm:ss") },
        fileUploadedby: { type: Types.ObjectId, ref: 'Account' }
    }],
    status: { type: String, required: true, enum: ['Open', 'Active', 'Inactive'], default: 'Active' }, // status
    createdby: { type: Types.ObjectId, ref: 'Account', required: true }, // master
    updatedby: { type: Types.ObjectId, ref: 'Account' }, // master
    creationdt: { type: String, required: true, trim: true, default: () => moment().format("DD-MM-YYYY") }, // date
    creationtm: { type: String, required: true, trim: true, default: () => moment().format("HH:mm:ss") }, // time
    approvalStatus: { type: String, required: true, default: 'Approved', trim: true }, // status
    currentPendingApprovalLevel: { type: Number, required: true, default: 0 }, // Current Approval Level
    approvalDetails: [{
        approvalLevel: { type: Number, required: true },
        approvalOption: { type: String, required: true, enum: ['Approval', 'Rejection'], default: 'Approval' }, // option
        approver: { type: Types.ObjectId, ref: 'Account', required: true }, // master
        approvalDate: { type: String, required: true, trim: true, default: () => moment().format("DD-MM-YYYY") }, // date
        approvalTime: { type: String, required: true, trim: true, default: () => moment().format("HH:mm:ss") }, // time
        approvalRemarks: { type: String, trim: true }
    }]
}, { timestamps: true })

export default model('Settlement', SettlmntSchema)