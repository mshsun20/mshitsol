import mongoose from 'mongoose';
import polcytypModel from '../../../models/masters/insurncsetups/polcytypModel.js';

const create = async (req, res) => {
    try {
        const polcytypPayld = req.body;
        const user = req.user

        if (user) {
            Object.assign(polcytypPayld, { status: 'Active', createdby: user?._id });
        }
        const existingPolcytyp = await polcytypModel.findOne({ policytypeCode: polcytypPayld.policytypeCode });
        if (existingPolcytyp) {
            return res.status(409).json({ message: "Policy Type details already exists" });
        }
        else {
            const polcytyp = await polcytypModel.create(polcytypPayld);
            if (!polcytyp) {
                return res.status(422).json({ message: "Failed to create Policy Type" });
            } else {
                res.status(201).json({
                    message: "Policy Type details created successfully",
                    data: polcytyp
                });
            }
        }
    } catch (error) {
        console.error("Error creating Policy Type details:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const read = async (req, res) => {
    try {
        const pipeline = [
            { $sort: { updatedAt: -1 } },
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
            { $addFields: {
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
            }}
        ]
        const polcytypRecords = await polcytypModel.aggregate(pipeline)

        res.status(200).json({
            message: "Policy Type details retrieved successfully",
            data: polcytypRecords
        });
    } catch (error) {
        console.error("Error retrieving Policy Type details:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const readById = async (req, res) => {
    try {
        const polcytypId = req.params.id;
        const polcytypRecord = await polcytypModel.findById(polcytypId)
            .populate(['createdby', 'updatedby']);
        if (!polcytypRecord) {
            return res.status(404).json({ message: "Policy Type details not found" });
        }
        res.status(200).json({
            message: "Policy Type details retrieved successfully",
            data: polcytypRecord
        });
    } catch (error) {
        console.error("Error retrieving Policy Type details:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const update = async (req, res) => {
    try {
        const polcytypId = new mongoose.Types.ObjectId(req.query.id) || null;
        const polcytypPayld = req.body;
        const user = req.user

        if (user) {
            Object.assign(polcytypPayld, { status: 'Active', updatedby: user?._id });
        }
        const updatedPolcytyp = await polcytypModel.findByIdAndUpdate(polcytypId, polcytypPayld, { new: true });
        if (!updatedPolcytyp) {
            return res.status(404).json({ message: "Policy Type details not found" });
        }
        res.status(201).json({
            message: "Policy Type details updated successfully",
            data: updatedPolcytyp
        });
    } catch (error) {
        console.error("Error updating Policy Type details:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const remove = async (req, res) => {
    try {
        const polcytypId = new mongoose.Types.ObjectId(req.query.id) || null;
        console.log(polcytypId);
        const deletedPolcytyp = await polcytypModel.findByIdAndDelete(polcytypId);
        if (!deletedPolcytyp) {
            return res.status(404).json({ message: "Policy Type details not found" });
        }
        res.status(200).json({
            message: "Policy Type details deleted successfully",
            data: deletedPolcytyp
        });
    } catch (error) {
        console.error("Error deleting Policy Type details:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export default {
    create,
    read,
    readById,
    update,
    remove
};