const PlnModel = require('../models/plnModl')

module.exports = {
    create: async (req, res) => {},
    read: async (req, res) => {
        try {
            const Pln = await PlnModel.find()
            res.json({message:`All Plans details Fetched Successfully.`, statuscode:220, data:Pln})
        } catch (error) {
            console.error(error)
        }
    },
    update: async (req, res) => {},
    delete: async (req, res) => {},
}