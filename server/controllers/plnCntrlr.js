const PlnModel = require('../models/plnModl')

module.exports = {
    create: async (req, res) => {
        console.log(req.body)
        // const {plnnm, plninfo, plncost, plncurr, plnbg} = req.body

        // try {
        //     const Plnexst = await PlnModel.findOne({plnnm})

        //     if (Plnexst) {
        //         res.json({error:`Plan Already Exists...!`, statuscode:422})
        //     }
        //     else {
        //         const Pln = await PlnModel.create({plnnm, plninfo, plncost, plncurr, plnbg})
        //         if (Pln) {
        //             res.json({success:`Plan Added Successfully.`, statuscode:220})
        //         }
        //         else {
        //             res.json({error:`Plan data Adding Failed...!`, statuscode:423})
        //         }
        //     }
        // } catch (error) {
        //     console.error(error)
        // }
    },
    read: async (req, res) => {
        try {
            const Pln = await PlnModel.find().populate({path:'plncurr'})
            res.json({message:`All Plans details Fetched Successfully.`, statuscode:220, data:Pln})
        } catch (error) {
            console.error(error)
        }
    },
    update: async (req, res) => {},
    delete: async (req, res) => {},
}