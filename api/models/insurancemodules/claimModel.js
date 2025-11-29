import mongoose from "mongoose";
import moment from 'moment'

const { Schema, model, Types } = mongoose

const ClaimSchema = new Schema({
    claimId: { type: String, required: true, trim: true },
    policyInfo: { type: Types.ObjectId, required: true, ref: 'Policyoperation' },
    voyage: { type: String, trim: true },
    lossLocation: { type: String, trim: true },
    dateOfLoss: { type: String, trim: true },
    natureOfLoss: { type: String, trim: true },
    descriptionOfLoss: { type: String, trim: true },
    estimateAmount: { type: String, trim: true },
    claimBill: { type: String, trim: true },
    assessedAmount: { type: String, trim: true },
    remarks: { type: String, trim: true },
    sitePersonName: { type: String, trim: true },
    sitePersonContactNo: { type: String, trim: true },
    surveyersName: { type: String, trim: true },
    surveyersContactNo: { type: String, trim: true },
    settledPayment: { type: String, trim: true },
    monthOfReceivedSettledAmount: { type: String, trim: true },
    documentsNeededAsPerLOR: { type: String, trim: true },
    receivedDocument: { type: String, trim: true },
    ourObservation: { type: String, trim: true },
    note: { type: String, trim: true },
    pendingDocumentsRequire: { type: String, trim: true },
    insuranceCompanyRequire: { type: String, trim: true },
    enclosedSheet: { type: String, trim: true },
    claimIdLodgementDate: { type: String, trim: true },
    customFields: [{
      fieldName: { type: String, trim: true, required: true }, // text
      fieldValue: { type: String, trim: true } // text
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
        approvalLevel: { type: Number, required: true }, // text
        approvalOption: { type: String, required: true, enum: ['Approval', 'Rejection'], default: 'Approval' }, // option
        approver: { type: Types.ObjectId, ref: 'Account', required: true }, // master
        approvalDate: { type: String, required: true, trim: true, default: () => moment().format("DD-MM-YYYY") }, // date
        approvalTime: { type: String, required: true, trim: true, default: () => moment().format("HH:mm:ss") }, // time
        approvalRemarks: { type: String, trim: true } // text
    }]
}, { timestamps: true })

export default model('Claim', ClaimSchema)










// 'voyage',
// 'lossLocation',
// 'dateOfLoss',
// 'natureOfLoss',
// 'descriptionOfLoss',
// 'estimateAmount',
// 'claimBill',
// 'assessedAmount',
// 'remarks',
// 'sitePersonWithContactNo',
// 'surveyersNameAndContactNo',
// 'settledPayment',
// 'monthOfReceivedSettledAmount',
// 'documentsNeededAsPerLOR',
// 'receivedDocument',
// 'ourObservation',
// 'note',
// 'pendingDocumentsRequire',
// 'insuranceCompanyRequire',
// 'enclosedSheet',
// 'claimIdLodgementDate',






// Autofetched using "policyNo" and shown in form UI only--------------------------------------------
// policyType: { type: Types.ObjectId, required: true, ref: 'Policytype' },
// insurerName: { type: Types.ObjectId, ref: 'Provider' },
// insurerAddress: { type: String, trim: true },
// insuredName: { type: Types.ObjectId, ref: 'Company' },
// plantLocation: { type: Types.ObjectId, ref: 'Unit' },