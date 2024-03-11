const mongoose = require('mongoose')

const PlnSchema = mongoose.Schema({
    plnnm: {
        type: String,
        required: true
    },
    plninfo: {
        type: String,
        required: true
    },
    plncost: {
        type: String,
        required: true
    },
    plnbg: {
        type: String,
        required: true
    }
}, {
    timestamps: true,
})

module.exports = mongoose.model('Plan', PlnSchema)