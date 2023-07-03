const mongoose = require('mongoose')
const Schema = mongoose.Schema;

//upload schema
const businessDistributionSchema = new Schema ({
    title:{
        type: String,
        unique: true
    },
    description:{
        type: String,
    },
    myFile:{
        type: String,
    }
},{timestamps:true})

const businessDistribution = mongoose.model('businessDistribution',businessDistributionSchema)

module.exports =   businessDistribution
