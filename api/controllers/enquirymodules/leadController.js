import mongoose from 'mongoose';
import leadModel from '../../models/enquirymodules/leadModel.js';
import asciiGenerator from '../../utilities/asciiGenrator.js';

const create = async (req, res) => {
    try {
        const leadPayld = req.body;
        const user = req.user

        if (user) {
            Object.assign(leadPayld, {
                leadNo: `L${asciiGenerator(String(leadPayld?.firmName) + String(leadPayld?.phone))}`,
                status: 'Open',
                createdby: user?._id
            });
        }
        const existingLead = await leadModel.findOne({ leadNo: leadPayld.leadNo });
        if (existingLead) {
            delete leadPayld.createdby;
            leadPayld.updatedby = user?._id;
            const lead = await leadModel.findOneAndUpdate({ leadNo: leadPayld.leadNo }, leadPayld, { new: true });
            if (!lead) {
                return res.status(422).json({ message: "Failed to update Lead" });
            } else {
                res.status(201).json({
                    message: "Lead details updated successfully",
                    data: lead
                });
            }
        }
        else {
            const lead = await leadModel.create(leadPayld);
            if (!lead) {
                return res.status(422).json({ message: "Failed to create Lead" });
            } else {
                res.status(201).json({
                    message: "Lead details created successfully",
                    data: lead
                });
            }
        }
    } catch (error) {
        console.error("Error creating Lead details:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const read = async (req, res) => {
    try {
        const status = req.query.status || null;
        const matchCondition = {};
        if (status && status !== '') {
            matchCondition.$and = [
                { status: { $regex: `^${status}`, $option: 'i' } }
            ]
        }
        const pipeline = [
            ...Object(status && status !== '' ? [{ $match: matchCondition }] : []),
            { $sort: { updatedAt: -1 } },
            {
                $lookup: {
                    from: 'subcategories',
                    localField: 'subCategory',
                    foreignField: '_id',
                    as: 'subCategory'
                }
            },
            { $unwind: { path: '$subCategory', preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: 'states',
                    localField: 'state',
                    foreignField: '_id',
                    as: 'state'
                }
            },
            { $unwind: { path: '$state', preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: 'products',
                    localField: 'product',
                    foreignField: '_id',
                    as: 'product'
                }
            },
            { $unwind: { path: '$product', preserveNullAndEmptyArrays: true } },

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
        const leadRecords = await leadModel.aggregate(pipeline)

        res.status(200).json({
            message: "Lead details retrieved successfully",
            data: leadRecords
        });
    } catch (error) {
        console.error("Error retrieving Lead details:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const readById = async (req, res) => {
    try {
        const leadId = req.params.id;
        const leadRecord = await leadModel.findById(leadId)
            .populate(['createdby', 'updatedby']);
        if (!leadRecord) {
            return res.status(404).json({ message: "Lead details not found" });
        }
        res.status(200).json({
            message: "Lead details retrieved successfully",
            data: leadRecord
        });
    } catch (error) {
        console.error("Error retrieving Lead details:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const update = async (req, res) => {
    try {
        const leadId = new mongoose.Types.ObjectId(req.query.id) || null;
        const leadPayld = req.body;
        const user = req.user

        if (user) {
            Object.assign(leadPayld, {
                leadNo: `L${asciiGenerator(String(leadPayld?.firmName) + String(leadPayld?.phone))}`,
                status: 'Open',
                updatedby: user?._id
            });
        }
        const updatedLead = await leadModel.findByIdAndUpdate(leadId, leadPayld, { new: true });
        if (!updatedLead) {
            return res.status(404).json({ message: "Lead details not found" });
        }
        res.status(201).json({
            message: "Lead details updated successfully",
            data: updatedLead
        });
    } catch (error) {
        console.error("Error updating Lead details:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const remove = async (req, res) => {
    try {
        const leadId = new mongoose.Types.ObjectId(req.query.id) || null;
        const deletedLead = await leadModel.findByIdAndDelete(leadId);
        if (!deletedLead) {
            return res.status(404).json({ message: "Lead details not found" });
        }
        res.status(200).json({
            message: "Lead details deleted successfully",
            data: deletedLead
        });
    } catch (error) {
        console.error("Error deleting Lead details:", error);
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