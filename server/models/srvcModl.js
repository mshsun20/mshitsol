const mongoose = require('mongoose')

const SrvcSchema = mongoose.Schema({
    srvctitl: {
        type: String,
        required: true
    },
    srvcdesc: {
        type: String,
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Service', SrvcSchema)