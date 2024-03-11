const CntrymModel = require('../models/cntrymModl')

module.exports = {
    create: async (req, res) => {
        const {cntrycode, cntrynm, cntryinfo} = req.body

        try {
            const Cntryexst = await CntrymModel.findOne({cntrynm})
            if (!Cntryexst) {
                const Cntry = await CntrymModel.create({cntrycode, cntrynm, cntryinfo})
                if (Cntry) {
                    res.json({success:`Country Added Successfully.`, statuscode:220})
                }
                else {
                    res.json({error:`Country data Adding Failed...!`, statuscode:422})
                }
            }
            else {
                res.json({error:`Country data Already Exist...!`, statuscode:423})
            }
        } catch (error) {
            console.error(error)
        }
    },
    upload: async (req, res) => {
        // console.log(req.body.exclData)
        const excldta = req.body.exclData
        // let flag = 0

        try {
            excldta.forEach(async (item) => {
                const {country_code, country_name, country_info} = item
                const Cntrym = await CntrymModel.findOne({cntrynm:country_name})
                if (!Cntrym) {
                    const Cntry = await CntrymModel.create(
                        {
                            cntrycode:country_code,
                            cntrynm:country_name,
                            cntryinfo:country_info
                        }
                    )
                    // if (Cntry) {
                    //     flag = 1
                    // }
                }
                else {
                    const Cntry = await CntrymModel.findOneAndUpdate({cntrynm:country_name},
                        {
                            cntrycode:(country_code&&country_code),
                            cntryinfo:(country_info&&country_info)
                        }
                    )
                    // if (Cntry) {
                    //     flag = 1
                    // }
                }
            })
            res.json({message:`Country data Imported...`, statuscode:220})
            // if (flag === 1) {
            //     res.json({success:`Country Added Successfully.`, statuscode:220})
            // }
            // else {
            //     res.json({error:`Country data Adding Failed...!`, statuscode:423})
            // }
        } catch (error) {
            console.error(error)
        }
    },
    read: async (req, res) => {
        try {
            const Cntry = await CntrymModel.find()
            res.json({message:`All Countries Master data Fetched Successfully.`, statuscode:220, data:Cntry})
        } catch (error) {
            console.error(error)
        }
    },
    retrieve: async (req, res) => {
        // console.log(req.params)
        const cid = req.params.id
        
        try {
            const Cntry = await CntrymModel.findOne({_id:cid})
            res.json({message:`Country Master data Fetched Successfully.`, statuscode:220, data:Cntry})
        } catch (error) {
            console.error(error)
        }
    },
    update: async (req, res) => {
        const cid = req.params.id
        const {cntrycode, cntrynm, cntryinfo} = req.body

        try {
            const Cntry = await CntrymModel.findOneAndUpdate({_id:cid},{cntrycode, cntrynm, cntryinfo})
            if (Cntry) {
                res.json({success:`Country data Updated Successfully.`, statuscode:220})
            }
            else {
                res.json({error:`Country data Update Failed...!`, statuscode:422})
            }
        } catch (error) {
            console.error(error)
        }
    },
    delete: async (req, res) => {
        const cntrid = req.params.id

        try {
            const Cntry = await CntrymModel.findByIdAndDelete(cntrid)
            if (Cntry) {
                res.json({success:`Country: "${Cntry.cntrynm}" Removed Successfully.`, statuscode:220})
            }
            else {
                res.json({error:`Country: "${Cntry.cntrynm}" Removal Failed...!`, statuscode:422})
            }
        } catch (error) {
            console.error(error)
        }
    },
}