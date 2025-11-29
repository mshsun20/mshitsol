import mongoose from "mongoose";
import untModel from "../../../models/masters/admin/untModel.js";

const create = async (req, res) => {
    try {
        const untPayld = req.body;
        const user = req.user

        if (user) {
            Object.assign(untPayld, { status: 'Active', createdby: user?._id });
        }
        const existingUnt = await untModel.findOne({ unitCode: untPayld.unitCode });
        if (existingUnt) {
            return res.status(409).json({ message: "Unit already exists" });
        }
        else {
            const unt = await untModel.create(untPayld);
            if (!unt) {
                return res.status(422).json({ message: "Failed to create Unit details" });
            } else {
                res.status(201).json({
                    message: "Unit details created successfully",
                    data: unt
                });
            }
        }
    } catch (error) {
        console.error("Error creating Unit details:", error);
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
        const untRecords = await untModel.aggregate(pipeline)

        res.status(200).json({
            message: "Unit details retrieved successfully",
            data: untRecords
        });
    } catch (error) {
        console.error("Error retrieving Unit details:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const readById = async (req, res) => {
    try {
        const untId = req.params.id;
        const untRecord = await untModel.findById(untId)
            .populate(['createdby', 'updatedby']);
        if (!untRecord) {
            return res.status(404).json({ message: "Unit details not found" });
        }
        res.status(200).json({
            message: "Unit details retrieved successfully",
            data: untRecord
        });
    } catch (error) {
        console.error("Error retrieving Unit details:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const update = async (req, res) => {
    try {
        const untId = new mongoose.Types.ObjectId(req.query.id) || null;
        const untPayld = req.body;
        const user = req.user

        if (user) {
            Object.assign(untPayld, { status: 'Active', updatedby: user?._id });
        }
        const updatedUnt = await untModel.findByIdAndUpdate(untId, untPayld, { new: true });
        if (!updatedUnt) {
            return res.status(404).json({ message: "Unit details not found" });
        }
        res.status(201).json({
            message: "Unit details updated successfully",
            data: updatedUnt
        });
    } catch (error) {
        console.error("Error updating Unit details:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const remove = async (req, res) => {
    try {
        const untId = new mongoose.Types.ObjectId(req.query.id) || null;
        const deletedUnt = await untModel.findByIdAndDelete(untId);
        if (!deletedUnt) {
            return res.status(404).json({ message: "Unit details not found" });
        }
        res.status(200).json({
            message: "Unit details deleted successfully",
            data: deletedUnt
        });
    } catch (error) {
        console.error("Error deleting Unit details:", error);
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