const mongoose = require('mongoose')

const FeatrSchema = mongoose.Schema({
    featrnm: {
        type: String,
        required: true
    },
    featrdesc: {
        type: String,
        required: true
    },
    plnid: {
        type: mongoose.Types.ObjectId,
        ref: 'Plan',
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Feature', FeatrSchema)