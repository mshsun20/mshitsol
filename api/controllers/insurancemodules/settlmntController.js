import mongoose from 'mongoose';
import settlmntModel from '../../models/insurancemodules/settlmntModel.js';
import { uploadFile, deleteFile } from '../../utilities/fileOperations.js';
import claimModel from '../../models/insurancemodules/claimModel.js';

const create = async (req, res) => {
    try {
        const settlmntPayld = req.body;
        // console.log(settlmntPayld);
        // console.log(req.files);
        const user = req.user
        
        const claimDtls = await claimModel.findById(settlmntPayld.claimInfo).select('claimId')
        const settlmntId = `${settlmntPayld?.policyNo}${claimDtls.claimId}`
        // console.log(settlmntId);

        const settlmntDetails = await settlmntModel.findOne({ settlementId: settlmntId });
        if (settlmntDetails) {
            return res.status(409).json({ message: "Settlement details already exists" });
        }
        else {
            settlmntPayld.settlementId = settlmntId
            if (settlmntPayld?.claimInfo && mongoose.Types.ObjectId.isValid(settlmntPayld?.claimInfo)) settlmntPayld.claimInfo = new mongoose.Types.ObjectId(settlmntPayld.claimInfo);
            delete settlmntPayld.policyNo
            settlmntPayld.customFields = settlmntPayld.customFields ? JSON.parse(settlmntPayld.customFields).filter(elm => elm.fieldName !== '') : [];

            // console.log(settlmntPayld);

            if (!req.files || req.files.length === 0) {
                return res.status(400).json({ message: "No files uploaded" });
            }
            const results = { otherDocs: [] };
            const duplicates = {};

            const files = req.files?.otherDocs || [];
            if (files.length > 0) {
                results.otherDocs = [];
                duplicates.otherDocs = [];
                for (const file of files) {
                    try {
                        const uploadedFile = await uploadFile(
                            file.buffer,
                            file.originalname,
                            file.mimetype
                        );
                        // console.log(uploadedFile);
                        results.otherDocs.push({
                            filId: uploadedFile?.file?._id,
                            filName: uploadedFile?.file?.filename,
                            filContentType: uploadedFile?.file?.contentType,
                            filContentSize: uploadedFile?.file?.length,
                            filUploadStatus: "Done",
                            fileUploadedby: user?._id
                        });
                    } catch (err) {
                        if (err.message.includes("Duplicate file")) {
                            duplicates.otherDocs.push(file.originalname);
                            console.log(`Duplicate Result ::`, duplicates.otherDocs);
                        } else {
                            console.error("❌ Upload Error:", err.message);
                        }
                    }
                }
                if (results.otherDocs.length > 0) {
                    settlmntPayld.otherDocs = results.otherDocs;
                }
            }

            if (user) {
                Object.assign(settlmntPayld, { status: 'Active', approvalStatus: 'Approved', currentPendingApprovalLevel: 0, createdby: user?._id });
            }
            // console.log(settlmntPayld);
            const settlmnt = await settlmntModel.create(settlmntPayld);
            if (!settlmnt) {
                return res.status(422).json({ message: "Failed to add New Settlement" });
            }
            else {
                res.status(201).json({
                    message: "Settlement details added successfully",
                    data: settlmnt
                });
            }
        }
    } catch (error) {
        console.error("Error creating Settlement details:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const read = async (req, res) => {
    try {
        const status = String(req.query.status || '').trim()
        const claim = String(req.query.claim || '').trim()

        const searchCriteria = {};
        if (claim) {
            searchCriteria.$or = [{ 'claimInfo.claimId': claim }]
            mongoose.isValidObjectId(claim) && searchCriteria.$or.push({ 'claimInfo._id': new mongoose.Types.ObjectId(claim) })
        }
        
        const pipeline = [
            ...(String(status).length > 0) ? [{ $match: { status: { $regex: `^${status}`, $options: 'i' } }}] : [],

            // 1️⃣ Lookup claimInfo (claims)
            {
                $lookup: {
                    from: 'claims',
                    localField: 'claimInfo',
                    foreignField: '_id',
                    as: 'claimInfo'
                }
            },
            { $unwind: { path: '$claimInfo', preserveNullAndEmptyArrays: true } },

            // 1️⃣ Lookup policyInfo (policyoperations)
            {
                $lookup: {
                    from: 'policyoperations',
                    localField: 'claimInfo.policyInfo',
                    foreignField: '_id',
                    as: 'claimInfo.policyInfo'
                }
            },
            { $unwind: { path: '$claimInfo.policyInfo', preserveNullAndEmptyArrays: true } },

            // 2️⃣ Lookup policyType
            {
                $lookup: {
                    from: 'policytypes',
                    localField: 'policyInfo.policyType',
                    foreignField: '_id',
                    as: 'policyTypeData'
                }
            },
            { $unwind: { path: '$policyTypeData', preserveNullAndEmptyArrays: true } },
            { $set: { 'policyInfo.policyType': '$policyTypeData' } },
            { $unset: 'policyTypeData' },

            // 3️⃣ Lookup insurerName
            {
                $lookup: {
                    from: 'providers',
                    localField: 'policyInfo.insurerName',
                    foreignField: '_id',
                    as: 'insurerData'
                }
            },
            { $unwind: { path: '$insurerData', preserveNullAndEmptyArrays: true } },
            { $set: { 'policyInfo.insurerName': '$insurerData' } },
            { $unset: 'insurerData' },

            // 4️⃣ Lookup insuredName
            {
                $lookup: {
                    from: 'companies',
                    localField: 'policyInfo.insuredName',
                    foreignField: '_id',
                    as: 'insuredData'
                }
            },
            { $unwind: { path: '$insuredData', preserveNullAndEmptyArrays: true } },
            { $set: { 'policyInfo.insuredName': '$insuredData' } },
            { $unset: 'insuredData' },

            // 5️⃣ Lookup plantLocation
            {
                $lookup: {
                    from: 'units',
                    localField: 'policyInfo.plantLocation',
                    foreignField: '_id',
                    as: 'plantLocationData'
                }
            },
            { $unwind: { path: '$plantLocationData', preserveNullAndEmptyArrays: true } },
            { $set: { 'policyInfo.plantLocation': '$plantLocationData' } },
            { $unset: 'plantLocationData' },

            // 6️⃣ createdby and updatedby lookups
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

            // 7️⃣ Date formatting
            {
                $addFields: {
                    createdAtITC: {
                        $dateToString: {
                            format: "%d-%m-%Y %H:%M:%S",
                            date: "$createdAt",
                            timezone: "+05:30"
                        }
                    },
                    updatedAtITC: {
                        $dateToString: {
                            format: "%d-%m-%Y %H:%M:%S",
                            date: "$updatedAt",
                            timezone: "+05:30"
                        }
                    }
                }
            },
            ...(String(claim).length > 0) ? [{ $match: searchCriteria }] : [],
            { $sort: { updatedAt: -1 } },
        ];
        const settlmntRecords = await settlmntModel.aggregate(pipeline)

        res.status(200).json({
            message: "Settlement details retrieved successfully",
            data: settlmntRecords
        });
    } catch (error) {
        console.error("Error retrieving Settlement details:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const readById = async (req, res) => {
    try {
        const settlmntId = req.params.id;
        const settlmntRecord = await settlmntModel.findById(settlmntId)
            // .populate(['policyInfo', 'createdby', 'updatedby']).lean();
        if (!settlmntRecord) {
            return res.status(404).json({ message: "Settlement details not found" });
        }
        res.status(200).json({
            message: "Settlement details retrieved successfully",
            data: settlmntRecord
        });
    } catch (error) {
        console.error("Error retrieving Settlement details:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const update = async (req, res) => {
    try {
        // console.log(req.body);
        const settlmntId = new mongoose.Types.ObjectId(req.query.id) || null;
        const settlmntPayld = req.body;
        // console.log(settlmntPayld);
        const user = req.user
        let otherDocsRmv = [];

        // Remove unwanted fields
        [
            'serial', 'id', '_id', '__v', 'settlementId', 'claimInfo', 'policyNo', 'policyInfo', 'createdby', 'creationdt', 'creationtm',
            'createdAt', 'updatedAt', 'createdAtITC', 'updatedAtITC'
        ].forEach(field => delete settlmntPayld[field]);

        // Set/update fields
        Object.assign(settlmntPayld, { updatedby: user?._id });

        // Convert IDs to ObjectId if present
        // if (settlmntPayld?.policyInfo && mongoose.Types.ObjectId.isValid(settlmntPayld?.policyInfo)) settlmntPayld.policyInfo = new mongoose.Types.ObjectId(settlmntPayld.policyInfo);
        settlmntPayld.customFields = settlmntPayld.customFields ? JSON.parse(settlmntPayld.customFields).filter(elm => elm.fieldName !== '') : [];

        // Parse and assign existing files if present
        if (settlmntPayld?.otherDocsExisting?.length > 0) {
            settlmntPayld.otherDocs = JSON.parse(settlmntPayld.otherDocsExisting);
            delete settlmntPayld.otherDocsExisting;
        }

        // Destructure and remove file arrays from payload
        const { otherDocs: otherDocsPayld } = settlmntPayld;
        delete settlmntPayld.otherDocs
        
        let apprvFlg = 0
        const highestApprvlLvl = parseInt(settlmntPayld?.highestApprvlLvl)
        delete settlmntPayld?.highestApprvlLvl
        if (parseInt(settlmntPayld?.currentPendingApprovalLevel) > 0 && settlmntPayld?.approvalStatus !== 'Approved') {
            apprvFlg = 1
            if (highestApprvlLvl > parseInt(settlmntPayld?.currentPendingApprovalLevel)) {
                settlmntPayld.status = 'Pending'
                settlmntPayld.currentPendingApprovalLevel = parseInt(settlmntPayld.currentPendingApprovalLevel) + 1
                settlmntPayld.approvalStatus = `Pending L${settlmntPayld.currentPendingApprovalLevel} Approval`
            }
            else if (highestApprvlLvl === parseInt(settlmntPayld?.currentPendingApprovalLevel)) {
                settlmntPayld.status = 'Active'
                settlmntPayld.currentPendingApprovalLevel = 0
                settlmntPayld.approvalStatus = 'Approved'
            }
        }
        else {
            apprvFlg = 0
            settlmntPayld.status = 'Open'
            settlmntPayld.currentPendingApprovalLevel = 1
            settlmntPayld.approvalStatus = 'Pending L1 Approval'
        }
        const settlmntRecord = await settlmntModel.findByIdAndUpdate(settlmntId, {
            ...settlmntPayld,
        }, { new: true });

        if (settlmntRecord) {
            // Helper to get files to remove
            const getFilesToRemove = (existingFiles, payloadFiles) =>
                payloadFiles?.length > 0
                    ? existingFiles.filter(file => !payloadFiles.some(f => f.filId === file.filId))
                    : existingFiles;

            // Collect files to remove
            otherDocsRmv = getFilesToRemove(settlmntRecord.otherDocs, otherDocsPayld);

            // Delete files in parallel
            await Promise.allSettled([ ...otherDocsRmv.map(file => deleteFile(file.filId).catch(err => console.error("❌ File Deletion Error:", err.message))) ]);

            let updtSettlmntRecord = await settlmntModel.findByIdAndUpdate(settlmntId, {
                $pull: { otherDocs: { filId: { $in: otherDocsRmv.map(f => f.filId) } } }
            }, { new: true });

            if (!updtSettlmntRecord) {
                if (apprvFlg === 0) {
                    return res.status(404).json({ message: "Settlement details update failed" });
                }
                else {
                    return res.status(404).json({ message: "Settlement details changes approval failed" });
                }
            }
            else {
                if (req.files) {
                    const results = { otherDocs: [] };
                    const duplicates = {};
                    const files = req.files?.otherDocs || [];
                    if (files.length > 0) {
                        results.otherDocs = [];
                        duplicates.otherDocs = [];
                        for (const file of files) {
                            try {
                                const uploadedFile = await uploadFile(
                                    file.buffer,
                                    file.originalname,
                                    file.mimetype
                                );
                                results.otherDocs.push({
                                    filId: uploadedFile?.file?._id,
                                    filName: uploadedFile?.file?.filename,
                                    filContentType: uploadedFile?.file?.contentType,
                                    filContentSize: uploadedFile?.file?.length,
                                    filUploadStatus: "Done",
                                    fileUploadedby: user?._id
                                });
                            } catch (err) {
                                if (err.message.includes("Duplicate file")) {
                                    duplicates.otherDocs.push(file.originalname);
                                } else {
                                    console.error("❌ Upload Error:", err.message);
                                }
                            }
                        }
                    }
                    // console.log(results);
                    const { otherDocs } = results;
                    updtSettlmntRecord = await settlmntModel.findByIdAndUpdate(settlmntId, {
                        $push: { otherDocs: { $each: otherDocs } },
                    }, { new: true });
                }
                else {
                    console.log("⚠️ No files uploaded");
                }

                if (updtSettlmntRecord.modifiedCount === 0) {
                    if (apprvFlg === 0) {
                        return res.status(404).json({ message: "Settlement details update failed" });
                    }
                    else {
                        return res.status(404).json({ message: "Settlement details changes approval failed" });
                    }
                }
                else {
                    if (apprvFlg === 0) {
                        res.status(201).json({
                            message: "Settlement details updated successfully",
                            data: updtSettlmntRecord
                        });
                    }
                    else {
                        res.status(201).json({
                            message: "Settlement details changes approved successfully",
                            data: updtSettlmntRecord
                        });
                    }
                }
            }
        }
        else {
            return res.status(404).json({ message: "Settlement details not found" });
        }
    } catch (error) {
        console.error("Error updating Settlement details:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const statusUpdate = async (req, res) => {
    try {
        const settlmntId = new mongoose.Types.ObjectId(req.query.id) || null;
        const settlmntPayld = req.body;
        // console.log(settlmntPayld);
        const user = req.user
        
        const settlmntRecord = await settlmntModel.findById(settlmntId);
        if (!settlmntRecord) {
            return res.status(404).json({ message: "Settlement details not found" });
        }
        else {
            const updtSettlmntRecord = await settlmntModel.findByIdAndUpdate(settlmntId, { status: settlmntPayld.status, updatedby: user?._id }, { new: true })
            if (updtSettlmntRecord.modifiedCount === 0) {
                return res.status(404).json({ message: "Settlement details update failed" });
            }
            else {
                res.status(201).json({
                    message: "Settlement details updated successfully",
                    data: updtSettlmntRecord
                });
            }
        }
    } catch (error) {
        console.error("Error deleting Settlement details:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const remove = async (req, res) => {
    try {
        const settlmntId = new mongoose.Types.ObjectId(req.query.id) || null;
        // console.log(settlmntId);
        const settlmntRecord = await settlmntModel.findById(settlmntId);
        if (!settlmntRecord) {
            return res.status(404).json({ message: "Settlement details not found" });
        }
        else {
            const files = settlmntRecord.otherDocs || [];
            for (const file of files) {
                try {
                    await deleteFile(file.filId);
                } catch (err) {
                    console.error("❌ File Deletion Error:", err.message);
                }
            }
            const deletedSettlmnt = await settlmntModel.findByIdAndDelete(settlmntId);
            if (!deletedSettlmnt) {
                return res.status(404).json({ message: "Settlement details not found" });
            }
            res.status(200).json({
                message: "Settlement details and associated files deleted successfully",
                data: deletedSettlmnt
            });
        }
    } catch (error) {
        console.error("Error deleting Settlement details:", error);
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