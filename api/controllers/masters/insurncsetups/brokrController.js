import mongoose from 'mongoose';
import brokrModel from '../../../models/masters/insurncsetups/brokrModel.js';
import asciiGenerator from '../../../utilities/asciiGenrator.js';

const create = async (req, res) => {
    try {
        const brokrPayld = req.body;
        const user = req.user

        if (user) {
            Object.assign(brokrPayld, {
                brokerCode: `BROKER${asciiGenerator(brokrPayld?.brokerName)}`,
                status: 'Active',
                createdby: user?._id
            });
        }
        const existingBrokr = await brokrModel.findOne({ brokerCode: brokrPayld.brokerCode });
        if (existingBrokr) {
            return res.status(409).json({ message: "Broker details already exists" });
        }
        else {
            const brokr = await brokrModel.create(brokrPayld);
            if (!brokr) {
                return res.status(422).json({ message: "Failed to create Broker" });
            } else {
                res.status(201).json({
                    message: "Broker details created successfully",
                    data: brokr
                });
            }
        }
    } catch (error) {
        console.error("Error creating Broker details:", error);
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
        const brokrRecords = await brokrModel.aggregate(pipeline)

        res.status(200).json({
            message: "Broker details retrieved successfully",
            data: brokrRecords
        });
    } catch (error) {
        console.error("Error retrieving Broker details:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const readById = async (req, res) => {
    try {
        const brokrId = req.params.id;
        const brokrRecord = await brokrModel.findById(brokrId)
            .populate(['createdby', 'updatedby']);
        if (!brokrRecord) {
            return res.status(404).json({ message: "Broker details not found" });
        }
        res.status(200).json({
            message: "Broker details retrieved successfully",
            data: brokrRecord
        });
    } catch (error) {
        console.error("Error retrieving Broker details:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const update = async (req, res) => {
    try {
        const brokrId = new mongoose.Types.ObjectId(req.query.id) || null;
        const brokrPayld = req.body;
        const user = req.user

        if (user) {
            Object.assign(brokrPayld, {
                brokerCode: `BROKER${String(brokrPayld?.brokerName).replace(/\d/gi, '').toLowerCase()}`,
                status: 'Active',
                updatedby: user?._id
            });
        }
        const updatedBrokr = await brokrModel.findByIdAndUpdate(brokrId, brokrPayld, { new: true });
        if (!updatedBrokr) {
            return res.status(404).json({ message: "Broker details not found" });
        }
        res.status(201).json({
            message: "Broker details updated successfully",
            data: updatedBrokr
        });
    } catch (error) {
        console.error("Error updating Broker details:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const remove = async (req, res) => {
    try {
        const brokrId = new mongoose.Types.ObjectId(req.query.id) || null;
        const deletedBrokr = await brokrModel.findByIdAndDelete(brokrId);
        if (!deletedBrokr) {
            return res.status(404).json({ message: "Broker details not found" });
        }
        res.status(200).json({
            message: "Broker details deleted successfully",
            data: deletedBrokr
        });
    } catch (error) {
        console.error("Error deleting Broker details:", error);
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