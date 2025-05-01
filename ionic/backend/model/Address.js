const mongoose = require('mongoose')

const AddressSchema=new mongoose.Schema({
    fullName:{type:String},
    phone:{type:Number},
    house:{type:String},
    street:{type:String},
    city:{type:String},
    state:{type:String},
    pincode:{type:Number},
})
module.exports=mongoose.model('Address',AddressSchema)

