const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')

const UsrSchema = mongoose.Schema({
    uname: {
        type: String,
        required: true,
        unique: true
    },
    ueml: {
        type: String,
        required: true,
        unique: true
    },
    upass: {
        type: String,
        required: true
    },
    uphn: {
        type: String,
        required: true
    },
    ufname: {
        type: String,
        required: true
    },
    uaddr: {
        type: String
    },
    cntry: {
        type: mongoose.Types.ObjectId,
        ref: 'Country'
    },
    upin: {
        type: String
    },
    tokens: [
        {
            token: {
                type: String,
                required: true
            },
            createdOn: {
                type: Date,
                default: new Date()
            }
        }
    ],
    randcodes: [
        {
            randcode: {
                type: Number,
                required: true
            },
            createdOn: {
                type: Date,
                default: new Date()
            }
        }
    ]
}, {
    timestamps: true
})

// creation of JSON Web Token
UsrSchema.methods.generateToken = async function() {
    try {
        let jwttoken = jwt.sign(
            {
                uid: this._id.toString(),
                unam: this.uname,
                email: this.ueml,
                phone: this.uphn,
                fnam: this.ufname,
            },
            process.env.JWT_SECRET_KEY,
            {
                expiresIn: '30d'
            }
        )
        this.tokens = this.tokens.concat({token:jwttoken})
        await this.save()
        return jwttoken
    } catch (error) {
        console.error(error)
    }
}

// creation of OTP for Password Reset
UsrSchema.methods.generateOtp = async function() {
    try {
        let rndcode = Math.round(Math.random()*1000000)
        this.randcodes = this.randcodes.concat({randcode:rndcode})
        await this.save()
        return rndcode
    } catch (error) {
        console.error(error)
    }
}

// Model creation
module.exports = mongoose.model('User', UsrSchema)