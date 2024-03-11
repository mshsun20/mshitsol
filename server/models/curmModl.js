const mongoose = require('mongoose')

const CurmSchema = mongoose.Schema({
    curcode: {
        type: String,
        required: true
    },
    curnm: {
        type: String,
        required: true
    },
    curinfo: {
        type: String,
        required: true
    },
    cursymbl: {
        type: String,
    },
    cntry: {
        type: mongoose.Types.ObjectId,
        ref: 'Country'
    },
    curiso: {
        type: String,
    },
    curaltky: {
        type: String,
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Currency', CurmSchema)