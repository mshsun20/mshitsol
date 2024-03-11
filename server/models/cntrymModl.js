const mongoose = require('mongoose')

const CntrymSchema = mongoose.Schema({
    cntrycode: {
        type: String,
    },
    cntrynm: {
        type: String,
        required: true,
        unique: true
    },
    cntryinfo: {
        type: String
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Country', CntrymSchema)