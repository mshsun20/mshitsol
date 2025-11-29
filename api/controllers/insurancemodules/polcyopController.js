import mongoose from 'mongoose';
import polcyopModel from "../../models/insurancemodules/polcyopModel.js";
import { uploadFile, deleteFile } from '../../utilities/fileOperations.js';
import moment from 'moment';
import { sendPolicyUpdateMail } from '../../utilities/jobscheduler/jobs/policyUpdateReminder.js';

const create = async (req, res) => {
    try {
        const polcyopPayld = req.body;
        console.log(polcyopPayld);
        // console.log(req.files);
        const user = req.user
        
        const polcyDetails = await polcyopModel.findOne({ policyNo: polcyopPayld.policyNo });
        if (polcyDetails) {
            return res.status(409).json({ message: "Policy details already exists" });
        }
        else {
            [ 'policyType', 'insurerName', 'insuredName', 'plantLocation', 'broker' ].forEach(key => {
                if (polcyopPayld?.[key] && mongoose.Types.ObjectId.isValid(polcyopPayld?.[key])) polcyopPayld[key] = new mongoose.Types.ObjectId(polcyopPayld[key]);
            });
            // [ 'inceptionDate', 'expiryDate', 'taxDate' ].forEach(key => {
            //     if (polcyopPayld?.[key]) polcyopPayld[key] = moment(polcyopPayld[key]).format('DD-MM-YYYY HH:mm:ss')
            // })
            if (polcyopPayld?.policyRenewalDaysPending) {
                delete polcyopPayld.policyRenewalDaysPending
            }
            polcyopPayld.installmentDetails = polcyopPayld.installmentDetails ? JSON.parse(polcyopPayld.installmentDetails)
            .filter(elm => (elm.installmentFieldName !== '')&&(elm.installmentAmount !== '')&&(elm.installmentGst !== '')&&(elm.installmentDate !== ''))
            : [];
            polcyopPayld.customFields = polcyopPayld.customFields ? JSON.parse(polcyopPayld.customFields).filter(elm => elm.fieldName !== '') : [];

            console.log(polcyopPayld);

            if (!req.files || req.files.length === 0) {
                return res.status(400).json({ message: "No files uploaded" });
            }
            const results = { nfaForQuotation: [], nfaForPayment: [], otherDocs: [] };
            const duplicates = {};

            const fileFields = ['nfaForQuotation', 'nfaForPayment', 'otherDocs'];

            for (const field of fileFields) {
                const files = req.files?.[field] || [];
                if (files.length > 0) {
                    results[field] = [];
                    duplicates[field] = [];
                    for (const file of files) {
                        try {
                            const uploadedFile = await uploadFile(
                                file.buffer,
                                file.originalname,
                                file.mimetype
                            );
                            // console.log(uploadedFile);
                            results[field].push({
                                filId: uploadedFile?.file?._id,
                                filName: uploadedFile?.file?.filename,
                                filContentType: uploadedFile?.file?.contentType,
                                filContentSize: uploadedFile?.file?.length,
                                filUploadStatus: "Done",
                                fileUploadedby: user?._id
                            });
                        } catch (err) {
                            if (err.message.includes("Duplicate file")) {
                                duplicates[field].push(file.originalname);
                                console.log(`Duplicate Result ::`, duplicates[field]);
                            } else {
                                console.error("❌ Upload Error:", err.message);
                            }
                        }
                    }
                    if (results[field].length > 0) {
                        polcyopPayld[field] = results[field];
                    }
                }
            }

            if (user) {
                Object.assign(polcyopPayld, {
                    status: 'Active',
                    approvalStatus: 'Approved',
                    currentPendingApprovalLevel: 0,
                    createdby: user?._id
                });
            }
            const polcyop = await polcyopModel.create(polcyopPayld);
            if (!polcyop) {
                return res.status(422).json({ message: "Failed to add New Policy" });
            }
            else {
                res.status(201).json({
                    message: "Policy details added successfully",
                    data: polcyop
                });
            }
        }
    } catch (error) {
        console.error("Error creating Policy details:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const getAllPolicyDetails = async (policyNo) => {
    try {
        const pipeline = [
            ...policyNo ? [ { $match: { policyNo: String(policyNo).trim() } } ] : [],
            {
                $lookup: {
                    from: 'policytypes',
                    localField: 'policyType',
                    foreignField: '_id',
                    as: 'policyType'
                }
            },
            { $unwind: { path: '$policyType', preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: 'providers',
                    localField: 'insurerName',
                    foreignField: '_id',
                    as: 'insurerName'
                }
            },
            { $unwind: { path: '$insurerName', preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: 'companies',
                    localField: 'insuredName',
                    foreignField: '_id',
                    as: 'insuredName'
                }
            },
            { $unwind: { path: '$insuredName', preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: 'units',
                    localField: 'plantLocation',
                    foreignField: '_id',
                    as: 'plantLocation'
                }
            },
            { $unwind: { path: '$plantLocation', preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: 'brokers',
                    localField: 'broker',
                    foreignField: '_id',
                    as: 'broker'
                }
            },
            { $unwind: { path: '$broker', preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: 'accounts',
                    localField: 'createdby',
                    foreignField: '_id',
                    as: 'createdby'
                }
            },
            { $unwind: { path: '$createdby', preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: 'accounts',
                    localField: 'updatedby',
                    foreignField: '_id',
                    as: 'updatedby'
                }
            },
            { $unwind: { path: '$updatedby', preserveNullAndEmptyArrays: true } },

            { $unwind: { path: '$approvalDetails', preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: 'accounts',
                    localField: 'approvalDetails.approver',
                    foreignField: '_id',
                    as: 'approvalDetails.approver'
                }
            },
            { $unwind: { path: '$approvalDetails.approver', preserveNullAndEmptyArrays: true } },
            
            {
                $addFields: {
                    expiryDateParsed: {
                        $dateFromString: {
                            dateString: "$expiryDate",
                            format: "%d-%m-%Y %H:%M:%S",
                            timezone: "+05:30"
                        }
                    }
                }
            },
            {
                $addFields: {
                    diffInMillis: { $subtract: ["$expiryDateParsed", "$$NOW"] }
                }
            },
            {
                $addFields: {
                    policyRenewalDaysPending: {
                        days: {
                            $floor: { $divide: [{ $abs: "$diffInMillis" }, 1000 * 60 * 60 * 24] }
                        },
                        hours: {
                            $floor: {
                                $divide: [
                                    { $mod: [{ $abs: "$diffInMillis" }, 1000 * 60 * 60 * 24] },
                                    1000 * 60 * 60
                                ]
                            }
                        },
                        minutes: {
                            $floor: {
                                $divide: [
                                    { $mod: [{ $abs: "$diffInMillis" }, 1000 * 60 * 60] },
                                    1000 * 60
                                ]
                            }
                        },
                        seconds: {
                            $floor: {
                                $divide: [
                                    { $mod: [{ $abs: "$diffInMillis" }, 1000 * 60] },
                                    1000
                                ]
                            }
                        }
                    },
                    createdAtITC: {
                        $dateToString: {
                            format: "%d-%m-%Y %H:%M:%S",
                            date: '$createdAt',
                            timezone: "+05:30"
                        }
                    },
                    updatedAtITC: {
                        $dateToString: {
                            format: "%d-%m-%Y %H:%M:%S",
                            date: '$updatedAt',
                            timezone: "+05:30"
                        }
                    }
                }
            },
            {
                $group: {
                    _id: '$_id',
                    doc: { $first: '$$ROOT' },
                    approvalDetails: {
                        $push: {
                            $cond: [
                                { $gt: [{ $ifNull: ['$approvalDetails.approvalLevel', null] }, null] },
                                '$approvalDetails',
                                '$$REMOVE'
                            ]
                        }
                    }
                }
            },
            { $replaceRoot: { newRoot: { $mergeObjects: ['$doc', { approvalDetails: '$approvalDetails' }] } } },
            { $sort: { updatedAt: -1 } },
        ]
        const polcyopRecords = await polcyopModel.aggregate(pipeline)

        return polcyopRecords
    } catch (error) {
        console.error(error)
    }
}

const read = async (req, res) => {
    try {
        const polcyopRecords = await getAllPolicyDetails()

        res.status(200).json({
            message: "Policy details retrieved successfully",
            data: polcyopRecords
        });
    } catch (error) {
        console.error("Error retrieving Policy details:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const readById = async (req, res) => {
    try {
        const polcyopId = req.params.id;
        const polcyopRecord = await polcyopModel.findById(polcyopId)
            .populate(['createdby', 'updatedby']);
        if (!polcyopRecord) {
            return res.status(404).json({ message: "Policy details not found" });
        }
        res.status(200).json({
            message: "Policy details retrieved successfully",
            data: polcyopRecord
        });
    } catch (error) {
        console.error("Error retrieving Policy details:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const update = async (req, res) => {
    try {
        // console.log(req.body);
        const polcyopId = new mongoose.Types.ObjectId(req.query.id) || null;
        const polcyopPayld = req.body;
        // console.log(polcyopPayld);
        const user = req.user
        let nfaForQuotationRmv = [], nfaForPaymentRmv = [], otherDocsRmv = [];

        // Remove unwanted fields
        [
            'serial', 'id', '_id', '__v', 'policyNo', 'createdby', 'creationdt', 'creationtm',
            'createdAt', 'updatedAt', 'createdAtITC', 'updatedAtITC'
        ].forEach(field => delete polcyopPayld[field]);

        // Set/update fields
        Object.assign(polcyopPayld, { updatedby: user?._id });

        // Convert IDs to ObjectId if present
        ['policyType', 'insurerName', 'insuredName', 'plantLocation'].forEach(key => {
            if (polcyopPayld?.[key] && mongoose.Types.ObjectId.isValid(polcyopPayld?.[key])) polcyopPayld[key] = new mongoose.Types.ObjectId(polcyopPayld[key]);
        });
        polcyopPayld.installmentDetails = polcyopPayld.installmentDetails ? JSON.parse(polcyopPayld.installmentDetails)
        .filter(elm => (elm.installmentFieldName !== '')&&(elm.installmentAmount !== '')&&(elm.installmentGst !== '')&&(elm.installmentDate !== ''))
        : [];
        polcyopPayld.customFields = polcyopPayld.customFields ? JSON.parse(polcyopPayld.customFields).filter(elm => elm.fieldName !== '') : [];

        // Parse and assign existing files if present
        ['nfaForQuotation', 'nfaForPayment', 'otherDocs'].forEach(field => {
            const existingKey = `${field}Existing`;
            if (polcyopPayld?.[existingKey]?.length > 0) {
                polcyopPayld[field] = JSON.parse(polcyopPayld[existingKey]);
                delete polcyopPayld[existingKey];
            }
        });

        // Destructure and remove file arrays from payload
        const {
            nfaForQuotation: nfaForQuotationPayld,
            nfaForPayment: nfaForPaymentPayld,
            otherDocs: otherDocsPayld,
        } = polcyopPayld;
        ['nfaForQuotation', 'nfaForPayment', 'otherDocs'].forEach(field => delete polcyopPayld[field]);

        let apprvFlg = 0, approvalInfo = {}
        const highestApprvlLvl = parseInt(polcyopPayld?.highestApprvlLvl)
        delete polcyopPayld?.highestApprvlLvl
        // console.log(polcyopPayld?.approvalOption);
        if (polcyopPayld?.approvalOption && parseInt(polcyopPayld?.currentPendingApprovalLevel) > 0 && polcyopPayld?.approvalStatus !== 'Approved') {
            if (polcyopPayld?.approvalOption === 'Approval') {
                apprvFlg = 1
                Object.assign(approvalInfo, {
                    approvalLevel: parseInt(polcyopPayld.currentPendingApprovalLevel),
                    approvalOption: polcyopPayld?.approvalOption || 'Approval',
                    approver: user?._id,
                    approvalRemarks: polcyopPayld?.approvalRemarks || '',
                })
                if (highestApprvlLvl > parseInt(polcyopPayld?.currentPendingApprovalLevel)) {
                    polcyopPayld.status = 'Pending'
                    polcyopPayld.currentPendingApprovalLevel = parseInt(polcyopPayld.currentPendingApprovalLevel) + 1
                    polcyopPayld.approvalStatus = `Pending L${polcyopPayld.currentPendingApprovalLevel} Approval`
                }
                else if (highestApprvlLvl === parseInt(polcyopPayld?.currentPendingApprovalLevel)) {
                    Object.assign(polcyopPayld, {
                        status: 'Active',
                        approvalStatus: 'Approved',
                        currentPendingApprovalLevel: 0,
                    });
                }
            }
            else if (polcyopPayld?.approvalOption === 'Rejection' && polcyopPayld.status === 'Pending') {
                apprvFlg = 2
                Object.assign(approvalInfo, {
                    approvalLevel: parseInt(polcyopPayld.currentPendingApprovalLevel),
                    approvalOption: polcyopPayld?.approvalOption || 'Rejection',
                    approver: user?._id,
                    approvalRemarks: polcyopPayld?.approvalRemarks || '',
                })
            }
        }
        else {
            apprvFlg = 0
            Object.assign(polcyopPayld, {
                status: 'Open',
                approvalStatus: 'Pending L1 Approval',
                currentPendingApprovalLevel: 1
            });
        }

        // console.log(polcyopPayld);

        if (apprvFlg < 2) {
            let polcyopRecord = null
            if (apprvFlg === 1) {
                polcyopRecord = await polcyopModel.findByIdAndUpdate(polcyopId, {
                    ...polcyopPayld,
                    $push: {
                        approvalDetails: approvalInfo
                    }
                }, { new: true });
            }
            else {
                polcyopRecord = await polcyopModel.findByIdAndUpdate(polcyopId, {
                    ...polcyopPayld,
                }, { new: true });
            }

            if (polcyopRecord && polcyopRecord !== null) {
                // Helper to get files to remove
                const getFilesToRemove = (existingFiles, payloadFiles) =>
                    payloadFiles?.length > 0
                        ? existingFiles.filter(file => !payloadFiles.some(f => f.filId === file.filId))
                        : existingFiles;

                // Collect files to remove
                nfaForQuotationRmv = getFilesToRemove(polcyopRecord.nfaForQuotation, nfaForQuotationPayld);
                nfaForPaymentRmv = getFilesToRemove(polcyopRecord.nfaForPayment, nfaForPaymentPayld);
                otherDocsRmv = getFilesToRemove(polcyopRecord.otherDocs, otherDocsPayld);

                // Delete files in parallel
                await Promise.allSettled([
                    ...nfaForQuotationRmv.map(file => deleteFile(file.filId).catch(err => console.error("❌ File Deletion Error:", err.message))),
                    ...nfaForPaymentRmv.map(file => deleteFile(file.filId).catch(err => console.error("❌ File Deletion Error:", err.message))),
                    ...otherDocsRmv.map(file => deleteFile(file.filId).catch(err => console.error("❌ File Deletion Error:", err.message))),
                ]);

                let updtPolcyRecord = await polcyopModel.findByIdAndUpdate(polcyopId, {
                    $pull: {
                        nfaForQuotation: { filId: { $in: nfaForQuotationRmv.map(f => f.filId) } },
                        nfaForPayment: { filId: { $in: nfaForPaymentRmv.map(f => f.filId) } },
                        otherDocs: { filId: { $in: otherDocsRmv.map(f => f.filId) } }
                    }
                }, { new: true });

                if (!updtPolcyRecord) {
                    if (apprvFlg === 0) {
                        return res.status(404).json({ message: "Policy details update failed" });
                    }
                    else {
                        return res.status(404).json({ message: "Policy details changes approval failed" });
                    }
                }
                else {
                    if (req.files) {
                        const results = { nfaForQuotation: [], nfaForPayment: [], otherDocs: [] };
                        const duplicates = {};
                        const fileFields = ['nfaForQuotation', 'nfaForPayment', 'otherDocs'];
                        for (const field of fileFields) {
                            const files = req.files?.[field] || [];
                            if (files.length > 0) {
                                results[field] = [];
                                duplicates[field] = [];
                                for (const file of files) {
                                    try {
                                        const uploadedFile = await uploadFile(
                                            file.buffer,
                                            file.originalname,
                                            file.mimetype
                                        );
                                        results[field].push({
                                            filId: uploadedFile?.file?._id,
                                            filName: uploadedFile?.file?.filename,
                                            filContentType: uploadedFile?.file?.contentType,
                                            filContentSize: uploadedFile?.file?.length,
                                            filUploadStatus: "Done",
                                            fileUploadedby: user?._id
                                        });
                                    } catch (err) {
                                        if (err.message.includes("Duplicate file")) {
                                            duplicates[field].push(file.originalname);
                                        } else {
                                            console.error("❌ Upload Error:", err.message);
                                        }
                                    }
                                }
                            }
                        }
                        // console.log(results);
                        const { nfaForQuotation, nfaForPayment, otherDocs } = results;
                        updtPolcyRecord = await polcyopModel.findByIdAndUpdate(polcyopId, {
                            $push: {
                                nfaForQuotation: { $each: nfaForQuotation },
                                nfaForPayment: { $each: nfaForPayment },
                                otherDocs: { $each: otherDocs },
                            },
                        }, { new: true });
                    }
                    else {
                        console.log("⚠️ No files uploaded");
                    }

                    if (!updtPolcyRecord) {
                        if (apprvFlg === 0) {
                            return res.status(404).json({ message: "Policy details update failed" });
                        }
                        else {
                            return res.status(404).json({ message: "Policy details changes approval failed" });
                        }
                    }
                    else {
                        const policyInfo = await getAllPolicyDetails(updtPolcyRecord.policyNo);
                        const policyDetails = policyInfo[0] || {};
                        const mailResp = await sendPolicyUpdateMail(policyDetails, `Policy Update Notification`);
                        console.log(mailResp);
                        if (apprvFlg === 0) {
                            res.status(201).json({
                                message: "Policy details updated successfully",
                                data: policyDetails
                            });
                        }
                        else {
                            res.status(201).json({
                                message: "Policy details changes approved successfully",
                                data: updtPolcyRecord
                            });
                        }
                    }
                }
            }
            else {
                return res.status(404).json({ message: "Policy details not found" });
            }
        }
        else {
            const polcyopRecord = await polcyopModel.findByIdAndUpdate(polcyopId, {
                status: 'Open',
                approvalStatus: 'Pending L1 Approval',
                currentPendingApprovalLevel: 1,
                $push: {
                    approvalDetails: approvalInfo
                }
            }, { new: true });
            if (!polcyopRecord) {
                return res.status(404).json({ message: "Policy details changes rejection failed" });
            }
            else {
                res.status(201).json({
                    message: "Policy details changes rejected successfully",
                    data: polcyopRecord
                });
            }
        }
    } catch (error) {
        console.error("Error updating Policy details:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const statusUpdate = async (req, res) => {
    try {
        const polcyopId = new mongoose.Types.ObjectId(req.query.id) || null;
        const polcyopPayld = req.body;
        console.log(polcyopPayld);
        const user = req.user
        
        const polcyopRecord = await polcyopModel.findById(polcyopId);
        if (!polcyopRecord) {
            return res.status(404).json({ message: "Policy details not found" });
        }
        else {
            const updtPolcyRecord = await polcyopModel.findByIdAndUpdate(polcyopId, { status: polcyopPayld.status, updatedby: user?._id }, { new: true })
            if (updtPolcyRecord.modifiedCount === 0) {
                return res.status(404).json({ message: "Policy details update failed" });
            }
            else {
                res.status(201).json({
                    message: "Policy details updated successfully",
                    data: updtPolcyRecord
                });
            }
        }
    } catch (error) {
        console.error("Error deleting Policy details:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const remove = async (req, res) => {
    try {
        const polcyopId = new mongoose.Types.ObjectId(req.query.id) || null;
        // console.log(polcyopId);
        const polcyopRecord = await polcyopModel.findById(polcyopId);
        if (!polcyopRecord) {
            return res.status(404).json({ message: "Policy details not found" });
        }
        else {
            const fileFields = ['nfaForQuotation', 'nfaForPayment', 'otherDocs'];
            for (const field of fileFields) {
                const files = polcyopRecord[field] || [];
                for (const file of files) {
                    try {
                        await deleteFile(file.filId);
                    } catch (err) {
                        console.error("❌ File Deletion Error:", err.message);
                    }
                }
            }
            const deletedPolcyop = await polcyopModel.findByIdAndDelete(polcyopId);
            if (!deletedPolcyop) {
                return res.status(404).json({ message: "Policy details not found" });
            }
            res.status(200).json({
                message: "Policy details and associated files deleted successfully",
                data: deletedPolcyop
            });
        }
    } catch (error) {
        console.error("Error deleting Policy details:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export default {
    create,
    read,
    readById,
    update,
    statusUpdate,
    remove
};