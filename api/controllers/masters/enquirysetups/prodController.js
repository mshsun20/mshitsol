import prodModel from "../../../models/masters/enquirysetups/prodModel.js";

const create = async (req, res) => {
    try {
        const prodPayld = req.body;
        const user = req.user

        const existingProd = await prodModel.findOne({ productCode: prodPayld.productCode });
        if (existingProd) {
            return res.status(409).json({ message: "Product code already exists" });
        }
        else {
            Object.assign(prodPayld, {
                status: 'Active',
                createdby: user?._id
            });
            console.log(prodPayld);
            const prod = await prodModel.create(prodPayld);
            if (!prod) {
                return res.status(422).json({ message: "Failed to create Product record" });
            } else {
                res.status(201).json({
                    message: "Product record created successfully",
                    data: prod
                });
            }
        }
    } catch (error) {
        console.error("Error creating Product record:", error);
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
        const prodRecords = await prodModel.aggregate(pipeline)

        res.status(200).json({
            message: "Product records retrieved successfully",
            data: prodRecords
        });
    } catch (error) {
        console.error("Error retrieving Product records:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const readById = async (req, res) => {
    try {
        const prodId = req.params.id;
        const prodRecord = await prodModel.findById(prodId)
            .populate(['createdby', 'updatedby']);
        if (!prodRecord) {
            return res.status(404).json({ message: "Product record not found" });
        }
        res.status(200).json({
            message: "Product record retrieved successfully",
            data: prodRecord
        });
    } catch (error) {
        console.error("Error retrieving Product record:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const update = async (req, res) => {
    try {
        const prodId = req.params.id;
        const prodPayld = req.body;
        const user = req.user
        Object.assign(prodPayld, {
            status: 'Active',
            updatedby: user?._id
        });
        const updatedProd = await prodModel.findByIdAndUpdate(prodId, prodPayld, { new: true });
        if (!updatedProd) {
            return res.status(404).json({ message: "Product record not found" });
        }
        res.status(201).json({
            message: "Product record updated successfully",
            data: updatedProd
        });
    } catch (error) {
        console.error("Error updating Product record:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const remove = async (req, res) => {
    try {
        const prodId = req.params.id;
        const deletedProd = await prodModel.findByIdAndDelete(prodId);
        if (!deletedProd) {
            return res.status(404).json({ message: "Product record not found" });
        }
        res.status(200).json({
            message: "Product record deleted successfully",
            data: deletedProd
        });
    } catch (error) {
        console.error("Error deleting Product record:", error);
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