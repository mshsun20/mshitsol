const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')

const AdmSchema = mongoose.Schema({
    admunam: {
        type: String,
        required: true,
        unique: true
    },
    admeml: {
        type: String,
        required: true,
        unique: true
    },
    admpass: {
        type: String,
        required: true
    },
    admphn: {
        type: String,
        required: true
    },
    admfnam: {
        type: String,
    },
    admaddr: {
        type: String,
    },
    cntry: {
        type: mongoose.Types.ObjectId,
        ref: 'Country',
        required: true
    },
    admpin: {
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
    ]
}, {
    timestamps: true
})

AdmSchema.methods.generateToken = async function() {
    try {
        let jwttoken = jwt.sign(
            {
                uid: this._id.toString(),
                unam: this.admunam,
                email: this.admeml,
                phone: this.admphn,
                fnam: this.admfnam,
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

module.exports = mongoose.model('Account', AdmSchema)