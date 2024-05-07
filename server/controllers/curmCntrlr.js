const CurmModel = require('../models/curmModl')
const CntrymModel = require('../models/cntrymModl')

module.exports = {
    create: async (req, res) => {
        // console.log(req.body)
        const {curcode, curnm, curinfo, cursymbl, cntry, curiso, curaltky} = req.body

        try {
            const Currexst = await CurmModel.findOne({$and: [{curcode}, {cntry}]})
            if (!Currexst) {
                // const Curr = await CurmModel.create({curcode, curnm, curinfo, cursymbl, 'cntries':cntry, curiso, curaltky})
                const Curr = await CurmModel.create({curcode, curnm, curinfo, cursymbl, cntry, curiso, curaltky})
                if (Curr) {
                    res.json({success:`Currency Added Successfully.`, statuscode:220})
                }
                else {
                    res.json({error:`Currency data Adding Failed...!`, statuscode:422})
                }
            }
            else {
                // const Curm = await Currexst.addCntry(cntry)
                // console.log(Curr)
                // if (Curm) {
                //     res.json({success:`Currency Updated Successfully.`, statuscode:221})
                // }
                // else {
                //     res.json({error:`Currency data Update Failed...!`, statuscode:423})
                // }
                res.json({error:`Currency data Already Exist...!`, statuscode:423})
            }
        } catch (error) {
            console.error(error)
        }
    },
    upload: async (req, res) => {
        // console.log(req.body.exclData)
        const excldta = req.body.exclData

        try {
            excldta.forEach(async (item) => {
                const {currency_code, currency_name, currency_info, currency_symbol, country_name, currency_iso_code, currency_alt_key} = item
                const Cntry = await CntrymModel.findOne({cntrynm:country_name})
                const Currexst = await CurmModel.findOne({curcode:currency_code})
                let Curr

                if (Cntry) {
                    if (!Currexst) {
                        Curr = await CurmModel.create(
                            {
                                curcode:currency_code,
                                curnm:currency_name,
                                curinfo:currency_info,
                                cursymbl:currency_symbol,
                                cntry:Cntry._id,
                                curiso:currency_iso_code,
                                curaltky:currency_alt_key
                            }
                        )
                    }
                    else {
                        Curr = await CurmModel.findOneAndUpdate({curcode:currency_code},
                            {
                                curnm:(currency_name&&currency_name),
                                curinfo:(currency_info&&currency_info),
                                cursymbl:(currency_symbol&&currency_symbol),
                                cntry:(Cntry._id&&Cntry._id),
                                curiso:(currency_iso_code&&currency_iso_code),
                                curaltky:(currency_alt_key&&currency_alt_key)
                            }
                        )
                    }
                }
                else {
                    const Cntrym = await CntrymModel.create({cntrynm:country_name})
                    if (!Currexst) {
                        Curr = await CurmModel.create(
                            {
                                curcode:currency_code,
                                curnm:currency_name,
                                curinfo:currency_info,
                                cursymbl:currency_symbol,
                                cntry:Cntrym._id,
                                curiso:currency_iso_code,
                                curaltky:currency_alt_key
                            }
                        )
                    }
                    else {
                        Curr = await CurmModel.findOneAndUpdate({curcode:currency_code},
                            {
                                curnm:(currency_name&&currency_name),
                                curinfo:(currency_info&&currency_info),
                                cursymbl:(currency_symbol&&currency_symbol),
                                cntry:(Cntrym&&Cntrym._id),
                                curiso:(currency_iso_code&&currency_iso_code),
                                curaltky:(currency_alt_key&&currency_alt_key)
                            }
                        )
                    }
                }
            })
            res.json({message:`Currency data Imported...`, statuscode:220})
        } catch (error) {
            console.error(error)
        }
    },
    read: async (req, res) => {
        try {
            // const Curm = await CurmModel.find().populate('cntries')
            const Curr = await CurmModel.find().populate('cntry')
            res.json({message:`All Currencies Master data Fetched Successfully.`, statuscode:220, data:Curr})
        } catch (error) {
            console.error(error)
        }
    },
    retrieve: async (req, res) => {
        const cid = req.params.id
        
        try {
            const Curr = await CurmModel.findOne({_id:cid}).populate('cntry')
            res.json({message:`Currency Master data Fetched Successfully.`, statuscode:220, data:Curr})
        } catch (error) {
            console.error(error)
        }
    },
    update: async (req, res) => {
        // console.log(req.params.id)
        const cid = req.params.id
        // console.log(req.body)
        const {curcode, curnm, curinfo, cursymbl, cntry, curiso, curaltky} = req.body

        try {
            const Cntry = await CntrymModel.findOne({_id:cntry})
            const Curr = await CurmModel.findOneAndUpdate({_id:cid},{curcode, curnm, curinfo, cursymbl, cntry:Cntry._id, curiso, curaltky})
            if (Curr) {
                res.json({success:`Currency data Updated Successfully.`, statuscode:220})
            }
            else {
                res.json({error:`Currency data Update Failed...!`, statuscode:422})
            }
        } catch (error) {
            console.error(error)
        }
    },
    delete: async (req, res) => {
        const curid = req.params.id

        try {
            const Curr = await CurmModel.findByIdAndDelete(curid).populate('cntry')
            if (Curr) {
                res.json({success:`Currency: "${Curr.curcode}" of "${Curr.cntry.cntrynm}" Removed Successfully.`, statuscode:220})
            }
            else {
                res.json({error:`Currency: "${Curr.curcode}" of "${Curr.cntry.cntrynm}" Removal Failed...!`, statuscode:422})
            }
        } catch (error) {
            console.error(error)
        }
    },
}