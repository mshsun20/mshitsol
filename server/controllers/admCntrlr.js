const AdmModel = require('../models/admModl')
const jwt = require('jsonwebtoken')

module.exports = {
    create: async (req, res) => {
        // console.log(req.body)
        const {admunam, admeml, admpass, admphn, admfnam, admaddr, cntry, admpin} = req.body

        try {
            const Admexst = await AdmModel.findOne({admunam})
            if (Admexst) {
                res.json({error:`Admin Username already Exist...!`, statuscode:422})
            }
            else {
                const Adm = await AdmModel.create({admunam, admeml, admpass, admphn, admfnam, admaddr, cntry, admpin})
                if (Adm) {
                    res.json({success:`Admin Account created Successfully.`, statuscode:220})
                }
                else {
                    res.json({success:`Admin Account creation Failed...!`, statuscode:423})
                }
            }
        } catch (error) {
            console.error(error)
        }
    },
    login: async (req, res) => {
        const {admunam, admpass} = req.body

        try {
            let token
            const Adm = await AdmModel.findOne({admunam})
            if (!Adm) {
                res.json({error:`Admin Username doesn't Exist...!`, statuscode:422})
            }
            else if (admpass === Adm.admpass) {
                token = await Adm.generateToken()
                // console.log(token)
                req.session.admacc = token
                res.cookie('jwtoken', token, {
                    expires: new Date(Date.now() + 2592000000),
                    httpOnly: true 
                })
                res.json({success:`Admin Logged In Successfully.`, statuscode:220, token:token, admin:req.session.admacc})
            }
            else {
                res.json({error:`Wrong Password Entry...!`, statuscode:423})
            }
        } catch (error) {
            console.error(error)
        }
    },
    sess: async (req, res) => {
        const token = req.params.tokn
        // console.log(token)
        try {
            if (token !== null) {
                const verifytoken = jwt.verify(token, process.env.JWT_SECRET_KEY)
                // console.log(verifytoken)
                const Admdtl = await AdmModel.findOne({_id:verifytoken.uid, 'tokens.token': token})
                // console.log(admdtl)
                if (Admdtl) {
                    res.json({message:`Admin Already Logged In.`, statuscode:220, admin:Admdtl})
                }
                else {
                    res.json({message:`Admin Not Yet Loged In...!`, statuscode:422})
                }
            }
            else {
                res.json({message:`Admin Not Yet Loged In...!`, statuscode:423})
            }
        } catch (error) {
            console.error(error)
        }
    },
    logout: async (req, res) => {
        req.session.destroy((err) => res.redirect('/'))
        res.clearCookie('jwtoken', {path:'/'})
        res.clearCookie('connect.sid', {path:'/'})
    },
    read: async (req, res) => {},
    update: async (req, res) => {},
    delete: async (req, res) => {},
}