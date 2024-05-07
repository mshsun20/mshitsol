const AdmModel = require('../models/admModl')
const bcrypt = require('bcrypt')
const SendMailer = require('../middlewares/mailer')

const saltRounds = 9
const salt = bcrypt.genSaltSync(saltRounds)

module.exports = {
    create: async (req, res) => {
        // console.log(req.body)
        const {admunam, admeml, admpass, admphn, admfnam, admaddr, cntry, admpin} = req.body
        const hashpass = bcrypt.hashSync(admpass, salt)

        try {
            const Admexst = await AdmModel.findOne({admunam})
            if (Admexst) {
                res.json({error:`Admin Username already Exist...!`, statuscode:422})
            }
            else {
                const Adm = await AdmModel.create({admunam, admeml, admpass:hashpass, admphn, admfnam, admaddr, cntry, admpin})
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
        const {admkey, admpass} = req.body

        try {
            let token
            const Adm = await AdmModel.findOne({$or:[{admunam:admkey}, {admeml:admkey}]})

            if (!Adm) {
                res.json({error:`Admin Username doesn't Exist...!`, statuscode:422})
            }
            else {
                const Admstat = bcrypt.compareSync(admpass, Adm.admpass)
                if (Admstat) {
                    token = await Adm.generateToken()
                    req.session.admacc = token
                    res.cookie('jwtoken', token, {
                        expires: new Date(Date.now() + 2592000000),
                        httpOnly: true 
                    })
                    res.json({success:`Admin Logged In Successfully.`, statuscode:220, token:token, admin:req.session.admacc})
                }
                else {
                    res.json({error:`Wrong Password ...!`, statuscode:423})
                }
            }
        } catch (error) {
            console.error(error)
        }
    },
    sess: async (req, res) => {
        const adm = req.admdtl
        try {
            if (adm) {
                res.json({message:`Admin Already Logged In.`, statuscode:220, admin:adm})
            }
            else {
                res.json({message:`Admin Not Yet Loged In...!`, statuscode:422})
            }
        } catch (error) {
            console.error(error)
        }
    },
    resetpass: async (req, res) => {
        let otp
        const {admunam, admeml} = req.body
        const from_name = 'MSH IT Sol Admin'
        const from_email = 'msh.sun20@gmail.com'
        const cc_email = null
        const bcc_email = 'msh.sun20@outlook.com'

        try {
            const Adm = await AdmModel.findOne({$and:[{admunam}, {admeml}]})
            if (Adm) {
                otp = await Adm.generateOtp()
                
                if (otp) {
                    setTimeout(async () => {
                        await AdmModel.updateOne({admunam}, {$unset:{randcodes:1}})
                    }, 300000)
                    const mlresult = await SendMailer(from_name, from_email, admunam, admeml, cc_email, bcc_email, otp)
                    if (mlresult) {
                        res.json({message:'Confirmation Code sent successfully', statuscode:220, data:mlresult})
                    }
                    else {
                        res.json({message:'Email sending Failed ...!', statuscode:424})
                    }
                }
                else {
                    res.json({message:`OTP Generation Error ...!`, statuscode:423})
                }
            }
            else {
                res.json({message:`Account doesn't Exist ...!`, statuscode:422})
            }
        } catch (error) {
            console.error(error)
        }
    },
    cnfcode: async (req, res) => {
        const {admunam, admcnfcode} = req.body

        try {
            const Adm = await AdmModel.findOne({$and:[{admunam}, {'randcodes.randcode':admcnfcode}]})

            if (Adm) {
                res.json({success:'Email Id Confirmed successfully', statuscode:220, data:Adm})
            }
            else {
                res.json({error:`Wrong Code given ...!`, statuscode:422})
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
    chngpass: async (req, res) => {
        const admid = req.params.id
        const {admpass} = req.body
        const hashpass = bcrypt.hashSync(admpass, salt)

        try {
            const Adm = await AdmModel.findOneAndUpdate({_id:admid}, {admpass:hashpass}, {new:true})
            if (Adm) {
                res.json({success:'Account Password Changed successfully', statuscode:220, data:Adm})
            }
            else {
                res.json({error:`Account Password Update failed ...!`, statuscode:422})
            }
        } catch (error) {
            console.error(error)
        }
    },
    delete: async (req, res) => {},
}