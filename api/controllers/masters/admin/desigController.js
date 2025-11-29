import desigModel from '../../../models/masters/admin/desigModel.js';

const create = async (req, res) => {
    try {
        const desigPayld = req.body;
        const existingDesig = await desigModel.findOne({ desig_code: desigPayld.desig_code });
        if (existingDesig) {
            return res.status(409).json({ message: "Designation code already exists", statuscode: 409 });
        } else {
            const desig = await desigModel.create(desigPayld);
            if (!desig) {
                return res.status(422).json({ message: "Failed to create Designation record" });
            } else {
                res.status(201).json({
                    message: "Designation record created successfully",
                    statuscode: 201,
                    data: desig
                });
            }
        }
    } catch (error) {
        console.error("Error creating Designation record:", error);
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
        const desigRecords = await desigModel.aggregate(pipeline)
        res.status(200).json({
            message: "Designation records fetched successfully",
            statuscode: 200,
            data: desigRecords
        });
    } catch (error) {
        console.error("Error fetching Designation records:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const readById = async (req, res) => {
    try {
        const desigId = req.params.id;
        const desigRecord = await desigModel.findById(desigId).populate(['createdby', 'updatedby']);
        if (!desigRecord) {
            return res.status(404).json({ message: "Designation record not found", statuscode: 404 });
        }
        res.status(200).json({
            message: "Designation record fetched successfully",
            statuscode: 200,
            data: desigRecord
        });
    } catch (error) {
        console.error("Error fetching Designation record by ID:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const update = async (req, res) => {
    try {
        const desigId = req.params.id;
        const desigPayld = req.body;

        const updatedDesig = await desigModel.findByIdAndUpdate(desigId, desigPayld, { new: true });
        if (!updatedDesig) {
            return res.status(404).json({ message: "Designation record not found", statuscode: 404 });
        }
        res.status(200).json({
            message: "Designation record updated successfully",
            statuscode: 200,
            data: updatedDesig
        });
    } catch (error) {
        console.error("Error updating Designation record:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const remove = async (req, res) => {
    try {
        const desigId = req.params.id;
        const deletedDesig = await desigModel.findByIdAndDelete(desigId);
        if (!deletedDesig) {
            return res.status(404).json({ message: "Designation record not found", statuscode: 404 });
        }
        res.status(200).json({
            message: "Designation record deleted successfully",
            statuscode: 200,
            data: deletedDesig
        });
    } catch (error) {
        console.error("Error deleting Designation record:", error);
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