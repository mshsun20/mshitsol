const FeatrModel = require('../models/featrModl')

module.exports = {
    create: async (req, res) => {},
    read: async (req, res) => {
        try {
            const Featr = await FeatrModel.find()
            res.json({message:`All Features details Fetched Successfully.`, statuscode:220, data:Featr})
        } catch (error) {
            console.error(error)
        }
    },
    update: async (req, res) => {},
    delete: async (req, res) => {},
}