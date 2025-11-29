import mongoose from "mongoose";
import accModel from "../../../models/accModel.js";
import acctypModel from "../../../models/masters/accsetups/acctypModel.js";

const create = async (req, res) => {
    try {
        const typPayload = req.body;
        console.log(typPayload);
        const user = req.user

        if (user) {
            Object.assign(typPayload, { status: 'Active', createdby: user?._id });
        }
        const existingType = await acctypModel.findOne({ typname: typPayload.typname });
        if (existingType) {
            return res.status(409).json({ message: 'Account type already exists', data: existingType });
        }
        else {
            const newType = await acctypModel.create(typPayload);
            if (newType) {
                return res.status(201).json({ message: 'Account type created successfully', data: newType });
            } else {
                return res.status(400).json({ message: 'Account type creation failed' });
            }
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });        
    }
}
const read = async (req, res) => {
    try {
        const pipeline = [
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
            }},
            { $sort: { createdAt: -1 } }
        ]
        const types = await acctypModel.aggregate(pipeline)
        if (types?.length > 0) {
            return res.status(200).json({ message: 'All account types retrieved successfully', data: types });
        } else {
            return res.status(404).json({ message: 'No account types found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
const readById = async (req, res) => {
    try {
        const typid = req.params.id
        const type = await acctypModel.findOne({ _id: typid }).populate('createdby', 'updatedby');
        if (type) {
            return res.status(200).json({ message: 'Account type retrieved successfully', data: type });
        } else {
            return res.status(404).json({ message: 'No such account type found' });
        }
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal server error' });
    }
}
const readLowrHierarchy = async (req, res) => {
    try {
        const user = req.user;
        const usrDtls = await accModel.findById(user._id).populate('acc_typ');
        if (!usrDtls) {
            return res.status(404).json({ message: 'User not found' });
        }
        const selectedHeirarchy = usrDtls.acc_typ.heirarchy;

        const pipeln = [
            { $match: { heirarchy: { $gte: selectedHeirarchy } } },
        ]
        const acctypDta = await acctypModel.aggregate(pipeln);
        if (acctypDta?.length > 0) {
            return res.status(200).json({ message: 'Account types with lower hierarchy retrieved successfully', data: acctypDta });
        }
        else {
            return res.status(404).json({ message: 'No account types found with lower hierarchy' });
        }
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal server error' });
    }
}
const update = async (req, res) => {
    try {
        const typid = new mongoose.Types.ObjectId(req.query.id) || null
        const typPayload = req.body
        const user = req.user

        if (user) {
            Object.assign(typPayload, { status: 'Active', updatedby: user?._id });
        }
        const typUpdt = await acctypModel.findByIdAndUpdate(typid, typPayload, { new: true })
        if (!typUpdt) {
            return res.status(404).json({ message: "Account type not found" });
        }
        res.status(201).json({ message: "Account type updated successfully", data: typUpdt });
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal server error' });
    }
}
const remove = async (req, res) => {
    try {
        const typid = new mongoose.Types.ObjectId(req.query.id) || null
        const typRmv = await acctypModel.findByIdAndDelete(typid)
        if (!typRmv) {
            return res.status(404).json({ message: "Account type not found" });
        }
        res.status(200).json({ message: "Account type removed successfully", data: typRmv });
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal server error' });
    }
}

export default {
    create,
    read,
    readById,
    readLowrHierarchy,
    update,
    remove
}