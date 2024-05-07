const UsrModel = require('../models/usrModl')
const bcrypt = require('bcrypt')
const SendMailer = require('../middlewares/mailer')

const saltRounds = 9
const salt = bcrypt.genSaltSync(saltRounds)

module.exports = {
    create: async (req, res) => {
        // console.log(req.body)
        const {uname, ueml, upass, uphn, ufname, uaddr, cntry, upin} = req.body
        const hashpass = bcrypt.hashSync(upass, salt)

        try {
            const Usrexst = await UsrModel.findOne({uname})
            if (Usrexst) {
                res.json({error:`Username already Exist...!`, statuscode:422})
            }
            else {
                const Usr = await UsrModel.create({uname, ueml, upass:hashpass, uphn, ufname, uaddr, cntry, upin})
                if (Usr) {
                    res.json({success:`User Registered Successfully.`, statuscode:220})
                }
                else {
                    res.json({error:`User Registration Failed...!`, statuscode:423})
                }
            }
        } catch (error) {
            console.error(error)
        }
    },
    login: async (req, res) => {
        // console.log(req.body)
        const {ukey, upass} = req.body

        try {
            let token
            const Usr = await UsrModel.findOne({$or:[{uname:ukey}, {ueml:ukey}]})
            if (!Usr) {
                res.json({error:`User doesn't Exist...!`, statuscode:422})
            }
            else {
                const Ustat = bcrypt.compareSync(upass, Usr.upass)
                if (Ustat) {
                    token = await Usr.generateToken()
                    req.session.usracc = token
                    res.cookie('jwtoken', token, {
                        expires: new Date(Date.now() + 2592000000),
                        httpOnly: true 
                    })
                    res.json({success:`User Logged In Successfully.`, statuscode:220, token:token, user:req.session.usracc})
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
        const usr = req.usrdtl
        try {
            if (usr) {
                res.json({message:`User Already Logged In.`, statuscode:220, user:usr})
            }
            else {
                res.json({message:`User Not Yet Loged In...!`, statuscode:422})
            }
        } catch (error) {
            console.error(error)
        }
    },
    resetpass: async (req, res) => {
        let otp
        const {uname, ueml} = req.body
        const from_name = 'MSH IT Sol Admin'
        const from_email = 'msh.sun20@gmail.com'
        const cc_email = null
        const bcc_email = 'msh.sun20@outlook.com'

        try {
            const Usr = await UsrModel.findOne({$and:[{uname}, {ueml}]})
            if (Usr) {
                otp = await Usr.generateOtp()
                
                if (otp) {
                    setTimeout(async () => {
                        await UsrModel.updateOne({uname}, {$unset:{randcodes:1}})
                    }, 300000)
                    const mlresult = await SendMailer(from_name, from_email, uname, ueml, cc_email, bcc_email, otp)
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
                res.json({message:`User doesn't Exist ...!`, statuscode:422})
            }
        } catch (error) {
            console.error(error)
        }
    },
    cnfcode: async (req, res) => {
        const {uname, ucnfcode} = req.body

        try {
            const Usr = await UsrModel.findOne({$and:[{uname}, {'randcodes.randcode':ucnfcode}]})

            if (Usr) {
                res.json({success:'Email Id Confirmed successfully', statuscode:220, data:Usr})
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
    read: async (req, res) => {
        try {
            const Usr = await UsrModel.find().populate('cntry')
            res.json({message:`All Users data fetched Successfully.`, statuscode:220, data:Usr})
        } catch (error) {
            console.error(error)
        }
    },
    readOne: async (req, res) => {
        const uid = req.params.id

        try {
            const Usr = await UsrModel.findOne({_id: uid}).populate('cntry')
            res.json({message:`All Users data fetched Successfully.`, statuscode:220, data:Usr})
        } catch (error) {
            console.error(error)
        }
    },
    update: async (req, res) => {},
    chngpass: async (req, res) => {
        const uid = req.params.id
        const {upass} = req.body
        const hashpass = bcrypt.hashSync(upass, salt)
        // console.log(uid)
        // console.log(upass)

        try {
            const Usr = await UsrModel.findOneAndUpdate({_id:uid}, {upass:hashpass}, {new:true})
            if (Usr) {
                res.json({success:'User Password Changed successfully', statuscode:220, data:Usr})
            }
            else {
                res.json({error:`User Password Update failed ...!`, statuscode:422})
            }
        } catch (error) {
            console.error(error)
        }
    },
    delete: async (req, res) => {
        const uid = req.params.id

        try {
            const Usr = await UsrModel.findByIdAndDelete(uid)
            res.json({message:`User: "${Usr.ufname}" Removed Successfully`, statuscode:220})
        } catch (error) {
            console.error(error)
        }
    },
}