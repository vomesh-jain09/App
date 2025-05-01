const mongoose=require('mongoose')
const CouponSchema=new mongoose.Schema({
    id:{
        type:Number,
        unique:true
    },
    code:{type:String,require:true},
    saved:{type:Number,require:true},
    isPercentage:{type:Boolean,required:true},
    minAmount:{type:Number,required:true}
},{timestamps:true})
module.exports=mongoose.model('Coupon',CouponSchema);