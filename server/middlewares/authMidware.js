const UsrModel = require('../models/usrModl')
const jwt = require('jsonwebtoken')

const AuthMiddleware = async (req, res, next) => {
    console.log(req.params.tokn)
    try {
        if (req.params.tokn) {
            const token = req.params.tokn
            console.log(token)
            const verifytoken = jwt.verify(token, process.env.JWT_SECRET_KEY)
            // console.log(verifytoken);
            const usrdtl = await UsrModel.findOne({_id:verifytoken.uid, 'tokens.token': token})
            // console.log(usrdtl);

            if (!usrdtl) {
                console.error(`User Authorizaton Error...!`)
            }

            req.token = token
            req.usrdtl = usrdtl
            req.uid = usrdtl._id
        }
        else {
            console.error(`No Token Exist...!`)
        }

        next()
    } catch (error) {
        console.error(error)
    }
}

module.exports = AuthMiddleware