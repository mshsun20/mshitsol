import acccatModel from "../../../models/masters/accsetups/acccatModel.js";

const create = async (req, res) => {
    try {
        const { cat_name, cat_dtl, cat_lvl, status, createdby, updatedby } = req.body;
        const existingCat = await acccatModel.findOne({ cat_name });
        if (existingCat) {
            return res.status(409).json({ message: 'Account category already exists', data: existingCat });
        }
        else {
            const newCat = await acccatModel.create({
                cat_name,
                cat_dtl,
                cat_lvl,
                status,
                createdby,
                updatedby
            });
            if (newCat) {
                return res.status(201).json({ message: 'Account category created successfully', data: newCat });
            } else {
                return res.status(422).json({ message: 'Account category creation failed' });
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
            { $sort: { updatedAt: -1 } }
        ]
        const cats = await acccatModel.aggregate(pipeline)
        res.status(200).json({ message: 'All account categories retrieved successfully', data: cats })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
const readById = async (req, res) => {
    try {
        const catid = req.params.id
        const cat = await acccatModel.findOne({ _id: catid }).populate('createdby', 'updatedby');
        if (cat) {
            return res.status(200).json({ message: 'Account category retrieved successfully', data: cat });
        } else {
            return res.status(404).json({ message: 'No such account category found' });
        }
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal server error' });
    }
}
const update = async (req, res) => {}
const remove = async (req, res) => {}

export default {
    create,
    read,
    readById,
    update,
    remove
}