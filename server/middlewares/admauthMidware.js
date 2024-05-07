const AdmModel = require('../models/admModl')
const jwt = require('jsonwebtoken')

const AdmauthMiddleware = async (req, res, next) => {
    // console.log(req.params.tokn)
    const token = req.params.tokn
    try {
        if (token !== undefined && token !== null) {
            // console.log(token)
            const verifytoken = jwt.verify(token, process.env.JWT_SECRET_KEY)
            // console.log(verifytoken)
            const admdtl = await AdmModel.findOne({_id:verifytoken.uid, 'tokens.token': token})
            // console.log(admdtl)

            if (!admdtl) {
                console.error(`Admin Authorizaton Error...!`)
            }

            req.admdtl = admdtl
        }
        else {
            console.error(`No Token Exist...!`)
        }

        next()
    } catch (error) {
        console.error(error)
    }
}

module.exports = AdmauthMiddleware