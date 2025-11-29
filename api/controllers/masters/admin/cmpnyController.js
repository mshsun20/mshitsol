import mongoose from "mongoose";
import cmpnyModel from "../../../models/masters/admin/cmpnyModel.js";

const create = async (req, res) => {
    try {
        const cmpnyPayld = req.body;
        const user = req.user

        if (user) {
            Object.assign(cmpnyPayld, { status: 'Active', createdby: user?._id });
        }
        const existingCmpny = await cmpnyModel.findOne({ companyCode: cmpnyPayld.companyCode });
        if (existingCmpny) {
            return res.status(409).json({ message: "Company code already exists" });
        }
        else {
            const cmpny = await cmpnyModel.create(cmpnyPayld);
            if (!cmpny) {
                return res.status(422).json({ message: "Failed to create Company record" });
            } else {
                res.status(201).json({
                    message: "Company record created successfully",
                    data: cmpny
                });
            }
        }
    } catch (error) {
        console.error("Error creating Company record:", error);
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
        const cmpnyRecords = await cmpnyModel.aggregate(pipeline)

        res.status(200).json({
            message: "Company records retrieved successfully",
            data: cmpnyRecords
        });
    } catch (error) {
        console.error("Error retrieving Company records:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const readById = async (req, res) => {
    try {
        const cmpnyId = req.params.id;
        const cmpnyRecord = await cmpnyModel.findById(cmpnyId)
            .populate(['createdby', 'updatedby']);
        if (!cmpnyRecord) {
            return res.status(404).json({ message: "Company record not found" });
        }
        res.status(200).json({
            message: "Company record retrieved successfully",
            data: cmpnyRecord
        });
    } catch (error) {
        console.error("Error retrieving Company record:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const update = async (req, res) => {
    try {
        const cmpnyId = new mongoose.Types.ObjectId(req.query.id) || null;
        const cmpnyPayld = req.body;
        const user = req.user

        if (user) {
            Object.assign(cmpnyPayld, { status: 'Active', updatedby: user?._id });
        }
        const updatedCmpny = await cmpnyModel.findByIdAndUpdate(cmpnyId, cmpnyPayld, { new: true });
        if (!updatedCmpny) {
            return res.status(404).json({ message: "Company record not found" });
        }
        res.status(201).json({
            message: "Company record updated successfully",
            data: updatedCmpny
        });
    } catch (error) {
        console.error("Error updating Company record:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const remove = async (req, res) => {
    try {
        const cmpnyId = new mongoose.Types.ObjectId(req.query.id) || null;
        const deletedCmpny = await cmpnyModel.findByIdAndDelete(cmpnyId);
        if (!deletedCmpny) {
            return res.status(404).json({ message: "Company record not found" });
        }
        res.status(200).json({
            message: "Company record deleted successfully",
            data: deletedCmpny
        });
    } catch (error) {
        console.error("Error deleting Company record:", error);
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