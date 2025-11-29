import mongoose from "mongoose";
import funcModel from "../../../models/adminmgmt/function/funcModel.js";

const create = async (req, res) => {
    try {
        const funcData = req.body;
        const user = req.user;
        // console.log(funcData)

        const funcBase = {
            func_code: funcData.func_code,
            func_name: funcData.func_name,
            func_path: funcData.func_path,
            func_icon: funcData.func_icon,
            func_query: funcData.func_query,
            status: funcData.status || 'Active',
        }

        const existingFunc = await funcModel.findOne({ func_code: funcData.func_code })
        if (existingFunc) {
            funcBase.updatedby = user?._id || funcData.updatedby;
            const updtPipeline = [{ $set: funcBase }]
            const updtFunc = await funcModel.updateOne({ _id: existingFunc._id }, updtPipeline, { new: true });
            if (!updtFunc || updtFunc.modifiedCount === 0) {
                return res.status(422).json({ message: "Failed to update Function details" });
            }
            else {
                return res.status(201).json({ message: "Function details updated successfully", data: updtFunc });
            }
        }
        else {
            funcBase.createdby = user?._id || funcData.createdby;
            const newFunc = await funcModel.create(funcBase);
            res.status(201).json({ message: "Function details created successfully", data: newFunc });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const read = async (req, res) => {
    try {
        const status = req.query.status || '';
        const path = (req.query.path || '').toLowerCase();   // <-- default empty (means no filtering)
        const srch = req.query.search?.trim() || '';

        const matchStage = { $and: [] };
        if (srch) {
            matchStage.$and = [
                { func_code: { $regex: srch, $options: 'i' } },
                { func_name: { $regex: srch, $options: 'i' } }
            ]
        }

        // 🔹 Add status filter if provided
        if (status) {
            matchStage.$and.push({ status: { $regex: `^${status}$`, $options: 'i' } });
        }

        // 🔹 Add path filter if provided
        if (path === 'yes') {
            matchStage.$and.push({
                func_path: { $exists: true, $ne: "" }
            });
        } else if (path === 'no') {
            matchStage.$and.push({
                $or: [
                    { func_path: { $exists: false } },
                    { func_path: null },
                    { func_path: "" }
                ]
            });
        }

        if (matchStage.$and.length === 0) delete matchStage.$and;

        const pipeline = [
            { $lookup: { from: 'accounts', localField: 'createdby', foreignField: '_id', as: 'createdby' } },
            { $unwind: { path: '$createdby', preserveNullAndEmptyArrays: true } },
            { $lookup: { from: 'accounts', localField: 'updatedby', foreignField: '_id', as: 'updatedby' } },
            { $unwind: { path: '$updatedby', preserveNullAndEmptyArrays: true } },
            { $match: matchStage },
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
            { $sort: { updatedAt: -1 } }
        ];

        const functions = await funcModel.aggregate(pipeline);
        // console.log(functions);
        return res.status(200).json({
            message: "Form functions fetched successfully",
            data: functions
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const readById = async (req, res) => {
    try {
        const { id } = req.params;
        const func = await funcModel.findById(id);
        if (!func) {
            return res.status(404).json({ message: "Function not found" });
        }
        res.status(200).json({ message: "Function details fetched successfully.", data: func });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const update = async (req, res) => {
    try {
        const id = new mongoose.Types.ObjectId(req.query.id) || null;
        const status = req.query.status?.replace(/\b\w/g, c => c.toUpperCase()) || ''
        const funcData = req.body;

        if (status) {
            funcData.status = status === 'Active' ? 'Inactive' : 'Active'
        }
        const updatedFunc = await funcModel.updateOne({ _id: id }, funcData, { new: true });
        if (!updatedFunc) {
            return res.status(404).json({ message: "Function not found" });
        }
        res.status(201).json({ message: "Function details updated successfully", data: updatedFunc });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const remove = async (req, res) => {
    try {
        const id = new mongoose.Types.ObjectId(req.query.id) || null;
        const deletedFunc = await funcModel.findByIdAndDelete(id);
        if (!deletedFunc) {
            return res.status(404).json({ message: "Function not found" });
        }
        res.status(200).json({ message: "Function deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export default {
  create,
  read,
  readById,
  update,
  remove
};