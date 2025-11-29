import mongoose from 'mongoose';
import provdrModel from '../../../models/masters/insurncsetups/provdrModel.js';

const create = async (req, res) => {
    try {
        const provdrPayld = req.body;
        const user = req.user

        if (user) {
            Object.assign(provdrPayld, { status: 'Active', createdby: user?._id });
        }
        const existingProvdr = await provdrModel.findOne({ providerCode: provdrPayld.providerCode });
        if (existingProvdr) {
            return res.status(409).json({ message: "Policy Provider details already exists" });
        }
        else {
            const provdr = await provdrModel.create(provdrPayld);
            if (!provdr) {
                return res.status(422).json({ message: "Failed to create Policy Provider" });
            } else {
                res.status(201).json({
                    message: "Policy Provider details created successfully",
                    data: provdr
                });
            }
        }
    } catch (error) {
        console.error("Error creating Policy Provider details:", error);
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
        const provdrRecords = await provdrModel.aggregate(pipeline)

        res.status(200).json({
            message: "Policy Provider details retrieved successfully",
            data: provdrRecords
        });
    } catch (error) {
        console.error("Error retrieving Policy Provider details:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const readById = async (req, res) => {
    try {
        const provdrId = req.params.id;
        const provdrRecord = await provdrModel.findById(provdrId)
            .populate(['createdby', 'updatedby']);
        if (!provdrRecord) {
            return res.status(404).json({ message: "Policy Provider details not found" });
        }
        res.status(200).json({
            message: "Policy Provider details retrieved successfully",
            data: provdrRecord
        });
    } catch (error) {
        console.error("Error retrieving Policy Provider details:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const update = async (req, res) => {
    try {
        const provdrId = new mongoose.Types.ObjectId(req.query.id) || null;
        const provdrPayld = req.body;
        const user = req.user

        if (user) {
            Object.assign(provdrPayld, { status: 'Active', updatedby: user?._id });
        }
        const updatedProvdr = await provdrModel.findByIdAndUpdate(provdrId, provdrPayld, { new: true });
        if (!updatedProvdr) {
            return res.status(404).json({ message: "Policy Provider details not found" });
        }
        res.status(201).json({
            message: "Policy Provider details updated successfully",
            data: updatedProvdr
        });
    } catch (error) {
        console.error("Error updating Policy Provider details:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const remove = async (req, res) => {
    try {
        const provdrId = new mongoose.Types.ObjectId(req.query.id) || null;
        const deletedProvdr = await provdrModel.findByIdAndDelete(provdrId);
        if (!deletedProvdr) {
            return res.status(404).json({ message: "Policy Provider details not found" });
        }
        res.status(200).json({
            message: "Policy Provider details deleted successfully",
            data: deletedProvdr
        });
    } catch (error) {
        console.error("Error deleting Policy Provider details:", error);
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