import accModel from '../models/accModel.js';
import acctypModel from '../models/masters/accsetups/acctypModel.js';
// import cloudinary from '../libraries/cloudinary.js';
import { hashPassword } from '../utilities/hashPassword.js';
import dataPagination from '../utilities/dataPagination.js';
import moment from 'moment';
import mongoose from 'mongoose';


const create = async (req, res) => {
    const accPayload = req.body
    console.log(accPayload);
    const {
        acc_uname, acc_pass, acc_eml, acc_phn, acc_fname, acc_secphn, acc_typ, acc_comp, acc_emp_code,
        acc_addrss, acc_pan, acc_gst, acc_dob, acc_anniversary, acc_status
    } = accPayload;
    const user = req.user
    const hashpass = hashPassword(acc_pass);

    try {
        const Accexst = await accModel.findOne({ acc_uname })
        .populate([ 'acc_typ', 'createdby', 'updatedby' ]);

        if (Accexst) {
            res.status(409).json({ message: 'Account already exists!', statuscode: 409, data: Accexst });
        }

        Object.assign(accPayload, { createdby: user?._id })
        const Acc = await accModel.create({
            acc_uname, acc_pass:hashpass, acc_pass_bckup:acc_pass, acc_eml, acc_phn, acc_fname, acc_secphn, acc_typ, acc_comp,
            acc_emp_code, acc_addrss, acc_pan, acc_gst, acc_dob, acc_anniversary, acc_status, createdby: accPayload.createdby
        });

        if (Acc) {
            res.status(201).json({ message: 'Account created successfully.', statuscode: 201, data: Acc });
        }
        else {
            res.status(500).json({ message: 'Account creation failed!', statuscode: 500 });
        }
    } catch (error) {
        console.error(error);
    }
};

const upload = async (req, res) => {
    try {
        const accPayload = req.body
        const user = req.user
        const resfl = accPayload

        if (!accPayload || !Array.isArray(accPayload) || accPayload.length === 0) {
            return res.status(400).json({ message: "Invalid or empty data" });
        }
        else {
            for (let i=0; i < accPayload.length; i++) {
                const accData = accPayload[i]
                const exstngAcctyp = await acctypModel.findOne({ typname: accData.type })
                if (!exstngAcctyp) {
                    resfl[i].upload_status = 'Error'
                    resfl[i].upload_message = `Account Type: "${accData.type}" does not exist`
                }
                else {
                    const exstngAcc = await accModel.findOne({ acc_uname: accData.username })
                    if (!exstngAcc) {
                        const newAcc = await accModel.create({
                            acc_uname: accData.username,
                            acc_pass: hashPassword(accData.password),
                            acc_pass_bckup: accData.password,
                            acc_eml: accData.email,
                            acc_phn: accData.phone,
                            acc_fname: accData.fullname,
                            acc_typ: exstngAcctyp._id,
                            acc_comp: accData.company,
                            acc_emp_code: accData.employeecode,
                            acc_status: 'Active',
                            createdby: user._id,
                            creation_dt: String(moment().format('DD/MM/YYYY')),
                            creation_tm: String(moment().format('hh:mm:ss a'))
                        })
                        if (newAcc) {
                            resfl[i].upload_status = 'Success'
                            resfl[i].upload_message = 'Created Successfully'
                        }
                        else {
                            resfl[i].upload_status = 'Error'
                            resfl[i].upload_message = 'Failed to Upload'
                        }
                    }
                    else {
                        const updtdAcc = await accModel.updateOne({ acc_uname: accData.username }, {
                            acc_eml: accData.email,
                            acc_phn: accData.phone,
                            acc_fname: accData.fullname,
                            acc_comp: accData.company,
                            acc_emp_code: accData.employeecode,
                            acc_status: 'Active',
                            updatedby: user._id,
                            update_dt: String(moment().format('DD/MM/YYYY')),
                            update_tm: String(moment().format('hh:mm:ss a'))
                        }, { new: true })
                        if (updtdAcc) {
                            resfl[i].upload_status = 'Success'
                            resfl[i].upload_message = 'Updated Successfully'
                        }
                        else {
                            resfl[i].upload_status = 'Error'
                            resfl[i].upload_message = 'Failed to Upload'
                        }
                    }
                }
            }
            if (resfl || resfl.length > 0) {
                return res.status(201).json({ message: 'Upload Summery', statuscode: 201, resfl })
            }
            else {
                return res.status(422).json({ message: 'Upload Issue Summery', statuscode: 422 })
            }
        }
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal Server Error', statuscode: 500 })
    }
}

const read = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 50;
        const search = req.query.search || '';
        const typeLower = req.query.typel || 0;
        const typeHigher = req.query.typeh || 0;

        const searchCriteria = {};
        if (search) {
            searchCriteria.$or = [
                { acc_fname: { $regex: search || '', $options: 'i' } },
                { acc_uname: { $regex: search || '', $options: 'i' } },
                { acc_eml: { $regex: search || '', $options: 'i' } },
                { acc_phn: { $regex: search || '', $options: 'i' } },
                { 'acc_typ.typname': { $regex: search || '', $options: 'i' } }
            ];
        }
        if (typeLower && typeHigher) {
            searchCriteria['acc_typ.heirarchy'] = { 
                $gte: parseInt(typeLower), 
                $lte: parseInt(typeHigher) 
            };
        }
        const population = [
            { $lookup: { from: 'accounttypes', localField: 'acc_typ', foreignField: '_id', as: 'acc_typ' } },
            { $unwind: { path: '$acc_typ', preserveNullAndEmptyArrays: true } },
            { $lookup: { from: 'accounts', localField: 'createdby', foreignField: '_id', as: 'createdby' } },
            { $unwind: { path: '$createdby', preserveNullAndEmptyArrays: true } },
            { $lookup: { from: 'accounts', localField: 'updatedby', foreignField: '_id', as: 'updatedby' } },
            { $unwind: { path: '$updatedby', preserveNullAndEmptyArrays: true } },
            ...(Object.keys(searchCriteria).length > 0 ? [{ $match: searchCriteria }] : []),
            { $addFields: {
                createdAtITC: { $dateToString: { format: "%d-%m-%Y %H:%M:%S", date: '$createdAt', timezone: "+05:30" } },
                updatedAtITC: { $dateToString: { format: "%d-%m-%Y %H:%M:%S", date: '$updatedAt', timezone: "+05:30" } }
            }}
        ]
        const sortingDetails = {
            fieldName: 'updatedAt',
            sortType: 'descending',
        }
        const { filteredData: Acc = [], totalCount = 0, hasMore = false } = await dataPagination( accModel, page, limit, population, sortingDetails );

        res.status(202).json({
            message: 'All Accounts data fetched successfully.',
            statuscode: 202,
            data: { Acc, totalCount, hasMore, page }
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server error', statuscode: 500 });
    }
};

const readById = async (req, res) => {
    try {
        const accid = req.params.id;
        const Acc = await accModel.findOne({ _id: accid })
        .populate([ 'acc_typ', 'createdby', 'updatedby' ]);

        if (Acc) {
            res.status(202).json({ message: 'Account data fetched successfully.', statuscode: 202, data: Acc });
        }
        else {
            res.status(404).json({ message: 'Account not found!', statuscode: 404 });
        }
    } catch (error) {
        console.error(error);
    }
};

const readLowrHierarchy = async (req, res) => {
    try {
        const acctypid = req.params.acctypid;

        const selectedType = await acctypModel.findById(acctypid).select('heirarchy');
        if (!selectedType) {
            return res.status(404).json({ message: 'Account type not found!', statuscode: 404 });
        }

        const selectedHeirarchy = selectedType.heirarchy;

        const pipeln = [
            { $lookup: { from: 'accounttypes', localField: 'acc_typ', foreignField: '_id', as: 'acc_typ' } },
            { $unwind: { path: '$acc_typ', preserveNullAndEmptyArrays: true } },
            { $match: { 'acc_typ.heirarchy': { $gte: selectedHeirarchy } } },
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
            { $sort: { updatedAt: -1 }}
        ]

        const accDta = await accModel.aggregate(pipeln);
        if (accDta.length > 0) {
            res.status(202).json({ message: 'Accounts with lower hierarchy fetched successfully.', statuscode: 202, data: accDta });
        } else {
            res.status(404).json({ message: 'No accounts found with lower hierarchy!', statuscode: 404 });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', statuscode: 500 });        
    }
}

const update = async (req, res) => {
    const accid = new mongoose.Types.ObjectId(req.query.id) || null;
    const accPayload = req.body
    const {
        acc_eml, acc_phn, acc_fname, acc_secphn, acc_comp, acc_emp_code,
        acc_lvl, acc_addrss, acc_pan, acc_gst, acc_dob, acc_anniversary, acc_status
    } = req.body;
    const user = accPayload
    // const filepath = req.file?.path;

    try {
        const Accexst = await accModel.findOne({ _id: accid })
        .populate([ 'acc_typ', 'createdby', 'updatedby' ]);

        if (Accexst) {
            const Accupdt = await accModel.findByIdAndUpdate(accid, {
                acc_eml, acc_phn, acc_fname, acc_secphn, acc_comp, acc_emp_code, acc_lvl, acc_addrss,
                acc_pan, acc_gst, acc_dob, acc_anniversary, acc_status, updatedby: user._id, updated_dt: moment().format('DD/MM/YYYY'),
                updated_tm: moment().format('hh:mm:ss a')
            }, { new: true });

            if (Accupdt) {
                res.status(201).json({ message: 'Account updated successfully.', statuscode: 201, data: Accupdt });
            }
            else {
                res.status(500).json({ message: 'Account update failed..!', statuscode: 500 });
            }
        }
    } catch (error) {
        console.error(error);
    }
};

const remove = async (req, res) => {
    try {
        const accid = new mongoose.Types.ObjectId(req.query.id) || null;
        // console.log(accid);
        const deletedAcc = await accModel.findByIdAndDelete(accid);
        if (!deletedAcc) {
            return res.status(404).json({ message: "Policy Type details not found" });
        }
        res.status(200).json({
            message: "Policy Type details deleted successfully",
            data: deletedAcc
        });
    } catch (error) {
        console.error("Error deleting Policy Type details:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export default {
    create,
    upload,
    read,
    readById,
    readLowrHierarchy,
    update,
    remove
};