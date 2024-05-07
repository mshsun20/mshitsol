const mongoose = require('mongoose')

const CurmSchema = mongoose.Schema({
    curcode: {
        type: String,
        required: true
        // unique: true
    },
    curnm: {
        type: String,
        required: true
    },
    curinfo: {
        type: String,
        required: true
    },
    curiso: {
        type: String,
    },
    cursymbl: {
        type: String,
    },
    curaltky: {
        type: String,
    },
    cntry: {
        type: mongoose.Types.ObjectId,
        ref: 'Country'
    }
    // cntries: [
    //     {
    //         type: mongoose.Types.ObjectId,
    //         ref: 'Country'
    //     }
    // ]
}, {
    timestamps: true
})

// CurmSchema.methods.addCntry = async function(cntry) {
//     let flg=0

//     try {
//         for(let i=0; i<this.cntries.length; i++) {
//             if (String(this.cntries[i]._id)!==cntry) {
//                 flg=1
//             }
//         }
//         console.log(flg)
//         if (flg===1) {
//             this.cntries = this.cntries.concat(cntry)
//             const status = await this.save()
//             return status
//         }
//         else {
//             return null
//         }
//     } catch (error) {
//         console.error(error)
//     }
// }

module.exports = mongoose.model('Currency', CurmSchema)