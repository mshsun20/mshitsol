import deptModel from "../../../models/masters/admin/deptModel.js";

const create = async (req, res) => {
    try {
        const deptPayld = req.body;
        const existingDept = await deptModel.findOne({ dept_code: deptPayld.dept_code });
        if (existingDept) {
            return res.status(409).json({ message: "Department code already exists", statuscode: 409 });
        } else {
            const dept = await deptModel.create(deptPayld);
            if (!dept) {
                return res.status(422).json({ message: "Failed to create Department record" });
            } else {
                res.status(201).json({
                    message: "Department record created successfully",
                    statuscode: 201,
                    data: dept
                });
            }
        }
    } catch (error) {
        console.error("Error creating Department record:", error);
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
        const deptRecords = await deptModel.aggregate(pipeline)
        res.status(200).json({
            message: "Department records fetched successfully",
            statuscode: 200,
            data: deptRecords
        });
    } catch (error) {
        console.error("Error fetching Department records:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const readById = async (req, res) => {
    try {
        const deptId = req.params.id;
        const deptRecord = await deptModel.findById(deptId).populate(['createdby', 'updatedby']);
        if (!deptRecord) {
            return res.status(404).json({ message: "Department record not found", statuscode: 404 });
        }
        res.status(200).json({
            message: "Department record fetched successfully",
            statuscode: 200,
            data: deptRecord
        });
    } catch (error) {
        console.error("Error fetching Department record by ID:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const update = async (req, res) => {
    try {
        const deptId = req.params.id;
        const deptPayld = req.body;
        const updatedDept = await deptModel.findByIdAndUpdate(deptId, deptPayld, { new: true });
        if (!updatedDept) {
            return res.status(404).json({ message: "Department record not found", statuscode: 404 });
        }
        res.status(200).json({
            message: "Department record updated successfully",
            statuscode: 200,
            data: updatedDept
        });
    } catch (error) {
        console.error("Error updating Department record:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const remove = async (req, res) => {
    try {
        const deptId = req.params.id;
        const deletedDept = await deptModel.findByIdAndDelete(deptId);
        if (!deletedDept) {
            return res.status(404).json({ message: "Department record not found", statuscode: 404 });
        }
        res.status(200).json({
            message: "Department record deleted successfully",
            statuscode: 200
        });
    } catch (error) {
        console.error("Error deleting Department record:", error);
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