import sttModel from '../../../models/masters/admin/sttModel.js';

const create = async (req, res) => {
    try {
        const sttPayld = req.body;
        const user = req.user
        const existingStt = await sttModel.findOne({ stateCode: sttPayld.stateCode });
        if (existingStt) {
            return res.status(409).json({ message: "State code already exists" });
        }
        else {
            Object.assign(sttPayld, {
                status: 'Active',
                createdby: user?._id
            });
            const stt = await sttModel.create(sttPayld);
            if (!stt) {
                return res.status(422).json({ message: "Failed to create State record" });
            } else {
                res.status(201).json({
                    message: "State record created successfully",
                    data: stt
                });
            }
        }
    } catch (error) {
        console.error("Error creating State record:", error);
        res.status(500).json({ message: "Internal server error" });
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
            { $sort: { updatedAt: -1 } }
        ]
        const sttRecords = await sttModel.aggregate(pipeline)

        res.status(200).json({
            message: "State records retrieved successfully",
            data: sttRecords
        });
    } catch (error) {
        console.error("Error retrieving State records:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const readById = async (req, res) => {
    try {
        const sttId = req.params.id;
        const sttRecord = await sttModel.findById(sttId)
            .populate(['createdby', 'updatedby']);
        if (!sttRecord) {
            return res.status(404).json({ message: "State record not found" });
        }
        res.status(200).json({
            message: "State record retrieved successfully",
            data: sttRecord
        });
    } catch (error) {
        console.error("Error retrieving State record:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const update = async (req, res) => {
    try {
        const sttId = req.params.id;
        const sttPayld = req.body;
        const user = req.user
        Object.assign(sttPayld, {
            status: 'Active',
            updatedby: user?._id
        });
        const updatedStt = await sttModel.findByIdAndUpdate(sttId, sttPayld, { new: true });
        if (!updatedStt) {
            return res.status(404).json({ message: "State record not found" });
        }
        res.status(201).json({
            message: "State record updated successfully",
            data: updatedStt
        });
    } catch (error) {
        console.error("Error updating State record:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const remove = async (req, res) => {
    try {
        const sttId = req.params.id;
        const deletedStt = await sttModel.findByIdAndDelete(sttId);
        if (!deletedStt) {
            return res.status(404).json({ message: "State record not found" });
        }
        res.status(200).json({
            message: "State record deleted successfully",
            data: deletedStt
        });
    } catch (error) {
        console.error("Error deleting State record:", error);
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