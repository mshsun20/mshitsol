const mongoose = require('mongoose')

const PlnSchema = mongoose.Schema({
    plnnm: {
        type: String,
        required: true,
        unique: true
    },
    plninfo: {
        type: String,
        required: true
    },
    plncost: {
        type: String,
        required: true
    },
    plncurr: {
        type: mongoose.Types.ObjectId,
        ref: 'Currency'
    },
    plnbg: {
        type: String,
        required: true
    }
}, {
    timestamps: true,
})

module.exports = mongoose.model('Plan', PlnSchema)