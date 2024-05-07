const UsrModel = require('../models/usrModl')
const jwt = require('jsonwebtoken')

const UsrauthMiddleware = async (req, res, next) => {
    // console.log(req.params.tokn)
    const token = req.params.tokn
    try {
        if (token !== undefined && token !== null) {
            // console.log(token)
            const verifytoken = jwt.verify(token, process.env.JWT_SECRET_KEY)
            // console.log(verifytoken)
            const usrdtl = await UsrModel.findOne({_id:verifytoken.uid, 'tokens.token': token})
            // console.log(usrdtl)

            if (!usrdtl) {
                console.error(`User Authorizaton Error...!`)
            }

            req.usrdtl = usrdtl
        }
        else {
            console.error(`No Token Exist...!`)
        }

        next()
    } catch (error) {
        console.error(error)
    }
}

module.exports = UsrauthMiddleware