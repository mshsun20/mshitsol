import mongoose from "mongoose";
import moment from "moment";

const { Schema, model, Types } = mongoose;

const polcyopSchema = new Schema(
  {
    policyNo: { type: String, required: true, trim: true },
    policyType: { type: Types.ObjectId, required: true, ref: 'Policytype' },
    insurerName: { type: Types.ObjectId, ref: 'Provider' },
    insurerAddress: { type: String, trim: true },
    insuredName: { type: Types.ObjectId, ref: 'Company' },
    insuredAddress: { type: String, trim: true },
    sumInsuredEndorsement: { type: String, trim: true },
    sumInsuredEndorsementNo: { type: String, trim: true },
    inceptionDate: { type: String, trim: true },
    expiryDate: { type: String, trim: true },
    initialPolicySumInsured: { type: String, trim: true },
    premiumType: { type: String, enum: ['Onetime', 'Installment'], default: 'Onetime' },
    premiumAmount: { type: String, trim: true },
    gstAmount: { type: String, trim: true },
    installmentDetails: [{
      installmentFieldName: { type: String, trim: true, required: true }, // text
      installmentAmount: { type: String, trim: true, required: true },
      installmentGst: { type: String, trim: true, required: true },
      installmentDate: { type: String, trim: true, required: true },
      installmentNote: { type: String, trim: true },
    }],
    netPremiumAmount: { type: String, trim: true },
    broker: { type: Types.ObjectId, required: true, ref: 'Broker' },
    taxInvoiceNo: { type: String, trim: true },
    taxDate: { type: String, trim: true },
    notes: { type: String, trim: true },
    plantLocation: { type: Types.ObjectId, ref: 'Unit' },
    customFields: [{
      fieldName: { type: String, trim: true, required: true }, // text
      fieldValue: { type: String, trim: true } // text
    }],
    nfaForQuotation: [{
      filId: { type: String, trim: true, required: true },
      filName: { type: String, trim: true, required: true },
      filContentType: { type: String, trim: true, required: true },
      filContentSize: { type: String, trim: true, required: true },
      filUploadStatus: { type: String, required: true, enum: ['Pending', 'Done'], default: 'Done' },
      fileUploadDate: { type: String, required: true, trim: true, default: () => moment().format("DD-MM-YYYY") },
      fileUploadTime: { type: String, required: true, trim: true, default: () => moment().format("HH:mm:ss") },
      fileUploadedby: { type: Types.ObjectId, ref: 'Account' }
    }],
    nfaForPayment: [{
      filId: { type: String, trim: true, required: true },
      filName: { type: String, trim: true, required: true },
      filContentType: { type: String, trim: true, required: true },
      filContentSize: { type: String, trim: true, required: true },
      filUploadStatus: { type: String, required: true, enum: ['Pending', 'Done'], default: 'Done' },
      fileUploadDate: { type: String, required: true, trim: true, default: () => moment().format("DD-MM-YYYY") },
      fileUploadTime: { type: String, required: true, trim: true, default: () => moment().format("HH:mm:ss") },
      fileUploadedby: { type: Types.ObjectId, ref: 'Account' }
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
  }, { timestamps: true }
);

export default model('Policyoperation', polcyopSchema);

