import subcatModel from "../../../models/masters/enquirysetups/subcatModel.js";

const create = async (req, res) => {
    try {
        const subcatPayld = req.body;
        const user = req.user
        const existingSubcat = await subcatModel.findOne({ subcategoryCode: subcatPayld.subcategoryCode });
        if (existingSubcat) {
            return res.status(409).json({ message: "Subcategory code already exists" });
        }
        else {
            Object.assign(subcatPayld, {
                status: 'Active',
                createdby: user?._id
            });
            const subcat = await subcatModel.create(subcatPayld);
            if (!subcat) {
                return res.status(422).json({ message: "Failed to create Subcategory record" });
            } else {
                res.status(201).json({
                    message: "Subcategory record created successfully",
                    data: subcat
                });
            }
        }
    } catch (error) {
        console.error("Error creating Subcategory record:", error);
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
        const subcatRecords = await subcatModel.aggregate(pipeline)

        res.status(200).json({
            message: "Subcategory records retrieved successfully",
            data: subcatRecords
        });
    } catch (error) {
        console.error("Error retrieving Subcategory records:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const readById = async (req, res) => {
    try {
        const subcatId = req.params.id;
        const subcatRecord = await subcatModel.findById(subcatId)
            .populate(['createdby', 'updatedby']);
        if (!subcatRecord) {
            return res.status(404).json({ message: "Subcategory record not found" });
        }
        res.status(200).json({
            message: "Subcategory record retrieved successfully",
            data: subcatRecord
        });
    } catch (error) {
        console.error("Error retrieving Subcategory record:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const update = async (req, res) => {
    try {
        const subcatId = req.params.id;
        const subcatPayld = req.body;
        const user = req.user
        Object.assign(subcatPayld, {
            status: 'Active',
            updatedby: user?._id
        });
        const updatedSubcat = await subcatModel.findByIdAndUpdate(subcatId, subcatPayld, { new: true });
        if (!updatedSubcat) {
            return res.status(404).json({ message: "Subcategory record not found" });
        }
        res.status(201).json({
            message: "Subcategory record updated successfully",
            data: updatedSubcat
        });
    } catch (error) {
        console.error("Error updating Subcategory record:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const remove = async (req, res) => {
    try {
        const subcatId = req.params.id;
        const deletedSubcat = await subcatModel.findByIdAndDelete(subcatId);
        if (!deletedSubcat) {
            return res.status(404).json({ message: "Subcategory record not found" });
        }
        res.status(200).json({
            message: "Subcategory record deleted successfully",
            data: deletedSubcat
        });
    } catch (error) {
        console.error("Error deleting Subcategory record:", error);
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