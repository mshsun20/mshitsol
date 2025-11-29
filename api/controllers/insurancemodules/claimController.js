import mongoose from 'mongoose';
import claimModel from '../../models/insurancemodules/claimModel.js';
import { uploadFile, deleteFile } from '../../utilities/fileOperations.js';

const create = async (req, res) => {
    try {
        const claimPayld = req.body;
        // console.log(claimPayld);
        // console.log(req.files);
        const user = req.user
        
        const claimDetails = await claimModel.findOne({ claimId: claimPayld.claimId });
        if (claimDetails) {
            return res.status(409).json({ message: "Claim details already exists" });
        }
        else {
        if (claimPayld?.policyInfo && mongoose.Types.ObjectId.isValid(claimPayld?.policyInfo)) claimPayld.policyInfo = new mongoose.Types.ObjectId(claimPayld.policyInfo);
            claimPayld.customFields = claimPayld.customFields ? JSON.parse(claimPayld.customFields).filter(elm => elm.fieldName !== '') : [];

            console.log(claimPayld);

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
                    claimPayld.otherDocs = results.otherDocs;
                }
            }

            if (user) {
                Object.assign(claimPayld, { status: 'Active', approvalStatus: 'Approved', currentPendingApprovalLevel: 0, createdby: user?._id });
            }
            console.log(claimPayld);
            const claim = await claimModel.create(claimPayld);
            if (!claim) {
                return res.status(422).json({ message: "Failed to add New Claim" });
            }
            else {
                res.status(201).json({
                    message: "Claim details added successfully",
                    data: claim
                });
            }
        }
    } catch (error) {
        console.error("Error creating Claim details:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const read = async (req, res) => {
    try {
        const status = String(req.query.status || '').trim()
        const policy = String(req.query.policy || '').trim()

        const searchCriteria = {};
        if (policy) {
            searchCriteria.$or = [{ 'policyInfo.policyNo': policy }]
            mongoose.isValidObjectId(policy) && searchCriteria.$or.push({ 'policyInfo._id': new mongoose.Types.ObjectId(policy) })
        }
        
        const pipeline = [
            ...(String(status).length > 0) ? [{ $match: { status: { $regex: `^${status}`, $options: 'i' } }}] : [],

            // 1️⃣ Lookup policyInfo (policyoperations)
            {
                $lookup: {
                    from: 'policyoperations',
                    localField: 'policyInfo',
                    foreignField: '_id',
                    as: 'policyInfo'
                }
            },
            { $unwind: { path: '$policyInfo', preserveNullAndEmptyArrays: true } },

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
            ...(String(policy).length > 0) ? [{ $match: searchCriteria }] : [],
            { $sort: { updatedAt: -1 } },
        ];
        const claimRecords = await claimModel.aggregate(pipeline)

        res.status(200).json({
            message: "Claim details retrieved successfully",
            data: claimRecords
        });
    } catch (error) {
        console.error("Error retrieving Claim details:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const readById = async (req, res) => {
    try {
        const claimId = req.params.id;
        const claimRecord = await claimModel.findById(claimId)
            .populate(['policyInfo', 'createdby', 'updatedby']).lean();
        if (!claimRecord) {
            return res.status(404).json({ message: "Claim details not found" });
        }
        res.status(200).json({
            message: "Claim details retrieved successfully",
            data: claimRecord
        });
    } catch (error) {
        console.error("Error retrieving Claim details:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const readOnPolcy = async (req, res) => {
    try {
        const status = String(req.query.status || '').trim()
        
        const pipeline = [
            ...(String(status).length > 0) ? [{ $match: { status: { $regex: `^${status}`, $options: 'i' } }}] : [],

            // 1️⃣ Lookup policyInfo (policyoperations)
            {
                $lookup: {
                    from: 'policyoperations',
                    localField: 'policyInfo',
                    foreignField: '_id',
                    as: 'policyInfo'
                }
            },
            { $unwind: { path: '$policyInfo', preserveNullAndEmptyArrays: true } },

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
            // 🔟 Group all claims by policy number
            {
                $group: {
                    _id: '$policyInfo._id',
                    policyDetails: { $first: '$policyInfo' },
                    totalClaims: { $sum: 1 },
                    claimDetails: { $push: '$$ROOT' } // all claim docs under this policy
                }
            },
            // 1️⃣1️⃣ Flatten policyDetails into root
            {
                $replaceRoot: {
                    newRoot: {
                        $mergeObjects: ['$$ROOT', '$policyDetails']
                    }
                }
            },

            // 1️⃣2️⃣ Optional: remove the old field
            { $unset: 'policyDetails' },

            // 1️⃣1️⃣ Sort by policyNo (optional)
            { $sort: { _id: 1 } },
        ];
        const claimRecords = await claimModel.aggregate(pipeline)

        res.status(200).json({
            message: "Claim details retrieved successfully",
            data: claimRecords
        });
    } catch (error) {
        console.error("Error retrieving Claim details:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const update = async (req, res) => {
    try {
        // console.log(req.body);
        const claimId = new mongoose.Types.ObjectId(req.query.id) || null;
        const claimPayld = req.body;
        // console.log(claimPayld);
        const user = req.user
        let otherDocsRmv = [];

        // Remove unwanted fields
        [
            'serial', 'id', '_id', '__v', 'claimId', 'policyInfo', 'createdby', 'creationdt', 'creationtm',
            'createdAt', 'updatedAt', 'createdAtITC', 'updatedAtITC'
        ].forEach(field => delete claimPayld[field]);

        // Set/update fields
        Object.assign(claimPayld, { updatedby: user?._id });

        // Convert IDs to ObjectId if present
        // if (claimPayld?.policyInfo && mongoose.Types.ObjectId.isValid(claimPayld?.policyInfo)) claimPayld.policyInfo = new mongoose.Types.ObjectId(claimPayld.policyInfo);
        claimPayld.customFields = claimPayld.customFields ? JSON.parse(claimPayld.customFields).filter(elm => elm.fieldName !== '') : [];

        // Parse and assign existing files if present
        if (claimPayld?.otherDocsExisting?.length > 0) {
            claimPayld.otherDocs = JSON.parse(claimPayld.otherDocsExisting);
            delete claimPayld.otherDocsExisting;
        }

        // Destructure and remove file arrays from payload
        const { otherDocs: otherDocsPayld } = claimPayld;
        delete claimPayld.otherDocs
        
        let apprvFlg = 0
        const highestApprvlLvl = parseInt(claimPayld?.highestApprvlLvl)
        delete claimPayld?.highestApprvlLvl
        if (parseInt(claimPayld?.currentPendingApprovalLevel) > 0 && claimPayld?.approvalStatus !== 'Approved') {
            apprvFlg = 1
            if (highestApprvlLvl > parseInt(claimPayld?.currentPendingApprovalLevel)) {
                claimPayld.status = 'Pending'
                claimPayld.currentPendingApprovalLevel = parseInt(claimPayld.currentPendingApprovalLevel) + 1
                claimPayld.approvalStatus = `Pending L${claimPayld.currentPendingApprovalLevel} Approval`
            }
            else if (highestApprvlLvl === parseInt(claimPayld?.currentPendingApprovalLevel)) {
                claimPayld.status = 'Active'
                claimPayld.currentPendingApprovalLevel = 0
                claimPayld.approvalStatus = 'Approved'
            }
        }
        else {
            apprvFlg = 0
            claimPayld.status = 'Open'
            claimPayld.currentPendingApprovalLevel = 1
            claimPayld.approvalStatus = 'Pending L1 Approval'
        }
        const claimRecord = await claimModel.findByIdAndUpdate(claimId, {
            ...claimPayld,
        }, { new: true });

        if (claimRecord) {
            // Helper to get files to remove
            const getFilesToRemove = (existingFiles, payloadFiles) =>
                payloadFiles?.length > 0
                    ? existingFiles.filter(file => !payloadFiles.some(f => f.filId === file.filId))
                    : existingFiles;

            // Collect files to remove
            otherDocsRmv = getFilesToRemove(claimRecord.otherDocs, otherDocsPayld);

            // Delete files in parallel
            await Promise.allSettled([ ...otherDocsRmv.map(file => deleteFile(file.filId).catch(err => console.error("❌ File Deletion Error:", err.message))) ]);

            let updtClaimRecord = await claimModel.findByIdAndUpdate(claimId, {
                $pull: { otherDocs: { filId: { $in: otherDocsRmv.map(f => f.filId) } } }
            }, { new: true });

            if (!updtClaimRecord) {
                if (apprvFlg === 0) {
                    return res.status(404).json({ message: "Claim details update failed" });
                }
                else {
                    return res.status(404).json({ message: "Claim details changes approval failed" });
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
                    updtClaimRecord = await claimModel.findByIdAndUpdate(claimId, {
                        $push: { otherDocs: { $each: otherDocs } },
                    }, { new: true });
                }
                else {
                    console.log("⚠️ No files uploaded");
                }

                if (updtClaimRecord.modifiedCount === 0) {
                    if (apprvFlg === 0) {
                        return res.status(404).json({ message: "Claim details update failed" });
                    }
                    else {
                        return res.status(404).json({ message: "Claim details changes approval failed" });
                    }
                }
                else {
                    if (apprvFlg === 0) {
                        res.status(201).json({
                            message: "Claim details updated successfully",
                            data: updtClaimRecord
                        });
                    }
                    else {
                        res.status(201).json({
                            message: "Claim details changes approved successfully",
                            data: updtClaimRecord
                        });
                    }
                }
            }
        }
        else {
            return res.status(404).json({ message: "Claim details not found" });
        }
    } catch (error) {
        console.error("Error updating Claim details:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const statusUpdate = async (req, res) => {
    try {
        const claimId = new mongoose.Types.ObjectId(req.query.id) || null;
        const claimPayld = req.body;
        // console.log(claimPayld);
        const user = req.user
        
        const claimRecord = await claimModel.findById(claimId);
        if (!claimRecord) {
            return res.status(404).json({ message: "Claim details not found" });
        }
        else {
            const updtClaimRecord = await claimModel.findByIdAndUpdate(claimId, { status: claimPayld.status, updatedby: user?._id }, { new: true })
            if (updtClaimRecord.modifiedCount === 0) {
                return res.status(404).json({ message: "Claim details update failed" });
            }
            else {
                res.status(201).json({
                    message: "Claim details updated successfully",
                    data: updtClaimRecord
                });
            }
        }
    } catch (error) {
        console.error("Error deleting Claim details:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const remove = async (req, res) => {
    try {
        const claimId = new mongoose.Types.ObjectId(req.query.id) || null;
        // console.log(claimId);
        const claimRecord = await claimModel.findById(claimId);
        if (!claimRecord) {
            return res.status(404).json({ message: "Claim details not found" });
        }
        else {
            const files = claimRecord.otherDocs || [];
            for (const file of files) {
                try {
                    await deleteFile(file.filId);
                } catch (err) {
                    console.error("❌ File Deletion Error:", err.message);
                }
            }
            const deletedClaim = await claimModel.findByIdAndDelete(claimId);
            if (!deletedClaim) {
                return res.status(404).json({ message: "Claim details not found" });
            }
            res.status(200).json({
                message: "Claim details and associated files deleted successfully",
                data: deletedClaim
            });
        }
    } catch (error) {
        console.error("Error deleting Claim details:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export default {
    create,
    read,
    readById,
    readOnPolcy,
    update,
    statusUpdate,
    remove
};