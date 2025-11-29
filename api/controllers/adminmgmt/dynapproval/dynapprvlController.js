import mongoose from "mongoose";
import dynapprvlModel from "../../../models/adminmgmt/dynapproval/dynapprvlModel.js";

const create = async (req, res) => {
    try {
        const dynapprvlPayld = req.body;
        const user = req.user;
        
        if (mongoose.Types.ObjectId.isValid(dynapprvlPayld.apprvl_func)) {
            dynapprvlPayld.apprvl_func = new mongoose.Types.ObjectId(dynapprvlPayld.apprvl_func)
        }
        // console.log(dynapprvlPayld);
        const existingDynapprvl = await dynapprvlModel.findOne({ apprvl_func: dynapprvlPayld.apprvl_func, apprvl_creator_base: dynapprvlPayld.apprvl_creator_base });

        dynapprvlPayld.apprvr_dtl = dynapprvlPayld.apprvr_dtl?.filter(elm => elm?.apprvr?.length > 0)?.map((elm, i) => ({
            apprvl_lvl: i+1, apprvr: elm?.apprvr
        }))
        // console.log(dynapprvlPayld.apprvr_dtl);
        if (!existingDynapprvl) {
            if (dynapprvlPayld.apprvr_dtl?.length === 0) return res.status(404).json({ message: "No Approver selected yet !" });
            else {
                dynapprvlPayld.createdby = user?._id;
                const dynapprvl = await dynapprvlModel.create(dynapprvlPayld);
                if (!dynapprvl) {
                    return res.status(404).json({ message: "Failed to create Dynamic Approval record" });
                } else {
                    res.status(201).json({
                        message: "Dynamic Approval record created successfully",
                        data: dynapprvl,
                    });
                }
            }
        }
        else {
            if (dynapprvlPayld.apprvr_dtl?.length === 0) {
                const deletedDynapprvl = await dynapprvlModel.findByIdAndDelete(existingDynapprvl._id);
                if (!deletedDynapprvl) {
                    return res.status(404).json({ message: "Failed to remove existing Dynamic Approval record" });
                }
                res.status(201).json({
                    message: "Existing dynamic Approval record removed successfully",
                    data: deletedDynapprvl,
                });
            }
            else {
                delete dynapprvlPayld?.apprvl_code
                delete dynapprvlPayld?.apprvl_func
                dynapprvlPayld.updatedby = user?._id
                const updatedDynapprvl = await dynapprvlModel.findOneAndUpdate({ _id: existingDynapprvl._id }, dynapprvlPayld, { new: true });
                if (!updatedDynapprvl) {
                    return res.status(404).json({ message: "Failed to update existing Dynamic Approval record" });
                }
                res.status(201).json({
                    message: "Existing Dynamic Approval record updated successfully",
                    data: updatedDynapprvl,
                });
            }
        }
    } catch (error) {
        console.error("Error creating Dynamic Approval record:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const read = async (req, res) => {
    try {
        const funcId = String(req.query.fnid || '').trim();
        const cBase = String(req.query.cbase || '').trim();

        // Check if funcId is a valid ObjectId
        const isValidObjectId = mongoose.Types.ObjectId.isValid(funcId);

        const matchFunc = {};
        if (funcId.length > 0) {
            if (isValidObjectId) {
                matchFunc['apprvl_func._id'] = new mongoose.Types.ObjectId(funcId);
            } else {
                matchFunc['apprvl_func.func_code'] = { $regex: `^${funcId}$`, $options: 'i' };
            }
        }

        const dynapprvlRecords = await dynapprvlModel.aggregate([
            ...(cBase ? [{ $match: { apprvl_creator_base: { $regex: `^${cBase}`, $options: 'i' } } }] : []),

            // Populate apprvl_func (Function)
            {
                $lookup: {
                    from: 'functions',
                    localField: 'apprvl_func',
                    foreignField: '_id',
                    as: 'apprvl_func'
                }
            },
            { $unwind: '$apprvl_func' },

            // ✅ Dynamic filter by funcId (either ObjectId or func_code)
            ...(Object.keys(matchFunc).length ? [{ $match: matchFunc }] : []),

            // Populate createdby
            {
                $lookup: {
                    from: 'accounts',
                    localField: 'createdby',
                    foreignField: '_id',
                    as: 'createdby'
                }
            },
            { $unwind: { path: '$createdby', preserveNullAndEmptyArrays: true } },

            // Populate updatedby
            {
                $lookup: {
                    from: 'accounts',
                    localField: 'updatedby',
                    foreignField: '_id',
                    as: 'updatedby'
                }
            },
            { $unwind: { path: '$updatedby', preserveNullAndEmptyArrays: true } },

            // Step 1: Unwind apprvr_dtl
            {
                $unwind: {
                    path: '$apprvr_dtl',
                    preserveNullAndEmptyArrays: true
                }
            },
            // Step 2: Lookup all apprvr accounts
            {
                $lookup: {
                    from: 'accounts',
                    localField: 'apprvr_dtl.apprvr',
                    foreignField: '_id',
                    as: 'apprvr_dtl.apprvr'
                }
            },
            {
                $addFields: {
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

            // Step 3: Group back apprvr_dtl into array
            {
                $group: {
                    _id: '$_id',
                    apprvl_code: { $first: '$apprvl_code' },
                    apprvl_func: { $first: '$apprvl_func' },
                    apprvl_creator_base: { $first: '$apprvl_creator_base' },
                    status: { $first: '$status' },
                    createdby: { $first: '$createdby' },
                    updatedby: { $first: '$updatedby' },
                    createdAt: { $first: '$createdAt' },
                    updatedAt: { $first: '$updatedAt' },
                    createdAtITC: { $first: '$createdAtITC' },
                    updatedAtITC: { $first: '$updatedAtITC' },
                    apprvr_dtl: {
                        $push: {
                            apprvl_lvl: '$apprvr_dtl.apprvl_lvl',
                            apprvr: '$apprvr_dtl.apprvr'
                        }
                    }
                }
            },
            { $sort: { updatedAt: -1 } }
        ]);

        res.status(200).json({
            message: 'Dynamic Approval records retrieved successfully',
            data: dynapprvlRecords,
        });
    } catch (error) {
        console.error('Error retrieving Dynamic Approval records:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


const readById = async (req, res) => {
    try {
        const dynapprvlId = req.params.id;
        const dynapprvlRecord = await dynapprvlModel.findById(dynapprvlId)
            .populate(['apprvl_func', { path: 'apprvr_dtl', populate: 'apprvr'}, 'createdby', 'updatedby']);
        if (!dynapprvlRecord) {
            return res.status(404).json({ message: "Dynamic Approval record not found" });
        }
        res.status(200).json({
            message: "Dynamic Approval record retrieved successfully",
            data: dynapprvlRecord,
        });
    } catch (error) {
        console.error("Error retrieving Dynamic Approval record:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const update = async (req, res) => {
    try {
        const dynapprvlId = req.params.id;
        const dynapprvlPayld = req.body;
        const user = req.user

        delete dynapprvlPayld?._id
        delete dynapprvlPayld?.apprvl_code
        delete dynapprvlPayld?.apprvl_func
        delete dynapprvlPayld?.createdby
        delete dynapprvlPayld?.createdAt
        delete dynapprvlPayld?.updatedAt
        delete dynapprvlPayld?.createdAtITC
        delete dynapprvlPayld?.updatedAtITC
        dynapprvlPayld.status = 'Active'
        dynapprvlPayld.updatedby = user?._id
        console.log(dynapprvlPayld);

        const updatedDynapprvl = await dynapprvlModel.findByIdAndUpdate(dynapprvlId, dynapprvlPayld, { new: true });
        if (!updatedDynapprvl) {
            return res.status(404).json({ message: "Dynamic Approval record not found" });
        }
        res.status(201).json({
            message: "Dynamic Approval record updated successfully",
            data: updatedDynapprvl,
        });
    } catch (error) {
        console.error("Error updating Dynamic Approval record:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const statusUpdt = async (req, res) => {
    try {
        const dynapprvlId = req.params.id;
        const { status } = req.body;
        const updatedDynapprvl = await dynapprvlModel.findByIdAndUpdate(dynapprvlId, { status }, { new: true });
        if (!updatedDynapprvl) {
            return res.status(404).json({ message: "Dynamic Approval record not found" });
        }
        res.status(200).json({
            message: "Dynamic Approval status updated successfully",
            data: updatedDynapprvl,
        });
    } catch (error) {
        console.error("Error updating Dynamic Approval status:", error);
        res.status(500).json({ message: "Internal server error" });        
    }
}

const remove = async (req, res) => {
    try {
        const dynapprvlId = req.params.id;
        const deletedDynapprvl = await dynapprvlModel.findByIdAndDelete(dynapprvlId);
        if (!deletedDynapprvl) {
            return res.status(404).json({ message: "Dynamic Approval record not found" });
        }
        res.status(200).json({
            message: "Dynamic Approval record deleted successfully",
            data: deletedDynapprvl,
        });
    } catch (error) {
        console.error("Error deleting Dynamic Approval record:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export default {
    create,
    read,
    readById,
    read,
    update,
    statusUpdt,
    remove
};